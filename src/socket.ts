import moment from 'moment'
import { debugPort } from 'process'
import { v4 as uuidv4 } from 'uuid'

const socketListening = (io) => {
  const matchingQueue = {}
  let battleQueue: any = []
  const crewList: any = []
  const CREW_SIZE = 2

  io.on('connection', (socket) => {
    const date = moment(new Date()).format('HH:mm:ss')
    const id = socket.id
    console.log(`[${date}] connection id : ${id}`)

    socket.on('disconnect', () => {
      console.log(`${socket.id} disconnecting`)
    })

    socket.emit('connection')

    socket.on('crewLeave', ({ domain, socketId }) => {
      //매칭대기열 취소
      matchingQueue[domain] = matchingQueue[domain].filter(
        (soc) => soc.id !== socketId,
      )
      console.log(`[${socketId}] 를 [${domain}] 매칭 대기열에서 삭제`)
      console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)
    })

    socket.on('crewJoin', ({ domain }) => {
      //크루 매칭 수행
      if (domain in matchingQueue) {
        //이미 매칭큐가 존재할 때
        matchingQueue[domain].push(socket)
        console.log(`[${socket.id}] 를 [${domain}] 매칭 대기열에 추가`)
        console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)
        //CREW_SIZE를 만족하는지 확인
        if (matchingQueue[domain].length >= CREW_SIZE) {
          //큐에서 빼서 하나의 크루 룸으로 만들어야 함.
          const users = matchingQueue[domain].slice(0, CREW_SIZE)
          matchingQueue[domain].splice(0, CREW_SIZE) //삭제

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
            msg: '매칭이 완료되었습니다.',
            //...크루매칭 관련 정보들
          })
          crewList.push(currentRoom)

          //배틀매칭 큐 확인
          let anotherRoom: any = null
          let del = null
          for (let i = 0; i < battleQueue.length; i++) {
            if (currentRoom.domain !== battleQueue[i].domain) {
              anotherRoom = battleQueue[i]

              break
            }
          }

          if (!anotherRoom) {
            //매칭 가능한 크루가 존재하지 않음
            battleQueue.push(currentRoom)
            console.log(`${currentRoom.roomId} 배틀큐에 푸시`)
            console.log('현재 배틀큐 목록 : ', battleQueue)
            return
          }

          console.log('Battle Matching')
          //배틀 매칭 로직
          const allUsers = [...anotherRoom.users, ...currentRoom.users]
          const walkingRoomId = uuidv4()
          allUsers.map((user) => {
            //user들을 새로운 Room으로 이동시키고, User에게 워킹모드 시작 알려야함.
            user.join(walkingRoomId)
            console.log(`${user.id} 를 ${walkingRoomId}로 이동`)
          })

          battleQueue = battleQueue.filter((room) => room.id !== anotherRoom.id) //매칭된 크루 삭제

          io.to(walkingRoomId).emit('battleMatching', {
            walkingRoomId: walkingRoomId,
            msg: '배틀매칭이 완료되었습니다.',
          })
        }
      } else {
        matchingQueue[domain] = [socket]
        console.log(`[${domain}] 매칭 큐 생성`)
        console.log(`[${socket.id}] 를 [${domain}] 매칭 대기열에 추가`)
        console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)
      }
    })
  })

  console.log('Socket running')
}

export default socketListening
