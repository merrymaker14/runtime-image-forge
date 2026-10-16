# Modelos y estilos

El ejemplo The Ember Forge usa Bonsai Ternary 4B por defecto. El paquete independiente para Windows incluye su carpeta plana `RuntimeImageForgeModels` junto al juego; pulsa **IMPORT MODEL PACK** una vez para copiarla y verificarla. Al mover el paquete, conserva esa carpeta y los avisos originales. Los pesos se suministran por separado del paquete Unity; importa el paquete compatible de Bonsai o selecciona Klein para obtenerlo explícitamente mediante HTTPS.

Los desarrolladores pueden descargar el mismo paquete Bonsai sin el juego: **Runtime-Image-Forge-Bonsai-Models.zip** en la [página de The Ember Forge](https://merrymaker14.itch.io/the-ember-forge).

## Catálogos de opciones

`ForgeStyleAsset` define dirección visual y opciones permitidas. Cada campo tiene una clave estable; cada opción, una clave, etiqueta visible y texto de prompt. La plantilla usa campos como `{item}`, `{material}` y `{detail}`. Envía todos los campos requeridos por clave. Se rechazan opciones desconocidas y campos sin resolver.

Usa etiquetas en la interfaz y claves en los datos guardados. Por ejemplo, muestra **Grabado rúnico**, envía `runes` y expándelo a **subtle engraved runes**. Cambia `styleVersion` si cambia el significado de un estilo publicado. El prompt aplicado y los ajustes completos se registran en la receta: las ediciones posteriores no reescriben imágenes anteriores.

El ejemplo importado contiene:

| Estilo | Campos | Fondo |
| --- | --- | --- |
| Illustrated Forge | item, material, detail | Eliminado; requiere procesador de primer plano. |
| Pixel Inspired Items | item, material, detail | Eliminado. |
| Flat Icons | item, material, detail | Eliminado. |
| Character Portraits | character, mood, palette | Conservado. |
| Environment Cards | location, time, weather | Conservado. |

Son presets de prompt editables. Pixel Inspired Items sugiere un aspecto; no impone una cuadrícula de píxeles, paleta exacta o consistencia de animación. Los prompts negativos y el catálogo orientan al modelo, pero no garantizan un resultado concreto.

## Ajustes de generación

Anchura, altura, pasos, guía y semilla forman parte de la solicitud y de la clave de caché. Para Bonsai Ternary 4B y FLUX.2 Klein 4B, elige explícitamente un estilo de `Styles/NativeDistilled1024`: 1024 × 1024, 4 pasos y CFG 1. Ambos perfiles usan `euler` y `flux2`, traslado de pesos a la CPU y diffusion flash attention. Los valores recomendados del perfil no cambian el estilo automáticamente.

Los estilos originales siguen siendo presets editables de 512 × 512 para la receta anterior. El motor requiere al menos 64 píxeles y dimensiones divisibles entre 64; rechaza ajustes incompatibles en lugar de sustituirlos silenciosamente. Una resolución mayor puede necesitar más recursos. Repetir una solicitud registrada puede reutilizar su PNG; la misma semilla en otro hardware o versión no garantiza píxeles idénticos.

La opción `location=forge` del preset de entorno Native1024 describe un hogar de carbón encendido, un yunque grande y un martillo de herrero. Los prompts de pixel art e iconos planos orientan la apariencia, pero no imponen una cuadrícula ni una paleta exacta. Los modelos distilled con CFG 1 pueden ignorar los prompts negativos.

## Modelos e integridad

Los perfiles incluidos `BonsaiTernary4B` y `FLUX2Klein4B` fijan por separado generador, codificador de texto y VAE. Cada componente declara revisión exacta del repositorio de origen, nombre de archivo, bytes, SHA-256 y licencia. Los pesos se obtienen por separado del paquete de Unity.

| Perfil | Obtención | Pesos fijados completos |
| --- | --- | ---: |
| Bonsai Ternary 4B | Importar el paquete gratuito de modelos Bonsai (ver arriba). | 4.642.526.382 bytes (4,64 GB / 4,32 GiB). |
| FLUX.2 Klein 4B | Descarga HTTPS explícita o importación local. | 5.207.178.964 bytes (5,21 GB / 4,85 GiB). |

Bonsai usa un perfil de solo importación. Coloca `bonsai-ternary-transformer.gguf`, `bonsai-qwen3-hqq-affine.gguf` y `diffusion_pytorch_model.safetensors` directamente en la carpeta elegida. Los GGUF son archivos convertidos; los checkpoints originales de Gemlite no coinciden con el perfil. La importación no busca subcarpetas ni convierte checkpoints. Conserva los LICENSE/NOTICE originales y los avisos de conversión con el paquete de modelos.

Klein fija `flux-2-klein-4b-Q4_0.gguf`, `Qwen3-4B-Q4_K_M.gguf` y `full_encoder_small_decoder.safetensors`. En el Inspector, elige **Descargar archivos del modelo y verificarlos** para obtener los componentes HTTPS fijados con progreso y cancelación. **Importar archivos de modelo verificados** también acepta su carpeta local plana. Ambas acciones reutilizan archivos ya verificados en la caché elegida; seleccionar un perfil no inicia la obtención.

Los tamaños indicados suman los tres archivos de pesos requeridos. DLL, avisos, archivos comprimidos, PNG exportados y copias temporales requieren espacio adicional. La importación conserva el paquete original y crea otra copia en caché; reserva al menos otro volumen completo de pesos en la unidad de caché, más margen. El Inspector muestra la suma completa de pesos fijados. El tamaño de los archivos no equivale a un requisito de RAM o VRAM.

U2NETP ONNX es un modelo de primer plano independiente con Apache-2.0. El perfil original de DreamShaper permanece como preset anterior bajo CreativeML OpenRAIL-M. Las revisiones y condiciones están en [Avisos de terceros](Third-party-notices.md).

Cambia el perfil antes de preparar un generador. La cola preparada mantiene una identidad de backend. Termina los trabajos y cierra o libera el generador antes de seleccionar otro perfil guardado en Edit Mode.

## PNG transparentes

**Refinar objetos delgados** (`ForegroundModelProfile.refineUniformBackground`) puede ejecutar una segunda pasada para un objeto aislado sobre un fondo opaco uniforme cuando la primera máscara está incompleta. El procesador conserva la primera máscara si el recorte no es adecuado o la nueva máscara no supera las comprobaciones de conservación. La opción tiene una identidad de caché independiente. Revisa los bordes finos y las aberturas: el refinamiento no garantiza un recorte perfecto. Los perfiles de primer plano de la demo y del ejemplo de estilos activan esta opción.

Desactiva **Conservar fondo** para objetos aislados y asigna el perfil de máscara a la fuente local. Después de generar, el procesador predice una máscara del objeto destacado. El resultado es RGBA con alfa directo; la exportación PNG conserva ese alfa.

Activa **Conservar fondo** para retratos, entornos e ilustraciones completas. Omite el recorte y conserva toda la imagen. Ambos modos exportan PNG. Sin perfil de recorte, usa `ForgeBackgroundMode.KeepBackground`; el motor rechaza una solicitud transparente en lugar de devolver una imagen opaca sin avisar.

Para dar elección al jugador, pasa `ForgeBackgroundMode.Transparent` o `ForgeBackgroundMode.KeepBackground` a `PrepareAsync`, `Generate` o la sobrecarga `CreateRequest`. `StyleDefault` conserva el valor del recurso. La selección pertenece a una receta y no edita el estilo compartido. Preparar con `KeepBackground` omite el calentamiento del recorte; si luego se elige transparencia, ese pedido incluye su preparación inicial.

U2NETP está incluido: 4.615.341 bytes, unos 4,4 MiB, sin descarga adicional del jugador. Los volúmenes completos de pesos se indican arriba. El recorte es local y no tiene una tarifa API por imagen. Prepara la ruta transparente al iniciar; exportar un PNG existente solo copia sus bytes.

Contornos finos, materiales translúcidos, huecos, sombras y objetos secundarios pueden producir máscaras imperfectas. Comprueba resultados reales para tu arte. El recorte produce una imagen 2D, no geometría ni contornos de sprite garantizados. La [guía de exportación](Exporting-images.md) explica cómo compartir el PNG original y su receta.

## Importar un paquete local de modelos

Activa **Solo importación** (`ForgeModelProfile.importOnly`) cuando los archivos se suministren localmente. La opción está desactivada por defecto; los perfiles HTTPS existentes y sus identidades de generación no cambian. Estos perfiles pueden dejar vacías las URL de descarga. Cada archivo sigue necesitando nombre exacto, revisión, tamaño en bytes, SHA-256 e información de licencia. Los nombres de componentes deben ser distintos sin diferenciar mayúsculas de minúsculas.

En el inspector del perfil, elige **Importar archivos de modelo verificados** y selecciona la carpeta que contiene directamente los archivos. El importador no busca en subcarpetas ni descomprime archivos. Copia únicamente los nombres fijados, rechaza enlaces simbólicos y uniones de directorios, verifica cada archivo y lo instala en la caché de `Application.persistentDataPath/RuntimeImageForge`. No modifica los originales. La caché conserva su propia copia: reserva espacio para el paquete, la caché y un archivo temporal.

**Cancelar importación** detiene la copia. Los archivos verificados completados pueden reutilizarse; la copia incompleta se elimina. Un archivo válido en caché se reutiliza sin reemplazarlo. La falta de archivos de un perfil de solo importación nunca inicia una descarga de red.

En un juego, llama explícitamente a `ForgeModelCache.ImportProfileAsync(cacheRoot, profile, selectedFolder, progress, cancellationToken)` o `LocalForgeBackendSource.ImportModelPackAsync(selectedFolder, progress, cancellationToken)`. La acción **IMPORT MODEL PACK** de la demo usa `LocalForgeBackendSource.ModelPackDirectory`: la carpeta fija `RuntimeImageForgeModels` junto al ejecutable, o junto a `Assets` en el Editor. Coloca los archivos exactos del perfil directamente allí y selecciona la acción. La caché existente funciona sin conexión y sin conservar el paquete original.

La importación comprueba la identidad de los archivos, no la arquitectura ni la calidad de generación. Usa un backend compatible y conserva las licencias aplicables de los modelos.

## Elegir un perfil de modelo en el Editor

En **Tools → Runtime Image Forge → Overview**, asigna el `LocalForgeBackendSource` de la escena a **Backend de la escena** y elige un recurso guardado en **Perfil del modelo**. La misma lista aparece en el inspector del backend local. **Abrir perfil del modelo** muestra sus ajustes y la acción explícita de importación local.

La selección solo cambia la referencia de ese origen y admite deshacer/rehacer. No modifica perfiles ni estilos, no transfiere archivos y no cambia el backend de un generador existente. Sal primero del modo Play; la compilación, la importación de recursos y cualquier generador listo o en preparación bloquean la selección. Cierra o descarga los generadores preparados antes de cambiar de perfil y prepara el modelo elegido en la siguiente sesión del juego.

El perfil guardado necesita archivos correctamente fijados y una receta compatible con el backend. Aparecer en la lista no demuestra compatibilidad nativa ni calidad de imagen. Importa o descarga explícitamente los archivos exactos y comprueba que los estilos y ajustes del juego sean adecuados para el modelo.
