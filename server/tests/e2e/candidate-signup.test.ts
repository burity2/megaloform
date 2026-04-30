import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

import app from '../../app'
import Candidate from '../../model'

type ServicesModule = {
  signup: (input: { email: string; password: string }) => Promise<{
    token: string
    candidate: { _id: string; profile: { email: string } }
  }>
}

let mongo: MongoMemoryServer
let server: Server
let services: ServicesModule

beforeAll(async () => {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())

  server = app.listen(0)
  const { port } = server.address() as AddressInfo

  vi.stubEnv('VITE_API_URL', `http://localhost:${port}`)
  services = (await import(
    '../../../client/src/services/candidate-input'
  )) as ServicesModule
}, 60_000)

afterAll(async () => {
  server.close()
  await mongoose.disconnect()
  await mongo.stop()
  vi.unstubAllEnvs()
})

describe('e2e: candidate signup', () => {
  it('persists a new candidate with the sanitized email', async () => {
    const result = await services.signup({
      email: '  Hello@Example.COM  ',
      password: 'longenough',
    })

    expect(typeof result.token).toBe('string')
    expect(result.token.length).toBeGreaterThan(0)

    const stored = await Candidate.findOne({ 'profile.email': 'hello@example.com' })

    expect(stored).not.toBeNull()
    expect(stored!.profile.email).toBe('hello@example.com')
  })
})
