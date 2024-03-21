export interface TokenDto {
  expire: number
  token: string
  refreshExpire: number
  refreshToken: string
}

export interface captchaTypes {
  data: string
  id: string
  text: string
  time: string
}
