import { Router, Request, Response } from 'express'
import { FolderService } from '../../application/services/FolderService'
import { MySQLFolderRepository } from '../repositories/MySQLFolderRepository'

export function createFolderRouter(): Router {
  const folderRepo = new MySQLFolderRepository()
  const folderService = new FolderService(folderRepo)
  const router = Router()

  // GET /api/v1/folders
  router.get('/folders', async (_req: Request, res: Response) => {
    try {
      const roots = await folderService.getRootFolders()
      res.status(200).json(roots)
    } catch (err) {
      console.error('Error getRootFolders:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  // GET /api/v1/folders/:parentId/children
  router.get('/folders/:parentId/children', async (req: Request, res: Response) => {
    const raw = req.params.parentId
    const parentId = raw === 'null' ? null : Number(raw)
    if (raw !== 'null' && isNaN(parentId)) {
      return res.status(400).json({ error: 'Invalid parentId' })
    }
    try {
      const children = await folderService.getChildFolders(parentId)
      res.status(200).json(children)
    } catch (err) {
      console.error('Error getChildFolders:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  return router
}
