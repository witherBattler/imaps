import {SearchBarMaps, MapsChoiceContainer} from "../index.js"
import {get, post} from "../util.js"
import { lightTheme } from "../constants.js"
import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import { TextField, Button } from "@mui/material"
import Clear from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';


export default function Dashboard(props) {
  const routeParams = useParams()
  const [userData, setUserData] = useState(null)
  let defaultStage = "hub"
  if(routeParams.stage) {
    if(routeParams.stage == "learn" || routeParams.stage == "community") {
      defaultStage = routeParams.stage
    } else {
      window.history.pushState(null, "", "/dashboard")
    }
  }
  
  const [stage, setStage] = useState(defaultStage)
  

  useEffect(() => {
    get("/self-data").then(function(selfData) {
      if(selfData != "Not logged in/session ID invalid.") {
        setUserData(JSON.parse(selfData))
      } else {
        window.location = "/login"
      }
    })
  }, [])

  return <div id="dashboard">
    <link rel="stylesheet" href="dashboard.css"></link>
    <TopBar userData={userData}></TopBar>
    <div id="bottom">
      <div id="side-bar">
        <button className={stage == "hub" ? "selected" : null} onClick={function() {
          window.history.pushState(null, "", "/dashboard")
          setStage("hub")
        }}>
          <img src="icons/hub.svg"/>
          <span>Hub</span>
        </button>
        <button className={stage == "learn" ? "selected" : null} onClick={function() {
          window.history.pushState(null, "", "/dashboard/learn")
          setStage("learn")
        }}>
          <img src="icons/learn.svg"/>
          <span>Learn</span>
        </button>
        <button className={stage == "community" ? "selected" : null} onClick={function() {
          window.history.pushState(null, "", "/dashboard/community")
          setStage("community")
        }}>
          <img src="icons/community.svg"/>
          <span>Community</span>
        </button>
      </div>
      <div id="content" className={stage}>
        {
          (() => {
            switch(stage) {
              case "hub":
                return <DashboardHub userData={userData}/>
              case "learn":
                return <DashboardLearn/>
              case "community":
                return <DashboardCommunity/>
              default:
                console.log("invalid stage:", stage)
                return null
            }
          })()
        }
      </div>
    </div>
  </div>
}

function DashboardHub({userData}) {
  let [chooseMapPopupShown, setChooseMapPopupShown] = useState(false)
  let [mapSearch, setMapSearch] = useState("")
  let [mapsData, setMapsData] = useState(null)
  let [selectedMap, setSelectedMap] = useState(null)
  let [mapChanges, setMapChanges] = useState({})

  useEffect(() => {
    if(userData && !mapsData) {
      get(`/maps?ids=${userData.maps.join(",")}`).then(mapsData => {
        console.log('this even get execut?')
        setMapsData(JSON.parse(mapsData))
      })
    }
  }, [userData])

  let secondaryToShow = null
  if(chooseMapPopupShown) {
    secondaryToShow = <ThemeProvider theme={lightTheme}>
      <div className="overlay">
        <div className="popup-content big" id="popup-choose-map">
          <div className="popup-header">
            Choose map
          </div>
          <SearchBarMaps setMapSearch={setMapSearch}></SearchBarMaps>
          <MapsChoiceContainer editMap={function(element) {
            post("/create-map", {
              map: element
            }).then(id => {
              window.location = `/edit-map/${id}`
            })
          }} search={mapSearch}></MapsChoiceContainer>
        </div>
      </div>
    </ThemeProvider>
  }
  if(selectedMap) {
    secondaryToShow = <ThemeProvider theme={lightTheme}>
      <div className="overlay">
        <div className="popup-content big" style={{display: "flex", flexDirection: "column"}}>
          <div className="popup-header" onClick={function() {
            window.open("/edit-map/" + selectedMap.id)
          }}>
            {selectedMap.name}
          </div>
          <div id="map-settings-content">
            <div className="column-1">
              <p className="section-title">General</p>
              <TextField label="Name" value={mapChanges.name || selectedMap.name} id="name-input" size="small" fullWidth variant="filled" onChange={function(event) {
                setMapChanges({
                  ...mapChanges,
                  name: event.target.value
                })
              }}></TextField>
              <p style={{fontFamily: "rubik", margin: "0px", marginTop: "5px", opacity: "0.9"}} className="subtitle">Recent colors</p>
              <div id="recent-colors">
                {console.log(selectedMap.recentColors)}
                {
                  selectedMap.recentColors.map(recentColor => {
                    let colorString = `rgba(${recentColor.r}, ${recentColor.g}, ${recentColor.b}, ${recentColor.a})`
                    return <div key={colorString} className="recent-color" style={{backgroundColor: colorString}}>
                      <div className="minus"/>
                    </div>
                  })
                }
              </div>
            </div>
            <div className="column-2">
            </div>
            <div className="column-3">
            </div>
          </div>
          <div id="map-settings-buttons">
            <Button startIcon={<CheckIcon></CheckIcon>} disabled={!Object.keys(mapChanges).length} style={{marginRight: "10px"}} variant="contained">
              Save
            </Button>
            <Button startIcon={<Clear></Clear>} variant="contained" style={{color: "black"}} color="error" onClick={function() {
              setMapChanges({})
              setSelectedMap(null)
            }}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  }
  return <>
    <h2 className="header">Maps</h2>
    <div id="projects-list">
      <div className="create-project" onClick={function() {
        if(userData) {
          setChooseMapPopupShown(true)
        }
      }}>
        <img src="icons/create-project-center.svg"/>
      </div>
      {
        mapsData
          ?
            mapsData.map(map => {
              let date = new Date(map.createdAt)
              let dateString = date.getFullYear() + "/" + (date.getMonth() + 1).toLocaleString("en-US", {minimumIntegerDigits: 2}) + "/" + date.getDay().toLocaleString("en-US", {minimumIntegerDigits: 2})
              return <div key={map.id} className="project">
                <div className="preview" dangerouslySetInnerHTML={{__html: map.preview}}/>
                <p className="title">{map.name}</p>
                <p className="creation-date">Created on {dateString}</p>
                <div className="buttons">
                  <button className="open" onClick={function() {
                    window.open("/edit-map/" + map.id)
                  }}>Open</button>
                  <button className="settings" onClick={function() {
                    setSelectedMap(map)
                  }}>Settings</button>
                </div>
              </div>
            })
          : null
      }
    </div>
    <h2 className="header">Tutorials</h2>
    <div id="tutorials-list">

    </div>
    { secondaryToShow }
  </>
}
export function TopBar({userData}) {
  return <div id="top-bar">
    {
      userData
        ? <div id="profile-container">
          <div id="profile-picture-container">
            {
              userData.profilePicture
                ? <img referrerPolicy="no-referrer" id="profile-picture" src={userData.profilePicture}/>
                : <p id="profile-letter">{userData.username[0]}</p>
            }
          </div>
          <div id="profile-text">
            <p id="profile-username">{userData.username}</p>
            {
              (() => {
                switch(userData.method) {
                  case "normal":
                    return <p id="profile-secondary-username">{userData.username}</p>
                  case "discord":
                    return <p id="profile-secondary-username">{userData.username + "#" + userData.tag}</p>
                  case "google":
                    return <p id="profile-secondary-username">{userData.email}</p>
                  default:
                    console.log(userData)
                }
              })()
            }
          </div>
          <div className="open-icon-container">
            <img src="icons/open.svg" className="open-icon"/>
          </div>
          
        </div>
        : null
    }
    <div className="right">
      <div id="search-bar-container">
        <div id="search-bar-inner-container">
          <img src="icons/search.svg"></img>
          <input id="search-bar" placeholder="Search for users and projects..."></input>
        </div>
      </div>
      <div className="icon-button-container">
        <img className="icon" src="icons/notification.svg"></img>
      </div>

    </div>
    
    
  </div>
}

function DashboardLearn() {

}

function DashboardCommunity() {

}