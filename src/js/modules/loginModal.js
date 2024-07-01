import { DataCollector } from './dataCollector';
import axios from 'axios';

export class LoginModal {
    constructor() {
        this.pluginContainer = document.getElementById('pluginContainer');
        this.modalElement = document.querySelector('.fbr-login-modal');
        this.submitButton = this.modalElement.querySelector('.fbr-login-modal__submit-button');
        this.email = this.modalElement.querySelector('#bug-email');
        this.password = this.modalElement.querySelector('#bug-password');

        this.email.addEventListener('input', () => this.toggleSubmitButton());
        this.password.addEventListener('input', () => this.toggleSubmitButton());
    }

    toggleSubmitButton() {
        if (this.email.value.trim() !== '' && this.password.value.trim() !== '') {
            this.submitButton.disabled = false;
            this.submitButton.classList.add('active');
        } else {
            this.submitButton.disabled = true;
            this.submitButton.classList.remove('active');
          
        }
    }
     showLoginForm() {
        this.modalElement.style.display = 'flex';
        this.modalElement.style.setProperty('display', 'flex', 'important');
    
    }

    closeModal() {
        this.pluginContainer.style.display = 'block'
        this.pluginContainer.style.setProperty('display', 'block', 'important');
        this.modalElement.style.display = 'none';
        this.modalElement.style.setProperty('display', 'none', 'important');

    }
}
