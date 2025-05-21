import { describe, test, expect } from '@jest/globals'
import request from 'supertest'
describe('server', () => {
  test('GET / on http://localhost:3001 should respond', async () => {
    try {
      const res = await request('http://localhost:3001').get('/')
      expect(res.status).toBeLessThan(500)
    } catch (err) {
    throw new Error('currently not running, – is it started?')
    }
  }, 10000) 
})
