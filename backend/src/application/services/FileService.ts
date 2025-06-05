// src/application/services/FileService.ts

import { IFileRepository } from '../../domain/repositories/IFileRepository'
import { FileItem } from '../../domain/entities/FileItem'

export class FileService {
  private fileRepo: IFileRepository

  constructor(fileRepo: IFileRepository) {
    this.fileRepo = fileRepo
  }

  async getFilesByFolder(folderId: number): Promise<FileItem[]> {
    return this.fileRepo.findByFolderId(folderId)
  }
}
