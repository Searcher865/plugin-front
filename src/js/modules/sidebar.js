import { BugList } from './bugList';
import { BugData } from './bugData';

export function sidebar() {
    
    const tabButtons = document.querySelectorAll(".fbr-sidebar__tab");
    const tabContents = document.querySelectorAll(".fbr-sidebar__tab-content");

    tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Убираем активный класс у всех вкладок и контента
        tabButtons.forEach((btn) => btn.classList.remove("fbr-sidebar__tab--active"));
        tabContents.forEach((content) => content.classList.remove("fbr-sidebar__tab-content--active"));

        // Добавляем активный класс к выбранной вкладке и соответствующему контенту
        const tabId = button.getAttribute("data-tab");
        const tabContent = document.getElementById(tabId);

        button.classList.add("fbr-sidebar__tab--active");
        tabContent.classList.add("fbr-sidebar__tab-content--active");
    });
    });


    function toggleSidebar() {
        const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
        const sidebar = document.getElementById("sidebar");

        sidebarToggleBtn.addEventListener("click", function () {
            sidebar.classList.toggle('fbr-sidebar--active');
        });
    }
    toggleSidebar();



    // // Получаем ссылки на основной сайдбар и сайдбар бага
    // const bugSidebar = document.getElementById('bug-sidebar');

    // // Получаем ссылки на все карточки багов
    // const bugCards = document.querySelectorAll('.fbr-bug-card');

}