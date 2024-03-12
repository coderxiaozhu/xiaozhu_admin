<template>
  <div class="common-layout h-full">
    <el-container class="main-content">
      <el-aside :width="isFold ? '60px' : '200px'">
        <navMenu :isFold="isFold" />
      </el-aside>
      <el-container>
        <el-header>
          <navHeader @fold-Change="handleFoldChange" />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import navHeader from '@/components/nav-header/index.vue'
import navMenu from '@/components/nav-menu/index.vue'

const isFold = ref(false)
const handleFoldChange = (isFoldValue: boolean) => {
  isFold.value = isFoldValue
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}
.el-main {
  background-color: #f5f5f5;
}
.el-aside {
  // border-right: 1px solid #eee;
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 200px;
  text-align: left;
  cursor: pointer;
  transition: width 0.3s linear;
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none;
  }
}
.el-header {
  border-bottom: 1px solid #eee;
}
</style>
