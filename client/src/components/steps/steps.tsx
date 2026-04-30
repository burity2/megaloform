import './steps.css'
import { Icon } from '@mdi/react'
import { icons } from '../../ui/icons'
import type { Candidate, Step } from '../../types'

type StepUI = {
  className: string
  icon: string | null
}

export function getStepUI(step: Step<string> | undefined): StepUI {
  if (!step) return { className: 'step step--loading', icon: null }
  if (step.access === 'locked') return { className: 'step step--locked', icon: icons.lock }
  if (step.currentStatus === 'failed') return { className: 'step step--failed', icon: null }
  if (step.currentStatus === 'passed') return { className: 'step step--passed', icon: null }
  return { className: 'step step--available', icon: null }
}

type StepsProps = {
  onCurrentStep: (step: string) => void
  steps: Candidate['steps'] | undefined
}

export default function Steps({ onCurrentStep, steps }: StepsProps) {
  const reg = getStepUI(steps?.registration)
  const test = getStepUI(steps?.test)
  const questions = getStepUI(steps?.reflectiveQuestions)
  const group = getStepUI(steps?.groupDynamic)
  const interview = getStepUI(steps?.finalInterview)
  const bootcamp: StepUI = { className: 'step step--locked', icon: icons.lock }

  return (
    <div id="dash-steps">
      <button className={reg.className} onClick={() => onCurrentStep('registration')}>
        {reg.icon && <Icon className='step-icon' path={reg.icon} size={1} />}<p className='step-name'>Registration</p>
      </button>

      <button className={test.className} onClick={() => onCurrentStep('test')}>
        {test.icon && <Icon className='step-icon' path={test.icon} size={1} />}<p className='step-name'>Test</p>
      </button>

      <button className={questions.className} onClick={() => onCurrentStep('questions')}>
        {questions.icon && <Icon className='step-icon' path={questions.icon} size={1} />}<p className='step-name'>Letter</p>
      </button>

      <button className={group.className} onClick={() => onCurrentStep('group-dynamic')}>
        {group.icon && <Icon className='step-icon' path={group.icon} size={1} />}<p className='step-name'>Group Dynamic</p>
      </button>

      <button className={interview.className} onClick={() => onCurrentStep('final-interview')}>
        {interview.icon && <Icon className='step-icon' path={interview.icon} size={1} />}<p className='step-name'>Final Interview</p>
      </button>

      <button className={bootcamp.className} onClick={() => onCurrentStep('bootcamp')}>
        {bootcamp.icon && <Icon className='step-icon' path={bootcamp.icon} size={1} />}<p className='step-name'>Training</p>
      </button>
    </div>
  )
}
