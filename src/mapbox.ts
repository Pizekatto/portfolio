import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import settings from './settings.json'
import { Coordinates } from './interfaces'
import { LngLat } from '@yandex/ymaps3-types'

export class MapBox {
  startingСenter = settings.mapboxgl.center as Coordinates
  map: any
  mapLoaded: boolean = false
  secondsPerRevolution = 120 // оборот раз в 2мин
  maxSpinZoom = 5 // больше 5го зума - не поворачивать
  slowSpinZoom = 3 // среднее вращение на зуме 3-5
  userInteracting = false
  spinEnabled = true
  geolocation!: LngLat

  private constructor() {
    this.create()
  }

  async create() {
    mapboxgl.accessToken = settings.mapboxgl.accessToken
    this.map = await this.createMap()
    this.mapLoaded = true
    this.configureMap()
    this.spinGlobe()
    await ymaps3.ready
    const geolocation = await ymaps3.geolocation.getPosition()
    this.geolocation = geolocation.coords
    console.log('Geolocation', this.geolocation)
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
      console.log(this.geolocation)
      this.map.flyTo({
        center: this.geolocation,
        zoom: 13,
        speed: 1.8
      })
    })
    this.map.on('mouseout', () => {
      this.userInteracting = false
      this.spinGlobe()
      // this.map.setCenter(this.startingСenter)
      // this.map.zoomTo(0.4)
      this.map.flyTo({
        center: this.startingСenter,
        zoom: 0.4,
        speed: 1.8
      })
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
