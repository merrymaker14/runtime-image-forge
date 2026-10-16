# Editor agent tools (MCP)

The optional MCP integration uses the Unity CLI's MCP server and `com.unity.pipeline` 0.8.0-exp.1 or newer. The integration assembly compiles only when that package is installed. Runtime Image Forge does not require MCP for generation or exporting in a game.

1. Install the Unity CLI and the Pipeline package in the project.
2. Open **Tools → Runtime Image Forge → Agent tools (MCP)**. Copy the client configuration and enable Forge generation, cancellation and export for this Editor session.
3. Open a scene with a `ForgeGenerator` and its configured backend source. Enter Play Mode and prepare the generator through the game UI. Model downloads require the explicit download action in that UI.
4. Connect your MCP client. The server command is `unity mcp --project-path <absolute project path>`.

| Command | Use |
| --- | --- |
| `forge_status` | List scene generator session IDs and their readiness. |
| `forge_styles` | List editable style asset GUIDs and their allowed choices in field order. |
| `forge_generate` | Submit a style GUID, ordered choice keys, a non-negative seed and optional `background_mode`. Returns a job ID immediately. |
| `forge_job_status` | Read the queued, running, completed, cancelled or failed state and current stage. |
| `forge_cancel` | Cancel a job belonging to the selected generator. |
| `forge_export` | Export a completed job's PNG and recipe into `Assets/Generated/RuntimeImageForge` and import them. |

Pass `generator_id` if the scene contains multiple generators. A session ID belongs to one live scene component; query it again after exiting Play Mode or reloading the scene. The generator retains metadata for up to 64 recent jobs; generation has a separate bounded queue. Stored PNGs remain on disk.

The supplied Forge commands do not accept arbitrary output paths, change model profiles, download weights or install packages. Model/style customization uses ordinary Unity inspectors. `background_mode` accepts `style` (default), `transparent`, or `keep`; it overrides one order without editing the style. Job status includes the applied `remove_background` value. The setting is part of the saved recipe and cache key. A transparent order requires a configured foreground model.

The Unity MCP connection also exposes general Unity Editor commands. Connect trusted clients and use their permission settings. These Forge tools are Editor-only and excluded from game builds. Player-facing export uses `PngExporter` and works without a network service or MCP client.
