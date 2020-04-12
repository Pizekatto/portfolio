import Model from './model'

export default class Collapse {
  constructor(element, container) {
    this.isTransitioning = false
    this.element = element
    this.triggerArray = this.findTriggers(element)
    this._toggleCollapsedClass(this.element, this.triggerArray)
    this.container = container

    this.triggerArray.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        this.toggle()
        trigger.blur()
      })
    })
  }

  findTriggers(element) {
    return document.querySelectorAll(
      `[data-toggle="collapse"][href="#${element.id}"],` +
      `[data-toggle="collapse"][data-target="#${element.id}"]`
    )
  }

  toggle() {
    if (this.element.classList.contains('show')) {
      this.hide()
    } else {
      this.show()
    }
  }

  show() {
    if (this.isTransitioning ||
        this.element.classList.contains('show')) {
      return
    }

    this.element.classList.remove('collapse')
    this.element.classList.add('collapsing')
    this.element.style.height = 0

    if (this.triggerArray.length) {
      this.triggerArray.forEach(elem => {
        elem.classList.remove('collapsed')
      })
    }

    this.isTransitioning = true
    const transitionDuration =
      this._getTransitionDuration(this.element)
    this.element.style.height = `${this.element.scrollHeight}px`
    this.container.focus()

    const complete = () => {
      this.element.classList.remove('collapsing')
      this.element.classList.add('show', 'collapse')
      this.element.style.height = ''
      this.isTransitioning = false
    }

    Model.sleep(transitionDuration).then(complete)
  }

  hide() {
    if (this.isTransitioning ||
      !this.element.classList.contains('show')) {
      return
    }

    this.element.style.height = `${this.element.offsetHeight}px`
    this.element.classList.add('collapsing')
    this.element.classList.remove('collapse', 'show')
    this._toggleCollapsedClass(this.element, this.triggerArray)

    this.isTransitioning = true
    const transitionDuration =
      this._getTransitionDuration(this.element)
    this.element.style.height = ''
    this.container.blur()

    const complete = () => {
      this.isTransitioning = false
      this.element.classList.remove('collapsing')
      this.element.classList.add('collapse')
    }

    Model.sleep(transitionDuration).then(complete)
  }

  _toggleCollapsedClass(element, triggerArray) {
    const isOpen = element.classList.contains('show')

    if (triggerArray.length) {
      triggerArray.forEach(elem => {
        elem.classList.toggle('collapsed', !isOpen)
      })
    }
  }

  _getTransitionDuration(element) {
    const MILLISECONDS_MULTIPLIER = 1000

    if (!element) {
      return 0
    }

    let transitionDuration =
      getComputedStyle(element)['transition-duration']
    let transitionDelay =
      getComputedStyle(element)['transition-delay']

    const floatTransitionDuration = parseFloat(transitionDuration)
    const floatTransitionDelay = parseFloat(transitionDelay)

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0
    }

    transitionDuration = transitionDuration.split(',')[0]
    transitionDelay = transitionDelay.split(',')[0]

    return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER
  }

}
