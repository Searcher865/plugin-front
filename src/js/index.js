// main.js

import { FBRPluginManager } from './modules/fbrPluginManager';
import { ToggleCommentHandler } from "./modules/toggleComment";
import { ModalHandler } from './modules/modal'; // Импорт класса ModalHandler
import { BugMarks } from './modules/bugMarks';
import { BugService } from './modules/bugService';
import { frontendPlugin } from './modules/frontendPlugin'; // Импорт фронтенда
import { Sidebar } from "./modules/sidebar";
// import { SidebarFilter } from "./modules/sidebarFilter";
import { Login } from './modules/login';
import { HighlightHandler } from './modules/highlightHandler.js';

// Создаем экземпляр класса FBRPluginManager
const fbrPluginManager = new FBRPluginManager();

// Проверяем и устанавливаем значение pluginFBRactive на основе URL
fbrPluginManager.checkAndSetFBRActive();

function initializeFBRApp() {
  console.log('Initializing app for FBR...');

  frontendPlugin();
  new Login();
  const modalHandler = new ModalHandler();
  const sidebar = new Sidebar();
  const bugService = new BugService();
  const bugMarks = new BugMarks();
  const toggleCommentHandler = new ToggleCommentHandler();

  modalHandler.setupStepNavigation();

  const highlightHandler = new HighlightHandler();

  document.addEventListener('DOMContentLoaded', async () => {
    await bugService.getResponseBugs();

    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        bugMarks.renderBugMark();
      }, 100);
    });
  });


  // Создание наблюдателя для изменений в DOM
  const observer = new MutationObserver(() => {
    handleUrlChange();
  });

  // Настройка наблюдателя для слежения за изменениями в теле документа
  observer.observe(document.body, { childList: true, subtree: true });

  // Сохранение текущего URL для последующего сравнения
  observer.lastUrl = window.location.href;

  
// Функция для асинхронного вызова getResponseBugs
async function handleUrlChange() {
  if (window.location.href !== observer.lastUrl) {
    observer.lastUrl = window.location.href;
    console.log("Calling getResponseBugs after initialization");
    const bugService = new BugService();
    await bugService.getResponseBugs();
  }
}
}

// Инициализация приложения, если pluginFBRactive равен true
if (fbrPluginManager.getPluginFBRActive()) {
  initializeFBRApp();
}
