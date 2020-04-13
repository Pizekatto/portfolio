import View from './view'

export class Modal {
  constructor() {
    this.modal = this.create()
  }

  animation_speed = 350
  scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

  handleClose = e => {
    if (e.target.dataset.close) {
      e.preventDefault()
      this.close()
    }
  }

  handleKeyDown = e => {
    if (event.key === 'Escape') {
      e.preventDefault()
      this.close()
    }
  }

  create() {
    const modal = View.createElement('div', 'modal', 'overlay')
    const modalContent = View.createElement('div', 'modal__content')
    this.content = modalContent
    const closeBtn = View.createElement('button', 'btn-close')

    modal.setAttribute('tabIndex', -1)
    modal.setAttribute('data-close', true)
    closeBtn.setAttribute('data-close', true)
    modalContent.setAttribute('data-content', true)
    modalContent.append(closeBtn)
    modal.append(modalContent)
    document.body.append(modal)

    modal.addEventListener('click', this.handleClose)
    document.addEventListener('keydown', this.handleKeyDown)
    setTimeout(() => this.open(), 0)
    return modal
  }

  setContent(content) {
    this.content = content
  }

  open() {
    this.modal.classList.add('open')
    this.modal.focus()
    document.body.style.overflow = 'hidden'
    document.body.style.paddingRight = `${this.scrollBarWidth}px`
  }

  close() {
    this.modal.classList.remove('open')
    setTimeout(() => this.destroy(), this.animation_speed)
  }

  destroy() {
    this.modal.remove()
    this.modal.removeEventListener('click', this.handleClose)
    document.removeEventListener('keydown', this.handleKeyDown)
    document.body.style.paddingRight = ''
    document.body.style.overflow = ''
  }

}

export class ModalImage extends Modal {
  constructor(options) {
    super()
    this.setStartCoordinates(options.coordinates)
  }


  setStartCoordinates(coordinates) {
      const {left, top, width, height} = coordinates
      const startCoordinates = {left, top, width, height}

      for (const key in startCoordinates) {
        this.content.style[key] = `${coordinates[key]}px`
      }
  }

  setContent(content) {
    const image = View.createElement('img', 'modal__image')
    image.src = content
    this.content.append(image)
  }
}