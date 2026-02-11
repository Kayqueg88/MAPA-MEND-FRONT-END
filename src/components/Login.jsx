import { useState } from "react";
import "./Login.css";

function Login({ onLogin, loginError }) {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  function handleLogin(e){
    e.preventDefault();
    onLogin(email,password);
  }

  return(
    <div className="wrapper active-popup">

      <div className="caixa-box login">
        <h2>Login</h2>

        {loginError && (
          <p style={{color:"red",textAlign:"center"}}>
            {loginError}
          </p>
        )}

        <form onSubmit={handleLogin}>

          <div className="input-box">
            <input
              type="email"
              required
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input-box">
            <input
              type="password"
              required
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          <button className="btn">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;
