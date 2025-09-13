<template>
  <template v-for="(route, index) in routes" :key="index">
    <el-menu-item v-if="!route.children?.length" :index="route.path">
      <a v-if="route.href" target="_blank" :href="route.href">
        {{ route.meta?.title || route.name }}
      </a>
      <template v-else>
        {{ route.meta?.title || route.name }}
      </template>
    </el-menu-item>
    <template v-else>
      <el-sub-menu :index="route.path">
        <template #title>
          <a v-if="route.href" target="_blank" :href="route.href">
            {{ route.meta?.title || route.name }}
          </a>
          <template v-else>
            {{ route.meta?.title || route.name }}
          </template>
        </template>
        <sub-menu :routes="route.children" />
      </el-sub-menu>
    </template>
  </template>
</template>

<script setup lang="ts">
defineProps({
  routes: {
    type: Array,
    required: true,
  },
})
</script>

<style scoped lang="scss"></style>
