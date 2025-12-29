import bcrypt from 'bcrypt'
import { prisma } from '../config/db.js'
import { generateToken } from '../utils/jwt.util.js'

export const register = async (req, res) => {
  const { name, email, password } = req.body

  // Chick if user already exists
  const userExists = await prisma.user.findUnique({ where: { email } })
  if (userExists) return res.status(400).json({ message: 'User already exists' })

  // Hash Password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create User
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
}

export const login = async (req, res) => {
  const { email, password } = req.body

  // Checl if user email exists in the table
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ message: 'Invalid email or password' })

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' })

  // Generate JWT token
  const token = generateToken(user.id, res)

  res.status(200).json({
    message: 'User logged in successfully',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  })
}

export const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({ message: 'User logged out successfully' })
}
