import express from 'express'

import db from '../../models'
import { serviceResult } from '../../constants/interface'

class CampusService {
  constructor() {}

  async getAllCampus(): Promise<serviceResult> {
    let AllCampus = null
    try {
      AllCampus = await db.Campus.findAll()
    } catch (err) {
      console.error(err)
      return { status: 400, success: false, message: 'db connection error' }
    }

    if (!AllCampus) {
      return { status: 404, success: false, message: 'Campus does not exist' }
    }

    return {
      status: 200,
      success: true,
      message: 'All Campus data',
      data: AllCampus,
    }
  }

  async getOneCampus(name: string): Promise<serviceResult> {
    let Campus = null
    try {
      Campus = await db.Campus.findOne({
        where: { name: name },
      })
    } catch (err) {
      console.error(err)
      return { status: 400, success: false, message: 'db connection error' }
    }
    if (!Campus) {
      return { status: 404, success: false, message: 'Campus does not exist' }
    }

    return {
      status: 200,
      success: true,
      message: `${name} Campus data`,
      data: Campus,
    }
  }
}

export default new CampusService()
