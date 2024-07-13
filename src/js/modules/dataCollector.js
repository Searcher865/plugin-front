import html2canvas from "html2canvas";

export class DataCollector {
    constructor(modalHandler) {
        this.modalHandler = modalHandler;
        this.initialize();
    }

    initialize() {
        document.addEventListener('click', (event) => {
            // Проверяем, находится ли элемент внутри модального окна
            if (!event.target.closest('.fbr-bug-report')) {
                this.getXPath(event.target); 
            }
        });
    }

    getXPath(element) {
        // Функция для получения XPath по элементу
        function getElementXPath(el) {
            if (typeof el === 'undefined' || !el) return '';
    
            const document = el.ownerDocument;
            if (!document) return '';
    
            const xpath = [];
            let sibling = el;
            while (sibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE) {
                    let tagName = sibling.tagName.toLowerCase();
                    let index = 1;
    
                    // Подсчет позиции элемента среди своих соседей
                    let siblingNode = sibling.previousSibling;
                    while (siblingNode) {
                        if (siblingNode.nodeType === Node.ELEMENT_NODE && siblingNode.tagName === sibling.tagName) {
                            index++;
                        }
                        siblingNode = siblingNode.previousSibling;
                    }
    
                    let pathIndex = '[' + index + ']';
                    xpath.unshift(tagName + pathIndex);
                }
                sibling = sibling.parentNode;
            }
    
            return xpath.length ? '//' + xpath.join('/') : '';
        }
    
        // Проверка наличия id у элемента
        if (element && element.id) {
            return '//*[@id="' + element.id + '"]';
        }
    
        // Возвращаем XPath для элемента, используя функцию getElementXPath
        return getElementXPath(element);
    }
    


// Старая функция
    // getXPath(element) {
    //     if (element && element.id) {
    //         // Если у элемента есть уникальный id, используйте его для создания XPath
    //         return '//' + element.tagName.toLowerCase() + '[@id="' + element.id + '"]';
    //     }
        
    //     // В противном случае, перейдите к родительскому элементу и составьте XPath
    //     var path = [];
    //     while (element.parentNode) {
    //         var siblingCount = 0;
    //         var siblingIndex = 0;
    //         var tagName = element.tagName.toLowerCase();
            
    //         // Получите всех соседних элементов того же типа
    //         var siblings = element.parentNode.childNodes;
    //         for (var i = 0; i < siblings.length; i++) {
    //             var sibling = siblings[i];
    //             if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === tagName) {
    //                 siblingCount++;
    //             }
    //             if (sibling === element) {
    //                 siblingIndex = siblingCount;
    //             }
    //         }
            
    //         // Создайте часть XPath для текущего элемента
    //         var part = tagName + '[' + siblingIndex + ']';
    //         path.unshift(part);
            
    //         // Перейдите к родительскому элементу
    //         element = element.parentNode;
    //     }
        
    //     // Объедините все части XPath в одну строку
    //     return '//' + path.join('/');
    // }

    getClickCoordinates(event) {
        const xClick = event.clientX + window.scrollX;
        const yClick = event.clientY + window.scrollY;

        // Сохраняем координаты элемента
        const rect = event.target.getBoundingClientRect();
        const xElement = rect.left + window.scrollX;
        const yElement = rect.top + window.scrollY;

        console.log("Координаты элемента перед сохранением: "+xElement+" "+yElement);

        // Вычисляем координаты клика относительно элемента
        const xRelatively = xClick - xElement;
        const yRelatively = yClick - yElement;
        console.log("Координаты клика относительно элемента перед сохранением: "+xRelatively+" "+yRelatively);
        const clickedElement = event.target;
        const elementWidth = clickedElement.clientWidth;
        const elementHeight = clickedElement.clientHeight;
        console.log("Размеры элемента: "+elementWidth+" "+elementHeight);
      
        const widthRatio = xRelatively/elementWidth
        const heightRatio = yRelatively/elementHeight

        console.log("Пропорции элемента перед сохранением: "+widthRatio+" "+heightRatio);
        return {xClick, yClick,xRelatively, yRelatively, heightRatio, widthRatio}
    }

    makeScreenshot() {
        return new Promise((resolve, reject) => {
            // Получаем размеры видимой части страницы
            const screenWidth = window.innerWidth || document.documentElement.clientWidth;
            const screenHeight = window.innerHeight || document.documentElement.clientHeight;
    
            // Находим все элементы с классом fbr-plugin-container и fbr-plugin-ball
            const pluginContainers = document.querySelectorAll('.fbr-plugin-container');
            const pluginBalls = document.querySelectorAll('.fbr-plugin-ball');
    
            // Сохраняем текущие значения display и скрываем элементы
            const originalDisplay = [];
    
            pluginContainers.forEach(container => {
                originalDisplay.push({ element: container, display: container.style.display });
                container.style.display = 'none';
            });
    
            pluginBalls.forEach(ball => {
                originalDisplay.push({ element: ball, display: ball.style.display });
                ball.style.display = 'none';
            });
    
            // Создаем скриншот видимой части страницы
            html2canvas(document.body, {
                width: screenWidth,
                height: screenHeight,
                scrollX: window.scrollX,
                scrollY: 0 - window.scrollY,
            }).then(function (canvas) {
                // Получаем данные из Canvas в формате Data URL (бинарные данные в виде строки)
                const dataUrl = canvas.toDataURL('image/jpeg'); // Указываем формат изображения
    
                // Восстанавливаем значения display у элементов
                originalDisplay.forEach(item => {
                    item.element.style.display = item.display;
                });
    
                // Возвращаем Data URL
                resolve(dataUrl);
            }).catch(error => {
                // В случае ошибки, восстанавливаем значения display у элементов
                originalDisplay.forEach(item => {
                    item.element.style.display = item.display;
                });
                reject(error);
            });
        });
    }
    



    async getOSVersion() {
      let osVersion = 'Unknown';
    
      // Попытка использовать navigator.userAgentData, если доступно
      if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
        try {
          const uaData = await navigator.userAgentData.getHighEntropyValues(['platform', 'platformVersion']);
          if (uaData.platform === 'Windows' && uaData.platformVersion === '15.0.0') {
            osVersion = 'Windows 11';
          }
        } catch (error) {
          console.error('Возникла ошибка при определении версии ОС:', error);
        }
      }
    
      // Если navigator.userAgentData не доступно или произошла ошибка, используем navigator.userAgent
      if (osVersion === 'Unknown') {
        osVersion = navigator.userAgent;
       
      }
    
      return osVersion;
    }

    getEnvironment() {
      return navigator.userAgent;
      }
      
    getPageResolution() {
        // Получаем ширину и высоту окна браузера
        const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      
        return `${pageWidth}x${pageHeight}`;
      }
    
    getCurrentURL() {
        return window.location.href;
    }

    getBaseUrl() {
        // Получаем текущий URL страницы
        const currentUrl = this.getCurrentURL()
    
        // Создаем объект URL для текущего URL
        const url = new URL(currentUrl);
    
        // Извлекаем базовый URL
        let baseUrl = `${url.protocol}//${url.hostname}/`;
    
        // Если базовый URL содержит 'localhost', добавляем порт, если он указан
        if (url.hostname === 'localhost' && url.port) {
            baseUrl = `${url.protocol}//${url.hostname}:${url.port}/`;
        }
    
        // Возвращаем базовый URL с добавленным слэшем в конце
        return baseUrl;
    }

    getPathFromUrl() {
        const url = this.getCurrentURL()
        // Удаляем протокол и доменное имя, оставляем только путь и параметры
        let pathAndParams = url.replace(/^(?:\/\/|[^/]+)*\//, '');
    
        // Удаляем параметр ?fbr и все, что идет после него
        pathAndParams = pathAndParams.split('?fbr')[0];
    
        // Удаляем начальный и конечный слэши, если они есть
        pathAndParams = pathAndParams.replace(/^\/|\/$/g, '');
    
        return pathAndParams;
    }
    
    
}

