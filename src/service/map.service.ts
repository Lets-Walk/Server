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
    const km = 2
    const itemCount = 70 //아이템 개수
    const jokerCount = Math.floor(Math.random() * 2) + 1 // 1 ~ 2 사이의 값
    const totalCount = itemCount + jokerCount
    const minX = lat - 0.00953 * km
    const minY = lng - 0.01384 * km
    const maxX = lat + 0.00789 * km
    const maxY = lng + 0.00959 * km

    const markerList = this.createMarkerList(minX, maxX, minY, maxY, totalCount)

    markerList.forEach((marker, index) => {
      if (index < jokerCount) {
        //조커 처리
        marker.type = 'Joker'
        return
      }
      const pattern = this.getPattern()
      marker.type = this.getItemType(pattern)
    })

    return {
      status: 200,
      success: true,
      message: 'create marker success',
      count: markerList.length,
      data: markerList,
    }
  }

  getPattern(): string {
    const num = Math.random()
    let pattern

    if (num < 0.25) {
      pattern = 'Heart'
    } else if (num < 0.5) {
      pattern = 'Clover'
    } else if (num < 0.75) {
      pattern = 'Spade'
    } else {
      pattern = 'Diamond'
    }

    return pattern
  }

  getItemType(pattern: string): string {
    /*
      A~K 까지 총 12개의 아이템을 각각 8.3333% 확률로 리턴
    */
    const num = Math.random()
    const p = 0.08333333333333333

    let type
    if (num < p) {
      type = pattern + 'A'
    } else if (num < p * 2) {
      type = pattern + '2'
    } else if (num < p * 3) {
      type = pattern + '3'
    } else if (num < p * 4) {
      type = pattern + '4'
    } else if (num < p * 5) {
      type = pattern + '5'
    } else if (num < p * 6) {
      type = pattern + '6'
    } else if (num < p * 7) {
      type = pattern + '7'
    } else if (num < p * 8) {
      type = pattern + '8'
    } else if (num < p * 9) {
      type = pattern + '9'
    } else if (num < p * 10) {
      type = pattern + 'J'
    } else if (num < p * 11) {
      type = pattern + 'Q'
    } else {
      type = pattern + 'K'
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
