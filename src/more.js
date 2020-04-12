export default class MoreMenu {
  constructor(element) {
    this.more = element
    this.btn = element.querySelector('.more-btn')
    this.visible = false
    this.btn.addEventListener('click', this.showMenu)
  }

  showMenu = (e) => {
    e.preventDefault()
    if (!this.visible) {
      this.visible = true
      this.more.classList.add('show')
      document.addEventListener('click', this.hideMenu)
      e.stopPropagation()
    }
  }

  hideMenu = () => {
    if (this.visible) {
      this.visible = false
      this.more.classList.remove('show')
      document.removeEventListener('click', this.hideMenu)
      this.btn.blur()
    }
  }
}