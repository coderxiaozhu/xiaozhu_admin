<template>
  <div class="nav-header">
    <div class="menu-icon" @click="handleFoldClick">
      <el-icon size="28px">
        <component :is="isFold ? 'Expand' : 'Fold'" />
      </el-icon>
    </div>
    <div class="content">
      <breadCrumb />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import breadCrumb from '@/components/nav-header/components/bread-crumb.vue'

const emit = defineEmits(['foldChange'])

const isFold = ref(false)
const handleFoldClick = () => {
  isFold.value = !isFold.value
  emit('foldChange', isFold.value)
}
</script>

<style lang="scss" scoped>
.nav-header {
  display: flex;
  align-items: center;
  height: 100%;
  .menu-icon {
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .content {
    margin-left: 20px;
  }
}
</style>
