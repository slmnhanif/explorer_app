// src/domain/repositories/IFolderRepository.ts

import { Folder } from '../entities/Folder'

export interface IFolderRepository {
    
  // Ambil root folders (parent_id IS NULL)
  findRoots(): Promise<Folder[]>

  // Ambil child folders untuk parent tertentu
  findByParentId(parentId: number | null): Promise<Folder[]>
}
