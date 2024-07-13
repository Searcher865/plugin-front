export class FBRPluginManager {
  constructor() {}

  // Установка значения pluginFBRactive в localStorage
  setPluginFBRActive(value) {
    localStorage.setItem('pluginFBRactive', value.toString());
  }

  // Получение значения pluginFBRactive из localStorage
  getPluginFBRActive() {
    return localStorage.getItem('pluginFBRactive') === 'true';
  }

  // Проверка наличия fbron или fbroff в URL и установка соответствующего значения в localStorage
  checkAndSetFBRActive() {
    const urlParams = new URLSearchParams(window.location.search);
    const fbrOn = urlParams.has('fbron');
    const fbrOff = urlParams.has('fbroff');
    const localStorageActive = localStorage.getItem('pluginFBRactive');

    if (fbrOn) {
      this.setPluginFBRActive(true);
    } else if (fbrOff) {
      this.setPluginFBRActive(false);
    } else if (localStorageActive === null) {
      this.setPluginFBRActive(false);
    }
  }
}
