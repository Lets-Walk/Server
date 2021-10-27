import express from 'express'

import { User, Campus, Walk } from '../../models'
import { serviceResult } from '../../constants/interface'
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
    const minX = lat - 0.00953 * km
    const minY = lng - 0.01384 * km
    const maxX = lat + 0.00789 * km
    const maxY = lng + 0.00959 * km

    const markerList = this.createMarkerList(minX, maxX, minY, maxY, 50)

    return {
      status: 200,
      success: true,
      message: 'create marker success',
      data: markerList,
    }
  }

  getRandomVal(lower, upper) {
    let Random = Math.random() * (upper - lower) + lower
    return Random
  }

  createMarkerList(xu, xl, yu, yl, count) {
    let xy = new Array(2)
    for (let i = 0; i < 2; i++) {
      xy[i] = new Array(count)
    }
    for (let j = 0; j < count; j++) {
      xy[0][j] = this.getRandomVal(xu, xl)
      xy[1][j] = this.getRandomVal(yu, yl)
      if (j > 0) {
        let far
        do {
          xy[0][j] = this.getRandomVal(xu, xl)
          xy[1][j] = this.getRandomVal(yu, yl)
          far = new Array(j)
          for (let k = 0; k < j; k++) {
            far[k] = this.getDistance(xy[0][j], xy[1][j], xy[0][k], xy[1][k])
          }
          for (let l = 0; l < j; l++) {
            for (let m = 0; m < j - 1; m++) {
              if (far[l] < far[m]) {
                let temp = far[l]
                far[l] = far[m]
                far[m] = temp
              }
            }
          }
        } while (far[0] < 0.2) // 200m 이내면 다시 Marker 생성함
      }
    }

    return {
      lat: xy[0],
      lng: xy[1],
    }
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
