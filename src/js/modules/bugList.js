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
        // Создаем ваш элемент "ball" для каждого бага
        const ball = document.createElement("div");
        ball.classList.add(".fbr-bug-container");
        ball.innerHTML = `
            <div class="fbr-bug-card">
            <div class="fbr-bug-card__header">
              <div class="fbr-bug-card__number">${bug.bugNumber}</div>
              <div class="fbr-bug-card__author">Lil Pump</div>
              <div class="fbr-bug-card__date">29.12.23</div>
            </div>
            <div class="fbr-bug-card__title">${bug.summary}</div>
          </div>
        `;

        // Добавляем элемент "bug" в контейнер
        bugListElement.appendChild(ball);
    });
  }

  async getResponseBugsList() {
    const url = new URL('http://localhost:3000/api/bugs');
    const urlPage = this.dataCollector.getCurrentURL()
    url.searchParams.append('url', urlPage);
  
    try {
      // Отправляем GET-запрос
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
  
      // Распарсим JSON-ответ
      const data = await response.json();
      console.log('Ответ сервера:', data);
      this.bugData.setBugs(data)
      this.renderBugList()
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
}


}  