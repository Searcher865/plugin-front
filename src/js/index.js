import { ModalHandler } from './modules/modal';
import { BugMarks } from './modules/bugMarks';


const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('fbr')) {
const fbrBody = document.querySelector("body")
const fbrContainer = document.createElement('div');
fbrContainer.classList.add('fbr-plugin-base');
fbrContainer.innerHTML = `<div class="fbr-plugin-layout">
			<div class="fbr-plugin-balls">
			</div>
			
			<div class="fbr-bug-report">
				<form class="fbr-bug-report__form">
					<label class="fbr-bug-report__input-label" for="bug-title">Название бага:</label>
					<input class="fbr-bug-report__input-field" type="text" id="bug-title" placeholder="Введите название бага">
			
					<label class="fbr-bug-report__input-label" for="bug-description">Описание бага:</label>
					<textarea class="fbr-bug-report__textarea-field" id="bug-description" placeholder="Введите описание бага"></textarea>
					
					<label class="fbr-bug-report__input-label" for="bug-actual">Фактический результат:</label>
					<textarea class="fbr-bug-report__textarea-field" id="bug-actual" placeholder="Введите описание фактического результата"></textarea>

					<label class="fbr-bug-report__input-label" for="bug-expected">Ожидаемый рузльтат:</label>
					<textarea class="fbr-bug-report__textarea-field" id="bug-expected" placeholder="Введите описание ожидаемого результата"></textarea>

					<label class="fbr-bug-report__input-label" for="bug-file">Выберите файл для ожидаемоего результата:</label>
					<input class="fbr-bug-report__input-field" type="file" id="bug-file" name="bug-file">

					<!-- Поле селекта "Приоритет" -->
					<label class="fbr-bug-report__input-label" for="bug-priority">Приоритет:</label>
					<select class="fbr-bug-report__select-field" id="bug-priority" name="bug-priority">
					<option value="critical">Критичный</option>
					<option value="normal" selected>Средний</option>
					<option value="minor">Низкий</option>
					</select>

					<!-- Поле селекта "Исполнитель" -->
					<label class="fbr-bug-report__input-label" for="bug-executor">Исполнитель:</label>
					<select class="fbr-bug-report__select-field" id="bug-executor" name="bug-executor">
					<option value="frontend">Frontend</option>
					<option value="backend">Backend</option>
					<option value="both">Frontend и Backend</option>
					</select>

					<div class="fbr-bug-report__btn-wrapper">
						<button class="fbr-bug-report__cancel-button" type="button">Закрыть</button>
						<button class="fbr-bug-report__submit-button" type="button">Отправить</button>
					</div>
				</form>
			</div>
		</div><div class="fbr-plugin-container" id="pluginContainer">
			<!-- кнопка активации режима комментирования -->
			<div class="fbr-comment__togle" id="plugin-comment-togle" data-active="false">
				<div class="fbr-comment__switch">
					<div class="fbr-comment__switch-togle">
						<div class="fbr-comment__switch-icon-unact">
							on
						</div>`;
fbrBody.appendChild(fbrContainer);

const style = document.createElement('style');
style.type = 'text/css';
const css = `@charset "UTF-8";
/* Blocks */
.fbr-plugin-base {
  position: absolute !important;
  top: 0 !important;
}

.fbr-plugin-container {
  position: fixed !important;
  top: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  pointer-events: none !important;
  z-index: 2147483600 !important;
}

.fbr-bug-report {
  display: none !important;
  position: absolute !important;
  z-index: 2147483600 !important;
  /* Стили для формы  может быть здесь нужно у z-index сделать +1*/
  /* Стили для полей ввода и кнопок */
}
.fbr-bug-report__form {
  width: 350px !important;
  margin: 0 auto !important;
  padding: 15px !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
  background-color: white !important;
  font-size: 10px !important;
  line-height: 20px !important;
  color: #778aa7 !important;
  font-family: Gordita-Medium !important;
  font-weight: 500 !important;
  z-index: 2147483600 !important;
}
.fbr-bug-report__input-label {
  display: block !important;
  margin-bottom: 5px !important;
  z-index: 2147483600 !important;
}
.fbr-bug-report__input-field {
  width: 100% !important;
  padding: 10px !important;
  margin-bottom: 10px !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
  z-index: 2147483600 !important;
}
.fbr-bug-report__textarea-field {
  width: 100% !important;
  height: 100px !important;
  padding: 10px !important;
  margin-bottom: 10px !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
  z-index: 2147483600 !important;
}
.fbr-bug-report__btn-wrapper {
  display: flex !important;
  column-gap: 10px !important;
  z-index: 2147483600 !important;
}
.fbr-bug-report__submit-button {
  width: 50% !important;
  padding: 10px !important;
  background-color: #2ea2f6 !important;
  border: none !important;
  border-radius: 4px !important;
  color: white !important;
  cursor: pointer !important;
  z-index: 2147483600 !important;
}
.fbr-bug-report__cancel-button {
  width: 50% !important;
  padding: 10px !important;
  background-color: #ccc !important;
  border: none !important;
  border-radius: 4px !important;
  color: white !important;
  cursor: pointer !important;
  z-index: 2147483600 !important;
}

.fbr-comment__togle {
  pointer-events: all !important;
  z-index: 999 !important;
  position: absolute !important;
  width: 75px !important;
  height: 45px !important;
  bottom: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  cursor: pointer !important;
  z-index: 2147483600 !important;
}
.fbr-comment__switch {
  width: 50px !important;
  height: 30px !important;
  background-color: #e2e7ed !important;
  border-radius: 25px !important;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15), inset 0 1px 4px rgba(0, 0, 0, 0.16) !important;
  z-index: 2147483600 !important;
}
.fbr-comment__switch--active {
  background-color: #2EA2F6;
  z-index: 2147483600 !important;
}
.fbr-comment__switch-togle {
  position: absolute !important;
  top: 50% !important;
  left: 0 !important;
  transform: translate(0%, -50%) !important;
  width: 40px !important;
  height: 40px !important;
  border-radius: 100% !important;
  background-color: white !important;
  transition: all 0.2s ease-in !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  box-shadow: 0 10px 35px 0 rgba(0, 0, 0, 0.15) !important;
  z-index: 2147483600 !important;
}
.fbr-comment__switch-togle .fbr-comment__switch-icon-act {
  display: none !important;
  z-index: 2147483600 !important;
}
.fbr-comment__switch-togle--active {
  left: 50% !important;
  z-index: 2147483600 !important;
}
.fbr-comment__switch-togle--active .fbr-comment__switch-icon-act {
  display: block !important;
  z-index: 2147483600 !important;
}
.fbr-comment__switch-togle--active .fbr-comment__switch-icon-unact {
  display: none !important;
  z-index: 2147483600 !important;
}
.fbr-comment__switch-icon-unact, .fbr-comment__switch-icon-act {
  width: 25px !important;
  height: 25px !important;
  z-index: 2147483600 !important;
}
.fbr-comment__switch-icon-unact img, .fbr-comment__switch-icon-act img {
  border-radius: 100%;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  z-index: 2147483600 !important;
}

.fbr-plugin-layout {
  position: relative !important;
  z-index: 2147483600 !important;
}

.fbr-plugin-balls {
  position: absolute !important;
  z-index: 2147483600 !important;
}

.fbr-plugin-ball {
  position: absolute !important;
  width: 38px !important;
  height: 38px !important;
  transition: transform 0.12s ease, opacity 0.12s ease !important;
  background-color: #2ea2f6 !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  z-index: 2147483600 !important;
}
.fbr-plugin-ball__number {
  position: absolute !important;
  width: 38px !important;
  height: 38px !important;
  text-align: center !important;
  line-height: 32px !important;
  border: 3px solid #fff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  border-radius: 50% !important;
  font-size: 16px !important;
  font-family: Gordita-Bold !important;
  font-weight: 700 !important;
  color: #fff !important;
  background: #2ea2f6 !important;
  z-index: 2147483600 !important;
}
.fbr-plugin-ball__inner {
  display: none !important;
  z-index: 2147483600 !important;
}

.fbr-plugin-ball__number:hover + .fbr-plugin-ball__peek .fbr-plugin-ball__inner {
  display: block !important; /* Отображение элемента при наведении на .plugin-ball__number */
  position: absolute !important;
  top: 2px !important;
  left: 0px !important;
  width: 260px !important;
  padding-left: 42px !important;
  background: #fff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
  border-radius: 60px !important;
  overflow: hidden !important;
  transition: transform 0.12s ease, opacity 0.15s ease !important;
  pointer-events: none !important;
  transform-origin: left !important;
  font-size: 10px !important;
  z-index: 2147483601 !important;
}

.fbr-plugin-container {
  position: fixed !important;
  top: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  pointer-events: none !important;
  z-index: 2147483600 !important;
}`;
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', async () => {
  const bugMarks = new BugMarks();

  // Дождитесь завершения выполнения асинхронных функций
  await bugMarks.getResponseBugsMarks();

  // Теперь можно выполнить остальной код, который зависит от результатов асинхронных функций
  const modalHandler = new ModalHandler();
});
}