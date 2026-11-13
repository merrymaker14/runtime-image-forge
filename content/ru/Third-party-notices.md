# Сторонние компоненты и условия моделей

Runtime Image Forge включает изменённые нативные библиотеки Windows x64 Vulkan на основе [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp/tree/f89d9b13d730eabeede7314ce49dacd18d3c90c2), ревизия `f89d9b13d730eabeede7314ce49dacd18d3c90c2`. Нативная DLL работает внутри процесса Unity и читает параметры нормализации FLUX.2 VAE из выбранной модели. Установщик и загрузчик сверяют поставляемые локальные библиотеки с закреплёнными SHA-256. Сохраняйте включённые уведомления в приложениях, распространяющих этот движок.

| Компонент | Источник / лицензия |
| --- | --- |
| stable-diffusion.cpp | Leejet, MIT; ссылка на исходный код и лицензионные уведомления бинарного выпуска включены. |
| ggml | `d25b121ce1d6ae0c7e62ad080460d9fc1e46dd93`, MIT. |
| libwebp / libsharpyuv | `0c9546f7efc61eac7f79ae115c3f99c91c21c443`, BSD; авторы и патентное разрешение включены. |
| libwebm | `5bf12267eea773a32fcf4949de52b0add158a8d5`, BSD; авторы и патентное разрешение включены. |
| cpp-httplib | Yuji Hirose, MIT. |
| nlohmann/json | 3.11.2, Niels Lohmann, MIT. |
| darts-clone | BSD. |
| Oniguruma | BSD. |
| utf8proc | MIT и уведомления Unicode. |
| miniz / zip | Включены уведомления MIT / public domain. |
| stb image utilities | Sean Barrett, двойное уведомление MIT / public domain. |

Полные оригинальные тексты находятся в `ThirdParty`. **Tools → Runtime Image Forge → Install Windows Backend** упаковывает закреплённые DLL в архив в `Assets/StreamingAssets/RuntimeImageForge` и копирует туда эти уведомления для сборок игры. Команда сохраняет отличающиеся существующие файлы, не перезаписывая их.

Модель удаления фона в пакет не входит. По запросу разработчика **Tools → Runtime Image Forge → Install Foreground Model** (та же кнопка есть в Overview и в инспекторе профиля маски) скачивает ONNX-экспорт [U²-Netp Xuebin Qin](https://github.com/xuebinqin/U-2-Net/tree/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29), опубликованный в [выпуске rembg v0.0.0](https://github.com/danielgatis/rembg/releases/tag/v0.0.0) (`u2netp.onnx`, 4 574 861 байт, SHA-256 `309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8`), и лицензию Apache 2.0 из закреплённой ревизии U²-Net ([`LICENSE`](https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE), 11 357 байт, SHA-256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`). Команда кладёт их с уведомлением в `Assets/RuntimeImageForge/ForegroundModel` и копирует лицензию и уведомление в `Assets/StreamingAssets/RuntimeImageForge/Licenses` для сборок игры. Модель или лицензия с тем же именем и другим содержимым сохраняются; уведомление — собственный файл команды, она его перезаписывает. Модель выделяет заметный объект переднего плана; сложные сцены и тонкие края могут потребовать другой модели удаления фона.

Bonsai Ternary 4B и FLUX.2 Klein 4B поставляются как компонентные presets. Файлы весов получаются отдельно от Unity-пакета: Bonsai требует совместимый преобразованный локальный пакет, Klein поддерживает явную загрузку закреплённых HTTPS-компонентов или локальный импорт.

| Preset/компонент | Точный исходный репозиторий и ревизия | Заявленная лицензия |
| --- | --- | --- |
| Bonsai — генератор | `prism-ml/bonsai-image-ternary-4B-gemlite-2bit@bf047aa80569f193d2c4960033af6ba2629988fa` | [Apache-2.0](https://huggingface.co/prism-ml/bonsai-image-ternary-4B-gemlite-2bit/blob/bf047aa80569f193d2c4960033af6ba2629988fa/LICENSE) |
| Bonsai — текстовый кодировщик и VAE | `prism-ml/bonsai-image-binary-4B-gemlite-1bit@121529b06562ff8c5b75aa34c54c371d2655929b` | [Apache-2.0](https://huggingface.co/prism-ml/bonsai-image-binary-4B-gemlite-1bit/blob/121529b06562ff8c5b75aa34c54c371d2655929b/LICENSE) |
| Klein — исходная модель | `black-forest-labs/FLUX.2-klein-4B@e7b7dc27f91deacad38e78976d1f2b499d76a294` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/LICENSE.md) |
| Klein — GGUF генератора | `leejet/FLUX.2-klein-4B-GGUF@3b1f5a9dc3abb32238b053aeb3d823c30afdacbd` | [Apache-2.0](https://huggingface.co/leejet/FLUX.2-klein-4B-GGUF/tree/3b1f5a9dc3abb32238b053aeb3d823c30afdacbd) |
| Klein — GGUF текстового кодировщика | `unsloth/Qwen3-4B-GGUF@22c9fc8a8c7700b76a1789366280a6a5a1ad1120` | [Apache-2.0](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/22c9fc8a8c7700b76a1789366280a6a5a1ad1120) |
| Klein — VAE | `black-forest-labs/FLUX.2-small-decoder@a3efc24f613ef42d9428af62fdbd6f5fd8856c4a` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-small-decoder/tree/a3efc24f613ef42d9428af62fdbd6f5fd8856c4a) |

GGUF генератора и текстового encoder Bonsai — преобразованные формы перечисленных исходных ревизий; VAE не изменён. При распространении пакета сохраняйте оригинальные Prism LICENSE/NOTICE и уведомления о преобразовании. Prism NOTICE указывает происхождение от FLUX.2 Klein 4B Black Forest Labs и Qwen3-4B Alibaba Cloud. Сохраняйте также уведомления компонентов Klein GGUF. До использования или распространения изучите полные условия моделей; имена моделей не предоставляют права на товарные знаки и не означают одобрения авторами. [Модели и стили](Models-and-styles.md) содержат имена обязательных файлов, получение и объёмы весов.

Исходный DreamShaper 8 LCM preset сохраняет `Lykon/dreamshaper-8-lcm@4645d8bc6a8e6b106d21606d63e8460cdad4f1a6` под CreativeML OpenRAIL-M. Его веса получаются отдельно. Текста лицензии в пакете нет: читайте его вместе с моделью ([CreativeML OpenRAIL-M](https://huggingface.co/spaces/CompVis/stable-diffusion-license/blob/main/license.txt)) и сохраняйте при использовании или распространении этого прежнего профиля.

Unity, Unity Inference Engine и другие пакеты Unity сохраняют собственные условия; этот пакет их не распространяет. Настройка companion game использует Unity uGUI и TMP Essential Resources из вашей установки Unity (Unity Companion License); TMP Essentials содержит лицензию шрифта Liberation Sans в Assets/TextMesh Pro/Fonts. Сохраняйте уведомления компонентов Unity при распространении собранной игры.
