import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello Movie' })
})

router.post('/', (req, res) => {
  res.json({ message: 'Create Movie' })
})

router.put('/', (req, res) => {
  res.json({ message: 'Update Movie' })
})

router.delete('/', (req, res) => {
  res.json({ message: 'Delete Movie' })
})

export default router
