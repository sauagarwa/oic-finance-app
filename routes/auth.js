<<<<<<< HEAD
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
=======

import express from "express";
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'
import { requireAuth } from '../middleware/auth.js'
import db from "../db/connection.js";
const router = express.Router();
// This help convert the id from string to ObjectId for the _id.
import  { ObjectId } from "mongodb";
>>>>>>> f301fda (Added the capability to run client and server in a single service)

// Sign up
router.post('/signup', async (req, res) => {
  try {
<<<<<<< HEAD
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
=======

    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    // Validate input
    if (!username || !email || !password) {
      res.statusMessage = 'Username, email and password are required' ;
      res.status(400).end();
      return
    }

    let userCollection = await db.collection("user");
    let query = { username: username };
    let existingUser = await userCollection.findOne(query);

    if (existingUser) {
      res.statusMessage = 'Username already registered';
      res.status(400).end();
      return
>>>>>>> f301fda (Added the capability to run client and server in a single service)
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

<<<<<<< HEAD
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      }
    })
=======
    const role = (username === "admin") ? "admin" : "user";

    let newUser = {
      username: username,
      password: passwordHash,
      email: email,
      role: role,
    };

    let createdUser = await userCollection.insertOne(newUser);
    createdUser = await userCollection.findOne({_id: createdUser.insertedId});
>>>>>>> f301fda (Added the capability to run client and server in a single service)

    // Create session
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

<<<<<<< HEAD
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })
=======
    let userSessioncollection = await db.collection("usersession");

    let usersessionObj = {
      token: token,
      userId: createdUser._id.toString(),
      username: createdUser.username,
      expiresAt: expiresAt,
    };

    let createdUserSession = await userSessioncollection.insertOne(usersessionObj);
>>>>>>> f301fda (Added the capability to run client and server in a single service)

    // Set cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    })

<<<<<<< HEAD
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
=======
    res.send({
      id: createdUser._id.toString(),
      email: createdUser.email,
      username: createdUser.username,
      role: createdUser.role,
    })
  } catch (err) {
    console.error('Sign up error:', err)
>>>>>>> f301fda (Added the capability to run client and server in a single service)
    res.status(500).json({ error: 'Internal server error' })
  }
})

<<<<<<< HEAD
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
=======
// Sign in
router.post('/signin', async (req, res) => {
  try {
    const username = req.body.auth.username;
    const password = req.body.auth.password;

    // Validate input
    if (!username || !password) {
      res.statusMessage = 'Username and password are required';
      res.status(400).json({ error: 'Username and password are required' })
      return
    }

    let userCollection = await db.collection("user");
    let query = { username: username };

    // Find user
    const user = await userCollection.findOne(query);
>>>>>>> f301fda (Added the capability to run client and server in a single service)

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Verify password
<<<<<<< HEAD
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
=======
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      res.statusMessage = 'Invalid credentials';
>>>>>>> f301fda (Added the capability to run client and server in a single service)
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    // Create session
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30) // 30 days from now

<<<<<<< HEAD
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt
      }
    })
=======
    let userSessioncollection = await db.collection("usersession");

    let usersessionObj = {
      token: token,
      userId: user._id.toString(),
      expiresAt: expiresAt,
    };

    await userSessioncollection.insertOne(usersessionObj);
>>>>>>> f301fda (Added the capability to run client and server in a single service)

    // Set cookie
    res.cookie('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt
    })

    res.json({
<<<<<<< HEAD
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
=======
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    })
  } catch (err) {
    console.error('Sign in error:', err)
>>>>>>> f301fda (Added the capability to run client and server in a single service)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Sign out
router.post('/signout', requireAuth, async (req, res) => {
  try {
    const token = req.cookies.session
    if (token) {
<<<<<<< HEAD
      await prisma.session.delete({
        where: { token }
      })
=======
      const query = { token: token };
      const collection = db.collection("usersession");
      await collection.deleteOne(query);
>>>>>>> f301fda (Added the capability to run client and server in a single service)
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

<<<<<<< HEAD
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })
=======
    let userSessionCollection = await db.collection("usersession");
    let query = { token: token };

    // Find user
    const session = await userSessionCollection.findOne(query);
>>>>>>> f301fda (Added the capability to run client and server in a single service)

    if (!session || session.expiresAt < new Date()) {
      res.clearCookie('session')
      res.json({ user: null })
      return
    }

<<<<<<< HEAD
    res.json({
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
=======
    // get the user object 
    let userCollection = await db.collection("user");
    const userQuery = { _id: new ObjectId(session.userId ) };
    const user = await userCollection.findOne(userQuery);

    if (!user) {
      res.clearCookie('session')
      res.json({ user: null })
      return
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
>>>>>>> f301fda (Added the capability to run client and server in a single service)
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ error: 'Failed to get current user' })
  }
})

export default router
