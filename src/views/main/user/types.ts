export type queryParamsType = {
  userName: string
  phoneNumber: string
  pageIndex: number
  pageSize: number
}

export interface userDataType {
  id?: number
  userName: string
  nickName: string
  phoneNumber: string
  email: string
  avatar?: string
  sex: number
}

export interface userListType {
  count: number
  list: userDataType[]
}
