# 第三方组件与模型条款

本页列出 Runtime Image Forge 中来自第三方的全部内容、为本包制作的内容，以及本包可按请求下载的内容。软件包文件夹中的 `Third-Party Notices.txt` 包含相同的列表。

## 本包包含的内容

`Native/windows-x64` 中的 Windows x64 原生后端是 [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp/tree/f89d9b13d730eabeede7314ce49dacd18d3c90c2)（修订版本 `f89d9b13d730eabeede7314ce49dacd18d3c90c2`）的修改版构建，并附带下列库。安装器和加载器会根据固定的 SHA-256 校验和检查每个 DLL。完整许可证文本位于 `ThirdParty`。

| 组件 | 来源 / 许可证 | `ThirdParty` 中的许可证文件 |
| --- | --- | --- |
| stable-diffusion.cpp | leejet，MIT；由 Strange Euphoria XR 修改。 | `stable-diffusion.cpp-LICENSE.txt`, `stable-diffusion.cpp-BINARY-LICENSE.txt`, `RuntimeImageForge-native-NOTICE.txt` |
| ggml | `d25b121ce1d6ae0c7e62ad080460d9fc1e46dd93`，MIT。 | `ggml-LICENSE.txt` |
| libwebp / libsharpyuv | `0c9546f7efc61eac7f79ae115c3f99c91c21c443`，BSD 3-Clause，附专利授权。 | `libwebp-COPYING.txt`, `libwebp-AUTHORS.txt`, `libwebp-PATENTS.txt` |
| libwebm | `5bf12267eea773a32fcf4949de52b0add158a8d5`，BSD 3-Clause，附专利授权。 | `libwebm-LICENSE.txt`, `libwebm-AUTHORS.txt`, `libwebm-PATENTS.txt` |
| cpp-httplib | Yuji Hirose，MIT。 | `cpp-httplib-LICENSE.txt` |
| nlohmann/json | 3.11.2，Niels Lohmann，MIT。 | `nlohmann-json-LICENSE.txt` |
| darts-clone | BSD 3-Clause。 | `darts-clone-LICENSE.txt` |
| Oniguruma | BSD 2-Clause。 | `oniguruma-LICENSE.txt` |
| utf8proc | MIT 和 Unicode 数据许可证。 | `utf8proc-LICENSE.txt` |
| miniz, zip | MIT。 | `miniz-LICENSE.txt`, `zip-LICENSE.txt` |
| stb image utilities | Sean Barrett，MIT 或公共领域。 | `stb-LICENSE.txt` |
| OpenAI CLIP 分词器词表 | 来自 [openai/CLIP](https://github.com/openai/CLIP/tree/d05afc436d78f1c48dc0dbf8e5980a9d471f35f6) 的 `bpe_simple_vocab_16e6`，MIT；内置于后端，供 CLIP 文本编码器使用。 | `openai-clip-LICENSE.txt` |

后端不包含其他分词器词表。对于 Qwen 文本编码器，后端会从该编码器的 GGUF 文件读取分词器；该文件随模型一起下载，并适用模型的许可证。

**Tools > Runtime Image Forge > Install Windows Backend**（**打开 The Ember Forge 示例**也会执行此安装）会将 DLL 打包为 `Assets/StreamingAssets/RuntimeImageForge` 中的归档，并把这些许可证文件复制到 `Assets/StreamingAssets/RuntimeImageForge/Licenses`，使其随构建的游戏一起提供。由其他版本软件包写入的后端归档会被替换；其他内容不同的现有文件会保留，而不会被覆盖。分发包含此后端的游戏时，请保留这些声明。

## 为本包制作的内容

其他所有文件均由 Strange Euphoria XR 为 Runtime Image Forge 制作：C# 源代码、编辑器窗口、图标和标志、文档，以及 The Ember Forge 示例（含场景、脚本、模型和风格配置以及工坊插画）。工坊插画使用 OpenAI 图像生成制作。本包不包含第三方字体、音频、图像或模型。

## 使用你的 Unity 安装中的组件

Unity uGUI、TextMesh Pro Essential Resources 和 Unity Inference Engine 是适用各自条款的 Unity 软件包，本包不会重新分发它们。示例使用 TMP Essential Resources 中的 TextMesh Pro 默认字体（Liberation Sans）；其字体许可证会随字体一起导入到 `Assets/TextMesh Pro/Fonts`。分发构建好的游戏时，请保留 Unity 组件的声明。

## 仅在你选择时下载

模型文件不属于本包。只有在开发者或玩家明确操作后，才会通过 HTTPS 从其发布者的仓库下载，并且每个文件都会根据固定的大小和 SHA-256 进行校验。你的使用和分发受其许可证约束：使用前请阅读许可证；随游戏分发模型文件时，请保留每个模型的许可证和声明文件。模型名称不授予商标权，也不表示获得认可。

**FLUX.2 Klein 4B 配置**（`Samples/The Ember Forge/Profiles/FLUX2Klein4B`，以及通过**创建模型配置**新建的配置）：

| 角色 | 仓库与修订版本 | 许可证 |
| --- | --- | --- |
| 原始模型 | `black-forest-labs/FLUX.2-klein-4B@e7b7dc27f91deacad38e78976d1f2b499d76a294` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/LICENSE.md) |
| 生成器 GGUF | `leejet/FLUX.2-klein-4B-GGUF@3b1f5a9dc3abb32238b053aeb3d823c30afdacbd` | [Apache-2.0](https://huggingface.co/leejet/FLUX.2-klein-4B-GGUF/tree/3b1f5a9dc3abb32238b053aeb3d823c30afdacbd) |
| 文本编码器 GGUF（Qwen3-4B） | `unsloth/Qwen3-4B-GGUF@22c9fc8a8c7700b76a1789366280a6a5a1ad1120` | [Apache-2.0](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/22c9fc8a8c7700b76a1789366280a6a5a1ad1120) |
| VAE | `black-forest-labs/FLUX.2-small-decoder@a3efc24f613ef42d9428af62fdbd6f5fd8856c4a` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-small-decoder/tree/a3efc24f613ef42d9428af62fdbd6f5fd8856c4a) |

**U²-Netp 抠图模型。** **Tools > Runtime Image Forge > Install Foreground Model**（Overview 和前景配置的 Inspector 中也提供）会下载 [rembg v0.0.0 发布版](https://github.com/danielgatis/rembg/releases/tag/v0.0.0)中提供的 [Xuebin Qin 的 U²-Netp](https://github.com/xuebinqin/U-2-Net/tree/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29) ONNX 导出（`u2netp.onnx`，4,574,861 字节，SHA-256 `309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8`），以及固定修订版本中的 U²-Net Apache 2.0 许可证（[`LICENSE`](https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE)，11,357 字节，SHA-256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`）。它会将这些文件连同一份声明保存到 `Assets/RuntimeImageForge/ForegroundModel`，并将许可证和声明复制到 `Assets/StreamingAssets/RuntimeImageForge/Licenses`，供游戏构建使用。同名但内容不同的模型或许可证文件会被保留；声明是该命令自己的文件，会被重写。该模型预测显著的前景对象；复杂场景和精细边缘可能需要其他抠图模型。
