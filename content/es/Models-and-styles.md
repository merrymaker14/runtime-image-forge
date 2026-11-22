# Modelos y estilos

Un **perfil de modelo** (`ForgeModelProfile`) indica qué archivos de modelo se usan y cómo se ejecutan. Un **estilo con opciones** (`ForgeStyleAsset`) indica qué pueden elegir los jugadores y cómo esas elecciones se convierten en un prompt. Un **perfil de recorte** (`ForegroundModelProfile`) configura la eliminación opcional del fondo. El ejemplo The Ember Forge incluye recursos de cada tipo listos para usar.

## Catálogos de opciones

Un `ForgeStyleAsset` define tanto la dirección visual como las opciones permitidas para el jugador. Cada campo tiene una clave estable; cada opción tiene una clave, una etiqueta visible y un texto de prompt. La plantilla del prompt usa campos como `{item}`, `{material}` y `{detail}`. Envía cada campo obligatorio por su clave. Se rechazan las opciones desconocidas y los campos sin resolver.

Usa las etiquetas en la interfaz y las claves en los datos guardados. Por ejemplo, muestra **Grabado rúnico**, envía `runes` y expándelo a **subtle engraved runes**. Cambia `styleVersion` cuando cambies el significado de un estilo que ya está en un juego publicado. El prompt aplicado y todos los ajustes se registran en la receta de cada imagen, así que las ediciones posteriores no cambian las imágenes anteriores.

`Samples/The Ember Forge/Styles` contiene cinco estilos editables, todos de 1024 × 1024, 4 pasos y CFG 1:

| Estilo | Campos de opción | Fondo |
| --- | --- | --- |
| Illustrated Forge | item, material, detail | Eliminado; requiere un perfil de recorte. Lo usa la escena del ejemplo. |
| Pixel Inspired Items | item, material, detail | Eliminado. |
| Flat Icons | item, material, detail | Eliminado. |
| Character Portraits | character, mood, palette | Conservado. |
| Environment Cards | location, time, weather | Conservado. |

Son presets de prompt. Pixel Inspired Items sugiere un aspecto; no impone una cuadrícula de píxeles, una paleta exacta ni coherencia en la animación. Los prompts negativos y las restricciones del catálogo orientan al modelo, pero no garantizan un resultado concreto. Los modelos destilados con CFG 1 pueden ignorar un prompt negativo.

## Ajustes de generación

La anchura, la altura, los pasos, la guía y la semilla forman parte de la solicitud y de su clave de caché. El motor nativo incluido requiere que la anchura y la altura sean de al menos 64 píxeles y divisibles entre 64; rechaza los ajustes no admitidos en lugar de sustituirlos sin avisar. Las resoluciones más altas necesitan más memoria y tiempo. Repetir una solicitud registrada puede reutilizar su PNG en caché; la misma semilla en otro hardware o con otra versión del motor no garantiza píxeles idénticos.

Los valores recomendados del perfil de modelo (muestreador `euler`, planificador `flux2`, 4 pasos, CFG 1, 1024 × 1024) describen el modelo; no cambian ningún estilo. Elige un estilo cuyos ajustes se adapten al modelo.

## El perfil FLUX.2 Klein 4B

`Samples/The Ember Forge/Profiles/FLUX2Klein4B` y cada perfil nuevo creado con **Crear perfil de modelo** usan FLUX.2 Klein 4B (Apache-2.0). El perfil fija tres archivos por separado; cada entrada declara la revisión del repositorio de origen, el nombre de archivo, el número de bytes, el SHA-256 y la licencia:

| Función | Archivo | Bytes |
| --- | --- | ---: |
| Generador | `flux-2-klein-4b-Q4_0.gguf` | 2.460.378.560 |
| Codificador de texto (Qwen3-4B) | `Qwen3-4B-Q4_K_M.gguf` | 2.497.281.312 |
| VAE | `full_encoder_small_decoder.safetensors` | 249.519.092 |
| **Total** | | **5.207.178.964 (5,21 GB / 4,85 GiB)** |

El perfil funciona con traslado de pesos a la CPU y flash attention en el modelo de difusión, por lo que cabe en una GPU con 6 GB de VRAM. En la RTX 3060 Laptop GPU (6 GB) con 32 GB de RAM en la que se hizo la prueba, una imagen de 1024 × 1024 tardó unos 17 segundos, incluida la eliminación del fondo, y el proceso del juego usó hasta unos 6,3 GB de RAM. Es una configuración probada, no un requisito mínimo.

En el Inspector del perfil, **Descargar archivos del modelo y verificarlos** descarga los tres archivos por HTTPS con progreso y cancelación; en un juego, llama a `LocalForgeBackendSource.DownloadModelAsync`. **Importar archivos de modelo verificados** acepta los mismos tres archivos desde una carpeta local. Ambas acciones reutilizan los archivos que ya están verificados en la caché, y seleccionar un perfil nunca inicia una descarga.

Los tamaños anteriores solo cuentan los archivos de pesos. Las DLL nativas, los avisos, los PNG exportados y un archivo temporal de descarga necesitan espacio adicional. El tamaño de los archivos no es un requisito de RAM ni de VRAM.

Cambia el perfil antes de preparar un generador. Un generador preparado mantiene un único modelo. Detén el trabajo pendiente y cierra el generador antes de seleccionar otro perfil en Edit Mode.

## PNG transparentes

Desactiva **Conservar fondo** para los objetos aislados y asigna un perfil de recorte a la fuente local. Después de la generación, el procesador de primer plano predice una máscara del objeto principal. El resultado es RGBA con alfa directo; la exportación PNG conserva ese alfa.

El paquete no incluye el modelo de recorte. **Tools > Runtime Image Forge > Install Foreground Model** descarga U²-Netp (4.574.861 bytes, Apache-2.0) con su licencia, lo coloca en `Assets/RuntimeImageForge/ForegroundModel` y lo asigna a los perfiles de recorte que lo esperan. El modelo se instala una sola vez en el proyecto y se incluye en las compilaciones del juego, así que los jugadores no lo descargan por separado. El recorte se ejecuta localmente en la GPU. El perfil de U²-Netp lee la máscara de la salida llamada `1959` (**Nombre de la salida de máscara**); deja ese campo vacío para un modelo ONNX de máscara con una sola salida.

**Refinar objetos delgados** (`ForegroundModelProfile.refineUniformBackground`) puede ejecutar una segunda pasada para un objeto aislado sobre un fondo uniforme cuando la primera máscara está incompleta. El procesador conserva la primera máscara si el encuadre no es adecuado o si la nueva máscara no supera sus comprobaciones. Esta opción tiene su propia identidad de caché. El perfil de recorte del ejemplo la tiene activada.

Activa **Conservar fondo** para retratos, entornos e ilustraciones completas. Así se omite el recorte y se conserva toda la imagen. Ambos modos guardan PNG. Sin perfil de recorte, usa `ForgeBackgroundMode.KeepBackground`: una solicitud transparente se rechaza en lugar de devolver sin avisar una imagen opaca.

Para que el jugador elija, pasa `ForgeBackgroundMode.Transparent` o `ForgeBackgroundMode.KeepBackground` a `PrepareAsync`, `Generate` o la sobrecarga `CreateRequest` del estilo. `StyleDefault` usa el ajuste propio del estilo. La elección pertenece a una receta y no edita el estilo compartido. Preparar con `KeepBackground` omite el calentamiento del recorte; si el jugador elige después la transparencia, ese pedido también carga el modelo de recorte.

Los contornos finos, los materiales translúcidos, los huecos, las sombras y los objetos secundarios pueden producir máscaras imperfectas. Comprueba resultados reales con tu arte. La eliminación del fondo produce una imagen 2D; no crea geometría ni garantiza contornos de sprite limpios. La [guía de exportación](Exporting-images.md) explica cómo compartir el PNG y su receta.

## Usar tus propios archivos de modelo

Un perfil también puede describir un modelo que proporciones tú mismo. Activa **Solo importación** (`ForgeModelProfile.importOnly`) cuando los archivos se entreguen localmente en lugar de descargarse; en ese caso, las URL de descarga pueden quedar vacías. Cada archivo sigue necesitando su nombre exacto, su revisión, su número de bytes, su SHA-256 y la información de su licencia, y los nombres de los archivos de componentes deben ser distintos incluso sin distinguir mayúsculas de minúsculas. Desactiva **Archivos separados de componentes** para describir un único archivo de checkpoint en lugar de archivos separados de generador, codificador de texto y VAE.

En el Inspector del perfil, elige **Importar archivos de modelo verificados** y selecciona la carpeta que contiene directamente los archivos. El importador no busca en subcarpetas ni descomprime archivos comprimidos. Copia solo los nombres de archivo fijados, rechaza los enlaces simbólicos y las uniones de directorios, verifica cada archivo y lo instala en la caché de `Application.persistentDataPath/RuntimeImageForge`. No modifica los archivos de origen. Reserva espacio suficiente para los archivos de origen y para la copia en caché.

**Cancelar importación** detiene la copia. Los archivos verificados completados siguen siendo reutilizables; la copia sin terminar se elimina. La falta de archivos en un perfil de solo importación nunca inicia una descarga por red.

En un juego, llama a `LocalForgeBackendSource.ImportModelPackAsync(selectedFolder, progress, cancellationToken)` o a `ForgeModelCache.ImportProfileAsync(cacheRoot, profile, selectedFolder, progress, cancellationToken)`. Con un perfil de solo importación, el ejemplo muestra **IMPORT MODEL PACK** y lee la carpeta `RuntimeImageForgeModels` situada junto al ejecutable del juego (junto a `Assets` en el Editor), disponible como `LocalForgeBackendSource.ModelPackDirectory`.

La importación comprueba la identidad de los archivos, no la arquitectura del modelo ni la calidad de las imágenes. Usa un modelo compatible con el motor incluido y respeta la licencia de cada modelo que uses o distribuyas.

## Elegir un perfil de modelo en el Editor

En **Tools > Runtime Image Forge > Overview**, asigna el `LocalForgeBackendSource` de la escena a **Backend de la escena** y elige un perfil guardado en **Perfil del modelo**. La misma lista está disponible en el Inspector del motor local. **Abrir perfil del modelo** abre sus ajustes y sus acciones de descarga e importación.

El selector solo cambia la referencia de esa fuente y admite deshacer. No edita el perfil ni ningún estilo, no mueve archivos de modelo y no cambia un generador que ya esté preparado. Sal primero del modo Play; la compilación, la importación de recursos y cualquier generador listo o en preparación bloquean la selección.
