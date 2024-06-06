# plugin-front

Этот плагин работает на Node.js версии 18.14.0.

Для отображения плагина на странице необходимо добавить ?fbr к URL. Например, http://localhost:8080/?fbr.

## Начало работы

1. Установите зависимости:
    ```
    npm install
    ```

2. Запустите gulp, если вам нужно запустить версию для разработки:
    ```
    gulp
    ```

После сборки будет создана папка `build`, содержащая все скомпилированные файлы.
- `build/js/index.bundle.js`: Скомпилированный плагин с console.log и комментариями.
По умолчанию он запускается на http://localhost:8080/.

Для сборки версии для продакшна, выполните:
    ```
    gulp prod
    ```

После сборки будет создана папка `prod`, содержащая все скомпилированные файлы.
- `prod/js/index.bundle.js`: Минифицированный плагин без комментариев и console.log.
По умолчанию он запускается на http://localhost:8081/.

## Структура

- Файл конфигурации приложения: `src/js/config.js`
  - Измените адрес сервера в этом файле. Адрес сервера по умолчанию: http://localhost:3000/api.

- HTML файлы:
  - `src/html/preIndex.html`: Содержит разметку для плагина и тестовой страницы одновременно.
    - Разметка плагина находится в классах `fbr-plugin-layout` и `fbr-plugin-container`.
  - `src/html/index.html`: Используется только для просмотра разметки тестовой страницы.
    - Вносите изменения в разметку тестовой страницы в `preIndex.html`, так как `index.html` перезаписывается во время компиляции.

- SCSS:
  - `src/scss`: CSS для тестовой страницы.
  - `src/scss-fbr-plugin`: CSS для плагина.

- JavaScript:
  - `src/index.js`: Главный JS файл.
  - `src/js/modules/frontendPlugin.js`: Содержит разметку и CSS во время компиляции, импортируется в `index.js`.
