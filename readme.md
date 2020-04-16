## Демо
[Github Pages](https://pizekatto.github.io/portfolio/)
## Запуск
```bash
npm start
```
## Компоненты
### Collapse
![Collapse](./src/assets/video/collapse.gif)
### Modal
Модальное окно открыается при нажатии на картинку из компонента `Collapse`
### Progress
![progress](./src/assets/video/progress.gif)

Компонент полностью формируется из JS. Данные уровней прогресса загружаются асинхронно из [settings.json](https://github.com/Pizekatto/portfolio/blob/master/src/settings.json)
### ScrollSpy
Анимация компонента `Progress` происходит с использованием `Intersection Observer API`
### Parallax
Объект параллакса динамически создается только на десктопных разрешении вьюпорта, на мобильных разрешениям удаляется.
Для параллакса использована сторонняя библиотека [rellax](https://github.com/dixonandmoe/rellax)
### Copy
![Copy](./src/assets/video/copy.gif)

Можно скопировать адрес почты в буфер обмена
## Ресурсы
Использованы некоторые SASS исходники из Twitter Bootstrap для сброса стилей и миксин [Responsive Font Size](https://github.com/twbs/rfs)

