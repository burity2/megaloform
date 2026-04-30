import './register.css'
import type { RegistrationStatus } from '../../../../types'

type RegisterProps = {
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => void
  registrationStatus: RegistrationStatus | undefined
}

export default function Register({ handleRegister, registrationStatus }: RegisterProps) {
  if (registrationStatus === 'submitted' || registrationStatus === 'passed') {
    return (
      <p className='step-finished'>Info submitted! <br /> You can close this window and continue to the next step.</p>
    )
  }

  return (
    <div id="register-container">
      <div id="register-form">
        <div id="form-title">
          <p className="data-form-title">Registration:</p>
        </div>
        <div id="form-body">
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="firstName">NAME</label>
              <input type="text" name="firstName" id="firstName" required />
            </div>
            <div className="form-group">
              <label htmlFor="lastNames">SURNAME</label>
              <input type="text" name="lastNames" id="lastNames" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">PHONE</label>
              <input type="tel" name="phone" id="phone" required />
            </div>
            <input type="submit" name="register-submit" id="register-submit" value="submit" />
          </form>
        </div>
      </div>
    </div>
  )
}
