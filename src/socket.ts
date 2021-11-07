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
    // console.log(`[${date}] connection id : ${id}`)
    console.log(`✨[connect] socket id : ${id} | ${date}`)

    socket.on('disconnect', () => {
      console.log(`💥[disconnect] socket id : ${id} | ${date}`)
    })

    socket.emit('connection')

    socket.on('crewLeave', ({ domain, socketId }) => {
      //매칭대기열 취소
      matchingQueue[domain] = matchingQueue[domain].filter(
        (user) => user.socket.id !== socketId,
      )
      console.log(`[${socketId}] 를 [${domain}] 매칭 대기열에서 삭제`)
      console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)
    })

    //TODO : 유저가 배틀매칭에서 나간 후, 다시 크루 매칭을 할 때 나오는 에러 해결
    socket.on('battleLeave', ({ crewId }) => {
      //배틀매칭 중 유저가 나감.
      //같은 크루원들의 매칭이 취소되어아함.
      socket.broadcast.emit('battleLeave')
      const currentCrew = battleQueue.find((crew) => crew.roomId === crewId)
      if (!currentCrew) return
      console.log(currentCrew)
      currentCrew.users.map((user) => {
        console.log(`${user.socket.id} 가 ${crewId}룸에서 나감.`)
        user.socket.leave(crewId)
      })
      //현재 배틀큐에 있는 룸 정보 없애야함
      battleQueue = battleQueue.filter((crew) => crew !== currentCrew)
      const waitingCampus = battleQueue.map((campus) => campus.domain)
      console.log('현재 배틀큐 목록 : ', waitingCampus)
    })

    socket.on('crewJoin', ({ domain, id: userId, nickname, profileUrl }) => {
      //크루 매칭 수행
      const userInfo = {
        userId,
        nickname,
        profileUrl,
        socket,
      }
      if (domain in matchingQueue) {
        //이미 매칭큐가 존재할 때
        matchingQueue[domain].push(userInfo)
        console.log(`[${id}] 를 [${domain}] 매칭 대기열에 추가`)
        console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)
        //CREW_SIZE를 만족하는지 확인
        if (matchingQueue[domain].length >= CREW_SIZE) {
          //큐에서 빼서 하나의 크루 룸으로 만들어야 함.
          const users = matchingQueue[domain].slice(0, CREW_SIZE)
          matchingQueue[domain].splice(0, CREW_SIZE) //삭제

          //Room으로 이동
          const roomId = uuidv4()
          users.map((user) => {
            user.socket.join(roomId)
            console.log(`[${user.socket.id}] 를 [${roomId}]로 이동`)
          })
          console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)

          const currentRoom = {
            roomId: roomId,
            domain: domain,
            users: users,
          }

          const userList = users.map((user) => {
            const { socket, ...newUser } = user
            return newUser
          })

          io.to(roomId).emit('matching', {
            roomId: roomId,
            msg: '크루 매칭이 완료되었습니다.',
            users: userList,
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
            const waitingCampus = battleQueue.map((campus) => campus.domain)
            console.log('현재 배틀큐 목록 : ', waitingCampus)
            return
          }

          console.log('Battle Matching')
          //배틀 매칭 로직
          const allUsers = [...anotherRoom.users, ...currentRoom.users]
          const walkingRoomId = uuidv4()
          allUsers.map((user) => {
            //user들을 새로운 Room으로 이동시키고, User에게 워킹모드 시작 알려야함.
            user.socket.oin(walkingRoomId)
            console.log(`${user.socket.id} 를 ${walkingRoomId}로 이동`)
          })

          battleQueue = battleQueue.filter((room) => room.id !== anotherRoom.id) //매칭된 크루 삭제

          io.to(walkingRoomId).emit('battleMatching', {
            walkingRoomId: walkingRoomId,
            msg: '배틀매칭이 완료되었습니다.',
          })
        }
      } else {
        matchingQueue[domain] = [userInfo]
        console.log(`[${domain}] 매칭 큐 생성`)
        console.log(`[${id}] 를 [${domain}] 매칭 대기열에 추가`)
        console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)
      }
    })
  })

  console.log('Socket running')
}

export default socketListening
