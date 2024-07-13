import { BugMarks } from './bugMarks';
import { BugList } from './bugList';

export class ToggleCommentHandler {
    constructor() {
      this.btnSidebar = document.getElementById('fbr-sidebarToggleBtn');
      document.addEventListener('click', this.handleClick.bind(this));
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      this.bugMarks = new BugMarks();
      this.bugList = new BugList();
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
        this.bugMarks.renderBugMark();
        this.btnSidebar.style.cssText = 'display: ' + "block" + ' !important;';
        this.bugList.renderBugList();
      } else {
        commentTogle.setAttribute('data-active', 'false');
        const balls = document.querySelectorAll(".fbr-plugin-ball");
        balls.forEach(element => {
          element.remove();
      });
      const bugCards = document.querySelectorAll(".fbr-bug-card ");
      bugCards.forEach(element => {
        element.remove();
    });
    this.btnSidebar.style.cssText = 'display: ' + "none" + ' !important;';

      }
  
      commentSwitch.classList.toggle('fbr-comment__switch--active');
      commentSwitchToggle.classList.toggle('fbr-comment__switch-togle--active');
    }
}
