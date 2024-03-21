<template>
  <div class="loginContainer">
    <div
      class="w-9/12 h-4/6 absolute left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rounded-xl flex loginWapper"
    >
      <div class="flex-1 rounded-tl-xl rounded-bl-xl flex items-center justify-center loginLeft">
        <img src="../../assets/dizzy-girl-waving-and-sitting-on-the-welcome-sign.png" />
      </div>
      <div
        class="flex-1 glass rounded-tr-xl rounded-br-xl flex items-center justify-center flex-col"
      >
        <div class="text-2xl font-bold mb-4">xiaozhu-admin</div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule" label-width="90px">
          <el-form-item label="登录账号:" prop="accountName">
            <el-input v-model="loginForm.accountName" clearable />
          </el-form-item>
          <el-form-item label="登录密码:" prop="password">
            <el-input v-model="loginForm.password" clearable type="password" show-password />
          </el-form-item>
          <el-form-item label="验证码:" prop="captcha">
            <div class="flex items-center">
              <el-input v-model="loginForm.captcha" clearable />
              <div class="cursor-pointer ml-2" v-html="captchaObj?.data" @click="getCaptcha"></div>
            </div>
          </el-form-item>
        </el-form>
        <div class="submitBtn w-full text-center mt-3">
          <el-button type="primary" class="w-6/12" size="large" @click="loginEvent">登录</el-button>
        </div>
        <div class="w-full text-center mt-3">
          <el-button class="w-6/12" size="large" @click="resetForm(loginFormRef)">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { JSEncrypt } from 'jsencrypt'
import { ElMessage } from 'element-plus'
import type { FormRules, FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { loginFormType } from './types.ts'
import router from '@/router'
import { useUserStore } from '@/store/modules/userInfo.ts'
import { getPublicKeyAPI, getCaptchaAPI, loginAPI } from '@/api/login/login.ts'
import { captchaTypes } from '@/api/login/types.ts'

const loginForm = ref<loginFormType>({
  accountName: '',
  password: '',
  captcha: '',
  publicKey: ''
})
const userStore = useUserStore()

const loginFormRef = ref<FormInstance>()

const loginFormRule = reactive<FormRules<loginFormType>>({
  accountName: [
    {
      required: true,
      message: '登录账号不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '登录密码不能为空',
      trigger: 'blur'
    }
  ],
  captcha: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
})

const captchaObj = ref<captchaTypes>()

const getCaptcha = async () => {
  const [_, res] = await getCaptchaAPI()
  captchaObj.value = res
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const getPublicKey = async () => {
  const [_, data] = await getPublicKeyAPI()
  return data
}

const loginEvent = async () => {
  const data = await getPublicKey()
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(typeof data === 'string' ? data : '')
  const password = encrypt.encrypt(loginForm.value.password)
  typeof password === 'string' ? (loginForm.value.password = password) : loginForm.value.password
  typeof data === 'string' ? (loginForm.value.publicKey = data) : ''
  const [err, res] = await loginAPI(loginForm.value)
  const { token, refreshToken } = res
  userStore.changeUserInfo({ token, refreshToken })
  if (err) {
    ElMessage({
      message: '登录失败',
      type: 'error'
    })
  } else {
    ElMessage({
      message: '登录成功',
      type: 'success'
    })
    router.push('/')
  }
}

getCaptcha()
getPublicKey()
</script>

<style lang="scss" scoped>
.loginContainer {
  width: 100%;
  height: 100%;
  // background-image: -moz-linear-gradient(
  //   90deg,
  //   rgba(184, 216, 250, 0.2),
  //   rgba(184, 236, 250, 0.97)
  // );

  // background-image: -webkit-linear-gradient(
  //   90deg,
  //   rgba(184, 216, 250, 0.2),
  //   rgba(184, 236, 250, 0.97)
  // );

  // background-image: linear-gradient(90deg, rgba(184, 216, 250, 0.2), rgba(184, 236, 250, 0.97));
  // background-color: #f5f5f5a4;
  background-color: #fff;
  backdrop-filter: blur(40px);
  opacity: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  .loginWapper {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
    .loginLeft {
      border-right: 1px solid #eee;
    }
  }
  // .loginWapper {
  //   width: 30%;
  //   padding: 20px;
  //   box-sizing: border-box;
  //   background-color: rgba(255, 255, 255, 0.5);
  //   border-radius: 10px;
  //   box-shadow: 1px 1px 10px rgba(255, 255, 255, 0.8);
  //   display: flex;
  //   flex-direction: column;
  // }
}
</style>
