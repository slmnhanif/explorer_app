import { IFolderReadRepository } from '../../domain/repositories/IFolderReadRepository'
import { Folder } from '../../domain/entities/Folder'

export class FolderService {
  constructor(private folderRepo: IFolderReadRepository) {}

  async getRootFolders(): Promise<Folder[]> {
    return this.folderRepo.findRoots()
  }

  async getChildFolders(parentId: number | null): Promise<Folder[]> {
    return this.folderRepo.findByParentId(parentId)
  }
}
