import express from 'express'

import { Campus, User, Walk } from '../../models'
import { serviceResult } from '../../constants/interface'
import { Op } from 'sequelize'

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

  async getCampusRank() {
    let allCampus = null
    try {
      allCampus = await Campus.findAll({
        where: { score: { [Op.gt]: 0 } },
        order: [['score', 'DESC']],
      })
    } catch (err) {
      console.log(err)
      return { status: 400, success: false, message: 'db connection error' }
    }

    if (!allCampus) {
      return { status: 404, success: false, message: 'Campus does not exist' }
    }

    return {
      status: 200,
      success: true,
      message: 'All Campus ranking data',
      data: allCampus,
    }
  }

  async getCampusUsers(campusId) {
    let allUsers: any = null
    try {
      allUsers = await User.findAll({
        where: {
          campusId: campusId,
        },
        attributes: ['id', 'name', 'nickname'],
        include: [
          {
            model: Walk,
            where: {
              contribution: { [Op.gt]: 0 },
            },
            order: [['contribution', 'DESC']],
          },
        ],
      })
    } catch (err) {
      console.log(err)
      return { status: 400, success: false, message: 'db connection error' }
    }

    if (!allUsers || allUsers.length === 0) {
      return { status: 404, success: false, message: 'User does not exist' }
    }

    return {
      status: 200,
      success: true,
      message: 'All Campus User data',
      data: allUsers,
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

  async getMembersById(id: number): Promise<serviceResult> {
    try {
      const campusMembers = await Campus.findAll({
        where: id,
        attributes: [['id', 'campusId'], 'name'],
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'nickname'],
            include: [{ model: Walk, attributes: ['stepcount', 'wmcount'] }],
          },
        ],
      })
      console.log(campusMembers)
      if (campusMembers.length === 0)
        return {
          status: 400,
          success: false,
          message: 'this campus does not exist',
        }
      return {
        status: 200,
        success: true,
        message: 'inquiry members by campus id success',
        data: campusMembers,
      }
    } catch (e) {
      return { status: 400, success: false, message: 'db connection error' }
    }
  }
}

export default new CampusService()
