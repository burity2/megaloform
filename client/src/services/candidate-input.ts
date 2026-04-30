import type { Candidate, LoginInput, RegistrationInput } from '../types'

const API = import.meta.env.VITE_API_URL

export type AuthResponse = {
  token: string
  candidate: Candidate
}

function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` }
}

export async function signup(input: LoginInput): Promise<AuthResponse> {
  const res = await fetch(`${API}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (res.ok) return res.json() as Promise<AuthResponse>
  const body = await res.json().catch(() => ({ message: `Signup failed (${res.status})` }))
  throw new Error(body.message ?? `Signup failed (${res.status})`)
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (res.ok) return res.json() as Promise<AuthResponse>
  const body = await res.json().catch(() => ({ message: `Login failed (${res.status})` }))
  throw new Error(body.message ?? `Login failed (${res.status})`)
}

export async function updateCandidate(
  candidateId: string,
  dataInput: RegistrationInput,
  token: string,
): Promise<Candidate> {
  const res = await fetch(`${API}/candidates/${candidateId}/registration`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(dataInput),
  })
  if (res.ok) return res.json() as Promise<Candidate>
  throw new Error(`Failed to register user: error ${res.status}`)
}

export async function testCandidate(
  candidateId: string,
  choices: string[],
  token: string,
): Promise<Candidate> {
  const res = await fetch(`${API}/candidates/${candidateId}/test`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify({ choices }),
  })
  if (res.ok) return res.json() as Promise<Candidate>
  throw new Error(`Failed to test user: error ${res.status}`)
}

export async function fetchCandidate(candidateId: string, token: string): Promise<Candidate> {
  const res = await fetch(`${API}/candidates/${candidateId}`, {
    headers: { ...authHeader(token) },
  })
  if (!res.ok) throw new Error(`Failed to fetch candidate: ${res.status}`)
  return res.json() as Promise<Candidate>
}
