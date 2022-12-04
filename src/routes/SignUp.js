import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import fetch from "node-fetch"
import { serverLocation, discordOauth2UrlSignUp } from "../constants.js"
import {post} from "../index.js"

import "../login.css"



function SignUpWithGoogle() {
  const login = useGoogleLogin({
    onSuccess: async data => {
      let sessionId = await post("/sign-up", {
        method: "google",
        access_token: data.access_token
      })
      localStorage.setItem("sessionId", sessionId)
    }
  })

  return <img onClick={() => login()} style={{backgroundColor: "white"}} src="https://content.stocktrak.com/wp-content/uploads/2016/10/google-logo.png"></img>
}

function SignUpWithDiscord() {
  const login = function() {
    window.open(discordOauth2UrlSignUp, "_self")
  }

  return <img onClick={login} style={{backgroundColor: "#5765F2"}} src="icons/discord.svg"></img>
}

export default function SignUp() {
  return <GoogleOAuthProvider clientId="850241591522-8eh7ghm3g99tcue9cc9lc5v94d515022.apps.googleusercontent.com">
    <div id="background">
      <div className="left">
        <div className="content">
          <p className="title">Sign up</p>
          <TextField style={{fontFamily: "rubik"}} label="Username" variant="standard" fullWidth InputProps={{
            endAdornment: <InputAdornment position="start">
              <AccountBoxIcon></AccountBoxIcon>
            </InputAdornment>
          }}></TextField>
          <TextField style={{marginTop: "15px", fontFamily: "rubik"}} label="Password" variant="standard" fullWidth InputProps={{
            style: {fontFamily: "rubik"},
            endAdornment: <InputAdornment position="start">
              <KeyIcon></KeyIcon>
            </InputAdornment>
          }}></TextField>
          <Button style={{marginTop: "10px", fontFamily: "rubik"}} variant="contained" fullWidth>SIGN IN</Button>
          <div id="login-with">
            <SignUpWithGoogle></SignUpWithGoogle>
            <img style={{backgroundColor: "white"}} src="https://www.freepnglogos.com/uploads/apple-logo-png/apple-logo-png-dallas-shootings-don-add-are-speech-zones-used-4.png"></img>
            <img style={{background: "linear-gradient(to right, rgb(236, 146, 35) 0%, rgb(177, 42, 160) 50%, rgb(105, 14, 224) 100%)"}} src="icons/instagram.svg"></img>
            <SignUpWithDiscord></SignUpWithDiscord>
          </div>
        </div>
      </div>
      <div className="right">
        <img src="logo-globe.svg"></img>
        <h1>Welcome to Periphern!</h1>
        <p>If you already have an account, sign in instead!</p>
        <a href="/login">Sign in</a>
      </div>
    </div>
  </GoogleOAuthProvider>
}