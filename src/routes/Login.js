import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import fetch from "node-fetch"
import { serverLocation, discordOauth2UrlLogin } from "../constants.js"
import React, { useState } from "react"
import {post} from "../util.js"

import "../login.css"



function LoginWithGoogle() {
  const login = useGoogleLogin({
    onSuccess: async data => {
      window.localStorage.clear()
      let sessionId = await post("/login", {
        method: "google",
        access_token: data.access_token
      })
      if(sessionId == "Account with this email wasn't found.") {
        alert("Account with this email wasn't found.")
      } else {
        localStorage.setItem("sessionId", sessionId)
        window.location = "/dashboard"
      }
      
    }
  })

  return <img onClick={() => login()} style={{backgroundColor: "white"}} src="https://content.stocktrak.com/wp-content/uploads/2016/10/google-logo.png"></img>
}



function LoginWithDiscord() {
  const login = function() {
    window.localStorage.clear()
    window.open(discordOauth2UrlLogin, "_self")
  }

  return <img onClick={login} style={{backgroundColor: "#5765F2"}} src="icons/discord.svg"></img>
}

export default function Login() {
  const [usernameValue, setUsernameValue] = useState("")
  const [passwordValue, setPasswordValue] = useState("")
  const [requestPending, setRequestPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  return <GoogleOAuthProvider clientId="810830680892-nnfl3t1ctbcc9cgd0fh1dq5dsbnfj90s.apps.googleusercontent.com">
    <div id="background" className="mobile">
      <div className="top">
        <img src="logo-globe.svg"></img>
      </div>
      <div className="bottom">
        <div className="panel">
          <div className="title">Welcome back!</div>
          <div className="subtitle">Sign in with username & password or continue with a social media.</div>
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
          <Button style={{marginTop: "10px", fontFamily: "rubik"}} variant="contained" fullWidth onClick={function() {
            if(requestPending) {
              return
            }
            setRequestPending(true)
            window.localStorage.clear()
            post("/login", {
              method: "password",
              username: usernameValue,
              password: passwordValue
            }).then(value => {
              setRequestPending(false)
              if(value == "Login details invalid.") {
                setErrorMessage("Login details invalid!")
              } else {
                window.localStorage.setItem("sessionId", value)
                window.location = "/dashboard"
              }
            })
          }}>SIGN IN</Button>
          { errorMessage ? <p style={{color: "red", fontFamily: "rubik", margin: "0px", fontSize: "20px", textAlign: "center", marginTop: "5px"}}>
            { errorMessage }
          </p> : null}
          <div id="login-with">
            <LoginWithGoogle></LoginWithGoogle>
            <LoginWithDiscord></LoginWithDiscord>
          </div>
        </div>
        <a href="/sign-up">Sign up</a>
      </div>
    </div>
    <div id="background" className="normal">
      <div className="left">
        <div className="content">
          <p className="title">Login</p>
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
          <Button style={{marginTop: "10px", fontFamily: "rubik"}} variant="contained" fullWidth onClick={function() {
            if(requestPending) {
              return
            }
            setRequestPending(true)
            window.localStorage.clear()
            post("/login", {
              method: "password",
              username: usernameValue,
              password: passwordValue
            }).then(value => {
              setRequestPending(false)
              if(value == "Login details invalid.") {
                setErrorMessage("Login details invalid!")
              } else {
                window.localStorage.setItem("sessionId", value)
                window.location = "/dashboard"
              }
            })
          }}>SIGN IN</Button>
          { errorMessage ? <p style={{color: "red", fontFamily: "rubik", margin: "0px", fontSize: "20px", textAlign: "center", marginTop: "5px"}}>
            { errorMessage }
          </p> : null}
          <div id="login-with">
            <LoginWithGoogle></LoginWithGoogle>
            <LoginWithDiscord></LoginWithDiscord>
          </div>
        </div>
      </div>
      <div className="right">
        <img src="logo-globe.svg"></img>
        <h1>Welcome back!</h1>
        <p>If you are new here, sign up instead!</p>
        <a href="/sign-up">Sign up</a>
      </div>
    </div>
  </GoogleOAuthProvider>
}