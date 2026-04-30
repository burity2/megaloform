import { render, screen } from '@testing-library/react'
import Register from '../components/steps/all-steps/register/register'

describe('Register', () => {
  it('renders the registration form when status is undefined', () => {
    render(<Register handleRegister={vi.fn()} registrationStatus={undefined} />)

    expect(screen.getByText('Registration:')).toBeInTheDocument()

    expect(screen.getByLabelText('NAME')).toBeInTheDocument()
    expect(screen.getByLabelText('SURNAME')).toBeInTheDocument()
    expect(screen.getByLabelText('PHONE')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('renders the registration form when status is pending', () => {
    render(<Register handleRegister={vi.fn()} registrationStatus="pending" />)
    expect(screen.getByLabelText('NAME')).toBeInTheDocument()
  })

  it('shows the confirmation message when status is submitted', () => {
    render(<Register handleRegister={vi.fn()} registrationStatus="submitted" />)

    expect(screen.getByText(/info submitted/i)).toBeInTheDocument()

    expect(screen.queryByLabelText('NAME')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument()
  })

  it('shows the confirmation message when status is passed', () => {
    render(<Register handleRegister={vi.fn()} registrationStatus="passed" />)

    expect(screen.getByText(/info submitted/i)).toBeInTheDocument()
    expect(screen.queryByLabelText('NAME')).not.toBeInTheDocument()
  })
})
