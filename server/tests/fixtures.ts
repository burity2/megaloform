import mongoose from 'mongoose'

export const mockCandidateId = new mongoose.Types.ObjectId().toString()

export const mockCandidate = {
  _id: mockCandidateId,
  profile: {
    email: 'test@example.com',
    firstName: 'Test',
    lastNames: 'User',
    phone: '555-0100',
  },
  isApproved: false,
  passwordHash: 'hashed',
  steps: {
    registration: { access: 'available', currentStatus: 'passed' },
    test: { access: 'available', currentStatus: 'pending', choices: [], score: 0 },
    reflectiveQuestions: { access: 'locked', currentStatus: 'unavailable' },
    groupDynamic: { access: 'locked', currentStatus: 'unavailable' },
    finalInterview: { access: 'locked', currentStatus: 'unavailable' },
  },
  notifications: [],
}
