export class Sidebar {
    constructor() {
        this.sidebarToggleBtn = document.getElementById("fbr-sidebarToggleBtn");
        this.sidebar = document.getElementById("sidebar");

        // Табы в сайдбаре
        this.tabButtons = document.querySelectorAll(".fbr-sidebar__tab");
        this.tabContents = document.querySelectorAll(".fbr-sidebar__tab-content");

        // Вызов метода для открытия сайдбара
        this.openSidebar();
        this.openScreenSidebar()

    }

    openSidebar() {
        this.sidebarToggleBtn.addEventListener("click", () => {
            this.sidebar.classList.toggle('fbr-sidebar--active');
        });
    }

 openScreenSidebar() {
    this.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        console.log("Убираем класс");
        // Убираем активный класс у всех вкладок и контента
        this.tabButtons.forEach((btn) => btn.classList.remove("fbr-sidebar__tab--active"));
        this.tabContents.forEach((content) => content.classList.remove("fbr-sidebar__tab-content--active"));

        // Добавляем активный класс к выбранной вкладке и соответствующему контенту
        const tabId = button.getAttribute("data-tab");
        const tabContent = document.getElementById(tabId);

        button.classList.add("fbr-sidebar__tab--active");
        tabContent.classList.add("fbr-sidebar__tab-content--active");
    });
    });

    // // Получаем ссылки на основной сайдбар и сайдбар бага
    // const bugSidebar = document.getElementById('bug-sidebar');

    // // Получаем ссылки на все карточки багов
    // const bugCards = document.querySelectorAll('.fbr-bug-card');

}
}