import express from 'express'
import router from './routes'
import db from '../models'

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

db.sequelize.sync()
    .then(() => {
        console.log('데이터베이스 연결됨.');
    }).catch((err) => {
        console.error(err);
    });
export default new App().app
