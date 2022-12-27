import {IconButton, Button} from '@mui/material';
import {useRef} from "react"
import MenuIcon from '@mui/icons-material/Menu';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';


export default function Download() {
  const navbarRef = useRef()

  return <>
    <link rel="stylesheet" href="download.css"></link>
    <div id="background-download">
      <div id="introduction">
        <div className="content-row">
          <div id="navbar" ref={navbarRef}>
            <div className="content-row" id="navbar-content-row">
              <img src="./logo.svg"/>
              <div id="navbar-buttons">
                <a href="/download">Download</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/login">Login</a>
              </div>
              <IconButton id="menu-icon" style={{width: "60px", height: "60px"}}>
                <MenuIcon></MenuIcon>
              </IconButton>
            </div>
          </div>
          <div className="title">
            Start using Periphern the <span className="important">better</span> way.
          </div>
          <div className="subtitle">
            Download the Periphern on your device and get a more stable version of the app!
          </div>
        </div>
      </div>
      <img draggable="false" src="assets/curves/download-1.svg" class="curve"></img>
      <div className="content-row" id="download-content">
        <div className="title">
          Desktop download
        </div>
        <Button size="large" variant="contained" style={{backgroundColor: "#00A1FF", marginTop: "10px"}} className="download-button" startIcon={<DesktopWindowsIcon/>} onClick={function() {
          const link = document.createElement("a")
          link.download = "Periphern_Setup.exe"
          link.href = "downloads/Periphern_Setup.exe"
          link.click()
        }}>
          Download
        </Button>
      </div>
    </div>
  </>
}