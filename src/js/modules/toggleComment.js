export class ToggleCommentHandler {
    constructor() {
      document.addEventListener('click', this.handleClick.bind(this));
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  
    handleClick(event) {
      // Код для переключения тоглов при клике
      if (event.target.closest('.fbr-comment__togle')) {
        const commentTogle = event.target.closest('.fbr-comment__togle');
        this.toggleComment(commentTogle);
      }
    }

    handleKeyDown(event) {
      // Проверяем, была ли нажата клавиша Shift и V одновременно
      if ((event.key === 'V' || event.key === 'v') && event.shiftKey) {
        // Получаем все элементы с классом .fbr-comment__togle
        const commentTogles = document.querySelectorAll('.fbr-comment__togle');
        // Проходимся по каждому тоглу и переключаем его состояние
        commentTogles.forEach(commentTogle => {
          this.toggleComment(commentTogle);
        });
      }
    }

    toggleComment(commentTogle) {
      const commentSwitch = commentTogle.querySelector('.fbr-comment__switch');
      const commentSwitchToggle = commentTogle.querySelector('.fbr-comment__switch-togle');
  
      if (!commentTogle || !commentSwitch || !commentSwitchToggle) {
        console.error('One or more required elements not found');
        return;
      }
  
      const currentDataActive = commentTogle.getAttribute('data-active');
  
      if (currentDataActive === 'false') {
        commentTogle.setAttribute('data-active', 'true');
      } else {
        commentTogle.setAttribute('data-active', 'false');
      }
  
      commentSwitch.classList.toggle('fbr-comment__switch--active');
      commentSwitchToggle.classList.toggle('fbr-comment__switch-togle--active');
    }
}
