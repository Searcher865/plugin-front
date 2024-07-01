import { BugData } from './bugData';
import { DataCollector } from './dataCollector';

export class BugList {

  constructor() {
    this.bugData = new BugData();
    this.dataCollector = new DataCollector();
  }

  renderBugList() {
    const bugListElement = document.querySelector('.fbr-bug-container');

    // Очищаем текущий список багов
    bugListElement.innerHTML = '';

    // Перебираем массив багов и создаем элементы для отображения каждого бага
    this.bugData.bugs.forEach((bug, index) => {
      console.log("ОБНАРУЖН ЭЛЕМЕНТ ИЛИ НЕТ "+bug.findElement);
        // Создаем ваш элемент "ball" для каждого бага
        const ball = document.createElement("div");
        ball.classList.add("fbr-bug-card");

        // Добавляем класс "active", если bug.findElement равно false
        if (!bug.findElement) {
            ball.classList.add("active");
        }

        ball.innerHTML = `
            <div class="fbr-bug-card__header">
                <div class="fbr-bug-card__number">${bug.bugNumber}</div>
                <div class="fbr-bug-card__author">Lil Pump</div>
                <div class="fbr-bug-card__date">29.12.23</div>
            </div>
            <div class="fbr-bug-card__title">${bug.summary}</div>
        `;

        // Добавляем элемент "bug" в контейнер
        bugListElement.appendChild(ball);
    });
}



}  