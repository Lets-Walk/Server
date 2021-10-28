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
