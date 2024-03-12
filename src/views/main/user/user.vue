<template>
  <div>
    <el-card shadow="never">
      <div class="queryFormBox">
        <el-form :inline="true" :model="queryParams">
          <el-form-item label="用户名" class="noMarginBottom">
            <el-input type="text" v-model="queryParams.userName" />
          </el-form-item>
          <el-form-item label="手机号码" class="noMarginBottom">
            <el-input type="text" v-model="queryParams.phoneNumber" />
          </el-form-item>
          <el-form-item class="noMarginBottom">
            <el-button type="primary" @click="submitQueryForm">查询</el-button>
            <el-button @click="resetQueryForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card shadow="never" class="mt-3">
      <div class="btn-list">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="userList">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :label="item.label"
          :prop="item.prop"
          :formatter="item.formatter"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button type="primary" :icon="Edit" link @click="handleEdit(scope.row)"
              >修改</el-button
            >
            <el-button type="primary" :icon="Delete" link @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationBox">
        <pagination
          v-show="total > 0"
          v-model:page="queryParams.pageIndex"
          v-model:limit="queryParams.pageSize"
          :total="total"
          @pagination="getList"
        />
      </div>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
      <el-form ref="formValueRef" :model="form" label-width="auto" :rules="formValueRule">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" />
        </el-form-item>
        <el-form-item label="邮箱号码" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio :value="0">男</el-radio>
            <el-radio :value="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleOnSubmit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { queryParamsType, userDataType } from './types.ts'
import { validateMobile, validateEmail } from '@/utils/validFun.ts'
import pagination from '@/components/pagination/pagination.vue'

const queryParams = ref<Partial<queryParamsType>>({
  userName: undefined,
  phoneNumber: undefined,
  pageSize: 10,
  pageIndex: 1
})
const userList = ref<userDataType[]>([])
const columns = ref([
  {
    label: '用户名',
    prop: 'userName'
  },
  {
    label: '昵称',
    prop: 'nickName'
  },
  {
    label: '手机号码',
    prop: 'phoneNumber'
  },
  {
    label: '邮箱号码',
    prop: 'email'
  },
  {
    label: '性别',
    prop: 'sex',
    formatter: (row: userDataType) => {
      switch (row.sex) {
        case 0:
          return '女'
        case 1:
          return '男'
      }
    }
  }
])
const total = ref(10)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const form = ref<Partial<userDataType>>({
  userName: '',
  nickName: '',
  phoneNumber: '',
  email: '',
  sex: 0
})
const formValueRule = ref<FormRules<userDataType>>({
  userName: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  nickName: [
    {
      required: true,
      message: '请输入昵称',
      trigger: 'blur'
    }
  ],
  phoneNumber: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      validator: validateMobile,
      trigger: 'blur'
    }
  ],
  email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    },
    {
      validator: validateEmail,
      trigger: 'blur'
    }
  ],
  sex: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'change'
    }
  ]
})
const formValueRef = ref<FormInstance>()

const getList = () => {
  axios({
    url: 'http://localhost:3000/user',
    method: 'GET',
    params: queryParams.value
  }).then((res) => {
    const { data } = res
    userList.value = data.data.list
    total.value = data.data.count
  })
}

const submitQueryForm = () => {
  queryParams.value.pageIndex = 1
  getList()
}
const resetQueryForm = () => {
  queryParams.value = {}
  getList()
}
const handleAdd = () => {
  dialogTitle.value = '添加用户'
  formValueRef.value?.resetFields()
  form.value = {}
  dialogVisible.value = true
}
const handleEdit = (row: userDataType) => {
  dialogTitle.value = '修改用户'
  axios({
    url: `http://localhost:3000/user/${row.id}`,
    method: 'GET'
  }).then((res) => {
    const { data } = res
    form.value = data.data
    dialogVisible.value = true
  })
}
const handleDelete = (row: userDataType) => {
  ElMessageBox.confirm(`此操作会删除用户名为${row.userName}的数据, 是否继续?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      axios({
        url: `http://localhost:3000/user/${row.id}`,
        method: 'DELETE'
      }).then((res) => {
        const { data } = res
        ElMessage({
          type: 'success',
          message: `${data.message}`
        })
        getList()
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
const handleOnSubmit = () => {
  if (form.value.id) {
    axios({
      url: `http://localhost:3000/user/${form.value.id}`,
      method: 'PATCH',
      data: form.value
    }).then((res) => {
      const { data } = res
      if (data.code === 200) {
        ElMessage({
          message: `${data.message}`,
          type: 'success'
        })
        getList()
        dialogVisible.value = false
      } else {
        ElMessage({
          message: `${data.message}`,
          type: 'error'
        })
      }
    })
  } else {
    axios({
      url: 'http://localhost:3000/user',
      method: 'POST',
      data: form.value
    }).then((res) => {
      const { data } = res
      if (data.code === 200) {
        ElMessage({
          message: `${data.message}`,
          type: 'success'
        })
        getList()
        dialogVisible.value = false
      } else {
        ElMessage({
          message: `${data.message}`,
          type: 'error'
        })
      }
    })
  }
}
getList()
</script>

<style lang="scss" scoped></style>
