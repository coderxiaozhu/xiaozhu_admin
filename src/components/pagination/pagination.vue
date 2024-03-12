<template>
  <div class="pagination-container" :class="{ hidden: hidden }">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface propsType {
  total: number
  page?: number
  limit?: number
  pageSizes?: number[]
  layout?: string
  background?: boolean
  hidden?: boolean
}
const props = withDefaults(defineProps<propsType>(), {
  total: 10,
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 30, 50],
  layout: 'total, sizes, prev, pager, next, jumper',
  background: true,
  hidden: false
})
// 发射父组件事件
const emit = defineEmits(['update:limit', 'update:page', 'pagination'])
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})
// 处理分页事件
const handleSizeChange = (val: number) => {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('update:limit', val)
  emit('pagination', { page: currentPage.value, limit: val })
}
const handleCurrentChange = (val: number) => {
  emit('update:page', val)
  emit('pagination', { page: val, limit: pageSize.value })
}
</script>

<style scoped lang="scss">
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
