# Quick start

Runtime Image Forge needs Unity 6000.5 or later, Windows x64, a GPU with Vulkan support and the Microsoft Visual C++ 2015–2022 Redistributable (x64). The image model runs inside the Unity Editor or your Windows game; it needs no server, listening port or API key.

## 1. Import the package

Open **Package Manager > My Assets**, download Runtime Image Forge and import it. The files are placed in `Assets/StrangeEuphoriaXR/RuntimeImageForge`, and Unity adds the Unity Inference Engine 2.6.1 and Unity uGUI 2.5.0 package dependencies. The **Overview** window opens once after the import; you can reopen it from **Tools > Runtime Image Forge > Overview**.

## 2. Try The Ember Forge

The Ember Forge is a complete, editable crafting game in `Samples/The Ember Forge`. It shows the whole cycle: choose an item, generate its picture, keep it in a collection and export it as PNG.

1. Choose **Tools > Runtime Image Forge > Open The Ember Forge sample** (or **Open The Ember Forge sample** in Overview). The command installs the Windows backend into `Assets/StreamingAssets/RuntimeImageForge` with its license notices, imports TMP Essential Resources if the project has no TMP Settings, and opens the scene. Existing TMP Settings are kept, and a backend archive left by another version of the package is replaced.
2. Enter Play Mode and choose **DOWNLOAD MODEL**. The sample uses FLUX.2 Klein 4B: three pinned files, 5,207,178,964 bytes in total (5.21 GB), downloaded from Hugging Face over HTTPS and verified by SHA-256. Progress is shown, and **CANCEL ORDER** stops the download. The files are cached under `Application.persistentDataPath/RuntimeImageForge`, so later launches work offline.
3. Choose an item, a material and a detail, then **FORGE MY ITEM**. On the tested RTX 3060 Laptop GPU with 6 GB of VRAM, one 1024 × 1024 picture takes about 17 seconds including background removal. Times depend on the GPU, the driver and other GPU work.
4. Select an item in the collection and use the export controls to save its PNG and recipe.

For transparent PNG icons, choose **Tools > Runtime Image Forge > Install Foreground Model** before Play. It downloads the U²-Netp cutout model (4.6 MB) with its license from the public rembg release on GitHub, places them in `Assets/RuntimeImageForge/ForegroundModel` and assigns the model to the sample's foreground profile. Without it, the sample offers PNG with background only.

## 3. Add a generator to your scene

1. Create a scene object and add `LocalForgeBackendSource` and `ForgeGenerator`.
2. In **Model profile** on the local source, select `Samples/The Ember Forge/Profiles/FLUX2Klein4B`. **Create model profile** in Overview creates a new profile with the same FLUX.2 Klein 4B settings in your selected folder.
3. For transparent PNGs, assign `Samples/The Ember Forge/Profiles/U2NetPForeground` to **Foreground mask** and install the foreground model as described above.
4. Leave **Vulkan device** at `auto` to select a suitable GPU.
5. Assign the source to the generator's **Backend Source**. Leave **Warmup On Prepare** enabled: preparation then runs one warmup generation without saving its picture.
6. Choose a style from `Samples/The Ember Forge/Styles`, for example `IllustratedForgeNative1024` (1024 × 1024, 4 steps, CFG 1, choice keys `item`, `material` and `detail`), or create your own with **Create choice style** in Overview.

Copy a profile or style into your own folder (select it and press Ctrl+D, then move the copy) before editing it. Package updates replace the files inside `Assets/StrangeEuphoriaXR/RuntimeImageForge`.

In the Editor, the model profile Inspector offers **Download verified model files** with progress and cancellation, so you can fill the cache before entering Play Mode.

## 4. First download and first image

Start a download only after the player agrees to it. Show the complete size first: `profile.GetTotalDownloadBytes()` returns the pinned weight total. Skip the download when `localSource.HasLocalModel` is already true.

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

`PrepareAsync` verifies the cached files, loads the model and warms the selected pipeline. Wait for it before accepting orders. Keep `ownedImage` alive while the UI shows its sprite and dispose it when you replace the image. The [Runtime API](API.md) guide covers job states, cancellation and image lifetimes.

Export a completed job with `generator.ExportJobAsync(...)`, or an existing `PngArtifact` with `PngExporter`. Export copies the finished pixels and does not run the model again. See [Save and export](Exporting-images.md).

## 5. Build a game

Build a Windows x64 Player with your scene. Keep the files that the backend installer placed in `Assets/StreamingAssets/RuntimeImageForge`, including the license notices. Your game must offer an explicit model download (or a local import of the model files) before the first generation; verified files are reused offline afterwards. Keep the model license notices when you distribute model files with your game.

The Editor windows and the optional MCP tools are Editor-only and are not included in Player builds. See [Troubleshooting](Troubleshooting.md) for download, preparation and cancellation problems.
