export type StepAccess = 'available' | 'locked'

export type RegistrationStatus = 'pending' | 'submitted' | 'passed' | 'failed'
export type TestStatus = 'unavailable' | 'pending' | 'submitted' | 'passed' | 'failed'
export type GenericStepStatus = 'unavailable' | 'pending' | 'submitted' | 'passed' | 'failed'

export type Step<S extends string> = {
  access: StepAccess
  currentStatus: S
}

export type Notification = {
  type: 'success' | 'warning' | 'info'
  text: string
  createdAt: string
  read: boolean
}

export type Candidate = {
  _id: string
  profile: {
    email: string
    firstName: string
    lastNames: string
    phone: string
  }
  isApproved: boolean
  steps: {
    registration: Step<RegistrationStatus>
    test: Step<TestStatus>
    reflectiveQuestions: Step<GenericStepStatus>
    groupDynamic: Step<GenericStepStatus>
    finalInterview: Step<GenericStepStatus>
  }
  notifications: Notification[]
}

export type LoginInput = {
  email: string
  password: string
}

export type RegistrationInput = {
  firstName: string
  lastNames: string
  phone: string
}
