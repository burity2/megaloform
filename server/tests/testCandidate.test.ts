import { describe, it, expect, vi, beforeEach } from 'vitest'
import { testCandidate } from '../controller'
import Candidate from '../model'
import { mockCandidateId, mockCandidate } from './fixtures'

vi.mock('../model', () => ({
  default: {
    findByIdAndUpdate: vi.fn(),
  },
}))

const mockRes = () => {
  const res = {} as any
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

const mockReq = (id: string, choices: unknown) => ({
  params: { id },
  body: { choices },
}) as any

describe('testCandidate controller', () => {
  beforeEach(() => vi.clearAllMocks())

  // --- Input validation ---

  it('returns 400 if choices is not an array', async () => {
    const res = mockRes()
    await testCandidate(mockReq(mockCandidateId, 'not-an-array'), res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('returns 400 if choices has wrong length', async () => {
    const res = mockRes()
    await testCandidate(mockReq(mockCandidateId, ['a', 'b']), res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('returns 400 if any choice is empty', async () => {
    const res = mockRes()
    await testCandidate(mockReq(mockCandidateId, ['a', '', 'c', 'd', 'a']), res)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  // --- Candidate not found ---

  it('returns 404 if candidate does not exist', async () => {
    vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(null)
    const res = mockRes()
    await testCandidate(mockReq(mockCandidateId, ['a', 'b', 'c', 'd', 'a']), res)
    expect(res.status).toHaveBeenCalledWith(404)
  })

  // --- Scoring: all correct ---

  it('scores 10 and passes on all correct answers', async () => {
    vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(mockCandidate as any)
    const res = mockRes()
    await testCandidate(mockReq(mockCandidateId, ['a', 'b', 'c', 'd', 'a']), res)
    expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCandidateId,
      expect.objectContaining({
        $set: expect.objectContaining({
          'steps.test.score': 10,
          'steps.test.currentStatus': 'passed',
          'steps.reflectiveQuestions.access': 'available',
        }),
      }),
      expect.any(Object)
    )
    expect(res.status).toHaveBeenCalledWith(200)
  })

  // --- Scoring: all wrong ---

  it('scores 0 and fails on all wrong answers', async () => {
    vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(mockCandidate as any)
    const res = mockRes()
    await testCandidate(mockReq(mockCandidateId, ['d', 'a', 'b', 'c', 'd']), res)
    expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCandidateId,
      expect.objectContaining({
        $set: expect.objectContaining({
          'steps.test.score': 0,
          'steps.test.currentStatus': 'failed',
          'steps.reflectiveQuestions.access': 'locked',
        }),
      }),
      expect.any(Object)
    )
    expect(res.status).toHaveBeenCalledWith(200)
  })

  // --- Scoring: boundary pass (3 correct = score 6) ---

  it('passes at the boundary of 3 correct answers (score 6)', async () => {
    vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(mockCandidate as any)
    const res = mockRes()
    // Correct: q1=a, q2=b, q5=a — wrong: q3, q4
    await testCandidate(mockReq(mockCandidateId, ['a', 'b', 'x', 'x', 'a']), res)
    expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCandidateId,
      expect.objectContaining({
        $set: expect.objectContaining({
          'steps.test.score': 6,
          'steps.test.currentStatus': 'passed',
        }),
      }),
      expect.any(Object)
    )
  })

  // --- Scoring: boundary fail (2 correct = score 4) ---

  it('fails just below the boundary with 2 correct answers (score 4)', async () => {
    vi.mocked(Candidate.findByIdAndUpdate).mockResolvedValue(mockCandidate as any)
    const res = mockRes()
    // Correct: q1=a, q2=b — wrong: q3, q4, q5
    await testCandidate(mockReq(mockCandidateId, ['a', 'b', 'x', 'x', 'x']), res)
    expect(Candidate.findByIdAndUpdate).toHaveBeenCalledWith(
      mockCandidateId,
      expect.objectContaining({
        $set: expect.objectContaining({
          'steps.test.score': 4,
          'steps.test.currentStatus': 'failed',
        }),
      }),
      expect.any(Object)
    )
  })
})
