import Progress from './progress'
import svgImages from './svg'
import { ModalImage } from './modal'
import Collapse from './collapse'
import MoreMenu from './more'
import Rellax from 'rellax'


export default class View {
  constructor() {
    this.timeline = document.querySelector('.timeline')
    this.exWork = document.getElementById('ex-work')
    this.workGallery = document.getElementById('work-gallery')
    new Collapse(this.exWork.querySelector('#more-info'),
      this.exWork)
    new MoreMenu(document.querySelector('.more'))
    this.XLResolution = 1200
    this.createParallax('.rellax')

    this._initLocalListeners()
  }


  _initLocalListeners() {
    this.exWork.addEventListener('click', (event) => {
      if (event.target.tagName === 'IMG') {
        event.preventDefault()
        const coordinates = event.target.getBoundingClientRect()
        const imgSrc = event.target.dataset.src
        this.openModal(imgSrc, coordinates)
      }
    })

    const copyButton = document.getElementById('copy')
    copyButton.addEventListener('click', e => {
      const emailNode = e.target.previousElementSibling
      this.copyToClipboard(emailNode)
      e.target.blur()
    })

    this.workGallery.addEventListener('click', e => {
      const link = e.target.closest('a')
      if (link && link.id === 'blank') {
        e.preventDefault()
      }
    })

    this.workGallery.addEventListener('keydown', e => {
      if (e.key === "Enter") {
        e.target.childNodes.forEach(elem => {
          if (elem.tagName === 'A') {
            window.open(elem.href, '_blank')
          }
        })
      }
    })

    const mediaUpXL = "(min-width: 1200px)"
    const mediaQueryListSM = window.matchMedia(mediaUpXL)
    mediaQueryListSM.addEventListener("change", () => {
      this.switchParallax()
    })

    // window.addEventListener('load', () => {
    //   this.preCacheImages(this.exWork)
    // })

    // window.addEventListener('focusin', event => {
    //   console.log(event.target);
    // })
  }

  static createElement(tag, ...classNames) {
    const element = document.createElement(tag)
    if (classNames.length) {
      classNames.forEach(item => {
        element.classList.add(item)
      })
    }
    return element
  }

  static debounce(f, ms) {
    let isCooldown = false

    return function () {
      if (isCooldown) return
      f.apply(this, arguments)
      isCooldown = true
      setTimeout(() => isCooldown = false, ms)
    }

  }

  static throttle(f, ms) {
    let isThrottled = false, savedArgs, savedThis

    function wrapper() {
      if (isThrottled) {
        savedArgs = arguments
        savedThis = this
        return
      }

      f.apply(this, arguments)
      isThrottled = true
      setTimeout(function () {
        isThrottled = false
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs)
          savedArgs = savedThis = null
        }
      }, ms)
    }

    return wrapper
  }

  copyToClipboard = node => {
    const range = new Range()
    const selection = window.getSelection()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
    try {
      document.execCommand('copy')
      selection.removeAllRanges()
      return true
    } catch (error) {
      return false
    }
  }

  bindScrollSpy(elements) {
    this.addObserver(elements)
  }

  display(settings) {
    const progressList = this.createProgressList(settings)
    this.addProgressList(progressList.listNode)

    return {
      progressList
    }
  }

  createProgressList({ timeline }) {
    const listData = timeline['stage-2020']['stage-content']['skills']

    const progressList = View.createElement('ul', 'progress-list')

    const progressListItems = listData.map((item) => {
      const { title, level, color, isAnimated } = item
      const progressListItem = View.createElement('li', 'progress-list__item')
      progressListItem.insertAdjacentHTML('afterbegin', svgImages[title])
      const progressBar = new Progress({
        title, level, color, isAnimated,
      })
      progressListItem.append(progressBar.node)
      return [progressListItem, progressBar]
    })

    const progressBars = progressListItems.map((listItem) => {
      progressList.append(listItem[0])
      return listItem[1]
    })

    return {
      listData,
      listNode: progressList,
      animate() {
        progressBars.forEach(item => item.animate());
      }
    }

  }

  addProgressList(listElement) {
    const stageNode = document.getElementById('stage-2020')
    const target = stageNode.querySelector('#skills')
    target.append(listElement)
  }

  addObserver(elements) {
    const options = {
      threshold: 0.8
    }
    const callback = (entries, observer) => {

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          elements.progressList.animate()
          observer.unobserve(entry.target)
        }
      })
    }
    const observer = new IntersectionObserver(callback, options)
    observer.observe(document.getElementById('skills'))
  }

  openModal(content, coordinates) {
    const modal = new ModalImage({
      coordinates
    })
    modal.setContent(content)
  }

  createParallax(targetSelector) {
    if (window.innerWidth >= this.XLResolution) {
      this.relaxx = new Rellax(targetSelector, {
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
      })
      this.isParallaxed = true
    }
  }

  switchParallax = () => {
    if (window.innerWidth >= this.XLResolution) {
      if (this.isParallaxed) return
      this.createParallax('.rellax')
      this.isParallaxed = true
    } else if (this.isParallaxed) {
      this.relaxx.destroy()
      this.isParallaxed = false
    }
  }

  preCacheImages(container) {
    const images = Array.from(container.querySelectorAll('img'))
    return images.map(img => {
      const image = document.createElement('img')
      image.src = img.dataset.src
      return image
    })
  }

}