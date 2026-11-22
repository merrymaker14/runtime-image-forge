# Third-party components and model terms

This page lists everything in Runtime Image Forge that comes from a third party, what was made for the package, and what the package can download on request. The same list is in `Third-Party Notices.txt` in the package folder.

## Included in this package

The Windows x64 native backend in `Native/windows-x64` is a modified build of [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp/tree/f89d9b13d730eabeede7314ce49dacd18d3c90c2), revision `f89d9b13d730eabeede7314ce49dacd18d3c90c2`, with the libraries below. The installer and loader check every DLL against a pinned SHA-256 checksum. The complete license texts are in `ThirdParty`.

| Component | Source / license | License file in `ThirdParty` |
| --- | --- | --- |
| stable-diffusion.cpp | leejet, MIT; modified by Strange Euphoria XR. | `stable-diffusion.cpp-LICENSE.txt`, `stable-diffusion.cpp-BINARY-LICENSE.txt`, `RuntimeImageForge-native-NOTICE.txt` |
| ggml | `d25b121ce1d6ae0c7e62ad080460d9fc1e46dd93`, MIT. | `ggml-LICENSE.txt` |
| libwebp / libsharpyuv | `0c9546f7efc61eac7f79ae115c3f99c91c21c443`, BSD 3-Clause with patent grant. | `libwebp-COPYING.txt`, `libwebp-AUTHORS.txt`, `libwebp-PATENTS.txt` |
| libwebm | `5bf12267eea773a32fcf4949de52b0add158a8d5`, BSD 3-Clause with patent grant. | `libwebm-LICENSE.txt`, `libwebm-AUTHORS.txt`, `libwebm-PATENTS.txt` |
| cpp-httplib | Yuji Hirose, MIT. | `cpp-httplib-LICENSE.txt` |
| nlohmann/json | 3.11.2, Niels Lohmann, MIT. | `nlohmann-json-LICENSE.txt` |
| darts-clone | BSD 3-Clause. | `darts-clone-LICENSE.txt` |
| Oniguruma | BSD 2-Clause. | `oniguruma-LICENSE.txt` |
| utf8proc | MIT and Unicode data license. | `utf8proc-LICENSE.txt` |
| miniz, zip | MIT. | `miniz-LICENSE.txt`, `zip-LICENSE.txt` |
| stb image utilities | Sean Barrett, MIT or public domain. | `stb-LICENSE.txt` |

**Tools > Runtime Image Forge > Install Windows Backend** (also run by **Open The Ember Forge sample**) packs the DLLs into an archive in `Assets/StreamingAssets/RuntimeImageForge` and copies these license files to `Assets/StreamingAssets/RuntimeImageForge/Licenses`, so they travel with a built game. A backend archive written by another version of the package is replaced; other existing files with different content are kept instead of being overwritten. Keep these notices when you distribute a game that contains the backend.

## Made for this package

All other files were made for Runtime Image Forge by Strange Euphoria XR: the C# source code, Editor windows, icons and logo, the documentation, and The Ember Forge sample with its scene, scripts, model and style profiles and workshop illustration. The workshop illustration was created with OpenAI image generation. The package contains no third-party fonts, audio, images or models.

## Used from your Unity installation

Unity uGUI, TextMesh Pro Essential Resources and Unity Inference Engine are Unity packages under their own terms and are not redistributed by this package. The sample uses the default TextMesh Pro font from TMP Essential Resources (Liberation Sans); its font license is imported with it into `Assets/TextMesh Pro/Fonts`. Keep the notices of Unity components when you distribute a built game.

## Downloaded only when you choose to

Model files are not part of the package. They are downloaded from their publishers' repositories over HTTPS only after an explicit action by the developer or player, and every file is checked against a pinned size and SHA-256. Their licenses apply to your use and distribution: read them before use, and keep each model's license and notice files when you distribute model files with a game. Model names do not grant trademark or endorsement rights.

**FLUX.2 Klein 4B profile** (`Samples/The Ember Forge/Profiles/FLUX2Klein4B`, and new profiles created with **Create model profile**):

| Role | Repository and revision | License |
| --- | --- | --- |
| Source model | `black-forest-labs/FLUX.2-klein-4B@e7b7dc27f91deacad38e78976d1f2b499d76a294` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/LICENSE.md) |
| Generator GGUF | `leejet/FLUX.2-klein-4B-GGUF@3b1f5a9dc3abb32238b053aeb3d823c30afdacbd` | [Apache-2.0](https://huggingface.co/leejet/FLUX.2-klein-4B-GGUF/tree/3b1f5a9dc3abb32238b053aeb3d823c30afdacbd) |
| Text encoder GGUF (Qwen3-4B) | `unsloth/Qwen3-4B-GGUF@22c9fc8a8c7700b76a1789366280a6a5a1ad1120` | [Apache-2.0](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/22c9fc8a8c7700b76a1789366280a6a5a1ad1120) |
| VAE | `black-forest-labs/FLUX.2-small-decoder@a3efc24f613ef42d9428af62fdbd6f5fd8856c4a` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-small-decoder/tree/a3efc24f613ef42d9428af62fdbd6f5fd8856c4a) |

**U²-Netp foreground model.** **Tools > Runtime Image Forge > Install Foreground Model** (also in Overview and the foreground profile Inspector) downloads the ONNX export of [Xuebin Qin's U²-Netp](https://github.com/xuebinqin/U-2-Net/tree/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29) published in the [rembg release v0.0.0](https://github.com/danielgatis/rembg/releases/tag/v0.0.0) (`u2netp.onnx`, 4,574,861 bytes, SHA-256 `309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8`) together with the U²-Net Apache 2.0 license from the pinned revision ([`LICENSE`](https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE), 11,357 bytes, SHA-256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`). It stores them in `Assets/RuntimeImageForge/ForegroundModel` with a notice and copies the license and notice to `Assets/StreamingAssets/RuntimeImageForge/Licenses` for game builds. A different model or license file with the same name is kept; the notice is the command's own file and is rewritten. The model predicts a salient foreground object; complex scenes and fine edges can need a different cutout model.
