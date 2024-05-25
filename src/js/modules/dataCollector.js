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

    getOSVersion() {
        const userAgent = navigator.userAgent;
      
        if (userAgent.includes("Windows NT 10.0")) {
          return "Windows 10";
        } else if (userAgent.includes("Windows NT 6.3")) {
          return "Windows 8.1";
        } else if (userAgent.includes("Windows NT 6.2")) {
          return "Windows 8";
        } else if (userAgent.includes("Windows NT 6.1")) {
          return "Windows 7";
        } else if (userAgent.includes("Windows NT 6.0")) {
          return "Windows Vista";
        } else if (userAgent.includes("Windows NT 5.1")) {
          return "Windows XP";
        } else if (userAgent.includes("Mac OS X 10_15")) {
          return "macOS 10.15 (Catalina)";
        } else if (userAgent.includes("Mac OS X 10_14")) {
          return "macOS 10.14 (Mojave)";
        } else if (userAgent.includes("Linux")) {
          // Определение конкретных дистрибутивов Linux
          if (userAgent.includes("Ubuntu")) {
            const ubuntuVersion = userAgent.match(/Ubuntu\/([\d\.]+)/);
            if (ubuntuVersion) {
              return `Ubuntu ${ubuntuVersion[1]}`;
            }
            return "Ubuntu";
          }
          // Другие дистрибутивы Linux могут быть добавлены здесь
          
          return "Linux";
        } else if (userAgent.includes("Android")) {
          // Определение версии Android
          const androidVersion = userAgent.match(/Android\s([\d\.]+)/);
          if (androidVersion) {
            return `Android ${androidVersion[1]}`;
          }
          return "Android";
        } else if (userAgent.includes("iPhone")) {
          // Определение версии iOS (iPhone)
          const iOSVersion = userAgent.match(/iPhone OS\s([\d_]+)/);
          if (iOSVersion) {
            return `iOS ${iOSVersion[1].replace(/_/g, ".")}`;
          }
          return "iOS";
        } else if (userAgent.includes("iPad")) {
          // Определение версии iOS (iPad)
          const iOSVersion = userAgent.match(/CPU OS\s([\d_]+)/);
          if (iOSVersion) {
            return `iOS ${iOSVersion[1].replace(/_/g, ".")}`;
          }
          return "iOS";
        }
        
        // Вернуть "Неизвестно", если версия операционной системы не определена
        return "Неизвестно";
    }

    getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserInfo = "Неизвестный браузер"; // По умолчанию, если браузер не определен
      
        // Регулярные выражения для поиска названия браузера и его версии
        const regexChrome = /Chrome\/([\d.]+)/;
        const regexFirefox = /Firefox\/([\d.]+)/;
        const regexSafari = /Version\/([\d.]+).*Safari/;
        const regexEdge = /Edg\/([\d.]+)/;
        const regexIE = /MSIE ([\d.]+)/;
        const regexYandex = /YaBrowser\/([\d.]+)/; // Для Яндекс.Браузера
        const regexMI = /MiuiBrowser\/([\d.]+)/; // Для MI Browser
        const regexSamsung = /SamsungBrowser\/([\d.]+)/; // Для Samsung Browser
        const regexOpera = /OPR\/([\d.]+)/; // Для Opera
      
        if (regexChrome.test(userAgent)) {
          browserInfo = `Chrome ${userAgent.match(regexChrome)[1]}`;
        } else if (regexFirefox.test(userAgent)) {
          browserInfo = `Firefox ${userAgent.match(regexFirefox)[1]}`;
        } else if (regexSafari.test(userAgent)) {
          browserInfo = `Safari ${userAgent.match(regexSafari)[1]}`;
        } else if (regexEdge.test(userAgent)) {
          browserInfo = `Microsoft Edge ${userAgent.match(regexEdge)[1]}`;
        } else if (regexIE.test(userAgent)) {
          browserInfo = `Internet Explorer ${userAgent.match(regexIE)[1]}`;
        } else if (regexYandex.test(userAgent)) {
          browserInfo = `Яндекс.Браузер ${userAgent.match(regexYandex)[1]}`;
        } else if (regexMI.test(userAgent)) {
          browserInfo = `MI Browser ${userAgent.match(regexMI)[1]}`;
        } else if (regexSamsung.test(userAgent)) {
          browserInfo = `Samsung Browser ${userAgent.match(regexSamsung)[1]}`;
        } else if (regexOpera.test(userAgent)) {
          browserInfo = `Opera ${userAgent.match(regexOpera)[1]}`;
        }
      
        return browserInfo;
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

