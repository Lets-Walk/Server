import express from 'express'

import { User, Campus, Walk } from '../../models'
import { marker, serviceResult } from '../../constants/interface'
import ingredient from '../../constants/ingredient'

class MapService {
  constructor() {}

  getAllIngredient(): serviceResult {
    return {
      status: 200,
      success: true,
      data: ingredient,
      message: 'Get All ingredient success!',
    }
  }

  getIngredientByName(name: string): serviceResult {
    if (name in ingredient) {
      const data = ingredient[name]
      return {
        status: 200,
        success: true,
        data: data,
        message: 'Get ingredient success!',
      }
    }

    return {
      status: 400,
      success: false,
      message: `${name} lab does not exist`,
    }
  }

  getMarkerList(lat: number, lng: number): serviceResult {
    //중심좌표를 기준으로 1.5km 경계값
    const km = 1.5
    const count = 50
    const minX = lat - 0.00953 * km
    const minY = lng - 0.01384 * km
    const maxX = lat + 0.00789 * km
    const maxY = lng + 0.00959 * km

    const markerList = this.createMarkerList(minX, maxX, minY, maxY, count)
    const cnt = {}
    markerList.forEach((marker) => {
      marker.type = this.getItemType()
      if (marker.type in cnt) cnt[marker.type] += 1
      else cnt[marker.type] = 0
    })
    console.log(markerList)
    console.log(cnt)
    return {
      status: 200,
      success: true,
      message: 'create marker success',
      count: markerList.length,
      data: markerList,
    }
  }

  getItemType(): string {
    const num = Math.random()

    /*
    아이템 확률
    연필 : 28%
    컴퓨터 : 12%
    현미경 : 12%
    책 : 12%
    계산기 : 12%
    청진기 : 12%
    약품 : 12%
     */

    let type
    if (num < 0.28) {
      type = 'Pencil'
    } else if (num < 0.4) {
      type = 'Computer'
    } else if (num < 0.52) {
      type = 'Microscope'
    } else if (num < 0.64) {
      type = 'Book'
    } else if (num < 0.76) {
      type = 'Calculator'
    } else if (num < 0.88) {
      type = 'Pill'
    } else if (num < 1) {
      type = 'Stethoscope'
    }

    return type
  }

  getRandomVal(lower: number, upper: number): number {
    let Random = Math.random() * (upper - lower) + lower
    return Random
  }

  createMarkerList(
    xu: number,
    xl: number,
    yu: number,
    yl: number,
    count: number,
  ): marker[] {
    const threshold = 0.2 //마커간의 거리는 200m 이상 이여야함.
    const itemList: marker[] = []
    for (let i = 0; i < count; i++) {
      let lat: number
      let lng: number

      let valid: boolean
      do {
        lat = this.getRandomVal(xu, xl)
        lng = this.getRandomVal(yu, yl)

        valid = true
        for (let j = 0; j < i; j++) {
          const dist = this.getDistance(
            itemList[j].lat,
            itemList[j].lng,
            lat,
            lng,
          )
          if (dist < threshold) {
            valid = false
            break
          }
        }
      } while (!valid)

      itemList.push({ lat: lat, lng: lng })
    }

    return itemList
  }

  getDistance(lat1, lng1, lat2, lng2) {
    let lat1p = parseFloat(lat1)
    let lng1p = parseFloat(lng1)
    let lat2p = parseFloat(lat2)
    let lng2p = parseFloat(lng2)

    let R = 6371 // km (change this constant to get miles)
    let dLat = ((lat2p - lat1p) * Math.PI) / 180
    let dLon = ((lng2p - lng1p) * Math.PI) / 180
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    let dist = R * c

    return dist // 리턴값이 1이면 1km, 0.1이면 100m
  }
}

export default new MapService()
