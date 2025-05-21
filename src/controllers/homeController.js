// src/controllers/homeController.js

import { getAuth } from '@clerk/express'
import { clerkClient } from '@clerk/clerk-sdk-node'
import { HouseModel } from '../models/HouseModel.js'

export async function getHomePage(req, res) {

  const auth = getAuth(req)
  const { userId } = auth


  let displayName = userId
  let profileImageUrl = null

  // Fetch user info from Clerk if logged in
  if (userId) {
    try {
      const user = await clerkClient.users.getUser(userId)
      displayName =
        user.firstName?.trim() ||
        user.username?.trim() ||
        user.emailAddresses?.[0]?.emailAddress?.trim() ||
        userId

      profileImageUrl =
        user.profileImageUrl ||
        user.profile_image_url ||
        user._raw?.profile_image_url ||
        null

    } catch (error) {
      console.error('Error fetching Clerk user:', error)
    }
  } else {
    console.log(' Ingen användare inloggad')
  }

  // Query params
  const {
    q = '',
    sortOrder = '',
    houseType = '',
    minPrice = '',
    maxPrice = ''
  } = req.query

  let houses = []
  try {
    const filter = {}

    if (q.trim()) {
      const regex = new RegExp(q, 'i')
      filter.$or = [
        { title: regex },
        { description: regex },
        { address: regex }
      ]
    }

    if (houseType) filter.houseType = houseType

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseInt(minPrice)
      if (maxPrice) filter.price.$lte = parseInt(maxPrice)
    }

    const sort = {}
    if (sortOrder === 'asc') {
      sort.price = 1
    } else if (sortOrder === 'desc') {
      sort.price = -1
    } else {
      sort.createdAt = -1
    }

    houses = await HouseModel.find(filter).sort(sort).lean()
    console.log(' Fetched', houses.length, 'houses from DB')

  } catch (err) {
    console.error(' Error fetching houses:', err)
  }

  const allImages = houses.map(house => ({
    _id: house._id,
    userName: house.userName || house.userId,
    originalName: house.title,
    description: house.description,
    images: house.images || [],
    uploadedAt: house.createdAt,
    price: house.price,
    area: house.area
  }))

  res.render('index', {
    user: userId ? { id: displayName, profileImageUrl } : null,
    houses: allImages, 
    query: { q, sortOrder, houseType, minPrice, maxPrice },
    signInUrl: process.env.CLERK_SIGN_IN_URL,
    signUpUrl: process.env.CLERK_SIGN_UP_URL,
    manageAccountUrl: process.env.CLERK_MANAGE_ACCOUNT_URL,
    signOutUrl: process.env.CLERK_SIGN_OUT_URL || '#'
  })
  
}