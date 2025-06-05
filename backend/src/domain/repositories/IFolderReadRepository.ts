import { Folder } from '../entities/Folder'

export interface IFolderReadRepository {
  findRoots(): Promise<Folder[]>
  findByParentId(parentId: number | null): Promise<Folder[]>
}
