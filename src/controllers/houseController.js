// src/controllers/houseController.js

import { HouseModel } from '../models/HouseModel.js'
import { isAdmin } from '../utils/authHelpers.js'

export async function getNewHouseForm(req, res) {
  res.render('houseForm', { action: '/house/ny', heading: 'Skapa ny fastighetsannons' })
}

export async function postNewHouseForm(req, res) {
  const user = req.session.user
  if (!user) return res.status(403).send('Ej inloggad')

  const images = []
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      images.push({ data: file.buffer, contentType: file.mimetype })
    }
  }

  const {
    title,
    description,
    price,
    area,
    biarea,
    lotSize,
    rooms,
    houseType,
    ownership,
    yearBuilt,
    energyClass,
    runningCosts,
    address
  } = req.body

  try {
    const newHouse = new HouseModel({
      userId: user.id,
      userName: user.name,
      title,
      description,
      price: Number(price),
      area: Number(area),
      biarea: biarea ? Number(biarea) : undefined,
      lotSize: lotSize ? Number(lotSize) : undefined,
      rooms: rooms ? Number(rooms) : undefined,
      houseType,
      ownership,
      yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      energyClass,
      runningCosts: runningCosts ? Number(runningCosts) : undefined,
      address,
      images: images.length ? images : undefined
    })

    await newHouse.save()
    res.redirect('/')
  } catch (error) {
    console.error('Fel vid sparande av fastighet:', error)
    res.status(500).send('Fel vid sparande av fastighet')
  }
}

export async function getHouseList(req, res) {
  const user = req.session.user
  if (!user) return res.status(401).send('Ej inloggad')

  const {
    q = '',
    sortOrder = '',
    houseType = '',
    minPrice = '',
    maxPrice = ''
  } = req.query

  try {
    const filter = {}

    if (!isAdmin(user.id)) {
      filter.userId = user.id
    }

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

    const houses = await HouseModel.find(filter).sort(sort).lean()
    res.render('houseList', { houses, user })
  } catch (error) {
    console.error('Fel vid hämtning av fastigheter:', error)
    res.status(500).send('Fel vid hämtning av fastigheter')
  }
}

export async function getEditHouseForm(req, res) {
  const user = req.session.user
  const { id } = req.params
  try {
    const house = await HouseModel.findById(id)
    if (!house) return res.status(404).send('Fastighet hittades inte')
    if (house.userId !== user.id && !isAdmin(user.id)) return res.status(403).send('Åtkomst nekad')

    res.render('houseEditForm', { house })
  } catch (error) {
    res.status(500).send('Fel vid hämtning av fastighet')
  }
}

export async function postEditHouseForm(req, res) {
  const user = req.session.user
  const { id } = req.params
  const { title, description, price, area, address } = req.body
  try {
    const house = await HouseModel.findById(id)
    if (!house) return res.status(404).send('Fastighet hittades inte')
    if (house.userId !== user.id && !isAdmin(user.id)) return res.status(403).send('Åtkomst nekad')

    house.title = title
    house.description = description
    house.price = price
    house.area = area
    house.address = address

    if (req.files && req.files.length > 0) {
      house.images = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype
      }))
    }

    await house.save()
    res.redirect('/house/lista')
  } catch (error) {
    res.status(500).send('Fel vid uppdatering av fastighet')
  }
}

export async function deleteHouse(req, res) {
  const user = req.session.user
  const { id } = req.params
  try {
    const house = await HouseModel.findById(id)
    if (!house) return res.status(404).send('Fastighet hittades inte')
    if (house.userId !== user.id && !isAdmin(user.id)) return res.status(403).send('Åtkomst nekad')

    await house.deleteOne()
    res.status(200).send('Fastighet raderad')
  } catch (error) {
    res.status(500).send('Fel vid radering av fastighet')
  }
}

export async function getHouseImageByIndex(req, res) {
  const { id, index } = req.params
  try {
    const house = await HouseModel.findById(id)
    const img = house?.images?.[index]
    if (img?.data) {
      res.contentType(img.contentType)
      res.send(img.data)
    } else {
      res.status(404).send('Bild ej hittad')
    }
  } catch (err) {
    console.error('Fel vid hämtning av bild från index:', err)
    res.status(500).send('Fel vid hämtning av bild')
  }
}

export async function getHouseDetail(req, res) {
  const user = req.session.user
  const { id } = req.params

  try {
    const house = await HouseModel.findById(id).lean()
    if (!house) return res.status(404).send('Fastighet hittades inte')

    res.render('houseDetail', {
      house,
      currentUserId: user?.id || null,
      isAdmin: isAdmin(user?.id)
    })
  } catch (error) {
    console.error('Fel vid hämtning av fastighet:', error)
    res.status(500).send('Fel vid hämtning av fastighet')
  }
}
