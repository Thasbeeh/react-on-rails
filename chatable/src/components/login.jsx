import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import appLogo from '../assets/appLogo.png';
import ShinyText from './animations/ShinyText';

function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className='row-container'>
        <div className="left-half">
          <img src={appLogo} alt="App Logo" />
          <ShinyText
            text={
              <>
                Instant messages that just work: <br />
                React frontend magic meets <br />
                Rails backend reliability, <br />
                via ActionCable.
              </>
            }
            disabled={false}
            speed={3}
            className='shiny-text-custom'
          />
        </div>
        <div className="right-half">
          {isSignUp ? (
            <SignUpForm
              username={username}
              email={email}
              password={password}
              passwordConfirmation={passwordConfirmation}
              setUsername={setUsername}
              setEmail={setEmail}
              setPassword={setPassword}
              setPasswordConfirmation={setPasswordConfirmation}
              setIsSignUp={setIsSignUp}
              navigate={navigate}
            />
          ) : (
            <LoginForm
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              setIsSignUp={setIsSignUp}
              navigate={navigate}
            />
          )}
        </div>
      </div>
      <footer>
        Developed by&nbsp;<b><a href="https://github.com/Thasbeeh" target="_blank">Thasbeeh</a></b> <br />
      </footer>
    </div>
  );
}

export default Login;

function LoginForm({ username, password, setUsername, setPassword, setIsSignUp, navigate }) {
	const handleLogin = (event) => {
    event.preventDefault();
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/v1/login`, {
        user: { username, password },
      })
      .then((response) => {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
        navigate('/chats');
      })
      .catch((error) => {
        console.log(error);
        console.log(import.meta.env.VITE_API_URL)
        console.log('Login failed. Please check your credentials.');
      });

  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleLogin}>
        <input type="text" value={username} placeholder="User name" onChange={(e) => setUsername(e.target.value)} />
        <br />
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button className="primaryButtonColor" type="submit">Login</button>
      </form>
      <hr />
      <button className="secondaryButtonColor" onClick={() => setIsSignUp(true)}>Sign up</button>
    </div>
  );
}

function SignUpForm({ username, email, password, passwordConfirmation, setPasswordConfirmation, setUsername, setEmail, setPassword, setIsSignUp, navigate }) {
	const handleSignUp = (event) => {
    event.preventDefault();
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
        user: { username, email, password, passwordConfirmation },
      })
      .then((response) => {
				alert("User created");
				setUsername('');
				setEmail('');
				setPassword('');
				setPasswordConfirmation('');
        navigate('/');
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className="login-form-container">
        <form onSubmit={handleSignUp}>
          <input type="text" className="login-username" value={username} placeholder="User name" onChange={(e) => setUsername(e.target.value)} />
          <br />
          <input type="text" value={email} placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
          <br />
          <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <br />
          <input type="password" value={passwordConfirmation} placeholder="Password Confirmation" onChange={(e) => setPasswordConfirmation(e.target.value)} />
          <br />
          <button type="submit" className="primaryButtonColor">Sign Up</button>
        </form>
        <hr />
        <button className="secondaryButtonColor" onClick={() => setIsSignUp(false)}>Log in</button>
      </div>
    </>
  );
}
