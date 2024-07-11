import axios from './interceptor';
import { BugMarks } from './bugMarks';
import { BugList } from './bugList';
import { BugData } from './bugData';
import { LoginModal } from './loginModal';
import { BugSidebar } from "./bugSidebar";
import { DataCollector } from './dataCollector';
import config from '../config.js';

export class Sidebar {
    constructor() {
        this.bugData = new BugData();
        this.bugMarks = new BugMarks(this.bugData);
        this.bugList = new BugList(this.bugData);
        this.loginModal = new LoginModal();
        this.dataCollector = new DataCollector();

        this.sidebarToggleBtn = document.getElementById("fbr-sidebarToggleBtn");
        this.sidebar = document.getElementById("sidebar");

        // Табы в сайдбаре
        this.tabButtons = document.querySelectorAll(".fbr-sidebar__tab");
        this.tabContents = document.querySelectorAll(".fbr-sidebar__tab-content");
        this.dropdown = document.getElementById('fbr-task-list');
        this.inputField = document.getElementById('fbr-parent-task');
        this.applyBtn = document.getElementById('fbr-apply-btn');
        this.allPagesCheckbox = document.getElementById('fbr-all-pages');
        this.loader = document.querySelector('.fbr-loader-filter');

        // Вызов метода для открытия сайдбара
        this.openSidebar();
        this.openScreenSidebar();

        // Добавляем обработчик для inputField
        this.inputField.addEventListener("click", () => {
            this.showDropdown();
        });

               // Добавляем обработчик для клика вне dropdown
               document.addEventListener('click', (e) => {
                this.hideDropdownOnClickOutside(e);
            });
        // Добавляем обработчик для кнопки применения
        this.applyBtn.addEventListener('click', () => {
            this.applySelectedValue();
        });

        document.addEventListener('DOMContentLoaded', () => {
            this.loadInitialValue();
            this.populateDropdown();
        });
    }

    populateDropdown() {
        const parentKey = localStorage.getItem('parentKeyforFBR');
  
        if (parentKey) {
            const keys = parentKey.split(',');
    
            // Очищаем текущий список элементов
            this.dropdown.innerHTML = '';
    
            // Добавляем каждый элемент в список
            keys.forEach(key => {
                const li = document.createElement('li');
                li.textContent = key;
                this.dropdown.appendChild(li);
            });
    
            // Добавляем элемент "Все баги" в конец списка
            const allBugsLi = document.createElement('li');
            allBugsLi.textContent = 'Все баги';
            this.dropdown.appendChild(allBugsLi);
        } else {
            // Если parentKey пуст или не существует, добавляем только элемент "Все баги"
            this.dropdown.innerHTML = '<li>Все баги</li>';
        }

        // Добавляем обработчики для кликов по элементам списка dropdown после их создания
        this.dropdown.querySelectorAll('li').forEach(item => {
            item.addEventListener('click', (e) => {
                this.setInputFieldValue(e);
                this.hideDropdown();
            });
        });
    }

    loadInitialValue() {
      const parentKey = localStorage.getItem('parentKeyforFBR');
      if (parentKey) {
        // Извлекаем первое значение из parentKey
        const firstParentKey = parentKey.split(',')[0];
        this.inputField.value = firstParentKey;
    }
    }

    openSidebar() {
        this.sidebarToggleBtn.addEventListener("click", () => {
            this.sidebar.classList.toggle('fbr-sidebar--active');
            this.bugSidebar = new BugSidebar()
            this.loadInitialValue();
            this.populateDropdown();
        });
    }

    showDropdown() {
        this.dropdown.style.setProperty('display', 'block', 'important');
      }
      
      hideDropdown() {
        this.dropdown.style.setProperty('display', 'none', 'important');
    } 
    
    hideDropdownOnClickOutside(e) {
        if (!this.dropdown.contains(e.target) && e.target !== this.inputField) {
            this.hideDropdown();
        }
    }

    setInputFieldValue(e) {
        this.inputField.value = e.target.textContent;
    }



    applySelectedValue() {
        const selectedValue = this.inputField.value.trim();
        
        if (selectedValue !== '') {
          localStorage.setItem('parentKeyforFBR', selectedValue);
          
          if (this.allPagesCheckbox.checked) {
            this.sendGetRequestToBugList(selectedValue);
          } else {
            this.sendGetRequest(selectedValue);
          }
        } else {
          alert('Выберите или введите значение для родительской задачи');
        }
      }
    
      async sendGetRequest(parentKey) {
        const token = localStorage.getItem('tokenFBR');
        if (!token) {
          this.loginModal.showLoginForm();
          throw new Error('Token is not available in localStorage');
        }
    
        try {
          this.showLoader();
          const response = await axios.get(`${config.apiUrl}/bugs`, {
            params: {
              url: window.location.href,
              parentKey: parentKey
            },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          this.handleResponse(response);
        } catch (error) {
          console.error('Произошла ошибка:', error);
          if (error.response) {
              alert(`Произошла ошибка: ${error.response.status}\nОтвет от сервера: ${JSON.stringify(error.response.data.message)}`);
          } else {
              alert(`Отсутствует соединение с сервером: ${error.message}`);
          }
      } finally {
        this.hideLoader(); // Скрыть лоадер после получения ответа от сервера
    }
      }
    
      async sendGetRequestToBugList(parentKey) {
        const token = localStorage.getItem('tokenFBR');
        if (!token) {
          this.loginModal.showLoginForm();
          throw new Error('Token is not available in localStorage');
        }
    
        try {
          this.showLoader();
          const response = await axios.get(`${config.apiUrl}/bugList`, {
            params: {
              url: window.location.href,
              parentKey: parentKey
            },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          this.handleResponse(response);
        } catch (error) {
          console.error('Произошла ошибка:', error);
          if (error.response) {
              alert(`Произошла ошибка: ${error.response.status}\nОтвет от сервера: ${JSON.stringify(error.response.data.message)}`);
          } else {
              alert(`Отсутствует соединение с сервером: ${error.message}`);
          }
      } finally {
        this.hideLoader(); // Скрыть лоадер после получения ответа от сервера
    }
      }
    
      handleResponse(response) {
        const data = response.data.bugs;
        const parentKey = response.data.parentKeyForForm;
    
        console.log("ОТОБРАЖЕНИЕ parentKeyforFBR после отправки бага " + parentKey);
        localStorage.setItem('parentKeyforFBR', parentKey);
    
        console.log('Ответ от сервера:', data);
    
        this.bugData.setBugs(data);
        this.bugMarks.renderBugMark();
        this.bugList.renderBugList();
      }
    
      showLoader() {
        this.loader.style.display = 'block';
        this.applyBtn.style.visibility = 'hidden'; // Скрываем кнопку "Отправить"
      }
    
      hideLoader() {
        this.loader.style.display = 'none';
        this.applyBtn.style.visibility = 'visible'; // Восстанавливаем кнопку "Отправить"
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

            // Перебираем все элементы с классом fbr-plugin-ball
            const balls = document.querySelectorAll(".fbr-plugin-ball");

            balls.forEach((ball) => {
                const status = ball.getAttribute("data-status");

                if (tabId === "fbr-sidebar-tab-open") {
                    if (status === "open") {
                        ball.style.display = "block";
                    } else if (status === "closed") {
                        ball.style.display = "none";
                    }
                } else if (tabId === "fbr-sidebar-tab-closed") {
                    if (status === "closed") {
                        ball.style.display = "block";
                    } else if (status === "open") {
                        ball.style.display = "none";
                    }
                }
            });
        });
    });
}
}