export function frontendPlugin() {
  const fbrBody = document.querySelector("body");
  const fbrContainer = document.createElement('div');
  fbrContainer.classList.add('fbr-plugin-base');
  fbrContainer.innerHTML = `<div class="fbr-plugin-layout">
		<div class="fbr-plugin-balls">
		</div>

		<div class="fbr-bug-report">
			<form class="fbr-bug-report__form">
				<!-- loader -->
				<div class="fbr-loader" style="display: none;"></div>
				<!-- Close button -->
				<button class="fbr-bug-report__cancel-button" type="button">×</button>

				<!-- Navigation tabs -->
				<div class="fbr-bug-report__tabs">
					<button class="fbr-bug-report__tab" data-step="1" disabled="">Этап 1</button>
					<button class="fbr-bug-report__tab " data-step="2" disabled="">Этап 2</button>
					<button class="fbr-bug-report__tab" data-step="3" disabled="">Этап 3</button>
					<button class="fbr-bug-report__tab" data-step="4" disabled="">Этап 4</button>
				</div>
				<!-- Step 1 -->
				<div class="fbr-bug-report__step" id="step-1">
					<label class="fbr-bug-report__input-label" for="bug-title">Название бага:</label>
					<input class="fbr-bug-report__input-field" type="text" id="bug-title" placeholder="Введите название бага">

					<label class="fbr-bug-report__input-label" for="bug-priority">Приоритет:</label>
					<select class="fbr-bug-report__select-field" id="bug-priority" name="bug-priority">
						<option value="critical">Критичный</option>
						<option value="normal" selected="">Средний</option>
						<option value="minor">Низкий</option>
					</select>

					<label class="fbr-bug-report__input-label" for="bug-executor">Исполнитель:</label>
					<select class="fbr-bug-report__select-field" id="bug-executor" name="bug-executor">
						<option value="frontend">Frontend</option>
						<option value="backend">Backend</option>
						<option value="both">Frontend и Backend</option>
					</select>

					<button class="fbr-bug-report__next-button" type="button" disabled="">Далее</button>
				</div>
				<!-- Step 2 -->
				<div class="fbr-bug-report__step" id="step-2" style="display:none;">
					<label class="fbr-bug-report__input-label" for="bug-description">Описание бага:</label>
					<textarea class="fbr-bug-report__textarea-field" id="bug-description" placeholder="Введите описание бага"></textarea>

					<button class="fbr-bug-report__next-button" type="button">Далее</button>
				</div>

				<!-- Step 3 -->
				<div class="fbr-bug-report__step" id="step-3" style="display:none;">
					<label class="fbr-bug-report__input-label" for="bug-actual">Фактический результат:</label>
					<textarea class="fbr-bug-report__textarea-field" id="bug-actual" placeholder="Введите описание фактического результата"></textarea>

					<button class="fbr-bug-report__next-button" type="button">Далее</button>
				</div>

				<!-- Step 4 -->
				<div class="fbr-bug-report__step" id="step-4" style="display:none;">
					<label class="fbr-bug-report__input-label" for="bug-expected">Ожидаемый результат:</label>
					<textarea class="fbr-bug-report__textarea-field" id="bug-expected" placeholder="Введите описание ожидаемого результата"></textarea>

					<label class="fbr-bug-report__input-label" for="bug-file">Выберите файл для ожидаемого результата:</label>
					<input class="fbr-bug-report__input-field" type="file" id="bug-file" name="bug-file">

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
						off
					</div>
					<div class="fbr-comment__switch-icon-act">
						on
					</div>
				</div>
			</div>
		</div>
		<!-- кнопка открытия закрытия сайдбара -->
		<div class="fbr-sidebar__toggle">
			<button class="fbr-sidebar__toggle-btn" id="sidebarToggleBtn">
				<img src="img/icons/sidebar-toggle.png" alt="">
			</button>
		</div>

		<div class="fbr-sidebar" id="sidebar">
			<div class="fbr-sidebar__header">

			</div>
			<div class="fbr-sidebar__tabs">
				<button class="fbr-sidebar__tab sidebar__tab--active" data-tab="sidebar-tab1">Активные (0)</button>
				<button class="fbr-sidebar__tab" data-tab="sidebar-tab2">Решеные (0)</button>
			</div>
			<div class="fbr-sidebar__tab-content fbr-sidebar__tab-content--active" id="sidebar-tab1">
				<div class="fbr-bug-container">
				</div>
			</div>
			<div class="fbr-sidebar__tab-content" id="sidebar-tab2">
				<div class="fbr-bug-container">
					<span>Контент для Таба 2</span>
				</div>
			</div>
		</div>

		<div class="fbr-sidebar" id="bug-sidebar">
			<!-- HTML-код для сайдбара бага -->
			<div class="fbr-bug-sidebar-content">
				<!-- Здесь будет отображаться содержимое окна сайдбара для карточки бага -->
			</div>
		</div>

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

.fbr-highlight {
  box-shadow: 0 0 0 2px blue !important; /* Синяя обводка с важностью */
}

.fbr-bug-card {
  padding: 10px !important;
  color: #4c617f !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid #d4dae3 !important;
  cursor: pointer !important;
  z-index: 2147483600 !important;
}
.fbr-bug-card__header {
  display: flex !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  margin-bottom: 5px !important;
  z-index: 2147483600 !important;
}
.fbr-bug-card__number {
  width: 26px !important;
  height: 26px !important;
  line-height: 20px !important;
  font-size: 10px !important;
  border: 2px solid #fff !important;
  background: #2ea2f6 !important;
  margin-right: 5px !important;
  font-family: Gordita-Medium !important;
  font-weight: 500 !important;
  border-radius: 100% !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  color: white !important;
  z-index: 2147483600 !important;
}
.fbr-bug-card__author {
  flex-grow: 1 !important; /* Занимает оставшееся место в строке */
  margin-right: 10px !important;
  font-family: Gordita-Medium !important;
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 20px !important;
  color: #1c232d !important;
  z-index: 2147483600 !important;
}
.fbr-bug-card__date {
  font-size: 10px !important;
  line-height: 20px !important;
  color: #778aa7 !important;
  font-family: Gordita-Medium !important;
  font-weight: 500 !important;
  z-index: 2147483600 !important;
}
.fbr-bug-card__title {
  font-size: 12px !important;
  line-height: 18px !important;
  font-family: Manrope-SemiBold !important;
  font-weight: 600 !important;
  color: #303d4e !important;
  z-index: 2147483600 !important;
}

.bug-sidebar-open {
  left: 0 !important;
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
}
.fbr-bug-report__form {
  width: 350px !important;
  margin: 0 auto !important;
  padding: 0px 15px 15px 15px !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
  background-color: white !important;
  font-size: 14px !important;
  line-height: 20px !important;
  color: #778aa7 !important;
  font-family: Gordita-Medium !important;
  font-weight: 500 !important;
  z-index: 2147483600 !important;
  position: relative !important;
}
.fbr-bug-report__cancel-button {
  position: relative;
  left: 95%;
  background: none !important;
  border: none !important;
  font-size: 30px !important;
  cursor: pointer !important;
  z-index: 2147483602 !important;
  line-height: 1 !important;
  color: #2ea2f6 !important;
}
.fbr-bug-report__tabs {
  display: flex !important;
  justify-content: space-between !important;
  margin-bottom: 10px !important;
}
.fbr-bug-report__tab {
  background: #ccc !important;
  border: none !important;
  padding: 5px 10px !important;
  cursor: pointer !important;
  z-index: 2147483600 !important;
  border-radius: 4px !important;
  font-size: 14px !important;
}
.fbr-bug-report__tab.active {
  background-color: #2ea2f6 !important;
  color: white !important;
}
.fbr-bug-report__input-label, .fbr-bug-report__input-field, .fbr-bug-report__textarea-field, .fbr-bug-report__select-field, .fbr-bug-report__next-button, .fbr-bug-report__submit-button {
  width: 100% !important;
  margin-bottom: 10px !important;
  z-index: 2147483600 !important;
  font-size: 14px !important;
}
.fbr-bug-report__input-field, .fbr-bug-report__textarea-field, .fbr-bug-report__select-field {
  padding: 10px !important;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
}
.fbr-bug-report__next-button {
  padding: 10px !important;
  background-color: #909497 !important;
  border: none !important;
  border-radius: 4px !important;
  color: white !important;
  cursor: pointer !important;
}
.fbr-bug-report__next-button.active {
  background-color: #2ea2f6 !important;
  border: none !important;
  border-radius: 4px !important;
  color: white !important;
  cursor: pointer !important;
}
.fbr-bug-report__submit-button {
  padding: 10px !important;
  background-color: #2ea2f6 !important;
  border: none !important;
  border-radius: 4px !important;
  color: white !important;
  cursor: pointer !important;
}

@media only screen and (max-width: 768px) {
  .fbr-bug-report__form {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
    padding: 15px !important;
    border: none !important;
    border-radius: 0 !important;
    background-color: white !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    z-index: 2147483600 !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
  }
  .fbr-bug-report__cancel-button {
    position: relative;
    left: 47%;
    background: none !important;
    border: none !important;
    font-size: 30px !important;
    cursor: pointer !important;
    z-index: 2147483602 !important;
    line-height: 1 !important;
    color: #2ea2f6 !important;
  }
}
.fbr-bug-sidebar__close-icon {
  pointer-events: none !important;
  width: 40px !important;
  height: 40px !important;
  object-fit: cover !important;
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

/* Стили для лоадера */
.fbr-loader {
  border: 4px solid #f3f3f3;
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 30px;
  height: 30px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
  position: absolute;
  top: 85%;
  left: 45%;
  transform: translate(-50%, -50%);
  z-index: 2147483601; /* Выше z-index модального окна, чтобы лоадер был видимым */
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
}

.fbr-sidebar {
  pointer-events: all !important;
  position: fixed !important;
  top: 0 !important;
  left: -282px !important; /* Скрываем сайдбар за пределами экрана */
  width: 282px !important;
  height: 100% !important;
  background-color: white !important;
  color: #4c617f !important;
  transition: left 0.3s ease !important;
  max-height: 100% !important; /* 20px - отступ от верхней и нижней границы */
  overflow-y: scroll !important;
  display: block !important;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2) !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar--active {
  left: 0 !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__toggle {
  pointer-events: all !important;
  position: fixed !important;
  bottom: 15px !important;
  left: 15px !important;
  z-index: 2147483601 !important;
}
.fbr-sidebar__toggle-btn {
  width: 60px !important;
  height: 60px !important;
  background-color: white !important;
  border-radius: 100% !important;
  box-shadow: 0 10px 35px 0 rgba(0, 0, 0, 0.15) !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__toggle-btn img {
  width: 30px !important;
  height: 30px !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__header {
  position: sticky !important;
  top: 0 !important;
  background-color: white !important;
  display: block !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__tabs {
  position: sticky !important;
  background-color: white !important;
  border-bottom: 1px solid #d4dae3 !important;
  padding-bottom: 10px !important;
  display: flex !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__tab {
  width: 50% !important;
  color: gray !important;
  position: relative !important;
  padding: 6px 14px !important;
  font-size: 12px !important;
  line-height: 26px !important;
  color: #4c617f !important;
  text-align: center !important;
  transition: all 0.15s ease !important;
  position: relative !important;
  font-family: Gordita-Medium !important;
  font-weight: 500 !important;
  cursor: pointer !important;
  background: transparent !important;
  text-decoration: none !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__tab::after {
  position: absolute !important;
  content: "";
  height: 2px !important;
  width: 0% !important;
  background-color: #2ea2f6 !important;
  bottom: -5px !important;
  left: 50% !important;
  transition: all 0.2s ease-in !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__tab--active {
  color: #2ea2f6 !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__tab--active::after {
  width: 100% !important;
  left: 0 !important;
  border-radius: 4px !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__tab-content {
  background-color: white !important;
  color: white !important;
  display: none !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar__tab-content--active {
  display: block !important;
  z-index: 2147483600 !important;
}

.fbr-sidebar {
  /* Кастомный скроллбар */
  /* Фон скроллбара */
  /* Стили для полосы скроллбара */
  /* Стили для полосы скроллбара при наведении на неё */
}
.fbr-sidebar::-webkit-scrollbar {
  width: 5px !important; /* Ширина скроллбара */
  z-index: 2147483600 !important;
}
.fbr-sidebar::-webkit-scrollbar-track {
  background-color: #f1f1f1 !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar::-webkit-scrollbar-thumb {
  background-color: #888 !important;
  border-radius: 6px !important;
  z-index: 2147483600 !important;
}
.fbr-sidebar::-webkit-scrollbar-thumb:hover {
  background-color: #555 !important;
  z-index: 2147483600 !important;
}`;
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
}
