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
        if (element && element.id) {
            // Если у элемента есть уникальный id, используйте его для создания XPath
            return '//' + element.tagName.toLowerCase() + '[@id="' + element.id + '"]';
        }
        
        // В противном случае, перейдите к родительскому элементу и составьте XPath
        var path = [];
        while (element.parentNode) {
            var siblingCount = 0;
            var siblingIndex = 0;
            var tagName = element.tagName.toLowerCase();
            
            // Получите всех соседних элементов того же типа
            var siblings = element.parentNode.childNodes;
            for (var i = 0; i < siblings.length; i++) {
                var sibling = siblings[i];
                if (sibling.nodeType === 1 && sibling.tagName.toLowerCase() === tagName) {
                    siblingCount++;
                }
                if (sibling === element) {
                    siblingIndex = siblingCount;
                }
            }
            
            // Создайте часть XPath для текущего элемента
            var part = tagName + '[' + siblingIndex + ']';
            path.unshift(part);
            
            // Перейдите к родительскому элементу
            element = element.parentNode;
        }
        
        // Объедините все части XPath в одну строку
        return '//' + path.join('/');
    }

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

            
            // Если элемент существует, отключаем его
            const fbrpluginContainer = document.getElementById('fbrpluginContainer');
            if (fbrpluginContainer) {
                fbrpluginContainer.style.display = 'none';
            }


        
            // Создаем скриншот видимой части страницы
            html2canvas(document.body, {
                width: screenWidth,
                height: screenHeight,
                scrollX: window.scrollX,
                scrollY: 0 - window.scrollY,
            }).then(function (canvas) {
                // Получаем данные из Canvas в формате Data URL (бинарные данные в виде строки)
                const dataUrl = canvas.toDataURL('image/jpeg'); // Указываем формат изображения
                // Возвращаем Data URL
                resolve(dataUrl);
            }).catch(reject);

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
}

