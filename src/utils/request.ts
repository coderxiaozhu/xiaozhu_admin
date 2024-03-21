import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig
} from 'axios'
import { ElNotification } from 'element-plus'
import { useUserStore } from '@/store/modules/userInfo.ts'
import { refreshTokenAPI } from '@/api/login/login.ts'

const refreshTokenUrl = '/api/auth/refresh/token'

export type Response<T> = Promise<[boolean, T, AxiosResponse<T>]>

class Request {
  constructor(config?: CreateAxiosDefaults) {
    this.axiosInstance = axios.create(config)
    this.axiosInstance.interceptors.request.use((axiosConfig: InternalAxiosRequestConfig) =>
      this.requestInterceptor(axiosConfig)
    )
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<unknown, unknown>) => this.responseSuccessInterceptor(response),
      (error: any) => this.responseErrorInterceptor(error)
    )
  }
  private axiosInstance: AxiosInstance
  private refreshTokenFlag = false
  private requestQueue: {
    resolve: any
    config: any
    type: 'request' | 'response'
  }[] = []
  private limit = 3
  private requestingCount = 0
  private async requestInterceptor(axiosConfig: InternalAxiosRequestConfig): Promise<any> {
    if ([refreshTokenUrl].includes(axiosConfig.url || '')) {
      return Promise.resolve(axiosConfig)
    }
    if (this.refreshTokenFlag || this.requestingCount >= this.limit) {
      return new Promise((resolve) => {
        this.requestQueue.push({
          resolve,
          config: axiosConfig,
          type: 'request'
        })
      })
    }
    this.requestingCount += 1
    const userStore = useUserStore()
    const token = userStore.userInfo.token
    if (token) {
      axiosConfig.headers.Authorization = `Bearer ${token}`
    }
    return Promise.resolve(axiosConfig)
  }
  private async responseSuccessInterceptor(response: AxiosResponse<any, any>): Promise<any> {
    if (response.config.url !== refreshTokenUrl) {
      this.requestingCount -= 1
      if (this.requestQueue.length) {
        this.requestByQueue()
      }
    }
    return Promise.resolve([false, response.data.data, response])
  }
  private async responseErrorInterceptor(error: any) {
    this.requestingCount -= 1
    const { status, config } = error.response || {}
    if (status === 401) {
      // 如果接口401, 把当前接口插入到队列中, 然后刷新token
      return new Promise((resolve) => {
        this.requestQueue.unshift({ resolve, config, type: 'response' })
        // 有在刷新token直接返回
        if (this.refreshTokenFlag) return
        // 没有刷新token的话则需要刷新
        this.refreshTokenFlag = true
        this.refreshToken()
      })
    } else {
      ElNotification({
        title: '出错了',
        message: error.response.data.message,
        type: 'error'
      })
      return Promise.resolve([true, error.response.data])
    }
  }
  private requestByQueue() {
    if (!this.requestQueue.length) return

    Array.from({ length: this.limit - this.requestingCount }).forEach(async () => {
      const record = this.requestQueue.shift()
      if (!record) return
      const { config, resolve, type } = record
      // 如果响应401, 取到config
      if (type === 'response') {
        resolve(await this.request(config))
      } else if (type === 'request') {
        this.requestingCount += 1
        const userStore = useUserStore()
        const { token } = userStore.userInfo
        config.headers.Authorization = `Bearer ${token}`
        resolve(config)
      }
    })
  }
  private async refreshToken() {
    const userStore = useUserStore()
    // 准备刷新token, 需要把标记改为true
    this.refreshTokenFlag = true
    const { userInfo } = userStore
    // 如果刷新token不存在,就跳到登录页
    if (!userInfo.refreshToken) {
      this.reset()
    }
    // 调刷新接口
    const [error, data] = await refreshTokenAPI(refreshTokenUrl)
    // 如果刷新token接口报错跳到登录页
    if (error) {
      this.reset()
    }
    // 把新的token设置到全局变量中
    userStore.changeUserInfo({ refreshToken: data.refreshToken, token: data.token })
    // 把标记设置为false
    this.refreshTokenFlag = false
    this.requestByQueue()
  }
  private reset() {
    this.requestQueue = []
    this.refreshTokenFlag = false
    this.requestingCount = 0
  }
  request<T, D = any>(config: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance(config)
  }
  get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.get(url, config)
  }
  post<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.post(url, data, config)
  }
  put<T, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.put(url, data, config)
  }
  delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.delete(url, config)
  }
}

const request = new Request({ timeout: 30000 })

export default request
