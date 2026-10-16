# Exporting generated images

Export the completed PNG without running the model again. Transparency and the original PNG bytes are preserved.

```csharp
// artifact is the PngArtifact returned by ImageGenerationQueue.GenerateAsync.
string directory = ForgeExportPaths.DirectoryFor(ForgeExportLocation.BesideGame);
string png = await PngExporter.ExportPngAsync(artifact, directory, "my-sword.png", cancellationToken);

// A bundle contains image.png and recipe.json, committed together.
PngExportBundle bundle = await PngExporter.ExportBundleAsync(artifact, directory, "my-sword", cancellationToken);
```

Call `ForgeExportPaths.DirectoryFor` on Unity's main thread. Pass an absolute directory directly to `PngExporter` to use your game's own export location. `BesideGame` writes to `Exports` next to the executable; `SavedData` uses `Exports` inside `Application.persistentDataPath`. An installation in a protected directory may not allow writing beside the game. Offer the player the saved-data location or a folder picker in that case.

The standalone PNG API refuses to overwrite an existing file. Bundle names include the request and PNG digests; repeating the same export returns the existing matching bundle. A changed existing bundle is kept and the operation fails. Directory separators, reserved filenames and symbolic-link export paths are refused.

The recipe records the model revision, backend version, style version, seed, prompts, dimensions, steps, guidance, cache key and PNG SHA-256. Share the PNG as an image or share the bundle for its generation settings. A recipe is descriptive metadata; it does not give a recipient model weights, an executable, a 3D mesh or exact cross-hardware reproduction. Generated images can differ across backend versions and devices.

Respect the selected model's output terms when distributing images. Exporting creates local files; it does not upload them or send them to another player.
