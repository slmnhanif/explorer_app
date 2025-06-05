import { IFolderReadRepository } from '../../domain/repositories/IFolderReadRepository'
import { Folder } from '../../domain/entities/Folder'
import { pool } from '../db/MySQLPool'

export class MySQLFolderRepository implements IFolderReadRepository {
  async findRoots(): Promise<Folder[]> {
    const [rows] = await pool.query<any[]>(`
      SELECT f.id, f.name, f.parent_id, COUNT(c.id) AS childrenCount
      FROM folders f
      LEFT JOIN folders c ON c.parent_id = f.id
      WHERE f.parent_id IS NULL
      GROUP BY f.id, f.name, f.parent_id
      ORDER BY f.name ASC
    `)
    return rows as Folder[]
  }

  async findByParentId(parentId: number | null): Promise<Folder[]> {
    const [rows] = await pool.query<any[]>(`
      SELECT f.id, f.name, f.parent_id, COUNT(c.id) AS childrenCount
      FROM folders f
      LEFT JOIN folders c ON c.parent_id = f.id
      WHERE f.parent_id <=> ?
      GROUP BY f.id, f.name, f.parent_id
      ORDER BY f.name ASC
    `, [parentId])
    return rows as Folder[]
  }
}
