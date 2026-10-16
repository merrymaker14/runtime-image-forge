# 快速入门

使用 Unity 6000.5 或更新版本。随附原生后端支持 Windows x64 和兼容 Vulkan 的 GPU；前景抠图使用 GPU Compute。Unity Inference Engine 2.6.1 作为软件包依赖安装。MCP 为可选功能。

后端以原生 DLL 在 Unity Editor 或 Windows Player 进程内运行。Runtime Image Forge 在加载本地库之前校验其固定 SHA-256。图像生成无需独立服务器、监听端口或 API 密钥。

原生库需要 Microsoft Visual C++ 2015–2022 Redistributable (x64)，大多数 Windows 电脑已经安装。缺少或版本过旧时，准备阶段会报告缺失原生依赖（关闭 **准备时预热** 时由第一个订单报告）；请从 Microsoft 安装最新版本后重启 Unity 或游戏。

## 安装并导入示例

1. 购买后在 **Package Manager > My Assets** 中安装 Runtime Image Forge，它会作为包安装。本地 `.tgz` 副本可通过 **Install package from tarball** 添加。
2. 从软件包的 **Samples** 选项卡导入 **Models and choice styles**。包含 Bonsai Ternary 4B、FLUX.2 Klein 4B 配置、前景配置、`Styles/NativeDistilled1024` 中的五个 Native1024 风格及原始可编辑预设。
3. 打开 **Tools > Runtime Image Forge > Overview**。退出播放模式后选择**安装 Windows 后端**。原生 DLL 归档与声明会复制到项目 StreamingAssets，并包含在 Windows Player 构建中。

权重需单独获取。Bonsai Ternary 4B 需要兼容的已转换平面模型包，固定权重共 4,642,526,382 字节（4.64 GB / 4.32 GiB）。FLUX.2 Klein 4B 的固定权重共 5,207,178,964 字节（5.21 GB / 4.85 GiB），可显式 HTTPS 下载或本地导入。引擎、声明、压缩包额外数据和临时副本需要额外空间。使用或重新分发前，请阅读[模型和风格](Models-and-styles.md)及所选配置的模型条款。

Bonsai 模型包可从 [itch.io 上的 The Ember Forge 页面](https://merrymaker14.itch.io/the-ember-forge) 免费下载：选择 **Runtime-Image-Forge-Bonsai-Models.zip**。其中只有三个权重文件及其声明和说明，不含可执行文件。解压后请保持 `RuntimeImageForgeModels` 文件夹完整。

发布游戏前，请在模型 Inspector 检查**全部模型权重**。开始下载前向玩家显示首次完整下载的大小。引擎文件和下载临时空间另计；权重文件大小不等于 RAM 或 VRAM 要求。

## 配置场景

创建场景对象，添加 `LocalForgeBackendSource` 与 `ForgeGenerator`。

- 在本地后端的**模型配置**中选择已导入的 `BonsaiTernary4B` 或 `FLUX2Klein4B` 资源。
- 将 U2NETP 配置分配给**前景蒙版**。其 ONNX 引用指向软件包随附模型。
- **Vulkan 设备**保持 `auto`，以选择合适本地 GPU。
- 将此来源分配给生成器的**后端来源**。启用**准备时预热**，准备一次且不保存预热图片。
- 首张图像选择 `Styles/NativeDistilled1024/IllustratedForgeNative1024`：1024 × 1024、4 步、CFG 1。选项键为 `item`、`material`、`detail`。选择配置不会修改风格设置。

准备前先打开所选模型配置。Bonsai 使用**导入经过验证的模型文件**并选择已转换的平面模型包。Klein 可选择**下载并验证模型文件**，或从本地文件夹导入三个固定文件。两种操作均显示进度并支持取消。缓存配置验证完成后可离线准备。请完成任务并关闭已准备好的生成器后，在 Edit Mode 更换配置。

Overview 中的**创建模型配置**、**创建前景配置**和**创建选项风格**会在所选 Assets 文件夹创建并选中资源，文件名不会重复覆盖。前景配置自动关联随附 ONNX 模型。新风格包含可编辑的物品、材料、细节目录。**现有风格 > 编辑所选风格**可打开已保存目录。也支持 **Assets > Create > Runtime Image Forge** 菜单；从该菜单创建的前景配置需手动分配 ONNX。

## 随附演示游戏

软件包包含 **The Ember Forge**：完整可编辑游戏场景、游戏源代码、工坊美术与独立配乐。Samples 文件随软件包下载，只有主动导入后才复制到项目 Assets。在 **Samples** 导入 **The Ember Forge**，然后选择 **Tools > Runtime Image Forge > Open The Ember Forge sample**。若项目没有 TMP 资源，该菜单会导入缺失的 TMP Essentials，随后打开场景并安装 Windows 原生 DLL 和声明。已有 TMP Settings 会保留。部分安装的 TMP 需先修复，其资源不会被覆盖。场景使用宿主项目的渲染与当前输入后端。示例已分配 `BonsaiTernary4B` 和 `IllustratedForgeNative1024`：1024 × 1024、4 步、CFG 1。若要使用 Klein，请在点击 Play 前在本地后端选择 `FLUX2Klein4B`；选择配置不会更改风格设置。游戏中 Bonsai 使用 **IMPORT MODEL PACK**，Klein 使用显式模型下载。

请仅保留一个已导入的示例版本。替换旧版本前备份修改文件。示例 README 说明内容与首次启动步骤。单独的 Windows 独立发行版无需 Unity 或此软件包即可运行。

在编辑器中运行示例时，请把解压后的 `RuntimeImageForgeModels` 文件夹放在项目 `Assets` 文件夹旁边，进入 Play Mode 并点击 **IMPORT MODEL PACK**。导入会复制并验证一次文件。

## 首次下载与订单

Klein 等 HTTPS 配置应将游戏的下载按钮连接到显式调用 `localSource.DownloadModelAsync(progress, token)`。Bonsai 等仅导入配置应显式调用 `localSource.ImportModelPackAsync(selectedFolder, progress, token)`。获取文件前向玩家显示完整权重大小、进度、取消及错误。请等待玩家选择后再获取模型文件。

若 `HasLocalModel` 已为 true，直接准备。先选择透明 PNG 或带背景 PNG，再调用 `generator.PrepareAsync(style, backgroundMode, token)`。准备会校验缓存文件、加载原生模型上下文并预热选定流程，不保存预热图像。带背景 PNG 会跳过前景模型预热。等到 `generator.IsReady` 再接受订单。

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

此代码片段使用 `System`、`System.Collections.Generic`、`StrangeEuphoriaXR.RuntimeImageForge`。`generator`、`style` 和 `inventoryImage` 代表已分配的组件与资源。界面使用精灵期间保留 `ownedImage`，替换图像或关闭视图时释放。生命周期与错误处理见 [API 指南](API.md)。

使用 `generator.ExportJobAsync(...)` 导出完成任务，或通过 `PngExporter` 导出现有 `PngArtifact`。导出保存已有图像，不会重新运行模型。

## 构建游戏

使用已配置场景构建 Windows x64 Player。保留 `StreamingAssets/RuntimeImageForge` 文件和声明。Bonsai 应提供游戏旁的兼容平面文件夹 `RuntimeImageForgeModels` 及本地导入操作；Klein 应提供显式 HTTPS 下载或本地导入。缓存文件验证完成后可供后续离线启动使用。重新分发模型包时请保留 LICENSE/NOTICE 和转换声明。恢复生成物品时请同时保存配方、内容哈希和 PNG。

编辑器 Inspector 与可选 MCP 不包含在 Player。公开游戏无需 MCP 服务器。修复与取消行为见[故障排查](Troubleshooting.md)。
