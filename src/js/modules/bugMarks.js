import { BugData } from './bugData';
import { DataCollector } from './dataCollector';
import config from '../config.js';

export class BugMarks {

  constructor() {
    this.bugData = new BugData();
    this.dataCollector = new DataCollector();

  }

  renderBugMark() {
    const bugListElement = document.querySelector('.fbr-plugin-balls');
    console.log("ПРОВЕРКА " + this.bugData.bugs);
    // Очищаем текущий список багов
    bugListElement.innerHTML = '';
    // Перебираем массив багов и создаем элементы для отображения каждого бага
    this.bugData.bugs.forEach((bug, index) => {
        // Создаем ваш элемент "ball" для каждого бага
        const ball = document.createElement("div");
        ball.classList.add("fbr-plugin-ball");
        ball.innerHTML = `
            <div class="fbr-plugin-ball__number">${bug.bugNumber}</div>
            <div class="fbr-plugin-ball__peek">
                <div class="fbr-plugin-ball__inner">
                    <div class="fbr-plugin-ball__author">${bug.taskKey}</div>
                    <div class="fbr-plugin-ball__date">${bug.OSVersion}</div>
                    <div class="fbr-plugin-ball__title">${bug.summary}</div>
                </div>
            </div>
        `;

        const {width, height} = this.getDimensionsByXPath(bug.xpath)
        console.log("Размеры элемента после загрузки: "+width+" "+height);
        const {xElement, yElement} = this.getCoordinatesElementByXPath(bug.xpath)
        console.log("Координаты элемента после загрузки: "+xElement+" "+yElement);
        // Устанавливаем координаты на основе данных из массива багов
        const xRelatively = bug.widthRatio * width;
        const yRelatively = bug.heightRatio * height;
        console.log("Координаты шарина относительно элемента после загрузки: "+xRelatively+" "+yRelatively);
        ball.style.left = xRelatively+xElement - 20 + "px";
        ball.style.top = yRelatively+yElement - 20 +"px";

        // Добавляем элемент "ball" в контейнер
        bugListElement.appendChild(ball);
        console.log("СОЗДАЕМ БОЛЛЛЛЛЛЛ");
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
      return {width, height}

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
    console.log("getDimensionsByXPath"+xpathSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      const xElement = rect.left + window.scrollX;
      const yElement = rect.top + window.scrollY;
      return {xElement, yElement}
    } else {
      console.error('Элемент не найден по указанному XPath.');
    }
  }

  async getResponseBugsMarks() {
    const url = new URL('http://localhost:3000/api/bugs');
    const urlPage = this.dataCollector.getCurrentURL()
    url.searchParams.append('url', urlPage);
  
    try {
      // Отправляем GET-запрос
      console.log("Перед отправкой запроса");
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
  
      // Распарсим JSON-ответ
      const data = await response.json();
      console.log('Ответ сервера:', data);
      this.bugData.setBugs(data)
  
      this.renderBugMark()
    } catch (error) {
      console.error('Произошла ошибка:', error);
      alert(`Отсутствует соединение с сервером `+error);
    }
}

}  