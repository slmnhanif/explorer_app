// src/infrastructure/repositories/MySQLFileRepository.ts

import { IFileRepository } from '../../domain/repositories/IFileRepository'
import { FileItem } from '../../domain/entities/FileItem'
import { pool } from '../db/MySQLPool'

export class MySQLFileRepository implements IFileRepository {
  async findByFolderId(folderId: number): Promise<FileItem[]> {
    const [rows] = await pool.query<FileItem[]>(
      'SELECT id, name, folder_id FROM files WHERE folder_id = ? ORDER BY name ASC',
      [folderId]
    )
    return rows
  }
}
