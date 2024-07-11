import { DataCollector } from './dataCollector';
import { BugMarks } from './bugMarks';
import { BugList } from './bugList';
import { BugData } from './bugData';
import { createPluginBall } from "./createBall";
import { BugSidebar } from "./bugSidebar";

import config from '../config.js';
import axios from './interceptor';



export class ModalHandler {
    constructor() {
        this.dataCollector = new DataCollector();
        this.formData = new FormData();
        this.bugData = new BugData();
        this.bugMarks = new BugMarks();
        this.bugList = new BugList();


        this.modalElement = document.querySelector('.fbr-bug-report');
        this.cancelButton = this.modalElement.querySelector('.fbr-bug-report__cancel-button');
        this.submitButton = this.modalElement.querySelector('.fbr-bug-report__submit-button');
        this.pluginContainer = document.getElementById('pluginContainer');
        this.inputParent = document.querySelector('#bug-parent');
        this.inputSummary = document.querySelector('#bug-title');
        this.inputDescription = document.querySelector('#bug-description');
        this.inputActualResult = document.querySelector('#bug-actual');
        this.inputExpectedResult = document.querySelector('#bug-expected');
        this.bugFileInput = document.getElementById('bug-file');
        this.selectedPriority = document.getElementById('bug-priority');
        this.selectedTags = document.getElementById('bug-tags');
        // Находим все элементы с классом .fbr-bug-report__step
        this.steps = document.querySelectorAll('.fbr-bug-report__step');
        // Находим все элементы с классом .fbr-bug-report__tab
        this.tabs = document.querySelectorAll('.fbr-bug-report__tab');
        // Получаем ссылку на кнопку "Далее"
        this.nextButtons = document.querySelectorAll('.fbr-bug-report__next-button');
        // Получаем ссылку на поле "Название бага"
        this.bugTitleInput = document.querySelector('#bug-title');
           // Получаем ссылку на поле "Родительская задача"
           this.bugParentKeyInput = document.querySelector('#bug-parent');
        

        // Проверяем существование элемента с классом .fbr-bug-report
        if (!this.modalElement) {
            throw new Error('Элемент с классом .fbr-bug-report не найден на странице.');
        }
        // Обработка чтобы модальное окно не открывалось при клике на элементы модального окна, но остальныесобытия внутри модального окна работали
        document.addEventListener('click', (event) => {
            // Получаем целевой элемент, на который кликнули
            const targetElement = event.target;

            // Проверяем, не является ли целевой элемент кнопкой закрытия или другими исключенными элементами
            if (targetElement.classList.contains('fbr-bug-report__cancel-button') || targetElement.closest('.fbr-bug-report')) {
                return; // Выходим из обработчика, если кликнули на кнопку закрытия или внутри модального окна
            }

            const isInsidePluginBase = targetElement.closest('.fbr-plugin-base');

            if (!isInsidePluginBase) {
                // Получаем контейнер с классом plugin-container
                const container = document.querySelector('.fbr-plugin-container');

                // Проверяем, является ли целевой элемент потомком контейнера с классом plugin-container
                const isInsideContainer = container.contains(targetElement);

                // Если клик был вне контейнера, выполняйте ваш код
                if (!isInsideContainer) {
                    this.openModal(event);
                    event.stopPropagation();
                }
            }
        });


        // Находим кнопку с классом bug-report__cancel-button
        this.cancelButton = this.modalElement.querySelector('.fbr-bug-report__cancel-button');
        if (!this.cancelButton) {
            throw new Error('Кнопка с классом .fbr-bug-report__cancel-button не найдена в модальном окне.');
        }

        // Добавляем обработчик клика на кнопку
        this.cancelButton.addEventListener('click', (event) => {
            this.closeModal(); // Вызываем метод closeModal при клике
            document.querySelector('.fbr-plugin-ball-empty').remove();
            event.stopPropagation();
        });

        this.submitButton = this.modalElement.querySelector('.fbr-bug-report__submit-button');

        this.submitButton.addEventListener('click', async (event) => {
            event.preventDefault();
            await this.sendBugReport(this.formData);
            event.stopPropagation();
        });

        this.bugFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            this.addToFormData("expectedScreenshot", file);
        });

    }

    // Функция открытия модального окна вместе с добавлением метки
    async openModal(event) {
    // Очищаем FormData перед каждым открытием модального окна
    this.formData = new FormData();
        // Проверяем, что модальное окно закрыто
        if (this.modalElement.style.display === 'none' || this.modalElement.style.display === '') {
            try {
                // Начинаем с показа первого этапа по умолчанию
                this.showStep('1', this.steps, this.tabs);
                const { xClick, yClick, xRelatively, yRelatively, heightRatio, widthRatio } = this.dataCollector.getClickCoordinates(event); // Обращаемся к функции, которая собирает данные со страницы

                const xpath = this.dataCollector.getXPath(event.target); //Здесь передаем таргет в фукнцию, которая возвращает xpath
                console.log("xpath:" + xpath + " ", "xClick:" + xClick + " ", "yClick:" + yClick + " ", "xRelatively:" + xRelatively + " ", "yRelatively:" + yRelatively + " ", "heightRatio:" + heightRatio + " ", "widthRatio:" + widthRatio + " ",);
                //Добавляем xpath, высоту, ширину в формдату
                this.addToFormData("xpath", xpath)
                this.addToFormData("heightRatio", heightRatio)
                this.addToFormData("widthRatio", widthRatio)

                createPluginBall(xRelatively, yRelatively, xpath, document.querySelector('.fbr-plugin-balls'));
                const dataUrl = await this.dataCollector.makeScreenshot();
                this.addToFormData("actualScreenshot", dataUrl)

                this.modalElement.style.display = 'block'; //добавляем к модальному окну свойство display
                this.modalElement.style.setProperty('display', 'block', 'important'); //добавляем к модальному окну свойство display

                let parentKey = localStorage.getItem('parentKeyforFBR');
                if (parentKey) {
                    // Извлекаем первое значение из parentKey
                    const firstParentKey = parentKey.split(',')[0];
                    this.inputParent.value = firstParentKey;
                }

                //сдвигаем окно в сторону от клика
                this.modalElement.style.left = xClick - 19 + 'px';
                this.modalElement.style.top = yClick + 24 + 'px';

            } catch (error) {
                console.error(error);
            }
        }
    }

    setupStepNavigation() {
        // Получаем ссылку на поле "Название бага"
        this.bugTitleInput = document.querySelector('#bug-title');
        // Получаем ссылку на поле "Родительская задача"
        this.bugParentKeyInput = document.querySelector('#bug-parent');
    
        // Добавляем обработчики событий для каждого таба
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (event) => {
                event.preventDefault(); // Предотвращаем перезагрузку страницы
                // Получаем значение атрибута data-step из нажатого таба
                const step = event.target.getAttribute('data-step');
                // Переходим к выбранному этапу
                this.showStep(step, this.steps, this.tabs);
            });
        });
    
        // Функция для проверки заполненности обоих полей
        const checkFields = () => {
            if (this.bugTitleInput.value.trim() !== '' && this.bugParentKeyInput.value.trim() !== '') {
                // Если оба поля заполнены, делаем кнопку "Далее" активной
                this.nextButtons.forEach(nextButton => {
                    nextButton.classList.add('active');
                    nextButton.disabled = false;
                });
            } else {
                // Если хотя бы одно из полей не заполнено, делаем кнопку "Далее" неактивной
                this.nextButtons.forEach(nextButton => {
                    nextButton.classList.remove('active');
                    nextButton.disabled = true;
                });
            }
        };
    
        // Добавляем обработчик события на изменение содержимого поля "Название бага"
        this.bugTitleInput.addEventListener('input', checkFields);
    
        // Добавляем обработчик события на изменение содержимого поля "Родительская задача"
        this.bugParentKeyInput.addEventListener('input', checkFields);
    
        this.nextButtons.forEach(nextButton => {
            // Добавляем обработчик события на клик по кнопке "Далее"
            nextButton.addEventListener('click', () => {
                // Получаем номер текущего этапа
                const currentStep = parseInt(document.querySelector('.fbr-bug-report__tab.active').getAttribute('data-step'));
                // Вычисляем номер следующего этапа
                const nextStep = currentStep + 1;
                // Показываем следующий этап
                this.showStep(nextStep.toString(), this.steps, this.tabs);
            });
        });
    
        // Начинаем с показа первого этапа по умолчанию
        this.showStep('1', this.steps, this.tabs);
    
        // Проверяем поля при загрузке страницы
        checkFields();
    }

    // Функция для показа выбранного этапа и скрытия остальных
    showStep(step, steps, tabs) {
        // Перебираем все элементы с классом .fbr-bug-report__step
        steps.forEach(stepElement => {
            // Показываем элемент, если его id соответствует выбранному шагу
            if (stepElement.id === `step-${step}`) {
                stepElement.style.display = 'block';

            } else {
                // Скрываем все остальные элементы
                stepElement.style.display = 'none';
            }
        });

        // Перебираем все табы
        tabs.forEach(tab => {
            // Добавляем класс active к табу, соответствующему выбранному шагу
            if (tab.getAttribute('data-step') === step) {
                tab.classList.add('active');
                tab.disabled = false;
            } else {
                // Убираем класс active у всех остальных табов
                tab.classList.remove('active');
            }
        });
    }

    clearFormFields() {
                // Очистка поля "Название бага"
                this.inputParent.value = '';

        // Очистка поля "Название бага"
        this.inputSummary.value = '';

        // Очистка поля "Описание бага"
        this.inputDescription.value = '';

        // Очистка поля "Фактический результат"
        this.inputActualResult.value = '';

        // Очистка поля "Ожидаемый результат"
        this.inputExpectedResult.value = '';

        // Очистка поля "Выберите файл для ожидаемого результата"
        this.bugFileInput.value = '';

        // Перебираем все табы
        this.tabs.forEach(tab => {
            // Добавляем disabled к каждому табу
            tab.disabled = true;
        });


        this.nextButtons.forEach(nextButton => {
            nextButton.classList.remove('active');
            nextButton.disabled = true;
        })


    }

    // Закрываем модальное окно
    closeModal() {
        this.clearFormFields()

        this.pluginContainer.style.display = 'block'
        this.pluginContainer.style.setProperty('display', 'block', 'important');
        this.modalElement.style.display = 'none';
        this.modalElement.style.setProperty('display', 'none', 'important');

    }
    // Функция добавления данных в форм дату
    addToFormData(name, value) {
        this.formData.append(name, value);
        return this.formData
    }
    
    dataURLToBlob(dataURL) {

        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const byteCharacters = atob(parts[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    }

    // Показать лоадер
    showLoader() {
        const loader = document.querySelector('.fbr-loader');
        loader.style.display = 'block';
    }

    // Скрыть лоадер
    hideLoader() {
        const loader = document.querySelector('.fbr-loader');
        loader.style.display = 'none';
    }

    async sendBugReport() {
        
        this.addToFormData("url", this.dataCollector.getCurrentURL());
        this.addToFormData("OsVersion", await this.dataCollector.getOSVersion());
        this.addToFormData("environment", this.dataCollector.getEnvironment());
        this.addToFormData("pageResolution", this.dataCollector.getPageResolution());
    
        this.addToFormData("parentKeyForForm", this.inputParent.value);
        this.addToFormData("summary", this.inputSummary.value);
        this.addToFormData("description", this.inputDescription.value);
        this.addToFormData("actualResult", this.inputActualResult.value);
        this.addToFormData("expectedResult", this.inputExpectedResult.value);
        this.addToFormData("priority", this.selectedPriority.value);
        this.addToFormData("tags", this.selectedTags.value);


    
        try {
            this.showLoader();
            this.submitButton.style.visibility = 'hidden'; // Скрываем кнопку "Отправить"
    
            const apiUrl = `${config.apiUrl}/bug`;

            const token = localStorage.getItem('tokenFBR');
            if (!token) {
                throw new Error('Token is not available in localStorage');
            }

            const response = await axios.post(apiUrl, this.formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                     'Authorization': `Bearer ${token}`
                }
            });
    
            const data = response.data.bugs;

            const parentKey = response.data.parentKeyForForm;
            console.log("ОТОБРАЖЕНИЕ parentKeyforFBR после отправки бага "+parentKey);
        localStorage.setItem('parentKeyforFBR', parentKey);

            console.log('Ответ от сервера:', data);
    
            this.bugData.setBugs(data);
            this.formData = new FormData();
            this.bugMarks.renderBugMark();
            this.bugList.renderBugList();
        } catch (error) {
            console.error('Произошла ошибка:', error);
            document.querySelector('.fbr-plugin-ball-empty').remove();
            if (error.response) {
                alert(`Произошла ошибка: ${error.response.status}\nОтвет от сервера: ${JSON.stringify(error.response.data.message)}`);
                
            } else {
                alert(`Отсутствует соединение с сервером: ${error.message}`);
            }
        } finally {
            this.hideLoader(); // Скрыть лоадер после получения ответа от сервера
            this.submitButton.style.visibility = 'visible'; // Восстанавливаем кнопку "Отправить"
            this.closeModal()
            new BugSidebar();
    
        }
    }
}

