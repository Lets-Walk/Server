import express from 'express'

import db from '../../models'

class CampusService {
  constructor() {}

  async getAllCampus() {
    let AllCampus = null
    try {
      AllCampus = await db.Campus.findAll()
    } catch (err) {
      console.error(err)
      throw 'db connection error'
    }

    if (!AllCampus) {
      throw 'campus does not exist'
    }

    return AllCampus
  }

  async getOneCampus(name) {
    let Campus = null
    try {
      Campus = await db.Campus.findOne({
        where: { name: name },
      })
    } catch (err) {
      console.error(err)
      throw 'db connection error'
    }
    if (!Campus) {
      throw 'campus does not exist'
    }

    return Campus
  }
}

export default new CampusService()
