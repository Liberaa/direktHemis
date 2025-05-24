// src/controllers/homeController.js

import { HouseModel } from '../models/HouseModel.js'

export async function getHomePage(req, res) {
  const user = req.session.user

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
    if (sortOrder === 'asc') sort.price = 1
    else if (sortOrder === 'desc') sort.price = -1
    else sort.createdAt = -1

    houses = await HouseModel.find(filter).sort(sort).lean()

  } catch (err) {
    console.error('Error fetching houses:', err)
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
    user,
    houses: allImages,
    query: { q, sortOrder, houseType, minPrice, maxPrice },
    signInUrl: '/users/login',
    signUpUrl: '/users/register',
    manageAccountUrl: '/users/account',
    signOutUrl: '/users/logout'
  })
}
