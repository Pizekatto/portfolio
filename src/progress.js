import View from './view'

export default class Progress {
  constructor(options) {
    const {
      title, level,	color, isAnimated
    } = options
    this.title = title
    this.level = level
    this.color = this.#colors[color]
    this.isAnimated = isAnimated
    this.node = this.#createProgress()
  }

  #createProgress = () => {
    const progress = View.createElement('div', 'progress', 'progress_stage')
    const progressBar = View.createElement('div', 'progress-bar')
    if (!this.isAnimated) {
      progressBar.style.width = `${this.level}%`
    }
    progressBar.style.background = this.color
    this.progressNode = progressBar
    progressBar.setAttribute('data-level', this.level)
    progressBar.setAttribute('data-title', this.title)
    progress.append(progressBar)
    return progress
  }

  #colors = {
    blue:   'linear-gradient(90deg, rgba(11, 108, 255, 0.77), rgba(7, 244, 255, 0.81))',
    indigo: 'linear-gradient(90deg, rgba(83, 11, 255, 0.89), rgba(255, 7, 247, 0.91))',
    purple: '#6f42c1',
    pink:   '#e83e8c',
    red:    '#dc3545',
    orange: '#fd7e14',
    yellow: 'linear-gradient(90deg, rgba(255, 192, 11, 0.89), rgba(251, 255, 7, 0.91))',
    green:  '#28a745',
    teal:   '#20c997',
    cyan:   'linear-gradient(90deg, rgba(11, 198, 255, 0.87), rgba(7, 255, 175, 0.84))',
  }

  animate = () => {
    this.progressNode.style.width = `${this.level}%`
  }

}