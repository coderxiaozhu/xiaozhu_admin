import request from '@/utils/request.ts'
import { TokenDto, captchaTypes } from './types.ts'
import { loginFormType } from '@/views/login/types.ts'

export const getPublicKeyAPI = () => {
  return request.get('/api/auth/publicKey')
}

export const getCaptchaAPI = () => {
  return request.get<captchaTypes>('/api/auth/captcha')
}

export const refreshTokenAPI = (refreshToken: string) => {
  return request.post<TokenDto>('/api/auth/refresh/token', { refreshToken })
}

export const loginAPI = (data: loginFormType) => {
  return request.post<TokenDto>('/api/auth/login', data)
}
