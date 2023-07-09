import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import settings from './settings.json'
import { Coordinates } from './interfaces'

export class MapBox {
  startingСenter: [number, number] = settings.mapboxgl.center as Coordinates
  map: any
  mapLoaded: boolean = false
  secondsPerRevolution = 120 // оборот раз в 2мин
  maxSpinZoom = 5 // больше 5го зума - не поворачивать
  slowSpinZoom = 3 // среднее вращение на зуме 3-5
  userInteracting = false
  spinEnabled = true

  private constructor() {
    this.create()
  }

  async create() {
    mapboxgl.accessToken = settings.mapboxgl.accessToken
    this.map = await this.createMap()
    this.mapLoaded = true
    this.configureMap()
    this.spinGlobe()
  }

  async createMap() {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.startingСenter,
      zoom: 0.4
    })
    await new Promise(resolve => {
      map.on('load', () => resolve('Карта загружена'))
    })
    return map
  }

  configureMap = async () => {
    this.map.on('mouseenter', 'circle', () => {
      this.map.getCanvas().style.cursor = 'pointer'
    })
    this.map.on('mouseleave', 'circle', () => {
      this.map.getCanvas().style.cursor = ''
    })
    this.map.on('moveend', () => {
      this.spinGlobe()
    })
    this.map.on('mouseover', () => {
      this.userInteracting = true
      this.map.stop()
    })
    this.map.on('mouseout', () => {
      this.userInteracting = false
      this.spinGlobe()
    })
  }

  spinGlobe() {
    const zoom = this.map.getZoom()
    if (this.spinEnabled && !this.userInteracting && zoom < this.maxSpinZoom) {
      let distancePerSecond = 360 / this.secondsPerRevolution
      if (zoom > this.slowSpinZoom) {
        const zoomDif = (this.maxSpinZoom - zoom) / (this.maxSpinZoom - this.slowSpinZoom)
        distancePerSecond *= zoomDif
      }
      const center = this.map.getCenter()
      center.lng -= distancePerSecond
      this.map.easeTo({ center, duration: 1000, easing: (n: any) => n }) // анимация длится 1сек и в конце вызывает событие moveend
    }
  }
}
