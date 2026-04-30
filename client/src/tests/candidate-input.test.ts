import {
  signup,
  login,
  updateCandidate,
  testCandidate,
  fetchCandidate,
} from '../services/candidate-input'

describe('candidate-input service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  describe('signup', () => {
    it('POSTs to /auth/signup with email and password in body', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ token: 't', candidate: { _id: '123' } }),
      } as Response)

      await signup({ email: 'a@b.c', password: 'longenough' })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/signup'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'a@b.c', password: 'longenough' }),
        })
      )
    })

    it('returns the parsed { token, candidate } on success', async () => {
      const body = { token: 'jwt', candidate: { _id: '123', profile: { email: 'a@b.c' } } }
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => body,
      } as Response)

      const result = await signup({ email: 'a@b.c', password: 'longenough' })

      expect(result).toEqual(body)
    })

    it('throws with the server message on a non-OK response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ message: 'An account with that email already exists.' }),
      } as Response)

      await expect(
        signup({ email: 'a@b.c', password: 'longenough' })
      ).rejects.toThrow('An account with that email already exists.')
    })
  })

  describe('login', () => {
    it('POSTs to /auth/login with email and password in body', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ token: 't', candidate: { _id: '123' } }),
      } as Response)

      await login({ email: 'a@b.c', password: 'longenough' })

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'a@b.c', password: 'longenough' }),
        })
      )
    })

    it('throws with the server message on a non-OK response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid email or password.' }),
      } as Response)

      await expect(
        login({ email: 'a@b.c', password: 'wrong' })
      ).rejects.toThrow('Invalid email or password.')
    })
  })

  describe('updateCandidate', () => {
    it('PATCHes to /candidates/:id/registration with body and Authorization header', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await updateCandidate(
        'abc123',
        { firstName: 'Jon', lastNames: 'Doe', phone: '555' },
        'tok',
      )

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/candidates/abc123/registration'),
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer tok',
          }),
          body: JSON.stringify({ firstName: 'Jon', lastNames: 'Doe', phone: '555' }),
        })
      )
    })
  })

  describe('testCandidate', () => {
    it('PATCHes to /candidates/:id/test with choices and Authorization header', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await testCandidate('abc123', ['a', 'b', 'c', 'd', 'a'], 'tok')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/candidates/abc123/test'),
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            Authorization: 'Bearer tok',
          }),
          body: JSON.stringify({ choices: ['a', 'b', 'c', 'd', 'a'] }),
        })
      )
    })
  })

  describe('fetchCandidate', () => {
    it('GETs /candidates/:id with Authorization header', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      } as Response)

      await fetchCandidate('abc123', 'tok')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/candidates/abc123'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer tok',
          }),
        }),
      )
    })

    it('throws with the status code on a non-OK response', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
      } as Response)

      await expect(fetchCandidate('abc123', 'tok')).rejects.toThrow('404')
    })
  })
})
