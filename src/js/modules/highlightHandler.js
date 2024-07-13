export class HighlightHandler {
    constructor() {
        this.toggleElement = document.getElementById('plugin-comment-togle')
        this.setupEventListeners();
    }

    setupEventListeners() {
        
        document.addEventListener('mouseover', this.handleMouseOver.bind(this));
        document.addEventListener('mouseout', this.handleMouseOut.bind(this));
    }

    handleMouseOver(event) {
        const isActive = this.toggleElement.getAttribute('data-active');
        if (isActive !== 'true') {
            return; // Если data-active не равен 'true', выходим из функции
        }
        if (!event.target.closest('.fbr-plugin-base')) {
            // Убираем обводку у всех элементов
            document.querySelectorAll('.fbr-highlight').forEach(function(element) {
                element.classList.remove('fbr-highlight');
            });

            // Добавляем обводку к элементу, на который наведен курсор
            event.target.classList.add('fbr-highlight');
        }
    }

    handleMouseOut(event) {
        const isActive = this.toggleElement.getAttribute('data-active');
        if (isActive !== 'true') {
            return; // Если data-active не равен 'true', выходим из функции
        }
        // Убираем обводку, когда курсор покидает элемент
        event.target.classList.remove('fbr-highlight');
    }
}
