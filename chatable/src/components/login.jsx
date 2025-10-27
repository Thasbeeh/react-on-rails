import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import appLogo from '../assets/appLogo.png';
import ShinyText from './animations/ShinyText';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastContainer, toast, Bounce } from 'react-toastify';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <ToastContainer
        position="top-center" autoClose={4000} hideProgressBar newestOnTop={false}
        closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"
      />
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
          {isSignUp ?
            (<SignUpForm setIsSignUp={setIsSignUp} navigate={navigate}/>) :
            (<LoginForm setIsSignUp={setIsSignUp} navigate={navigate}/>)
          }
        </div>
      </div>
      <footer>
        Developed by&nbsp;<b><a href="https://github.com/Thasbeeh" target="_blank">Thasbeeh</a></b> <br />
      </footer>
    </div>
  );
}

function LoginForm({ setIsSignUp, navigate }) {
  const loginSchema = z.object({
    email: z.email("Email is required"),
    password: z.string().min(1, "Password is required")
  });

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/v1/login`,
        { user: { email: data.email, password: data.password } },
        { headers: { 'Content-Type': 'application/json' } }
      ).then((response) => {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.data.user));
        navigate('/chats');
      }).catch((error) => {
        toast.error(error.response.data.error);
      });
  };

  return (
    <div className="login-form-container">
      <form className='input-field-containers' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" placeholder="Email" className="login-username" {...register("email")}/>
          { errors.email && <small>{errors.email.message}</small> }
        </div>
        <div>
          <input type="password" placeholder="Password" {...register("password")}/>
          { errors.password && <small className='validation-messages'>{errors.password.message}</small> }
        </div>
        <input type="submit" value="Login" className="primaryButtonColor login-form-container-button"/>
      </form>
      <hr />
      <button className="secondaryButtonColor login-form-container-button" onClick={() => setIsSignUp(true)}>Sign up</button>
    </div>
  );
}

function SignUpForm({ setIsSignUp, navigate }) {
  const signUpSchema = z.object({
    username: z.string().min(1, "Username is required"),
    email: z.email("Email is required"),
    password: z.string().min(4, "Password must be at least 4 characters"),
    passwordConfirmation: z.string().min(1, "Password confirmation is required"),
  }).refine((data) =>
    data.password === data.passwordConfirmation,
    { message: "Passwords do not match", path: ["passwordConfirmation"] }
  );

  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: zodResolver(signUpSchema) });

  const onSubmit = (data) => {
    console.log("Form submitted")
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/v1/users`,
        { user: { username: data.username, email: data.email,
                  password: data.password, passwordConfirmation: data.passwordConfirmation
                } },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((response) => {
        toast.success(response.data.message);
        reset();
        setIsSignUp(false);
      })
      .catch((error) => {
        console.log(error)
      });
  };

  return (
    <div className="login-form-container">
      <form className='input-field-containers' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input type="text" className="login-username" placeholder="Username" {...register("username")}/>
          { errors.username && <small>{errors.username.message}</small> }
        </div>
        <div>
          <input type="email" placeholder="Email" {...register("email")}/>
          { errors.email && <small>{errors.email.message}</small> }
        </div>
        <div>
          <input type="password" placeholder="Password" {...register("password")}/>
          { errors.password && <small>{errors.password.message}</small> }
        </div>
        <div>
          <input type="password" placeholder="Password Confirmation" {...register("passwordConfirmation")}/>
          { errors.passwordConfirmation && <small>{errors.passwordConfirmation.message}</small> }
        </div>
        <input type="submit" value="Sign Up" className="primaryButtonColor login-form-container-button"/>
      </form>
      <hr />
      <button className="secondaryButtonColor login-form-container-button" onClick={() => setIsSignUp(false)}>Login</button>
    </div>
  );
}
