<template>
  <div class="h-full">
    <el-menu default-active="1" class="el-menu-vertical-demo h-full" :collapse="props.isFold">
      <el-menu-item index="1">
        <el-icon><DataAnalysis /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
interface PropsType {
  isFold: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  isFold: false
})
</script>

<style lang="scss" scoped></style>
