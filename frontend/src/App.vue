<template>
  <div class="app-container">
    <!-- Panel Kiri: Search + Tree -->
    <div class="left-panel">
      <!-- Search menggunakan Element Plus -->
      <el-input
        v-model="searchTerm"
        placeholder="Search folder..."
        class="search-input"
        clearable
        size="small"
      >
        <template #prefix>
          <i class="el-icon-search" />
        </template>
      </el-input>

      <!-- Spinner saat loading root folders -->
      <div v-if="isLoadingRoots" class="loading-container">
        <el-spinner />
      </div>

      <!-- Daftar Root Folders -->
      <template v-else>
        <TreeNode
          v-for="root in filteredRoots"
          :key="root.id"
          :folder="root"
          :selectedFolderId="selectedFolder ? selectedFolder.id : null"
          :level="0"
          @select="onSelectFolder"
        />
        <el-empty
          v-if="!isLoadingRoots && roots.length === 0"
          description="No folders found"
        />
      </template>
    </div>

    <!-- Panel Kanan: Detail Subfolders & Files -->
    <div class="right-panel">
      <div v-if="!selectedFolder" class="empty-msg">
        Klik folder di kiri untuk melihat detailnya.
      </div>

      <div v-else>
        <h2 class="panel-title">{{ selectedFolder.name }}</h2>

        <!-- Subfolders Card -->
        <el-card class="section-card">
          <template #header>
            <span class="section-title">Subfolders</span>
          </template>

          <!-- Spinner saat loading subfolders -->
          <div v-if="isLoadingSubfolders" class="loading-container">
            <el-spinner />
          </div>

          <!-- Daftar Subfolders -->
          <el-list v-else class="item-list">
            <el-list-item
              v-for="sub in subfoldersOfSelected"
              :key="sub.id"
              class="item-row"
              @click="onSelectFolder(sub)"
            >
              <el-icon class="icon">
                <i class="el-icon-folder" />
              </el-icon>
              <span>{{ sub.name }}</span>
            </el-list-item>
            <el-empty
              v-if="!isLoadingSubfolders && subfoldersOfSelected.length === 0"
              description="Tidak ada subfolder"
            />
          </el-list>
        </el-card>

        <!-- Files Card -->
        <el-card class="section-card">
          <template #header>
            <span class="section-title">Files</span>
          </template>

          <!-- Spinner saat loading files -->
          <div v-if="isLoadingFiles" class="loading-container">
            <el-spinner />
          </div>

          <!-- Daftar Files -->
          <el-list v-else class="item-list">
            <el-list-item
              v-for="file in filesInSelected"
              :key="file.id"
              class="item-row"
            >
              <el-icon class="icon">
                <i class="el-icon-document" />
              </el-icon>
              <span>{{ file.name }}</span>
            </el-list-item>
            <el-empty
              v-if="!isLoadingFiles && filesInSelected.length === 0"
              description="Tidak ada file"
            />
          </el-list>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import TreeNode from './components/TreeNode.vue'

// Tipe data untuk folder dan file
interface FolderNode {
  id: number
  name: string
  parent_id: number | null
  childrenCount: number
}

interface FileItem {
  id: number
  name: string
  folder_id: number
}

export default {
  name: 'App',
  components: { TreeNode },
  setup() {
    // State root folders
    const roots = ref<FolderNode[]>([])
    const isLoadingRoots = ref(true)

    // State search
    const searchTerm = ref<string>('')

    // State folder yang dipilih
    const selectedFolder = ref<FolderNode | null>(null)
    const subfoldersOfSelected = ref<FolderNode[]>([])
    const filesInSelected = ref<FileItem[]>([])

    // State loading untuk subfolders dan files
    const isLoadingSubfolders = ref(false)
    const isLoadingFiles = ref(false)

    // 1. Fetch root folders pada saat mounted
    onMounted(async () => {
      try {
        // Menggunakan versioned endpoint: GET /api/v1/folders
        const res = await axios.get<FolderNode[]>('/api/v1/folders')
        roots.value = res.data
      } catch (err) {
        console.error('Error fetching root folders:', err)
        roots.value = []
      } finally {
        isLoadingRoots.value = false
      }
    })

    // 2. Filter root folders berdasarkan searchTerm
    const filteredRoots = computed<FolderNode[]>(() => {
      if (searchTerm.value.trim() === '') {
        return roots.value
      }
      const term = searchTerm.value.trim().toLowerCase()
      return roots.value.filter((f) =>
        f.name.toLowerCase().includes(term)
      )
    })

    // 3. Fungsi saat user memilih folder (klik di TreeNode atau list)
    async function onSelectFolder(folder: FolderNode) {
      selectedFolder.value = folder

      // Fetch subfolders: GET /api/v1/folders/{folder.id}/children
      isLoadingSubfolders.value = true
      try {
        const resChildren = await axios.get<FolderNode[]>(
          `/api/v1/folders/${folder.id}/children`
        )
        subfoldersOfSelected.value = resChildren.data
      } catch (err) {
        console.error(`Error fetching subfolders for ${folder.id}:`, err)
        subfoldersOfSelected.value = []
      } finally {
        isLoadingSubfolders.value = false
      }

      // Fetch files: GET /api/v1/folders/{folder.id}/files
      isLoadingFiles.value = true
      try {
        const resFiles = await axios.get<FileItem[]>(
          `/api/v1/folders/${folder.id}/files`
        )
        filesInSelected.value = resFiles.data
      } catch (err) {
        console.error(`Error fetching files for ${folder.id}:`, err)
        filesInSelected.value = []
      } finally {
        isLoadingFiles.value = false
      }
    }

    return {
      roots,
      isLoadingRoots,
      searchTerm,
      filteredRoots,
      selectedFolder,
      subfoldersOfSelected,
      filesInSelected,
      isLoadingSubfolders,
      isLoadingFiles,
      onSelectFolder
    }
  }
}
</script>

<style scoped>
/* ------- Global Reset & Base ------- */
*,
*::before,
*::after {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
}

/* ------- Container Utama ------- */
.app-container {
  display: flex;
  height: 100vh;
  color: #333;
}

/* ------- Panel Kiri ------- */
.left-panel {
  width: 300px;
  border-right: 1px solid #e0e0e0;
  background-color: #fff;
  overflow-y: auto;
  padding: 12px;
}
.search-input {
  margin-bottom: 12px;
}
/* Spinner container di kiri */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
}
.no-data {
  text-align: center;
  color: #888;
  font-style: italic;
  margin: 12px 0;
}

/* ------- Panel Kanan ------- */
.right-panel {
  flex: 1;
  padding: 20px;
  background-color: #fafbfc;
  overflow-y: auto;
}
.empty-msg {
  color: #666;
  font-size: 16px;
  text-align: center;
  margin-top: 40px;
}
.panel-title {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: #222;
}

/* ------- Card (ElCard) ------- */
.section-card {
  margin-bottom: 20px;
}
.section-title {
  font-size: 18px;
  color: #444;
}

/* ikon di list */
.icon {
  margin-right: 8px;
  color: #409eff; /* biru default Element Plus */
}

/* Animasi fade (dipakai di TreeNode.vue) */
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

/* Scrollbar */
.left-panel::-webkit-scrollbar,
.right-panel::-webkit-scrollbar {
  width: 8px;
}
.left-panel::-webkit-scrollbar-thumb,
.right-panel::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.left-panel::-webkit-scrollbar-track,
.right-panel::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
