# Quick start

Use Unity 6000.5 or later. The supplied native backend supports Windows x64 with a Vulkan-capable GPU; foreground removal uses GPU Compute. Unity Inference Engine 2.6.1 is installed as a package dependency. MCP is optional.

The backend runs as a native DLL inside the Unity Editor or Windows Player process. Runtime Image Forge checks the local libraries against pinned SHA-256 checksums before loading them. Image generation requires no separate server, listening port or API key.

The native libraries require the Microsoft Visual C++ 2015–2022 Redistributable (x64), which most Windows PCs already have. If it is missing or outdated, preparation reports a missing native dependency (with **Warmup On Prepare** off, the first order reports it); install the latest version from Microsoft and restart Unity or the game.

## Install and import examples

1. After purchase, install Runtime Image Forge from **Package Manager > My Assets**; it installs as a package. A local `.tgz` copy can be added with **Install package from tarball**.
2. Select the package, open **Samples** and import **Models and choice styles**. It includes the Bonsai Ternary 4B and FLUX.2 Klein 4B profiles, a foreground profile, five Native1024 styles in `Styles/NativeDistilled1024` and the legacy editable presets.
3. Open **Tools > Runtime Image Forge > Overview**. Choose **Install Windows backend** while outside Play Mode. This installs the native DLL archive and required notices into this project's StreamingAssets; these files are included in Windows Player builds.

The model weights are acquired separately. Bonsai Ternary 4B requires a compatible converted flat pack with 4,642,526,382 pinned weight bytes (4.64 GB / 4.32 GiB); FLUX.2 Klein 4B has 5,207,178,964 pinned weight bytes (5.21 GB / 4.85 GiB), obtained by explicit HTTPS download or local import. Engine files, notices, archive overhead and temporary copies are additional. Read [Models and styles](Models-and-styles.md) and the profile's model terms before use or redistribution.

Download the Bonsai model pack free from [The Ember Forge page on itch.io](https://merrymaker14.itch.io/the-ember-forge): choose **Runtime-Image-Forge-Bonsai-Models.zip**. It contains only the three weight files with their notices and instructions, and no executable. Extract it and keep its `RuntimeImageForgeModels` folder intact.

Check **Full model weights** in the model Inspector before shipping your game. Show the complete first-download size to players before starting a download. Engine files and temporary download space are additional; weight size does not describe RAM or VRAM requirements.

## Configure the scene

Create one scene object and add `LocalForgeBackendSource` and `ForgeGenerator`.

- Select the imported `BonsaiTernary4B` or `FLUX2Klein4B` asset in **Model profile** on the local backend.
- Assign the imported U2NETP profile to **Foreground mask**. Its ONNX reference points to the package's supplied model.
- Leave **Vulkan device** at `auto` to select a suitable local GPU.
- Assign this source to the generator's **Backend Source**. Leave **Warmup On Prepare** enabled to prepare once without saving the warmup picture.
- Choose `Styles/NativeDistilled1024/IllustratedForgeNative1024` for the first image: 1024 × 1024, 4 steps, CFG 1. Its choice keys are `item`, `material` and `detail`. Profile selection does not change style settings.

Before preparation, open the selected model profile. For Bonsai, use **Import verified model files** and select the flat converted pack. For Klein, choose **Download verified model files**, or import the three pinned files from a local folder. Both actions have progress/cancel. A verified cached profile can be prepared offline. Change profiles in Edit Mode after stopping work and closing prepared generators.

Use **Create model profile**, **Create foreground profile** and **Create choice style** in Overview to create and select assets in your selected Assets folder, with unique filenames. The foreground profile is automatically assigned the supplied ONNX model. New styles include an editable item/material/detail catalog. **Existing style > Edit selected style** opens a saved catalog. Assets created from **Assets > Create > Runtime Image Forge** are also supported; assign the ONNX model to a foreground profile created from that menu.

## Included companion game

The package includes **The Ember Forge**, a complete editable game scene with gameplay source, workshop art and a separate soundtrack. Sample files are downloaded with the package, and copied into your project's Assets only when you import them. In Package Manager's **Samples** tab, import **The Ember Forge**, then choose **Tools > Runtime Image Forge > Open The Ember Forge sample**. The menu supplies missing TMP Essentials in a project without TMP assets, opens the imported scene and installs the bundled Windows DLLs and notices. Existing TMP Settings are preserved. A partially installed TMP setup must be repaired before opening the sample; its existing assets are kept. The scene uses the host project's rendering and active input backend. The sample has `BonsaiTernary4B` and `IllustratedForgeNative1024` assigned: 1024 × 1024, 4 steps, CFG 1. To use Klein, select `FLUX2Klein4B` on the local backend before Play; profile selection keeps the style settings. In the game, use **IMPORT MODEL PACK** for Bonsai, or the explicit model download for Klein.

Keep one imported companion sample version at a time. Back up edited files before replacing an earlier sample. The sample's README explains its included content and first launch. The separate standalone Windows distribution runs without Unity or this package.

For the sample in the Editor, place the extracted `RuntimeImageForgeModels` folder beside your project's `Assets` folder, enter Play Mode and choose **IMPORT MODEL PACK**. Import copies and verifies the files once.

## First download and order

For an HTTPS profile such as Klein, connect your game's download button to an explicit call to `localSource.DownloadModelAsync(progress, token)`. For an import-only profile such as Bonsai, explicitly call `localSource.ImportModelPackAsync(selectedFolder, progress, token)`. Show the complete weight size, progress, cancellation and errors before acquisition. Do not obtain model files before the player chooses to do so.

If `HasLocalModel` is already true, proceed directly to preparation. Choose transparent or background PNG first, then call `generator.PrepareAsync(style, backgroundMode, token)`. Preparation verifies the cached file, loads the native model context and warms the selected pipeline without saving a warmup picture. Background PNG skips the cutout model's warmup. Wait for `generator.IsReady` before accepting orders.

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

Use `System`, `System.Collections.Generic`, and `StrangeEuphoriaXR.RuntimeImageForge` for this fragment. `generator`, `style` and `inventoryImage` refer to your assigned components/assets. Retain `ownedImage` while the UI uses its sprite; dispose it when replacing the image or unloading the view. The [API guide](API.md) covers lifetimes and failure handling.

Export a completed job with `generator.ExportJobAsync(...)`, or export an existing `PngArtifact` using `PngExporter`. Export preserves the image and does not run the model again.

## Build a game

Build a Windows x64 Player with the configured scene. Keep the installed `StreamingAssets/RuntimeImageForge` files and notices. For Bonsai, provide a compatible flat `RuntimeImageForgeModels` folder beside the game and a local import action; for Klein, provide explicit HTTPS download or local import. Cached verified files support subsequent offline launches. Preserve model LICENSE/NOTICE and conversion notices with any redistributed pack. Save the recipe, content hash and PNG together when restoring generated items.

Editor inspectors and the optional MCP integration are excluded from the Player. Your public game does not need an MCP server. See [Troubleshooting](Troubleshooting.md) for repair and cancellation behavior.
