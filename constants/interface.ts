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

export interface item {
  type: string
  quantity: number
}

export interface userInfo {
  userId: string
  nickname: string
  profileUrl: string
  campus: campusInfo
  socket?: Socket
  items?: marker[]
  location?: marker
}

export interface campusInfo {
  id: number
  name: string
  image: string
  domain: string
}

export interface crewRoomInfo {
  roomId: string
  campus: campusInfo
  life: number
  users: userInfo[]
  inventory?: item[]
}

export interface battleInfo {
  battleRoomId: string
  crewInfo: crewRoomInfo[]
  mission?: string
  startTime?: string
}

export interface inProgressBattle {
  [battleRoomId: string]: battleInfo
}

export interface matchingQueue {
  [domain: string]: userInfo[]
}

export interface readyCount {
  [battleRoomId: string]: number
}
