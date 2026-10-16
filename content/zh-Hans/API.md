# Runtime Image Forge API

命名空间：`StrangeEuphoriaXR.RuntimeImageForge`。

| 类型 | 用途 |
| --- | --- |
| `GenerationIdentity` | 精确的后端、模型与组件配置。 |
| `GenerationRequest` | 不可变的已应用设置与缓存键。 |
| `ChoiceStyle` | 复制目录并将所选值展开到已验证的模板中。 |
| `ForgeStyleAsset` | 可在 Inspector 编辑的选项目录和生成设置。 |
| `ForgeBackgroundMode` | 单个任务的风格默认模式、透明 PNG 或带背景 PNG。 |
| `IImageGenerationBackend` | 工作线程上的图像生成接口约定。 |
| `ForgeBackendSource` | 创建已配置后端的游戏组件。 |
| `ForgeGenerator` | 场景拥有的准备、任务、状态、取消与导出。 |
| `ForgeGenerationJob` | 保留的请求、状态、进度、完成信息与 PNG 标识。 |
| `LocalForgeBackendSource` | 固定版本模型下载与 Windows 原生后端设置。 |
| `ForgeModelProfile` | 扩散模型 URL、版本、校验值、长度与采样策略。 |
| `ForegroundModelProfile` | 已导入 ONNX 模型、预处理与输出策略。 |
| `IImageBackendPreparation` | 接受请求前的可选验证。 |
| `ForgeModelIntegrityException` | 模型缺失、不完整或哈希无效。 |
| `ProcessedImageBackend` | 串行生成后进行可选前景处理。 |
| `RawImageFrame` | 复制并拥有 RGB/RGBA 像素，记录原点与行跨度。 |
| `ImageGenerationQueue` | 有界 FIFO、取消、缓存与后端生命周期管理。 |
| `GenerationProgress` | 阶段及范围受限的进度比例。 |
| `PngArtifact` | 不可变 PNG、请求、内容 SHA-256 与缓存标记。 |
| `PngFileStore` | 验证键与 PNG 结构的原子磁盘缓存。 |
| `UnityPngEncoder` | 将 RGB/RGBA 转为带 sRGB 标记的 RGBA8 PNG。 |
| `UnityPngImage` | 拥有一个运行时纹理和精灵。 |
| `PngExporter` | 原子导出 PNG 或 PNG/配方组合，不覆盖无关文件。 |
| `ForgeExportPaths` | 游戏旁及持久数据目录的导出路径。 |

## 模型下载大小

模型 Inspector 显示全部固定权重的下载大小。`ForgeModelProfile.GetTotalDownloadBytes()` 验证配置并汇总所有必需的模型文件；组件配置还包括文本编码器和解码器。即使部分文件已缓存，返回值仍是首次完整下载的总量；下载器会复用经过验证的缓存文件。该总量不包括引擎文件和下载临时空间。GB 使用十进制单位：1 GB = 1,000,000,000 字节。

## 场景生成器

请在 Unity 主线程调用这些 API。在 Inspector 分配来源和配置。下载由游戏中的主动操作触发，与准备阶段分开。

`ConnectBackend` 会先初始化磁盘缓存，再创建队列，并接管 backend 的所有权。卸载或销毁生成器时，会取消任务，并在队列结束后关闭 backend；尚未激活的对象也遵循此规则。模型完整性错误会清除就绪状态、关闭旧队列，并将 `LocalForgeBackendSource.NeedsModelRepair` 设为 true。再次准备前，请显式修复所选配置：下载其固定 HTTPS 文件，或重新导入经过验证的本地模型包；仅导入配置必须使用本地导入。

`PngFileStore` 会协调不同实例和进程的提交。同一请求的相同 PNG 会被接受，不会替换已有文件。如果同一键已有有效但内容哈希不同的 PNG，则保留原文件并拒绝新提交；新结果请使用另一 seed。损坏的缓存 PNG 可以修复。缓存条目旁的小型 `.lock` 文件用于协调写入；生成器运行时请勿删除这些文件。

```csharp
await localSource.DownloadModelAsync(downloadProgress, cancellationToken);
var mode = ForgeBackgroundMode.Transparent; // Or KeepBackground; both produce PNG.
await generator.PrepareAsync(style, mode, cancellationToken);
var job = generator.Generate(style, choices, seed: 1234, backgroundMode: mode, token: cancellationToken);
await job.Completion;
if (job.State == "completed")
{
    var artifact = await generator.ReadArtifactAsync(job.Request, cancellationToken);
    var image = await UnityPngImage.CreateAsync(artifact, cancellationToken: cancellationToken);
    // Retain image while displaying image.Sprite; dispose it when replacing the icon.
    var bundle = await generator.ExportJobAsync(job.Id,
        ForgeExportPaths.DirectoryFor(ForgeExportLocation.BesideGame), "sword", cancellationToken);
}
```

`ForgeGenerationJob.Completion` 在任务进入 `completed`、`cancelled` 或 `failed` 时结束；请检查 `State` 与 `Error`。`CancelJob(id)` 取消未完成任务，`CancelPreparation()` 停止启动。生成器拥有队列并在场景卸载时关闭它。最多保留 64 条任务记录，PNG 存储在磁盘上。

`ForgeBackgroundMode.StyleDefault` 使用 `style.keepBackground`。`Transparent` 需要前景处理器，`KeepBackground` 跳过前景处理。准备与生成应传入相同模式，以便仅预热选定流程。准备带背景模式后再切换到透明模式，该任务会承担前景处理器首次使用的成本。模式覆盖不会修改共享风格资源。所选模式包含在请求、缓存键、保存记录和导出配方中。未配置处理器时，随附原生后端会拒绝透明请求。

若 `HasLocalModel` 为 true，则跳过下载并准备缓存副本。准备时会检查 SHA-256。`ForgeModelIntegrityException` 会标记该来源需要修复；主动下载成功后会清除标记。下载通过 `IProgress<float>` 报告进度比例。

## 生成图标

针对已配置的后端创建一次队列，并在该模型的生命周期内保留它：

```csharp
using System.Collections.Generic;
using System.IO;
using StrangeEuphoriaXR.RuntimeImageForge;
using UnityEngine;

// localSource is a LocalForgeBackendSource with a verified model; style is a configured asset.
await localSource.PrepareNativeAsync(cancellationToken);
var backend = localSource.CreateBackend();
var store = new PngFileStore(Path.Combine(Application.persistentDataPath, "GeneratedArt"));
var queue = new ImageGenerationQueue(backend, new UnityPngEncoder(), store);
var choices = new Dictionary<string, string>
{
    ["item"] = "sword",
    ["material"] = "steel",
    ["detail"] = "runes"
};
var request = style.CreateRequest(queue.Identity, choices, seed: 1234);
var artifact = await queue.GenerateAsync(request, cancellationToken: cancellationToken);
var image = await UnityPngImage.CreateAsync(artifact, cancellationToken: cancellationToken);
inventorySlot.sprite = image.Sprite;
// Retain image while the slot uses it. DisposeAsync releases its sprite and texture.
```

卸载模型时调用 `await queue.CloseAsync()`。每个 `UnityPngImage` 有独立生命周期，关闭队列不会销毁正在显示的图像。启用缓存时，`store.GetPath(request.CacheKey)` 返回缓存 PNG 路径。

示例中的选项键属于工坊风格；其他游戏可定义自己的目录。Seed 用于记录可复现请求，但更换模型、后端或硬件可能改变最终像素。

## 实现后端

队列存活期间保持 `GenerationIdentity` 稳定。`ComponentsSha256` 为完整模型及组件配置的 64 位十六进制摘要。配置应包括文本编码器、解码器及适配器设置。对于不支持的尺寸或设置应明确拒绝，不能默默修改已记录请求。

队列在工作线程串行调用 `GenerateAsync`。返回尺寸与请求完全一致的 `RawImageFrame`。构造函数会复制传入像素缓冲，因此原生缓冲可随后由其所属分配器释放。不要返回借用的原生内存，也不要在此方法中创建 UnityEngine 对象。

通过提供的 `IProgress<GenerationProgress>` 报告进度，完成后不保留观察者。模型执行与后处理期间应响应取消，并在 `Dispose()` 释放原生资源。队列只在最后一次原生操作结束后调用 `Dispose`。

容量不足时会同步抛出 `QueueCapacityException`。后端失败会使该任务的 Task 进入错误状态；取消会取消 Task 并阻止发布结果。游戏界面应处理这些情况并保留之前成功的图像。

## 游戏存档

保存完整的 `GenerationRequest` 配方、缓存键、PNG 及内容哈希。演示的 `ForgeWorkshop.Receipt` 展示兼容 JSON 的记录，并验证恢复设置得到的键与存档键一致。这些是确定性内容标识，不是认证签名。被修改的记录会被拒绝，不会关联到另一张 PNG。

工坊先提交库存文件，再将图标加入可见收藏。提交期间禁用 Cancel 按钮。失败或取消的订单不会添加物品。损坏的库存会被保留，同时阻止新写入以保护存档。记录包含背景模式，Keep Background 肖像会恢复原始完整图像。
