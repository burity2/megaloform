import { getStepUI } from '../components/steps/steps'
import { icons } from '../ui/icons'

describe('getStepUI', () => {
  it('returns loading state when step is undefined', () => {
    expect(getStepUI(undefined)).toEqual({
      className: 'step step--loading',
      icon: null,
    })
  })

  it('returns locked state with lock icon when access is locked', () => {
    expect(getStepUI({ access: 'locked', currentStatus: 'pending' })).toEqual({
      className: 'step step--locked',
      icon: icons.lock,
    })
  })

  it('returns failed state when status is failed', () => {
    expect(getStepUI({ access: 'available', currentStatus: 'failed' })).toEqual({
      className: 'step step--failed',
      icon: null,
    })
  })

  it('returns passed state when status is passed', () => {
    expect(getStepUI({ access: 'available', currentStatus: 'passed' })).toEqual({
      className: 'step step--passed',
      icon: null,
    })
  })

  it('returns available state for an available step that is still pending', () => {
    expect(getStepUI({ access: 'available', currentStatus: 'pending' })).toEqual({
      className: 'step step--available',
      icon: null,
    })
  })

  it('locked access takes precedence over a failed status', () => {
    expect(getStepUI({ access: 'locked', currentStatus: 'failed' })).toEqual({
      className: 'step step--locked',
      icon: icons.lock,
    })
  })
})
