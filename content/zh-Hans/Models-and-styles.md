# 模型和风格

**模型配置**（`ForgeModelProfile`）规定使用哪些模型文件以及如何运行它们。**选项风格**（`ForgeStyleAsset`）规定玩家可以选择什么，以及这些选择如何组成提示词。**前景配置**（`ForegroundModelProfile`）用于设置可选的背景移除。The Ember Forge 示例中每一类都有现成可用的资源。

## 选项目录

`ForgeStyleAsset` 同时定义视觉方向和允许玩家做出的选择。每个字段有一个稳定的键；每个选项有键、显示名称和提示词文本。提示词模板使用 `{item}`、`{material}`、`{detail}` 等字段。请按键提交每个必需字段。未知选项和未解析的字段会被拒绝。

界面使用显示名称，存档数据使用键。例如显示**符文雕刻**，提交 `runes`，并展开为 **subtle engraved runes**。如果更改了已发布游戏中某个风格的含义，请修改 `styleVersion`。每张图像的配方会记录实际使用的提示词和全部设置，因此后续编辑不会改变先前的图像。

`Samples/The Ember Forge/Styles` 包含五个可编辑风格，均为 1024 × 1024、4 步、CFG 1：

| 风格 | 选项字段 | 背景 |
| --- | --- | --- |
| Illustrated Forge | item, material, detail | 移除；需要前景配置。示例场景使用此风格。 |
| Pixel Inspired Items | item, material, detail | 移除。 |
| Flat Icons | item, material, detail | 移除。 |
| Character Portraits | character, mood, palette | 保留。 |
| Environment Cards | location, time, weather | 保留。 |

这些是提示词预设。Pixel Inspired Items 只建议一种外观，不强制像素网格、精确调色板或动画一致性。负面提示词和目录限制会引导模型，但不保证特定结果。CFG 1 的蒸馏模型可能忽略负面提示词。

## 生成设置

宽度、高度、步数、引导强度和 Seed 都属于请求及其缓存键。随附的原生后端要求宽度和高度至少为 64 像素且能被 64 整除；不支持的设置会被拒绝，而不会被默默替换。更高的分辨率需要更多内存和时间。重复已记录的请求可复用其缓存的 PNG；在不同硬件或后端版本上使用相同的 Seed 并不保证像素完全相同。

模型配置的推荐值（采样器 `euler`、调度器 `flux2`、4 步、CFG 1、1024 × 1024）描述的是模型，不会修改风格。请选择设置适合该模型的风格。

## FLUX.2 Klein 4B 配置

`Samples/The Ember Forge/Profiles/FLUX2Klein4B` 以及通过**创建模型配置**新建的每个配置都使用 FLUX.2 Klein 4B（Apache-2.0）。该配置分别固定三个文件；每个条目都声明来源仓库修订版本、文件名、字节数、SHA-256 和许可证：

| 角色 | 文件 | 字节 |
| --- | --- | ---: |
| 生成器 | `flux-2-klein-4b-Q4_0.gguf` | 2,460,378,560 |
| 文本编码器（Qwen3-4B） | `Qwen3-4B-Q4_K_M.gguf` | 2,497,281,312 |
| VAE | `full_encoder_small_decoder.safetensors` | 249,519,092 |
| **合计** | | **5,207,178,964（5.21 GB / 4.85 GiB）** |

该配置使用 CPU 权重卸载，并在扩散模型中启用 flash attention，因此可在 6 GB 显存的 GPU 上运行。在经过测试的 RTX 3060 Laptop GPU（6 GB）和 32 GB 内存上，一张 1024 × 1024 图片（含背景移除）耗时约 17 秒，游戏进程最多占用约 6.3 GB 内存。这是经过测试的配置，而非最低要求。

在配置 Inspector 中，**下载并验证模型文件**会通过 HTTPS 下载这三个文件，并显示进度、支持取消；在游戏中请调用 `LocalForgeBackendSource.DownloadModelAsync`。**导入经过验证的模型文件**可从本地文件夹接收同样的三个文件。两种操作都会复用缓存中已验证的文件，选择配置绝不会开始下载。

上述大小只计算权重文件。原生 DLL、声明、导出的 PNG 和一个临时下载文件需要额外空间。文件大小不等于 RAM 或 VRAM 要求。

请在准备生成器之前更换配置。已准备的生成器只保留一个模型。在 Edit Mode 中选择其他配置之前，请停止未完成的工作并关闭生成器。

## 透明 PNG

独立物品请关闭**保留背景**，并为本地来源分配前景配置。生成后，前景处理器会预测主体对象的蒙版。结果是直通 alpha 的 RGBA；PNG 导出会保留该 alpha。

本包不包含抠图模型。**Tools > Runtime Image Forge > Install Foreground Model** 会下载 U²-Netp（4,574,861 字节，Apache-2.0）及其许可证，将其放入 `Assets/RuntimeImageForge/ForegroundModel`，并分配给等待它的前景配置。该模型只需在项目中安装一次，并会包含在游戏构建中，因此玩家无需另行下载。抠图在 GPU 上本地运行。U²-Netp 配置从名为 `1959` 的输出读取蒙版（**蒙版输出名称**）；对于只有一个输出的 ONNX 蒙版模型，请将该字段留空。

**细化细长物体**（`ForegroundModelProfile.refineUniformBackground`）可在均匀背景上单个独立物体的初始蒙版不完整时运行第二次处理。如果裁剪不合适或新蒙版未通过检查，处理器会保留初始蒙版。此选项有自己的缓存标识。示例的前景配置已启用此选项。

肖像、环境和完整插画请启用**保留背景**。这样会跳过抠图并保留整幅图片。两种模式都保存 PNG。没有前景配置时请使用 `ForgeBackgroundMode.KeepBackground`：透明请求会被拒绝，而不会默默返回不透明图片。

若要让玩家选择，请向 `PrepareAsync`、`Generate` 或风格的 `CreateRequest` 重载传入 `ForgeBackgroundMode.Transparent` 或 `ForgeBackgroundMode.KeepBackground`。`StyleDefault` 使用风格自身的设置。该选择只属于一个配方，不会修改共享风格。使用 `KeepBackground` 准备会跳过抠图预热；如果玩家之后选择透明，该订单还会加载抠图模型。

细轮廓、半透明材质、空隙、阴影和次要物体可能导致蒙版不完善。请用你的美术实际检查结果。背景移除生成的是 2D 图像，不会创建几何体，也不保证精灵轮廓干净。[导出指南](Exporting-images.md)介绍如何分享 PNG 及其配方。

## 使用自己的模型文件

配置也可以描述你自行提供的模型。如果文件在本地提供而非下载，请启用**仅导入**（`ForgeModelProfile.importOnly`）；此时下载 URL 可以留空。每个文件仍需准确的文件名、修订版本、字节数、SHA-256 和许可证信息，并且各组件的文件名在不区分大小写时也必须互不相同。关闭**独立组件文件**可描述单个 checkpoint 文件，而非独立的生成器、文本编码器和 VAE 文件。

在配置 Inspector 中选择**导入经过验证的模型文件**，然后选择直接包含这些文件的文件夹。导入器不会搜索子文件夹，也不会解压归档。它只复制固定的文件名，拒绝符号链接和目录联接，验证每个文件后将其安装到 `Application.persistentDataPath/RuntimeImageForge` 下的缓存中。它不会修改源文件。请为源文件和缓存副本预留足够空间。

**取消导入**会停止复制。已完成验证的文件仍可复用；未完成的副本会被删除。仅导入配置缺少文件时，绝不会触发网络下载。

在游戏中，请调用 `LocalForgeBackendSource.ImportModelPackAsync(selectedFolder, progress, cancellationToken)` 或 `ForgeModelCache.ImportProfileAsync(cacheRoot, profile, selectedFolder, progress, cancellationToken)`。对于仅导入配置，示例会显示 **IMPORT MODEL PACK**，并读取游戏可执行文件旁的 `RuntimeImageForgeModels` 文件夹（在编辑器中位于 `Assets` 旁），该文件夹通过 `LocalForgeBackendSource.ModelPackDirectory` 提供。

导入检查的是文件标识，而不是模型架构或图像质量。请使用随附后端支持的模型，并遵守你使用或分发的每个模型的许可证。

后端只内置一份分词器词表，即 CLIP 词表，供使用 CLIP 文本编码器的检查点（例如 Stable Diffusion 1.5）使用。对于 Qwen 文本编码器（例如 FLUX.2 Klein 的 Qwen3-4B 文件），后端会从 GGUF 文件中读取分词器，因此 Qwen 文本编码器必须是自带分词器的 GGUF 文件（llama.cpp 转换得到的文件即是如此）。文本编码器需要 T5、UMT5、Mistral 或 Gemma 分词器的模型（例如 FLUX.1、Stable Diffusion 3 和 Wan）不受支持：准备此类模型会失败，并在错误中指出缺少的分词器。

## 在编辑器中选择模型配置

在 **Tools > Runtime Image Forge > Overview** 中，将场景的 `LocalForgeBackendSource` 指定到**场景后端**，然后从**模型配置**中选择已保存的配置。本地后端的 Inspector 中也有同一列表。**打开模型配置**会打开其设置以及下载和导入操作。

选择器只更改该来源的引用，并支持撤销。它不会编辑配置或任何风格，不会移动模型文件，也不会更改已准备好的生成器。请先退出播放模式；编译、资源导入以及任何已就绪或正在准备的生成器都会阻止选择。
