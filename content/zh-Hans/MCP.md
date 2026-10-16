# 编辑器代理工具（MCP）

可选 MCP 集成使用 Unity CLI 的 MCP 服务器以及 `com.unity.pipeline` 0.8.0-exp.1 或更新版本。只有安装此包后才会编译集成程序集。Runtime Image Forge 在游戏中生成和导出无需 MCP。

1. 在项目安装 Unity CLI 和 Pipeline 软件包。
2. 打开 **Tools → Runtime Image Forge → Agent tools (MCP)**，复制客户端配置，并允许本次编辑器会话生成、取消与导出。
3. 打开带 `ForgeGenerator` 和已配置后端来源的场景。进入播放模式，通过游戏界面准备模型。模型下载需要界面中的主动下载操作。
4. 连接 MCP 客户端。服务器命令为 `unity mcp --project-path <absolute project path>`。

| 命令 | 用途 |
| --- | --- |
| `forge_status` | 列出场景生成器会话 ID 及就绪状态。 |
| `forge_styles` | 列出可编辑风格 GUID 及按字段顺序排列的允许选项。 |
| `forge_generate` | 提交风格 GUID、有序选项键、非负 Seed 和可选 `background_mode`，立即返回任务 ID。 |
| `forge_job_status` | 读取 queued、running、completed、cancelled、failed 状态与当前阶段。 |
| `forge_cancel` | 取消所选生成器的任务。 |
| `forge_export` | 将完成任务的 PNG 和配方导出到 `Assets/Generated/RuntimeImageForge` 并导入。 |

场景有多个生成器时请传入 `generator_id`。会话 ID 属于一个活跃场景组件，退出播放模式或重载场景后应重新查询。生成器最多保留 64 个近期任务的元数据；生成队列有独立容量上限。PNG 保存在磁盘。

Forge 命令不接受任意导出路径，也不会修改模型配置、下载权重或安装包。模型与风格通过普通 Unity Inspector 配置。`background_mode` 接受默认 `style`、`transparent` 或 `keep`，仅覆盖单个订单而不修改风格。任务状态包含实际 `remove_background`。模式属于保存配方与缓存键，透明订单需要已配置前景模型。

Unity MCP 连接也提供通用编辑器命令。请连接可信客户端并使用其权限设置。Forge 工具仅用于编辑器，不包含在游戏构建中。面向玩家的导出使用 `PngExporter`，无需网络服务或 MCP 客户端。
