# 快速入门

Runtime Image Forge 需要 Unity 6000.5 或更新版本、Windows x64、支持 Vulkan 的 GPU，以及 Microsoft Visual C++ 2015–2022 Redistributable (x64)。图像模型在 Unity Editor 或你的 Windows 游戏内运行，无需服务器、监听端口或 API 密钥。

## 1. 导入软件包

打开 **Package Manager > My Assets**，下载并导入 Runtime Image Forge。文件会放在 `Assets/StrangeEuphoriaXR/RuntimeImageForge`，Unity 会添加 Unity Inference Engine 2.6.1 和 Unity uGUI 2.5.0 软件包依赖。导入后 **Overview** 窗口会自动打开一次；之后可通过 **Tools > Runtime Image Forge > Overview** 重新打开。

## 2. 试玩 The Ember Forge

The Ember Forge 是一款完整、可编辑的物品制作游戏，位于 `Samples/The Ember Forge`。它展示了完整流程：选择物品、生成图片、保存到收藏并导出为 PNG。

1. 选择 **Tools > Runtime Image Forge > Open The Ember Forge sample**（或在 Overview 中选择**打开 The Ember Forge 示例**）。该命令会将 Windows 后端及其许可证声明安装到 `Assets/StreamingAssets/RuntimeImageForge`；如果项目没有 TMP Settings，还会导入 TMP Essential Resources；最后打开场景。已有的 TMP Settings 会保留；由其他版本软件包写入的后端归档会被替换。
2. 进入播放模式并选择 **DOWNLOAD MODEL**。示例使用 FLUX.2 Klein 4B：三个固定文件，共 5,207,178,964 字节（5.21 GB），通过 HTTPS 从 Hugging Face 下载，并经 SHA-256 校验。界面会显示进度，**CANCEL ORDER** 可停止下载。文件缓存在 `Application.persistentDataPath/RuntimeImageForge` 下，因此之后的启动可离线运行。
3. 选择物品、材质和细节，然后点击 **FORGE MY ITEM**。在经过测试的 RTX 3060 Laptop GPU（6 GB 显存）上，一张 1024 × 1024 图片（含背景移除）约需 17 秒。耗时取决于 GPU、驱动程序以及 GPU 上的其他工作负载。
4. 在收藏中选择物品，并使用导出控件保存其 PNG 和配方。

如需透明 PNG 图标，请在进入播放模式前选择 **Tools > Runtime Image Forge > Install Foreground Model**。该命令会从 GitHub 上公开的 rembg 发布版下载 U²-Netp 抠图模型（4.6 MB）及其许可证，将它们放入 `Assets/RuntimeImageForge/ForegroundModel`，并把模型分配给示例的前景配置。未安装该模型时，示例只提供带背景的 PNG。

## 3. 在场景中添加生成器

1. 创建场景对象，并添加 `LocalForgeBackendSource` 和 `ForgeGenerator`。
2. 在本地来源的**模型配置**中选择 `Samples/The Ember Forge/Profiles/FLUX2Klein4B`。Overview 中的**创建模型配置**会在你选择的文件夹中新建一个配置，其 FLUX.2 Klein 4B 设置与此相同。
3. 如需透明 PNG，请将 `Samples/The Ember Forge/Profiles/U2NetPForeground` 分配给**前景蒙版**，并按上文所述安装抠图模型。
4. **Vulkan 设备**保持为 `auto`，以选择合适的 GPU。
5. 将该来源分配给生成器的**后端来源**。保持启用**准备时预热**：这样准备阶段会运行一次预热生成，且不保存其图片。
6. 从 `Samples/The Ember Forge/Styles` 中选择一个风格，例如 `IllustratedForgeNative1024`（1024 × 1024、4 步、CFG 1，选项键为 `item`、`material` 和 `detail`），或使用 Overview 中的**创建选项风格**创建自己的风格。

编辑配置或风格之前，请先将其复制到你自己的文件夹（选中后按 Ctrl+D，再移动副本）。软件包更新会替换 `Assets/StrangeEuphoriaXR/RuntimeImageForge` 内的文件。

在编辑器中，模型配置的 Inspector 提供**下载并验证模型文件**，可显示进度并支持取消，因此你可以在进入播放模式前填充缓存。

## 4. 首次下载与第一张图像

只有在玩家同意后才开始下载。请先显示完整大小：`profile.GetTotalDownloadBytes()` 返回固定权重的总大小。如果 `localSource.HasLocalModel` 已为 true，则跳过下载。

```csharp
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StrangeEuphoriaXR.RuntimeImageForge;
using UnityEngine;
using UnityEngine.UI;

public sealed class FirstImage : MonoBehaviour
{
    [SerializeField] private LocalForgeBackendSource localSource;
    [SerializeField] private ForgeGenerator generator;
    [SerializeField] private ForgeStyleAsset style;
    [SerializeField] private Image inventoryImage;
    private UnityPngImage ownedImage;

    // Call this from your button after the player has seen the download size.
    public async Task ForgeAsync(CancellationToken token)
    {
        if (!localSource.HasLocalModel)
            await localSource.DownloadModelAsync(new Progress<float>(p => Debug.Log($"Download {p:P0}")), token);

        var backgroundMode = ForgeBackgroundMode.Transparent; // Use KeepBackground to skip the cutout.
        await generator.PrepareAsync(style, backgroundMode, token);

        var choices = new Dictionary<string, string> { ["item"] = "sword", ["material"] = "steel", ["detail"] = "runes" };
        var job = generator.Generate(style, choices, 1234, backgroundMode, token);
        await job.Completion;
        if (job.State != "completed") throw new InvalidOperationException(job.Error ?? job.State);

        var artifact = await generator.ReadArtifactAsync(job.Request, token);
        ownedImage?.Dispose();
        ownedImage = await UnityPngImage.CreateAsync(artifact, cancellationToken: token);
        inventoryImage.sprite = ownedImage.Sprite;
    }

    private void OnDestroy() => ownedImage?.Dispose();
}
```

`PrepareAsync` 会校验缓存的文件、加载模型并预热所选流程。请等待其完成后再接受订单。界面显示其精灵期间请保留 `ownedImage`，替换图像时将其释放。[运行时 API](API.md) 指南介绍任务状态、取消和图像生命周期。

使用 `generator.ExportJobAsync(...)` 导出已完成的任务，或使用 `PngExporter` 导出现有的 `PngArtifact`。导出会复制已完成的像素，不会再次运行模型。参见[保存与导出](Exporting-images.md)。

## 5. 构建游戏

使用你的场景构建 Windows x64 Player。请保留后端安装器放入 `Assets/StreamingAssets/RuntimeImageForge` 的文件，包括许可证声明。游戏必须在首次生成前提供显式的模型下载（或模型文件的本地导入）；之后会离线复用已验证的文件。随游戏分发模型文件时，请保留模型的许可证声明。

编辑器窗口和可选的 MCP 工具仅在编辑器中使用，不会包含在 Player 构建中。下载、准备和取消方面的问题请参见[故障排查](Troubleshooting.md)。
