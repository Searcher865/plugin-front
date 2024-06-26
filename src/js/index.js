import { ToggleCommentHandler } from "./modules/toggleComment";
import { ModalHandler } from './modules/modal'; // Импорт класса ModalHandler
import { BugMarks } from './modules/bugMarks';
import { BugService } from './modules/bugService';
import { frontendPlugin } from './modules/frontendPlugin'; // Импорт фронтенда
import { Sidebar } from "./modules/sidebar";
import { Login } from './modules/login';



const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has('fbr')) {
  
frontendPlugin();
new Login();
const modalHandler = new ModalHandler();
const sidebar = new Sidebar();
const bugService = new BugService();
const bugMarks = new BugMarks();
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




  await bugService.getResponseBugs()



  let resizeTimer;

// Отслеживаем событие ресайза и если он произошел, то перересовываем все метки
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        bugMarks.renderBugMark();
    }, 100); // здесь задается задержка в милисекундах, чтобы реайз не срабатывал мгновенно
});



});

document.addEventListener('DOMContentLoaded', function() {
  const inputField = document.getElementById('parent-task');
  const dropdown = document.getElementById('task-list');
  const applyBtn = document.getElementById('apply-btn');

  // Show the dropdown when input is focused
  inputField.addEventListener('focus', function() {
      dropdown.style.display = 'block';
  });

  // Hide the dropdown when clicking outside of it
  document.addEventListener('click', function(e) {
      if (!document.querySelector('.custom-dropdown').contains(e.target)) {
          dropdown.style.display = 'none';
      }
  });

  // Fill input field with the clicked value from the dropdown
  dropdown.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI') {
          inputField.value = e.target.textContent;
          dropdown.style.display = 'none';
      }
  });

  // Apply button logic
  applyBtn.addEventListener('click', function() {
      const selectedValue = inputField.value.trim();

      if (selectedValue !== '') {
          alert(`Выбрана родительская задача: ${selectedValue}`);
          // Здесь можно добавить логику для применения выбранного значения
      } else {
          alert('Выберите или введите значение для родительской задачи');
      }
  });
});





}



