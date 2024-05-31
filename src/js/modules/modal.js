import { DataCollector } from './dataCollector';
import { BugMarks } from './bugMarks';
// import { BugList } from './bugList';
import { BugData } from './bugData';
import { createPluginBall } from "./createBall";



export class ModalHandler {
    constructor() {
        this.dataCollector = new DataCollector();
        this.formData = new FormData();
        this.bugData = new BugData();
        this.bugMarks = new BugMarks();
        // this.bugList = new BugList();

        this.modalElement = document.querySelector('.fbr-bug-report');
        this.cancelButton = this.modalElement.querySelector('.fbr-bug-report__cancel-button');
        this.submitButton = this.modalElement.querySelector('.fbr-bug-report__submit-button');
        this.pluginContainer = document.getElementById('pluginContainer');
        this.inputSummary = document.querySelector('#bug-title');
        this.inputDescription = document.querySelector('#bug-description');
        this.inputActualResult = document.querySelector('#bug-actual');
        this.inputExpectedResult = document.querySelector('#bug-expected');
        this.bugFileInput = document.getElementById('bug-file');
        this.selectedPriority = document.getElementById('bug-priority');
        this.selectedExecutor = document.getElementById('bug-executor');

        // Проверяем существование элемента с классом .fbr-bug-report
        if (!this.modalElement) {
            throw new Error('Элемент с классом .fbr-bug-report не найден на странице.');
        }
        // Вызываем метод openModal при клике на любую точку страницы
        document.addEventListener('click', (event) => {

            const isInsidePluginBase = event.target.closest('.fbr-plugin-base');
    
            if (!isInsidePluginBase) {
                // Предотвращаем действие по умолчанию и остановим распространение события
                event.preventDefault();
                event.stopPropagation();
            }


            // Получаем целевой элемент, на который кликнули
            const targetElement = event.target;

            // Получаем контейнер с классом plugin-container
            const container = document.querySelector('.fbr-plugin-container');

            // Проверяем, является ли целевой элемент потомком контейнера с классом plugin-container
            const isInsideContainer = container.contains(targetElement);

            // Если клик был вне контейнера, выполняйте ваш код
            if (!isInsideContainer) {
                this.openModal(event);
                event.stopPropagation();
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
            event.stopPropagation();
        });

        this.submitButton = this.modalElement.querySelector('.fbr-bug-report__submit-button');

        this.submitButton.addEventListener('click', async (event) => {
            event.preventDefault();
            await this.sendBugReport(this.formData); // Вызываем метод closeModal при клике
            event.stopPropagation();
        });

        this.bugFileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            this.addToFormData("expectedScreenshot", file);
        });

    }

    // Функция открытия модального окна вместе с добавлением метки
    async openModal(event) {
        // Проверяем, что модальное окно закрыто
        if (this.modalElement.style.display === 'none' || this.modalElement.style.display === '') {
            try {

                const { xClick, yClick, xRelatively, yRelatively, heightRatio, widthRatio } = this.dataCollector.getClickCoordinates(event); // Обращаемся к функции, которая собирает данные со страницы

                const xpath = this.dataCollector.getXPath(event.target); //Здесь передаем таргет в фукнцию, которая возвращает xpath
                console.log("xpath:" + xpath + " ", "xClick:" + xClick + " ", "yClick:" + yClick + " ", "xRelatively:" + xRelatively + " ", "yRelatively:" + yRelatively + " ", "heightRatio:" + heightRatio + " ", "widthRatio:" + widthRatio + " ",);
                //Добавляем xpath, высоту, ширину в формдату
                this.addToFormData("xpath", xpath)
                this.addToFormData("heightRatio", heightRatio)
                this.addToFormData("widthRatio", widthRatio)

                createPluginBall(xRelatively, yRelatively, xpath, document.querySelector('.fbr-plugin-balls'));
                const dataUrl = await this.dataCollector.makeScreenshot();
                const dataBlob = this.dataURLToBlob(dataUrl)

                this.addToFormData("actualScreenshot", dataBlob)

                this.modalElement.style.display = 'block'; //добавляем к модальному окну свойство display
                this.modalElement.style.setProperty('display', 'block', 'important'); //добавляем к модальному окну свойство display
                //сдвигаем окно в сторону от клика
                this.modalElement.style.left = xClick - 19 + 'px';
                this.modalElement.style.top = yClick + 24 + 'px';

            } catch (error) {
                console.error(error);
            }
        }
    }

    // Закрываем модальное окно
    closeModal() {

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


    async sendBugReport() {

        this.addToFormData("url", this.dataCollector.getCurrentURL())
        this.addToFormData("OsVersion", await this.dataCollector.getOSVersion())
        this.addToFormData("environment", this.dataCollector.getEnvironment())
        this.addToFormData("pageResolution", this.dataCollector.getPageResolution())

        this.addToFormData("summary", this.inputSummary.value)
        this.addToFormData("description", this.inputDescription.value)
        this.addToFormData("actualResult", this.inputActualResult.value)
        this.addToFormData("expectedResult", this.inputExpectedResult.value)
        this.addToFormData("priority", this.selectedPriority.value)
        this.addToFormData("executor", this.selectedExecutor.value)



        // for (const pair of this.formData.entries()) {
        //     console.log(`1Ключ: ${pair[0]}, Значение: ${pair[1]}`);
        // }
        try {
            const apiUrl = 'http://localhost:3000/api/bug';
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: this.formData,
            });

            const data = await response.json();

            if (!response.ok) {
                alert(`Произошла ошибка: ${response.status}\nОтвет от сервера: ${JSON.stringify(data.message)}`);
                throw new Error('Network response was not ok');
            }

            
            console.log('Ответ от сервера:', data);

            this.bugData.setBugs(data)

            this.formData = new FormData();
            this.modalElement.style.display = 'none';
            this.modalElement.style.setProperty('display', 'none', 'important');
            this.pluginContainer.style.display = 'block';
            this.pluginContainer.style.setProperty('display', 'block', 'important');
            this.bugMarks.renderBugMark()
        /*     this.bugList.renderBugList() */
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    }

}

