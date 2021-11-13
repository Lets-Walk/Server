import moment from 'moment'
import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import {
  matchingQueue,
  crewRoomInfo,
  userInfo,
  readyCount,
  campusInfo,
  battleInfo,
  inProgressBattle,
} from '../constants/interface'
import MISSION_LIST from '../constants/battleMissions'

const matchingQueue: matchingQueue = {}
let battleQueue: crewRoomInfo[] = []
const readyCount: readyCount = {}
const inProgressBattle: inProgressBattle = {}
const CREW_SIZE: number = 1
const INIT_LIFE = 3

const socketListening = (io: Socket) => {
  io.on('connection', (socket: Socket) => {
    const date = moment(new Date()).format('HH:mm:ss')
    const socketId = socket.id
    socket.emit('connection')
    console.log(`✨[connect] socket id : ${socketId} | ${date}`)

    socket.on('disconnect', () => {
      console.log(`💥[disconnect] socket id : ${socketId} | ${date}`)
    })

    socket.on('crewJoin', ({ id: userId, nickname, profileUrl, campus }) => {
      const userInfo: userInfo = {
        userId,
        nickname,
        profileUrl,
        campus,
        socket,
      }

      const { domain } = campus //캠퍼스 도메인

      if (!(domain in matchingQueue)) {
        //유저의 학교가 매칭큐에 존재하지 않을 때 매칭큐에 도메인을 추가한다.
        matchingQueue[domain] = []
        console.log(`[${domain}] 매칭 큐 생성`)
      }

      matchingQueue[domain].push(userInfo)
      console.log(`[${socketId}] 를 [${domain}] 매칭 대기열에 추가`)
      printMatchingQueue(domain)

      //여기서 기능분기
      //1. 매칭큐에서 크루원을 빼서 별도의 Room으로 이동시킴.
      //2. 배틀큐를 이용하여 상대가 있는지 확인.
      //3. 상대가 있으면 매칭에 성공

      if (matchingQueue[domain].length >= CREW_SIZE) {
        //큐에서 빼서 하나의 크루 룸으로 만들어야 함.
        const currentRoom: crewRoomInfo = createRoom(campus)

        //매칭이 완료된 client에게 매칭 정보를 알려줄 때, socket정보는 제외하고 보내기 위함.
        const userList = currentRoom.users.map((user) => {
          const { socket, ...newUser } = user
          return newUser
        })

        io.to(currentRoom.roomId).emit('matching', {
          roomId: currentRoom.roomId,
          msg: '크루 매칭이 완료되었습니다.',
          users: userList,
        })

        const anotherRoom: crewRoomInfo | null = findOpponent(currentRoom)
        if (!anotherRoom) return // 상대 크루 없으면 배틀매칭 진행하지 않고 리턴.

        const battleRoomId = createBattleRoom(currentRoom, anotherRoom)

        printBattleQueue()

        //TODO : 배틀 매칭이 완료되었을때, 매칭된 유저들에게 매칭 정보를 알려주어야한다. 학교정보 같은거 ?
        //그리고 매칭시 DB연결을 생각해보아야 한다.
        const anotherUsers = anotherRoom.users.map((user) => {
          const { socket, ...newUser } = user
          return newUser
        })

        readyCount[battleRoomId] = 0

        //서버에서는 현재 진행중인 워킹모드에 대한 데이터가 있어야함.
        const currentBattle: battleInfo = {
          battleRoomId: battleRoomId,
          crewInfo: [currentRoom, anotherRoom],
        }

        inProgressBattle[battleRoomId] = currentBattle

        //매칭완료된 유저들에게 매칭 정보 emit
        io.to(battleRoomId).emit('battleMatching', {
          battleRoomId: battleRoomId,
          crewInfo: [
            {
              campus: currentRoom.campus,
              life: currentRoom.life,
              users: userList,
            },
            {
              campus: anotherRoom.campus,
              life: anotherRoom.life,
              users: anotherUsers,
            },
          ],
          msg: '배틀매칭이 완료되었습니다.',
        })
      }
    })

    //유저들의 WalkingMode 렌더링이 완료되었을 때 이벤트
    socket.on('readyWalkingMode', (data) => {
      const { battleRoomId } = data

      readyCount[battleRoomId] += 1

      console.log(`${socket.id} 워킹모드 준비 완료`)

      //전체 유저가 레디할 때 까지 대기
      if (readyCount[battleRoomId] !== CREW_SIZE * 2) return

      const MAX_COUNT = 10
      const SECOND = 1
      let cnt = 0

      //전체 유저가 레디상태가 되면 미션대기상태 시작
      io.to(battleRoomId).emit('waitingMission', { count: MAX_COUNT })

      const interval = setInterval(() => {
        if (cnt === MAX_COUNT) {
          clearInterval(interval)
          //미션 생성 및 시작
          console.log('워킹모드 시작')

          const mission = createMission()
          //미션 생성
          io.to(battleRoomId).emit('startWalkingMode', { mission })
        }
        io.to(battleRoomId).emit('missionCount', MAX_COUNT - cnt)
        cnt += 1
      }, 1000 * SECOND)
    })

    //클라이언트로 ontainItem 이벤트를 받으면 누군가 아이템을 획득했다는 것임.
    //크루id를 이용해 크루원에게는 가방 동기화 이벤트를 발생시키고
    //배틀룸id를 이용해 워킹모드 유저 전체에게 획득 로그를 출력해야 한다.
    socket.on('obtainItem', ({ crewId, battleRoomId, userInfo, inventory }) => {
      console.log('obtainItem', inventory)

      // socket.broadcast
      //   .to(battleRoomId)
      //   .emit('obtainItem', `[크류메세지]${userInfo.nickname}가 아이템획득`)

      io.to(battleRoomId).emit(
        'obtainItem',
        `[전체메세지]${userInfo.nickname}이 아이템을 획득함`,
      )
    })

    socket.on('crewLeave', ({ domain, socketId: userSocketId }) => {
      //매칭대기열 취소
      matchingQueue[domain] = matchingQueue[domain].filter(
        (user) => user.socket.id !== userSocketId,
      )
      console.log(`[${userSocketId}] 를 [${domain}] 매칭 대기열에서 삭제`)
      printMatchingQueue(domain)
    })

    //TODO : 유저가 배틀매칭에서 나간 후, 다시 크루 매칭을 할 때 나오는 에러 해결
    socket.on('battleLeave', ({ crewId }) => {
      //배틀매칭 중 유저가 나감.
      //같은 크루원들의 매칭이 취소되어아함.
      socket.broadcast.to(crewId).emit('battleLeave')
      const currentCrew = battleQueue.find((crew) => crew.roomId === crewId)
      if (!currentCrew) return
      currentCrew.users.map((user) => {
        console.log(`${user.socket.id} 가 ${crewId}룸에서 나감.`)
        user.socket.leave(crewId)
      })
      //현재 배틀큐에 있는 룸 정보 없애야함
      battleQueue = battleQueue.filter((crew) => crew != currentCrew)
      printBattleQueue()
    })
  })

  console.log('Socket running')
}

const createRoom = (campus: campusInfo): crewRoomInfo => {
  const { domain } = campus

  const users = matchingQueue[domain].slice(0, CREW_SIZE)
  matchingQueue[domain].splice(0, CREW_SIZE) //삭제

  //Room으로 이동
  const roomId = uuidv4()
  users.map((user) => {
    user.socket.join(roomId)
    console.log(`[${user.socket.id}] 를 [${roomId}]로 이동`)
  })
  printMatchingQueue(domain)

  const crewRoom: crewRoomInfo = {
    roomId: roomId,
    campus: campus,
    users: users,
    life: INIT_LIFE,
  }

  return crewRoom
}

const findOpponent = (currentRoom: crewRoomInfo): crewRoomInfo | null => {
  let anotherRoom: crewRoomInfo | null = null
  //배틀매칭 큐 확인
  for (let i = 0; i < battleQueue.length; i++) {
    if (currentRoom.campus.domain !== battleQueue[i].campus.domain) {
      anotherRoom = battleQueue[i]
      break
    }
  }

  if (!anotherRoom) {
    //상대가 없을 시 배틀큐에 푸시
    battleQueue.push(currentRoom)
    console.log(`${currentRoom.roomId} 배틀큐에 푸시`)
    printBattleQueue()
  }

  return anotherRoom
}

const createBattleRoom = (
  currentRoom: crewRoomInfo,
  anotherRoom: crewRoomInfo,
): string => {
  console.log('Battle Matching Success')
  //배틀 매칭 로직
  const allUsers: userInfo[] = [...anotherRoom.users, ...currentRoom.users]
  const battleRoomId = uuidv4()
  allUsers.map((user) => {
    //user들을 새로운 Room으로 이동시키고, User에게 워킹모드 시작 알려야함.
    user.socket.join(battleRoomId)
    console.log(`${user.socket.id} 를 battleRoom : ${battleRoomId}로 이동`)
  })

  //매칭완료된 크루를 배틀큐에서 제거한다.
  battleQueue = battleQueue.filter(
    (room) => room.roomId !== anotherRoom?.roomId,
  )

  return battleRoomId
}

const createMission = () => {
  const idx = Math.floor(Math.random() * MISSION_LIST.length)

  return MISSION_LIST[idx]
}

const printBattleQueue = (): void => {
  const waitingCampus = battleQueue.map((crew) => crew.campus.domain)
  console.log('현재 배틀 큐 목록 : ', waitingCampus)
}

const printMatchingQueue = (domain: string): void => {
  console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)
}

export default socketListening
