# 模型和风格

The Ember Forge 示例默认使用 Bonsai Ternary 4B。独立 Windows 游戏包在游戏旁包含平铺的 `RuntimeImageForgeModels` 文件夹；首次点击 **IMPORT MODEL PACK** 以复制并验证文件。移动游戏包时，请保留该文件夹及原始声明。Unity 软件包不包含模型权重；请导入兼容的 Bonsai 模型包，或选择 Klein 配置并明确启动 HTTPS 下载。

开发者可以单独下载同一 Bonsai 模型包，无需下载游戏：[The Ember Forge 页面](https://merrymaker14.itch.io/the-ember-forge) 上的 **Runtime-Image-Forge-Bonsai-Models.zip**。

## 选项目录

`ForgeStyleAsset` 同时定义视觉方向和允许玩家选择的内容。每个字段有稳定键，每个选项有键、显示名称和提示词文本。模板使用 `{item}`、`{material}`、`{detail}` 等字段。提交时应按键提供所有必需字段。未知选项或未展开字段会被拒绝。

界面使用显示名称，存档使用键。例如显示**符文雕刻**，提交 `runes`，展开为 **subtle engraved runes**。已发布风格的含义改变时，应修改 `styleVersion`。每张图的配方记录实际提示词和全部设置，后续编辑不会改写先前图像。

导入示例包含：

| 风格 | 选项字段 | 背景 |
| --- | --- | --- |
| Illustrated Forge | item, material, detail | 移除，需要前景处理器。 |
| Pixel Inspired Items | item, material, detail | 移除。 |
| Flat Icons | item, material, detail | 移除。 |
| Character Portraits | character, mood, palette | 保留。 |
| Environment Cards | location, time, weather | 保留。 |

这些是可编辑提示词预设。Pixel Inspired Items 只建议视觉外观，不强制像素网格、精确调色板或动画一致性。负面提示词和目录约束会引导模型，但不保证具体结果。

## 生成设置

宽度、高度、步数、引导强度和 Seed 都属于请求及缓存键。Bonsai Ternary 4B 与 FLUX.2 Klein 4B 应明确选择 `Styles/NativeDistilled1024` 中的风格：1024 × 1024、4 步、CFG 1。两个模型配置使用 `euler`、`flux2`、CPU 权重卸载和 diffusion flash attention。配置的推荐值不会自动修改风格。

原始风格仍为旧生成参数提供可编辑的 512 × 512 预设。原生后端要求尺寸至少 64 像素且能被 64 整除；不支持的设置会被拒绝，不会默默替换。更高分辨率可能需要更多资源。重复已记录请求可复用 PNG 缓存，但不同硬件或后端版本上的相同 Seed 不保证相同像素。

Native1024 环境预设的 `location=forge` 选项描述燃烧的煤炉、大型铁砧和锻造锤。像素艺术和扁平图标提示词只建议视觉方向，并不强制像素网格或精确调色板。CFG 1 的蒸馏模型可能忽略负面提示词。

## 模型和完整性

随附 `BonsaiTernary4B` 与 `FLUX2Klein4B` 配置分别固定生成器、文本编码器和 VAE。每个组件均声明来源仓库的精确修订版本、文件名、字节数、SHA-256 和许可证。权重与 Unity 软件包分开获取。

| 配置 | 获取方式 | 固定权重总量 |
| --- | --- | ---: |
| Bonsai Ternary 4B | 导入免费的 Bonsai 模型包（见上文）。 | 4,642,526,382 字节（4.64 GB / 4.32 GiB）。 |
| FLUX.2 Klein 4B | 显式 HTTPS 下载或本地导入。 | 5,207,178,964 字节（5.21 GB / 4.85 GiB）。 |

Bonsai 配置使用仅导入模式。将 `bonsai-ternary-transformer.gguf`、`bonsai-qwen3-hqq-affine.gguf` 和 `diffusion_pytorch_model.safetensors` 直接放入所选文件夹。GGUF 已经过转换，原始 Gemlite checkpoint 与此配置不匹配。导入操作不会搜索子文件夹或转换 checkpoint。请随模型包保留原始 LICENSE/NOTICE 和转换声明。

Klein 固定 `flux-2-klein-4b-Q4_0.gguf`、`Qwen3-4B-Q4_K_M.gguf` 和 `full_encoder_small_decoder.safetensors`。在配置 Inspector 中点击**下载并验证模型文件**，可显式获取固定 HTTPS 组件，并查看进度或取消。**导入经过验证的模型文件**也支持这些文件的平面本地文件夹。两种操作均复用所选缓存中已验证的文件；选择模型配置不会开始获取文件。

上述大小只计算三个必要的权重文件。DLL、声明、压缩包、导出 PNG 和临时副本需要额外空间。导入会保留源模型包并创建另一份缓存副本；缓存磁盘至少还需一套完整权重的空间，并留有余量。模型 Inspector 会显示完整的固定权重总量。权重文件大小不等于 RAM 或 VRAM 要求。

随附 U2NETP ONNX 是独立的 Apache-2.0 前景模型。原始 DreamShaper 配置仍作为 CreativeML OpenRAIL-M 许可的旧预设保留。精确来源修订版本和条款见[第三方声明](Third-party-notices.md)。

准备生成器前请更换模型配置。已准备队列保持一个后端标识。请先完成任务并关闭或卸载生成器，再在 Edit Mode 选择另一个已保存的配置。

## 透明 PNG

当均匀不透明背景上的单个独立物体在初始蒙版中不完整时，**细化细长物体**（`ForegroundModelProfile.refineUniformBackground`）可运行第二次前景处理。如果裁剪不合适或新蒙版未通过保留检查，处理器会保留初始蒙版。该选项具有独立的缓存标识。请检查细边缘和孔洞；细化不能保证完美抠图。演示游戏和风格示例的前景模型配置已启用此选项。

独立物品请关闭**保留背景**，并在本地来源分配前景配置。生成后，处理器预测显著物体蒙版。结果为直通 alpha RGBA，PNG 导出保留 alpha。

肖像、环境与完整插画请启用**保留背景**。此模式跳过前景处理并保留整幅图。两种模式都导出 PNG。没有分配前景配置时选择 `ForgeBackgroundMode.KeepBackground`；随附后端会拒绝透明请求，而不是默默返回不透明图像。

若玩家可选择模式，则向 `PrepareAsync`、`Generate` 或风格 `CreateRequest` 重载传入 `ForgeBackgroundMode.Transparent` 或 `ForgeBackgroundMode.KeepBackground`。`StyleDefault` 保留资源默认值。覆盖属于单个配方，不修改共享风格。用 `KeepBackground` 准备会跳过前景预热；后来选透明模式时，该订单包含前景模型首次准备成本。

U2NETP 随包提供，4,615,341 字节，约 4.4 MiB，玩家无需额外下载。完整模型权重大小见上表。抠图在本地运行，没有按图计费的 API。请在准备阶段预热透明流程；导出已有 PNG 只复制字节。

细轮廓、半透明材质、空隙、阴影和附带物体可能导致不完善的蒙版。应验证符合美术方向的实际输出。抠图只生成 2D 图像，不创建几何体，也不保证精灵边缘完全干净。分享原始 PNG 和配方的方法见[导出指南](Exporting-images.md)。

## 导入本地模型包

本地提供模型文件时，启用 **仅导入**（`ForgeModelProfile.importOnly`）。此选项默认关闭；现有 HTTPS 配置及其生成标识保持不变。仅导入配置的下载 URL 可以留空。每个文件仍需准确的文件名、版本、字节数、SHA-256 及许可证信息。各组件的文件名必须不同，且不区分大小写。

在配置检查器中选择 **导入经过验证的模型文件**，然后选择直接包含文件的文件夹。导入器不会搜索子文件夹或解压归档。它只复制配置固定的文件名，拒绝符号链接和目录联接，验证每个文件后将其安装到 `Application.persistentDataPath/RuntimeImageForge` 缓存中，不修改源文件。缓存会保留独立副本，请为源模型包、缓存和一个临时文件预留空间。

使用 **取消导入** 停止复制。已完成验证的文件可以重复使用；未完成的副本会被删除。缓存中有效的文件将直接复用，不会被替换。仅导入配置缺少文件时，绝不会启动网络下载。

在游戏中显式调用 `ForgeModelCache.ImportProfileAsync(cacheRoot, profile, selectedFolder, progress, cancellationToken)` 或 `LocalForgeBackendSource.ImportModelPackAsync(selectedFolder, progress, cancellationToken)`。演示游戏的 **IMPORT MODEL PACK** 操作使用 `LocalForgeBackendSource.ModelPackDirectory`：可执行文件旁的固定文件夹 `RuntimeImageForgeModels`，在编辑器中则位于 `Assets` 旁。将配置要求的准确文件直接放入该文件夹后选择此操作。已有缓存可离线使用，无需保留源模型包。

导入检查的是文件标识，不证明模型架构兼容性或生成质量。请使用兼容的后端，并保留适用的模型许可证。

## 在编辑器中选择模型配置

在 **Tools → Runtime Image Forge → Overview** 中，将场景的 `LocalForgeBackendSource` 指定到**场景后端**，再从**模型配置**列表选择已保存的资源。本地后端检查器也提供同一列表。**打开模型配置**会显示其设置及显式本地导入操作。

选择仅更改该来源的引用，并支持撤销和重做。它不会修改配置或样式、传输模型文件，也不会更改现有生成器的后端。请先退出播放模式；编译、资源导入及任何已就绪或正在准备的生成器都会阻止选择。更改配置前请关闭或卸载已准备好的生成器，再于下一次游戏运行时准备所选模型。

已保存的配置必须具有有效的文件标识及后端支持的生成设置。出现在列表中并不能证明原生兼容性或图像质量。请显式导入或下载所需的准确文件，并确认游戏样式和设置适合该模型。
