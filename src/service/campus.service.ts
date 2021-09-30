import express from 'express'

import db from '../../models'

class CampusService {
  constructor() {}

  async getAllCampus() {
    const AllCampus = await db.Campus.findAll()
    return AllCampus
  }

  async getOneCampus(name) {
    const Campus = await db.Campus.findOne({
      where: { name: name },
    })
    return Campus
  }
}

export default new CampusService()
