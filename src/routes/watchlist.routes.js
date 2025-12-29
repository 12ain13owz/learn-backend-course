import express from 'express'
import {
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} from '../controllers/watchlist.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validateRequest } from '../middlewares/validate-request.middleware.js'
import { addToWatchlistSchema } from '../validators/watchlist.validator.js'

const router = express.Router()

router.use(authMiddleware)

router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist)
router.put('/:id', updateWatchlistItem)
router.delete('/:id', removeFromWatchlist)

export default router
