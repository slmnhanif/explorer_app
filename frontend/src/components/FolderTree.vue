<template>
  <ul style="list-style-type: none; margin: 0; padding-left: 0;">
    <li
      v-for="folder in currentFolders"
      :key="folder.id"
      :style="{ paddingLeft: `${level * 16}px` }"
    >
      <div
        @click="() => emitSelect(folder.id)"
        :class="{ selected: folder.id === selectedId }"
        style="display: inline-block;"
      >
        📁 {{ folder.name }}
      </div>
      <!-- Jika folder ini punya anak, render lagi <FolderTree> secara rekursif -->
      <FolderTree
        v-if="hasChildren(folder.id)"
        :folders="folders"
        :selectedId="selectedId"
        :parentId="folder.id"
        :level="level + 1"
        @select="(id) => emitSelect(id)"
      />
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'

type Folder = {
  id: number
  name: string
  parent_id: number | null
}

export default defineComponent({
  name: 'FolderTree',
  props: {
    folders: {
      type: Array as PropType<Folder[]>,
      required: true
    },
    selectedId: {
      type: Number as PropType<number | null>,
      default: null
    },
    parentId: {
      type: Number as PropType<number | null>,
      default: null
    },
    level: {
      type: Number as PropType<number>,
      default: 0
    }
  },
  emits: ['select'],
  setup(props, { emit }) {
    // 1. Daftar folder yang langsung turunannya = parentId
    const currentFolders = computed<Folder[]>(() =>
      props.folders.filter((f) => f.parent_id === props.parentId)
    )

    // 2. Cek apakah sebuah folder punya anak
    function hasChildren(id: number) {
      return props.folders.some((f) => f.parent_id === id)
    }

    function emitSelect(id: number) {
      emit('select', id)
    }

    return {
      currentFolders,
      hasChildren,
      emitSelect
    }
  }
})
</script>

<style scoped>
.selected {
  background-color: #d0d0ff;
  font-weight: bold;
}
</style>
