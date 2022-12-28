import {SearchBarMaps, MapsChoiceContainer} from "../index.js"
import {get, post, hexToRgb} from "../util.js"
import { darkTheme, lightTheme, SlideUpTransition } from "../constants.js"
import React, {useState, useEffect} from "react"
import {useParams} from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import { Alert, AlertTitle, TextField, Button, Slider, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import CheckIcon from '@mui/icons-material/Check';
import { TerritoryFillPicker } from "../index.js"
import { decodeFill } from "../fill.js"
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PublishIcon from '@mui/icons-material/Publish';

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
      console.log(selfData)
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
  const [chooseMapPopupShown, setChooseMapPopupShown] = useState(false)
  const [mapSearch, setMapSearch] = useState("")
  const [mapsData, setMapsData] = useState(null)
  const [selectedMap, setSelectedMap] = useState(null)
  const [mapChanges, setMapChanges] = useState({})
  const [deleteSelectedMapAlertOpened, setDeleteSelectedMapAlertOpened] = useState(false)
  const [projectsListScroll, setProjectsListScroll] = useState(0)

  useEffect(() => {
    if(userData && !mapsData) {
      get(`/maps?ids=${userData.maps.join(",")}`).then(mapsData => {
        setMapsData(JSON.parse(mapsData))
      })
    }
  }, [userData])

  if(selectedMap) {
    console.log(selectedMap.effects.innerShadow.enabled)
  }

  console.log(projectsListScroll)

  let secondaryToShow = null
  function getSecondaryToShow() {
    if(chooseMapPopupShown) {
      return <ThemeProvider theme={lightTheme}>
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
      return <ThemeProvider theme={lightTheme}>
        <div className="overlay" onClick={function(event) {
          if(!document.getElementById("selected-map-popup").matches(":hover")) {
            setSelectedMap(null)
          }
        }}>
          <div id="selected-map-popup" className="popup-content big" style={{display: "flex", flexDirection: "column"}}>
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
                  {
                    (mapChanges.recentColors || selectedMap.recentColors).map((recentColor, index) => {
                      let colorString = `rgba(${recentColor.r}, ${recentColor.g}, ${recentColor.b}, ${recentColor.a})`
                      return <div key={colorString} className="recent-color" style={{backgroundColor: colorString}} onClick={function() {
                        setMapChanges({
                          ...mapChanges,
                          recentColors: (mapChanges.recentColors || selectedMap.recentColors).filter((element, index2) => {
                            if(index2 == index){
                              return false
                            }
                            return true
                          })
                        })
                      }}>
                        <div className="minus"/>
                      </div>
                    })
                  }
                  <div className="recent-color" id="add-recent-color" onClick={function() {
                    let color = prompt("Enter the HEX code of your color").replace("#", "")
                    if(/^([0-9a-f]{3}){1,2}$/i.test(color)) {
                      // yes hex
                      let rgb = hexToRgb(color)
                      setMapChanges({
                        ...mapChanges,
                        recentColors: [
                          ...(mapChanges.recentColors || selectedMap.recentColors),
                          {
                            ...rgb,
                            a: 1
                          }
                        ]
                      })
                    } else {
                      // no hex
                      alert("Invalid HEX code.")
                    }
                  }}>
                    <img src="icons/plus.svg" className="plus"></img>
                  </div>
                </div>
                <p style={{fontFamily: "rubik", margin: "0px", marginTop: "5px", opacity: "0.9"}} className="subtitle">Map outline</p>                
                <ThemeProvider theme={lightTheme}>
                  <TerritoryFillPicker lightTheme={true} recentColors={mapChanges.recentColors || selectedMap.recentColors} setRecentColors={function() {}} allowFlagFill={true} color={decodeFill((mapChanges?.defaultStyle?.outlineColor || selectedMap?.defaultStyle?.outlineColor))} onUpdate={function(fill) {
                    setMapChanges({
                      ...mapChanges,
                      defaultStyle: {
                        ...mapChanges.defaultStyle,
                        outlineColor: fill.encode()
                      }
                      
                    })
                  }}></TerritoryFillPicker>
                </ThemeProvider>
                <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                  <Slider value={(mapChanges?.defaultStyle?.outlineSize || selectedMap.defaultStyle.outlineSize)} style={{width: "230px"}} step={1} marks min={0} max={10} valueLabelDisplay="auto" onChange={function(event) {
                    setMapChanges({
                      ...mapChanges,
                      defaultStyle: {
                        ...mapChanges.defaultStyle,
                        outlineSize: event.target.value
                      }
                    })
                  }}/>
                </div>
                <p style={{fontFamily: "rubik", margin: "0px", marginTop: "5px", opacity: "0.9"}} className="subtitle">Effects</p>
                <FormControlLabel style={{marginTop: "-5px"}} control={
                  <Switch value={mapChanges?.effects?.innerShadow?.enabled === undefined ? selectedMap.effects.innerShadow.enabled : mapChanges.effects.innerShadow.enabled} onChange={function (event) {
                    setMapChanges(JSON.parse(JSON.stringify({
                      ...mapChanges,
                      effects: {
                        innerShadow: {
                          enabled: !(mapChanges?.effects?.innerShadow?.enabled === undefined ? selectedMap.effects.innerShadow.enabled : mapChanges.effects.innerShadow.enabled) // fuck react
                        },
                      }
                    })))
                  }}/>
                } label="Inner shadow"/>
                <p style={{fontFamily: "rubik", margin: "0px", marginTop: "5px", opacity: "0.9"}} className="subtitle">Actions</p>
                <Button color="error" startIcon={<DeleteIcon></DeleteIcon>} style={{marginTop: "2px"}} variant="contained" onClick={function() {
                  setDeleteSelectedMapAlertOpened(true)
                }}>
                  Delete
                </Button>
              </div>
              <div className="column-2">
                <p className="section-title">Share</p>
                <div id="copy-link">
                  <div id="copy-link-text">
                    https://www.periphern.com/view/{selectedMap.id}/
                  </div>
                  <div id="copy-link-button" onClick={async function() {
                    navigator.clipboard.writeText(document.getElementById("copy-link-text").innerText)
                  }}>
                    <ContentCopyIcon style={{color: "white", height: "50%"}}></ContentCopyIcon>
                  </div>
                </div>
                <p style={{fontFamily: "rubik", margin: "0px", marginTop: "5px", opacity: "0.9"}} className="subtitle">Manage access</p>
                <Button disabled={selectedMap.published} startIcon={selectedMap.published ? null : <PublishIcon></PublishIcon>} style={{marginTop: "2px"}} variant="contained" onClick={function() {
                  post("/publish-map", {
                    id: selectedMap.id
                  }).then(function(value) {
                    let newSelectedMap = {
                      ...selectedMap,
                      published: true
                    }
                    setSelectedMap(newSelectedMap)
                    mapsData = mapsData.map(map => {
                      if(map.id == selectedMap.id) {
                        return newSelectedMap
                      } else {
                        return map
                      }
                    })
                  })
                }}>
                  {selectedMap.published ? "Published" : "Publish"}
                </Button>
              </div>
              <div className="column-3">
                <p className="section-title">Description</p>
                <FormControl variant="filled" size="small" style={{width: "100%"}}>
                  <InputLabel id="select-category-label">Category</InputLabel>
                  <Select
                    labelId="select-category-label"
                    value={mapChanges.category || selectedMap.category || "none"}
                    defaultValue={"none"}
                    onChange={function(event) {
                      setMapChanges({
                        ...mapChanges,
                        category: event.target.value
                      })
                    }}
                  >
                    <MenuItem value="none">
                      None
                    </MenuItem>
                    <MenuItem value="politics">
                      Politics
                    </MenuItem>
                    <MenuItem value="travel">
                      Travel
                    </MenuItem>
                    <MenuItem value="trend">
                      Trend
                    </MenuItem>
                    <MenuItem value="geography">
                      Geography
                    </MenuItem>
                    <MenuItem value="culture">
                      Culture
                    </MenuItem>
                    <MenuItem value="other">
                      Other
                    </MenuItem>
                  </Select>
                </FormControl>
                <TextField inputProps={{maxLength: 10}} label="Description" rows="3" multiline value={mapChanges.description || selectedMap.description || ""} id="name-input" size="small" fullWidth variant="filled" style={{marginTop: "5px"}} onChange={function(event) {
                  setMapChanges({
                    ...mapChanges,
                    description: event.target.value
                  })
                }}></TextField>
                {/* <Alert size="small" style={{marginTop: "5px", border: "1px #ED6C21 solid"}} severity="warning">
                  <AlertTitle style={{marginBottom: "0px"}}>Warning:</AlertTitle>
                  <span>The description will change after you save, but your project won't be republished.</span>
                </Alert> */}
              </div>
            </div>
            <div id="map-settings-buttons">
              <Button startIcon={<CheckIcon></CheckIcon>} disabled={!Object.keys(mapChanges).length} variant="contained" onClick={async function() {
                await post(`/update-map/${selectedMap.id}`, mapChanges)
                setMapChanges({})
                setSelectedMap(null)
              }}>
                Save
              </Button>
            </div>
          </div>
        </div>
        <Dialog
          open={deleteSelectedMapAlertOpened}
          TransitionComponent={SlideUpTransition}
          keepMounted
          onClose={function() {
            setDeleteSelectedMapAlertOpened(false)
          }}
          aria-describedby="delete-map-alert"
          PaperProps={{
            style: {
              backgroundColor: "#F2F4FE"
            }
          }}
        >
          <DialogTitle>Delete {selectedMap ? selectedMap.name : "map"}?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-map-alert" style={{color: "rgba(0, 0, 0, 0.8)"}}>
              Are you sure you want to delete {selectedMap ? selectedMap.name : "map"}? This action is irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={function() {
              setDeleteSelectedMapAlertOpened(false)
            }}>Back</Button>
            <Button onClick={function() {
              setDeleteSelectedMapAlertOpened(false)
              post("/delete-map", {
                id: selectedMap.id
              }).then(function() {
                window.location.reload()
              })
            }}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    }
  }
  secondaryToShow = getSecondaryToShow()

  return <>
    <h2 className="header">Maps</h2>
    <div id="projects-list" style={{position: "relative"}} onScroll={function() {
      setProjectsListScroll(document.getElementById("projects-list").scrollTop)
    }}>
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
                <img className="preview" style={{objectFit: "contain"}} src={map.preview}/>
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
          : <p id="loading-maps">Loading maps...</p>
      }
      {/* left arrow */}
      <div className="arrow" style={{display: projectsListScroll == 0 ? "none" : "block", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "rgba(0, 0, 0, 0.5)", width: "50px", height: "50px"}} onClick={function() {
        document.getElementById("projects-list").scrollLeft = projectsListScroll - 100
      }}>

      </div>

      {/* right arrow */}
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
                  case "password":
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