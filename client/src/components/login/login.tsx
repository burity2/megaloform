import './login.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/logo-color-w.png'
import loginImg from '../../assets/bg-imgs/login.png'
import { useAuth } from '../../auth/AuthContext'

type Mode = 'login' | 'signup'

export default function Login() {
  const navigate = useNavigate()
  const { login, signup } = useAuth()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Please fill in both email and password.')
      return
    }

    setSubmitting(true)
    try {
      const newCandidate = mode === 'signup'
        ? await signup(trimmedEmail, password)
        : await login(trimmedEmail, password)
      navigate(`/candidate/${newCandidate._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div id="login-container">
      <div id="img-container">
        <img className="bg-decoration" src={loginImg} alt="" aria-hidden="true" />

        <div id="art-div">
          <div id="eb-logo-container">
            <img id="eb-img" src={logo} alt="Ensina Brasil" />
          </div>
          <div id="art-txt">
            <h1 id="welcome-title">
              Welcome to Ensina Brasil's{" "}
              <span id="welcome-title-highlight">Admission Process</span>
            </h1>
            <p id="welcome-txt">
              Log in to access the admission process and track your Trainee journey
            </p>
          </div>
        </div>

        <div id="login-form">
          <div id="form-title">
            <h1 className="data-form-title">
              {mode === 'login' ? 'Access your account' : 'Create your account'}
            </h1>
            <p>Use your email and password to continue</p>
          </div>
          <div id="form-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">E-Mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="john.smith@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  minLength={mode === 'signup' ? 8 : 4}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p role="alert" style={{ color: '#ff6b6b', marginTop: '0.5rem' }}>
                  {error}
                </p>
              )}

              <p className="forgot">I forgot my password</p>
              <input
                type="submit"
                name="submit"
                id="submit"
                value={submitting ? 'Please wait…' : (mode === 'login' ? 'Log in' : 'Sign up')}
                disabled={submitting}
              />
            </form>
            <div id="divider">
              <span className="line"></span>
              <p id="divider-txt">or</p>
              <span className="line"></span>
            </div>
            <button type="button" id="google-enter-btn">
              <p>Login with Google</p>
            </button>
          </div>
          <p className="signup-prompt">
            {mode === 'login' ? (
              <>
                If you haven't created an account yet,{' '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setError(null); setMode('signup') }}
                >
                  click here to create it
                </a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); setError(null); setMode('login') }}
                >
                  click here to log in
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
