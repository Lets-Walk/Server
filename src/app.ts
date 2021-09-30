import express from 'express'
import router from './routes'
import db from '../models'
import campus_list from '../constants/campus_list'

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.setMiddleWare()
    this.getRouting()
    this.dbConnection()
  }

  setMiddleWare() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
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
      .then(() => {
        console.log('DB Sync complete.')
        db.Campus.bulkCreate(campus_list).then(() => {
          console.log('campus_list bulk create')
        })
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err)
      })
  }
}

export default new App().app
