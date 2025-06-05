<template>
  <div>
    <!-- Baris folder: pakai ElButton (type="text") agar area klik luas -->
    <el-button
      class="node-row"
      type="text"
      :style="{ paddingLeft: `${level * 20}px` }"
      @click="emitSelect(folder)"
    >
      <!-- Ikon expand/collapse -->
      <span
        v-if="folder.childrenCount > 0"
        @click.stop="toggleExpand"
        class="toggle-icon"
      >
        {{ isExpanded ? '▼' : '▶' }}
      </span>
      <span v-else class="leaf-icon">•</span>

      <span :class="{ 'node-selected': folder.id === selectedFolderId }" class="node-name">
        {{ folder.name }}
      </span>
    </el-button>

    <!-- Children dengan animasi fade -->
    <transition name="fade">
      <div v-if="isExpanded" class="children-container">
        <!-- Spinner Element Plus saat loading -->
        <div v-if="isLoading" class="loading-container">
          <el-spinner size="20" />
        </div>
        <!-- TreeNode anak setelah data datang -->
        <TreeNode
          v-for="child in children"
          :key="child.id"
          :folder="child"
          :selectedFolderId="selectedFolderId"
          :level="level + 1"
          @select="emitSelect"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { defineProps, defineEmits } from 'vue'

// Sama seperti di App.vue, kita menggunakan interface FolderNode yang di‐fetch dari backend
interface FolderNode {
  id: number
  name: string
  parent_id: number | null
  childrenCount: number
}

const props = defineProps<{
  folder: FolderNode
  selectedFolderId: number | null
  level: number
}>()

const emit = defineEmits<{
  (e: 'select', folder: FolderNode): void
}>()

const isExpanded = ref(false)
const isLoading = ref(false)
const hasLoaded = ref(false)
const children = ref<FolderNode[]>([])

async function toggleExpand() {
  isExpanded.value = !isExpanded.value

  // Jika di‐expand (true) dan belum pernah load sebelumnya
  if (isExpanded.value && !hasLoaded.value) {
    isLoading.value = true
    try {
      // Panggil endpoint yang sudah di‐prefix versioning:
      // GET /api/v1/folders/{id}/children
      const res = await axios.get<FolderNode[]>(`/api/v1/folders/${props.folder.id}/children`)
      children.value = res.data
      hasLoaded.value = true
    } catch (err) {
      console.error(`Error fetching children for folder ${props.folder.id}:`, err)
      children.value = []
    } finally {
      isLoading.value = false
    }
  }
}

function emitSelect(folder: FolderNode) {
  emit('select', folder)
}
</script>

<style scoped>
.node-row {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
}
.toggle-icon {
  width: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: #555;
  font-size: 12px;
}
.leaf-icon {
  display: inline-block;
  width: 16px;
  text-align: center;
  font-size: 10px;
  color: #999;
}
.node-name {
  margin-left: 4px;
  flex-shrink: 1;
  color: #333;
}
.node-selected {
  background-color: #e0f3ff; /* highlight biru lembut */
  border-radius: 4px;
  padding: 2px 4px;
}
.children-container {
  margin-top: 2px;
}
.loading-container {
  padding-left: calc(20px + 16px); /* indentasi + ikon */
  padding-top: 4px;
}

/* Animasi fade */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
