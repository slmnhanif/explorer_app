// src/domain/repositories/IFileRepository.ts

import { FileItem } from '../entities/FileItem'

export interface IFileRepository {
  // Ambil files berdasarkan folder_id
  findByFolderId(folderId: number): Promise<FileItem[]>
}
