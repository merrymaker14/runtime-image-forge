# Exportar imágenes generadas

Exporta el PNG terminado sin ejecutar otra vez el modelo. Se conservan la transparencia y los bytes originales.

```csharp
// artifact is the PngArtifact returned by ImageGenerationQueue.GenerateAsync.
string directory = ForgeExportPaths.DirectoryFor(ForgeExportLocation.BesideGame);
string png = await PngExporter.ExportPngAsync(artifact, directory, "my-sword.png", cancellationToken);

// A bundle contains image.png and recipe.json, committed together.
PngExportBundle bundle = await PngExporter.ExportBundleAsync(artifact, directory, "my-sword", cancellationToken);
```

Llama a `ForgeExportPaths.DirectoryFor` en el hilo principal de Unity. Pasa una carpeta absoluta a `PngExporter` para usar tu ubicación. `BesideGame` escribe en `Exports` junto al ejecutable; `SavedData`, en `Exports` dentro de `Application.persistentDataPath`. Una instalación protegida puede impedir escribir junto al juego: ofrece datos guardados o un selector de carpeta.

La API de PNG independiente no sobrescribe un archivo existente. Los nombres de los paquetes incluyen hashes de solicitud y PNG; repetir la misma exportación devuelve el paquete existente coincidente. Un paquete modificado se conserva y la operación falla. Se rechazan separadores de ruta, nombres reservados y rutas con enlaces simbólicos.

La receta registra revisión del modelo, versión del motor y estilo, semilla, prompts, dimensiones, pasos, guía, clave de caché y SHA-256 del PNG. Comparte el PNG como imagen o el paquete para incluir sus ajustes. La receta es metadato descriptivo: no entrega pesos, ejecutable, malla 3D ni reproducción exacta entre equipos. Las imágenes pueden variar entre dispositivos y versiones.

Respeta las condiciones de salida del modelo al distribuir imágenes. Exportar crea archivos locales; no los sube ni los envía a otro jugador.
