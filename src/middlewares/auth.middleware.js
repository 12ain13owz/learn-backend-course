import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'

// Read the token from request header
// Check if token is valid
export const authMiddleware = async (req, res, next) => {
  console.log('authMiddleware called')
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer '))
    token = req.headers.authorization.split(' ')[1]
  else if (req.cookie.jwt) token = req.cookie.jwt

  if (!token) res.status(401).json({ message: 'Unauthorized! No token provided' })

  try {
    // Verify token and extract the use Id
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })

    if (!user) return res.status(401).json({ message: 'Unauthorized! User not found' })
    req.user = user

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized! Invalid token' })
  }
}
