// src/models/HouseModel.js

import mongoose from 'mongoose'

const houseSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  area: { type: Number, required: true },
  biarea: { type: Number },
  lotSize: { type: Number },
  rooms: { type: Number },
  houseType: { type: String, enum: ['villa', 'lägenhet', 'radhus', 'fritidshus', 'övrigt'] },
  ownership: { type: String, enum: ['äganderätt', 'bostadsrätt', 'hyresrätt'] },
  yearBuilt: { type: Number },
  energyClass: { type: String, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
  runningCosts: { type: Number },
  address: { type: String, required: true },
  images: [{
    data: Buffer,
    contentType: String
  }],
  createdAt: { type: Date, default: Date.now }
})

export const HouseModel = mongoose.model('House', houseSchema)
