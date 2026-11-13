# Third-party components and model terms

Runtime Image Forge includes modified Windows x64 Vulkan native libraries based on [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp/tree/f89d9b13d730eabeede7314ce49dacd18d3c90c2), revision `f89d9b13d730eabeede7314ce49dacd18d3c90c2`. The native DLL runs inside the Unity process and reads FLUX.2 VAE normalization parameters from the selected model. The installer and loader verify the supplied local library files against pinned SHA-256 checksums. Keep the supplied notices with applications that redistribute this backend.

| Component | Source / license |
| --- | --- |
| stable-diffusion.cpp | Leejet, MIT; source link and binary release license notices supplied. |
| ggml | `d25b121ce1d6ae0c7e62ad080460d9fc1e46dd93`, MIT. |
| libwebp / libsharpyuv | `0c9546f7efc61eac7f79ae115c3f99c91c21c443`, BSD, authors and patent grant supplied. |
| libwebm | `5bf12267eea773a32fcf4949de52b0add158a8d5`, BSD, authors and patent grant supplied. |
| cpp-httplib | Yuji Hirose, MIT. |
| nlohmann/json | 3.11.2, Niels Lohmann, MIT. |
| darts-clone | BSD. |
| Oniguruma | BSD. |
| utf8proc | MIT and Unicode notices. |
| miniz / zip | Supplied MIT/public-domain notices. |
| stb image utilities | Sean Barrett, dual MIT/public-domain notice. |

Full text is in `ThirdParty`. **Tools → Runtime Image Forge → Install Windows Backend** packs the pinned DLLs into an archive in `Assets/StreamingAssets/RuntimeImageForge` and copies those notices there for game builds. The command keeps different existing files instead of overwriting them.

The foreground-removal model is not included in the package. On the developer's request, **Tools → Runtime Image Forge → Install Foreground Model** (also in Overview and the foreground profile Inspector) downloads the ONNX export of [Xuebin Qin's U²-Netp](https://github.com/xuebinqin/U-2-Net/tree/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29) published in the [rembg release v0.0.0](https://github.com/danielgatis/rembg/releases/tag/v0.0.0) (`u2netp.onnx`, 4,574,861 bytes, SHA-256 `309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8`) and the U²-Net Apache 2.0 license from the pinned revision ([`LICENSE`](https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE), 11,357 bytes, SHA-256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`). It stores them in `Assets/RuntimeImageForge/ForegroundModel` with a notice and copies the license and notice to `Assets/StreamingAssets/RuntimeImageForge/Licenses` for game builds. A different model or license file with the same name is kept; the notice is the command's own file and is rewritten. The model predicts a salient foreground object; complex scenes and fine edges can need a different cutout model.

Bonsai Ternary 4B and FLUX.2 Klein 4B are supplied as component-profile presets. Weight files are separate from the Unity package: Bonsai requires a compatible converted local pack; Klein permits explicit downloads of its pinned HTTPS components or local import.

| Preset/component | Exact source repository and revision | Declared terms |
| --- | --- | --- |
| Bonsai — generator | `prism-ml/bonsai-image-ternary-4B-gemlite-2bit@bf047aa80569f193d2c4960033af6ba2629988fa` | [Apache-2.0](https://huggingface.co/prism-ml/bonsai-image-ternary-4B-gemlite-2bit/blob/bf047aa80569f193d2c4960033af6ba2629988fa/LICENSE) |
| Bonsai — encoder + VAE | `prism-ml/bonsai-image-binary-4B-gemlite-1bit@121529b06562ff8c5b75aa34c54c371d2655929b` | [Apache-2.0](https://huggingface.co/prism-ml/bonsai-image-binary-4B-gemlite-1bit/blob/121529b06562ff8c5b75aa34c54c371d2655929b/LICENSE) |
| Klein — source model | `black-forest-labs/FLUX.2-klein-4B@e7b7dc27f91deacad38e78976d1f2b499d76a294` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/LICENSE.md) |
| Klein — generator GGUF | `leejet/FLUX.2-klein-4B-GGUF@3b1f5a9dc3abb32238b053aeb3d823c30afdacbd` | [Apache-2.0](https://huggingface.co/leejet/FLUX.2-klein-4B-GGUF/tree/3b1f5a9dc3abb32238b053aeb3d823c30afdacbd) |
| Klein — encoder GGUF | `unsloth/Qwen3-4B-GGUF@22c9fc8a8c7700b76a1789366280a6a5a1ad1120` | [Apache-2.0](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/22c9fc8a8c7700b76a1789366280a6a5a1ad1120) |
| Klein — VAE | `black-forest-labs/FLUX.2-small-decoder@a3efc24f613ef42d9428af62fdbd6f5fd8856c4a` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-small-decoder/tree/a3efc24f613ef42d9428af62fdbd6f5fd8856c4a) |

The Bonsai generator and text encoder GGUF files are converted representations of the listed source revisions; its VAE is unchanged. The original Prism LICENSE/NOTICE and the conversion notices must accompany a redistributed pack. Prism's NOTICE identifies FLUX.2 Klein 4B by Black Forest Labs and Qwen3-4B by Alibaba Cloud as source works. Preserve notices supplied with the Klein GGUF components as well. Read the complete model terms before use or redistribution; model names do not grant trademark or endorsement rights. [Models and styles](Models-and-styles.md) lists required filenames, acquisition and weight totals.

The original DreamShaper 8 LCM preset retains `Lykon/dreamshaper-8-lcm@4645d8bc6a8e6b106d21606d63e8460cdad4f1a6` under CreativeML OpenRAIL-M. Its weights are acquired separately. The package does not include the license text; read it with the model ([CreativeML OpenRAIL-M](https://huggingface.co/spaces/CompVis/stable-diffusion-license/blob/main/license.txt)) and preserve it if using or redistributing that legacy profile.

Unity, Unity Inference Engine and other Unity packages retain their own terms and are not redistributed by this package. The companion setup uses Unity uGUI and TMP Essential Resources from your Unity installation (Unity Companion License); TMP Essentials includes the Liberation Sans font license in Assets/TextMesh Pro/Fonts. Preserve the notices of Unity components when redistributing a built game.
