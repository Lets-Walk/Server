import express from 'express'

import { Campus } from '../../models'
import { serviceResult } from '../../constants/interface'

class CampusService {
  constructor() {}

  async getAllCampus(): Promise<serviceResult> {
    let allCampus = null
    try {
      allCampus = await Campus.findAll()
    } catch (err) {
      console.error(err)
      return { status: 400, success: false, message: 'db connection error' }
    }

    if (!allCampus) {
      return { status: 404, success: false, message: 'Campus does not exist' }
    }

    return {
      status: 200,
      success: true,
      message: 'All Campus data',
      data: allCampus,
    }
  }

  async getOneCampus(name: string): Promise<serviceResult> {
    let campus = null
    try {
      campus = await Campus.findOne({
        where: { name: name },
      })
    } catch (err) {
      console.error(err)
      return { status: 400, success: false, message: 'db connection error' }
    }
    if (!campus) {
      return { status: 404, success: false, message: 'campus does not exist' }
    }

    return {
      status: 200,
      success: true,
      message: `${name} campus data`,
      data: campus,
    }
  }
}

export default new CampusService()
