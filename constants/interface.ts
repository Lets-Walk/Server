import { Socket } from 'socket.io'

export interface serviceResult {
  status?: number
  success?: boolean
  message?: string
  data?: any
  token?: string
  count?: number
}

export interface marker {
  type?: string
  lat: number
  lng: number
}

export interface userInfo {
  userId: string
  nickname: string
  profileUrl: string
  socket: Socket
}

export interface crewRoomInfo {
  roomId: string
  domain: string
  users: userInfo[]
}

export interface matchingQueue {
  [domain: string]: userInfo[]
}

export interface readyCount {
  [battleRoomId: string]: number
}
