import moment from 'moment'
import { Socket } from 'socket.io'
import { v4 as uuidv4 } from 'uuid'
import {
  matchingQueue,
  crewRoomInfo,
  userInfo,
  campusInfo,
  battleInfo,
  inProgressBattle,
} from '../constants/interface'
import MISSION_LIST from '../constants/battleMissions'
import JOKER_MISSION_LIST from '../constants/jokerMissions'
import isMissionSuccess from './utils/missionValidation'

const matchingQueue: matchingQueue = {} //캠퍼스별 매칭 대기열
let battleQueue: crewRoomInfo[] = [] //크루 배틀매칭 대기열
const inProgressBattle: inProgressBattle = {} //현재 진행중인 워킹모드에 대한 정보
const waitingBattle = {} //readyWalkingMode에서 이벤트를 한번만 발생시키기 위해 사용
const currentInterval = {} //조커미션 카운트 interval

const CREW_SIZE: number = 1 //크루 사이즈
const INIT_LIFE = 3 //시작 LIFE
const MAX_COUNT = 5 //미션 시작 전 카운트
const SECOND = 1 // 1초

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
          const { socket, items, ...newUser } = user
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
          const { socket, items, ...newUser } = user
          return newUser
        })

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
              roomId: currentRoom.roomId,
              campus: currentRoom.campus,
              life: currentRoom.life,
              users: userList,
            },
            {
              roomId: anotherRoom.roomId,
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
    socket.on('readyWalkingMode', ({ battleRoomId }) => {
      if (waitingBattle[battleRoomId]) return
      waitingBattle[battleRoomId] = true
      io.to(battleRoomId).emit('waitingMission', { count: MAX_COUNT })
      let cnt = 0
      const interval = setInterval(() => {
        if (cnt === MAX_COUNT) {
          clearInterval(interval)
          //미션 생성 및 시작
          console.log('미션 시작')

          const mission = createMission()
          //미션 생성
          inProgressBattle[battleRoomId].mission = mission
          io.to(battleRoomId).emit('startWalkingMode', { mission })
          waitingBattle[battleRoomId] = false
        }
        io.to(battleRoomId).emit('missionCount', MAX_COUNT - cnt)
        cnt += 1
      }, 1000 * SECOND)
    })

    //아이템 획득 메세지
    socket.on('obtainItem', ({ battleRoomId, userInfo, item }) => {
      io.to(battleRoomId).emit('obtainItem', {
        userInfo,
        item,
      })
    })

    //조커아이템 획득
    socket.on('jokerGain', ({ crewId, battleRoomId, crewInfo, campusName }) => {
      //5초간 대기 후 조커 미션 전달
      setTimeout(() => {
        const jokerMission = createJokerMission()
        const obtainCampus = campusName

        //미션 종류에 따라 달라질 수 있음.
        let effectedCrew
        let effectedCrewId
        crewInfo.map((crew) => {
          if (crew.campus.name !== campusName) {
            effectedCrew = crew
            effectedCrewId = crew.roomId
          }
        })

        const { type } = jokerMission
        let { seconds } = jokerMission

        //조커 미션 전달
        io.to(battleRoomId).emit('jokerMission', {
          type: type,
          seconds: seconds,
          obtainCampus: obtainCampus,
          effectedCampus: effectedCrew.campus.name,
        })

        //조커 타이머 시작
        const interval = setInterval(() => {
          if (seconds <= 0) {
            //타이머 끝
            clearInterval(interval)
            io.to(battleRoomId).emit('jokerMissionEnd', {
              type,
              effectedCampus: effectedCrew.campus.name,
            })
            return
          }
          io.to(effectedCrew.roomId).emit('jokerMissionCount', {
            count: seconds,
          })
          seconds -= 1
        }, 1000)

        currentInterval[effectedCrewId] = interval
      }, 5000)
    })

    //크루원간 인벤토리 동기화
    socket.on('inventorySync', ({ crewId, newInventory }) => {
      console.log('inventorySync')
      // socket.broadcast.to(crewId).emit('inventorySync', { inventory })
      io.to(crewId).emit('inventorySync', { newInventory })
    })

    //미션 성공 검증
    socket.on(
      'missionValidation',
      ({
        mission,
        newInventory,
        battleRoomId,
        crewInfo,
        campusName,
        crewId,
      }) => {
        //미션타입과 인벤토리값을 이용하여 미션 성공여부를 검증.
        const isSuccess: boolean = isMissionSuccess(mission, newInventory)
        // const isSuccess = true //for test

        //미션에 성공하지 못했음
        if (!isSuccess) return

        //미션에 성공했으면 전체에게 미션성공을 알리는 이벤트를 발생시킴
        //ex. 중앙대학교 크루가 '원페어' 미션을 완료했슴니다. 그리고 crewInfo의 값을 갱신함.
        const currentBattle: battleInfo = inProgressBattle[battleRoomId]
        const currentCrewInfo = currentBattle.crewInfo
        let isEnd = false

        currentCrewInfo.map((crew) => {
          const interval = currentInterval[crew.roomId]
          if (interval) {
            clearInterval(interval)
            currentInterval[crew.roomId] = null
          }
          if (crew.campus.name !== campusName) {
            //라이프 차감
            crew.life -= 1
            if (crew.life === 0) isEnd = true
          }
        })

        //socket을 안빼면 앱에서 crewInfo를 받을 때 에러가 떠서 Socket을 빼야함.
        currentCrewInfo.map((crew) => {
          const filteredUser = crew.users.map((user) => {
            const { socket, items, ...newUser } = user
            return newUser
          })

          crew.users = filteredUser
        })

        io.to(battleRoomId).emit('missionSuccess', {
          crewInfo: currentCrewInfo,
          mission,
          campusName,
          isEnd,
        })
      },
    )

    socket.on('crewLeave', ({ campus, socketId: userSocketId }) => {
      const { domain } = campus
      //매칭대기열 취소
      matchingQueue[domain] = matchingQueue[domain].filter(
        (user) => user.socket?.id !== userSocketId,
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
        console.log(`${user.socket?.id} 가 ${crewId}룸에서 나감.`)
        user.socket?.leave(crewId)
      })
      //현재 배틀큐에 있는 룸 정보 없애야함
      battleQueue = battleQueue.filter((crew) => crew != currentCrew)
      printBattleQueue()
    })

    socket.on('sendChat', ({ messages, crewId, battleRoomId }) => {
      // console.log(messages)
      io.to(crewId).emit('receiveChat', { messages })
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
    user.socket?.join(roomId)
    console.log(`[${user.socket?.id}] 를 [${roomId}]로 이동`)
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
    user.socket?.join(battleRoomId)
    console.log(`${user.socket?.id} 를 battleRoom : ${battleRoomId}로 이동`)
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

const createJokerMission = () => {
  const idx = Math.floor(Math.random() * JOKER_MISSION_LIST.length)

  return JOKER_MISSION_LIST[idx]
}

const printBattleQueue = (): void => {
  const waitingCampus = battleQueue.map((crew) => crew.campus.domain)
  console.log('현재 배틀 큐 목록 : ', waitingCampus)
}

const printMatchingQueue = (domain: string): void => {
  console.log(`[${domain}] Room Size : ${matchingQueue[domain].length}`)
}

export default socketListening
