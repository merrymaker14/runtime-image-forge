# Troubleshooting

| Symptom | Action |
| --- | --- |
| Native archive is missing | Outside Play Mode, choose **Tools > Runtime Image Forge > Install Windows Backend**, then rebuild the Player. |
| Download stops or fails | Check internet access, available disk space and write permission. Retry through the explicit download action. Cancelled or failed downloads do not replace a valid model file. |
| Model checksum fails | Replace the invalid copy through explicit HTTPS download or verified local reimport, according to the profile. Import-only profiles require local import. A present file is not accepted for generation until its integrity check passes. |
| Preparation fails | Check the selected profile, Windows x64 support, Vulkan GPU support and native files. Read the Unity Console or Player log for the specific cause. |
| A native dependency is missing or outdated | Install the latest Microsoft Visual C++ 2015–2022 Redistributable (x64) from Microsoft and restart Unity or the game. Update the graphics driver if the message remains. |
| A path contains a symbolic link or junction | Move the project, game, model pack or export folder to a location reached without symbolic links or directory junctions. This includes the application data folder (`Application.persistentDataPath`) if it was redirected with a junction. Cloud-sync folders such as OneDrive are not treated as links. |
| The next order after a cancellation is slower | Cancelling a model load or a generation in progress unloads the native model context to release its memory. The next order loads the model again before generating. Cancelling a job that is still waiting in the queue does not unload it. |
| Preparation is still running | Preparation verifies the checkpoint, loads the native model context and performs unsaved warmup. Show this stage before accepting orders. |
| A cancelled job is still draining | Cancellation requests the native operation to stop and prevents publishing its result. The queue retains its slot until native work releases its resources. Wait for completion before reusing or disposing the backend. |
| A native library fails verification | Close the game or Editor. If the installed backend is reported as damaged, delete its version folder under `Application.persistentDataPath/RuntimeImageForge/Backends` and prepare again. If the bundled archive fails its check, delete `Assets/StreamingAssets/RuntimeImageForge/windows-vulkan.zip`, choose **Tools > Runtime Image Forge > Install Windows Backend** and rebuild the Player. The installer never overwrites a different existing file. |
| A different native library version is already loaded | Restart the game or Editor before loading another native library version. |
| A job completes without an image | Check `ForgeGenerationJob.State` and `Error`; completion also includes failed and cancelled jobs. Preserve the previous successful image in your UI. |
| Queue capacity is reached | Wait for active work to finish or cancel it. Cancelled work retains its slot until the worker releases it. |
| Transparent PNG still has a background | Assign the foreground profile and disable **Keep Background** for that style. Inspect the generated object's contrast and mask; foreground prediction can leave imperfect edges. |
| Export beside the game fails | Choose the persistent-data export directory or a writable folder. Protected install directories can refuse writes. Existing unrelated files are preserved. |
| An exported bundle was changed | Export under a different name or restore the original bundle. The exporter refuses to overwrite a changed existing bundle. |
| A restored item is missing | Keep the PNG with its original cache key, recipe and content hash. Copying only an inventory receipt does not copy the image. |
| MCP reports no generator | Open the configured scene, enter Play Mode, prepare it and enable Forge agent operations for the current Editor session. Query `forge_status` again. |
| A previous MCP job ID disappears | Job metadata is bounded and belongs to one scene session. Save receipts/PNGs for long-term retention; obtain a new session ID after reloading. |

## Cancelling and unloading

Pass a cancellation token to preparation and generation. `CancelPreparation()` stops startup work; `CancelJob(id)` stops an unfinished scene job. Cancellation prevents publication of a new result. `ImageGenerationQueue.CloseAsync()` cancels outstanding work, waits for the worker to release it, and disposes the backend. Do not separately dispose a backend already owned by that queue.

Unity textures and sprites have their own lifetime. Keep the `UnityPngImage` owner while displaying them, then dispose on the Unity thread or use `DisposeAsync()`. Dispose old images when replacing them; disk caching does not bound the number of textures your game retains.

## Requirements and limits

The supplied local implementation supports Windows x64; it does not provide a macOS, Linux, mobile or WebGL implementation. The tested configuration is an RTX 3060 Laptop GPU with 6 GB VRAM. This is a tested configuration, not a promise that every device with a given memory size will work.

Model weights and native libraries are cached under `Application.persistentDataPath/RuntimeImageForge`; generated PNGs and the companion collection are under `Application.persistentDataPath/ForgeArt`. In the Editor this is the persistent-data folder for the project's company and product names, outside the project. Delete these folders to remove cached models and images; changing the company or product name starts a new cache.

Image generation and foreground processing share GPU resources with the game. Use bounded queues, modest dimensions and an explicit loading stage; measure your target game and hardware. Keep the large diffusion weights as an explicit separate download. Generated pixels can miss the requested subject or vary in quality, and cutout can need manual cleanup.

For support, include the Unity version, GPU/driver, model ID/revision, style settings, stage and relevant error from the Console or Player log. Review log excerpts before sharing private paths or game content.
