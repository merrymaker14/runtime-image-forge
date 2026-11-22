# Inicio rápido

Runtime Image Forge requiere Unity 6000.5 o posterior, Windows x64, una GPU compatible con Vulkan y Microsoft Visual C++ 2015–2022 Redistributable (x64). El modelo de generación de imágenes se ejecuta dentro de Unity Editor o de tu juego para Windows; no necesita servidor, puerto de escucha ni clave API.

## 1. Importa el paquete

Abre **Package Manager > My Assets**, descarga Runtime Image Forge e impórtalo. Los archivos se colocan en `Assets/StrangeEuphoriaXR/RuntimeImageForge`, y Unity añade como dependencias los paquetes Unity Inference Engine 2.6.1 y Unity uGUI 2.5.0. La ventana **Overview** se abre una vez después de la importación; puedes volver a abrirla desde **Tools > Runtime Image Forge > Overview**.

## 2. Prueba The Ember Forge

The Ember Forge es un juego de creación de objetos completo y editable, ubicado en `Samples/The Ember Forge`. Muestra todo el ciclo: elegir un objeto, generar su imagen, guardarla en una colección y exportarla como PNG.

1. Elige **Tools > Runtime Image Forge > Open The Ember Forge sample** (o **Abrir el ejemplo The Ember Forge** en Overview). El comando instala el motor para Windows con sus avisos de licencia en `Assets/StreamingAssets/RuntimeImageForge`, importa TMP Essential Resources si el proyecto no tiene TMP Settings y abre la escena. Los TMP Settings que ya existan se conservan, y el archivo comprimido del motor de otra versión del paquete se reemplaza.
2. Entra en el modo Play y elige **DOWNLOAD MODEL**. El ejemplo usa FLUX.2 Klein 4B: tres archivos fijados, 5.207.178.964 bytes en total (5,21 GB), que se descargan de Hugging Face por HTTPS y se verifican con SHA-256. Se muestra el progreso, y **CANCEL ORDER** detiene la descarga. Los archivos se guardan en caché en `Application.persistentDataPath/RuntimeImageForge`, así que los siguientes inicios funcionan sin conexión.
3. Elige un objeto, un material y un detalle, y luego **FORGE MY ITEM**. En la RTX 3060 Laptop GPU con 6 GB de VRAM en la que se hizo la prueba, una imagen de 1024 × 1024 tarda unos 17 segundos, incluida la eliminación del fondo. Los tiempos dependen de la GPU, del controlador y de otros trabajos que use la GPU.
4. Selecciona un objeto de la colección y usa los controles de exportación para guardar su PNG y su receta.

Para obtener iconos PNG transparentes, elige **Tools > Runtime Image Forge > Install Foreground Model** antes de entrar en el modo Play. El comando descarga el modelo de recorte U²-Netp (4,6 MB) con su licencia desde la versión pública de rembg en GitHub, los coloca en `Assets/RuntimeImageForge/ForegroundModel` y asigna el modelo al perfil de recorte del ejemplo. Sin él, el ejemplo solo ofrece PNG con fondo.

## 3. Añade un generador a tu escena

1. Crea un objeto en la escena y añade `LocalForgeBackendSource` y `ForgeGenerator`.
2. En **Perfil del modelo** de la fuente local, selecciona `Samples/The Ember Forge/Profiles/FLUX2Klein4B`. **Crear perfil de modelo** en Overview crea en la carpeta seleccionada un perfil nuevo con los mismos ajustes de FLUX.2 Klein 4B.
3. Para PNG transparentes, asigna `Samples/The Ember Forge/Profiles/U2NetPForeground` a **Máscara del primer plano** e instala el modelo de recorte como se describe arriba.
4. Deja **Dispositivo Vulkan** en `auto` para seleccionar una GPU adecuada.
5. Asigna la fuente a **Fuente del motor** del generador. Mantén activado **Calentar al preparar**: así la preparación ejecuta una generación de calentamiento sin guardar su imagen.
6. Elige un estilo de `Samples/The Ember Forge/Styles`, por ejemplo `IllustratedForgeNative1024` (1024 × 1024, 4 pasos, CFG 1, claves de opción `item`, `material` y `detail`), o crea uno propio con **Crear estilo con opciones** en Overview.

Antes de editar un perfil o un estilo, cópialo a tu propia carpeta (selecciónalo, pulsa Ctrl+D y mueve la copia). Las actualizaciones del paquete reemplazan los archivos de `Assets/StrangeEuphoriaXR/RuntimeImageForge`.

En el Editor, el Inspector del perfil de modelo ofrece **Descargar archivos del modelo y verificarlos**, con progreso y cancelación, para que puedas llenar la caché antes de entrar en el modo Play.

## 4. Primera descarga y primera imagen

Inicia una descarga solo después de que el jugador la acepte. Muestra primero el tamaño completo: `profile.GetTotalDownloadBytes()` devuelve el total de los pesos fijados. Omite la descarga si `localSource.HasLocalModel` ya es true.

```csharp
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StrangeEuphoriaXR.RuntimeImageForge;
using UnityEngine;
using UnityEngine.UI;

public sealed class FirstImage : MonoBehaviour
{
    [SerializeField] private LocalForgeBackendSource localSource;
    [SerializeField] private ForgeGenerator generator;
    [SerializeField] private ForgeStyleAsset style;
    [SerializeField] private Image inventoryImage;
    private UnityPngImage ownedImage;

    // Call this from your button after the player has seen the download size.
    public async Task ForgeAsync(CancellationToken token)
    {
        if (!localSource.HasLocalModel)
            await localSource.DownloadModelAsync(new Progress<float>(p => Debug.Log($"Download {p:P0}")), token);

        var backgroundMode = ForgeBackgroundMode.Transparent; // Use KeepBackground to skip the cutout.
        await generator.PrepareAsync(style, backgroundMode, token);

        var choices = new Dictionary<string, string> { ["item"] = "sword", ["material"] = "steel", ["detail"] = "runes" };
        var job = generator.Generate(style, choices, 1234, backgroundMode, token);
        await job.Completion;
        if (job.State != "completed") throw new InvalidOperationException(job.Error ?? job.State);

        var artifact = await generator.ReadArtifactAsync(job.Request, token);
        ownedImage?.Dispose();
        ownedImage = await UnityPngImage.CreateAsync(artifact, cancellationToken: token);
        inventoryImage.sprite = ownedImage.Sprite;
    }

    private void OnDestroy() => ownedImage?.Dispose();
}
```

`PrepareAsync` verifica los archivos en caché, carga el modelo y calienta la ruta seleccionada. Espera a que termine antes de aceptar pedidos. Conserva `ownedImage` mientras la interfaz muestre su sprite y libéralo cuando sustituyas la imagen. La guía [API de ejecución](API.md) explica los estados de los trabajos, la cancelación y el ciclo de vida de las imágenes.

Exporta un trabajo completado con `generator.ExportJobAsync(...)`, o un `PngArtifact` existente con `PngExporter`. La exportación copia los píxeles terminados y no vuelve a ejecutar el modelo. Consulta [Guardar y exportar](Exporting-images.md).

## 5. Compila un juego

Compila un Player de Windows x64 con tu escena. Conserva los archivos que el instalador del motor colocó en `Assets/StreamingAssets/RuntimeImageForge`, incluidos los avisos de licencia. Tu juego debe ofrecer una descarga explícita del modelo (o una importación local de sus archivos) antes de la primera generación; después, los archivos verificados se reutilizan sin conexión. Conserva los avisos de licencia del modelo cuando distribuyas sus archivos con tu juego.

Las ventanas del Editor y las herramientas MCP opcionales son exclusivas del Editor y no se incluyen en las compilaciones del Player. Consulta [Solución de problemas](Troubleshooting.md) si tienes problemas de descarga, preparación o cancelación.
