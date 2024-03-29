import React, {useState, useEffect, componentDidMount, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import './default.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { MAP_NAMES, FLAGS, COUNTRY_CODES, lightTheme, darkTheme, serverLocation, SlideUpTransition } from "./constants"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import Grid from '@mui/material/Grid';
import CardActions from '@mui/material/CardActions';
import Slider from '@mui/material/Slider';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { getRectFromPoints, getMapImageUrl, ajax, parseSvg, getTerritoryComputedStyle, typeToValue, generateId, orEmptyString, roundToTwo, createArray, svgToPng, download, isMobile, getAnnotationComputedStyle, convertSvgUrlsToBase64, svgToJpg, svgToWebp, post, get, combineBoundingBoxes, getBase64, getImageDataCoordinate, rgbaToHex, unitePathsArray } from "./util"
import { ColorFill, FlagFill, decodeFill } from "./fill"
import { Scrollbars } from 'react-custom-scrollbars';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { RgbaColorPicker, HexAlphaColorPicker } from "react-colorful";
import { decodeDataVisualizer, DataVisualizer } from "./dataVisualization"
import * as ReactDOMServer from 'react-dom/server';
import MenuIcon from '@mui/icons-material/Menu';
import 'typeface-roboto'
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Visibility from "@mui/icons-material/Visibility"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import VirtualScroll from "virtual-scroll"
import EditIcon from '@mui/icons-material/Edit';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/Login.js"
import SignUp from "./routes/SignUp.js"
import Dashboard from "./routes/Dashboard.js"
import EditMap from "./routes/EditMap.js"
import Download from "./routes/Download.js"
import ClearIcon from '@mui/icons-material/Clear';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Gesto from "gesto";
import Gesture from 'rc-gesture';
import { Point } from "paper"




const root = ReactDOM.createRoot(document.getElementById('root'));
let drawnOnMap = false
let lastAssetId = 0


function App() {
  const [mapSearch, setMapSearch] = useState("");
  const [stage, setStage] = useState("landing page")
  const [secondaryStage, setSecondaryStage] = useState(null)
  const [chosenMap, setChosenMap] = useState(null)
  const staticDivRef = useRef()
  const navbarRef = useRef()

  useEffect(() => {
    if(stage == "landing page") {
      staticDivRef.current.addEventListener("scroll", (event) => {
        if(staticDivRef.current.scrollTop > 0) {
          navbarRef.current.style.boxShadow = "10px 10px 50px rgba(0, 0, 0, 0.3)"
        } else {
          navbarRef.current.style.boxShadow = ""
        }
      })
    }

  }, [])

  let toShow
  switch(stage) {
    case "landing page":
      let toShowSecondary = null
      switch(secondaryStage) {
        case "map picker":
          toShowSecondary = <ThemeProvider theme={lightTheme}>
            <div className="overlay">
              <div className="popup-content big" id="popup-choose-map">
                <div className="popup-header">
                  Choose map
                </div>
                <SearchBarMaps setMapSearch={setMapSearch}></SearchBarMaps>
                <MapsChoiceContainer search={mapSearch} editMap={function (element) {
                  setStage("editor")
                  setChosenMap(element)
                }} setChosenMap={setChosenMap}></MapsChoiceContainer>
              </div>
            </div>
          </ThemeProvider>
          break
      }
      toShow =
        <>
          <div id="navbar" ref={navbarRef}>
            <div className="content-row" id="navbar-content-row">
              <img src="./logo.svg" onClick={() => {window.location = "/"}}/>
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

          <div id="static" ref={staticDivRef}>
            <Paper id="intro">
              <div className="content-row" id="intro-content">
                <div id="intro-left">
                  <p id="intro-left-big"><span className="important">Periphern</span> makes creating <span className="important">maps</span> simpler than ever.</p>
                  <p id="intro-left-subtitle">This is the #1 tool for creating maps.</p>
                  <div id="intro-buttons">
                    <button id="intro-button-start" onClick={() => {setSecondaryStage("map picker")}}>
                      <span>Start now</span>
                      <ArrowForwardIosIcon style={{color: "white", marginRight: "5px"}}/>
                    </button>
                    <a id="intro-button-about-us" href="#about-us">Learn more</a>
                  </div>
                </div>
                <div id="intro-right">
                  <img src="logo-globe.svg"></img>
                </div>
              </div>
            </Paper>
            <Paper id="bottom">
              <div className="content-row" id="how-does-it-work-content">
                <p className="title">How does it work?</p>
                <div className="badges">
                  <div className="badge">
                    <img src="assets/badges-how-it-works/badge-1.svg" className="image"></img>
                    <p className="title">1. Pick a map</p>
                    <p className="description"><span className="special-1">200+</span> maps of different continents, countries and islands, all in <span className="special-2">one</span> place.</p>
                  </div>
                  <div className="badge">
                    <img src="assets/badges-how-it-works/badge-2.svg" className="image"></img>
                    <p className="title">2. Visualize data</p>
                    <p className="description">Change the <span className="special-2">color</span> of territories or show a <span className="special-1">flag</span> on one. Show <span className="special-2">texts</span> and <span className="special-1">emoticons</span>!</p>
                  </div>
                  <div className="badge">
                    <img src="assets/badges-how-it-works/badge-3.svg" className="image"></img>
                    <p className="title">3. Visualize more data</p>
                    <p className="description"><span className="special-2">Draw</span> on maps and add <span className="special-1">markers</span>. Everything you'd ever need is already implemented.</p>
                  </div>
                  <div className="badge">
                    <img src="assets/badges-how-it-works/badge-4.svg" className="image"></img>
                    <p className="title">4. Export</p>
                    <p className="description">Once you're done editing your map, you can download from one of the <span className="special-1">4 formats</span>.</p>
                  </div>
                </div>
              </div>
              
              <div className="second feature" id="maps-second">
                <div className="content-row">
                  <div className="left">
                    <video onLoadedData={function(event) {
                      event.currentTarget.playbackRate = 0.7
                    }} style={{clipPath: "polygon(0px 0px, 0px 99%, 100% 99%, 100% 0px, 0px 0px)"}} width="100%" autoPlay={true} muted={true} loop={true}>
                      <source src="assets/maps.mp4" type="video/mp4"></source>
                    </video>
                  </div>
                  <div className="right feature-description">
                    <p className="title">Library of maps</p>
                    <p className="description">Periphern provides a huge set of 211 maps, making it effortless for you to find a good one. Don't worry! You can change the style of every single one of them (outline, color), so you do not need to find a certain template of a certain type of map in order to start.</p>
                  </div>
                </div>
              </div>
              <div className="feature" id="tools-second">
                <div className="content-row">
                  <div className="left">
                    <video onLoadedData={function(event) {
                      event.currentTarget.playbackRate = 0.7
                    }} style={{height: "fit-content", clipPath: "polygon(0px 0px, 0px 99.5%, 100% 99.5%, 100% 0px, 0px 0px)"}} width="100%" autoPlay={true} muted={true} loop={true}>
                      <source src="assets/tools.mp4" type="video/mp4"></source>
                    </video>
                  </div>
                  <div className="right feature-description">
                    <p className="title">Large set of tools</p>
                    <p className="description">Periphern is very versatile. All tools you'd ever need are included, and if you don't want to use one, no problem: map making with Periphern stays simple, even though the possibilities are endless. You will never need to go to an external platform to use a feature, since our app most likely has it.</p>
                  </div>
                </div>
              </div>

              

            </Paper>
          </div>
          {toShowSecondary}
        </>
      break
    case "editor":
      toShow =
        <Editor chosenMap={chosenMap}></Editor>
      break
  }


  return (
    <ThemeProvider theme={darkTheme}>
      {toShow}
    </ThemeProvider>
  )
}

function mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle, effects, assets) {
  let svgElement = document.createElement("svg")
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  svgElement.setAttribute("width", mapDimensions.width)
  svgElement.setAttribute("height", mapDimensions.height)
  
  let defsElement = document.createElementNS("http://www.w3.org/2000/svg", "defs")
  svgElement.appendChild(defsElement)

  let domParser = new DOMParser()

  for(let i = 0; i != territories.length; i++) {
    let territory = territories[i]
    if(territory.hidden) {
      continue
    }

    let style = getTerritoryComputedStyle(territory, defaultStyle, territoriesHTML[territory.index])
    defsElement.innerHTML += ReactDOMServer.renderToStaticMarkup(style.defs)

    let gElement = document.createElementNS("http://www.w3.org/2000/svg", "g")
    let pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path")
    pathElement.setAttribute("d", territory.path)
    pathElement.setAttribute("fill", style.fill)
    pathElement.setAttribute("stroke", style.outlineColor)
    pathElement.setAttributeNS(null, "stroke-width", style.outlineSize)
    let pathElement2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    pathElement2.setAttribute("d", territory.path)
    pathElement2.setAttribute("fill", "url(#drawn-pattern)")
    pathElement2.setAttribute("stroke", style.outlineColor)
    pathElement2.setAttributeNS(null, "stroke-width", style.outlineSize)
    if(effects.innerShadow.enabled) {
      pathElement.setAttribute("filter", "url(#inner-shadow)")
      pathElement2.setAttribute("filter", "url(#inner-shadow)")
    }
    gElement.appendChild(pathElement)
    gElement.appendChild(pathElement2)
    svgElement.appendChild(gElement)
  }
  for(let i = 0; i != territories.length; i++) {
    let territory = territories[i]
    if(territory.hidden) {
      continue
    }
    if(defaultDataVisualizer && territory.value) {
      svgElement.appendChild(
        domParser.parseFromString(
          ReactDOMServer.renderToStaticMarkup((territory.dataVisualizer || defaultDataVisualizer).render(territory.boundingBox, territory.value || defaultValue, territory, territory.index + "b")),
          'application/xml'
        ).firstElementChild
      )
    }
  }

  // drawn pattern
  let patternElement = document.createElementNS("http://www.w3.org/2000/svg", "pattern")
  patternElement.setAttribute("patternUnits", "userSpaceOnUse")
  patternElement.setAttribute("id", "drawn-pattern")
  patternElement.setAttribute("width", mapDimensions.width)
  patternElement.setAttribute("height", mapDimensions.height)
  let patternImage = document.createElementNS("http://www.w3.org/2000/svg", "image")
  patternImage.setAttribute("width", mapDimensions.width)
  patternImage.setAttribute("height", mapDimensions.height)
  patternImage.setAttribute("href", penCachedImage ? penCachedImage.toDataURL('image/png') : null)
  patternElement.appendChild(patternImage)
  defsElement.appendChild(patternElement)

  for(let i = 0; i != markers.length; i++) {
    let marker = markers[i]
    let parsedStyle = {fill: marker.fill || defaultMarkerStyle.fill, outlineColor: marker.outlineColor || defaultMarkerStyle.outlineColor, outlineSize: marker.outlineSize || defaultMarkerStyle.outlineSize}
    defsElement.innerHTML += ReactDOMServer.renderToStaticMarkup(parsedStyle.fill.getDefs(marker, "marker.fill"))
    defsElement.innerHTML += ReactDOMServer.renderToStaticMarkup(parsedStyle.outlineColor.getDefs(marker, "marker.outline-color"))

    let markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path")
    markerPath.setAttribute("class", "marker-annotation")
    markerPath.setAttribute("fill", parsedStyle.fill.getBackground(marker, "marker.fill"))
    markerPath.setAttribute("stroke", parsedStyle.outlineColor.getBackground(marker, "marker.outline-color"))
    markerPath.setAttribute("stroke-width", parsedStyle.outlineSize)
    markerPath.setAttribute("d", "M13.4897 0.0964089C11.6959 0.29969 10.6697 0.518609 9.51035 0.948628C6.43963 2.09795 3.87025 4.20113 2.12339 7.00798C0.478362 9.65846 -0.281484 13.0908 0.0945223 16.1557C0.705532 21.0891 4.23059 27.8913 10.0744 35.4283C11.453 37.2109 13.2312 39.3454 13.6386 39.7129C14.1791 40.1976 14.8371 40.1976 15.3776 39.7129C15.7849 39.3454 17.5631 37.2109 18.9418 35.4283C24.1981 28.6496 27.5743 22.4887 28.6397 17.7037C28.9138 16.4762 29 15.6787 29 14.3965C28.9922 10.6436 27.4881 7.05489 24.7699 4.34968C22.5296 2.10577 19.8897 0.753165 16.7798 0.244961C16.0435 0.127683 14.0224 0.0338607 13.4897 0.0964089ZM15.4246 7.32854C18.3465 7.71947 20.767 9.81483 21.5582 12.6373C21.7697 13.3801 21.848 14.8734 21.7227 15.6865C21.3545 18.0008 19.8348 20.0336 17.6806 21.0813C16.4116 21.699 15.1113 21.9335 13.7874 21.785C12.7534 21.6677 12.2286 21.5192 11.3355 21.0813C9.18134 20.0336 7.66165 18.0008 7.29347 15.6865C7.16814 14.8734 7.24647 13.3801 7.45798 12.6373C8.43716 9.15026 11.8917 6.84379 15.4246 7.32854Z")
    markerPath.style.transform = `translate(${marker.x - marker.width / 2}px, ${marker.y - marker.height}px)`

    svgElement.appendChild(markerPath)
  }

  if(effects.innerShadow.enabled) {
    let filterElement = document.createElementNS("http://www.w3.org/2000/svg", "filter")
    filterElement.setAttribute("id", "inner-shadow")
    filterElement.innerHTML = `<feOffset dx="0" dy="0"/>                                                         
    <feGaussianBlur stdDeviation="${10 * effects.innerShadow.scale}" result="offset-blur"/>                           
    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/> 
    <feFlood floodColor="black" floodOpacity="1" result="color"/>                     
    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>               
    <feComponentTransfer in="shadow" result="shadow">                                   
        <feFuncA type="linear" slope=".75"/>
    </feComponentTransfer>
    <feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite>`
    defsElement.appendChild(filterElement)
  }
  for(let i = 0; i != assets.length; i++) {
    let asset = assets[i]
    let patternElement = document.createElementNS("http://www.w3.org/2000/svg", "pattern")
    patternElement.setAttribute("id", `asset.${asset.id}`)
    patternElement.setAttribute("width", "100%")
    patternElement.setAttribute("height", "100%")
    patternElement.setAttributeNS(null, "patternContentUnits", "objectBoundingBox")
    patternElement.setAttributeNS(null, "viewBox", "0 0 1 1")
    patternElement.setAttributeNS(null, "preserveAspectRatio", "xMidYMid slice")
    let imageElement = document.createElementNS("http://www.w3.org/2000/svg", "image")
    imageElement.setAttributeNS(null, "preserveAspectRatio", "none")
    imageElement.setAttribute("href", asset.data)
    imageElement.setAttribute("height", "1")
    imageElement.setAttribute("width", "1")
    patternElement.appendChild(imageElement)
    defsElement.appendChild(patternElement)
  }
  if(defaultDataVisualizer && defaultDataVisualizer.type == "text") {
    return new Promise(async (resolve, reject) => {
      let reader = new window.FileReader()
      if(defaultDataVisualizer.style.fontFamily.toLowerCase() == "rubik") {
        let url = `./fonts/rubik/${Math.max(defaultDataVisualizer.style.fontWeight, 300)}${defaultDataVisualizer.style.italic ? "-italic" : ""}.ttf`
        let response = await fetch(url)
        let blob = await response.blob()
        reader.readAsDataURL(blob)
      } else if(defaultDataVisualizer.style.fontFamily.toLowerCase() == "oblivian") {
        let url = `./fonts/oblivian/${defaultDataVisualizer.style.italic ? "italic" : "normal"}/${defaultDataVisualizer.style.fontWeight}.otf`
        let response = await fetch(url)
        let blob = await response.blob()
        reader.readAsDataURL(blob)
      }
      reader.onload = function() {
        let cssElement = document.createElement("style")
        cssElement.innerHTML = `@font-face {
          font-family: '${defaultDataVisualizer.style.fontFamily.toLowerCase()}';
          font-weight: ${defaultDataVisualizer.style.fontWeight};
          font-style: ${defaultDataVisualizer.style.italic ? "italic" : "normal"};
          src: url(${this.result});
        }`
        defsElement.appendChild(cssElement)
        resolve(svgElement)
      }
    })
    
  } else {
    return new Promise((resolve, reject) => {
      resolve(svgElement)
    })
  }
}

let onKeyDownEventListeners = []
window.addEventListener("keydown", function(event) {  
  onKeyDownEventListeners.forEach(func => {
    func(event)
  })
})
function onKeyDown(func) {
  onKeyDownEventListeners.push(func)
}

export function Editor({removeHeight, chosenMap, data, onUpdate, saving}) {
  function decodeStyle(style) {
    return {
      fill: decodeFill(style.fill),
      outlineColor: decodeFill(style.outlineColor),
      outlineSize: style.outlineSize
    }
  }

  let [savingToCloud, setSavingToCloud] = useState(data != undefined)
  function getStartingDefaultStyle() {
    let startingDefaultStyle = {
      fill: new ColorFill(255, 255, 255, 1), // new ColorFill(255, 255, 255, 1),
      outlineColor: new ColorFill(0, 0, 0, 1),
      outlineSize: 1
    }
    if(savingToCloud && data.defaultStyle) {
      startingDefaultStyle = decodeStyle(data.defaultStyle)
    }
    return startingDefaultStyle;
  }
  const [defaultStyle, setDefaultStyle] = useState(getStartingDefaultStyle())
  function getStartingDefaultDataVisualizer() {
    let startingDefaultDataVisualizer = new DataVisualizer()
    if(savingToCloud && !data.firstLoad) {
      startingDefaultDataVisualizer = decodeDataVisualizer(data.defaultDataVisualizer)
    }
    return startingDefaultDataVisualizer
  }
  const [defaultDataVisualizer, setDefaultDataVisualizer] = useState(getStartingDefaultDataVisualizer())
  const [selectedTerritory, setSelectedTerritory] = useState(null)
  const [territoriesHTML, setTerritoriesHTML] = useState([])
  function getStartingTerritories() {
    let startingTerritories = []
    if(savingToCloud && !data.firstLoad) {
      startingTerritories = data.territories.map(territory => {
        return {
          ...territory,
          fill: territory.fill ? decodeFill(territory.fill) : null,
          outlineColor: territory.outlineColor ? decodeFill(territory.outlineColor) : null
        }
      })
    }
    return startingTerritories
  }
  const [territories, setTerritories] = useState(getStartingTerritories())
  function getStartingMapDimensions() {
    let startingMapDimensions = {}
    if(savingToCloud && !data.firstLoad) {
      startingMapDimensions = data.mapDimensions
    }
    return startingMapDimensions
  }
  const [mapDimensions, setMapDimensions] = useState(getStartingMapDimensions())
  function getStartingDefaultValue() {
    let startingDefaultValue = ""
    if(savingToCloud && !data.firstLoad) {
      startingDefaultValue = data.defaultValue
    }
    return startingDefaultValue
  }
  const [defaultValue, setDefaultValue] = useState(getStartingDefaultValue())
  const [currentZoom, setCurrentZoom] = useState(1)
  const [currentTool, setCurrentTool] = useState("cursor")
  const [annotations, setAnnotations] = useState([])
  const [penColor, setPenColor] = useState("#e00")
  const [penSize, setPenSize] = useState(10)
  const [reload, setReload] = useState(true)
  function getStartingPenCachedImage() {
    let startingPenCachedImage = document.createElement("canvas")
    if(savingToCloud && !data.firstLoad) {
      startingPenCachedImage = document.createElement("canvas")
      startingPenCachedImage.width = data.mapDimensions.width
      startingPenCachedImage.height = data.mapDimensions.height
    }
    return startingPenCachedImage
  }
  const [penCachedImage, setPenCachedImage] = useState(getStartingPenCachedImage())
  useEffect(function() {
    if(savingToCloud && !data.firstLoad) {
      let image = new Image()
      image.onload = () => {
        penCachedImage.getContext("2d").drawImage(image, 0, 0)
        setReload(!reload)
      }
      drawnOnMap = true
      image.src = data.penCachedImage
    }
  }, [])
  const [eraserSize, setEraserSize] = useState(10)
  function getStartingMarkers() {
    let startingMarkers = []
    if(savingToCloud && !data.firstLoad) {
      startingMarkers = data.markers.map(marker => {
        return {
          ...marker,
          fill: marker.fill ? decodeFill(marker.fill) : null,
          outlineColor: marker.outlineColor ? decodeFill(marker.outlineColor) : null
        }
      })
    }
    return startingMarkers
  }
  const [markers, setMarkers] = useState(getStartingMarkers())
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [defaultMarkerStyle, setDefaultMarkerStyle] = useState({
    fill: new ColorFill(255, 0, 0, 1), // new ColorFill(255, 255, 255, 1),
    outlineColor: new ColorFill(0, 0, 0, 1),
    outlineSize: 1
  })
  const [boosting, setBoosting] = useState(isMobile())
  const [mapSvgPath, setMapSvgPath] = useState("")
  const mobileBottomDiv = useRef()
  const [moved, setMoved] = useState({x: 0, y: 0})
  function getStartingRecentColors() {
    let startingRecentColors = []
    if(savingToCloud && !data.firstLoad) {
      startingRecentColors = data.recentColors
    }
    return startingRecentColors
  }
  const [recentColors, setRecentColors] = useState(getStartingRecentColors())
  const [deleteTerritoryAlertOpened, setDeleteTerritoryAlertOpened] = useState(false)
  const [uniteTerritoriesAlertOpened, setUniteTerritoriesAlertOpened] = useState(false)
  const [eyedropperOpened, setEyedropperOpened] = useState(false)
  const [eyedropperSetter, setEyedropperSetter] = useState(false)
  const [lastPngPreview, setLastPngPreview] = useState(null)
  const [fillPickerFocused, setFillPickerFocused] = useState(false)
  const [fillPickerFocusedInterface, setFillPickerFocusedInterface] = useState(null)
  const [fillPickerFocusedDisplacementStart, setFillPickerFocusedDisplacementStart] = useState({x: 0, y: 0})
  function getStartingEffects() {
    let startingEffects = {
      innerShadow: {
        enabled: false,
        scale: 1
      }
    }
    if(savingToCloud && !data.firstLoad) {
      startingEffects = data.effects
    }
    return startingEffects
  }
  const [effects, setEffects] = useState(getStartingEffects())
  function getStartingAssets() {
    let startingAssets = []
    if(savingToCloud && !data.firstLoad) {
      startingAssets = data.assets || []
    }
    return startingAssets
  }
  const [assets, setAssets] = useState(getStartingAssets())

  useEffect(function() {
    console.log(assets)
  }, [assets])

  function getMapData(penCachedImageUpdated = true) {
    return {
      map: chosenMap,
      defaultStyle: {
        fill: defaultStyle.fill.encode(),
        outlineColor: defaultStyle.outlineColor.encode(),
        outlineSize: defaultStyle.outlineSize
      },
      territoriesHTML,
      defaultDataVisualizer: defaultDataVisualizer.encode(),
      territories: territories.map(territory => {
        return {
          ...territory,
          fill: territory.fill ? territory.fill.encode() : null,
          outlineColor: territory.outlineColor ? territory.outlineColor.encode() : null,
          boundingBox: {x: territory.boundingBox.x, y: territory.boundingBox.y, width: territory.boundingBox.width, height: territory.boundingBox.height}
        }
      }),
      mapDimensions,
      defaultValue,
      annotations,
      markers: markers.map(marker => {
        return {
          ...marker,
          fill: marker.fill ? marker.fill.encode() : null,
          outlineColor: marker.outlineColor ? marker.outlineColor.encode() : null
        }
      }),
      defaultMarkerStyle: {
        fill: defaultMarkerStyle.fill.encode(),
        outlineColor: defaultMarkerStyle.outlineColor.encode(),
        outlineSize: defaultMarkerStyle.outlineSize
      },
      recentColors,
      effects,
      ...(penCachedImageUpdated ? {penCachedImage: penCachedImage.toDataURL()} : {}),
      preview: mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle, effects, assets),
      assets
    }
  }

  useEffect(() => {
    if(!savingToCloud) return
    onUpdate(function() {
      return getMapData(false)
    })
  }, [defaultStyle, defaultDataVisualizer, territories, mapDimensions, defaultValue, annotations, markers, defaultMarkerStyle, mapSvgPath, recentColors, effects])

  useEffect(() => {
    if(eyedropperOpened) {
      mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle, effects, assets).then(element => {
        convertSvgUrlsToBase64(element).then(element => {
          svgToPng(element.outerHTML).then(png => {
            setLastPngPreview(png)
          })
        })
      })
    }
  }, [eyedropperOpened])
  

  async function downloadSvg() {
    let element = await mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle, effects, assets)
    let base64 = btoa(unescape(encodeURIComponent(element.outerHTML)))
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.svg"
    a.href = "data:image/svg+xml;base64," + base64
    a.dispatchEvent(e)
  }
  async function downloadPng() {
    let element = await mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle, effects, assets)
    element = await convertSvgUrlsToBase64(element)
    let converted = await svgToPng(element.outerHTML)
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.png"
    a.href = converted
    a.dispatchEvent(e)
  }
  async function downloadJpg() {
    let element = await mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle, effects, assets)
    element = await convertSvgUrlsToBase64(element)
    let converted = await svgToJpg(element.outerHTML)
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.jpg"
    a.href = converted
    a.dispatchEvent(e)
  }
  async function downloadWebp() {
    let element = await mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle, effects, assets)
    element = await convertSvgUrlsToBase64(element)
    let converted = await svgToWebp(element.outerHTML)
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.webp"
    a.href = converted
    a.dispatchEvent(e)
  }

  useEffect(function() {
    if(savingToCloud && !data.firstLoad) {
      let fullPath = ""
      data.territories.forEach((node, index) => {
        fullPath += "M 0,0 " + node.path
      })
      setMapSvgPath(fullPath)
      return
    }
    ajax(getMapImageUrl(chosenMap.id), "GET").then(data => {
      let svgData = parseSvg(data)
      setTerritoriesHTML(svgData.mapNodes)
      let fullPath = ""
      setTerritories(svgData.mapNodes.map((node, index) => {
        fullPath += "M 0,0 " + node.getAttribute("d")
        let object = {index, dataVisualizerScale: 1, dataOffsetX: 0, dataOffsetY: 0, dataVisualizer: null, value: null, path: node.getAttribute("d"), boundingBox: node.getBBox(), id: node.id || node.dataset.id, name: node.getAttribute("name") || node.dataset.name || node.getAttribute("title") || node.id, fill: null, outlineColor: null, outlineSize: null, hidden: false}
        if(chosenMap.countryCodes) {
          object.name = COUNTRY_CODES[object.id.toUpperCase()]
        }
        return object
      }))
      setMapSvgPath(fullPath)
      svgData.close() // parseSvg pastes the svg into the dom to make node.getBBox() possible. .close() removes the svg from the document.
      setMapDimensions(svgData.dimensions)
      let canvas = document.createElement("canvas")
      canvas.setAttribute("width", svgData.dimensions.width)
      canvas.setAttribute("height", svgData.dimensions.height)
      setPenCachedImage(canvas)
    })
    const scroller = new VirtualScroll()
    let fullScroll = 150
    scroller.on((newValue) => {
      if(document.getElementById("right-bar")) {
        if(document.getElementById("right-bar").contains(newValue.originalEvent.target)) {
          return
        }
        if(document.getElementById("properties-panel").contains(newValue.originalEvent.target)) {
          return
        }
        if(isMobile() && (document.getElementById("right-bar-container").contains(newValue.originalEvent.target) || document.getElementById("properties-container").contains(newValue.originalEvent.target))) {
          fullScroll -= newValue.deltaY / 2
          fullScroll = Math.min(Math.max(fullScroll, 150), 1160)
          document.documentElement.style.setProperty("--mobile-ui-slide", fullScroll + "px")
        }
      }
      
    })
  }, [])

  onKeyDown(function(event) {
    if(!event.repeat && event.key == "Delete") {
      setDeleteTerritoryAlertOpened(true)
    }
  })

  let defaultMapCSSStyle = {
    cursor: "pointer",
    transition: boosting ? "" : "opacity 0.3s"
  }
  if(currentTool != "cursor") {
    defaultMapCSSStyle.cursor = null
  }



  return(
    <>
      <div style={{position: "relative", height: removeHeight ? `calc(100% - ${removeHeight})` : "100%", width: "100%", display: "flex", overflow: "hidden", backgroundColor: "#2A2E4A", backgroundImage: "none", cursor: currentTool == "rectangle" || currentTool == "ellipse" ? "crosshair" : null}}>
        <EditableMap fillPickerFocusedInterface={fillPickerFocusedInterface} fillPickerFocusedDisplacementStart={fillPickerFocusedDisplacementStart} setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} fillPickerFocused={fillPickerFocused} setFillPickerFocused={setFillPickerFocused} setEyedropperOpened={setEyedropperOpened} setEyedropperSetter={setEyedropperSetter} eyedropperSetter={eyedropperSetter} setLastPngPreview={setLastPngPreview} lastPngPreview={lastPngPreview} eyedropperOpened={eyedropperOpened} assets={assets} setAssets={setAssets} moved={moved} setMoved={setMoved} mapSvgPath={mapSvgPath} boosting={boosting} defaultMarkerStyle={defaultMarkerStyle} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} markers={markers} setMarkers={setMarkers} eraserSize={eraserSize} penCachedImage={penCachedImage} penColor={penColor} penSize={penSize} currentTool={currentTool} currentZoom={currentZoom} setCurrentZoom={setCurrentZoom} defaultValue={defaultValue} defaultDataVisualizer={defaultDataVisualizer} mapDimensions={mapDimensions} territories={territories} defaultStyle={defaultStyle} selectedTerritory={selectedTerritory} defaultMapCSSStyle={defaultMapCSSStyle} setSelectedTerritory={setSelectedTerritory} territoriesHTML={territoriesHTML} annotations={annotations} setAnnotations={setAnnotations} effects={effects} onMapDrawn={function() {
          if(!savingToCloud) return
          onUpdate(function() {
            return getMapData(true)
          })
        }}></EditableMap>
        <div ref={mobileBottomDiv}>
          <Properties setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} fillPickerFocused={fillPickerFocused} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} eyedropperOpened={eyedropperOpened} mapData={data} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} effects={effects} setEffects={setEffects} recentColors={recentColors} setRecentColors={setRecentColors} markers={markers} setMarkers={setMarkers} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} defaultMarkerStyle={defaultMarkerStyle} setDefaultMarkerStyle={setDefaultMarkerStyle} currentTool={currentTool} defaultValue={defaultValue} setDefaultValue={setDefaultValue} defaultDataVisualizer={defaultDataVisualizer} setDefaultDataVisualizer={setDefaultDataVisualizer} setSelectedTerritory={setSelectedTerritory} territories={territories} defaultStyle={defaultStyle} setDefaultStyle={setDefaultStyle} selectedTerritory={selectedTerritory} setTerritories={setTerritories}></Properties>
          <RightBar fillPickerFocused={fillPickerFocused} eyedropperOpened={eyedropperOpened} setMarkers={setMarkers} markers={markers} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} setTerritories={setTerritories} selectedTerritory={selectedTerritory} setSelectedTerritory={setSelectedTerritory} territories={territories}></RightBar>
          <Toolbar fillPickerFocused={fillPickerFocused} setEyedropperSetter={setEyedropperSetter} setEyedropperOpened={setEyedropperOpened} eyedropperOpened={eyedropperOpened} removeHeight={removeHeight} boosting={boosting} setBoosting={setBoosting} eraserSize={eraserSize} setEraserSize={setEraserSize} penSize={penSize} setPenSize={setPenSize} penColor={penColor} setPenColor={setPenColor} downloadSvg={downloadSvg} downloadPng={downloadPng} downloadJpg={downloadJpg} downloadWebp={downloadWebp} currentTool={currentTool} setCurrentTool={setCurrentTool}></Toolbar>
        </div>
        <ZoomWidget fillPickerFocused={fillPickerFocused} eyedropperOpened={eyedropperOpened} savingToCloud={savingToCloud} saving={saving} setUniteTerritoriesAlertOpened={setUniteTerritoriesAlertOpened} setDeleteTerritoryAlertOpened={setDeleteTerritoryAlertOpened} setSelectedTerritory={setSelectedTerritory} selectedTerritory={selectedTerritory} setTerritories={setTerritories} territories={territories} currentZoom={currentZoom} setCurrentZoom={setCurrentZoom}></ZoomWidget>
      </div>
      
      {
        deleteTerritoryAlertOpened
          ? <ThemeProvider theme={lightTheme}>
          <Dialog
            open={deleteTerritoryAlertOpened}
            TransitionComponent={SlideUpTransition}
            keepMounted
            onClose={function() {
              setDeleteTerritoryAlertOpened(false)
            }}
            aria-describedby="delete-territory-alert"
            PaperProps={{
              style: {
                backgroundColor: "#F2F4FE"
              }
            }}
          >
            <DialogTitle>Delete {Array.isArray(selectedTerritory) ? selectedTerritory.length + " territories" : selectedTerritory.name}?</DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-territory-alert" style={{color: "rgba(0, 0, 0, 0.8)"}}>
                Are you sure you want to delete {Array.isArray(selectedTerritory) ? selectedTerritory.length + " territories" : selectedTerritory.name}? This action is irreversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={function() {
                setDeleteTerritoryAlertOpened(false)
              }}>Back</Button>
              <Button onClick={function() {
                setDeleteTerritoryAlertOpened(false)
                setTerritories(territories.filter(territory => {
                  if(Array.isArray(selectedTerritory)) {
                    if(selectedTerritory.some(territory2 => territory2.index == territory.index)) {
                      return false
                    }
                  } else {
                    if(territory.index == selectedTerritory.index) {
                      return false
                    }
                  }
                  
                  return true
                }))
              }}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
        : null
      }
      {
        uniteTerritoriesAlertOpened
          ? <ThemeProvider theme={lightTheme}>
          <Dialog
            open={uniteTerritoriesAlertOpened}
            TransitionComponent={SlideUpTransition}
            keepMounted
            onClose={function() {
              setUniteTerritoriesAlertOpened(false)
            }}
            aria-describedby="unite-territory-alert"
            PaperProps={{
              style: {
                backgroundColor: "#F2F4FE"
              }
            }}
          >
            <DialogTitle>Unite {Array.isArray(selectedTerritory) ? selectedTerritory.length + " territories" : selectedTerritory.name}?</DialogTitle>
            <DialogContent>
              <DialogContentText id="unite-territory-alert" style={{color: "rgba(0, 0, 0, 0.8)"}}>
                Are you sure you want to unite {selectedTerritory.length} territories? This action is irreversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={function() {
                setUniteTerritoriesAlertOpened(false)
              }}>Back</Button>
              <Button onClick={function() {
                setUniteTerritoriesAlertOpened(false)
                
                let newPath = ""
                for(let i = 0; i != selectedTerritory.length; i++) {
                  newPath += "M 0,0 " + selectedTerritory[i].path
                }
                let object = {
                  index: generateId(),
                  dataVisualizerScale: selectedTerritory[0].dataVisualizerScale || 1,
                  dataOffsetX: 0,
                  dataOffsetY: 0,
                  dataVisualizer: selectedTerritory[0].dataVisualizer || null,
                  value: selectedTerritory[0].value || null,
                  path: newPath,
                  boundingBox: null,
                  id: "Unified Territory",
                  name: "Unified Territory",
                  fill: selectedTerritory[0].fill || null,
                  outlineColor: selectedTerritory[0].outlineColor || null,
                  outlineSize: selectedTerritory[0].outlineSize || null,
                  hidden: false
                }
                let boundingBox = {x: 0, y: 0, height: 0, width: 0}
                let newTerritories = territories.filter(territory => {
                  if(Array.isArray(selectedTerritory)) {
                    if(selectedTerritory.some(territory2 => territory2.index == territory.index)) {
                      boundingBox = combineBoundingBoxes(boundingBox, territory.boundingBox)
                      return false
                    }
                  }
                  
                  return true
                })
                object.boundingBox = boundingBox
                newTerritories.push(object)
                setTerritories(newTerritories)
              }}>Confirm</Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
        : null
      }
    </>
    
    
  )
}



function Toolbar({fillPickerFocused, setEyedropperSetter, eyedropperOpened, setEyedropperOpened, removeHeight, eraserSize, boosting, setBoosting, setEraserSize, penSize, setPenSize, penColor, setPenColor, setCurrentTool, currentTool, downloadSvg, downloadPng, downloadJpg, downloadWebp}) {
  const [special, setSpecial] = useState(null)
  const [specialLocation, setSpecialLocation] = useState(0)
  const toolbarRef = useRef()
  const [reload, setReload] = useState(true)
  const [colorPickerOpened, setColorPickerOpened] = useState(false)

  let toolbarRect = toolbarRef?.current?.getBoundingClientRect()

  let trueSetSpecial = function(button, element) {
    let buttonRect = button.getBoundingClientRect()
    let newSpecialLocation = buttonRect.left - toolbarRect.left
    if(newSpecialLocation == specialLocation) {
      setSpecial(null)
      setSpecialLocation(-1)
    } else {
      setSpecial(element)
      setSpecialLocation(buttonRect.left - toolbarRect.left)
    }
  }

  return <>
    <div className={fillPickerFocused || eyedropperOpened ? "ui-hidden" : "ui-shown"} id="toolbar" ref={toolbarRef}>
      <ToolbarButton name="CURSOR" icon="icons/cursor.svg" selected={currentTool == "cursor"} onClick={function() {
        setCurrentTool("cursor")
        setSpecial(null)
      }}></ToolbarButton>
      <ToolbarButton name="MOVE" icon="icons/hand.svg" selected={currentTool == "move"} onClick={function() {
        setCurrentTool("move")
        setSpecial(null)
      }}></ToolbarButton>
      <ToolbarButton setEyedropperSetter={setEyedropperSetter} realSetSpecial={setSpecial} setEyedropperOpened={setEyedropperOpened} name="PEN" colorPickerOpened={colorPickerOpened} setColorPickerOpened={setColorPickerOpened} setSpecial={trueSetSpecial} special="pen" penSize={penSize} setPenSize={setPenSize} penColor={penColor} setPenColor={setPenColor} icon="icons/pen.svg" selected={currentTool == "pen"} onClick={function() {
        setCurrentTool("pen")
      }}></ToolbarButton>
      <ToolbarButton name="ERASER" setSpecial={trueSetSpecial} special="eraser" eraserSize={eraserSize} setEraserSize={setEraserSize} icon="icons/eraser.svg" selected={currentTool == "eraser"} onClick={function() {
        setCurrentTool("eraser")
      }}></ToolbarButton>
      <ToolbarButton name="MARKER" icon="icons/marker.svg" selected={currentTool == "marker"} onClick={function() {
        setCurrentTool("marker")
        setSpecial(null)
      }}></ToolbarButton>
      {/* <ToolbarButton name="ANNOTATIONS" icon="icons/cursor-annotation.svg" selected={currentTool == "annotations"} onClick={function() {
        setCurrentTool("annotations")
      }}></ToolbarButton>
      <ToolbarButton name="RECTANGLE" icon="icons/rectangle.svg" selected={currentTool == "rectangle"} onClick={function() {
        setCurrentTool("rectangle")
      }}></ToolbarButton>
      <ToolbarButton name="ELLIPSE" icon="icons/ellipse.svg" selected={currentTool == "ellipse"} onClick={function() {
        setCurrentTool("ellipse")
      }}></ToolbarButton> */}
      <ToolbarButton name="DOWNLOAD" setSpecial={trueSetSpecial} downloadSvg={downloadSvg} downloadPng={downloadPng} downloadJpg={downloadJpg} downloadWebp={downloadWebp} special="download" icon="icons/download.svg" selected={false}></ToolbarButton>
      <ToolbarButton name="BOOST" icon={boosting ? "icons/boost-active.svg" : "icons/boost-inactive.svg"} selected={false} onClick={function() {
        setBoosting(!boosting)
        setSpecial(null)
      }}></ToolbarButton>
    </div>
    {
      special 
        ? <div style={{transform: `translate(${specialLocation}px) translateY(-${removeHeight}) scale(${window.innerWidth < 1430 ? window.innerWidth < 1240 ? window.innerWidth < 1070 ? 0.8 : 0.6 : 0.7 : 0.8})`, position: "absolute", left: `calc(50% - ${toolbarRect.width / 2}px)`, top: toolbarRect.top}}>
            { special }
          </div>
        : null
    }
  </>
}
function ToolbarButton({setEyedropperSetter, realSetSpecial, setEyedropperOpened, setSpecial, colorPickerOpened, setColorPickerOpened, setEraserSize, eraserSize, penColor, penSize, setPenColor, setPenSize, name, icon, selected, onClick, special, downloadSvg, downloadPng, downloadJpg, downloadWebp}) {
  const buttonRef = useRef()

  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  function getSpecialContent() {
    switch(special) {
      case "download":
        return <div className="special download" style={{paddingBottom: "15px", width: "130px", position: "absolute", bottom: "100%", left: "0px"}}>
          <div className="panel" style={{backgroundColor: "rgb(70, 80, 119)", borderRadius: "10px", width: "100%"}}>
            <div onClick={downloadSvg} className="button">
              SVG
            </div>
            <div onClick={downloadPng} className="button">
              PNG
            </div>
            <div onClick={downloadJpg} className="button">
              JPG
            </div>
            { isSafari ? null : <div onClick={downloadWebp} className="button">
              WEBP
            </div> }
          </div>
        </div>
      case "pen":
        return <div className="special download pen" style={{paddingBottom: "15px", width: "130px", position: "absolute", bottom: "100%", left: "0px"}}>
          <div className="panel" style={{backgroundColor: "rgb(70, 80, 119)", borderRadius: "10px", width: "100%"}}>
            <div className="button color-container">
              <div style={{backgroundColor: penColor}} onClick={function(event) {
                setColorPickerOpened(!colorPickerOpened)
                colorPickerOpened = !colorPickerOpened
                setSpecial(buttonRef.current, getSpecialContent())
              }}/>
              <FloatingColorPicker value={penColor} opened={colorPickerOpened} onChange={function(newValue) {
                setPenColor(newValue)
                penColor = newValue
                setSpecial(buttonRef.current, getSpecialContent())
              }}></FloatingColorPicker>
            </div>
            <div className="button" style={{height: "30px"}} onClick={function() {
              setEyedropperOpened(true)
              setEyedropperSetter(() => value => {
                if(!value) {
                  return
                }
                setPenColor(rgbaToHex(value[0], value[1], value[2]))
              })
              realSetSpecial(<></>)
            }}>
              <img src="icons/eyedropper.svg" style={{height: "65%", marginRight: "5px"}}></img>
              Eyedropper
            </div>
            <div className="button size-container" style={{height: "30px", outline: "none"}} onClick={function(event) {
              let element = event.currentTarget.getElementsByTagName("input")[0]
              element.focus()
            }}>
              Size: <input style={{width: "30px", backgroundColor: "#3F445B", border: "none", outline: "none", color: "white", marginLeft: "5px"}} id="pen-size-span" onInput={function(event) {
                setPenSize(parseInt(event.target.value) || 0)
                penSize = parseInt(event.target.value) || 0
                setSpecial(buttonRef.current, getSpecialContent())
              }} value={penSize}></input>
            </div>
          </div>
        </div>
      case "eraser":
        return <div className="special download pen" style={{paddingBottom: "15px", width: "130px", position: "absolute", bottom: "100%", left: "0px"}}>
          <div className="panel" style={{backgroundColor: "rgb(70, 80, 119)", borderRadius: "10px", width: "100%"}}>
            <div className="button size-container" style={{outline: "none"}} onClick={function(event) {
              let element = event.currentTarget.getElementsByTagName("input")[0]
              element.focus()
            }}>
              Size: <input style={{width: "30px", backgroundColor: "#3F445B", border: "none", outline: "none", color: "white", marginLeft: "5px"}} id="pen-size-span" onInput={function(event) {
                setEraserSize(parseInt(event.target.value) || 0)
                eraserSize = parseInt(event.target.value) || 0
                setSpecial(buttonRef.current, getSpecialContent())
              }} value={eraserSize}></input>
            </div>
          </div>
        </div>
    }
  }


  return <div ref={buttonRef} onClick={function() {
    onClick && onClick()
    setSpecial(buttonRef.current, getSpecialContent())
  }} className="toolbar-button" style={{position: "relative"}}>
    <div className={selected ? "top selected" : "top"}>
      <img src={icon}></img>
    </div>
    <div className="bottom">
      {name}
    </div>

  </div>
}

function FloatingColorPicker({opened, onChange, value}) {
  return <div style={{display: opened ? "block" : "none", width: "fit-content", height: "fit-content", position: "absolute", top: "0px", left: "100%", paddingLeft: "10px"}}>
    <div style={{padding: "20px", backgroundColor: "rgb(70, 80, 119)", padding: "20px", backgroundColor: "rgb(70, 80, 119)", width: "fit-content", height: "fit-content", borderRadius: "10px", boxShadow: "0px 0px 20px #00000b75"}}>
      <HexAlphaColorPicker onChange={onChange} color={value}></HexAlphaColorPicker>
    </div>
  </div>
}

function ZoomWidget({fillPickerFocused, eyedropperOpened, savingToCloud, saving, setDeleteTerritoryAlertOpened, setUniteTerritoriesAlertOpened, selectedTerritory, setSelectedTerritory, setTerritories, territories, currentZoom, setCurrentZoom}) {
  return <div id="zoom-panel-positioner" className={fillPickerFocused || eyedropperOpened ? "ui-hidden" : "ui-shown"} style={{display: "flex"}}>
    {
      savingToCloud
        ? <img style={{width: "50px", height: "50px", marginRight: "10px", cursor: "pointer"}} src="icons/autosave.svg" id="autosave-icon" className={"saving" + (saving ? " animating" : null)}/>
        : null
    }
    <div id="remove-borders-icon" style={{display: selectedTerritory && Array.isArray(selectedTerritory) ? "flex" : "none", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "10px", marginRight: "10px", backgroundColor: "#465077", width: "50px", height: "50px"}} onClick={function() {
      let newPath = unitePathsArray(selectedTerritory.map(territory => territory.path))
      let object = {
        index: generateId(),
        dataVisualizerScale: selectedTerritory[0].dataVisualizerScale || 1,
        dataOffsetX: 0,
        dataOffsetY: 0,
        dataVisualizer: selectedTerritory[0].dataVisualizer || null,
        value: selectedTerritory[0].value || null,
        path: newPath,
        boundingBox: null,
        id: "Unified Territory",
        name: "Unified Territory",
        fill: selectedTerritory[0].fill || null,
        outlineColor: selectedTerritory[0].outlineColor || null,
        outlineSize: selectedTerritory[0].outlineSize || null,
        hidden: false
      }
      let boundingBox = {x: 0, y: 0, height: 0, width: 0}
      let newTerritories = territories.filter(territory => {
        if(Array.isArray(selectedTerritory)) {
          if(selectedTerritory.some(territory2 => territory2.index == territory.index)) {
            boundingBox = combineBoundingBoxes(boundingBox, territory.boundingBox)
            return false
          }
        }
        
        return true
      })
      object.boundingBox = boundingBox
      newTerritories.push(object)
      setTerritories(newTerritories)
    }}>
      <img src="icons/remove-borders.svg" style={{maxWidth: "60%", maxHeight: "60%"}}></img>
    </div>
    <div id="unite-icon" style={{display: selectedTerritory && Array.isArray(selectedTerritory) ? "flex" : "none", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "10px", marginRight: "10px", backgroundColor: "#465077", width: "50px", height: "50px"}} onClick={function() {
      setUniteTerritoriesAlertOpened(true)
    }}>
      <img src="icons/unite.svg" style={{maxWidth: "60%", maxHeight: "60%"}}></img>
    </div>
    <div id="trash-icon" style={{display: selectedTerritory ? "flex" : "none", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "10px", marginRight: "10px", backgroundColor: "#465077", width: "50px", height: "50px"}} onClick={function() {
      setDeleteTerritoryAlertOpened(true)
    }}>
      <img src="icons/bin.svg" style={{maxWidth: "60%", maxHeight: "60%"}}></img>
    </div>
    <div id="zoom-panel" style={{boxShadow: "#00000059 -7px 12px 60px", backgroundColor: "#465077", display: "flex", width: "210px", height: "50px", borderRadius: "10px"}}>
      <Typography style={{fontSize: "18px", width: "100px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>{(currentZoom * 100).toFixed()}%</Typography>
      <Divider orientation="vertical"/>
      <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexGrow: "1"}}>
        <IconButton disabled={currentZoom == 3} style={{aspectRatio: "1/1", height: "40px"}} onClick={function() {
          let unrounded = Math.min(currentZoom - ((0 - currentZoom) / 5) || 0.1, 3)
          setCurrentZoom(roundToTwo(unrounded))
        }}>
          <AddIcon/>
        </IconButton>
        <IconButton disabled={currentZoom == 0.25} style={{aspectRatio: "1/1", height: "40px", marginLeft: "5px"}} onClick={function() {
          let unrounded = Math.max(currentZoom + ((0 - currentZoom) / 5) || 0.1, 0.25)
          setCurrentZoom(roundToTwo(unrounded))
        }}>
          <RemoveIcon/>
        </IconButton>
      </div>
    </div>
  </div>
}

let selectingTerritories = false
let markerIndex = 0
let lastAssetDisplacementData = null
let pinchStartZoom = 1
let pinchStartMoved = {x: 0, y: 0}

function EditableMap(props) {
  const {fillPickerFocusedDisplacementStart, setFillPickerFocusedDisplacementStart, fillPickerFocused, fillPickerFocusedInterface, setLastPngPreview, setEyedropperOpened, setEyedropperSetter, eyedropperSetter, eyedropperOpened, lastPngPreview, assets, setAssets, effects, moved, setMoved, mapSvgPath, boosting, defaultMarkerStyle, selectedMarker, setSelectedMarker, markers, setMarkers, eraserSize, penCachedImage, penSize, penColor, annotations, setAnnotations, currentTool, currentZoom, setCurrentZoom, mapDimensions, territories, defaultStyle, selectedTerritory, defaultMapCSSStyle, setSelectedTerritory, territoriesHTML, defaultDataVisualizer, defaultValue, onMapDrawn} = props
  const [currentlyDrawingNode, setCurrentlyDrawingNode] = useState(null)
  const [lastPoint, setLastPoint] = useState(null)
  const [currentlyMovingMarker, setCurrentlyMovingMarker] = useState(null)
  const [movingMarkerStartingPositionMouse, setMovingMarkerStartingPositionMouse] = useState({x: null, y: null})
  const [movingMarkerStartingPosition, setMovingMarkerStartingPosition] = useState({x: null, y: null})
  const [currentlyMoving, setCurrentlyMoving] = useState(false)
  const [movingStartPosition, setMovingStartPosition] = useState(null)
  const [movingMouseStartPosition, setMovingMouseStartPosition] = useState(null)
  const [eyedropperMousePosition, setEyedropperMousePosition] = useState({x: 0, y: 0})
  const [eyedropperImageData, setEyedropperImageData] = useState(null)
  const [fillPickerFocusedMousePositionStart, setFillPickerFocusedMousePositionStart] = useState(null)
  const eyedropperCanvasRef = useRef()
  const eyedropperImageRef = useRef()

  let defs = <></>
  let mobile = isMobile()
  let shownTerritories = territories
    .filter(territory => {
      return !territory.hidden
    })

  let parsedScale = currentZoom

  if(eyedropperOpened && !eyedropperImageData) {
    let context = document.createElement("canvas")
    context.width = mapDimensions.width
    context.height = mapDimensions.height
    context = context.getContext("2d")
    const image = new Image()
    image.onload = function() {
      context.drawImage(image, 0, 0, mapDimensions.width, mapDimensions.height)
      setEyedropperImageData(context)  
    }
    image.src = lastPngPreview
  }

  useEffect(() => {
    if(!lastPngPreview || !eyedropperOpened || !eyedropperImageData) {
      console.log("this maybe?")
      return
    }
    let eyedropperImageBoundingBox = eyedropperImageRef.current.getBoundingClientRect()
    let eyedropperImageMousePosition = {
      x: eyedropperMousePosition.x - eyedropperImageBoundingBox.left,
      y: eyedropperMousePosition.y - eyedropperImageBoundingBox.top
    }
    let canvasContext = eyedropperCanvasRef.current.getContext("2d")
    let scale = eyedropperImageRef.current.offsetWidth / mapDimensions.width
    let color = eyedropperImageData.getImageData(Math.round(eyedropperImageMousePosition.x / scale), Math.round(eyedropperImageMousePosition.y / scale), 1, 1).data
    canvasContext.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
    canvasContext.rect(0, 0, 150, 150)
    canvasContext.fill()
  }, [eyedropperMousePosition])

  function updateFillPickerFocused(assetUpdateData) {
    let toReturn = null
    setAssets(assets.map(asset => {
      if(asset.id == fillPickerFocused.id) {
        toReturn = {
          ...asset,
          ...assetUpdateData
        }
        return toReturn
      } else {
        return asset
      }
    }))
    return toReturn
  }

  return (
    <Gesture enablePinch direction="all" onPanMove={function(data) {
      if(fillPickerFocused) {
        updateFillPickerFocused({
          displaceX: fillPickerFocusedDisplacementStart.displaceX + data.moveStatus.x,
          displaceY: fillPickerFocusedDisplacementStart.displaceY + data.moveStatus.y
        })
      }
    }} onPinchStart={function(data) {
      pinchStartZoom = currentZoom
      pinchStartMoved = moved
    }} onPinchIn={function(data) {
      if(fillPickerFocused) {
        setFillPickerFocusedDisplacementStart(
          updateFillPickerFocused({
            scale: fillPickerFocusedDisplacementStart.scale * data.scale
          })
        )
      } else {
        setCurrentZoom(Math.max(pinchStartZoom * data.scale, 0.25))
      }
    }} onPinchOut={function(data) {
      if(fillPickerFocused) {
        setFillPickerFocusedDisplacementStart(
          updateFillPickerFocused({
            scale: fillPickerFocusedDisplacementStart.scale * data.scale
          })
        )
      } else {
        setCurrentZoom(Math.min(pinchStartZoom * data.scale, 3))
      }
    }} onPinchMove={function(data) {
      if(!fillPickerFocused) {
        setMoved({
          x: data.moveStatus.x,
          y: data.moveStatus.y
        })
      }
    }}>
      <div className={currentTool} id="map-div" style={{position: "absolute", left: "0", top: "0", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}} onMouseDown={mobile ? null : function(event) {
        if(fillPickerFocused) {
          setFillPickerFocusedMousePositionStart({x: event.clientX, y: event.clientY})
          return
        }
        
        if(event.target.id == "map-div" || event.target.id == "map-svg") {
          setSelectedTerritory(null)
        }

        if(currentTool == "pen" && !eyedropperOpened) {
          var mapRect = document.getElementById("map-svg").getBoundingClientRect()
          var [mouseX, mouseY] = [(event.clientX - mapRect.x) / currentZoom, (event.clientY - mapRect.y) / currentZoom]

          let context = penCachedImage.getContext("2d")
          if(selectedTerritory) {
            context.save()
            if(Array.isArray(selectedTerritory)) {
              let fullPath = ""
              for(let i = 0; i != selectedTerritory.length; i++) {
                fullPath += "M 0,0 " + selectedTerritory[i].path
              }
              context.clip(new Path2D(fullPath))
            } else {
              context.clip(new Path2D(selectedTerritory.path))
            }
          }
          context.beginPath()
          context.arc(mouseX, mouseY, penSize, 0, 2 * Math.PI)
          context.fillStyle = penColor
          context.fill()
          setLastPoint({x: mouseX, y: mouseY})
          setCurrentlyDrawingNode(true)
          onMapDrawn()
          drawnOnMap = true
        } else if(currentTool == "eraser") {
          var mapRect = document.getElementById("map-svg").getBoundingClientRect()
          var [mouseX, mouseY] = [(event.clientX - mapRect.x) / currentZoom, (event.clientY - mapRect.y) / currentZoom]

          let context = penCachedImage.getContext("2d")
          if(selectedTerritory) {
            context.save()
            if(Array.isArray(selectedTerritory)) {
              let fullPath = ""
              for(let i = 0; i != selectedTerritory.length; i++) {
                fullPath += "M 0,0 " + selectedTerritory[i].path
              }
              context.clip(new Path2D(fullPath))
            } else {
              context.clip(new Path2D(selectedTerritory.path))
            }
          }
          context.save()
          context.globalCompositeOperation = "destination-out"
          context.beginPath()
          context.arc(mouseX, mouseY, eraserSize, 0, 2 * Math.PI)
          context.fill()
          context.restore()

          setLastPoint({x: mouseX, y: mouseY})
          setCurrentlyDrawingNode(true)
          onMapDrawn()
        } else if(currentTool == "marker") {
          let territories = document.elementsFromPoint(event.pageX, event.pageY)
          let hoveringTerritories = false
          for(let i = 0; i != territories.length; i++) {
            if(territories[i].getAttribute("class") == "territory-path") {
              hoveringTerritories = true
              break
            }
          }
          if(!hoveringTerritories) {
            setSelectedMarker(null)
          }
        } else if(currentTool == "move") {
          setCurrentlyMoving(true)
          setMovingStartPosition({
            x: moved.x,
            y: moved.y
          })
          setMovingMouseStartPosition({
            x: event.clientX,
            y: event.clientY
          })
        }
      }} onWheel={function(event) {
        if(fillPickerFocused) {
          if(event.deltaY > 0) {
            
            setFillPickerFocusedDisplacementStart(
              updateFillPickerFocused({scale: fillPickerFocusedDisplacementStart.scale - 0.1})
            )
          } else {
            setFillPickerFocusedDisplacementStart(
              updateFillPickerFocused({scale: fillPickerFocusedDisplacementStart.scale + 0.1})
            )
          }
          return
        }
        if(event.deltaY > 0) {
          let unrounded = Math.max(currentZoom + ((0 - currentZoom) / 5) || 0.1, 0.25)
          setCurrentZoom(roundToTwo(unrounded))
        } else {
          let unrounded = Math.min(currentZoom - ((0 - currentZoom) / 5) || 0.1, 3)
          setCurrentZoom(roundToTwo(unrounded))
        }
      }} onMouseUp={mobile ? null : function(event) {
        if(fillPickerFocusedMousePositionStart) {
          setFillPickerFocusedMousePositionStart(null)
        }
        selectingTerritories = false
        setCurrentlyDrawingNode(false)
        if(currentTool == "pen" || currentTool == "eraser" && selectedTerritory) {
          penCachedImage.getContext("2d").restore()
        }

        if(currentlyMovingMarker) {
          dragging = false
          setCurrentlyMovingMarker(null)
        }

        setCurrentlyMoving(false)
      }} onMouseMove={mobile ? null : function(event) {
        if(fillPickerFocused && fillPickerFocusedMousePositionStart) {
          // fillPickerFocused is either null or a function
          let delta = {
            x: fillPickerFocusedMousePositionStart.x - event.clientX,
            y: fillPickerFocusedMousePositionStart.y - event.clientY
          }
          lastAssetDisplacementData = setFillPickerFocusedDisplacementStart(updateFillPickerFocused({
            displaceX: delta.x + fillPickerFocused.displaceX,
            displaceY: delta.y + fillPickerFocused.displaceY
          }))
          return
        }
        if(currentlyDrawingNode) {
          if(currentTool == "pen") {
            let mapRect = document.getElementById("map-svg").getBoundingClientRect()
            let mouseX = (event.clientX - mapRect.x) / currentZoom
            let mouseY = (event.clientY - mapRect.y) / currentZoom
    
            let context = penCachedImage.getContext("2d")
            context.beginPath()
            context.arc(mouseX, mouseY, penSize, 0, 2 * Math.PI)
            context.fillStyle = penColor
            context.fill()
            context.beginPath()
            context.moveTo(mouseX, mouseY)
            context.lineTo(lastPoint.x, lastPoint.y)
            context.strokeStyle = penColor
            context.lineWidth = penSize * 2
            context.stroke()

            setLastPoint({x: mouseX, y: mouseY})
            onMapDrawn()
          } else if(currentTool == "eraser") {
            let mapRect = document.getElementById("map-svg").getBoundingClientRect()
            let mouseX = (event.clientX - mapRect.x) / currentZoom
            let mouseY = (event.clientY - mapRect.y) / currentZoom

            let context = penCachedImage.getContext("2d")
            context.save()
            context.globalCompositeOperation = "destination-out"
            context.beginPath()
            context.arc(mouseX, mouseY, eraserSize, 0, 2 * Math.PI)
            context.fillStyle = penColor
            context.fill()
            context.beginPath()
            context.moveTo(mouseX, mouseY)
            context.lineTo(lastPoint.x, lastPoint.y)
            context.strokeStyle = penColor
            context.lineWidth = eraserSize * 2
            context.stroke()
            context.restore()

            setLastPoint({x: mouseX, y: mouseY})
            onMapDrawn()
          }
        } else if(currentTool == "marker") {
          if(currentlyMovingMarker) {
            let mapRect = document.getElementById("map-svg").getBoundingClientRect()
            let mouseX = (event.clientX - mapRect.x) / currentZoom
            let mouseY = (event.clientY - mapRect.y) / currentZoom
            let delta = {
              x: mouseX - movingMarkerStartingPositionMouse.x,
              y: mouseY - movingMarkerStartingPositionMouse.y
            }
            let newPosition = {
              x: delta.x + movingMarkerStartingPosition.x,
              y: delta.y + movingMarkerStartingPosition.y
            }
            setMarkers(markers.map(marker => {
              if(marker.index == currentlyMovingMarker) {
                return {
                  ...marker,
                  ...newPosition
                }
              } else {
                return marker
              }
            }))
          }
        }
        if(currentlyMoving) {
/*           let delta = {
            x: event.clientX - event.touches[event.touches.length - 1].clientX + movingStartPosition.x,
            y: event.clientY - event.touches[event.touches.length - 1].clientY + movingStartPosition.y
          }
          console.log(event) */
          setMoved({
            x: movingStartPosition.x + (event.clientX - movingMouseStartPosition.x),
            y: movingStartPosition.y + (event.clientY - movingMouseStartPosition.y)
          })
        }
      }} onTouchStart={!mobile ? null : function(event) {
        if(currentTool == "pen") {
          var mapRect = document.getElementById("map-svg").getBoundingClientRect()
          var [mouseX, mouseY] = [(event.touches[0].clientX - mapRect.x) / currentZoom, (event.touches[0].clientY - mapRect.y) / currentZoom]

          let context = penCachedImage.getContext("2d")
          if(selectedTerritory) {
            context.save()
            if(Array.isArray(selectedTerritory)) {
              let fullPath = ""
              for(let i = 0; i != selectedTerritory.length; i++) {
                fullPath += "M 0,0 " + selectedTerritory[i].path
              }
              context.clip(new Path2D(fullPath))
            } else {
              context.clip(new Path2D(selectedTerritory.path))
            }
          }
          context.beginPath()
          context.arc(mouseX, mouseY, penSize, 0, 2 * Math.PI)
          context.fillStyle = penColor
          context.fill()

          setLastPoint({x: mouseX, y: mouseY})
          setCurrentlyDrawingNode(true)
          onMapDrawn()
          drawnOnMap = true
        } else if(currentTool == "eraser") {
          var mapRect = document.getElementById("map-svg").getBoundingClientRect()
          var [mouseX, mouseY] = [(event.clientX - mapRect.x) / currentZoom, (event.clientY - mapRect.y) / currentZoom]

          let context = penCachedImage.getContext("2d")
          if(selectedTerritory) {
            context.save()
            if(Array.isArray(selectedTerritory)) {
              let fullPath = ""
              for(let i = 0; i != selectedTerritory.length; i++) {
                fullPath += "M 0,0 " + selectedTerritory[i].path
              }
              context.clip(new Path2D(fullPath))
            } else {
              context.clip(new Path2D(selectedTerritory.path))
            }
          }
          context.save()
          context.globalCompositeOperation = "destination-out"
          context.beginPath()
          context.arc(mouseX, mouseY, eraserSize, 0, 2 * Math.PI)
          context.fill()
          context.restore()

          setLastPoint({x: mouseX, y: mouseY})
          setCurrentlyDrawingNode(true)
          onMapDrawn()
        } else if(currentTool == "move") {
          setCurrentlyMoving(true)
          setMovingStartPosition({
            x: moved.x,
            y: moved.y
          })
          setMovingMouseStartPosition({
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
          })
        } else if(currentTool == "cursor") {
          if(event.target.id == "map-div" || event.target.id == "map-svg") {
            setSelectedTerritory(null)
          }
        } else if(currentTool == "marker") {
          let territories = document.elementsFromPoint(event.touches[0].pageX, event.touches[0].pageY)
          let hoveringTerritories = false
          for(let i = 0; i != territories.length; i++) {
            if(territories[i].getAttribute("class") == "territory-path") {
              hoveringTerritories = true
              break
            }
          }
          if(!hoveringTerritories) {
            setSelectedMarker(null)
          }
        }
      }} onTouchMove={!mobile ? null : function(event) {
        if(currentlyMoving) {
          let delta = {
            x: event.touches[0].clientX + movingStartPosition.x,
            y: event.touches[0].clientY + movingStartPosition.y
          }
          console.log(movingStartPosition)
          
          setMoved(delta)
        }

      }} onTouchEnd={!mobile ? null : function(event) {
        selectingTerritories = false

        if(currentTool == "pen" || currentTool == "eraser" && selectedTerritory) {
          penCachedImage.getContext("2d").restore()
        }

        setCurrentlyMoving(false)
      }}>
        {
          eyedropperOpened && lastPngPreview
            ? <div style={{maxHeight: "100%", maxWidth: "100%", display: "flex", flexDirection: "column", alignItems: "center"}}>
              <p id="eyedropper-label" style={{textAlign: "center", color: "white", fontFamily: "rubik"}}>Hover over the map and click to pick a color.</p>
              <img style={{width: "calc(100% - 20px)", cursor: "crosshair"}} onMouseDown={mobile ? null : function(event) {
                if(!lastPngPreview || !eyedropperOpened || !eyedropperImageData) {
                  return
                }
                let eyedropperImageBoundingBox = eyedropperImageRef.current.getBoundingClientRect()
                let eyedropperImageMousePosition = {
                  x: eyedropperMousePosition.x - eyedropperImageBoundingBox.left,
                  y: eyedropperMousePosition.y - eyedropperImageBoundingBox.top
                }
                let color = eyedropperImageData.getImageData(eyedropperImageMousePosition.x, eyedropperImageMousePosition.y, 1, 1).data
                setEyedropperOpened(false)
                setEyedropperMousePosition({x: 0, y: 0})
                eyedropperSetter(color)
                setEyedropperSetter(null)
                setEyedropperImageData(null)
                setLastPngPreview(null)
              }} onTouchEnd={!mobile ? null : function() {
                if(!lastPngPreview || !eyedropperOpened || !eyedropperImageData) {
                  return
                }
                let eyedropperImageBoundingBox = eyedropperImageRef.current.getBoundingClientRect()
                let eyedropperImageMousePosition = {
                  x: eyedropperMousePosition.x - eyedropperImageBoundingBox.left,
                  y: eyedropperMousePosition.y - eyedropperImageBoundingBox.top
                }
                let scale = eyedropperImageRef.current.offsetWidth / mapDimensions.width
                let color = eyedropperImageData.getImageData(eyedropperImageMousePosition.x / scale, eyedropperImageMousePosition.y / scale, 1, 1).data
                setEyedropperOpened(false)
                setEyedropperMousePosition({x: 0, y: 0})
                eyedropperSetter(color)
                setEyedropperSetter(null)
                setEyedropperImageData(null)
                setLastPngPreview(null)
              }} ref={eyedropperImageRef} src={lastPngPreview} onMouseMove={mobile ? null : function(event) {
                setEyedropperMousePosition({x: event.clientX, y: event.clientY})
              }} onTouchMove={!mobile ? null : function(event) {
                setEyedropperMousePosition({x: event.touches[0].clientX, y: event.touches[0].clientY})
              }}></img>
              <canvas ref={eyedropperCanvasRef} width="150px" height="150px" style={{borderRadius: "50%", position: "absolute", left: eyedropperMousePosition.x + 10 + "px", top: eyedropperMousePosition.y + 10 + "px"}}></canvas>
            </div>
            : <>
              {
                fillPickerFocused
                  ? <div style={{maxWidth: "calc(100% - 40px)", height: "60px", marginBottom: "20px", boxShadow: "#00000059 -7px 12px 60px", borderRadius: "10px", backgroundColor: "#455077", width: "1200px"}}>
                    {fillPickerFocusedInterface}
                  </div>
                  : null
              }
              <canvas id="map-svg" width={mapDimensions.width} height={mapDimensions.height} style={{
                width: fillPickerFocused ? "1200px" : null,
                minWidth: fillPickerFocused ? null : (mapDimensions.width + "px"),
                minHeight: fillPickerFocused ? null : mapDimensions.height + "px",
                height: fillPickerFocused ? "800px" : null,
                maxHeight: fillPickerFocused ? "calc(100% - 120px)" : null,
                maxWidth: "calc(100% - 40px)",
                transform: fillPickerFocused ? null : `translate(-50%,-50%) translate(${moved.x}px, ${moved.y}px) scale(${parsedScale})`,
                transition: "",
                position: fillPickerFocused ? null : "absolute",
                top: "50%",
                left: "50%"
              }} onTouchMove={!mobile ? null : function(event) {
                if(currentlyDrawingNode) {
                  let clientX = event.touches[0].clientX;
                  let clientY = event.touches[0].clientY;
                  if(currentTool == "pen") {
                    let mapRect = document.getElementById("map-svg").getBoundingClientRect()
                    let mouseX = (clientX - mapRect.x) / currentZoom
                    let mouseY = (clientY - mapRect.y) / currentZoom
            
                    let context = penCachedImage.getContext("2d")
                    context.beginPath()
                    context.arc(mouseX, mouseY, penSize, 0, 2 * Math.PI)
                    context.fillStyle = penColor
                    context.fill()
                    context.beginPath()
                    context.moveTo(mouseX, mouseY)
                    context.lineTo(lastPoint.x, lastPoint.y)
                    context.strokeStyle = penColor
                    context.lineWidth = penSize * 2
                    context.stroke()
          
                    setLastPoint({x: mouseX, y: mouseY})
                    onMapDrawn()
                  } else if(currentTool == "eraser") {
                    let mapRect = document.getElementById("map-svg").getBoundingClientRect()
                    let mouseX = (clientX - mapRect.x) / currentZoom
                    let mouseY = (clientY - mapRect.y) / currentZoom
          
                    let context = penCachedImage.getContext("2d")
                    context.save()
                    context.globalCompositeOperation = "destination-out"
                    context.beginPath()
                    context.arc(mouseX, mouseY, eraserSize, 0, 2 * Math.PI)
                    context.fillStyle = penColor
                    context.fill()
                    context.beginPath()
                    context.moveTo(mouseX, mouseY)
                    context.lineTo(lastPoint.x, lastPoint.y)
                    context.strokeStyle = penColor
                    context.lineWidth = eraserSize * 2
                    context.stroke()
                    context.restore()
          
                    onMapDrawn()
                    setLastPoint({x: mouseX, y: mouseY})
                  }
                }
                if(currentTool == "marker") {
                  if(currentlyMovingMarker) {
                    let mapRect = document.getElementById("map-svg").getBoundingClientRect()
                    let mouseX = (event.touches[0].clientX - mapRect.x) / currentZoom
                    let mouseY = (event.touches[0].clientY - mapRect.y) / currentZoom
                    let delta = {
                      x: mouseX - movingMarkerStartingPositionMouse.x,
                      y: mouseY - movingMarkerStartingPositionMouse.y
                    }
                    let newPosition = {
                      x: delta.x + movingMarkerStartingPosition.x,
                      y: delta.y + movingMarkerStartingPosition.y
                    }
                    setMarkers(markers.map(marker => {
                      if(marker.index == currentlyMovingMarker) {
                        return {
                          ...marker,
                          ...newPosition
                        }
                      } else {
                        return marker
                      }
                    }))
                  }
                }
                
                if(selectingTerritories && currentTool == "cursor") {
                  let clientX = event.touches[0].clientX;
                  let clientY = event.touches[0].clientY;
                  let element = document.elementFromPoint(clientX, clientY)
                  if(element.dataset.index) {
                    let territory = territories[element.dataset.index]
                    if(Array.isArray(selectedTerritory) && selectedTerritory.some(selectedTerritoryPiece => territory.index == selectedTerritoryPiece.index)) {
                      return
                    } else if(selectedTerritory.index == territory.index) {
                      return
                    }
                    setSelectedTerritory(createArray(selectedTerritory, territory))
                  }
                }
              }} ref={ref => {
                if(ref) {
                  let canvasContext = ref.getContext("2d")
                  shownTerritories.forEach((territory) => {
                    let territoryFill = territory.fill || defaultStyle.fill
                    let territoryOutlineColor = territory.outlineColor || defaultStyle.outlineColor
                    let territoryOutlineSize = territory.outlineSize || defaultStyle.outlineSize
                    let territoryPath = new Path2D(territory.path)
                    
                    canvasContext.fillStyle = territoryFill.getBackgroundCSS()
                    console.log(territoryFill)
                    canvasContext.strokeStyle = territoryOutlineColor
                    canvasContext.lineWidth = territoryOutlineSize
                    canvasContext.fill(territoryPath)
                    canvasContext.stroke(territoryPath)
                  })
                }
              }}>

              </canvas>
              <svg id="map-svg">
                {
                  shownTerritories
                    .map((territory) => {
                      let style = getTerritoryComputedStyle(territory, defaultStyle, territoriesHTML[territory.index])
                      defs = <>
                        {defs}
                        {style.defs}
                      </>
                      let selected = false
                      if(selectedTerritory) {
                        if(Array.isArray(selectedTerritory)) {
                          selected = selectedTerritory.some(selectedTerritoryPiece => territory.index == selectedTerritoryPiece.index)
                        } else {
                          selected = selectedTerritory.index == territory.index
                        }
                      }
                      return <g className="territory" key={territory.index} style={selectedTerritory ? {opacity: selected ? "1" : "0.3", ...defaultMapCSSStyle} : defaultMapCSSStyle}>
                        <path
                          className="territory-path"
                          data-index={territory.index}
                          d={territory.path}
                          fill={style.fill}
                          stroke={style.outlineColor}
                          strokeWidth={style.outlineSize}
                          style={defaultMapCSSStyle}
                          onMouseDown={mobile ? null :
                            function(event) {
                              if(fillPickerFocused) {
                                return
                              }
                              if(currentTool == "cursor") {
                                if(selectedTerritory && (territory.index == selectedTerritory.index)) {
                                  setSelectedTerritory(null)
                                } else {
                                  setSelectedTerritory(territory)
                                  selectingTerritories = true
                                }
                              } else if(currentTool == "marker") {
                                if(!dragging) {
                                  let markersElements = Array.from(document.getElementsByClassName("marker-annotation"))
                                  for(let i = 0; i != markersElements.length; i++) {
                                    if(markersElements[i].matches(":hover")) {
                                      return
                                    }
                                  }
                        
                                  let mapRect = document.getElementById("map-svg").getBoundingClientRect()
                                  let mouseX = (event.clientX - mapRect.x) / currentZoom
                                  let mouseY = (event.clientY - mapRect.y) / currentZoom
                        
                                  let newMarker = {index: ++markerIndex, x: mouseX, y: mouseY, width: 29, height: 40, hidden: false}
                                  setSelectedMarker(newMarker)
                        
                                  setMarkers([
                                    ...markers,
                                    newMarker
                                  ])
                                }
                              }
                            }
                          }
                          onTouchStart={!mobile ? null :
                            function(event) {
                              if(currentTool == "cursor") {
                                if(selectedTerritory && (territory.index == selectedTerritory.index)) {
                                  setSelectedTerritory(null)
                                } else {
                                  setSelectedTerritory(territory)
                                }
                                selectingTerritories = true
                              } else if(currentTool == "pen") {
                                var mapRect = document.getElementById("map-svg").getBoundingClientRect()
                                let clientX = event.touches[0].clientX;
                                let clientY = event.touches[0].clientY;
                                var [mouseX, mouseY] = [(clientX - mapRect.x) / currentZoom, (clientY - mapRect.y) / currentZoom]
                        
                                let context = penCachedImage.getContext("2d")
                                context.beginPath()
                                context.arc(mouseX, mouseY, penSize, 0, 2 * Math.PI)
                                context.fillStyle = penColor
                                context.fill()
                        
                                setLastPoint({x: mouseX, y: mouseY})
                                setCurrentlyDrawingNode(true)
                                drawnOnMap = true
                              } else if(currentTool == "marker") {
                                if(!dragging) {
                                  let markersElements = Array.from(document.getElementsByClassName("marker-annotation"))
                        
                                  let mapRect = document.getElementById("map-svg").getBoundingClientRect()
                                  let mouseX = (event.touches[0].clientX - mapRect.x) / currentZoom
                                  let mouseY = (event.touches[0].clientY - mapRect.y) / currentZoom
                        
                                  let newMarker = {index: ++markerIndex, x: mouseX, y: mouseY, width: 29, height: 40, hidden: false}
                                  setSelectedMarker(newMarker)
                        
                                  setMarkers([
                                    ...markers,
                                    newMarker
                                  ])
                                }
                              }
                            }
                          }
                          onTouchEnd={!mobile ? null :
                            function(event) {
                              selectingTerritories = false
                            }
                          }
                          onMouseEnter={mobile ? null :
                            function(event) {
                              if(selectingTerritories) {
                                if(Array.isArray(selectedTerritory) && selectedTerritory.some(selectedTerritoryPiece => territory.index == selectedTerritoryPiece.index)) {
                                  return
                                } else if(selectedTerritory.index == territory.index) {
                                  return
                                }
                                setSelectedTerritory(createArray(selectedTerritory, territory))
                              }
                            }
                          }
                          filter={/* effects.innerShadow.enabled ? "url(#inner-shadow)" :  */null}
                        ></path>
                        {boosting ? null : drawnOnMap ? <path style={{pointerEvents: "none"}} d={territory.path} fill="url(#drawn-pattern)" strokeWidth={style.outlineSize} stroke={style.outlineColor}></path> : null}
                      </g>
                    }
                  )
                }
                {
                  shownTerritories
                    .map((territory) => {
                      return (territory.dataVisualizer || defaultDataVisualizer).render(territory.boundingBox, territory.value || defaultValue, territory, territory.index + "b")
                    })
                }
                {boosting ? drawnOnMap ? <path style={{pointerEvents: "none"}} d={mapSvgPath} fill="url(#drawn-pattern)"></path> : null : null}
                {
                  markers
                    .filter((marker) => {
                      return !marker.hidden
                    })
                    .map((marker, index) => {
                      let parsedStyle = {fill: marker.fill || defaultMarkerStyle.fill, outlineColor: marker.outlineColor || defaultMarkerStyle.outlineColor, outlineSize: marker.outlineSize || defaultMarkerStyle.outlineSize}
                      defs = <>
                        {defs}
                        {parsedStyle.fill.getDefs(marker, "marker.fill")}
                        {parsedStyle.outlineColor.getDefs(marker, "marker.outline-color")}
                      </>
        
                      let selected = selectedMarker ? marker.index == selectedMarker.index : true
        
                      return <path onTouchStart={!mobile ? null : function(event) {
                        if(selectedMarker && selectedMarker.index == marker.index) {
                          setSelectedMarker(null)
                          return
                        }
                        
                        let mapRect = document.getElementById("map-svg").getBoundingClientRect()
                        let mouseX = (event.touches[0].clientX - mapRect.x) / currentZoom
                        let mouseY = (event.touches[0].clientY - mapRect.y) / currentZoom
        
                        dragging = true
                        setSelectedMarker(marker)
                        setCurrentlyMovingMarker(marker.index)
                        setMovingMarkerStartingPositionMouse({x: mouseX, y: mouseY})
                        setMovingMarkerStartingPosition({x: marker.x, y: marker.y})
                      }} onMouseDown={mobile ? null : function(event) {
                        if(selectedMarker && selectedMarker.index == marker.index) {
                          setSelectedMarker(null)
                          return
                        }
                        
                        let mapRect = document.getElementById("map-svg").getBoundingClientRect()
                        let mouseX = (event.clientX - mapRect.x) / currentZoom
                        let mouseY = (event.clientY - mapRect.y) / currentZoom
        
                        dragging = true
                        setSelectedMarker(marker)
                        setCurrentlyMovingMarker(marker.index)
                        setMovingMarkerStartingPositionMouse({x: mouseX, y: mouseY})
                        setMovingMarkerStartingPosition({x: marker.x, y: marker.y})
                      }} className="marker-annotation" fill={parsedStyle.fill.getBackground(marker, "marker.fill")} stroke={parsedStyle.outlineColor.getBackground(marker, "marker.outline-color")} strokeWidth={parsedStyle.outlineSize} key={marker.index} style={{opacity: selected ? 1 : 0.3, transition: "opacity 0.3s", transform: `translate(${marker.x - marker.width / 2}px, ${marker.y - marker.height}px)`}} d="M13.4897 0.0964089C11.6959 0.29969 10.6697 0.518609 9.51035 0.948628C6.43963 2.09795 3.87025 4.20113 2.12339 7.00798C0.478362 9.65846 -0.281484 13.0908 0.0945223 16.1557C0.705532 21.0891 4.23059 27.8913 10.0744 35.4283C11.453 37.2109 13.2312 39.3454 13.6386 39.7129C14.1791 40.1976 14.8371 40.1976 15.3776 39.7129C15.7849 39.3454 17.5631 37.2109 18.9418 35.4283C24.1981 28.6496 27.5743 22.4887 28.6397 17.7037C28.9138 16.4762 29 15.6787 29 14.3965C28.9922 10.6436 27.4881 7.05489 24.7699 4.34968C22.5296 2.10577 19.8897 0.753165 16.7798 0.244961C16.0435 0.127683 14.0224 0.0338607 13.4897 0.0964089ZM15.4246 7.32854C18.3465 7.71947 20.767 9.81483 21.5582 12.6373C21.7697 13.3801 21.848 14.8734 21.7227 15.6865C21.3545 18.0008 19.8348 20.0336 17.6806 21.0813C16.4116 21.699 15.1113 21.9335 13.7874 21.785C12.7534 21.6677 12.2286 21.5192 11.3355 21.0813C9.18134 20.0336 7.66165 18.0008 7.29347 15.6865C7.16814 14.8734 7.24647 13.3801 7.45798 12.6373C8.43716 9.15026 11.8917 6.84379 15.4246 7.32854Z"/>
                    })
                }
                <defs>
                  {
                    assets.map(asset => {
                      return <pattern patternTransform={`translate(${asset.displaceX}, ${asset.displaceY}) scale(${asset.scale})`} id={`asset.${asset.id}`} width="100%" height="100%" patternContentUnits="objectBoundingBox" viewBox="0 0 1 1" preserveAspectRatio="xMidYMid slice">
                          <image preserveAspectRatio="none" href={asset.data} width="1" height="1"></image>
                      </pattern>
                    })
                  }
                  {defs}
                  {
                    drawnOnMap
                      ? <pattern patternUnits="userSpaceOnUse" id="drawn-pattern" width={mapDimensions.width} height={mapDimensions.height}>
                        <image width={mapDimensions.width} height={mapDimensions.height} href={penCachedImage ? penCachedImage.toDataURL('image/png') : null}></image>
                      </pattern>
                    : null
                  }
                  {/* {
                    effects.innerShadow.enabled
                      ? <filter id="inner-shadow">
                        <feOffset dx="0" dy="0"/>                                                         
                        <feGaussianBlur stdDeviation={10 * effects.innerShadow.scale}  result="offset-blur"/>                           
                        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/> 
                        <feFlood floodColor="black" floodOpacity="1" result="color"/>                     
                        <feComposite operator="in" in="color" in2="inverse" result="shadow"/>               
                        <feComponentTransfer in="shadow" result="shadow">                                   
                            <feFuncA type="linear" slope=".75"/>
                        </feComponentTransfer>
                        <feComposite operator="over" in="shadow" in2="SourceGraphic"></feComposite>
                      </filter>
                    : null
                  } */}
                </defs>
              </svg>
            </>
            
        }
      </div>
    </Gesture>
  )
}

function AnnotationRenderer({currentTool, annotations, setAnnotations}) {
  let defs = <></>

  let defaultAnnotationStyle = {
    fill: new ColorFill(1, 136, 210, 1),
    outlineColor: new ColorFill(0, 0, 0, 1),
    outlineSize: 2
  }

  return <>
    {
      annotations.map((annotation, index) => {
        // annotations use the same thing as territories
        let style = getAnnotationComputedStyle(annotation, defaultAnnotationStyle)
        defs = <>
          {defs}
          {style.defs}
        </>
        switch(annotation.type) {
          case "ellipse":
            return <ellipse key={index} className="annotation" sharprendering="crispEdges" cx={annotation.x + annotation.width / 2} cy={annotation.y + annotation.height / 2} rx={annotation.width / 2} ry={annotation.height / 2} fill={style.fill} stroke={style.outlineColor} strokeWidth={style.outlineSize}/>
          case "rectangle":
            return <rect key={index} className="annotation" sharprendering="crispEdges" x={annotation.x} y={annotation.y} width={annotation.width} height={annotation.height} rx={annotation.borderRadius} ry={annotation.borderRadius} fill={style.fill} stroke={style.outlineColor} strokeWidth={style.outlineSize}/>
          case "text":
            return <foreignObject x={annotation.x} y={annotation.y} width={annotation.width} height={annotation.height}>
              <div xmlns="http://www.w3.org/1999/xhtml" contentEditable onInput={function(event) {
                let newAnnotation = {
                  ...annotation,
                  content: event.currentTarget.textContent
                }
                let newAnnotations = annotations.map((annotationMap, indexMap) => {
                  if(indexMap == index) {
                    return newAnnotation
                  }
                  return annotationMap
                })
                setAnnotations(newAnnotations)
              }}>
                {annotation.content}
              </div>
            </foreignObject>
        }
      })
    }
    <defs>
      {defs}
    </defs>
  </>
}

function PropertiesTopAd() {
  /* useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []) */

  return null
  // <ins className="adsbygoogle"
  // style={{display: "block"}}
  // data-ad-client="ca-pub-9613555170758176"
  // data-ad-slot="7738173653"
  // data-ad-format="auto"
  // data-full-width-responsive="true"></ins>
}

function Properties(props) {
  const {setFillPickerFocusedDisplacementStart, fillPickerFocused, setFillPickerFocused, setFillPickerFocusedInterface, eyedropperOpened, mapData, savingToCloud, assets, setAssets, effects, setEffects, recentColors, setRecentColors, currentTool, setMarkers, markers, setDefaultMarkerStyle, setSelectedMarker, defaultMarkerStyle, selectedMarker, defaultValue, setDefaultValue, defaultStyle, setDefaultStyle, selectedTerritory, setTerritories, territories, setSelectedTerritory, defaultDataVisualizer, setDefaultDataVisualizer} = props

  return (
    <div id="properties-container" className={fillPickerFocused || eyedropperOpened ? "ui-hidden" : "ui-shown"} style={{position: "absolute", top: "0px", left: "0px", height: "100%", padding: "20px", boxSizing: "border-box"}}>
      <div id="properties-panel" elevation={24} style={{display: "flex", flexDirection: "column", boxShadow: "#00000059 -7px 12px 60px", backgroundColor: "#465077", width: "100%", height: "100%", borderRadius: "10px", padding: "8px", boxSizing: "border-box"}}>
        <PropertiesTopAd></PropertiesTopAd>
        {
          currentTool == "marker" 
            ? selectedMarker
              ? <MarkerProperties setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} defaultMarkerStyle={defaultMarkerStyle} selectedMarker={selectedMarker} setSelectedMarker={function(newValue) {
                setSelectedMarker(newValue)
                setMarkers(markers.map(marker => {
                  if(marker.index == selectedMarker.index) {
                    return newValue
                  } else {
                    return marker
                  }
                }))
              }}></MarkerProperties>
              : <MarkerDefaultProperties setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} defaultMarkerStyle={defaultMarkerStyle} setDefaultMarkerStyle={setDefaultMarkerStyle}></MarkerDefaultProperties>
            : selectedTerritory
              ? <TerritoryProperties setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} defaultDataVisualizer={defaultDataVisualizer} defaultValue={defaultValue} territories={territories} setSelectedTerritory={setSelectedTerritory} selectedTerritory={selectedTerritory} setTerritories={setTerritories} defaultStyle={defaultStyle}></TerritoryProperties>
              : <DefaultsProperties setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} effects={effects} setEffects={setEffects} recentColors={recentColors} setRecentColors={setRecentColors} defaultValue={defaultValue} setDefaultValue={setDefaultValue} defaultDataVisualizer={defaultDataVisualizer} setDefaultDataVisualizer={setDefaultDataVisualizer} defaultStyle={defaultStyle} setDefaultStyle={setDefaultStyle}></DefaultsProperties>
        }
      </div>
    </div>
  )
}

function MarkerDefaultProperties({setFillPickerFocusedDisplacementStart, setFillPickerFocused, setFillPickerFocusedInterface, mapData, savingToCloud, assets, setAssets, recentColors, setRecentColors, defaultMarkerStyle, setDefaultMarkerStyle}) {
  return <div>
    <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>DEFAULT MARKER STYLE</Typography>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
    <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} color={defaultMarkerStyle.fill} onUpdate={function(fill) {
      let newStyle = {
        ...defaultMarkerStyle,
        fill: fill
      }
      setDefaultMarkerStyle(newStyle)
    }}></TerritoryFillPicker>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
    <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} color={defaultMarkerStyle.outlineColor} onUpdate={function(fill) {
      let newStyle = {
        ...defaultMarkerStyle,
        outlineColor: fill
      }
      setDefaultMarkerStyle(newStyle)
    }}></TerritoryFillPicker>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline size</Typography>
    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
      <Slider value={defaultMarkerStyle.outlineSize} style={{width: "270px"}} step={1} marks min={0} max={10} valueLabelDisplay="auto" onChange={function(event) {
        setDefaultMarkerStyle({
          ...defaultMarkerStyle,
          outlineSize: event.target.value
        })
      }}/>
    </div>
  </div>
}
function MarkerProperties({setFillPickerFocusedDisplacementStart, setFillPickerFocused, setFillPickerFocusedInterface, mapData, savingToCloud, assets, setAssets, recentColors, setRecentColors, defaultMarkerStyle, selectedMarker, setSelectedMarker}) {
  return <div>
    <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>SELECTED MARKER STYLE</Typography>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
    <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} color={selectedMarker.fill || defaultMarkerStyle.fill} style={defaultMarkerStyle} onUpdate={function(fill) {
      let newStyle = {
        ...selectedMarker,
        fill: fill
      }
      setSelectedMarker(newStyle)
    }}></TerritoryFillPicker>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
    <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} color={selectedMarker.outlineColor || defaultMarkerStyle.outlineColor} style={defaultMarkerStyle} onUpdate={function(fill) {
      let newStyle = {
        ...selectedMarker,
        outlineColor: fill
      }
      setSelectedMarker(newStyle)
    }}></TerritoryFillPicker>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline size</Typography>
    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
      <Slider value={selectedMarker.outlineSize || defaultMarkerStyle.outlineSize} style={{width: "270px"}} step={1} marks min={0} max={10} valueLabelDisplay="auto" onChange={function(event) {
        setSelectedMarker({
          ...selectedMarker,
          outlineSize: event.target.value
        })
      }}/>
    </div>
    {}
    <Button style={{marginTop: "5px"}} variant="contained" disabled={selectedMarker.fill == null && selectedMarker.outlineColor == null && selectedMarker.outlineSize == null} onClick={function() {
      let reset = {
        ...selectedMarker,
        fill: null,
        outlineColor: null,
        outlineSize: null
      }
      setSelectedMarker(reset)
    }}>Reset</Button>
  </div>
}


function DefaultsProperties(props) {
  const {setFillPickerFocusedDisplacementStart, setFillPickerFocused, setFillPickerFocusedInterface, mapData, savingToCloud, assets, setAssets, effects, setEffects, recentColors, setRecentColors, defaultValue, setDefaultValue, defaultStyle, setDefaultStyle, defaultDataVisualizer, setDefaultDataVisualizer} = props
  

  return (
    <div>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>DEFAULT TERRITORY STYLE</Typography>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
      <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} color={defaultStyle.fill} style={defaultStyle} onUpdate={function(fill) {
        let newStyle = {
          ...defaultStyle,
          fill: fill
        }
        setDefaultStyle(newStyle)
      }}></TerritoryFillPicker>
      <Typography style={{marginTop: "25px", fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>DEFAULT DATA VISUALIZATION</Typography>
      <TextField variant="filled" label="Value" size="small" sx={{marginTop: "5px", width: "100%"}} value={defaultValue} onChange={function(event) {
        setDefaultValue(event.target.value)
      }}></TextField>
      <DataVisualizerSelect dataVisualizerGetter={defaultDataVisualizer} dataVisualizerSetter={setDefaultDataVisualizer}></DataVisualizerSelect>
      <DataVisualizationEditor setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} dataVisualizerGetter={defaultDataVisualizer} dataVisualizerSetter={setDefaultDataVisualizer}></DataVisualizationEditor>
      <Typography style={{marginTop: "25px", fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>MAP STYLE</Typography>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
      <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} color={defaultStyle.outlineColor} style={defaultStyle} onUpdate={function(fill) {
        let newStyle = {
          ...defaultStyle,
          outlineColor: fill
        }
        setDefaultStyle(newStyle)
      }}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline size</Typography>
      <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
        <Slider value={defaultStyle.outlineSize} style={{width: "270px"}} step={1} marks min={0} max={10} valueLabelDisplay="auto" onChange={function(event) {
          setDefaultStyle({
            ...defaultStyle,
            outlineSize: event.target.value
          })
        }}/>
      </div>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Effects</Typography>
      <p style={{color: "white", opacity: "0.6", fontFamily: "rubik", margin: "0px", marginBottom: "5px", fontSize: "15px"}}>Warning: effects will only be shown when you download.</p>
      <FormControlLabel style={{marginTop: "-5px"}} control={
        <Switch checked={effects.innerShadow.enabled} onChange={function (event) {
          setEffects({
            ...effects,
            innerShadow: {
              ...effects.innerShadow,
              enabled: !effects.innerShadow.enabled
            }
          })
        }}/>
      } label="Inner Shadow"/>
    </div>
  )
}

function RightBar({fillPickerFocused, eyedropperOpened, territories, setTerritories, selectedTerritory, setSelectedTerritory, selectedMarker, setSelectedMarker, markers, setMarkers}) {
  const [deleteTerritoryAlertOpened, setDeleteTerritoryAlertOpened] = useState(false)
  const [deleteTerritoryTarget, setDeleteTerritoryTarget] = useState(null)
  const [deleteMarkerAlertOpened, setDeleteMarkerAlertOpened] = useState(false)
  const [deleteMarkerTarget, setDeleteMarkerTarget] = useState(null)

  return (
    <>
      <div id="right-bar-container" className={fillPickerFocused || eyedropperOpened ? "ui-hidden" : "ui-shown"} style={{position: "absolute", top: "0px", right: "0px", height: "100%", padding: "20px", boxSizing: "border-box"}}>
        <div id="right-bar" style={{boxShadow: "#00000059 -7px 12px 60px", backgroundColor: "#465077", width: "100%", height: "100%", borderRadius: "10px", boxSizing: "border-box"}}>
          <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>TERRITORIES</Typography>
          {
            territories.map(territory => {
              let selected = false
              if(selectedTerritory) {
                if(Array.isArray(selectedTerritory)) {
                  for(let i = 0; i != selectedTerritory.length; i++) {
                    if(selectedTerritory[i].index == territory.index) {
                      selected = true
                    }
                  }
                } else {
                  selected = territory.index == selectedTerritory.index
                }
              }
              return <div onMouseDown={function(event) {
                if(event.currentTarget.getElementsByClassName("buttons")[0].matches(":hover")) {
                  return
                }
                if(selectedTerritory && selectedTerritory.index == territory.index) {
                  setSelectedTerritory(null)
                } else {
                  setSelectedTerritory(territory)
                }
              }} key={"territory" + territory.index} className={`territory-div${selected ? " selected" : ""}`}>
                <span className="territory-name" onBlur={function(event) {
                  event.currentTarget.setAttribute("contenteditable", "false")
                  event.currentTarget.classList.remove("editing")

                  let newTerritory = {
                    ...territory,
                    name: event.currentTarget.textContent
                  }
                  setTerritories(territories.map(territory => {
                    if(territory.index == newTerritory.index) {
                      return newTerritory
                    } else {
                      return territory
                    }
                  }))
                }} onKeyDown={function(event) {
                  if(event.key == "Enter") {
                    event.currentTarget.setAttribute("contenteditable", "false")
                    event.currentTarget.classList.remove("editing")

                    let newTerritory = {
                      ...territory,
                      name: event.currentTarget.textContent
                    }
                    setTerritories(territories.map(territory => {
                      if(territory.index == newTerritory.index) {
                        return newTerritory
                      } else {
                        return territory
                      }
                    }))
                  }
                }}>{territory.name}</span>
                <div className="buttons">
                  <IconButton className="button" size="small" onClick={function(event) {
                    let territoryNameElement = event.currentTarget.parentElement.parentElement.children[0]
                    if(territoryNameElement.classList.contains(territory))
                      return

                    territoryNameElement.classList.add("editing")
                    territoryNameElement.setAttribute("contenteditable", "true")
                    territoryNameElement.focus()
                    document.execCommand('selectAll', false, null);
                    document.getSelection().collapseToEnd();
                  }}>
                    <EditIcon fontSize="small" style={{opacity: 0.8}}></EditIcon>
                  </IconButton>
                  <IconButton className="button" size="small" onClick={function(event) {
                    setDeleteTerritoryAlertOpened(true)
                    setDeleteTerritoryTarget(territory)
                  }}>
                    <DeleteIcon fontSize="small" style={{opacity: 0.8}}></DeleteIcon>
                  </IconButton>
                  <IconButton className="button" size="small" onClick={function(event) {
                    let newTerritory = {
                      ...territory,
                      hidden: !territory.hidden
                    }
                    setTerritories(territories.map(territory => {
                      if(territory.index == newTerritory.index) {
                        return newTerritory
                      }
                      return territory
                    }))
                  }}>
                    {
                      territory.hidden
                        ? <VisibilityOffIcon fontSize="small" style={{opacity: 0.8}}></VisibilityOffIcon>
                        : <Visibility fontSize="small" style={{opacity: 0.8}}></Visibility>
                    }
                  </IconButton>
                </div>
              </div>
            })
          }
          <Typography style={{marginTop: "10px", fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>MARKERS</Typography>
          {
            markers.length > 0
            ? markers.map(marker => {
              let selected = selectedMarker && selectedMarker.index == marker.index

              return <div onMouseDown={function(event) {
                if(event.currentTarget.getElementsByClassName("buttons")[0].matches(":hover")) {
                  return
                }
                if(selected) {
                  setSelectedMarker(null)
                } else {
                  setSelectedMarker(marker)
                }
              }} key={"marker" + marker.index} className={`territory-div${selected ? " selected" : ""}`}>
                <span>Marker {marker.index}</span>
                <div className="buttons">
                  <IconButton className="button" size="small" onClick={function(event) {
                    setDeleteMarkerAlertOpened(true)
                    setDeleteMarkerTarget(marker)
                  }}>
                    <DeleteIcon fontSize="small" style={{opacity: 0.8}}></DeleteIcon>
                  </IconButton>
                  <IconButton className="button" size="small" onClick={function(event) {
                    let newMarker = {
                      ...marker,
                      hidden: !marker.hidden
                    }
                    setMarkers(markers.map(marker => {
                      if(marker.index == newMarker.index) {
                        return newMarker
                      }
                      return marker
                    }))
                  }}>
                    {
                      marker.hidden
                        ? <VisibilityOffIcon fontSize="small" style={{opacity: 0.8}}></VisibilityOffIcon>
                        : <Visibility fontSize="small" style={{opacity: 0.8}}></Visibility>
                    }
                  </IconButton>
                </div>
              </div>
            })
            : <div style={{opacity: "0.8", fontFamily: "rubik", display: "flex", textAlign: "center", justifyContent: "center", alignItems: "center", width: "100%", height: "60px", marginTop: "5px"}}>
              You do not have any markers yet.
            </div>

          }
        </div>
      </div>
      
      <ThemeProvider theme={lightTheme}>
        <Dialog
          open={deleteTerritoryAlertOpened}
          TransitionComponent={SlideUpTransition}
          keepMounted
          onClose={function() {
            setDeleteTerritoryAlertOpened(false)
          }}
          aria-describedby="delete-territory-alert"
          PaperProps={{
            style: {
              backgroundColor: "#F2F4FE"
            }
          }}
        >
          <DialogTitle>Delete {deleteTerritoryTarget?.name || "?"}?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-territory-alert" style={{color: "rgba(0, 0, 0, 0.8)"}}>
              Are you sure you want to delete {deleteTerritoryTarget?.name || "?"}? This action is irreversible. You will never be able to add this territory back to your map, unless you start a new one.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={function() {
              setDeleteTerritoryAlertOpened(false)
            }}>Back</Button>
            <Button onClick={function() {
              setDeleteTerritoryAlertOpened(false)
              setTerritories(territories.filter(territory => {
                if(territory.index == deleteTerritoryTarget.index) {
                  return false
                }
                return true
              }))
            }}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>

      <ThemeProvider theme={lightTheme}>
        <Dialog
          open={deleteMarkerAlertOpened}
          TransitionComponent={SlideUpTransition}
          keepMounted
          onClose={function() {
            setDeleteMarkerAlertOpened(false)
          }}
          aria-describedby="delete-marker-alert"
          PaperProps={{
            style: {
              backgroundColor: "#F2F4FE"
            }
          }}
        >
          <DialogTitle>Delete marker {deleteMarkerTarget?.index || "?"}?</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-territory-alert" style={{color: "rgba(0, 0, 0, 0.8)"}}>
              Are you sure you want to delete marker {deleteMarkerTarget?.index || "?"}? This action is irreversible. Reconsider hiding the marker if you only want it hidden for now.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={function() {
              setDeleteMarkerAlertOpened(false)
            }}>Back</Button>
            <Button onClick={function() {
              setDeleteMarkerAlertOpened(false)
              setMarkers(markers.filter(marker => {
                if(marker.index == deleteMarkerTarget.index) {
                  return false
                }
                return true
              }))
            }}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  )
}



function DataVisualizationEditor({setFillPickerFocusedDisplacementStart, setFillPickerFocused, setFillPickerFocusedInterface, mapData, savingToCloud, assets, setAssets, recentColors, setRecentColors, dataVisualizerGetter, dataVisualizerSetter}) {
  switch(dataVisualizerGetter.type) {
    case "geometryDash":
      return <div>
        <Typography style={{fontSize: "20px", lineHeight: "120%", marginTop: "5px"}}>Scale</Typography>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Slider value={dataVisualizerGetter.data.scale} style={{width: "270px"}} step={0.15} marks min={0.25} max={4} valueLabelDisplay="auto" onChange={function(event) {
            let newDataVisualizer = dataVisualizerGetter.clone()
            newDataVisualizer.data.scale = event.target.value
            dataVisualizerSetter(newDataVisualizer)
          }}/>
        </div>
      </div>
    
    case "text":
      var id = generateId()
      return <>
        <Typography style={{fontSize: "20px", lineHeight: "120%"}}>Fill</Typography>
        <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} allowDynamicFill={false} color={dataVisualizerGetter.style.fill} onUpdate={function(newFill) {
          let newDataVisualizer = {
            ...dataVisualizerGetter,
            style: {
              ...dataVisualizerGetter.style,
              fill: newFill
            }
          }
          dataVisualizerGetter.setUpdate(newDataVisualizer)
          dataVisualizerSetter(dataVisualizerGetter.clone())
        }}></TerritoryFillPicker>
        <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
        <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} allowFlagFill={false} allowDynamicFill={false} color={dataVisualizerGetter.style.outlineColor} onUpdate={function(newFill) {
          let newDataVisualizer = {
            ...dataVisualizerGetter,
            style: {
              ...dataVisualizerGetter.style,
              outlineColor: newFill
            }
          }
          dataVisualizerGetter.setUpdate(newDataVisualizer)
          dataVisualizerSetter(dataVisualizerGetter.clone())
        }}></TerritoryFillPicker>
        <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline size</Typography>
        <div style={{width: "100%", display: "flex", justifyContent: "center", marginBottom: "4px"}}>
          <Slider value={dataVisualizerGetter.style.outlineSize} style={{width: "270px"}} step={1} marks min={0} max={10} valueLabelDisplay="auto" onChange={function(event) {
            let newDataVisualizer = {
              ...dataVisualizerGetter,
              style: {
                ...dataVisualizerGetter.style,
                outlineSize: event.target.value
              }
            }
            dataVisualizerGetter.setUpdate(newDataVisualizer)
            dataVisualizerSetter(dataVisualizerGetter.clone())
          }}/>
        </div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <TextField value={dataVisualizerGetter.style.fontSize} variant="filled" label="Font size" size="small" style={{width: "49%"}} onChange={function(event) {
            let newDataVisualizer = {
              ...dataVisualizerGetter,
              style: {
                ...dataVisualizerGetter.style,
                fontSize: parseInt(event.target.value) || 0
              }
            }
            dataVisualizerGetter.setUpdate(newDataVisualizer)
            dataVisualizerSetter(dataVisualizerGetter.clone())
          }}></TextField>
          <FormControl variant="filled" size="small" style={{width: "49%"}}>
            <InputLabel id={id}>Font weight</InputLabel>
            <Select
              labelId={id}
              value={dataVisualizerGetter.style.fontWeight / 100}
              defaultValue={2}
              onChange={function(event) {
                let newDataVisualizer = {
                  ...dataVisualizerGetter,
                  style: {
                    ...dataVisualizerGetter.style,
                    fontWeight: event.target.value * 100
                  }
                }
                dataVisualizerGetter.setUpdate(newDataVisualizer)
                dataVisualizerSetter(dataVisualizerGetter.clone())
              }}
            >
              <MenuItem value={1}>
                100
              </MenuItem>
              <MenuItem value={2}>
                200
              </MenuItem>
              <MenuItem value={3}>
                300
              </MenuItem>
              <MenuItem value={4}>
                400
              </MenuItem>
              <MenuItem value={5}>
                500
              </MenuItem>
              <MenuItem value={6}>
                600
              </MenuItem>
              <MenuItem value={7}>
                700
              </MenuItem>
              <MenuItem value={8}>
                800
              </MenuItem>
              <MenuItem value={9}>
                900
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <FormControl fullWidth variant="filled" size="small" style={{marginTop: "5px"}}>
          <InputLabel id={id}>Font family</InputLabel>
          <Select
            labelId={id}
            value={dataVisualizerGetter.getFontIndex()}
            onChange={function(event) {
              let newDataVisualizer = {
                ...dataVisualizerGetter,
                style: {
                  ...dataVisualizerGetter.style,
                  fontFamily: dataVisualizerGetter.getFontFromIndex(event.target.value)
                }
              }
              dataVisualizerGetter.setUpdate(newDataVisualizer)
              dataVisualizerSetter(dataVisualizerGetter.clone())
            }}
          >
            <MenuItem value={1}>
              Rubik
            </MenuItem>
            <MenuItem value={2}>
              Helvetica
            </MenuItem>
            <MenuItem value={3}>
              Oblivian
            </MenuItem>
            <MenuItem value={4}>
              Georgia
            </MenuItem>
            <MenuItem value={5}>
              Trebuchet
            </MenuItem>
            <MenuItem value={6}>
              Roboto
            </MenuItem>
            <MenuItem value={7}>
              Century Gothic
            </MenuItem>
            <MenuItem value={8}>
              Rockwell
            </MenuItem>
            <MenuItem value={9}>
              Verdana
            </MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel control={
          <Switch checked={dataVisualizerGetter.style.italic} onChange={function (event) {
            let newDataVisualizer = {
              ...dataVisualizerGetter,
              style: {
                ...dataVisualizerGetter.style,
                italic: !dataVisualizerGetter.style.italic
              }
            }
            dataVisualizerGetter.setUpdate(newDataVisualizer)
            dataVisualizerSetter(dataVisualizerGetter.clone())
          }}/>
        } label="Italic"/>
      </>
      break;
    case null:
      break;
    default:
      return <p>Error: Data visualizer type invalid.</p>
  }
}
function SecondaryDataVisualizationEditor({dataVisualizer, selectedTerritory, onChange, territories}) {
  switch(dataVisualizer.type) {
    case "geometryDash":
      return <div style={{display: "flex", flexDirection: "column"}}>
        <Typography style={{fontSize: "20px", lineHeight: "120%", marginTop: "5px"}}>Scale</Typography>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Slider value={selectedTerritory.dataVisualizerScale} style={{width: "270px"}} step={0.15} marks min={0.25} max={4} valueLabelDisplay="auto" onChange={function(event) {
            onChange({dataVisualizerScale: event.target.value})
          }}/>
        </div>
        
        <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Displace</Typography>
        <PositionSelect x={selectedTerritory.dataOffsetX} y={selectedTerritory.dataOffsetY} onChange={function(x, y) {
          onChange({dataOffsetX: x, dataOffsetY: y})
        }}/>
      </div>
    case "text":
      return <div style={{display: "flex", flexDirection: "column"}}>
        <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Displace</Typography>
        <PositionSelect x={selectedTerritory.dataOffsetX} y={selectedTerritory.dataOffsetY} onChange={function(x, y) {
          onChange({dataOffsetX: x, dataOffsetY: y})
        }}/>
      </div>
  }
}

function TerritoryProperties({setFillPickerFocusedDisplacementStart, setFillPickerFocused, setFillPickerFocusedInterface, mapData, savingToCloud, assets, setAssets, recentColors, setRecentColors, defaultDataVisualizer, selectedTerritory, setSelectedTerritory, setTerritories, defaultStyle, territories, defaultValue}) {
  // we want support for multiple selected territories as well as one only.
  function changeValueSelectedTerritory(type, object2) {
    if(type == 0) {
      let setSelectedTerritoryValue = selectedTerritory
      let setTerritoriesValue = territories
      for(let i = 0; i != setSelectedTerritoryValue.length; i++) {
        let newSelectedTerritory = { ...selectedTerritory[i], ...object2 }
        setSelectedTerritoryValue[i] = newSelectedTerritory
        setTerritoriesValue = setTerritoriesValue.map(territory => {
          if(territory.index == newSelectedTerritory.index) {
            return newSelectedTerritory
          }
          return territory
        })
      }
      setSelectedTerritory(setSelectedTerritoryValue)
      setTerritories(setTerritoriesValue)
    } else {
      let newSelectedTerritory = { ...selectedTerritory, ...object2 }
      let newTerritories = territories.map(territory => {
        if(territory.index == newSelectedTerritory.index) {
          return newSelectedTerritory
        }
        return territory
      })
      setTerritories(newTerritories)
      setSelectedTerritory(newSelectedTerritory)
    }
  }

  let territoryIdentifier = null
  let fillPickerValue = null
  let fillPickerOnUpdate = null
  let sizePickerSliderValue = null
  let sizeSliderOnChange = null
  let resetButtonStyleDisabled = true
  let outlineColorPickerValue = null
  let outlineColorOnUpdate = null
  let resetButtonStyleOnClick = null
  let valueInputValue = null
  let valueInputOnChange = null
  let secondaryDataVisualizationEditorValue = null
  let secondaryDataVisualizationEditorOnChange = null
  let resetButtonDataDisabled = true
  let resetButtonDataOnClick = null

  if(Array.isArray(selectedTerritory)) {
    territoryIdentifier = `TERRITORIES (${selectedTerritory.length})`
    fillPickerValue = selectedTerritory[0].fill || defaultStyle.fill
    fillPickerOnUpdate = function(newValue) { changeValueSelectedTerritory(0, {fill: newValue}) }
    outlineColorOnUpdate = function(newValue) { changeValueSelectedTerritory(0, {outlineColor: newValue}) }
    outlineColorPickerValue = selectedTerritory[0].outlineColor || defaultStyle.outlineColor
    sizePickerSliderValue = selectedTerritory[0].outlineSize || defaultStyle.outlineSize
    sizeSliderOnChange = function(event) { changeValueSelectedTerritory(0, {outlineSize: event.target.value}) }
    for(let i = 0; i != selectedTerritory.length; i++) {
      if(selectedTerritory[i].fill != null || selectedTerritory[i].outlineColor != null || selectedTerritory[i].outlineSize != null) {
        resetButtonStyleDisabled = false
        break
      }
    }
    resetButtonStyleOnClick = function() { changeValueSelectedTerritory(0, {fill: null, outlineColor: null, outlineSize: null})}
    valueInputValue = orEmptyString(selectedTerritory[0].value, defaultValue)
    valueInputOnChange = function(value) { changeValueSelectedTerritory(0, {value: value}) }
    secondaryDataVisualizationEditorValue = selectedTerritory[0]
    secondaryDataVisualizationEditorOnChange = function(newValue) { console.log("it doing the changing"); changeValueSelectedTerritory(0, newValue) }
    for(let i = 0; i != selectedTerritory.length; i++) {
      if(selectedTerritory[i].value != null || selectedTerritory[i].dataOffsetX != 0 || selectedTerritory[i].dataOffsetY != 0) {
        resetButtonStyleDisabled = false
        break
      }
    }
    resetButtonDataOnClick = function() { changeValueSelectedTerritory(0, {value: null, dataOffsetX: 0, dataOffsetY: 0}) }
  } else {
    territoryIdentifier = selectedTerritory.name.toUpperCase()
    fillPickerValue = selectedTerritory.fill || defaultStyle.fill
    fillPickerOnUpdate = function(newValue) { changeValueSelectedTerritory(1, {fill: newValue}) }
    outlineColorOnUpdate = function(newValue) { changeValueSelectedTerritory(1, {outlineColor: newValue}) }
    outlineColorPickerValue = selectedTerritory.outlineColor || defaultStyle.outlineColor
    sizePickerSliderValue = selectedTerritory.outlineSize || defaultStyle.outlineSize
    sizeSliderOnChange = function(event) { changeValueSelectedTerritory(1, {outlineSize: event.target.value}) }
    resetButtonStyleDisabled = selectedTerritory.fill == null && selectedTerritory.outlineColor == null && selectedTerritory.outlineSize == null
    resetButtonStyleOnClick = function() { changeValueSelectedTerritory(1, {fill: null, outlineColor: null, outlineSize: null})}
    valueInputValue = orEmptyString(selectedTerritory.value, defaultValue)
    valueInputOnChange = function(value) { changeValueSelectedTerritory(1, {value: value}) }
    secondaryDataVisualizationEditorValue = selectedTerritory
    secondaryDataVisualizationEditorOnChange = function(newValue) { changeValueSelectedTerritory(1, newValue) }
    resetButtonDataDisabled = selectedTerritory.value == null && selectedTerritory.dataOffsetX == 0 && selectedTerritory.dataOffsetY == 0
    resetButtonDataOnClick = function() { changeValueSelectedTerritory(1, {value: null, dataOffsetX: 0, dataOffsetY: 0}) }
  }

  let selectId = generateId()
  let geometryDashValue = isNaN(parseInt(valueInputValue)) ? valueInputValue == "Unrated" ? 13 : 14 : parseInt(valueInputValue)

  return (
    <div>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>SELECTED TERRITORY STYLE: {territoryIdentifier}</Typography>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
      <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} color={fillPickerValue} onUpdate={fillPickerOnUpdate}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
      <TerritoryFillPicker setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} color={outlineColorPickerValue} onUpdate={outlineColorOnUpdate}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline size</Typography>
      <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
        <Slider value={sizePickerSliderValue} style={{width: "270px"}} step={1} marks min={0} max={10} valueLabelDisplay="auto" onChange={sizeSliderOnChange}/>
      </div>
      <Button style={{marginTop: "5px"}} variant="contained" disabled={resetButtonStyleDisabled} onClick={resetButtonStyleOnClick}>Reset</Button>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid", marginTop: "25px"}}>DATA VISUALIZATION: {territoryIdentifier}</Typography>
      {
        (() => {
          switch(defaultDataVisualizer.type) {
            case null:
              return null
            case "text":
              return <TextField variant="filled" label="Text" size="small" sx={{marginTop: "5px", width: "100%"}} value={valueInputValue} onChange={function(event) {valueInputOnChange(event.target.value)}}></TextField>
            case "geometryDash":
              return <FormControl variant="filled" fullWidth style={{marginTop: "5px", marginBottom: "5px"}} size="small">
                <InputLabel id={selectId} defaultValue="">Geometry Dash Icon</InputLabel>
                <Select
                  labelId={selectId}
                  id={selectId}
                  value={geometryDashValue}
                  label="Geometry Dash Icon"
                  onChange={function(event) {
                    if(event.target.value == 13) {
                      valueInputOnChange("Unrated")
                      return
                    }
                    if(event.target.value == 14) {
                      valueInputOnChange("")
                      return
                    }
                    valueInputOnChange(event.target.value.toString())
                  }}
                >
                  <MenuItem value={14}>
                    None
                  </MenuItem>
                  <MenuItem value={13}>
                    Unrated
                  </MenuItem>
                  <MenuItem value={0}>
                    0
                  </MenuItem>
                  <MenuItem value={1}>
                    1
                  </MenuItem>
                  <MenuItem value={2}>
                    2
                  </MenuItem>
                  <MenuItem value={3}>
                    3
                  </MenuItem>
                  <MenuItem value={4}>
                    4
                  </MenuItem>
                  <MenuItem value={5}>
                    5
                  </MenuItem>
                  <MenuItem value={6}>
                    6
                  </MenuItem>
                  <MenuItem value={7}>
                    7
                  </MenuItem>
                  <MenuItem value={8}>
                    8
                  </MenuItem>
                  <MenuItem value={9}>
                    9
                  </MenuItem>
                  <MenuItem value={10}>
                    10
                  </MenuItem>
                  <MenuItem value={11}>
                    11
                  </MenuItem>
                  <MenuItem value={12}>
                    12
                  </MenuItem>
                </Select>
              </FormControl>
          }
        })()
      }
      <SecondaryDataVisualizationEditor dataVisualizer={defaultDataVisualizer} onChange={secondaryDataVisualizationEditorOnChange} selectedTerritory={secondaryDataVisualizationEditorValue}></SecondaryDataVisualizationEditor>
      <Button style={{marginTop: "5px"}} variant="contained" disabled={resetButtonDataDisabled} onClick={resetButtonDataOnClick}>Reset</Button>
    </div>
  )
}

function DataVisualizerSelect({dataVisualizerGetter, dataVisualizerSetter}) {
  const id = generateId()

  return (
    <FormControl variant="filled" fullWidth style={{marginTop: "5px", marginBottom: "5px"}} size="small">
      <InputLabel id={id} defaultValue="">Data visualizer</InputLabel>
      <Select
        labelId={id}
        id={id}
        value={dataVisualizerGetter.getTypeIndex()}
        defaultValue={2}
        label="Data visualizer"
        onChange={function(event) {
          dataVisualizerSetter(dataVisualizerGetter.convertToType(event.target.value))
        }}
      >
        <MenuItem value={0}>
          <em>None</em>
        </MenuItem>
        <MenuItem value={1}>Text</MenuItem>
        <MenuItem value={2}>Geometry Dash</MenuItem>
      </Select>
    </FormControl>
  )
}


export function TerritoryFillPicker(props) {
  const {setFillPickerFocusedDisplacementStart, setFillPickerFocused, setFillPickerFocusedInterface, mapData, savingToCloud, assets, setAssets, recentColors, lightTheme, setRecentColors, allowFlagFill, color, mode, onColorChange, onColorFillChange, onUpdate, currentTool} = props
  const [opened, setOpened] = useState(false)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [offsetTop, setOffsetTop] = useState(0)
  const containerId = generateId()
  const backgroundId = generateId()

  return (
    <div id={containerId} style={{borderTopLeftRadius: "5px", borderTopRightRadius: "5px", display: "flex", borderBottom: "1px solid #00000066", width: "100%", height: "40px", backgroundColor: lightTheme ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.09)", cursor: "pointer"}} onClick={function(event) {
      if(!document.getElementById(backgroundId).matches(":hover")) {
        setOffsetLeft(event.target.offsetLeft - 5)
        setOffsetTop(parseInt(event.target.offsetTop + event.target.offsetHeight) + 10)
        setOpened(true)
      }
    }}>
      <div style={{flexGrow: "1", padding: "6.5px", paddingRight: "0px", boxSizing: "border-box"}}>
        <div style={{background: color.getBackgroundCSS(), width: "100%", height: "100%", borderRadius: "3px"}}>
          <TerritoryFillPickerPopup setFillPickerFocusedDisplacementStart={setFillPickerFocusedDisplacementStart} setFillPickerFocused={setFillPickerFocused} setFillPickerFocusedInterface={setFillPickerFocusedInterface} mapData={mapData} savingToCloud={savingToCloud} assets={assets} setAssets={setAssets} recentColors={recentColors} setRecentColors={setRecentColors} allowFlagFill={allowFlagFill} backgroundId={backgroundId} mode={mode} onUpdate={onUpdate} setOpened={setOpened} onColorFillChange={onColorFillChange} onColorChange={onColorChange} opened={opened} top={offsetTop} left={offsetLeft} color={color} ></TerritoryFillPickerPopup>
        </div>
      </div>
      
      <div style={{width: "45px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img src="icons/color-picker-sign.svg" style={{width: "10px"}}></img>
      </div>
    </div>
  )
}

function TerritoryFillPickerPopup(props) {
  let {setFillPickerFocusedDisplacementStart, setFillPickerFocused, setFillPickerFocusedInterface, mapData, savingToCloud, assets, setAssets, recentColors, setRecentColors, color, opened, setOpened, style, onUpdate, mode, backgroundId, allowFlagFill} = props
  if(allowFlagFill !== false) {
    allowFlagFill = true
  }
  const [flagSearch, setFlagSearch] = useState("")
  let tabIndex = typeToValue(color.type)


  let flagsSearched = FLAGS.filter(flag => flag.name.toLowerCase().includes(flagSearch.toLowerCase()) || flag.id.toLowerCase().includes(flagSearch.toLowerCase()))
  flagsSearched.length = Math.min(flagsSearched.length, 10)

  let content
  switch(color.type) {
    case "color":
      content = <div style={{flexGrow: "1", display: "flex", padding: "20px", boxSizing: "border-box"}}>
        <RgbaColorPicker color={color} onChange={function(newValue) {
          color = color.clone()
          color.r = newValue.r
          color.g = newValue.g
          color.b = newValue.b
          color.a = newValue.a
          color.setUpdate(color)
          onUpdate(color)
        }}></RgbaColorPicker>
        <div style={{display: "flex", marginLeft: "20px", flexGrow: "1", flexDirection: "column"}}>
          <p style={{color: "black", fontWeight: "500", fontFamily: "rubik", margin: "0px", marginBottom: "5px"}}>RECENT COLORS</p>
          <div>
            {
              recentColors.map((recentColor, index) => {
                let sameColor = color.r == recentColor.r && color.g == recentColor.g && color.b == recentColor.b && color.a == recentColor.a
                return <div key={index} style={{outline: sameColor ? "2px black solid" : "none", marginBottom: "10px", display: "inline-flex", marginRight: "10px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: `rgba(${recentColor.r}, ${recentColor.g}, ${recentColor.b}, ${recentColor.a})`}} onClick={function() {
                  color = color.clone()
                  color.r = recentColor.r
                  color.g = recentColor.g
                  color.b = recentColor.b
                  color.a = recentColor.a
                  color.setUpdate(color)
                  onUpdate(color)
                }}></div>
              })
            }
          </div>
        </div>
      </div>
      break;
    case "flag":
      content = <div style={{display: "flex", flexDirection: "column", padding: "10px", boxSizing: "border-box", flexGrow: "1", minHeight: "0"}}>
        <TextField id="filled-basic" label="Search" variant="standard" onChange={function(event) {
          setFlagSearch(event.target.value)
        }}/>
          <div style={{overflow: "auto", flexGrow: "1", marginTop: "10px"}}>
            <Scrollbars width="100%" height="100%">
              {
                flagsSearched.map(flag => {
                  return <div onClick={function() {
                    color = color.clone()
                    color.id = flag.id
                    color.setUpdate(color)
                    onUpdate(color)
                  }} key={flag.id} style={{marginRight: "15px", display: "flex", alignItems: "center"}}>
                    <div style={{backgroundImage: `url(flags/${flag.id}.${flag.id.includes("_") ? "png" : "svg"})`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain", height: "30px", width: "40px", marginRight: "10px"}}>

                    </div>
                    <p>{flag.name}</p>
                    {
                      color.id == flag.id
                        ? <div style={{flexGrow: "1", display: "flex", justifyContent: "end"}}>
                          <CheckIcon color="success"></CheckIcon>
                        </div>
                        : <></>
                    }
                  </div>
                })
              }
              {flagSearch == "" ? <p style={{width: "100%"}}>Search to see more...</p> : <></>}
            </Scrollbars>
          </div>
      </div>
      break;
    case "image":
      content = <div style={{padding: "10px", boxSizing: "border-box", flexGrow: "1", minHeight: "0", display: "flex", flexDirection: "column"}}>
        <div id="image-fill-picker-popup">
          <label htmlFor="add-image-input" className="add">
            <AddPhotoAlternateIcon className="icon"></AddPhotoAlternateIcon>
          </label>
          <input id="add-image-input" type="file" onChange={async function(event) {
            let file = event.target.files[0]
            let data = await getBase64(file)
            setAssets([...assets, {
              id: ++lastAssetId,
              displaceX: 0,
              displaceY: 0,
              scale: 1,
              data
            }])
          }} style={{display: "none"}}></input>
          {
            assets.map(asset => {
              return <div className={"asset" + (color.assetId == asset.id ? " selected" : "")} key={asset.id} onClick={function() {
                color = color.clone()
                color.assetId = asset.id
                color.setUpdate(color)
                onUpdate(color)
              }}>
                <img src={asset.data}></img>
                <p>
                  {asset.id}
                  <IconButton className="transform-asset" size="small" style={{marginLeft: "5px", height: "25px", width: "25px"}} onClick={function(event) {
                    setFillPickerFocused(asset)
                    setFillPickerFocusedDisplacementStart(asset)
                    setFillPickerFocusedInterface(<div style={{height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                      <p style={{fontFamily: "rubik", fontSize: "22px", color: "white", marginLeft: "15px", marginTop: "0px", marginBottom: "0px"}}>Drag to displace image, zoom/scroll to scale.</p>
                      <IconButton style={{marginRight: "15px", width: "50px", height: "50px"}} onClick={function() {
                        setFillPickerFocused(false)
                        setFillPickerFocusedDisplacementStart(null)
                        setFillPickerFocusedInterface(null)
                      }}>
                        <CheckIcon></CheckIcon>
                      </IconButton>
                    </div>)
                  }}>
                    <MoreHorizIcon style={{width: "100%"}}/>
                  </IconButton>
                </p>
              </div>
            })
          }
        </div>
      </div>
      break
    default:
      content = <>
        Error :(
      </>
      break
  }

  return (
    <>
      <div className="bg" id={backgroundId} style={{contain: "content", zIndex: "10", position: "fixed", top: "0px", left: "0px", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.7)", display: opened ? "flex" : "none", alignItems: "center", justifyContent: "center"}} onClick={function(event) {
        if(event.target.className == "bg") {
          setOpened(false)
          if(color.type == "color") {
            for(let i = 0; i != recentColors.length; i++) {
              let recentColor = recentColors[i]
              if(recentColor.r == color.r && recentColor.g == color.g && recentColor.b == color.b) {
                return
              }
            }
            setRecentColors([...recentColors, {r: color.r, g: color.g, b: color.b, a: color.a}])
          }
        }
      }}>
        <div className="territory-fill-picker popup-content" style={{borderTopLeftRadius: "10px", borderTopRightRadius: "10px", width: "800px", height: "400px", display: "flex", flexDirection: "column"}}>
          <div className="popup-header" elevation={3} style={{padding: "0px", width: "100%", display: "flex", justifyContent: "space-between"}}>
            <Tabs value={tabIndex} onChange={function(event, newValue) {
              let updateStyleArgument
              switch(newValue) {
                case 0:
                  // color fill
                  onUpdate(color.toColorFill())
                  break
                case 1:
                  // flag fill
                  onUpdate(color.toFlagFill())
                  break
                case 2:
                  // image fill
                  onUpdate(color.toImageFill())
                default:
                  throw new Error("Unknown value: ", newValue)
              }
            }}>
              <Tab value={0} label="Color"></Tab>
              {allowFlagFill ? <Tab value={1} label="Flag"></Tab> : null}
              {allowFlagFill ? <Tab value={2} label="Image"></Tab> : null}
            </Tabs>
            <ClearIcon style={{marginRight: "15px"}} onClick={function() {
              setOpened(false)
              if(color.type == "color") {
                for(let i = 0; i != recentColors.length; i++) {
                  let recentColor = recentColors[i]
                  if(recentColor.r == color.r && recentColor.g == color.g && recentColor.b == color.b) {
                    return
                  }
                }
                setRecentColors([...recentColors, {r: color.r, g: color.g, b: color.b, a: color.a}])
              }
            }}></ClearIcon>
          </div>
          <ThemeProvider theme={lightTheme}>
            { content }
          </ThemeProvider>
        </div>
      </div>
    </>
  )
}

export function MapsChoiceContainer(props) {
  const {editMap, setChosenMap} = props
  const searchedMapNames = MAP_NAMES.filter(element => element.name.toLowerCase().includes(props.search.toLowerCase()))
  searchedMapNames.length = Math.min(searchedMapNames.length, 12)
  const [currentlySelectedMap, setCurrentlySelectedMap] = useState(null)
  return (
    <>
      <div id="map-choice-container">
        <div id="map-choice-scrollbars-container">
          <Scrollbars height="100px">
            <div id="map-choice-grid" style={{marginRight: "15px"}}>
              {searchedMapNames.map((element, index) => {
                let selected = currentlySelectedMap && currentlySelectedMap.id == element.id
                return <MapChoiceBox key={index} editMap={editMap} sx={4} element={element} selected={selected} onSelect={function() {
                  if(selected) {
                    setCurrentlySelectedMap(null)
                  } else {
                    setCurrentlySelectedMap(element)
                  }
                }}></MapChoiceBox>
              })}
            </div>
            {props.search == "" ? <p style={{fontFamily: "rubik"}}>Search to see more...</p> : null}
          </Scrollbars>
        </div>
        
        <Button endIcon={<CheckIcon/>} variant="contained" id="choose-map-confirm-button" disabled={currentlySelectedMap == null} onClick={function() {
          editMap(currentlySelectedMap)
        }}>
          Confirm
        </Button>
      </div>
      
    </>
    
  )
}

export function SearchBarMaps(props) {
  const {setMapSearch} = props
  return (
    <div id="maps-search-bar">
      <TextField label="Search" fullWidth variant="standard" onChange={function(event) {
        setMapSearch(event.target.value)
      }}/>
    </div>
  )
}

function MapChoiceBox(props) {
  const {onSelect, MapChoiceBox, selected} = props
  return (
    <Card variant="outlined" onClick={onSelect} style={{cursor: "pointer", border: selected ? "2px #11A7F5 solid" : null, boxSizing: "border-box"}}>
      <div style={{height: "180px", width: "100%", backgroundImage: `url(${getMapImageUrl(props.element.id)})`, backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat"}}></div>
      <CardContent style={{textAlign: "center"}}>
        <Typography style={{fontSize: "22px"}}>
          {props.element.name}
        </Typography>
      </CardContent>
    </Card>
    
  )
}

let dragging = false

window.addEventListener("mouseup", (event) => {
  dragging = false
})

function PositionSelect({x, y, onChange}) {
  let canvasRef = useRef()

  useEffect(() => {
    let canvas = canvasRef.current
    let context = canvas.getContext("2d")

    canvas.width = 300
    context.strokeStyle = "rgba(0, 0, 0, 0.5)"
    context.beginPath()
    context.moveTo(150, 0)
    context.lineTo(150, 80)
    context.stroke()
    context.beginPath()
    context.moveTo(0, 40)
    context.lineTo(300, 40)
    context.stroke()
    context.fillStyle = "rgba(0, 0, 0, 0.3)"
    context.strokeStyle = "rgba(255, 255, 255)"
    context.beginPath()
    context.ellipse(150 + x, 40 + y, 10, 10, 0, 0, Math.PI * 2)
    context.fill()
    context.stroke()
  })


  return <div>
    <canvas ref={canvasRef} width="300" height="80" style={{width: "100%", height: "80px"}} onMouseDown={function(event) {
      let canvas = canvasRef.current
      let context = canvas.getContext("2d")
      let box = canvas.getBoundingClientRect()
      let centerX = box.width / 2
      let centerY = box.height / 2
      let x = event.clientX - box.x - centerX
      let y = event.clientY - box.y - centerY
      dragging = true
      onChange(x, y)
    }} onMouseMove={function(event) {
      if(dragging) {
        let canvas = canvasRef.current
        let context = canvas.getContext("2d")
        let box = canvas.getBoundingClientRect()
        let centerX = box.width / 2
        let centerY = box.height / 2
        let x = event.clientX - box.x - centerX
        let y = event.clientY - box.y - centerY
        onChange(x, y)
      }
    }}></canvas>
    <Typography>x: {x} y: {y}</Typography>
  </div>
}



// suppressing stupid react "warnings".

/* const backup = console.error;

console.error = function filterWarnings(msg) {
  const suppressedWarnings = ['MUI: The `value` provided to the Tabs component is invalid.', "Updating a style property during rerender"];

  if (!suppressedWarnings.some(entry => msg.includes(entry))) {
    backup.apply(console, arguments);
  }
}; */

function NotFound() {
  return <h1>Not found.</h1>
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
  return(false);
}

let DiscordOauthComponentLogin = function() {
  post("/login", {
    method: "discord",
    code: getQueryVariable("code")
  }).then(function(sessionId) {
    localStorage.setItem("sessionId", sessionId)
    window.location = "/dashboard"
  })
  
  return null
}
let DiscordOauthComponentSignUp = function() {
  post("/sign-up", {
    method: "discord",
    code: getQueryVariable("code")
  }).then(function(sessionId) {
    localStorage.setItem("sessionId", sessionId)
    window.location = "/dashboard"
  })

  return null
}

function renderReactDom() {
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <GoogleOAuthProvider clientId="810830680892-nnfl3t1ctbcc9cgd0fh1dq5dsbnfj90s.apps.googleusercontent.com">
            <App></App>  
          </GoogleOAuthProvider>
        }></Route>
        <Route path="login" element={<Login/>}></Route>
        <Route path="sign-up" element={<SignUp/>}></Route>
        <Route path="discord-oauth-login" element={<DiscordOauthComponentLogin/>}></Route>
        <Route path="discord-oauth-signup" element={<DiscordOauthComponentSignUp/>}></Route>
        <Route path="dashboard" element={<Dashboard/>}></Route>
        <Route path="dashboard/:stage" element={<Dashboard/>}></Route>
        <Route path="edit-map/:id" element={<EditMap/>}></Route>
        <Route path="download" element={<Download/>}></Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </BrowserRouter>
  );  
}
if (window.cordova) {
  document.addEventListener('deviceready', () => {
    renderReactDom();
  }, false);
} else {
  renderReactDom();
}



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// react 😖
///// WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Two different references?!???!??