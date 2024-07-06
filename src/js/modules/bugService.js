import axios from './interceptor';
import { BugData } from './bugData';
import { DataCollector } from './dataCollector';
import { LoginModal } from './loginModal';
import { BugMarks } from './bugMarks';
import { BugList } from './bugList';
import config from '../config.js';

export class BugService {

    constructor() {
        this.bugData = new BugData();
        this.dataCollector = new DataCollector();
        this.loginModal = new LoginModal();

        this.bugMarks = new BugMarks()
        this.bugList = new BugList()

    }

    async getResponseBugs() {
        const url = new URL(`${config.apiUrl}/bugs`);
        const urlPage = this.dataCollector.getCurrentURL();
        url.searchParams.append('url', urlPage);
        let parentKey = localStorage.getItem('parentKeyforFBR');
        url.searchParams.append('parentKey', parentKey);

        try {
            // Извлекаем токен из localStorage
            const token = localStorage.getItem('tokenFBR');
            if (!token) {
                this.loginModal.showLoginForm()
                console.log("МОДАЛЬНОЕ ОКНО ЛОГИНА НЕ ДОЛЖНО ПОЯВИТЬСЯ");
                throw new Error('Token is not available in localStorage');
            }

            // Отправляем GET-запрос с заголовком Authorization
            console.log("Перед отправкой запроса");
            const response = await axios.get(url.toString(), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // Распарсим JSON-ответ
            const data = response.data.bugs;

            let parentKey = response.data.parentKeyForForm;
            localStorage.setItem('parentKeyforFBR', parentKey);

            console.log('Ответ сервера:', data);
            this.bugData.setBugs(data);
            this.bugMarks.renderBugMark()
            this.bugList.renderBugList()
        } catch (error) {
            console.error('Произошла ошибка:', error);
            alert(`Отсутствует соединение с сервером: ${error}`);
        }
    }


}  