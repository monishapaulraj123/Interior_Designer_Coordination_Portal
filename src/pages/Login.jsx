import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MdOutlineMailOutline,
  MdOutlineLock,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdSchool
} from 'react-icons/md'
import { FcGoogle } from 'react-icons/fc'
import { ThemeContext } from '../context/ThemeContext.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { loginHeroImage } from '../assets/images/index.js'

export default function Login() {
  // useContext: reuses the same language strings as the rest of the app,
  // and the login()/isAuthenticated helpers from AuthContext.
  const { t } = useContext(ThemeContext)
  const { login, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  // useState: controlled form fields, the "show password" toggle, the
  // "remember me" checkbox, and any error. There is no role tab anymore —
  // the role is determined entirely by which demo account's email/password
  // matches (see AuthContext.login).
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')

  // useRef: direct handle to the email <input> DOM node so it can be
  // focused automatically without causing an extra re-render.
  const emailInputRef = useRef(null)

  // useEffect: as soon as the Login page mounts, move keyboard focus into
  // the email field. Also, if someone is already logged in (e.g. they
  // typed /login manually), send them straight to the dashboard instead
  // of showing the form again.
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
      return
    }
    emailInputRef.current?.focus()
  }, [isAuthenticated, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    // .trim() guards against accidental leading/trailing spaces from
    // autofill or a stray keystroke silently breaking the demo login.
    const matchedUser = login(email.trim(), password.trim())
    if (!matchedUser) {
      setError(t.invalidCredentials)
      return
    }
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="login-page">
      <div className="login-hero" style={{ backgroundImage: `url(${loginHeroImage})` }}>
        <div className="login-hero-overlay">
          <div className="login-hero-brand">
            <div className="login-hero-brand-icon">
              <MdSchool />
            </div>
            <span>IDCP Portal</span>
          </div>

          <div className="login-hero-copy">
            <h1>
              {t.heroTitleLine1}
              <br />
              {t.heroTitleLine2}
            </h1>
            <p className="login-hero-tagline">{t.portalTagline}</p>

            <ul className="login-hero-features">
              <li>
                <span className="login-hero-check">
                  <MdCheckCircle />
                </span>
                {t.heroFeature1}
              </li>
              <li>
                <span className="login-hero-check">
                  <MdCheckCircle />
                </span>
                {t.heroFeature2}
              </li>
              <li>
                <span className="login-hero-check">
                  <MdCheckCircle />
                </span>
                {t.heroFeature3}
              </li>
            </ul>
          </div>

          <p className="login-hero-footer">{t.craftingTagline}</p>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-card">
          <h2>{t.loginWelcomeTitle}</h2>
          <p className="login-card-subtitle">{t.loginSubtitle}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-field full-width">
              <label>{t.emailLabel}</label>
              <div className="login-input-group">
                <MdOutlineMailOutline />
                <input
                  ref={emailInputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@idcp.com"
                  required
                />
              </div>
            </div>

            <div className="form-field full-width">
              <label>{t.passwordLabel}</label>
              <div className="login-input-group">
                <MdOutlineLock />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? t.toggleToLight : t.toggleToDark}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            {error && <span className="form-error">{error}</span>}

            <div className="login-row-between">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {t.rememberMe}
              </label>
              <a href="#forgot-password" className="login-forgot-link" onClick={(e) => e.preventDefault()}>
                {t.forgotPassword}
              </a>
            </div>

            <button type="submit" className="btn-primary login-submit-btn">
              {t.loginButton}
            </button>
          </form>

          <div className="login-divider">
            <span>{t.orDivider}</span>
          </div>

          <button type="button" className="btn-secondary login-google-btn">
            <FcGoogle /> {t.continueWithGoogle}
          </button>

          <p className="login-footer-text">{t.loginFooter}</p>
        </div>
      </div>
    </div>
  )
}
