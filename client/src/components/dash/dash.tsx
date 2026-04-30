import './dash.css'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Steps from '../steps/steps'
import Register from '../steps/all-steps/register/register'
import Test from '../steps/all-steps/test/test'
import { updateCandidate, testCandidate } from '../../services/candidate-input'
import { useAuth } from '../../auth/AuthContext'
import profilePic from '../../assets/profile-pic.png'
import logo from '../../assets/logo-bw.webp'
import { Icon } from '@mdi/react'
import { icons } from '../../ui/icons'

export default function Dashboard() {
  const { candidate, token, setCandidate, logout } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState<string | null>(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/login', { replace: true })
  }

  if (!candidate || !token) return null

  const id = candidate._id

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const firstName = (form.elements.namedItem('firstName') as HTMLInputElement).value.trim()
    const lastNames = (form.elements.namedItem('lastNames') as HTMLInputElement).value.trim()
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()

    if (!firstName || !lastNames) {
      alert('Must insert valid name!')
      return
    }
    if (!phone) {
      alert('Must insert valid phone!')
      return
    }

    try {
      const registered = await updateCandidate(id, { firstName, lastNames, phone }, token!)
      setCandidate(registered)
      form.reset()
    } catch (err) {
      console.log(err)
    }
  }

  async function handleTest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const choices = ['q1', 'q2', 'q3', 'q4', 'q5'].map(
      n => (form.elements.namedItem(n) as HTMLInputElement).value
    )

    if (choices.some(c => !c)) {
      alert('All questions should be answered!')
      return
    }

    try {
      const tested = await testCandidate(id, choices, token!)
      setCandidate(tested)
      form.reset()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div id='dash-container'>
        <div id="dash-side-menu">
          <div id="user">
            <div className='user-icons'><img id="user-img" src={profilePic} alt="" /></div>
            <p id="username">{
              candidate?.profile?.firstName ? `Hello, ${candidate.profile.firstName}!` : 'Welcome to PS2027!'
            }</p>
          </div>
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              type="button"
              id="config"
              className='user-icons'
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Icon path={icons.menu} size={1.5} />
            </button>
            {menuOpen && (
              <div
                role="menu"
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: '0.5rem',
                  background: 'var(--bg-medium)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '0.5rem',
                  padding: '0.25rem',
                  minWidth: '8rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  zIndex: 10,
                }}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    background: 'transparent',
                    color: 'inherit',
                    border: 'none',
                    borderRadius: '0.25rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.95rem',
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
        <div id="dash-main">
          <div id="dash-header">
            <img id='logo-side-menu' src={logo} alt="" />
            <div id='header-icons'>
              <div id="notifications" className='user-icons'><Icon path={icons.bell} size={1.5} /></div>
              <div id="warning" className='user-icons'><Icon path={icons.alert} size={1.5} /></div>
            </div>
          </div>
          <div id="main-content">
            {currentStep === null ? (
              <Steps onCurrentStep={setCurrentStep} steps={candidate?.steps} />
            ) : (
              <div id="dash-step">
                <button id='close-btn' onClick={() => setCurrentStep(null)}><Icon path={icons.close} size={1.5} /></button>
                {currentStep === 'registration' && <Register handleRegister={handleRegister} registrationStatus={candidate?.steps?.registration?.currentStatus} />}
                {currentStep === 'test' && <Test handleTest={handleTest} testStatus={candidate?.steps?.test?.currentStatus} username={candidate?.profile?.firstName} />}
                {!['registration', 'test'].includes(currentStep) && (
                  <p className="step-coming-soon">This step is coming soon.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
