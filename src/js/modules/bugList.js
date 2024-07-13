import { BugData } from './bugData';
import { DataCollector } from './dataCollector';

export class BugList {

    constructor() {
        this.bugData = new BugData();
        this.dataCollector = new DataCollector();
    }

    renderBugList() {
        const bugListElementOpen = document.querySelector('.fbr-bug-container-open');
        const bugListElementClosed = document.querySelector('.fbr-bug-container-closed');
    
        // Очищаем текущие списки багов
        bugListElementOpen.innerHTML = '';
        bugListElementClosed.innerHTML = '';
    
        // Перебираем массив багов и создаем элементы для отображения каждого бага
        this.bugData.bugs.forEach((bug) => {
    
            // Получаем базовый URL
            const baseUrl = this.dataCollector.getBaseUrl();
    
            // Формируем ссылку на страницу
            const url = `${baseUrl}${bug.path}`;
    
            // Создаем элемент "ball" для каждого бага
            const ball = document.createElement("div");
            ball.classList.add("fbr-bug-card");
    
            // Проверяем свойства bug.findElement и bug.existsOnPage
            if (bug.findElement && bug.existsOnPage) {
                // Страница найдена на странице
                ball.innerHTML = `
                    <div class="fbr-bug-card__header">
                        <div class="fbr-bug-card__number">${bug.bugNumber}</div>
                        <div class="fbr-bug-card__status">${bug.status}</div>
                        <div class="fbr-bug-card__date">${bug.createdAt}</div>
                    </div>
                    <div class="fbr-bug-card__title">${bug.summary}</div>

                    <div class="fbr-bug-card__author">${bug.pageResolution} | ${bug.browser} | ${bug.finalOsVersion}</div>
                                        <div class="fbr-bug-card__author">${bug.author}</div>
                    <div class="fbr-bug-card__author">Страница: <a href="${url}" target="_blank">${url}</a></div>
                `;
            } else if (!bug.findElement && bug.existsOnPage) {
                // Элемент бага не обнаружен на странице
                ball.innerHTML = `
                    <div class="fbr-bug-card__header">
                        <div class="fbr-bug-card__number">${bug.bugNumber}</div>
                        <div class="fbr-bug-card__status">${bug.status}</div>
                        <div class="fbr-bug-card__date">${bug.createdAt}</div>
                    </div>
                    <div class="fbr-bug-card__title">${bug.summary}</div>
      
                                        <div class="fbr-bug-card__author">${bug.pageResolution} | ${bug.browser} | ${bug.finalOsVersion}</div>
                                                      <div class="fbr-bug-card__author">${bug.author}</div>
                    <div class="fbr-bug-card__author">Элемент бага не обнаружен на странице</div>
                `;
                ball.classList.add("active"); // Добавляем класс "active", если bug.findElement равно false
            } else {
                // Страница не найдена
                ball.innerHTML = `
                    <div class="fbr-bug-card__header">
                        <div class="fbr-bug-card__number">${bug.bugNumber}</div>
                        <div class="fbr-bug-card__status">${bug.status}</div>
                        <div class="fbr-bug-card__date">${bug.createdAt}</div>
                    </div>
                    <div class="fbr-bug-card__title">${bug.summary}</div>
               
                                        <div class="fbr-bug-card__author">${bug.pageResolution} | ${bug.browser} | ${bug.finalOsVersion}</div>
                                             <div class="fbr-bug-card__author">${bug.author}</div>
                    <div class="fbr-bug-card__author">Страница: <a href="${url}" target="_blank">${url}</a></div>
                `;
                ball.classList.add("active"); // Добавляем класс "active", если bug.findElement равно false
            }
    
            // Добавляем элемент "bug" в соответствующий контейнер
            if (bug.status === "Закрыт" || bug.status === "Отменено") {
                bugListElementClosed.appendChild(ball);
            } else {
                bugListElementOpen.appendChild(ball);
            }
        });
    
        // Обновляем счетчики
        this.updateCounters();
    }

    updateCounters() {
        const openBugsCount = document.querySelector('.fbr-bug-container-open').querySelectorAll('.fbr-bug-card').length;
        const closedBugsCount = document.querySelector('.fbr-bug-container-closed').querySelectorAll('.fbr-bug-card').length;

        // Обновляем текст кнопок с табами
        document.querySelector('.fbr-sidebar__tab[data-tab="fbr-sidebar-tab-open"]').textContent = `Активные (${openBugsCount})`;
        document.querySelector('.fbr-sidebar__tab[data-tab="fbr-sidebar-tab-closed"]').textContent = `Решеные (${closedBugsCount})`;
    }
}
