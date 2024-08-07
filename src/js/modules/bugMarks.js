import axios from './interceptor';
import { BugData } from './bugData';
import { DataCollector } from './dataCollector';
import { LoginModal } from './loginModal';


export class BugMarks {

  constructor() {
    this.bugData = new BugData();
    this.dataCollector = new DataCollector();
    this.loginModal = new LoginModal();
    this.toggleElement = document.getElementById('plugin-comment-togle')
  }

  renderBugMark() {
    const isActive = this.toggleElement.getAttribute('data-active');
    if (isActive !== 'true') {
        return; // Если data-active не равен 'true', выходим из функции
    }


    const bugListElement = document.querySelector('.fbr-plugin-balls');
    console.log("ПРОВЕРКА списка багов в renderBugMark" + JSON.stringify(this.bugData.bugs));
    
    // Очищаем текущий список багов
    bugListElement.innerHTML = '';

    // Перебираем массив багов и создаем элементы для отображения каждого бага
    this.bugData.bugs.forEach((bug, index) => {
        // Проверяем свойство existsOnPage
        if (!bug.existsOnPage) {
            console.log(`Баг ${bug.taskKey} не существует на странице.`);
            bug.findElement = false; // Устанавливаем findElement в false
            return; // Переходим к следующему багу
        }

        // Создаем элемент "ball" для каждого бага
        const ball = document.createElement("div");
        ball.classList.add("fbr-plugin-ball");

        // Определяем статус и устанавливаем data-status
        if (bug.status === "Закрыт" || bug.status === "Отменено") {
            ball.setAttribute("data-status", "closed");
        } else {
            ball.setAttribute("data-status", "open");
        }

        ball.innerHTML = `
            <div class="fbr-plugin-ball__number">
                <a href="https://tracker.yandex.ru/${bug.taskKey}" target="_blank">${bug.bugNumber}</a>
            </div>
            <div class="fbr-plugin-ball__peek">
                <div class="fbr-plugin-ball__inner">
                    <div class="fbr-plugin-ball__summary">${bug.summary}</div>
                    <div class="fbr-plugin-ball__finalOsVersion">${bug.finalOsVersion}</div>
                    <div class="fbr-plugin-ball__browser">${bug.browser}</div>
                    <div class="fbr-plugin-ball__browser">${bug.status}</div>
                </div>
            </div>
        `;

        const dimensions = this.getDimensionsByXPath(bug.xpath);
        if (!dimensions) {
            console.log("Размеры элемента не найдены, переходим к следующему багу.");
            bug.findElement = false; // Устанавливаем findElement в false
            return; // Прерываем текущую итерацию forEach и переходим к следующей итерации
        } else {
            bug.findElement = true; // Устанавливаем findElement в true
        }

        const { width, height } = dimensions;
        console.log("Размеры элемента после загрузки: " + width + " " + height);

        const coordinates = this.getCoordinatesElementByXPath(bug.xpath);
        if (!coordinates) {
            console.log("Координаты элемента не найдены, переходим к следующему багу.");
            return; // Прерываем текущую итерацию forEach и переходим к следующей итерации
        }

        const { xElement, yElement } = coordinates;
        console.log("Координаты элемента после загрузки: " + xElement + " " + yElement);

        // Устанавливаем координаты на основе данных из массива багов
        const xRelatively = bug.widthRatio * width;
        const yRelatively = bug.heightRatio * height;
        console.log("Координаты шарика относительно элемента после загрузки: " + xRelatively + " " + yRelatively);
        ball.style.left = xRelatively + xElement - 20 + "px";
        ball.style.top = yRelatively + yElement - 20 + "px";

        // Добавляем элемент "ball" в контейнер
        bugListElement.appendChild(ball);
        console.log("СОЗДАЕМ ШАРИК");

        // Скрываем элемент, если его статус "closed"
        if (ball.getAttribute("data-status") === "closed") {
            ball.style.display = "none";
        }
    });
  }

  getDimensionsByXPath(xpathSelector) {
    const element = document.evaluate(
      xpathSelector,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    if (element) {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      return { width, height };
    } else {
      console.error('Элемент не найден по указанному XPath.');
    }
  }

  getCoordinatesElementByXPath(xpathSelector) {
    const element = document.evaluate(
      xpathSelector,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    console.log("getDimensionsByXPath" + xpathSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const xElement = rect.left + window.scrollX;
      const yElement = rect.top + window.scrollY;
      return { xElement, yElement };
    } else {
      console.error('Элемент не найден по указанному XPath.');
    }
  }
}
