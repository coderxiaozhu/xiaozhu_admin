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
            <el-radio :value="1">男</el-radio>
            <el-radio :value="0">女</el-radio>
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
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { queryParamsType, userDataType } from './types.ts'
import { validateMobile, validateEmail } from '@/utils/validFun.ts'
import pagination from '@/components/pagination/pagination.vue'
import { listByUser, editUser, getUserById, addUser, deleteUser } from '@/api/user/user.ts'

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
const form = ref<userDataType>({
  userName: '',
  nickName: '',
  phoneNumber: '',
  email: '',
  sex: 1
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

const getList = async () => {
  const [_, data] = await listByUser(queryParams.value)
  const { list, count } = data
  userList.value = list
  total.value = count
}

const submitQueryForm = () => {
  queryParams.value.pageIndex = 1
  getList()
}
const resetQueryForm = () => {
  queryParams.value = {}
  getList()
}
const resetForm = () => {
  formValueRef.value?.resetFields()
  form.value = { email: '', nickName: '', phoneNumber: '', sex: 1, userName: '' }
}
const handleAdd = () => {
  dialogTitle.value = '添加用户'
  resetForm()
  dialogVisible.value = true
}
const handleEdit = async (row: userDataType) => {
  dialogTitle.value = '修改用户'
  if (row.id != null) {
    const [_, res] = await getUserById(row.id)
    form.value = res
    dialogVisible.value = true
  }
}
const submitRefreshData = async (err: boolean, res: string) => {
  ElMessage({
    message: `${res}`,
    type: err ? 'error' : 'success'
  })
  await getList()
  dialogVisible.value = false
}
const handleDelete = (row: userDataType) => {
  ElMessageBox.confirm(`此操作会删除用户名为${row.userName}的数据, 是否继续?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      if (row.id != null) {
        const [err, res] = await deleteUser(row.id)
        await submitRefreshData(err, typeof res === 'string' ? res : '')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
const handleOnSubmit = async () => {
  if (form.value.id) {
    const [err, res] = await editUser(form.value, form.value.id)
    await submitRefreshData(err, typeof res === 'string' ? res : '')
  } else {
    const [err, res] = await addUser(form.value)
    await submitRefreshData(err, typeof res === 'string' ? res : '')
  }
}
getList()
</script>

<style lang="scss" scoped></style>
