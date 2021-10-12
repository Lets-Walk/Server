import App from './app'
import dotenv from 'dotenv'
import socketListening from './socket'

dotenv.config()
const PORT = process.env.PORT || 3000
const server = App.server
const io = App.io

socketListening(io)
server.listen(PORT, () => {
  console.log(`Server Running at Port : ${PORT}`)
})
