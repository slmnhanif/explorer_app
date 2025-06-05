// frontend/src/types.ts
export type FolderBasic = {
  id: number
  name: string
  parent_id: number | null
}
export type FileItem = {
  id: number
  name: string
  folder_id: number
}
