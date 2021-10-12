import moment from 'moment'

const socketListening = (io) => {
  const matchingQueue = {}
  io.on('connection', (socket) => {
    const date = moment(new Date()).format('HH:mm:ss')
    console.log(`[${date}] connection id : ${socket.id}`)

    socket.on('cau@ac.kr', (user) => {
      if ('cau@ac.kr' in matchingQueue) {
        matchingQueue['cau@ac.kr'].push(user)
      } else {
        matchingQueue['cau@ac.kr'] = []
        matchingQueue['cau@ac.kr'].push(user)
      }
      console.log(matchingQueue)
      if (
        matchingQueue['cau@ac.kr'] &&
        matchingQueue['cau@ac.kr'].length == 2
      ) {
        socket.broadcast.emit('cau@ac.kr', '2명 모음')
      }
    })
  })

  console.log('Socket running')
}

export default socketListening
