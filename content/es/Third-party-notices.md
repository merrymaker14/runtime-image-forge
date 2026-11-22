# Componentes de terceros y condiciones de los modelos

Esta página enumera todo lo que Runtime Image Forge incluye de terceros, lo que se creó para el paquete y lo que el paquete puede descargar a petición. La misma lista está en `Third-Party Notices.txt`, en la carpeta del paquete.

## Incluido en este paquete

El motor nativo para Windows x64 de `Native/windows-x64` es una compilación modificada de [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp/tree/f89d9b13d730eabeede7314ce49dacd18d3c90c2), revisión `f89d9b13d730eabeede7314ce49dacd18d3c90c2`, con las bibliotecas que se indican a continuación. El instalador y el cargador comprueban cada DLL con una suma de comprobación SHA-256 fijada. Los textos completos de las licencias están en `ThirdParty`.

| Componente | Origen / licencia | Archivo de licencia en `ThirdParty` |
| --- | --- | --- |
| stable-diffusion.cpp | leejet, MIT; modificado por Strange Euphoria XR. | `stable-diffusion.cpp-LICENSE.txt`, `stable-diffusion.cpp-BINARY-LICENSE.txt`, `RuntimeImageForge-native-NOTICE.txt` |
| ggml | `d25b121ce1d6ae0c7e62ad080460d9fc1e46dd93`, MIT. | `ggml-LICENSE.txt` |
| libwebp / libsharpyuv | `0c9546f7efc61eac7f79ae115c3f99c91c21c443`, BSD 3-Clause con concesión de patentes. | `libwebp-COPYING.txt`, `libwebp-AUTHORS.txt`, `libwebp-PATENTS.txt` |
| libwebm | `5bf12267eea773a32fcf4949de52b0add158a8d5`, BSD 3-Clause con concesión de patentes. | `libwebm-LICENSE.txt`, `libwebm-AUTHORS.txt`, `libwebm-PATENTS.txt` |
| cpp-httplib | Yuji Hirose, MIT. | `cpp-httplib-LICENSE.txt` |
| nlohmann/json | 3.11.2, Niels Lohmann, MIT. | `nlohmann-json-LICENSE.txt` |
| darts-clone | BSD 3-Clause. | `darts-clone-LICENSE.txt` |
| Oniguruma | BSD 2-Clause. | `oniguruma-LICENSE.txt` |
| utf8proc | MIT y licencia de datos de Unicode. | `utf8proc-LICENSE.txt` |
| miniz, zip | MIT. | `miniz-LICENSE.txt`, `zip-LICENSE.txt` |
| stb image utilities | Sean Barrett, MIT o dominio público. | `stb-LICENSE.txt` |

**Tools > Runtime Image Forge > Install Windows Backend** (que también ejecuta **Abrir el ejemplo The Ember Forge**) empaqueta las DLL en un archivo comprimido en `Assets/StreamingAssets/RuntimeImageForge` y copia estos archivos de licencia a `Assets/StreamingAssets/RuntimeImageForge/Licenses`, para que acompañen al juego compilado. El archivo comprimido del motor escrito por otra versión del paquete se reemplaza; los demás archivos existentes con otro contenido se conservan en lugar de sobrescribirse. Conserva estos avisos cuando distribuyas un juego que contenga el motor.

## Creado para este paquete

Strange Euphoria XR creó para Runtime Image Forge todos los demás archivos: el código fuente en C#, las ventanas del Editor, los iconos y el logotipo, la documentación y el ejemplo The Ember Forge con su escena, sus scripts, sus perfiles de modelo y de estilo y la ilustración del taller. La ilustración del taller se creó con la generación de imágenes de OpenAI. El paquete no contiene fuentes, audio, imágenes ni modelos de terceros.

## Usado desde tu instalación de Unity

Unity uGUI, TextMesh Pro Essential Resources y Unity Inference Engine son paquetes de Unity sujetos a sus propias condiciones, y este paquete no los redistribuye. El ejemplo usa la fuente predeterminada de TextMesh Pro incluida en TMP Essential Resources (Liberation Sans); su licencia se importa junto con ella en `Assets/TextMesh Pro/Fonts`. Conserva los avisos de los componentes de Unity cuando distribuyas un juego compilado.

## Se descarga solo si tú lo eliges

Los archivos de modelo no forman parte del paquete. Se descargan por HTTPS desde los repositorios de sus editores solo después de una acción explícita del desarrollador o del jugador, y cada archivo se comprueba con un tamaño y un SHA-256 fijados. Sus licencias rigen tu uso y tu distribución: léelas antes de usarlos y conserva los archivos de licencia y de aviso de cada modelo cuando distribuyas archivos de modelo con un juego. Los nombres de los modelos no conceden derechos de marca ni implican respaldo.

**Perfil FLUX.2 Klein 4B** (`Samples/The Ember Forge/Profiles/FLUX2Klein4B` y los perfiles nuevos creados con **Crear perfil de modelo**):

| Función | Repositorio y revisión | Licencia |
| --- | --- | --- |
| Modelo de origen | `black-forest-labs/FLUX.2-klein-4B@e7b7dc27f91deacad38e78976d1f2b499d76a294` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/LICENSE.md) |
| GGUF del generador | `leejet/FLUX.2-klein-4B-GGUF@3b1f5a9dc3abb32238b053aeb3d823c30afdacbd` | [Apache-2.0](https://huggingface.co/leejet/FLUX.2-klein-4B-GGUF/tree/3b1f5a9dc3abb32238b053aeb3d823c30afdacbd) |
| GGUF del codificador de texto (Qwen3-4B) | `unsloth/Qwen3-4B-GGUF@22c9fc8a8c7700b76a1789366280a6a5a1ad1120` | [Apache-2.0](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/22c9fc8a8c7700b76a1789366280a6a5a1ad1120) |
| VAE | `black-forest-labs/FLUX.2-small-decoder@a3efc24f613ef42d9428af62fdbd6f5fd8856c4a` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-small-decoder/tree/a3efc24f613ef42d9428af62fdbd6f5fd8856c4a) |

**Modelo de recorte U²-Netp.** **Tools > Runtime Image Forge > Install Foreground Model** (también disponible en Overview y en el Inspector del perfil de recorte) descarga la exportación ONNX de [U²-Netp de Xuebin Qin](https://github.com/xuebinqin/U-2-Net/tree/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29) publicada en la [versión v0.0.0 de rembg](https://github.com/danielgatis/rembg/releases/tag/v0.0.0) (`u2netp.onnx`, 4.574.861 bytes, SHA-256 `309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8`) junto con la licencia Apache 2.0 de U²-Net de la revisión fijada ([`LICENSE`](https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE), 11.357 bytes, SHA-256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`). Los guarda con un aviso en `Assets/RuntimeImageForge/ForegroundModel` y copia la licencia y el aviso a `Assets/StreamingAssets/RuntimeImageForge/Licenses` para las compilaciones del juego. Si ya existe un modelo o un archivo de licencia distinto con el mismo nombre, se conserva; el aviso es un archivo propio del comando y se reescribe. El modelo predice un objeto destacado en primer plano; las escenas complejas y los bordes finos pueden requerir otro modelo de recorte.
