<template>
  <div class="loginContainer">
    <!-- <div class="loginWapper">
      <div class="text-lg text-blue-600 font-bold text-center mb-4">Xiaozhu Admin</div>
      <div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule" label-width="90px">
          <el-form-item label="登录账号:" prop="name">
            <el-input v-model="loginForm.name" clearable />
          </el-form-item>
          <el-form-item label="登录密码:" prop="password">
            <el-input v-model="loginForm.password" clearable type="password" show-password />
          </el-form-item>
          <el-form-item label="验证码:" prop="veriCode">
            <el-input v-model="loginForm.veriCode" clearable />
          </el-form-item>
        </el-form>
      </div>
    </div> -->
    <div
      class="w-9/12 h-4/6 absolute left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4 rounded-xl flex loginWapper"
    >
      <div class="flex-1 rounded-tl-xl rounded-bl-xl flex items-center justify-center">
        <img src="../../assets/dizzy-girl-waving-and-sitting-on-the-welcome-sign.png" />
      </div>
      <div
        class="flex-1 glass rounded-tr-xl rounded-br-xl flex items-center justify-center flex-col"
      >
        <div class="text-2xl font-bold mb-4">xiaozhu-admin</div>
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRule" label-width="90px">
          <el-form-item label="登录账号:" prop="name">
            <el-input v-model="loginForm.name" clearable />
          </el-form-item>
          <el-form-item label="登录密码:" prop="password">
            <el-input v-model="loginForm.password" clearable type="password" show-password />
          </el-form-item>
          <el-form-item label="验证码:" prop="veriCode">
            <el-input v-model="loginForm.verifyCode" clearable />
          </el-form-item>
        </el-form>
        <div class="submitBtn w-full text-center mt-3">
          <el-button type="primary" class="w-6/12" size="large">登录</el-button>
        </div>
        <div class="w-full text-center mt-3">
          <el-button class="w-6/12" size="large" @click="resetForm(loginFormRef)">重置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules, FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

interface loginFormType {
  name: string
  password: string
  verifyCode: string
}

const loginForm = ref<loginFormType>({
  name: '',
  password: '',
  verifyCode: ''
})

const loginFormRef = ref<FormInstance>()

const loginFormRule = reactive<FormRules<loginFormType>>({
  name: [
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
  veriCode: [
    {
      required: true,
      message: '验证码不能为空',
      trigger: 'blur'
    }
  ]
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
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
    box-shadow: 1px 1px 10px rgba(255, 255, 255, 0.8);
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
