# Models and styles

A **model profile** (`ForgeModelProfile`) says which model files to use and how to run them. A **choice style** (`ForgeStyleAsset`) says what players may choose and how those choices become a prompt. A **foreground profile** (`ForegroundModelProfile`) configures the optional background removal. The Ember Forge sample includes one of each kind, ready to use.

## Choice catalogs

A `ForgeStyleAsset` defines both the visual direction and the allowed player choices. Each field has a stable key; each choice has a key, a display label and prompt text. The prompt template uses fields such as `{item}`, `{material}` and `{detail}`. Submit every required field by its key. Unknown choices and unresolved fields are rejected.

Use labels for UI and keys for saved data. For example, display **Runic engraving**, submit `runes`, and expand it as **subtle engraved runes**. Change `styleVersion` when you change the meaning of a style that is already in a released game. The applied prompt and all settings are recorded in each image recipe, so later edits do not change earlier images.

`Samples/The Ember Forge/Styles` contains five editable styles, all at 1024 × 1024, 4 steps and CFG 1:

| Style | Choice fields | Background |
| --- | --- | --- |
| Illustrated Forge | item, material, detail | Removed; requires a foreground profile. Used by the sample scene. |
| Pixel Inspired Items | item, material, detail | Removed. |
| Flat Icons | item, material, detail | Removed. |
| Character Portraits | character, mood, palette | Kept. |
| Environment Cards | location, time, weather | Kept. |

These are prompt presets. Pixel Inspired Items suggests an appearance; it does not enforce a pixel grid, an exact palette or animation consistency. Negative prompts and catalog restrictions guide the model but do not guarantee a particular result. Distilled models at CFG 1 may ignore a negative prompt.

## Generation settings

Width, height, steps, guidance and seed are part of the request and of its cache key. The supplied native backend requires width and height of at least 64 pixels, divisible by 64; it rejects unsupported settings instead of silently replacing them. Higher resolutions need more memory and time. Repeating a recorded request can reuse its cached PNG; the same seed on different hardware or backend versions does not guarantee identical pixels.

The model profile's recommended values (sampler `euler`, scheduler `flux2`, 4 steps, CFG 1, 1024 × 1024) describe the model; they do not change a style. Choose a style whose settings suit the model.

## The FLUX.2 Klein 4B profile

`Samples/The Ember Forge/Profiles/FLUX2Klein4B` and every new profile created with **Create model profile** use FLUX.2 Klein 4B (Apache-2.0). The profile pins three files separately; each entry declares its source repository revision, filename, byte count, SHA-256 and license:

| Role | File | Bytes |
| --- | --- | ---: |
| Generator | `flux-2-klein-4b-Q4_0.gguf` | 2,460,378,560 |
| Text encoder (Qwen3-4B) | `Qwen3-4B-Q4_K_M.gguf` | 2,497,281,312 |
| VAE | `full_encoder_small_decoder.safetensors` | 249,519,092 |
| **Total** | | **5,207,178,964 (5.21 GB / 4.85 GiB)** |

The profile runs with CPU weight offload and flash attention in the diffusion model, so it fits a GPU with 6 GB of VRAM. On the tested RTX 3060 Laptop GPU (6 GB) with 32 GB of RAM, a 1024 × 1024 picture took about 17 seconds including background removal, and the game process used up to about 6.3 GB of RAM. This is a tested configuration, not a minimum.

In the profile Inspector, **Download verified model files** downloads the three files over HTTPS with progress and cancellation; in a game, call `LocalForgeBackendSource.DownloadModelAsync`. **Import verified model files** accepts the same three files from a local folder. Both actions reuse files that are already verified in the cache, and selecting a profile never starts a download.

The sizes above count the weight files only. The native DLLs, notices, exported PNGs and a temporary download file need additional space. File size is not a RAM or VRAM requirement.

Change the profile before preparing a generator. A prepared generator keeps one model. Stop outstanding work and close the generator before you select another profile in Edit Mode.

## Transparent PNGs

Disable **Keep Background** for isolated items and assign a foreground profile to the local source. After generation, the foreground processor predicts a mask for the main object. The result is RGBA with straight alpha; PNG export keeps that alpha.

The package does not include the cutout model. **Tools > Runtime Image Forge > Install Foreground Model** downloads U²-Netp (4,574,861 bytes, Apache-2.0) with its license, places it in `Assets/RuntimeImageForge/ForegroundModel` and assigns it to foreground profiles that wait for it. The model is installed into the project once and is included in game builds, so players do not download it separately. Cutout runs locally on the GPU. The U²-Netp profile reads the mask from the output named `1959` (**Mask output name**); leave that field empty for an ONNX mask model with a single output.

**Refine thin objects** (`ForegroundModelProfile.refineUniformBackground`) can run a second pass for one isolated object on a uniform background when the first mask is incomplete. The processor keeps the first mask when the crop is unsuitable or the new mask fails its checks. This option has its own cache identity. The sample's foreground profile enables it.

Enable **Keep Background** for portraits, environments and complete illustrations. This skips the cutout and keeps the whole picture. Both modes save PNG. Without a foreground profile, use `ForgeBackgroundMode.KeepBackground`: a transparent request is rejected instead of silently returning an opaque picture.

To let the player choose, pass `ForgeBackgroundMode.Transparent` or `ForgeBackgroundMode.KeepBackground` to `PrepareAsync`, `Generate` or the style's `CreateRequest` overload. `StyleDefault` uses the style's own setting. The choice belongs to one recipe and does not edit the shared style. Preparing with `KeepBackground` skips the cutout warmup; if the player later chooses transparency, that order also loads the cutout model.

Fine outlines, translucent materials, gaps, shadows and secondary objects can produce imperfect masks. Check real results for your art. Background removal makes a 2D image; it does not create geometry or guarantee clean sprite outlines. The [export guide](Exporting-images.md) explains how to share the PNG and its recipe.

## Use your own model files

A profile can also describe a model you supply yourself. Enable **Import only** (`ForgeModelProfile.importOnly`) when the files are delivered locally rather than downloaded; download URLs may then stay empty. Every file still needs its exact filename, revision, byte count, SHA-256 and license information, and component filenames must differ even when letter case is ignored. Turn off **Separate component files** to describe a single checkpoint file instead of separate generator, text encoder and VAE files.

In the profile Inspector, choose **Import verified model files** and select the folder that contains the files directly. The importer does not search subfolders or unpack archives. It copies only the pinned filenames, rejects symbolic links and directory junctions, verifies each file and installs it into the cache under `Application.persistentDataPath/RuntimeImageForge`. It does not change the source files. Keep enough space for both the source files and the cache copy.

**Cancel import** stops the copy. Completed verified files stay reusable; an unfinished copy is removed. Missing import-only files never trigger a network download.

In a game, call `LocalForgeBackendSource.ImportModelPackAsync(selectedFolder, progress, cancellationToken)` or `ForgeModelCache.ImportProfileAsync(cacheRoot, profile, selectedFolder, progress, cancellationToken)`. For an import-only profile the sample shows **IMPORT MODEL PACK** and reads the `RuntimeImageForgeModels` folder beside the game executable (beside `Assets` in the Editor), exposed as `LocalForgeBackendSource.ModelPackDirectory`.

Import checks file identity, not model architecture or image quality. Use a model that the supplied backend supports, and follow the license of every model you use or distribute.

The backend includes one tokenizer vocabulary, CLIP's, for checkpoints with CLIP text encoders such as Stable Diffusion 1.5. For a Qwen text encoder, such as the Qwen3-4B file of FLUX.2 Klein, it reads the tokenizer from the GGUF file, so a Qwen text encoder must be a GGUF file that includes its tokenizer, as llama.cpp conversions do. Models whose text encoders need a T5, UMT5, Mistral or Gemma tokenizer, such as FLUX.1, Stable Diffusion 3 and Wan, are not supported: preparing one fails with an error that names the missing tokenizer.

## Choose a model profile in the Editor

In **Tools > Runtime Image Forge > Overview**, assign the scene's `LocalForgeBackendSource` to **Scene backend**, then choose a saved profile from **Model profile**. The same list is available in the local backend Inspector. **Open model profile** opens its settings, download and import actions.

The selector changes only that source's reference and supports Undo. It does not edit the profile or any style, move model files or change a generator that is already prepared. Exit Play Mode first; compilation, asset import and any ready or preparing generator block the selection.
