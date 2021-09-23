import app from './app'

const PORT = 4000
const serverListening = () => {
  console.log(`server Running on Port : ${PORT}`)
}

app.listen(PORT, serverListening)
