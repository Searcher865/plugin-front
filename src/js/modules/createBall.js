// Функция, которая создает новый элемент с классом plugin-ball
export function createPluginBall(xRelatively, yRelatively, xPath, container) {
    console.log("Функция createPluginBall отработала ");
    // Используем xPath, чтобы найти элементы
    const xPathElement = document.evaluate(xPath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
    
    if (xPathElement) {
        // Получаем координаты найденного элемента
        const { x, y } = xPathElement.getBoundingClientRect();
        
        // Создаем ваш элемент "ball"
        const ball = document.createElement("div");
        ball.classList.add("fbr-plugin-ball-empty");
        ball.innerHTML = `
            <div class="fbr-plugin-ball__number"><a></a></div>
            <div class="fbr-plugin-ball__peek">
                <div class="fbr-plugin-ball__inner">
                    <div class="fbr-plugin-ball__summary"></div>
                    <div class="fbr-plugin-ball__finalOsVersion"></div>
                    <div class="fbr-plugin-ball__browser"></div>
                </div>
            </div>
        `;
        
        // Устанавливаем координаты на основе xPathElement и заданных сдвигов
        ball.style.left = x + window.pageXOffset + xRelatively - 20 + "px";
        ball.style.top = y + window.pageYOffset + yRelatively - 20 + "px";
      
        // Добавляем элемент в контейнер
        container.appendChild(ball);
        } else {
        console.error("Элемент не найден по указанному XPath.");
        }
}