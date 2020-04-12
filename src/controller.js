export default class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    this.model.bindSettingsChanged(this.onSettingsChanged)

    this.init()
  }

  init() {
    window.addEventListener('DOMContentLoaded', () => {
      this.model.getSettings()
      .then(this.onSettingsChanged)
      .then(this.handleScrollspy)
    })
  }

  onSettingsChanged = settings => {
    return this.view.display(settings)
  }

  handleScrollspy = (elements) => {
    this.view.bindScrollSpy(elements)
  }
}