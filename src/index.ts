import app from './app'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000
const serverListening = () => {
  console.log(`server Running on Port : ${PORT}`)
}

app.listen(PORT, serverListening)
