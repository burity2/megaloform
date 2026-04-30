import { render, screen } from '@testing-library/react'
import Test from '../components/steps/all-steps/test/test'

describe('Test (quiz)', () => {
  it('renders the quiz when testStatus is undefined', () => {
    render(<Test handleTest={vi.fn()} testStatus={undefined} username="Alice" />)

    expect(screen.getByText(/what is your name/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('renders the quiz when testStatus is pending', () => {
    render(<Test handleTest={vi.fn()} testStatus="pending" username="Alice" />)
    expect(screen.getByText(/what is your name/i)).toBeInTheDocument()
  })

  it('shows the failed message when testStatus is failed', () => {
    render(<Test handleTest={vi.fn()} testStatus="failed" username="Alice" />)

    expect(screen.getByText(/your answers didn't pass/i)).toBeInTheDocument()
    expect(screen.queryByText(/what is your name/i)).not.toBeInTheDocument()
  })

  it('shows the passed message when testStatus is passed', () => {
    render(<Test handleTest={vi.fn()} testStatus="passed" username="Alice" />)

    expect(screen.getByText(/congratulations/i)).toBeInTheDocument()
    expect(screen.queryByText(/what is your name/i)).not.toBeInTheDocument()
  })

  it('renders the username as option (a) of question 1', () => {
    render(<Test handleTest={vi.fn()} testStatus={undefined} username="Alice" />)

    const aliceOption = screen.getByRole('radio', { name: 'Alice' })

    expect(aliceOption).toHaveAttribute('name', 'q1')
    expect(aliceOption).toHaveAttribute('value', 'a')
  })
})
