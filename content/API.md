# Runtime Image Forge API

Namespace: `StrangeEuphoriaXR.RuntimeImageForge`.

| Type | Purpose |
| --- | --- |
| `GenerationIdentity` | Declares the exact backend/model/component recipe. |
| `GenerationRequest` | Immutable applied settings and cache key. |
| `ChoiceStyle` | Copies a catalog and expands selected values into a validated template. |
| `ForgeStyleAsset` | Inspector-editable choice catalog and generation settings. |
| `ForgeBackgroundMode` | Style default, transparent PNG, or PNG with background for one order. |
| `IImageGenerationBackend` | Worker-thread image generation contract. |
| `ForgeBackendSource` | Game component that creates a configured backend. |
| `ForgeGenerator` | Scene-owned preparation, jobs, status, cancellation and export. |
| `ForgeGenerationJob` | Retained request, state, progress, completion and PNG identity. |
| `LocalForgeBackendSource` | Pinned model download and Windows native backend setup. |
| `ForgeModelProfile` | Diffusion file URL, revision, hash, length and sampling policy. |
| `ForegroundModelProfile` | Imported ONNX model, preprocessing and output policy. |
| `IImageBackendPreparation` | Optional validation before accepting requests. |
| `ForgeModelIntegrityException` | Missing, incomplete or hash-invalid model. |
| `ProcessedImageBackend` | Serial generation followed by optional foreground processing. |
| `RawImageFrame` | Copies and owns RGB/RGBA pixels, including origin and row stride. |
| `ImageGenerationQueue` | Bounded FIFO, cancellation, cache and backend ownership. |
| `GenerationProgress` | Stage and clamped fractional progress. |
| `PngArtifact` | Immutable PNG, applied request, content SHA-256 and cache indicator. |
| `PngFileStore` | Atomic disk cache with validated keys and PNG structure. |
| `UnityPngEncoder` | RGB/RGBA to sRGB-tagged RGBA8 PNG. |
| `UnityPngImage` | Owns one runtime texture and sprite. |
| `PngExporter` | Atomic PNG or PNG/recipe bundle export without overwriting unrelated files. |
| `ForgeExportPaths` | Beside-game and persistent-data export directories. |

## Model download size

The model Inspector displays the full pinned weight download. `ForgeModelProfile.GetTotalDownloadBytes()` validates the profile and adds every required model file, including the text encoder and decoder for a component profile. It returns the complete first-download payload even when some files are already cached; verified cached files are reused by the downloader. This figure excludes engine files and temporary download space. GB uses decimal units: 1 GB = 1,000,000,000 bytes.

## Scene generator

Call these APIs on Unity's main thread. Assign a source and profiles in the Inspector; download is an explicit game action, separate from preparation.

A custom `ConnectBackend` initializes the disk cache before creating its queue and takes ownership of the backend. Unloading or destroying the generator cancels its jobs and closes the backend after the queue drains, including an object that has not yet become active. If a request detects a model integrity failure, readiness is cleared, the old queue closes and `LocalForgeBackendSource.NeedsModelRepair` becomes true. Before preparing again, explicitly repair the selected profile by downloading its pinned HTTPS files or reimporting a verified local pack; import-only profiles require local import.

`PngFileStore` coordinates commits from separate stores and processes. An identical PNG for the same request is accepted without replacing the existing file. A valid PNG with a different content hash for the same key is kept and the new commit is rejected; use a different seed for a new result. A corrupt cached PNG can be repaired. Small `.lock` files remain beside cache entries to coordinate commits; do not delete them while a generator is active.

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

`ForgeGenerationJob.Completion` finishes when the job reaches `completed`, `cancelled` or `failed`; inspect `State` and `Error` for the outcome. `CancelJob(id)` cancels an unfinished job. `CancelPreparation()` stops startup work. The generator owns its queue and closes it when the scene unloads. It retains up to 64 job records; PNGs live on disk.

`ForgeBackgroundMode.StyleDefault` uses `style.keepBackground`. `Transparent` requires a foreground processor; `KeepBackground` bypasses it. Pass the selected mode to preparation as well as generation to warm only the chosen pipeline. Switching from background to transparent after preparation pays the processor's first-use cost on that order. Neither override changes the shared style asset. The chosen policy is part of the request, cache key, saved receipt and export recipe. The supplied opaque native backend rejects a transparent request if no processor is configured.

If `HasLocalModel` is true, skip the download action and prepare using the cached copy. Preparation checks its SHA-256. A `ForgeModelIntegrityException` marks that source for repair; an explicit successful download clears the flag. Model downloads report fractional progress through `IProgress<float>`.

## Generate an icon

Create a queue once for a configured backend and retain it for the lifetime of that model:

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

Release the queue with `await queue.CloseAsync()` when unloading its model. Each `UnityPngImage` has an independent lifetime; closing the queue does not destroy already displayed images. `store.GetPath(request.CacheKey)` returns the cached PNG path when caching is enabled.

The choice keys in the example belong to the workshop style. Other games define their own catalog. A seed makes the requested recipe reproducible; changing the model, backend or hardware can change its resulting pixels.

## Implement a backend

Provide a stable `GenerationIdentity` while the queue is alive. Its `ComponentsSha256` is a 64-character hexadecimal digest of the complete model/component recipe. Include the text encoder, decoder and any adapter configuration in that recipe. Reject unsupported dimensions or settings rather than silently changing the recorded request.

The queue invokes `GenerateAsync` serially on a worker. Return a `RawImageFrame` of exactly the requested dimensions. Its constructor copies the provided pixel buffer, so the native buffer can then be freed by its owning allocator. Never return borrowed native memory or create UnityEngine objects from this method.

Report progress through the supplied `IProgress<GenerationProgress>`. Treat reporting as observational; do not retain the observer after completion. Honour cancellation during model work and postprocessing, and release native resources in `Dispose()`. The queue calls `Dispose` only after the last native operation has ended.

`QueueCapacityException` is a synchronous rejection when there is no capacity. A failed backend operation faults that job's Task. Cancellation cancels the Task and prevents result publication. Handle each of these in the game's UI without replacing a previous successful image.

## Save games

Persist the complete `GenerationRequest` recipe plus its cache key, the PNG and its content hash. The demo's `ForgeWorkshop.Receipt` shows a JSON-compatible record and checks that restored settings produce the saved key. These are deterministic content identifiers, not authentication signatures. A changed receipt is rejected rather than attached to a different PNG.

The workshop commits its inventory file before adding the icon to the displayed collection. During that commit its Cancel button is disabled. A failed or cancelled order does not add a collection item. A damaged inventory is kept and new writes are blocked to preserve the existing save. Background policy is included in receipts; a portrait using Keep Background restores its original complete image.
