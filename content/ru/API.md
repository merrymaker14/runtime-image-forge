# Runtime Image Forge API

Пространство имён: `StrangeEuphoriaXR.RuntimeImageForge`.

| Тип | Назначение |
| --- | --- |
| `GenerationIdentity` | Точный состав движка, модели и компонентов. |
| `GenerationRequest` | Неизменяемые применённые настройки и ключ кэша. |
| `ChoiceStyle` | Копия каталога и подстановка выбранных значений в проверенный шаблон. |
| `ForgeStyleAsset` | Редактируемый в инспекторе каталог и параметры генерации. |
| `ForgeBackgroundMode` | Режим стиля, прозрачный PNG или PNG с фоном для одного заказа. |
| `IImageGenerationBackend` | Контракт генерации изображений на рабочем потоке. |
| `ForgeBackendSource` | Компонент игры, создающий настроенный движок. |
| `ForgeGenerator` | Подготовка, задания, состояние, отмена и экспорт в рамках сцены. |
| `ForgeGenerationJob` | Запрос, состояние, прогресс, завершение и идентификаторы PNG. |
| `LocalForgeBackendSource` | Загрузка закреплённой модели и настройка движка Windows. |
| `ForgeModelProfile` | URL файла, ревизия, хеш, размер и параметры сэмплирования. |
| `ForegroundModelProfile` | Импортированная ONNX-модель, обработка входа и выхода. |
| `IImageBackendPreparation` | Необязательная проверка перед приёмом заказов. |
| `ForgeModelIntegrityException` | Отсутствующая, неполная модель или неверный хеш. |
| `ProcessedImageBackend` | Последовательная генерация с необязательной обработкой маски. |
| `RawImageFrame` | Копия RGB/RGBA с явным владением, началом координат и шагом строк. |
| `ImageGenerationQueue` | Ограниченная FIFO-очередь, отмена, кэш и владение движком. |
| `GenerationProgress` | Этап и ограниченная доля выполнения. |
| `PngArtifact` | Неизменяемый PNG, запрос, SHA-256 и признак кэша. |
| `PngFileStore` | Атомарный дисковый кэш с проверкой ключей и структуры PNG. |
| `UnityPngEncoder` | Преобразование RGB/RGBA в RGBA8 PNG с меткой sRGB. |
| `UnityPngImage` | Владелец одной runtime-текстуры и спрайта. |
| `PngExporter` | Атомарный экспорт PNG или комплекта PNG/рецепт с сохранением чужих файлов. |
| `ForgeExportPaths` | Папки рядом с игрой и в persistent-data. |

## Объём загрузки модели

Инспектор модели показывает полный объём закреплённых весов. `ForgeModelProfile.GetTotalDownloadBytes()` проверяет профиль и суммирует все обязательные файлы модели, включая текстовый энкодер и декодер в компонентном профиле. Метод возвращает весь объём первой загрузки даже при наличии части файлов в кэше; загрузчик повторно использует проверенные файлы. В сумму не входят файлы движка и временное место для загрузки. GB — десятичная единица: 1 GB = 1 000 000 000 байт.

## Генератор сцены

Вызывайте эти API на главном потоке Unity. Назначьте источник и профили в инспекторе; загрузка — явное действие игры, отдельно от подготовки.

Вызов `ConnectBackend` создаёт дисковый кэш до очереди и передаёт генератору владение backend. При выгрузке или уничтожении генератора задания отменяются, а backend закрывается после завершения очереди, даже если объект ещё не был активирован. Ошибка целостности модели сбрасывает готовность, закрывает прежнюю очередь и устанавливает `LocalForgeBackendSource.NeedsModelRepair`. До повторной подготовки явно восстановите выбранный профиль: скачайте закреплённые HTTPS-файлы или повторно импортируйте проверенный локальный комплект; профили «Только импорт» требуют локального импорта.

`PngFileStore` согласовывает запись между отдельными экземплярами и процессами. Идентичный PNG для того же запроса принимается без замены файла. Если для того же ключа уже сохранён корректный PNG с другим хешем содержимого, он сохраняется, а новая запись отклоняется; для нового результата используйте другой seed. Повреждённый PNG можно восстановить. Небольшие файлы `.lock` остаются рядом с кэшем для согласования записей; не удаляйте их, пока генератор работает.

```csharp
await localSource.DownloadModelAsync(downloadProgress, cancellationToken);
var mode = ForgeBackgroundMode.Transparent; // Or KeepBackground; both produce PNG.
await generator.PrepareAsync(style, mode, cancellationToken);
var job = generator.Generate(style, choices, seed: 1234, backgroundMode: mode, token: cancellationToken);
await job.Completion;
if (job.State == "completed")
{
    var artifact = await generator.ReadArtifactAsync(job.Request, cancellationToken);
    var image = await UnityPngImage.CreateAsync(artifact, cancellationToken: cancellationToken);
    // Retain image while displaying image.Sprite; dispose it when replacing the icon.
    var bundle = await generator.ExportJobAsync(job.Id,
        ForgeExportPaths.DirectoryFor(ForgeExportLocation.BesideGame), "sword", cancellationToken);
}
```

`ForgeGenerationJob.Completion` завершается при `completed`, `cancelled` или `failed`; проверяйте `State` и `Error`. `CancelJob(id)` отменяет незавершённое задание, `CancelPreparation()` — запуск. Генератор владеет очередью и закрывает её при выгрузке сцены. Хранится до 64 записей заданий; PNG остаются на диске.

`ForgeBackgroundMode.StyleDefault` использует `style.keepBackground`. Для `Transparent` нужен обработчик маски; `KeepBackground` пропускает его. Передавайте режим и в подготовку, и в генерацию, чтобы прогреть только выбранный конвейер. Переход к прозрачности после подготовки с фоном включает стоимость первого вызова маски в этот заказ. Общий ресурс стиля не меняется. Режим входит в запрос, ключ кэша, сохранение и экспортный рецепт. Встроенный движок отклоняет прозрачный заказ без обработчика.

При `HasLocalModel=true` пропускайте загрузку и готовьте кэшированную модель. Подготовка проверяет SHA-256. `ForgeModelIntegrityException` отмечает источник для восстановления; явная успешная загрузка снимает отметку. Прогресс загрузки — дробное значение через `IProgress<float>`.

## Создание иконки

Создайте очередь один раз для настроенного движка и храните на протяжении жизни модели:

```csharp
using System.Collections.Generic;
using System.IO;
using StrangeEuphoriaXR.RuntimeImageForge;
using UnityEngine;

// localSource is a LocalForgeBackendSource with a verified model; style is a configured asset.
await localSource.PrepareNativeAsync(cancellationToken);
var backend = localSource.CreateBackend();
var store = new PngFileStore(Path.Combine(Application.persistentDataPath, "GeneratedArt"));
var queue = new ImageGenerationQueue(backend, new UnityPngEncoder(), store);
var choices = new Dictionary<string, string>
{
    ["item"] = "sword",
    ["material"] = "steel",
    ["detail"] = "runes"
};
var request = style.CreateRequest(queue.Identity, choices, seed: 1234);
var artifact = await queue.GenerateAsync(request, cancellationToken: cancellationToken);
var image = await UnityPngImage.CreateAsync(artifact, cancellationToken: cancellationToken);
inventorySlot.sprite = image.Sprite;
// Retain image while the slot uses it. DisposeAsync releases its sprite and texture.
```

При выгрузке модели вызовите `await queue.CloseAsync()`. У каждого `UnityPngImage` отдельное время жизни: закрытие очереди не уничтожает показанные картинки. `store.GetPath(request.CacheKey)` возвращает путь PNG при включённом кэше.

Ключи примера принадлежат стилю кузницы. Другие игры задают свой каталог. Seed позволяет записать воспроизводимый запрос; изменение модели, движка и оборудования может менять пиксели.

## Собственный движок

Держите `GenerationIdentity` стабильным, пока очередь активна. `ComponentsSha256` — 64-символьная шестнадцатеричная контрольная сумма полного состава модели и компонентов. Включайте text encoder, decoder и параметры адаптеров. Отклоняйте неподдерживаемые размеры и параметры вместо незаметного изменения записанного запроса.

Очередь последовательно вызывает `GenerateAsync` на рабочем потоке. Верните `RawImageFrame` с точными запрошенными размерами. Конструктор копирует буфер пикселей, после чего его владелец может освободить нативную память. Не возвращайте заимствованную память и не создавайте объекты UnityEngine в этом методе.

Показывайте прогресс через переданный `IProgress<GenerationProgress>`; не храните наблюдателя после завершения. Поддерживайте отмену при работе модели и последующей обработке, освобождайте нативные ресурсы в `Dispose()`. Очередь вызывает `Dispose` только после завершения последней нативной операции.

`QueueCapacityException` синхронно отклоняет запрос без свободного места. Ошибка движка завершает Task задания с ошибкой. Отмена отменяет Task и предотвращает публикацию результата. Обрабатывайте это в интерфейсе, сохраняя прежнюю успешную картинку.

## Сохранения

Сохраняйте полный рецепт `GenerationRequest`, ключ кэша, PNG и контрольную сумму содержимого. `ForgeWorkshop.Receipt` демонстрирует JSON-совместимую запись и проверку совпадения восстановленных настроек с сохранённым ключом. Это детерминированные идентификаторы содержимого, не подписи подлинности. Изменённая запись отклоняется вместо привязки к другой картинке.

Кузница сохраняет инвентарь на диск до добавления иконки в интерфейс. На время записи кнопка Cancel отключена. Неудачный или отменённый заказ не добавляет предмет. Повреждённый инвентарь сохраняется, а новые записи блокируются для защиты сохранения. Режим фона входит в запись; портрет с Keep Background восстанавливает полное исходное изображение.
