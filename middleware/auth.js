
<<<<<<< HEAD
import { prisma } from '../db/prisma.js'
=======
import db from "../db/connection.js";
import  { ObjectId } from "mongodb";
>>>>>>> f301fda (Added the capability to run client and server in a single service)

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.session

    if (!token) {
      res.status(401).json({ error: 'Authentication required' })
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

    if (!session) {
      res.clearCookie('session')
      res.status(401).json({ error: 'Invalid session' })
      return
    }

    if (session.expiresAt < new Date()) {
<<<<<<< HEAD
      await prisma.session.delete({ where: { id: session.id } })
=======
      await collection.deleteOne(query);
>>>>>>> f301fda (Added the capability to run client and server in a single service)
      res.clearCookie('session')
      res.status(401).json({ error: 'Session expired' })
      return
    }

<<<<<<< HEAD
    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name
    }

    req.session = {
      id: session.id,
=======
    // get the user object 
    let userCollection = await db.collection("user");
    const userQuery = { _id: new ObjectId(session.userId ) };
    const user = await userCollection.findOne(userQuery);

    req.user = {
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    }

    req.session = {
      id: session._id,
>>>>>>> f301fda (Added the capability to run client and server in a single service)
      token: session.token
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
