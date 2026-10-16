# Herramientas de agentes del editor (MCP)

La integración opcional utiliza el servidor MCP de Unity CLI y `com.unity.pipeline` 0.8.0-exp.1 o posterior. Su ensamblado solo se compila si ese paquete está instalado. Runtime Image Forge no necesita MCP para generar o exportar en un juego.

1. Instala Unity CLI y Pipeline en el proyecto.
2. Abre **Tools → Runtime Image Forge → Agent tools (MCP)**. Copia la configuración y permite generación, cancelación y exportación de Forge para esta sesión.
3. Abre una escena con `ForgeGenerator` y fuente configurada. Entra en modo Play y prepara desde la interfaz del juego. Descargar modelos requiere una acción explícita en esa interfaz.
4. Conecta el cliente MCP. Comando: `unity mcp --project-path <absolute project path>`.

| Comando | Uso |
| --- | --- |
| `forge_status` | IDs de sesión y preparación de los generadores. |
| `forge_styles` | GUID de estilos editables y opciones permitidas en orden de campos. |
| `forge_generate` | GUID, claves ordenadas, semilla no negativa y `background_mode` opcional; devuelve ID de trabajo inmediatamente. |
| `forge_job_status` | Estado queued, running, completed, cancelled o failed y etapa actual. |
| `forge_cancel` | Cancela un trabajo del generador elegido. |
| `forge_export` | Exporta PNG y receta terminados a `Assets/Generated/RuntimeImageForge` y los importa. |

Pasa `generator_id` si hay varios generadores. El ID pertenece a un componente de escena activo; consúltalo de nuevo tras salir de Play o recargar. Se conservan hasta 64 trabajos recientes; la cola de generación tiene su propio límite. Los PNG permanecen en disco.

Los comandos Forge no aceptan rutas de salida arbitrarias, cambian perfiles, descargan pesos ni instalan paquetes. Personaliza modelos y estilos en los inspectores de Unity. `background_mode` acepta `style` por defecto, `transparent` o `keep`; afecta a un pedido sin editar el estilo. El estado incluye `remove_background`. El modo entra en receta y caché. Una solicitud transparente requiere modelo de máscara configurado.

La conexión MCP también expone comandos generales de Unity Editor. Conecta clientes de confianza y utiliza sus permisos. Las herramientas Forge son solo del Editor y no se incluyen en juegos. La exportación del jugador usa `PngExporter` sin servicio de red ni cliente MCP.
