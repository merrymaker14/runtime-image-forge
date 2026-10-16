# Inicio rápido

Usa Unity 6000.5 o posterior. El motor nativo incluido admite Windows x64 y una GPU compatible con Vulkan; el recorte usa GPU Compute. Unity Inference Engine 2.6.1 se instala como dependencia. MCP es opcional.

El motor se ejecuta como una DLL nativa dentro del proceso de Unity Editor o Windows Player. Runtime Image Forge verifica las bibliotecas locales con sus SHA-256 fijados antes de cargarlas. La generación de imágenes no requiere un servidor separado, un puerto de escucha ni una clave API.

Las bibliotecas nativas requieren Microsoft Visual C++ 2015–2022 Redistributable (x64), que la mayoría de los PC con Windows ya tienen. Si falta o está desactualizado, la preparación informa de una dependencia nativa ausente (con **Calentar al preparar** desactivado, lo informa el primer pedido); instala la versión más reciente desde Microsoft y reinicia Unity o el juego.

## Instalar e importar ejemplos

1. Tras la compra, instala Runtime Image Forge desde **Package Manager > My Assets**; se instala como paquete. Una copia local `.tgz` se puede añadir con **Install package from tarball**.
2. Abre **Samples** del paquete e importa **Models and choice styles**. Incluye los perfiles Bonsai Ternary 4B y FLUX.2 Klein 4B, un perfil de recorte, cinco estilos Native1024 en `Styles/NativeDistilled1024` y los presets anteriores editables.
3. Abre **Tools > Runtime Image Forge > Overview**. Fuera del modo Play, elige **Instalar el motor para Windows**. Se copian el archivo de DLL nativas y sus avisos a StreamingAssets; estos archivos se incluyen en las compilaciones de Windows.

Los pesos se obtienen por separado. Bonsai Ternary 4B requiere un paquete plano convertido compatible con 4.642.526.382 bytes de pesos fijados (4,64 GB / 4,32 GiB). FLUX.2 Klein 4B contiene 5.207.178.964 bytes fijados (5,21 GB / 4,85 GiB), disponibles mediante descarga HTTPS explícita o importación local. El motor, los avisos, la sobrecarga del archivo comprimido y las copias temporales requieren espacio adicional. Lee [Modelos y estilos](Models-and-styles.md) y las condiciones del perfil antes de usar o redistribuirlo.

Descarga gratis el paquete de modelos Bonsai desde la [página de The Ember Forge en itch.io](https://merrymaker14.itch.io/the-ember-forge): elige **Runtime-Image-Forge-Bonsai-Models.zip**. Solo contiene los tres archivos de pesos con sus avisos e instrucciones, sin ningún ejecutable. Extráelo y conserva intacta su carpeta `RuntimeImageForgeModels`.

Antes de distribuir el juego, revisa **Todos los pesos del modelo** en el Inspector. Muestra a los jugadores el tamaño completo de la primera descarga antes de iniciarla. Los archivos del motor y el espacio temporal son adicionales; el tamaño de los pesos no indica los requisitos de RAM o VRAM.

## Configurar la escena

Crea un objeto y añade `LocalForgeBackendSource` y `ForgeGenerator`.

- En el backend local, elige el recurso importado `BonsaiTernary4B` o `FLUX2Klein4B` en **Perfil del modelo**.
- Asigna U2NETP a **Máscara del primer plano**. Su referencia ONNX apunta al modelo incluido.
- Mantén **Dispositivo Vulkan** en `auto` para seleccionar una GPU local adecuada.
- Asigna esa fuente a **Fuente del motor** del generador. Mantén **Calentar al preparar** activo para preparar una vez sin guardar la imagen de calentamiento.
- Para la primera imagen, elige `Styles/NativeDistilled1024/IllustratedForgeNative1024`: 1024 × 1024, 4 pasos, CFG 1. Las claves son `item`, `material` y `detail`. Elegir un perfil no cambia los ajustes del estilo.

Antes de preparar, abre el perfil elegido. Para Bonsai, usa **Importar archivos de modelo verificados** y selecciona el paquete plano convertido. Para Klein, elige **Descargar archivos del modelo y verificarlos**, o importa los tres archivos fijados de una carpeta local. Ambas acciones muestran progreso y permiten cancelar. El perfil verificado en caché puede prepararse sin conexión. Cambia perfiles en Edit Mode después de terminar el trabajo y cerrar los generadores preparados.

**Crear perfil de modelo**, **Crear perfil de recorte** y **Crear estilo con opciones** en Overview crean y seleccionan recursos en la carpeta Assets elegida, con nombres únicos. El perfil de recorte recibe automáticamente el ONNX incluido. Los estilos nuevos incluyen opciones editables de objeto, material y detalle. **Estilo existente > Editar el estilo seleccionado** abre un catálogo guardado. También puedes crear desde **Assets > Create > Runtime Image Forge**; asigna manualmente el ONNX a un perfil de recorte creado desde ese menú.

## Juego incluido

El paquete incluye **The Ember Forge**, una escena completa editable con código del juego, arte del taller y música propia. Los archivos de Samples se descargan junto al paquete y solo se copian a Assets al importarlos. Importa **The Ember Forge** desde **Samples** y elige **Tools > Runtime Image Forge > Open The Ember Forge sample**. El menú añade TMP Essentials si el proyecto no tiene recursos TMP, abre la escena e instala las DLL nativas de Windows y sus avisos. Conserva los TMP Settings existentes. Una instalación parcial de TMP debe repararse antes de abrir el ejemplo; sus recursos se conservan. La escena utiliza el renderizado y el sistema de entrada activo del proyecto. El ejemplo ya tiene asignados `BonsaiTernary4B` e `IllustratedForgeNative1024`: 1024 × 1024, 4 pasos y CFG 1. Para usar Klein, selecciona `FLUX2Klein4B` en el backend local antes de Play; elegir el perfil conserva los ajustes del estilo. En el juego, usa **IMPORT MODEL PACK** para Bonsai o la descarga explícita del modelo para Klein.

Mantén una sola versión importada del ejemplo. Haz copia de los archivos modificados antes de sustituir una versión anterior. El README explica el contenido y el primer arranque. La distribución independiente para Windows funciona sin Unity ni este paquete.

Para el ejemplo en el Editor, coloca la carpeta extraída `RuntimeImageForgeModels` junto a la carpeta `Assets` del proyecto, entra en Play Mode y pulsa **IMPORT MODEL PACK**. La importación copia y verifica los archivos una vez.

## Primera descarga y pedido

Para un perfil HTTPS como Klein, conecta el botón de descarga a una llamada explícita a `localSource.DownloadModelAsync(progress, token)`. Para un perfil de solo importación como Bonsai, llama explícitamente a `localSource.ImportModelPackAsync(selectedFolder, progress, token)`. Muestra el volumen completo, progreso, cancelación y errores antes de obtener los archivos. Espera a que el jugador elija esta acción.

Si `HasLocalModel` es true, pasa a preparación. Elige primero PNG transparente o con fondo y llama a `generator.PrepareAsync(style, backgroundMode, token)`. Comprueba el archivo local, carga el contexto nativo del modelo y calienta la ruta elegida sin guardar una imagen. El PNG con fondo omite el calentamiento del recorte. Espera a `generator.IsReady` antes de aceptar pedidos.

```csharp
var choices = new Dictionary<string, string>
{
    ["item"] = "sword",
    ["material"] = "steel",
    ["detail"] = "runes"
};
var backgroundMode = ForgeBackgroundMode.Transparent; // Use KeepBackground to skip cutout.
await generator.PrepareAsync(style, backgroundMode, token);
var job = generator.Generate(style, choices, 1234, backgroundMode, token);
await job.Completion;
if (job.State != "completed")
    throw new InvalidOperationException(job.Error ?? job.State);
var artifact = await generator.ReadArtifactAsync(job.Request, token);
var ownedImage = await UnityPngImage.CreateAsync(artifact, cancellationToken: token);
inventoryImage.sprite = ownedImage.Sprite;
```

Este fragmento utiliza `System`, `System.Collections.Generic` y `StrangeEuphoriaXR.RuntimeImageForge`. `generator`, `style` e `inventoryImage` son tus componentes y recursos asignados. Conserva `ownedImage` mientras la interfaz utiliza su sprite; libéralo al sustituir la imagen o cerrar la vista. La [API](API.md) explica el ciclo de vida y los errores.

Exporta un trabajo terminado con `generator.ExportJobAsync(...)` o un `PngArtifact` existente con `PngExporter`. Exportar guarda la imagen sin ejecutar de nuevo el modelo.

## Compilar un juego

Compila un Player Windows x64 con la escena configurada. Conserva los archivos y avisos de `StreamingAssets/RuntimeImageForge`. Para Bonsai, proporciona una carpeta plana compatible `RuntimeImageForgeModels` junto al juego y una acción de importación local; para Klein, descarga HTTPS explícita o importación local. La caché verificada admite siguientes arranques sin conexión. Conserva LICENSE/NOTICE y avisos de conversión al redistribuir el paquete. Guarda receta, hash y PNG juntos al restaurar objetos generados.

Los inspectores y MCP opcional no se incluyen en el Player. El juego público no necesita servidor MCP. Consulta [Solución de problemas](Troubleshooting.md) para reparación y cancelación.
