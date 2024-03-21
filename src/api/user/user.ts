import request from '@/utils/request.ts'
import { queryParamsType, userListType, userDataType } from '@/views/main/user/types.ts'

export const listByUser = (params: Partial<queryParamsType>) => {
  return request.get<userListType>('/api/user', { params })
}

export const editUser = (data: userDataType, id: number) => {
  return request.put(`/api/user/${id}`, data)
}

export const getUserById = (id: number) => {
  return request.get<userDataType>(`/api/user/${id}`)
}

export const addUser = (data: userDataType) => {
  return request.post('/api/user', data)
}

export const deleteUser = (id: number) => {
  return request.delete(`/api/user/${id}`)
}
