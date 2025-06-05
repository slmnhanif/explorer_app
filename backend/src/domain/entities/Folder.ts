// src/domain/entities/Folder.ts

export interface Folder {
  id: number
  name: string
  parent_id: number | null
  childrenCount: number
}
