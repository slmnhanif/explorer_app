// src/infrastructure/repositories/InMemoryFolderRepository.ts
import { IFolderRepository } from '../../domain/repositories/IFolderRepository'
import { Folder } from '../../domain/entities/Folder'

const sampleData: Folder[] = [
  { id:1, name: 'Documents', parent_id: null, childrenCount: 2 },
  { id:4, name: 'Work', parent_id: 1, childrenCount: 0 },
  { id:5, name: 'Personal', parent_id: 1, childrenCount: 0 },
  // … lainnya …
]

export class InMemoryFolderRepository implements IFolderRepository {
  async findRoots(): Promise<Folder[]> {
    return sampleData.filter(f => f.parent_id === null)
  }
  async findByParentId(parentId: number | null): Promise<Folder[]> {
    return sampleData.filter(f => f.parent_id === parentId)
  }
}
