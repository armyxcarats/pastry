import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

import Loader from '../Layout/Loader'
import MetaData from '../Layout/MetaData';
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../actions/userActions'
import './Login.css'

const Login = () => {
    const { isAuthenticated, error, loading, user } = useSelector(state => state.auth)
    const location = useLocation()
    const registrationCredentials = location.state?.registrationCredentials
    const [email, setEmail] = useState(() => registrationCredentials?.email || '');
    const [password, setPassword] = useState(() => registrationCredentials?.password || '');
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (registrationCredentials) {
            navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
        }
    }, [location.pathname, location.search, navigate, registrationCredentials])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
    }

    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''

    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect ? `/${redirect}` : user?.role === 'admin' ? '/dashboard' : '/')
        }
    }, [isAuthenticated, navigate, redirect, user?.role])

    return (
        <>
            {loading ? <Loader /> : (
                <>
                    <MetaData title={'Login'} />

                    <main className="cookie-login-page">
                        <section className="cookie-login-story" aria-label="Welcome to Crumb and Co.">
                            <div className="cookie-login-story-copy">
                                <span className="cookie-login-kicker">A LITTLE SOMETHING, FRESHLY BAKED</span>
                                <h1>Your cookie break is waiting.</h1>
                                <p>Warm-from-the-oven favorites, made in small batches and ready to make your day.</p>
                                <span className="cookie-login-stamp">Baked with<br />a little joy</span>
                            </div>
                        </section>

                        <section className="cookie-login-panel" aria-labelledby="login_heading">
                            <Link to="/" className="cookie-login-wordmark">Crumb <span>&</span> Co.</Link>
                            <p className="cookie-login-overline">GOOD TO HAVE YOU BACK</p>
                            <h2 id="login_heading">Sign in</h2>
                            <p className="cookie-login-intro">Pick up where your next favorite treat begins.</p>

                            <form onSubmit={submitHandler}>
                                <div className="cookie-login-field">
                                    <label htmlFor="email_field">Email address</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        autoComplete="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="cookie-login-field">
                                    <div className="cookie-login-password-label">
                                        <label htmlFor="password_field">Password</label>
                                        <Link to="/password/forgot">Forgot password?</Link>
                                    </div>
                                    <input
                                        type="password"
                                        id="password_field"
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <p className="cookie-login-error" role="alert">{error}</p>}

                                <button id="login_button" type="submit" disabled={loading}>
                                    {loading ? 'Signing in...' : 'Sign in to your account'}
                                </button>
                            </form>

                            <p className="cookie-login-register">New to the bakery? <Link to="/register">Create an account</Link></p>
                        </section>
                    </main>


                </>
            )}
        </>
    )
}
export default Login
