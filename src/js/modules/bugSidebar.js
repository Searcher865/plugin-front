

export class BugSidebar {
    constructor() {

            // Получаем сайдбар бага
            this.bugSidebar = document.getElementById('bug-sidebar');

            // Получаем ссылки на все карточки багов
            this.bugCards = document.querySelectorAll('.fbr-bug-card');
            console.log("СОЗДАЛИ BugSidebar");
            this.openBugCard()
            this.closeBugCard()
    }
    openBugCard() {
        // Обработчик клика для каждой карточки бага
        this.bugCards.forEach((bugCard, index) => {
            bugCard.addEventListener('click', () => {
                console.log("ТЫК2 ТЫКУ2 ТЫУ2");
                // Создаем содержимое для окна сайдбара бага на основе данных карточки бага
                const bugTitle = bugCard.querySelector('.fbr-bug-card__title').textContent;
                const bugDetails = bugCard.querySelectorAll('p');

                // Генерируем HTML-содержимое для окна сайдбара бага
                let sidebarContent = `
                            <button id="closeBugButton"><img class="fbr-bug-sidebar__close-icon" src="img/icons/sidebar-close.png"></button>
                            <h2>${bugTitle}</h2>`;
                bugDetails.forEach((detail) => {
                    sidebarContent += `<p>${detail.textContent}</p>`;
                });

                // Устанавливаем содержимое окна сайдбара бага
                this.bugSidebar.querySelector('.fbr-bug-sidebar-content').innerHTML = sidebarContent;

                // Открываем сайдбар бага
                this.bugSidebar.classList.add('bug-sidebar-open');
                this.bugSidebar.classList.add('fbr-sidebar--active');
            });
        });

    }
    closeBugCard() {
        this.bugSidebar.addEventListener('click', (event) => {
            // Проверяем, была ли нажата кнопка closeBugButton
            if (event.target.id === 'closeBugButton') {
                // Закрываем сайдбар бага, устанавливая left в '-282px'
                this.bugSidebar.classList.remove('fbr-sidebar--active');
            }
        });
    }

}