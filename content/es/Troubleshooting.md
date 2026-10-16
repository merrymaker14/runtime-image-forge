# Solución de problemas

| Síntoma | Acción |
| --- | --- |
| Falta el archivo nativo | Fuera de Play, elige **Tools > Runtime Image Forge > Install Windows Backend** y recompila el Player. |
| La descarga se detiene o falla | Comprueba internet, espacio y permisos. Reintenta con la acción explícita. Una descarga cancelada o fallida no sustituye un modelo válido. |
| Falla el hash del modelo | Sustituye la copia inválida mediante descarga HTTPS explícita o reimportación local verificada, según el perfil. Los perfiles de solo importación requieren importación local. No se acepta para generar hasta verificar su integridad. |
| Falla la preparación | Comprueba perfil, Windows x64, GPU Vulkan y archivos nativos. Consulta Console o Player log para la causa concreta. |
| Falta una dependencia nativa o está desactualizada | Instala la versión más reciente de Microsoft Visual C++ 2015–2022 Redistributable (x64) desde Microsoft y reinicia Unity o el juego. Si el mensaje continúa, actualiza el controlador gráfico. |
| Una ruta contiene un enlace simbólico o una unión | Mueve el proyecto, el juego, el paquete de modelos o la carpeta de exportación a una ubicación a la que se llegue sin enlaces simbólicos ni uniones de directorios. Esto incluye la carpeta de datos de la aplicación (`Application.persistentDataPath`) si se redirigió con una unión. Las carpetas sincronizadas en la nube, como OneDrive, no se consideran enlaces. |
| El siguiente pedido tras una cancelación tarda más | Cancelar la carga del modelo o una generación en curso libera el contexto nativo del modelo para recuperar su memoria. El siguiente pedido vuelve a cargar el modelo antes de generar. Cancelar un trabajo que aún espera en la cola no lo libera. |
| La preparación sigue en curso | La preparación verifica el checkpoint, carga el contexto nativo del modelo y calienta sin guardar. Muestra esta fase antes de aceptar pedidos. |
| Un trabajo cancelado sigue liberando recursos | Cancelar solicita detener la operación nativa e impide publicar su resultado. La cola conserva su espacio hasta que el trabajo nativo libere sus recursos. Espera a que termine antes de reutilizar o liberar el motor. |
| Una biblioteca nativa no supera la verificación | Cierra el juego o el Editor. Si se indica que el motor instalado está dañado, elimina la carpeta de su versión en `Application.persistentDataPath/RuntimeImageForge/Backends` y prepara de nuevo. Si falla la comprobación del archivo incluido, elimina `Assets/StreamingAssets/RuntimeImageForge/windows-vulkan.zip`, elige **Tools > Runtime Image Forge > Install Windows Backend** y vuelve a compilar el Player. El instalador nunca sobrescribe un archivo distinto ya existente. |
| Ya hay otra versión de la biblioteca nativa cargada | Reinicia el juego o Editor antes de cargar otra versión de la biblioteca nativa. |
| Un trabajo termina sin imagen | Consulta `ForgeGenerationJob.State` y `Error`; finalizar también incluye fallos y cancelaciones. Conserva la imagen correcta anterior. |
| Cola llena | Espera o cancela. El trabajo cancelado conserva su espacio hasta que el motor lo libere. |
| El PNG transparente conserva fondo | Asigna máscara y desactiva **Conservar fondo**. Comprueba contraste y máscara; la predicción puede dejar bordes imperfectos. |
| Falla exportar junto al juego | Usa datos persistentes o una carpeta escribible. La instalación protegida puede impedir escribir; se conservan archivos ajenos. |
| Se modificó un paquete exportado | Usa otro nombre o restaura el original. No se sobrescribe un paquete modificado. |
| Falta un objeto restaurado | Conserva PNG, clave original, receta y hash. Copiar solo el registro de inventario no copia la imagen. |
| MCP no encuentra generador | Abre la escena, entra en Play, prepara y permite operaciones Forge en esta sesión. Consulta `forge_status`. |
| Desaparece un ID MCP anterior | Los registros son acotados y pertenecen a una sesión. Guarda recibos/PNG a largo plazo; consigue un ID nuevo tras recargar. |

## Cancelar y liberar

Pasa un token de cancelación a preparación y generación. `CancelPreparation()` detiene el arranque y `CancelJob(id)` un trabajo incompleto. Cancelar impide publicar un resultado nuevo. `ImageGenerationQueue.CloseAsync()` cancela, espera a liberar el trabajo y elimina el motor. No elimines por separado un motor que ya pertenece a la cola.

Texturas y sprites tienen su propio ciclo de vida. Conserva el propietario `UnityPngImage` mientras se muestran y libéralo en el hilo Unity o con `DisposeAsync()`. Libera imágenes anteriores al sustituirlas; la caché en disco no limita las texturas retenidas por el juego.

## Requisitos y límites

La implementación incluida admite Windows x64, sin motor para macOS, Linux, móvil o WebGL. La configuración probada es RTX 3060 Laptop GPU con 6 GB de VRAM. Es un equipo probado, no una garantía para cualquier dispositivo con cierta memoria.

Los pesos de los modelos y las bibliotecas nativas se guardan en caché en `Application.persistentDataPath/RuntimeImageForge`; los PNG generados y la colección del juego complementario, en `Application.persistentDataPath/ForgeArt`. En el Editor es la carpeta de datos persistentes para los nombres de compañía y producto del proyecto, fuera del proyecto. Borra esas carpetas para eliminar los modelos y las imágenes en caché; cambiar el nombre de la compañía o del producto inicia una caché nueva.

La generación y el recorte comparten GPU con el juego. Usa colas acotadas, dimensiones moderadas y una fase explícita de carga; mide tu hardware y juego. Mantén los pesos grandes como descarga separada explícita. Los píxeles pueden no representar el objeto pedido o variar en calidad; el recorte puede necesitar limpieza manual.

Para soporte, incluye versión Unity, GPU/controlador, ID/revisión del modelo, ajustes, etapa y error pertinente de Console o Player log. Revisa los extractos antes de compartir rutas privadas o contenido del juego.
