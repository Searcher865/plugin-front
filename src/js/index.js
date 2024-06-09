import { ToggleCommentHandler } from "./modules/toggleComment";
import { ModalHandler } from './modules/modal'; // Импорт класса ModalHandler
import { BugMarks } from './modules/bugMarks';
import { frontendPlugin } from './modules/frontendPlugin'; // Импорт фронтенда
import { Sidebar } from "./modules/sidebar";
import { BugSidebar } from "./modules/bugSidebar";
import { BugList } from './modules/bugList';

const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('fbr')) {
  
frontendPlugin();
const modalHandler = new ModalHandler();
const sidebar = new Sidebar();
const bugList = new BugList();
const toggleCommentHandler = new ToggleCommentHandler();

modalHandler.setupStepNavigation()




document.addEventListener('mouseover', function(event) {
  // Проверяем, является ли целевой элемент или его родитель элементом с классом "fbr-plugin-base"
  if (!event.target.closest('.fbr-plugin-base')) {
    // Убираем обводку у всех элементов
    document.querySelectorAll('.fbr-highlight').forEach(function(element) {
      element.classList.remove('fbr-highlight');
    });

    // Добавляем обводку к элементу, на который наведен курсор
    event.target.classList.add('fbr-highlight');
  }
});

document.addEventListener('mouseout', function(event) {
  // Убираем обводку, когда курсор покидает элемент
  event.target.classList.remove('fbr-highlight');
});


document.addEventListener('DOMContentLoaded', async () => {


  const bugMarks = new BugMarks();

  await bugMarks.getResponseBugsMarks()
  await bugList.getResponseBugsList();
  const bugSidebar = new BugSidebar();

  let resizeTimer;

// Отслеживаем событие ресайза и если он произошел, то перересовываем все метки
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        bugMarks.renderBugMark();
    }, 100); // здесь задается задержка в милисекундах, чтобы реайз не срабатывал мгновенно
});



});






}



