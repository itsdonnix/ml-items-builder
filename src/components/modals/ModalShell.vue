<script setup lang="ts">
defineProps<{
  visible: boolean
  title?: string
  width?: string
  titleIcon?: string
  titleIconColor?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="overlay active">
      <div class="overlay-backdrop" @click="emit('close')" />
      <div class="modal" :style="width ? { width } : {}">
        <div class="modal-header">
          <h3 v-if="title || titleIcon">
            <i
              v-if="titleIcon"
              :class="`fa-solid ${titleIcon}`"
              :style="titleIconColor ? { color: titleIconColor } : {}"
            />
            {{ title }}
          </h3>
          <slot name="header" />
          <button class="btn btn-icon" @click="emit('close')">
            <i class="fa-solid fa-xmark" />
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
