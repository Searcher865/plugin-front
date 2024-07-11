import { DataCollector } from './dataCollector';
import axios from 'axios';
import { LoginModal } from './loginModal';
import { BugService } from './bugService';


export class Login {
    constructor() {
        this.modalElement = document.querySelector('.fbr-login-modal');
        this.submitButton = this.modalElement.querySelector('.fbr-login-modal__submit-button');
        this.email = this.modalElement.querySelector('#bug-email');
        this.password = this.modalElement.querySelector('#bug-password');
        
        this.loginModal = new LoginModal();
        this.bugService = new BugService();

        // Добавляем обработчик клика на кнопку
        this.submitButton.addEventListener('click', (event) => {
            this.login(); // Вызываем метод login при клике
            event.stopPropagation();
        });
    }

    async login() {
        try {
            const response = await axios.post('http://localhost:3000/api/login', {
                email: this.email.value,
                password: this.password.value
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('tokenFBR', data.accessToken);
                localStorage.setItem('parentKeyforFBR', data.user.parentKeyForForm);
                alert('Login successful!');
                this.bugService.getResponseBugs()
                this.loginModal.closeModal();
           
          
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
    }

}
