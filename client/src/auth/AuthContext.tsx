import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Candidate } from '../types'
import { signup as signupService, login as loginService } from '../services/candidate-input'

type AuthContextValue = {
  token: string | null
  candidate: Candidate | null
  loading: boolean
  signup: (email: string, password: string) => Promise<Candidate>
  login: (email: string, password: string) => Promise<Candidate>
  logout: () => void
  setCandidate: (c: Candidate) => void
}

const STORAGE_TOKEN = 'mf_token'
const STORAGE_CANDIDATE = 'mf_candidate'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [candidate, setCandidateState] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_TOKEN)
      const c = localStorage.getItem(STORAGE_CANDIDATE)
      if (t && c) {
        setToken(t)
        setCandidateState(JSON.parse(c) as Candidate)
      }
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  function persist(t: string, c: Candidate) {
    setToken(t)
    setCandidateState(c)
    localStorage.setItem(STORAGE_TOKEN, t)
    localStorage.setItem(STORAGE_CANDIDATE, JSON.stringify(c))
  }

  async function signup(email: string, password: string) {
    const { token: t, candidate: c } = await signupService({ email, password })
    persist(t, c)
    return c
  }

  async function login(email: string, password: string) {
    const { token: t, candidate: c } = await loginService({ email, password })
    persist(t, c)
    return c
  }

  function logout() {
    setToken(null)
    setCandidateState(null)
    localStorage.removeItem(STORAGE_TOKEN)
    localStorage.removeItem(STORAGE_CANDIDATE)
  }

  function setCandidate(c: Candidate) {
    setCandidateState(c)
    localStorage.setItem(STORAGE_CANDIDATE, JSON.stringify(c))
  }

  const value = useMemo<AuthContextValue>(
    () => ({ token, candidate, loading, signup, login, logout, setCandidate }),
    [token, candidate, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
