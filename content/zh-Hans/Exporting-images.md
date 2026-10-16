# 导出生成图像

导出已完成 PNG，无需再次运行模型。透明度及原始 PNG 字节均保留。

```csharp
// artifact is the PngArtifact returned by ImageGenerationQueue.GenerateAsync.
string directory = ForgeExportPaths.DirectoryFor(ForgeExportLocation.BesideGame);
string png = await PngExporter.ExportPngAsync(artifact, directory, "my-sword.png", cancellationToken);

// A bundle contains image.png and recipe.json, committed together.
PngExportBundle bundle = await PngExporter.ExportBundleAsync(artifact, directory, "my-sword", cancellationToken);
```

在 Unity 主线程调用 `ForgeExportPaths.DirectoryFor`。若使用游戏自定导出位置，可直接向 `PngExporter` 传入绝对目录。`BesideGame` 写入可执行文件旁的 `Exports`，`SavedData` 使用 `Application.persistentDataPath` 内的 `Exports`。受保护安装目录可能禁止在游戏旁写入，此时应提供存档目录或文件夹选择器。

独立 PNG API 不覆盖已有文件。组合包名称包括请求与 PNG 摘要，重复相同导出会返回匹配的现有组合包。若现有组合包被修改，则保留它并使操作失败。路径分隔符、保留文件名和含符号链接的导出路径会被拒绝。

配方记录模型修订版本、后端版本、风格版本、Seed、提示词、尺寸、步数、guidance、缓存键和 PNG SHA-256。可只分享 PNG，也可分享组合包以提供生成设置。配方只是描述性元数据，不提供模型权重、可执行程序、3D 网格或跨硬件完全复现。不同后端版本与设备可能产生不同图像。

分发图像时遵守所选模型的输出条款。导出创建本地文件，不上传或向其他玩家发送。
