# Сторонние компоненты и условия моделей

На этой странице перечислено всё, что Runtime Image Forge получает от третьих сторон, что создано специально для пакета и что пакет может скачать по запросу. Тот же перечень есть в файле `Third-Party Notices.txt` в папке пакета.

## Входит в пакет

Нативный движок для Windows x64 в `Native/windows-x64` — изменённая сборка [stable-diffusion.cpp](https://github.com/leejet/stable-diffusion.cpp/tree/f89d9b13d730eabeede7314ce49dacd18d3c90c2), ревизия `f89d9b13d730eabeede7314ce49dacd18d3c90c2`, с перечисленными ниже библиотеками. Установщик и загрузчик сверяют каждую DLL с закреплённой контрольной суммой SHA-256. Полные тексты лицензий находятся в `ThirdParty`.

| Компонент | Источник / лицензия | Файл лицензии в `ThirdParty` |
| --- | --- | --- |
| stable-diffusion.cpp | leejet, MIT; изменён Strange Euphoria XR. | `stable-diffusion.cpp-LICENSE.txt`, `stable-diffusion.cpp-BINARY-LICENSE.txt`, `RuntimeImageForge-native-NOTICE.txt` |
| ggml | `d25b121ce1d6ae0c7e62ad080460d9fc1e46dd93`, MIT. | `ggml-LICENSE.txt` |
| libwebp / libsharpyuv | `0c9546f7efc61eac7f79ae115c3f99c91c21c443`, BSD 3-Clause с патентным разрешением. | `libwebp-COPYING.txt`, `libwebp-AUTHORS.txt`, `libwebp-PATENTS.txt` |
| libwebm | `5bf12267eea773a32fcf4949de52b0add158a8d5`, BSD 3-Clause с патентным разрешением. | `libwebm-LICENSE.txt`, `libwebm-AUTHORS.txt`, `libwebm-PATENTS.txt` |
| cpp-httplib | Yuji Hirose, MIT. | `cpp-httplib-LICENSE.txt` |
| nlohmann/json | 3.11.2, Niels Lohmann, MIT. | `nlohmann-json-LICENSE.txt` |
| darts-clone | BSD 3-Clause. | `darts-clone-LICENSE.txt` |
| Oniguruma | BSD 2-Clause. | `oniguruma-LICENSE.txt` |
| utf8proc | MIT и лицензия на данные Unicode. | `utf8proc-LICENSE.txt` |
| miniz, zip | MIT. | `miniz-LICENSE.txt`, `zip-LICENSE.txt` |
| stb image utilities | Sean Barrett, MIT или общественное достояние. | `stb-LICENSE.txt` |
| Словарь токенизатора OpenAI CLIP | `bpe_simple_vocab_16e6` из [openai/CLIP](https://github.com/openai/CLIP/tree/d05afc436d78f1c48dc0dbf8e5980a9d471f35f6), MIT; встроен в движок для текстовых энкодеров CLIP. | `openai-clip-LICENSE.txt` |

Других словарей токенизаторов в движке нет. Для текстового энкодера Qwen токенизатор читается из GGUF-файла этого энкодера, который скачивается вместе с моделью на условиях её лицензии.

**Tools > Runtime Image Forge > Install Windows Backend** (эту же установку выполняет **Открыть пример The Ember Forge**) упаковывает DLL в архив в `Assets/StreamingAssets/RuntimeImageForge` и копирует эти файлы лицензий в `Assets/StreamingAssets/RuntimeImageForge/Licenses`, чтобы они попали в собранную игру. Архив движка, записанный другой версией пакета, заменяется; остальные существующие файлы с другим содержимым команда сохраняет, а не перезаписывает. Распространяя игру с этим движком, сохраняйте эти уведомления.

## Создано для пакета

Все остальные файлы созданы Strange Euphoria XR специально для Runtime Image Forge: исходный код на C#, окна редактора, иконки и логотип, документация, а также пример The Ember Forge со сценой, скриптами, профилями моделей и стилей и иллюстрацией мастерской. Иллюстрация мастерской создана с помощью генерации изображений OpenAI. В пакете нет сторонних шрифтов, аудио, изображений и моделей.

## Используется из вашей установки Unity

Unity uGUI, TextMesh Pro Essential Resources и Unity Inference Engine — пакеты Unity с собственными условиями; этот пакет их не распространяет. Пример использует стандартный шрифт TextMesh Pro из TMP Essential Resources (Liberation Sans); лицензия шрифта импортируется вместе с ним в `Assets/TextMesh Pro/Fonts`. Распространяя собранную игру, сохраняйте уведомления компонентов Unity.

## Скачивается только по вашему выбору

Файлы моделей не входят в пакет. Они скачиваются по HTTPS из репозиториев их издателей только после явного действия разработчика или игрока, и каждый файл сверяется с закреплёнными размером и SHA-256. Их использование и распространение подчиняются лицензиям моделей: прочитайте лицензии до начала работы и сохраняйте файлы лицензий и уведомлений каждой модели, если распространяете файлы моделей вместе с игрой. Названия моделей не дают прав на товарные знаки и не означают одобрения со стороны их авторов.

**Профиль FLUX.2 Klein 4B** (`Samples/The Ember Forge/Profiles/FLUX2Klein4B` и новые профили, созданные кнопкой **Создать профиль модели**):

| Роль | Репозиторий и ревизия | Лицензия |
| --- | --- | --- |
| Исходная модель | `black-forest-labs/FLUX.2-klein-4B@e7b7dc27f91deacad38e78976d1f2b499d76a294` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B/blob/e7b7dc27f91deacad38e78976d1f2b499d76a294/LICENSE.md) |
| GGUF генератора | `leejet/FLUX.2-klein-4B-GGUF@3b1f5a9dc3abb32238b053aeb3d823c30afdacbd` | [Apache-2.0](https://huggingface.co/leejet/FLUX.2-klein-4B-GGUF/tree/3b1f5a9dc3abb32238b053aeb3d823c30afdacbd) |
| GGUF текстового энкодера (Qwen3-4B) | `unsloth/Qwen3-4B-GGUF@22c9fc8a8c7700b76a1789366280a6a5a1ad1120` | [Apache-2.0](https://huggingface.co/unsloth/Qwen3-4B-GGUF/tree/22c9fc8a8c7700b76a1789366280a6a5a1ad1120) |
| VAE | `black-forest-labs/FLUX.2-small-decoder@a3efc24f613ef42d9428af62fdbd6f5fd8856c4a` | [Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-small-decoder/tree/a3efc24f613ef42d9428af62fdbd6f5fd8856c4a) |

**Модель удаления фона U²-Netp.** **Tools > Runtime Image Forge > Install Foreground Model** (то же действие есть в Overview и в инспекторе профиля маски) скачивает ONNX-экспорт [U²-Netp от Xuebin Qin](https://github.com/xuebinqin/U-2-Net/tree/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29), опубликованный в [выпуске rembg v0.0.0](https://github.com/danielgatis/rembg/releases/tag/v0.0.0) (`u2netp.onnx`, 4 574 861 байт, SHA-256 `309c8469258dda742793dce0ebea8e6dd393174f89934733ecc8b14c76f4ddd8`), вместе с лицензией Apache 2.0 проекта U²-Net из закреплённой ревизии ([`LICENSE`](https://raw.githubusercontent.com/xuebinqin/U-2-Net/ac7e1c817ecab7c7dff5ce6b1abba61cd213ff29/LICENSE), 11 357 байт, SHA-256 `c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4`). Команда сохраняет их вместе с уведомлением в `Assets/RuntimeImageForge/ForegroundModel` и копирует лицензию и уведомление в `Assets/StreamingAssets/RuntimeImageForge/Licenses` для сборок игры. Модель или файл лицензии с тем же именем, но другим содержимым сохраняются; уведомление — собственный файл команды, и она его перезаписывает. Модель выделяет заметный объект переднего плана; для сложных сцен и тонких краёв может понадобиться другая модель удаления фона.
