import express from 'express'
import router from './routes'
import db from '../models'

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.getRouting()
    this.setMiddleWare()
    this.dbConnection()
  }

  setMiddleWare() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
  }

  getRouting() {
    this.app.use('/', router)
  }

  dbConnection() {
    db.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.')
        return db.sequelize.sync({ force: true })
      })
      .then(() => {
        console.log('DB Sync complete.')
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err)
      })
  }
}

export default new App().app
