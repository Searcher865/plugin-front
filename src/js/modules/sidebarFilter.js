import axios from './interceptor';
import { BugMarks } from './bugMarks';
import { BugList } from './bugList';
import { BugData } from './bugData';
import { LoginModal } from './loginModal';

export class SidebarFilter {
  constructor() {
    document.addEventListener('DOMContentLoaded', this.init.bind(this));
    this.bugData = new BugData();
    this.bugMarks = new BugMarks(this.bugData);
    this.bugList = new BugList(this.bugData);
    this.loginModal = new LoginModal();

    this.submitButton = document.getElementById('fbr-apply-btn');
    this.loader = document.querySelector('.fbr-loader-filter');
  }

  init() {
    this.inputField = document.getElementById('fbr-parent-task');
    this.dropdown = document.getElementById('fbr-task-list');
    this.applyBtn = document.getElementById('fbr-apply-btn');
    this.allPagesCheckbox = document.getElementById('fbr-all-pages');

    this.loadInitialValue();
    this.addEventListeners();
  }

  loadInitialValue() {
    const parentKey = localStorage.getItem('parentKeyforFBR');
    if (parentKey) {
      this.inputField.value = parentKey;
    }
  }

  addEventListeners() {
    this.inputField.addEventListener('focus', this.showDropdown.bind(this));
    document.addEventListener('click', this.hideDropdownOnClickOutside.bind(this));
    this.dropdown.addEventListener('click', this.fillInputField.bind(this));
    this.applyBtn.addEventListener('click', this.applySelectedValue.bind(this));
  }

  showDropdown() {
    this.dropdown.style.setProperty('display', 'block', 'important');
  }

  hideDropdownOnClickOutside(e) {
    if (!document.querySelector('.fbr-custom-dropdown').contains(e.target)) {
      this.dropdown.style.display = 'none';
    }
  }

  fillInputField(e) {
    if (e.target.tagName === 'LI') {
      const selectedValue = e.target.textContent;
      this.inputField.value = selectedValue;
      this.dropdown.style.display = 'none';
      localStorage.setItem('parentKeyforFBR', selectedValue);
    }
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
      const response = await axios.get('http://localhost:3000/api/bugs', {
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
      const response = await axios.get('http://localhost:3000/api/bugList', {
        params: {
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
    this.submitButton.style.visibility = 'hidden'; // Скрываем кнопку "Отправить"
}

// Скрыть лоадер
hideLoader() {
    
  this.loader.style.display = 'none';
    this.submitButton.style.visibility = 'visible'; // Восстанавливаем кнопку "Отправить"
}
}
