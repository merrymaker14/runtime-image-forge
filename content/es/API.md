# API de Runtime Image Forge

Espacio de nombres: `StrangeEuphoriaXR.RuntimeImageForge`.

| Tipo | Función |
| --- | --- |
| `GenerationIdentity` | Receta exacta del motor, modelo y componentes. |
| `GenerationRequest` | Ajustes aplicados inmutables y clave de caché. |
| `ChoiceStyle` | Copia del catálogo y expansión de opciones en una plantilla validada. |
| `ForgeStyleAsset` | Catálogo y ajustes de generación editables en el Inspector. |
| `ForgeBackgroundMode` | Modo del estilo, PNG transparente o PNG con fondo para un pedido. |
| `IImageGenerationBackend` | Contrato de generación en un hilo de trabajo. |
| `ForgeBackendSource` | Componente que crea un motor configurado. |
| `ForgeGenerator` | Preparación, trabajos, estado, cancelación y exportación por escena. |
| `ForgeGenerationJob` | Solicitud, estado, progreso, finalización e identidad del PNG. |
| `LocalForgeBackendSource` | Descarga del modelo fijado y configuración del motor Windows. |
| `ForgeModelProfile` | URL, revisión, hash, tamaño y política de muestreo del modelo. |
| `ForegroundModelProfile` | Modelo ONNX importado y políticas de entrada y salida. |
| `IImageBackendPreparation` | Validación opcional antes de aceptar solicitudes. |
| `ForgeModelIntegrityException` | Modelo ausente, incompleto o con hash incorrecto. |
| `ProcessedImageBackend` | Generación serial seguida de recorte opcional. |
| `RawImageFrame` | Copia y propiedad de píxeles RGB/RGBA, origen y paso de fila. |
| `ImageGenerationQueue` | FIFO acotada, cancelación, caché y propiedad del motor. |
| `GenerationProgress` | Etapa y progreso fraccional limitado. |
| `PngArtifact` | PNG inmutable, solicitud, SHA-256 e indicador de caché. |
| `PngFileStore` | Caché atómica en disco con claves y PNG validados. |
| `UnityPngEncoder` | RGB/RGBA a PNG RGBA8 con etiqueta sRGB. |
| `UnityPngImage` | Propietario de una textura y un sprite en ejecución. |
| `PngExporter` | Exportación atómica de PNG o PNG/receta sin sobrescribir archivos ajenos. |
| `ForgeExportPaths` | Carpetas junto al juego y en datos persistentes. |

## Tamaño de descarga del modelo

El Inspector muestra la descarga completa de los pesos fijados. `ForgeModelProfile.GetTotalDownloadBytes()` valida el perfil y suma todos los archivos obligatorios, incluido el codificador de texto y el decodificador en un perfil por componentes. Devuelve el total de la primera descarga aunque algunos archivos estén en caché; el descargador reutiliza los archivos verificados. Excluye los archivos del motor y el espacio temporal de descarga. GB usa unidades decimales: 1 GB = 1.000.000.000 bytes.

## Generador de escena

Llama a estas API en el hilo principal de Unity. Asigna la fuente y los perfiles en el Inspector. La descarga es una acción explícita del juego, separada de la preparación.

`ConnectBackend` inicializa la caché en disco antes de crear la cola y transfiere al generador la propiedad del backend. Al cerrar su escena o destruir el generador, se cancelan los trabajos y se cierra el backend después de vaciar la cola, incluso si el objeto aún no se había activado. Un fallo de integridad del modelo anula el estado preparado, cierra la cola anterior y activa `LocalForgeBackendSource.NeedsModelRepair`. Antes de preparar de nuevo, repara explícitamente el perfil elegido descargando sus archivos HTTPS fijados o reimportando un paquete local verificado; los perfiles de solo importación requieren importación local.

`PngFileStore` coordina las escrituras entre distintas instancias y procesos. Acepta un PNG idéntico para la misma solicitud sin reemplazar el archivo. Si la misma clave ya tiene un PNG válido con otro hash de contenido, conserva el archivo anterior y rechaza la nueva escritura; usa otra seed para obtener un resultado nuevo. Puede reparar un PNG corrupto. Los pequeños archivos `.lock` permanecen junto a la caché para coordinar las escrituras; no los elimines mientras un generador esté activo.

```csharp
await localSource.DownloadModelAsync(downloadProgress, cancellationToken);
var mode = ForgeBackgroundMode.Transparent; // Or KeepBackground; both produce PNG.
await generator.PrepareAsync(style, mode, cancellationToken);
var job = generator.Generate(style, choices, seed: 1234, backgroundMode: mode, token: cancellationToken);
await job.Completion;
if (job.State == "completed")
{
    var artifact = await generator.ReadArtifactAsync(job.Request, cancellationToken);
    var image = await UnityPngImage.CreateAsync(artifact, cancellationToken: cancellationToken);
    // Retain image while displaying image.Sprite; dispose it when replacing the icon.
    var bundle = await generator.ExportJobAsync(job.Id,
        ForgeExportPaths.DirectoryFor(ForgeExportLocation.BesideGame), "sword", cancellationToken);
}
```

`ForgeGenerationJob.Completion` termina al llegar a `completed`, `cancelled` o `failed`; comprueba `State` y `Error`. `CancelJob(id)` cancela un trabajo pendiente y `CancelPreparation()` detiene el arranque. El generador posee su cola y la cierra al descargar la escena. Conserva hasta 64 registros; los PNG permanecen en disco.

`ForgeBackgroundMode.StyleDefault` utiliza `style.keepBackground`. `Transparent` requiere un procesador de primer plano; `KeepBackground` lo omite. Pasa el modo tanto a preparación como a generación para calentar solo la ruta elegida. Cambiar a transparente después de preparar con fondo incluye el coste del primer uso del procesador en ese pedido. No cambia el recurso de estilo compartido. El modo forma parte de solicitud, caché, registro guardado y receta exportada. El motor nativo incluido rechaza un pedido transparente sin procesador.

Si `HasLocalModel` es true, omite la descarga y prepara la copia local. La preparación comprueba SHA-256. `ForgeModelIntegrityException` marca la fuente para reparación; una descarga explícita correcta borra esa marca. Las descargas notifican progreso fraccional mediante `IProgress<float>`.

## Generar un icono

Crea la cola una vez para un motor configurado y consérvala durante la vida de ese modelo:

```csharp
using System.Collections.Generic;
using System.IO;
using StrangeEuphoriaXR.RuntimeImageForge;
using UnityEngine;

// localSource is a LocalForgeBackendSource with a verified model; style is a configured asset.
await localSource.PrepareNativeAsync(cancellationToken);
var backend = localSource.CreateBackend();
var store = new PngFileStore(Path.Combine(Application.persistentDataPath, "GeneratedArt"));
var queue = new ImageGenerationQueue(backend, new UnityPngEncoder(), store);
var choices = new Dictionary<string, string>
{
    ["item"] = "sword",
    ["material"] = "steel",
    ["detail"] = "runes"
};
var request = style.CreateRequest(queue.Identity, choices, seed: 1234);
var artifact = await queue.GenerateAsync(request, cancellationToken: cancellationToken);
var image = await UnityPngImage.CreateAsync(artifact, cancellationToken: cancellationToken);
inventorySlot.sprite = image.Sprite;
// Retain image while the slot uses it. DisposeAsync releases its sprite and texture.
```

Libera la cola mediante `await queue.CloseAsync()` al descargar el modelo. Cada `UnityPngImage` tiene una vida independiente: cerrar la cola no destruye las imágenes ya mostradas. `store.GetPath(request.CacheKey)` devuelve la ruta del PNG si la caché está activada.

Las claves del ejemplo pertenecen al estilo del taller. Otros juegos definen su propio catálogo. Una semilla registra una receta reproducible; cambiar modelo, motor o hardware puede cambiar los píxeles.

## Implementar un motor

Mantén una `GenerationIdentity` estable mientras exista la cola. `ComponentsSha256` es un hash hexadecimal de 64 caracteres de la receta completa del modelo y sus componentes. Incluye codificador de texto, decodificador y configuración de adaptadores. Rechaza dimensiones o ajustes incompatibles en lugar de modificar silenciosamente la solicitud registrada.

La cola invoca `GenerateAsync` en serie en un hilo de trabajo. Devuelve un `RawImageFrame` con las dimensiones exactas solicitadas. El constructor copia el búfer: después puede liberarlo el asignador nativo que lo posee. No devuelvas memoria prestada ni crees objetos UnityEngine desde este método.

Notifica el progreso mediante el `IProgress<GenerationProgress>` recibido; no conserves el observador después de terminar. Respeta la cancelación durante la inferencia y el posprocesado y libera recursos nativos en `Dispose()`. La cola llama a `Dispose` después de acabar la última operación nativa.

`QueueCapacityException` es un rechazo síncrono cuando no queda capacidad. Un fallo del motor termina la Task de ese trabajo con error. La cancelación cancela la Task e impide publicar el resultado. Gestiona estos casos sin sustituir la imagen correcta anterior.

## Partidas guardadas

Guarda la receta completa de `GenerationRequest`, su clave de caché, el PNG y su hash. `ForgeWorkshop.Receipt` muestra un registro compatible con JSON y comprueba que los ajustes restaurados generan la clave guardada. Son identificadores deterministas de contenido, no firmas de autenticación. Un registro modificado se rechaza en lugar de asociarlo a otro PNG.

El taller guarda el inventario antes de añadir el icono a la colección visible. Durante esa escritura desactiva Cancel. Un pedido fallido o cancelado no añade objetos. Conserva el inventario dañado y bloquea nuevas escrituras para protegerlo. Los registros incluyen el modo de fondo: un retrato con Keep Background restaura la imagen completa original.
