import express from 'express'
import morgan from 'morgan'

import router from './routes'
import db from '../models'
import campus_list from '../constants/campus_list'

class App {
  public app
  public server
  public io

  constructor() {
    this.app = express()
    this.server = require('http').createServer(this.app)
    this.io = require('socket.io')(this.server)
    this.setMiddleWare()
    this.getRouting()
    this.dbConnection()
  }

  setMiddleWare() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
    this.app.use(morgan('tiny'))
  }

  getRouting() {
    this.app.use('/api', router)
  }

  dbConnection() {
    db.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.')
        return db.sequelize.sync({ force: false })
      })
      .then(async () => {
        console.log('DB Sync complete.')
        const campus = await db.Campus.findAll()
        if (campus.length === 0) {
          db.Campus.bulkCreate(campus_list).then(() => {
            console.log('campus_list bulk create')
          })
        }
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err)
      })
  }
}

export default new App()
