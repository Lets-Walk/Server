import express from 'express'
import router from './routes'

class App {
  public app: express.Application

  constructor() {
    this.app = express()
    this.getRouting()
  }

  setMiddleWare() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: false }))
  }

  getRouting() {
    this.app.use('/', router)
  }
}

export default new App().app
