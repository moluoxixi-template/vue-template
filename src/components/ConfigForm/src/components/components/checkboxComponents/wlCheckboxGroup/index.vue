<script setup lang="ts">
import type { configType, FormModelProps } from '@/components/ConfigForm/src/types'
import { computed, ref, watch } from 'vue'
import { isType } from '@/components/ConfigForm/src/utils'

interface CheckboxItem {
  label: string
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    prop: string
    slots: Record<string, any>
    model: FormModelProps
    config: configType
  }>(),
  {
    prop: '',
    slots: () => ({}),
    model: () => ({}),
    config: () => ({}),
  },
)

const emit = defineEmits(['update:model'])

const show = ref(true)
const Event = ref({})
const Options = ref({})
const checkboxes = ref<CheckboxItem[]>([])

const computedModel = computed({
  get: () => props.model[props.prop],
  set: (val) => {
    emit('update:model', val)
  },
})

watch(
  () => props.config,
  (v) => {
    const { show: showVal, event, checkboxes: checkboxesVal = [], ...rest } = v
    if (isType(showVal, 'boolean')) {
      show.value = !!showVal
    }
    checkboxes.value = checkboxesVal
    Options.value = rest
    Event.value = event || {}
  },
  { immediate: true, deep: true },
)
</script>

<template>
  <el-checkbox-group v-if="show" v-model="computedModel" v-bind="Options" v-on="Event">
    <el-checkbox v-for="checkbox in checkboxes" :key="checkbox.label" v-bind="checkbox" />
  </el-checkbox-group>
</template>

<style scoped lang="scss"></style>
