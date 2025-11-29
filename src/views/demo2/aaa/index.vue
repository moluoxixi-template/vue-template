<template>
  <div class="box-shadow">
    q23131
  </div>
  <div class="h-[300px]!">
    <el-table stripe height="100%" border :data="tableData">
      <el-table-column fixed="right" label="姓名" prop="name" />
      <el-table-column label="姓名" prop="name" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
const tableData = ref([
  { name: '123' },
  { name: '123' },
])
</script>

<style scoped lang="scss"></style>
