# Быстрый старт

Для Runtime Image Forge нужны Unity 6000.5 или новее, Windows x64, GPU с поддержкой Vulkan и Microsoft Visual C++ 2015–2022 Redistributable (x64). Модель генерации изображений работает внутри Unity Editor или вашей игры для Windows; ей не нужны ни сервер, ни слушающий порт, ни ключ API.

## 1. Импортируйте пакет

Откройте **Package Manager > My Assets**, скачайте Runtime Image Forge и импортируйте его. Файлы окажутся в `Assets/StrangeEuphoriaXR/RuntimeImageForge`, а Unity добавит зависимости — пакеты Unity Inference Engine 2.6.1 и Unity uGUI 2.5.0. После импорта один раз откроется окно **Overview**; снова открыть его можно через **Tools > Runtime Image Forge > Overview**.

## 2. Попробуйте The Ember Forge

The Ember Forge — законченная редактируемая игра о создании предметов, она находится в `Samples/The Ember Forge`. Игра показывает весь цикл: выбрать предмет, сгенерировать его изображение, сохранить в коллекции и экспортировать в PNG.

1. Выберите **Tools > Runtime Image Forge > Open The Ember Forge sample** (или **Открыть пример The Ember Forge** в Overview). Команда устанавливает движок для Windows вместе с лицензионными уведомлениями в `Assets/StreamingAssets/RuntimeImageForge`, импортирует TMP Essential Resources, если в проекте нет TMP Settings, и открывает сцену. Существующие TMP Settings сохраняются, а архив движка от другой версии пакета заменяется.
2. Войдите в Play Mode и нажмите **DOWNLOAD MODEL**. Пример использует FLUX.2 Klein 4B: три закреплённых файла общим объёмом 5 207 178 964 байта (5,21 ГБ), которые скачиваются с Hugging Face по HTTPS и проверяются по SHA-256. Ход загрузки отображается, а **CANCEL ORDER** её останавливает. Файлы кэшируются в `Application.persistentDataPath/RuntimeImageForge`, поэтому следующие запуски работают без сети.
3. Выберите предмет, материал и деталь, затем нажмите **FORGE MY ITEM**. На RTX 3060 Laptop GPU с 6 ГБ VRAM, на которой проводилась проверка, одно изображение 1024 × 1024 вместе с удалением фона создаётся примерно за 17 секунд. Время зависит от GPU, драйвера и другой нагрузки на GPU.
4. Выберите предмет в коллекции и сохраните его PNG и рецепт с помощью элементов управления экспортом.

Для прозрачных PNG-иконок до входа в Play Mode выберите **Tools > Runtime Image Forge > Install Foreground Model**. Команда скачивает модель удаления фона U²-Netp (4,6 МБ) вместе с лицензией из публичного выпуска rembg на GitHub, помещает их в `Assets/RuntimeImageForge/ForegroundModel` и назначает модель профилю маски примера. Без неё пример предлагает только PNG с фоном.

## 3. Добавьте генератор в свою сцену

1. Создайте объект сцены и добавьте `LocalForgeBackendSource` и `ForgeGenerator`.
2. В поле **Профиль модели** локального источника выберите `Samples/The Ember Forge/Profiles/FLUX2Klein4B`. Кнопка **Создать профиль модели** в Overview создаёт в выбранной папке новый профиль с теми же настройками FLUX.2 Klein 4B.
3. Для прозрачных PNG назначьте `Samples/The Ember Forge/Profiles/U2NetPForeground` в поле **Маска переднего плана** и установите модель удаления фона, как описано выше.
4. Оставьте в поле **Устройство Vulkan** значение `auto`: так выбирается подходящий GPU.
5. Назначьте источник в поле **Источник движка** генератора. Оставьте **Прогрев при подготовке** включённым: тогда подготовка выполнит одну прогревочную генерацию, не сохраняя её изображение.
6. Выберите стиль из `Samples/The Ember Forge/Styles`, например `IllustratedForgeNative1024` (1024 × 1024, 4 шага, CFG 1, ключи выбора `item`, `material` и `detail`), или создайте свой кнопкой **Создать стиль выбора** в Overview.

Прежде чем редактировать профиль или стиль, скопируйте его в свою папку (выделите его, нажмите Ctrl+D и перенесите копию). Обновления пакета заменяют файлы внутри `Assets/StrangeEuphoriaXR/RuntimeImageForge`.

В редакторе инспектор профиля модели предлагает кнопку **Скачать файлы модели с проверкой** с отображением прогресса и возможностью отмены, так что кэш можно заполнить ещё до входа в Play Mode.

## 4. Первая загрузка и первое изображение

Начинайте загрузку только после согласия игрока. Сначала покажите полный объём: `profile.GetTotalDownloadBytes()` возвращает общий размер закреплённых весов. Если `localSource.HasLocalModel` уже равно true, пропустите загрузку.

```csharp
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using StrangeEuphoriaXR.RuntimeImageForge;
using UnityEngine;
using UnityEngine.UI;

public sealed class FirstImage : MonoBehaviour
{
    [SerializeField] private LocalForgeBackendSource localSource;
    [SerializeField] private ForgeGenerator generator;
    [SerializeField] private ForgeStyleAsset style;
    [SerializeField] private Image inventoryImage;
    private UnityPngImage ownedImage;

    // Call this from your button after the player has seen the download size.
    public async Task ForgeAsync(CancellationToken token)
    {
        if (!localSource.HasLocalModel)
            await localSource.DownloadModelAsync(new Progress<float>(p => Debug.Log($"Download {p:P0}")), token);

        var backgroundMode = ForgeBackgroundMode.Transparent; // Use KeepBackground to skip the cutout.
        await generator.PrepareAsync(style, backgroundMode, token);

        var choices = new Dictionary<string, string> { ["item"] = "sword", ["material"] = "steel", ["detail"] = "runes" };
        var job = generator.Generate(style, choices, 1234, backgroundMode, token);
        await job.Completion;
        if (job.State != "completed") throw new InvalidOperationException(job.Error ?? job.State);

        var artifact = await generator.ReadArtifactAsync(job.Request, token);
        ownedImage?.Dispose();
        ownedImage = await UnityPngImage.CreateAsync(artifact, cancellationToken: token);
        inventoryImage.sprite = ownedImage.Sprite;
    }

    private void OnDestroy() => ownedImage?.Dispose();
}
```

`PrepareAsync` проверяет файлы в кэше, загружает модель и прогревает выбранный конвейер. Дождитесь его завершения, прежде чем принимать заказы. Храните `ownedImage`, пока интерфейс показывает его спрайт, и освобождайте его, когда заменяете изображение. Руководство [Runtime API](API.md) описывает состояния заданий, отмену и время жизни изображений.

Экспортируйте готовое задание через `generator.ExportJobAsync(...)`, а существующий `PngArtifact` — через `PngExporter`. Экспорт копирует готовые пиксели и не запускает модель повторно. Подробнее — в руководстве [Сохранение и экспорт](Exporting-images.md).

## 5. Соберите игру

Соберите Windows x64 Player со своей сценой. Сохраните файлы, которые установщик движка поместил в `Assets/StreamingAssets/RuntimeImageForge`, включая лицензионные уведомления. До первой генерации игра должна предложить явную загрузку модели (или локальный импорт файлов модели); после этого проверенные файлы используются повторно без сети. Распространяя файлы модели вместе с игрой, сохраняйте лицензионные уведомления модели.

Окна редактора и необязательные инструменты MCP работают только в редакторе и не входят в сборки Player. Проблемы с загрузкой, подготовкой и отменой разобраны в руководстве [Решение проблем](Troubleshooting.md).
