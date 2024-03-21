import { ref } from 'vue'
import { defineStore } from 'pinia'

interface userInfoType {
  token: string
  refreshToken: string
}

export const useUserStore = defineStore(
  'userInfo',
  () => {
    const userInfo = ref<userInfoType>({
      token: '',
      refreshToken: ''
    })
    function changeUserInfo(newUserInfo: userInfoType) {
      userInfo.value = newUserInfo
    }
    function clearToken() {
      userInfo.value.token = ''
    }
    function clearRefreshToken() {
      userInfo.value.refreshToken = ''
    }
    return {
      changeUserInfo,
      userInfo,
      clearToken,
      clearRefreshToken
    }
  },
  {
    persist: {
      enabled: true
    }
  }
)
