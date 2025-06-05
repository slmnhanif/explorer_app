import { Router, Request, Response } from 'express'
import { FileService } from '../../application/services/FileService'
import { MySQLFileRepository } from '../repositories/MySQLFileRepository'

export function createFileRouter(): Router {
  const fileRepo = new MySQLFileRepository()
  const fileService = new FileService(fileRepo)
  const router = Router()

  // GET /api/v1/folders/:id/files
  router.get('/folders/:id/files', async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid folder ID' })
    }
    try {
      const files = await fileService.getFilesByFolder(id)
      res.status(200).json(files)
    } catch (err) {
      console.error('Error getFilesByFolder:', err)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  })

  return router
}
