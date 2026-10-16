# Componentes de terceros y condiciones de los modelos

Runtime Image Forge incluye bibliotecas nativas modificadas para Windows x64 Vulkan basadas en [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp/tree/f89d9b13d730eabeede7314ce49dacd18d3c90c2), revisión `f89d9b13d730eabeede7314ce49dacd18d3c90c2`. La DLL nativa se ejecuta dentro del proceso Unity y lee los parámetros de normalización de FLUX.2 VAE del modelo seleccionado. El instalador y el cargador verifican las bibliotecas locales incluidas con sus SHA-256 fijados. Conserva los avisos incluidos en las aplicaciones que redistribuyan este motor.

| Componente | Origen / licencia |
| --- | --- |
| stable-diffusion.cpp | Leejet, MIT; se incluyen el origen y el aviso de la versión. |
| ggml | `d25b121ce1d6ae0c7e62ad080460d9fc1e46dd93`, MIT. |
| libwebp / libsharpyuv | `0c9546f7efc61eac7f79ae115c3f99c91c21c443`, BSD; se incluyen autores y concesión de patentes. |
| libwebm | `5bf12267eea773a32fcf4949de52b0add158a8d5`, BSD; se incluyen autores y concesión de patentes. |
| cpp-httplib | Yuji Hirose, MIT. |
| darts-clone | BSD. |
| Oniguruma | BSD. |
| utf8proc | MIT y avisos Unicode. |
| miniz / zip | Avisos MIT / dominio público incluidos. |
| stb image utilities | Sean Barrett, aviso dual MIT / dominio público. |

Los textos originales completos están en `ThirdParty~`. **Tools → Runtime Image Forge → Install Windows Backend** copia esos avisos y el archivo fijado a `Assets/StreamingAssets/RuntimeImageForge` para las compilaciones del juego. El comando conserva los archivos existentes que sean diferentes, sin sobrescribirlos.

El pequeño modelo de eliminación de fondo incluido en el paquete es una exportación ONNX de [U²-Netp de Xuebin Qin](https://github.com/xuebinqin/U-2-Net/tree/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29), Apache 2.0. Su origen, suma de comprobación del checkpoint, detalles de exportación y licencia completa están junto a `Runtime/Models/U2NetP-320.onnx` y en los avisos copiados. Predice un objeto destacado en primer plano; las escenas complejas y los bordes finos pueden requerir otro modelo de recorte.

Bonsai Ternary 4B y FLUX.2 Klein 4B se incluyen como presets de perfiles por componentes. Los pesos son independientes del paquete de Unity: Bonsai requiere un paquete local convertido compatible; Klein permite descargas explícitas de sus componentes HTTPS fijados o importación local.

| Preset/componente | Repositorio y revisión exactos | Condiciones declaradas |
| --- | --- | --- |
| Bonsai — generador | `prism-ml/bonsai-image-ternary-4B-gemlite-2bit@bf047aa80569f193d2c4960033af6ba2629988fa` | [Apache-2.0](https://huggingface.co/prism-ml/bonsai-image-ternary-4B-gemlite-2bit/blob/bf047aa80569f193d2c4960033af6ba2629988fa/LICENSE) |
| Bonsai — codificador de texto y VAE | `prism-ml/bonsai-image-binary-4B-gemlite-1bit@121529b06562ff8c5b75aa34c54c371d2655929b` | [Apache-2.0](https://huggingface.co/prism-ml/bonsai-image-binary-4B-gemlite-1bit/blob/121529b06562ff8c5b75aa34c54c371d2655929b/LICENSE) |
| Klein — modelo de origen | `black-forest-labs/FLUX.2-klein-4B@e7b7dc27f91deacad38e78976d1f2b499d76a294` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/LICENSE.md) |
| Klein — GGUF del generador | `leejet/FLUX.2-klein-4B-GGUF@3b1f5a9dc3abb32238b053aeb3d823c30afdacbd` | [Apache-2.0](https://huggingface.co/leejet/FLUX.2-klein-4B-GGUF/tree/3b1f5a9dc3abb32238b053aeb3d823c30afdacbd) |
| Klein — GGUF del codificador de texto | `unsloth/Qwen3-4B-GGUF@22c9fc8a8c7700b76a1789366280a6a5a1ad1120` | [Apache-2.0](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/22c9fc8a8c7700b76a1789366280a6a5a1ad1120) |
| Klein — VAE | `black-forest-labs/FLUX.2-small-decoder@a3efc24f613ef42d9428af62fdbd6f5fd8856c4a` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-small-decoder/tree/a3efc24f613ef42d9428af62fdbd6f5fd8856c4a) |

Los GGUF del generador y codificador de texto de Bonsai son representaciones convertidas de las revisiones indicadas; el VAE no se modifica. Conserva los LICENSE/NOTICE originales de Prism y los avisos de conversión al redistribuir el paquete. El NOTICE de Prism identifica FLUX.2 Klein 4B de Black Forest Labs y Qwen3-4B de Alibaba Cloud como obras de origen. Conserva también los avisos de los componentes Klein GGUF. Lee las condiciones completas antes de usar o redistribuir; los nombres no conceden derechos de marca ni implican respaldo de los autores. [Modelos y estilos](Models-and-styles.md) indica archivos requeridos, obtención y volúmenes de pesos.

El preset original de DreamShaper 8 LCM conserva `Lykon/dreamshaper-8-lcm@4645d8bc6a8e6b106d21606d63e8460cdad4f1a6` bajo CreativeML OpenRAIL-M. Los pesos se obtienen por separado. Conserva la licencia original si utilizas o redistribuyes ese perfil anterior.

Unity, Unity Inference Engine y los demás paquetes Unity conservan sus propias condiciones. La configuración del juego complementario utiliza Unity uGUI y TMP Essential Resources. `ThirdParty~/unity-ugui-notice.txt` contiene el aviso de copyright de Unity y `ThirdParty~/unity-companion-license.txt` la Unity Companion License completa. La instalación del backend copia ambos a StreamingAssets/RuntimeImageForge/Licenses. TMP Essentials incluye la licencia de Liberation Sans en Assets/TextMesh Pro/Fonts. Conserva estos avisos al redistribuir un juego compilado.
