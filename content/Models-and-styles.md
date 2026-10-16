# Models and styles

The Ember Forge sample uses Bonsai Ternary 4B by default. The standalone Windows bundle includes its flat `RuntimeImageForgeModels` folder beside the game; choose **IMPORT MODEL PACK** once to copy and verify it. Preserve that folder with the original notices when moving the bundle. The Unity package keeps model weights separate; import the compatible Bonsai model pack or select the Klein profile for explicit HTTPS acquisition.

Developers can download the same Bonsai pack without the game: **Runtime-Image-Forge-Bonsai-Models.zip** on [The Ember Forge page](https://merrymaker14.itch.io/the-ember-forge).

## Choice catalogs

A `ForgeStyleAsset` defines both visual direction and allowed player choices. Each field has a stable key; each choice has a key, a display label and prompt text. The prompt template uses fields such as `{item}`, `{material}` and `{detail}`. Submit every required field by its key. Unknown choices and unresolved fields are rejected.

Use labels for UI and keys for saved data. For example, display **Runic engraving**, submit `runes`, and expand it as **subtle engraved runes**. Change `styleVersion` when changing a shipped style's meaning. The applied prompt and complete settings are recorded in each image recipe, so later edits do not rewrite earlier images.

The imported sample contains:

| Style | Choice fields | Background |
| --- | --- | --- |
| Illustrated Forge | item, material, detail | Removed; requires a foreground processor. |
| Pixel Inspired Items | item, material, detail | Removed. |
| Flat Icons | item, material, detail | Removed. |
| Character Portraits | character, mood, palette | Kept. |
| Environment Cards | location, time, weather | Kept. |

These are editable prompt presets. Pixel Inspired Items suggests an appearance; it does not enforce a pixel grid, exact palette or animation consistency. Negative prompts and catalog restrictions guide the model but do not guarantee a particular result.

## Generation settings

Width, height, steps, guidance and seed are part of the request and cache key. For Bonsai Ternary 4B and FLUX.2 Klein 4B, choose an explicit style from `Styles/NativeDistilled1024`: 1024 × 1024, 4 steps and CFG 1. Both profiles use `euler` and `flux2`, with CPU weight offload and diffusion flash attention. Recommended profile values do not automatically change a style.

The original styles remain editable 512 × 512 presets for the legacy recipe. The supplied native backend requires dimensions of at least 64 pixels, divisible by 64; it rejects unsupported settings instead of silently substituting them. Higher resolutions can need more resources. Repeating a recorded request can reuse its PNG cache; using the same seed across hardware or backend versions does not guarantee identical pixels.

The Native1024 environment preset's `location=forge` choice specifies a glowing coal hearth, large anvil and smithing hammer. Pixel and flat-icon prompts suggest a visual direction; they do not enforce a pixel grid or exact palette. Distilled models at CFG 1 may ignore a negative prompt.

## Models and integrity

The included `BonsaiTernary4B` and `FLUX2Klein4B` profiles each pin a generator, text encoder and VAE separately. Every component declares its exact source repository revision, filename, byte count, SHA-256 and license. The weight files are acquired separately from the Unity package.

| Profile | Acquisition | Complete pinned weights |
| --- | --- | ---: |
| Bonsai Ternary 4B | Import the free Bonsai model pack (see above). | 4,642,526,382 bytes (4.64 GB / 4.32 GiB). |
| FLUX.2 Klein 4B | Explicit HTTPS download or local import. | 5,207,178,964 bytes (5.21 GB / 4.85 GiB). |

Bonsai is an import-only profile. Put `bonsai-ternary-transformer.gguf`, `bonsai-qwen3-hqq-affine.gguf` and `diffusion_pytorch_model.safetensors` directly in the chosen folder. These GGUF files are converted forms; the original Gemlite checkpoints do not match the profile. Import does not search subfolders or convert checkpoints. Keep the original LICENSE/NOTICE and conversion notices with the model pack.

Klein pins `flux-2-klein-4b-Q4_0.gguf`, `Qwen3-4B-Q4_K_M.gguf` and `full_encoder_small_decoder.safetensors`. In the profile Inspector, choose **Download verified model files** to obtain the fixed HTTPS components, with progress and cancellation. **Import verified model files** also accepts their flat local folder. Both actions reuse files already verified in the selected cache; profile selection never starts acquisition.

Sizes above count the three required weight files. DLLs, notices, archives, exported PNGs and temporary copies are additional. Import keeps the source pack and creates a separate cache copy, so reserve at least another full payload on the cache volume plus headroom. The model Inspector shows the complete pinned weight total. Weight-file size is not a RAM or VRAM requirement.

The supplied U2NETP ONNX is a separate Apache-2.0 foreground model. The original DreamShaper profile remains a legacy preset under CreativeML OpenRAIL-M. Exact source revisions and terms are in [Third-party notices](Third-party-notices.md).

Change the model/profile before preparing a new generator. A prepared queue retains one backend identity. Stop outstanding work and close/unload the generator before selecting another saved profile in Edit Mode.

## Transparent PNGs

**Refine thin objects** (`ForegroundModelProfile.refineUniformBackground`) can use a second foreground pass for one isolated object on a uniform opaque background when the first mask is incomplete. The processor keeps the first mask when the crop is unsuitable or the new mask fails its preservation checks. This option has a separate cache identity. Inspect fine edges and openings; refinement does not guarantee a perfect cutout. The companion and choice-style foreground profiles enable this option.

Disable **Keep Background** for isolated items and assign the foreground profile to the local source. The foreground processor predicts a salient-object mask after generation. The result is straight-alpha RGBA; PNG export keeps that alpha.

Enable **Keep Background** for portraits, environments and complete illustrations. This bypasses foreground processing and preserves the whole picture. Both modes export PNG. With no foreground profile assigned, choose `ForgeBackgroundMode.KeepBackground`; a transparent request is rejected by the supplied native backend instead of silently returning an opaque picture.

For a player-facing choice, pass `ForgeBackgroundMode.Transparent` or `ForgeBackgroundMode.KeepBackground` to `PrepareAsync`, `Generate`, or the style's `CreateRequest` overload. `StyleDefault` preserves the asset's default. The override belongs to one recipe and does not edit the shared style. Preparing with `KeepBackground` skips foreground warmup; if the player later selects transparency, that order includes the foreground model's first-use setup.

U2NETP is bundled: 4,615,341 bytes (about 4.4 MiB), with no separate player download. Model weight totals are listed above. Cutout runs locally and has no per-image API fee. Warm the selected transparent pipeline during preparation; exporting an existing PNG only copies its bytes.

Fine outlines, translucent materials, gaps, shadows and incidental objects can make imperfect masks. Check actual outputs for your art direction. Background removal makes a 2D image; it does not create geometry or guarantee clean sprite contours. The [export guide](Exporting-images.md) explains how to share the original PNG and its recipe.

## Import a local model pack

Enable **Import only** (`ForgeModelProfile.importOnly`) when model files are supplied locally. This option defaults to off; existing HTTPS profiles and their generation identities are unchanged. Import-only profiles may leave download URLs empty. Every file still needs its exact filename, revision, byte count, SHA-256 and license information. Component filenames must be distinct when compared without regard to letter case.

In the profile inspector, choose **Import verified model files**, then select the folder containing the files directly. The importer does not search subfolders or unpack archives. It copies only the pinned filenames, rejects symbolic links and directory junctions, verifies each file, and installs it into the cache under `Application.persistentDataPath/RuntimeImageForge`. It does not change the source files. The cache keeps its own copy, so retain enough space for both the pack and the cache plus a temporary file.

Cancel using **Cancel import**. Completed verified files remain reusable; an unfinished copy is removed. A valid cached file is reused without replacing it. Missing import-only files never trigger a network download.

For a game, explicitly call `ForgeModelCache.ImportProfileAsync(cacheRoot, profile, selectedFolder, progress, cancellationToken)` or `LocalForgeBackendSource.ImportModelPackAsync(selectedFolder, progress, cancellationToken)`. The companion's **IMPORT MODEL PACK** action uses `LocalForgeBackendSource.ModelPackDirectory`: the fixed `RuntimeImageForgeModels` folder beside the executable, or beside `Assets` in the Editor. Place the exact profile files directly in that folder, then choose the action. Existing cached files can be used offline without retaining the source pack.

Import checks file identity, not model architecture or generation quality. Use a backend compatible with the model and keep the applicable model licenses.

## Choose a model profile in the Editor

In **Tools → Runtime Image Forge → Overview**, assign the scene's `LocalForgeBackendSource` to **Scene backend**, then choose a saved asset from **Model profile**. The same list is available in the local backend inspector. **Open model profile** opens its settings and explicit local import action.

The selector changes only that source's reference and supports Undo/redo. It does not edit the selected profile or any style, transfer model files, or change an existing generator's backend. Exit Play Mode first; compilation, asset import and any ready or preparing generator block selection. Close/unload prepared generators before changing profiles, then prepare the selected model in the next game session.

A saved profile must have valid file pins and a recipe supported by the backend. Its appearance in the list does not establish native compatibility or image quality. Import or download its exact files explicitly, and check that the game's styles and settings suit the model.
