import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'

vi.mock('../../model', () => ({
  default: {
    findOne: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findById: vi.fn(),
  },
}))

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed'),
    compare: vi.fn().mockResolvedValue(true),
  },
}))

import app from '../../app'
import Candidate from '../../model'
import { signToken } from '../../jwt'

type ServicesModule = {
  signup: (input: { email: string; password: string }) => Promise<{
    token: string
    candidate: { _id: string; profile: { email: string } }
  }>
  login: (input: { email: string; password: string }) => Promise<{
    token: string
    candidate: { _id: string; profile: { email: string } }
  }>
  updateCandidate: (
    id: string,
    data: { firstName: string; lastNames: string; phone: string },
    token: string,
  ) => Promise<unknown>
  testCandidate: (id: string, choices: string[], token: string) => Promise<unknown>
  fetchCandidate: (id: string, token: string) => Promise<unknown>
}

let services: ServicesModule
let server: Server
const TEST_CANDIDATE_ID = 'abc'
const TEST_TOKEN = signToken({ candidateId: TEST_CANDIDATE_ID })

beforeAll(async () => {
  server = app.listen(0)
  const { port } = server.address() as AddressInfo

  vi.stubEnv('VITE_API_URL', `http://localhost:${port}`)

  services = (await import(
    '../../../client/src/services/candidate-input'
  )) as ServicesModule
})

afterAll(() => {
  server.close()
  vi.unstubAllEnvs()
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('client <-> server integration', () => {
  describe('signup', () => {
    it('sends email/password and returns { token, candidate }', async () => {
      const created = { _id: 'abc', profile: { email: 'a@b.c' } }
      vi.mocked(Candidate.findOne).mockResolvedValue(null)
      vi.mocked(Candidate.create).mockResolvedValue(created as never)

      const result = await services.signup({
        email: 'a@b.c',
        password: 'longenough',
      })

      expect(Candidate.create).toHaveBeenCalledWith(
        expect.objectContaining({
          profile: expect.objectContaining({ email: 'a@b.c' }),
          passwordHash: 'hashed',
        })
      )
      expect(result.candidate).toEqual(created)
      expect(typeof result.token).toBe('string')
      expect(result.token.length).toBeGreaterThan(0)
    })
  })

  describe('login', () => {
    it('sends email/password and returns { token, candidate }', async () => {
      const existing = {
        _id: 'abc',
        profile: { email: 'a@b.c' },
        passwordHash: 'hashed',
      }
      vi.mocked(Candidate.findOne).mockResolvedValue(existing as never)

      const result = await services.login({
        email: 'a@b.c',
        password: 'longenough',
      })

      expect(Candidate.findOne).toHaveBeenCalledWith({ 'profile.email': 'a@b.c' })
      expect(result.candidate).toEqual(existing)
      expect(typeof result.token).toBe('string')
    })
  })

  describe('updateCandidate', () => {
    it('sends registration fields with auth and returns the updated candidate', async () => {
      const sentinel = { _id: 'abc', profile: { firstName: 'Jon' } }
      vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(sentinel as never)

      const result = await services.updateCandidate(
        TEST_CANDIDATE_ID,
        { firstName: 'Jon', lastNames: 'Doe', phone: '555' },
        TEST_TOKEN,
      )

      expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc',
        expect.objectContaining({
          $set: expect.objectContaining({
            'profile.firstName': 'Jon',
            'profile.lastNames': 'Doe',
            'profile.phone': '555',
          }),
        }),
        expect.any(Object)
      )
      expect(result).toEqual(sentinel)
    })
  })

  describe('testCandidate', () => {
    it('sends choices with auth and returns the updated candidate', async () => {
      const sentinel = { _id: 'abc', steps: { test: { score: 10 } } }
      vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(sentinel as never)

      const result = await services.testCandidate(
        TEST_CANDIDATE_ID,
        ['a', 'b', 'c', 'd', 'a'],
        TEST_TOKEN,
      )

      expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(
        'abc',
        expect.objectContaining({
          $set: expect.objectContaining({
            'steps.test.choices': ['a', 'b', 'c', 'd', 'a'],
          }),
        }),
        expect.any(Object)
      )
      expect(result).toEqual(sentinel)
    })
  })

  describe('fetchCandidate', () => {
    it('GETs by id with auth and returns the candidate', async () => {
      const sentinel = { _id: 'abc', profile: { email: 'a@b.c' } }
      vi.mocked(Candidate.findById).mockResolvedValue(sentinel as never)

      const result = await services.fetchCandidate(TEST_CANDIDATE_ID, TEST_TOKEN)

      expect(Candidate.findById).toHaveBeenCalledWith('abc')
      expect(result).toEqual(sentinel)
    })
  })
})
