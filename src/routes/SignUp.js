import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import fetch from "node-fetch"
import { serverLocation, discordOauth2UrlSignUp } from "../constants.js"
import {post} from "../util.js"
import {useState} from "react"
import "../login.css"



function SignUpWithGoogle() {
  const login = useGoogleLogin({
    onSuccess: async data => {
      window.localStorage.clear()
      let sessionId = await post("/sign-up", {
        method: "google",
        access_token: data.access_token
      })
      if(sessionId == "Account with this email already exists.") {
        alert("Account with this email already exists.")
      } else {
        localStorage.setItem("sessionId", sessionId)
        window.location = "/dashboard"
      }
      
    }
  })

  return <img onClick={() => login()} style={{backgroundColor: "white"}} src="https://content.stocktrak.com/wp-content/uploads/2016/10/google-logo.png"></img>
}

function SignUpWithDiscord() {
  const login = function() {
    window.localStorage.clear()
    window.open(discordOauth2UrlSignUp, "_self")
  }

  return <img onClick={login} style={{backgroundColor: "#5765F2"}} src="icons/discord.svg"></img>
}

export default function SignUp() {
  const [usernameValue, setUsernameValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [requestPending, setRequestPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  function onButtonPress() {
    if(requestPending) {
      return
    }
    if(passwordValue.length < 6) {
      setErrorMessage("The length of your password has to be at least 6 characters.")
      return
    }
    if(usernameValue.length < 4) {
      setErrorMessage("The length of your username has to be at least 4 characters.")
      return
    }
    setErrorMessage("")
    setRequestPending(true)
    window.localStorage.clear()
    post("/sign-up", {
      method: "password",
      username: usernameValue,
      password: passwordValue
    }).then(value => {
      setRequestPending(false)
      if(value == "Username is taken.") {
        setErrorMessage("This username is already taken!")
      } else {
        window.localStorage.setItem("sessionId", value)
        window.location = "/dashboard"
      }
    })
  }

  return <GoogleOAuthProvider clientId="810830680892-nnfl3t1ctbcc9cgd0fh1dq5dsbnfj90s.apps.googleusercontent.com">
    <div id="background" className="mobile">
      <div className="top">
        <img src="logo-globe.svg"></img>
      </div>
      <div className="bottom">
        <div className="panel">
          <div className="title">Welcome!</div>
          <div className="subtitle">Register with username & password or continue with a social media.</div>
          <TextField style={{fontFamily: "rubik"}} label="Username" variant="standard" fullWidth InputProps={{
            endAdornment: <InputAdornment position="start">
              <AccountBoxIcon></AccountBoxIcon>
            </InputAdornment>
          }} onChange={function(event) {
            setUsernameValue(event.target.value)
          }}></TextField>
          <TextField style={{marginTop: "15px", fontFamily: "rubik"}} label="Password" variant="standard" fullWidth InputProps={{
            style: {fontFamily: "rubik"},
            endAdornment: <InputAdornment position="start">
              <KeyIcon></KeyIcon>
            </InputAdornment>
          }} onChange={function(event) {
            setPasswordValue(event.target.value)
          }}></TextField>
          <Button style={{marginTop: "10px", fontFamily: "rubik"}} variant="contained" fullWidth onClick={onButtonPress}>SIGN UP</Button>
          { errorMessage ? <p style={{color: "red", fontFamily: "rubik", margin: "0px", fontSize: "18px", textAlign: "center", marginTop: "5px", marginBottom: "-10px"}}>
            { errorMessage }
          </p> : null}
          <div id="login-with" style={{marginBottom: "10px"}}>
            <SignUpWithGoogle></SignUpWithGoogle>
            <SignUpWithDiscord></SignUpWithDiscord>
          </div>
        </div>
        <a href="/login">Sign in</a>
      </div>
    </div>
    <div id="background" className="normal">
      <div className="left">
        <div className="content">
          <p className="title">Sign up</p>
          <TextField style={{fontFamily: "rubik"}} label="Username" variant="standard" fullWidth InputProps={{
            endAdornment: <InputAdornment position="start">
              <AccountBoxIcon></AccountBoxIcon>
            </InputAdornment>
          }} onChange={function(event) {
            setUsernameValue(event.target.value)
          }}></TextField>
          <TextField style={{marginTop: "15px", fontFamily: "rubik"}} label="Password" variant="standard" fullWidth InputProps={{
            style: {fontFamily: "rubik"},
            endAdornment: <InputAdornment position="start">
              <KeyIcon></KeyIcon>
            </InputAdornment>
          }} onChange={function(event) {
            setPasswordValue(event.target.value)
          }}></TextField>
          <Button style={{marginTop: "10px", fontFamily: "rubik"}} variant="contained" fullWidth onClick={onButtonPress}>SIGN UP</Button>
          { errorMessage ? <p style={{color: "red", fontFamily: "rubik", margin: "0px", fontSize: "20px", textAlign: "center", marginTop: "5px"}}>
            { errorMessage }
          </p> : null}
          <div id="login-with">
            <SignUpWithGoogle></SignUpWithGoogle>
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