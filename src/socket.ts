import moment from 'moment'
import { debugPort } from 'process'
import { v4 as uuidv4 } from 'uuid'

const socketListening = (io) => {
  const matchingQueue = {}
  const battleQueue: any = []

  io.on('connection', (socket) => {
    const date = moment(new Date()).format('HH:mm:ss')
    const id = socket.id
    // console.log(`[${date}] connection id : ${id}`)

    socket.emit('connection', id)

    socket.on('crewJoin', ({ domain }) => {
      //크루 매칭 수행
      if (domain in matchingQueue) {
        //이미 매칭큐가 존재할 때
        matchingQueue[domain].push(socket)
        console.log(domain + 'roomSize:' + matchingQueue[domain].length)
        //4명인지 확인 후 크루로 묶음
        if (matchingQueue[domain].length >= 2) {
          //큐에서 빼서 하나의 크루 룸으로 만들어야 함.
          const users = matchingQueue[domain].slice(0, 4)
          matchingQueue[domain].splice(0, 4) //삭제

          //Room으로 이동
          const roomId = uuidv4()
          users.map((user) => {
            user.join(roomId)
            console.log(`${user.id} 를 ${roomId}로 이동`)
          })

          const currentRoom = {
            roomId: roomId,
            domain: domain,
            users: users,
          }

          io.to(roomId).emit('matching', {
            roomId: roomId,
            domain: domain,
            msg: '매칭이 완료되었습니다.',
            //...크루매칭 관련 정보들
          })

          //배틀 매칭 큐 확인
          if (battleQueue.length != 0) {
            console.log(battleQueue)
            for (let i = 0; i < battleQueue.length; i++) {
              const anotherRoom = battleQueue[i]
              if (anotherRoom.domain !== currentRoom.domain) {
                console.log('배틀 매칭')
                //배틀 매칭 로직
                console.log('All User List')
                const allUsers = [...anotherRoom.users, ...currentRoom.users]
                allUsers.map((user) => {
                  //user들을 새로운 Room으로 이동시키고, User에게 워킹모드 시작 알려야함.
                })
              }
            }
          } else {
            battleQueue.push(currentRoom)
            console.log(`${currentRoom.roomId} 배틀큐에 푸시`)
            console.log(battleQueue)
          }
          //매칭 큐 확인 후 상대크루가 있으면, 상대크루와 매칭
        }
      } else {
        matchingQueue[domain] = [socket]
        console.log(domain + '매칭큐 생성')
        console.log('roomSize:' + matchingQueue[domain].length)
      }
    })
  })

  console.log('Socket running')
}

export default socketListening
