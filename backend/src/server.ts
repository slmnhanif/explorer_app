import express from 'express'
import cors from 'cors'
import { createFolderRouter } from './infrastructure/http/FolderController'
import { createFileRouter } from './infrastructure/http/FileController'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/v1', createFolderRouter())
app.use('/api/v1', createFileRouter())

app.get('/', (_req, res) => {
  res.send('🟢 Backend v1 (RESTful) running!')
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
