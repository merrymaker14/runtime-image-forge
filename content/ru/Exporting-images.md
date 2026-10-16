# Экспорт созданных изображений

Экспортируйте готовый PNG без повторного запуска модели. Сохраняются прозрачность и исходные байты PNG.

```csharp
// artifact is the PngArtifact returned by ImageGenerationQueue.GenerateAsync.
string directory = ForgeExportPaths.DirectoryFor(ForgeExportLocation.BesideGame);
string png = await PngExporter.ExportPngAsync(artifact, directory, "my-sword.png", cancellationToken);

// A bundle contains image.png and recipe.json, committed together.
PngExportBundle bundle = await PngExporter.ExportBundleAsync(artifact, directory, "my-sword", cancellationToken);
```

Вызывайте `ForgeExportPaths.DirectoryFor` на главном потоке Unity. Для своей папки передавайте абсолютный путь в `PngExporter`. `BesideGame` использует `Exports` рядом с exe; `SavedData` — `Exports` внутри `Application.persistentDataPath`. Защищённая папка установки может запрещать запись рядом с игрой. В этом случае предложите папку сохранений или выбор другой папки.

API отдельного PNG отказывается перезаписывать существующий файл. Названия комплектов содержат контрольные суммы запроса и PNG; повтор того же экспорта возвращает существующий совпадающий комплект. Изменённый комплект сохраняется, операция завершается ошибкой. Разделители путей, зарезервированные имена и экспорт через символические ссылки запрещены.

Рецепт хранит ревизию модели, версию движка и стиля, seed, запросы, размеры, шаги, guidance, ключ кэша и SHA-256 PNG. Делитесь PNG как изображением либо комплектом с настройками генерации. Рецепт — описание: он не передаёт веса модели, исполняемый файл, 3D-модель и точное воспроизведение на другом оборудовании. Результаты могут различаться между версиями движка и устройствами.

При распространении изображений соблюдайте условия модели. Экспорт создаёт локальные файлы, не загружает их в интернет и не отправляет другому игроку.
