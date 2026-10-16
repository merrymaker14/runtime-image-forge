# 第三方组件与模型条款

Runtime Image Forge 随附基于 [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp/tree/f89d9b13d730eabeede7314ce49dacd18d3c90c2)、revision `f89d9b13d730eabeede7314ce49dacd18d3c90c2` 修改的 Windows x64 Vulkan 原生库。原生 DLL 在 Unity 进程内运行，并从所选模型读取 FLUX.2 VAE 归一化参数。安装器和加载器会校验随附本地库的固定 SHA-256。重新分发此后端的应用应保留随附声明。

| 组件 | 来源 / 许可证 |
| --- | --- |
| stable-diffusion.cpp | Leejet，MIT；随附源码来源和发行声明。 |
| ggml | `d25b121ce1d6ae0c7e62ad080460d9fc1e46dd93`，MIT。 |
| libwebp / libsharpyuv | `0c9546f7efc61eac7f79ae115c3f99c91c21c443`，BSD；随附作者和专利授权。 |
| libwebm | `5bf12267eea773a32fcf4949de52b0add158a8d5`，BSD；随附作者和专利授权。 |
| cpp-httplib | Yuji Hirose，MIT。 |
| darts-clone | BSD。 |
| Oniguruma | BSD。 |
| utf8proc | MIT 和 Unicode 声明。 |
| miniz / zip | 随附 MIT / 公共领域声明。 |
| stb image utilities | Sean Barrett，MIT / 公共领域双重声明。 |

完整原文位于 `ThirdParty~`。**Tools → Runtime Image Forge → Install Windows Backend** 将这些声明和固定版本压缩包复制到 `Assets/StreamingAssets/RuntimeImageForge`，供游戏构建使用。命令会保留内容不同的现有文件，不会覆盖。

包中随附的小型背景移除模型是 [Xuebin Qin 的 U²-Netp](https://github.com/xuebinqin/U-2-Net/tree/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29) 的 ONNX 导出，采用 Apache 2.0。来源、checkpoint 校验和、导出细节及完整许可证位于 `Runtime/Models/U2NetP-320.onnx` 旁边，并包含在复制的声明中。它预测显著前景对象；复杂场景和精细边缘可能需要其他抠图模型。

Bonsai Ternary 4B 和 FLUX.2 Klein 4B 以组件配置预设随附。权重文件与 Unity 软件包分开获取：Bonsai 需要兼容的已转换本地模型包；Klein 支持显式下载固定 HTTPS 组件或本地导入。

| 预设/组件 | 精确来源仓库及修订版本 | 声明条款 |
| --- | --- | --- |
| Bonsai — 生成器 | `prism-ml/bonsai-image-ternary-4B-gemlite-2bit@bf047aa80569f193d2c4960033af6ba2629988fa` | [Apache-2.0](https://huggingface.co/prism-ml/bonsai-image-ternary-4B-gemlite-2bit/blob/bf047aa80569f193d2c4960033af6ba2629988fa/LICENSE) |
| Bonsai — 文本编码器与 VAE | `prism-ml/bonsai-image-binary-4B-gemlite-1bit@121529b06562ff8c5b75aa34c54c371d2655929b` | [Apache-2.0](https://huggingface.co/prism-ml/bonsai-image-binary-4B-gemlite-1bit/blob/121529b06562ff8c5b75aa34c54c371d2655929b/LICENSE) |
| Klein — 原始模型 | `black-forest-labs/FLUX.2-klein-4B@e7b7dc27f91deacad38e78976d1f2b499d76a294` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/LICENSE.md) |
| Klein — 生成器 GGUF | `leejet/FLUX.2-klein-4B-GGUF@3b1f5a9dc3abb32238b053aeb3d823c30afdacbd` | [Apache-2.0](https://huggingface.co/leejet/FLUX.2-klein-4B-GGUF/tree/3b1f5a9dc3abb32238b053aeb3d823c30afdacbd) |
| Klein — 文本编码器 GGUF | `unsloth/Qwen3-4B-GGUF@22c9fc8a8c7700b76a1789366280a6a5a1ad1120` | [Apache-2.0](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/22c9fc8a8c7700b76a1789366280a6a5a1ad1120) |
| Klein — VAE | `black-forest-labs/FLUX.2-small-decoder@a3efc24f613ef42d9428af62fdbd6f5fd8856c4a` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-small-decoder/tree/a3efc24f613ef42d9428af62fdbd6f5fd8856c4a) |

Bonsai 生成器和文本编码器 GGUF 是上述来源修订版本的转换形式，VAE 未修改。重新分发模型包时请保留 Prism 原始 LICENSE/NOTICE 和转换声明。Prism NOTICE 列明来源为 Black Forest Labs 的 FLUX.2 Klein 4B 与 Alibaba Cloud 的 Qwen3-4B。也请保留 Klein GGUF 组件的随附声明。使用或重新分发前请阅读完整条款；模型名称不授予商标权，也不表示作者认可。必要文件名、获取方式与权重大小见[模型和风格](Models-and-styles.md)。

原始 DreamShaper 8 LCM 预设继续固定 `Lykon/dreamshaper-8-lcm@4645d8bc6a8e6b106d21606d63e8460cdad4f1a6`，采用 CreativeML OpenRAIL-M，权重需单独获取。使用或重新分发此旧配置时请保留原始模型许可证。

Unity、Unity Inference Engine 和其他 Unity 包保留各自条款。配套游戏设置使用 Unity uGUI 和 TMP Essential Resources。`ThirdParty~/unity-ugui-notice.txt` 包含 Unity 版权声明，`ThirdParty~/unity-companion-license.txt` 包含完整 Unity Companion License 原文。后端安装操作会将两者复制到 StreamingAssets/RuntimeImageForge/Licenses。TMP Essentials 在 Assets/TextMesh Pro/Fonts 中包含 Liberation Sans 字体许可证。重新分发已构建游戏时请保留这些声明。
