import { prisma } from '../config/db.js'

export const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body
  const userId = req.user.id

  // Verify movie exists
  const movie = await prisma.movie.findUnique({ where: { id: movieId } })
  if (!movie) return res.status(404).json({ message: 'Movie not found' })

  // Check if already added
  const existingWatchlist = await prisma.watchlistItem.findUnique({
    where: { userId_movieId: { userId, movieId } },
  })
  if (existingWatchlist) return res.status(404).json({ message: 'Movie already in the watchlist' })

  const watchlistItem = await prisma.watchlistItem.create({
    data: {
      userId,
      movieId,
      status: status || 'PLANNED',
      rating,
      notes,
    },
  })

  res.status(201).json({ message: 'Movie added to watchlist', data: { watchlistItem } })
}

export const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body

  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  })

  if (!watchlistItem) return res.status(404).json({ message: 'Watchlist item not found' })

  // Ensure only owner can update
  if (watchlistItem.userId !== req.user.id)
    return res.status(403).json({ message: 'Not allowed to update this watchlist item' })

  // Build update data

  const updateData = {}
  if (status) updateData.status = status.toUpperCase()
  if (rating) updateData.rating = rating
  if (notes) updateData.notes = notes

  const updatedWatchlistItem = await prisma.watchlistItem.update({
    where: { id: req.params.id },
    data: updateData,
  })

  res.status(200).json({
    message: 'Watchlist item updated successfully',
    data: { watchlistItem: updatedWatchlistItem },
  })
}

export const removeFromWatchlist = async (req, res) => {
  // Find watchlist item and verify ownership
  const watchlistItem = await prisma.watchlistItem.findUnique({
    where: { id: req.params.id },
  })
  if (!watchlistItem) return res.status(404).json({ message: 'Watchlist item not found' })

  // Ensure only owner can delete
  if (watchlistItem.userId !== req.user.id)
    return res.status(403).json({ message: 'Not allowed to update this watchlist item' })

  await prisma.watchlistItem.delete({ where: { id: req.params.id } })
  res.status(200).json({
    message: 'Movie removed from watchlist',
  })
}
