import { prisma } from '../db/prisma.js'
import express from "express";
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { ZodError } from 'zod'
import { requireAuth } from '../middleware/auth.js'
import { z } from 'zod'

const router = express.Router();

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().optional()
})

router.post('/asdf', async (req, res) => {
  try {
    res.status(200).json({ 
      message: 'Success'
    })
  } catch (err) {
    console.error('Sign up error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const result = signUpSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
      return
    }

    const { email, password, name } = result.data

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      }
    })

    // Create session
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })

    // Set cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    })

    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    })
  } catch (err) {
    console.error('Sign up error:', err)
    if (err instanceof ZodError) {
      res.status(400).json({ 
        error: 'Validation failed',
        details: err.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
      return
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const result = signInSchema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
      return 
    }

    const { email, password } = result.data

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Create session
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })

    // Set cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    })

    res.json({
      id: user.id,
      email: user.email,
      name: user.name
    })
  } catch (err) {
    console.error('Sign in error:', err)
    if (err instanceof ZodError) {
      res.status(400).json({ 
        error: 'Validation failed',
        details: err.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        }))
      })
      return
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Sign out
router.post('/signout', requireAuth, async (req, res) => {
  try {
    const token = req.cookies.session
    if (token) {
      await prisma.session.delete({
        where: { token }
      })
      res.clearCookie('session')
    }
    res.json({ message: 'Signed out successfully' })
  } catch (error) {
    console.error('Signout error:', error)
    res.status(500).json({ error: 'Failed to sign out' })
  }
})

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const token = req.cookies.session
    if (!token) {
      res.json({ user: null })
      return
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!session || session.expiresAt < new Date()) {
      res.clearCookie('session')
      res.json({ user: null })
      return
    }

    res.json({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ error: 'Failed to get current user' })
  }
})

export default router
