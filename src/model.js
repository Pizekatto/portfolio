export default class Model {
  constructor() {
    this.url = './settings.json'
  }

  async getSettings() {
    const response = await fetch(this.url)
    return await response.json()
  }

  bindSettingsChanged(callback) {
    this.onSettingsChanged = callback
  }

  static sleep(ms) {
    return new Promise(r => setTimeout(r, ms))
  }

}
