import React, {useState, useEffect, componentDidMount, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import './default.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { MAP_NAMES, FLAGS, COUNTRY_CODES } from "./constants"
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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { getRectFromPoints, getMapImageUrl, ajax, parseSvg, getTerritoryComputedStyle, typeToValue, generateId, orEmptyString, roundToTwo, createArray, svgToPng, download, isMobile, getAnnotationComputedStyle, convertSvgUrlsToBase64, svgToJpg, svgToWebp } from "./util"
import { ColorFill, FlagFill } from "./fill"
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
import { GeometryDashDataVisualizer, DataVisualizer } from "./dataVisualization"
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
import Slide from '@mui/material/Slide';
import VirtualScroll from "virtual-scroll"
import EditIcon from '@mui/icons-material/Edit';

const root = ReactDOM.createRoot(document.getElementById('root'));
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00A1FF'
    }
  },
  typography: {
    fontFamily: "rubik"
  },
});
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: '#00A1FF'
    }
  },
  typography: {
    fontFamily: "rubik"
  },
})


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
                <MapsChoiceContainer search={mapSearch} setStage={setStage} setChosenMap={setChosenMap}></MapsChoiceContainer>
              </div>
            </div>
          </ThemeProvider>
          break
      }
      toShow =
        <>
          <div id="navbar" ref={navbarRef}>
            <div className="content-row" id="navbar-content-row">
              <img src="./logo.svg"/>
              <div id="navbar-buttons">
                <a>Premium</a>
                <a>Create</a>
                <a>Login</a>
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

function mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle) {
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
    pathElement.setAttribute("strokeWidth", style.outlineSize)
    let pathElement2 = document.createElementNS("http://www.w3.org/2000/svg", "path")
    pathElement2.setAttribute("d", territory.path)
    pathElement2.setAttribute("fill", "url(#drawn-pattern)")
    pathElement.setAttribute("strokeWidth", "0")
    gElement.appendChild(pathElement)
    gElement.appendChild(pathElement2)
    svgElement.appendChild(gElement)
  }
  for(let i = 0; i != territories.length; i++) {
    let territory = territories[i]
    if(territory.hidden) {
      continue
    }
    svgElement.appendChild(
      domParser.parseFromString(
        ReactDOMServer.renderToStaticMarkup((territory.dataVisualizer || defaultDataVisualizer).render(territory.boundingBox, territory.value || defaultValue, territory, territory.index + "b")),
        'application/xml'
      ).firstElementChild
    )
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

function Editor({chosenMap, data}) {
  data = data || {} 
  chosenMap = data.chosenMap || chosenMap
  const [defaultStyle, setDefaultStyle] = useState(data.defaultStyle || {
    fill: new ColorFill(255, 255, 255, 1), // new ColorFill(255, 255, 255, 1),
    outlineColor: new ColorFill(0, 0, 0, 1),
    outlineSize: 1
  })
  const [defaultDataVisualizer, setDefaultDataVisualizer] = useState(new DataVisualizer())
  const [selectedTerritory, setSelectedTerritory] = useState(null)
  const [territoriesHTML, setTerritoriesHTML] = useState([])
  const [territories, setTerritories] = useState([])
  const [mapDimensions, setMapDimensions] = useState({})
  const [defaultValue, setDefaultValue] = useState("")
  const [currentZoom, setCurrentZoom] = useState(1)
  const [currentTool, setCurrentTool] = useState("cursor")
  const [annotations, setAnnotations] = useState([])
  const [penColor, setPenColor] = useState("#e00")
  const [penSize, setPenSize] = useState(10)
  const [penCachedImage, setPenCachedImage] = useState(null)
  const [refreshValue, setRefreshValue] = useState(true)
  const [eraserSize, setEraserSize] = useState(10)
  const [markers, setMarkers] = useState([])
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
  const [recentColors, setRecentColors] = useState([])
  const [deleteTerritoryAlertOpened, setDeleteTerritoryAlertOpened] = useState(false)
  const [uniteTerritoriesAlertOpened, setUniteTerritoriesAlertOpened] = useState(false)

  function getMapData() {
    return {
      chosenMap,
      defaultStyle,
      defaultDataVisualizer,
      territoriesHTML,
      territories,
      mapDimensions,
      defaultValue,
      annotations,
      markers,
      defaultMarkerStyle,
      mapSvgPath,
      recentColors,
    }
  }

  async function downloadSvg() {
    let element = await mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle)
    let base64 = btoa(unescape(encodeURIComponent(element.outerHTML)))
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.svg"
    a.href = "data:image/svg+xml;base64," + base64
    a.dispatchEvent(e)
  }
  async function downloadPng() {
    let element = await mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle)
    element = await convertSvgUrlsToBase64(element)
    let converted = await svgToPng(element.outerHTML)
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.png"
    a.href = converted
    a.dispatchEvent(e)
  }
  async function downloadJpg() {
    let element = mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle)
    element = await convertSvgUrlsToBase64(element)
    let converted = await svgToJpg(element.outerHTML)
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.jpg"
    a.href = converted
    a.dispatchEvent(e)
  }
  async function downloadWebp() {
    let element = await mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML, penCachedImage, markers, defaultMarkerStyle)
    element = await convertSvgUrlsToBase64(element)
    let converted = await svgToWebp(element.outerHTML)
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.webp"
    a.href = converted
    a.dispatchEvent(e)
  }

  useEffect(function() {
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
      <div style={{height: "100%", width: "100%", display: "flex", overflow: "hidden", backgroundColor: "#2A2E4A", backgroundImage: "none", cursor: currentTool == "rectangle" || currentTool == "ellipse" ? "crosshair" : null}}>
        <EditableMap moved={moved} setMoved={setMoved} mapSvgPath={mapSvgPath} boosting={boosting} defaultMarkerStyle={defaultMarkerStyle} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} markers={markers} setMarkers={setMarkers} eraserSize={eraserSize} penCachedImage={penCachedImage} penColor={penColor} penSize={penSize} currentTool={currentTool} currentZoom={currentZoom} setCurrentZoom={setCurrentZoom} defaultValue={defaultValue} defaultDataVisualizer={defaultDataVisualizer} mapDimensions={mapDimensions} territories={territories} defaultStyle={defaultStyle} selectedTerritory={selectedTerritory} defaultMapCSSStyle={defaultMapCSSStyle} setSelectedTerritory={setSelectedTerritory} territoriesHTML={territoriesHTML} annotations={annotations} setAnnotations={setAnnotations}></EditableMap>
        <div ref={mobileBottomDiv}>
          <Properties recentColors={recentColors} setRecentColors={setRecentColors} markers={markers} setMarkers={setMarkers} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} defaultMarkerStyle={defaultMarkerStyle} setDefaultMarkerStyle={setDefaultMarkerStyle} currentTool={currentTool} defaultValue={defaultValue} setDefaultValue={setDefaultValue} defaultDataVisualizer={defaultDataVisualizer} setDefaultDataVisualizer={setDefaultDataVisualizer} setSelectedTerritory={setSelectedTerritory} territories={territories} defaultStyle={defaultStyle} setDefaultStyle={setDefaultStyle} selectedTerritory={selectedTerritory} setTerritories={setTerritories}></Properties>
          <RightBar setMarkers={setMarkers} markers={markers} selectedMarker={selectedMarker} setSelectedMarker={setSelectedMarker} setTerritories={setTerritories} selectedTerritory={selectedTerritory} setSelectedTerritory={setSelectedTerritory} territories={territories}></RightBar>
          <Toolbar boosting={boosting} setBoosting={setBoosting} eraserSize={eraserSize} setEraserSize={setEraserSize} penSize={penSize} setPenSize={setPenSize} penColor={penColor} setPenColor={setPenColor} downloadSvg={downloadSvg} downloadPng={downloadPng} downloadJpg={downloadJpg} downloadWebp={downloadWebp} currentTool={currentTool} setCurrentTool={setCurrentTool}></Toolbar>
        </div>
        <ZoomWidget setUniteTerritoriesAlertOpened={setUniteTerritoriesAlertOpened} setDeleteTerritoryAlertOpened={setDeleteTerritoryAlertOpened} setSelectedTerritory={setSelectedTerritory} selectedTerritory={selectedTerritory} setTerritories={setTerritories} territories={territories} currentZoom={currentZoom} setCurrentZoom={setCurrentZoom}></ZoomWidget>
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
            <DialogTitle>Delete {Array.isArray(selectedTerritory) ? selectedTerritory.length + " territories" : selectedTerritory.name}?</DialogTitle>
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
                let newTerritories = territories.filter(territory => {
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
                })
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



function Toolbar({eraserSize, boosting, setBoosting, setEraserSize, penSize, setPenSize, penColor, setPenColor, setCurrentTool, currentTool, downloadSvg, downloadPng, downloadJpg, downloadWebp}) {
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
    <div id="toolbar" ref={toolbarRef}>
      <ToolbarButton name="CURSOR" icon="icons/cursor.svg" selected={currentTool == "cursor"} onClick={function() {
        setCurrentTool("cursor")
        setSpecial(null)
      }}></ToolbarButton>
      <ToolbarButton name="MOVE" icon="icons/hand.svg" selected={currentTool == "move"} onClick={function() {
        setCurrentTool("move")
        setSpecial(null)
      }}></ToolbarButton>
      <ToolbarButton name="PEN" colorPickerOpened={colorPickerOpened} setColorPickerOpened={setColorPickerOpened} setSpecial={trueSetSpecial} special="pen" penSize={penSize} setPenSize={setPenSize} penColor={penColor} setPenColor={setPenColor} icon="icons/pen.svg" selected={currentTool == "pen"} onClick={function() {
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
        ? <div style={{transform: `translate(${specialLocation}px) scale(${window.innerWidth < 1430 ? window.innerWidth < 1240 ? window.innerWidth < 1070 ? 0.8 : 0.6 : 0.7 : 0.8})`, position: "absolute", left: `calc(50% - ${toolbarRect.width / 2}px)`, top: toolbarRect.top}}>
            { special }
          </div>
        : null
    }
  </>
}
function ToolbarButton({setSpecial, colorPickerOpened, setColorPickerOpened, setEraserSize, eraserSize, penColor, penSize, setPenColor, setPenSize, name, icon, selected, onClick, special, downloadSvg, downloadPng, downloadJpg, downloadWebp}) {
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
            <div className="button size-container" style={{outline: "none"}} onClick={function(event) {
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

function ZoomWidget({setDeleteTerritoryAlertOpened, setUniteTerritoriesAlertOpened, selectedTerritory, setSelectedTerritory, setTerritories, territories, currentZoom, setCurrentZoom}) {
  return <div id="zoom-panel-positioner" style={{display: "flex"}}>
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
let drawnOnMap = false

function EditableMap(props) {
  const {moved, setMoved, mapSvgPath, boosting, defaultMarkerStyle, selectedMarker, setSelectedMarker, markers, setMarkers, eraserSize, penCachedImage, penSize, penColor, annotations, setAnnotations, currentTool, currentZoom, setCurrentZoom, mapDimensions, territories, defaultStyle, selectedTerritory, defaultMapCSSStyle, setSelectedTerritory, territoriesHTML, defaultDataVisualizer, defaultValue} = props
  const [currentlyDrawingNode, setCurrentlyDrawingNode] = useState(null)
  const [lastPoint, setLastPoint] = useState(null)
  const [currentlyMovingMarker, setCurrentlyMovingMarker] = useState(null)
  const [movingMarkerStartingPositionMouse, setMovingMarkerStartingPositionMouse] = useState({x: null, y: null})
  const [movingMarkerStartingPosition, setMovingMarkerStartingPosition] = useState({x: null, y: null})
  const [currentlyMoving, setCurrentlyMoving] = useState(false)
  const [movingStartPosition, setMovingStartPosition] = useState(null)

  let defs = <></>
  let mobile = isMobile()
  let shownTerritories = territories
    .filter(territory => {
      return !territory.hidden
    })

  let parsedScale = currentZoom

  return (
    <div className={currentTool} id="map-div" style={{position: "absolute", left: "0", top: "0", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} onMouseDown={function(event) {
      if(event.target.id == "map-div" || event.target.id == "map-svg") {
        setSelectedTerritory(null)
      }

      if(currentTool == "pen") {
        var mapRect = document.getElementById("map-svg").getBoundingClientRect()
        var [mouseX, mouseY] = [(event.clientX - mapRect.x) / currentZoom, (event.clientY - mapRect.y) / currentZoom]

        let context = penCachedImage.getContext("2d")
        context.beginPath()
        context.arc(mouseX, mouseY, penSize, 0, 2 * Math.PI)
        context.fillStyle = penColor
        context.fill()

        setLastPoint({x: mouseX, y: mouseY})
        setCurrentlyDrawingNode(true)
        drawnOnMap = true
      } else if(currentTool == "eraser") {
        var mapRect = document.getElementById("map-svg").getBoundingClientRect()
        var [mouseX, mouseY] = [(event.clientX - mapRect.x) / currentZoom, (event.clientY - mapRect.y) / currentZoom]

        let context = penCachedImage.getContext("2d")
        context.save()
        context.globalCompositeOperation = "destination-out"
        context.beginPath()
        context.arc(mouseX, mouseY, eraserSize, 0, 2 * Math.PI)
        context.fill()
        context.restore()

        setLastPoint({x: mouseX, y: mouseY})
        setCurrentlyDrawingNode(true)
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
          x: event.clientX - moved.x,
          y: event.clientY - moved.y
        })
      }
    }} onWheel={function(event) {
      if(event.deltaY > 0) {
        let unrounded = Math.max(currentZoom + ((0 - currentZoom) / 5) || 0.1, 0.25)
        setCurrentZoom(roundToTwo(unrounded))
      } else {
        let unrounded = Math.min(currentZoom - ((0 - currentZoom) / 5) || 0.1, 3)
        setCurrentZoom(roundToTwo(unrounded))
      }
    }} onMouseUp={mobile ? null : function(event) {
      selectingTerritories = false
      setCurrentlyDrawingNode(false)

      if(currentlyMovingMarker) {
        dragging = false
        setCurrentlyMovingMarker(null)
      }

      setCurrentlyMoving(false)
    }} onMouseMove={mobile ? null : function(event) {
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
        console.log("its happening")
        let delta = {
          x: event.clientX - movingStartPosition.x,
          y: event.clientY - movingStartPosition.y
        }
        
        setMoved(delta)
      }
    }} onTouchStart={!mobile ? null : function(event) {
      if(currentTool == "move") {
        setCurrentlyMoving(true)
        setMovingStartPosition({
          x: event.touches[0].clientX - moved.x,
          y: event.touches[0].clientY - moved.y
        })
      }
    }} onTouchMove={!mobile ? null : function(event) {
      if(currentlyMoving) {
        let delta = {
          x: event.touches[0].clientX - movingStartPosition.x,
          y: event.touches[0].clientY - movingStartPosition.y
        }
        
        setMoved(delta)
      }
    }} onTouchEnd={!mobile ? null : function(event) {
      selectingTerritories = false
      setCurrentlyMoving(false)
    }}>
      <svg id="map-svg" onTouchMove={!mobile ? null : function(event) {
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
  
            setLastPoint({x: mouseX, y: mouseY})
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
      }} width={mapDimensions.width} height={mapDimensions.height} style={{minWidth: mapDimensions.width + "px", minHeight: mapDimensions.height + "px", transform: `translate(-50%,-50%) translate(${moved.x}px, ${moved.y}px) scale(${parsedScale})`, transition: boosting ? "" : "transform 0.1s", position: "absolute", top: "50%", left: "50%"}}>
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
                  ></path>
                  {boosting ? null : drawnOnMap ? <path style={{pointerEvents: "none"}} d={territory.path} fill="url(#drawn-pattern)"></path> : null}
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

              return <path onMouseDown={function(event) {
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
          {defs}
          {
            drawnOnMap
              ? <pattern patternUnits="userSpaceOnUse" id="drawn-pattern" width={mapDimensions.width} height={mapDimensions.height}>
                <image width={mapDimensions.width} height={mapDimensions.height} href={penCachedImage ? penCachedImage.toDataURL('image/png') : null}></image>
              </pattern>
            : null
          }
        </defs>
      </svg>
    </div>
    
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

function Properties(props) {
  const {recentColors, setRecentColors, currentTool, setMarkers, markers, setDefaultMarkerStyle, setSelectedMarker, defaultMarkerStyle, selectedMarker, defaultValue, setDefaultValue, defaultStyle, setDefaultStyle, selectedTerritory, setTerritories, territories, setSelectedTerritory, defaultDataVisualizer, setDefaultDataVisualizer} = props

  return (
    <div id="properties-container" style={{position: "absolute", top: "0px", left: "0px", height: "100%", padding: "20px", boxSizing: "border-box"}}>
      <div id="properties-panel" elevation={24} style={{boxShadow: "#00000059 -7px 12px 60px", backgroundColor: "#465077", width: "100%", height: "100%", borderRadius: "10px", padding: "8px", boxSizing: "border-box"}}>
        {
          currentTool == "marker" 
            ? selectedMarker
              ? <MarkerProperties recentColors={recentColors} setRecentColors={setRecentColors} defaultMarkerStyle={defaultMarkerStyle} selectedMarker={selectedMarker} setSelectedMarker={function(newValue) {
                setSelectedMarker(newValue)
                setMarkers(markers.map(marker => {
                  if(marker.index == selectedMarker.index) {
                    return newValue
                  } else {
                    return marker
                  }
                }))
              }}></MarkerProperties>
              : <MarkerDefaultProperties recentColors={recentColors} setRecentColors={setRecentColors} defaultMarkerStyle={defaultMarkerStyle} setDefaultMarkerStyle={setDefaultMarkerStyle}></MarkerDefaultProperties>
            : selectedTerritory
              ? <TerritoryProperties recentColors={recentColors} setRecentColors={setRecentColors} defaultDataVisualizer={defaultDataVisualizer} defaultValue={defaultValue} territories={territories} setSelectedTerritory={setSelectedTerritory} selectedTerritory={selectedTerritory} setTerritories={setTerritories} defaultStyle={defaultStyle}></TerritoryProperties>
              : <DefaultsProperties recentColors={recentColors} setRecentColors={setRecentColors} defaultValue={defaultValue} setDefaultValue={setDefaultValue} defaultDataVisualizer={defaultDataVisualizer} setDefaultDataVisualizer={setDefaultDataVisualizer} defaultStyle={defaultStyle} setDefaultStyle={setDefaultStyle}></DefaultsProperties>
        }
      </div>
    </div>
  )
}

function MarkerDefaultProperties({recentColors, setRecentColors, defaultMarkerStyle, setDefaultMarkerStyle}) {
  return <div>
    <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>DEFAULT MARKER STYLE</Typography>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
    <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} color={defaultMarkerStyle.fill} onUpdate={function(fill) {
      let newStyle = {
        ...defaultMarkerStyle,
        fill: fill
      }
      setDefaultMarkerStyle(newStyle)
    }}></TerritoryFillPicker>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
    <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} color={defaultMarkerStyle.outlineColor} onUpdate={function(fill) {
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
function MarkerProperties({recentColors, setRecentColors, defaultMarkerStyle, selectedMarker, setSelectedMarker}) {
  return <div>
    <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>SELECTED MARKER STYLE</Typography>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
    <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} color={selectedMarker.fill || defaultMarkerStyle.fill} style={defaultMarkerStyle} onUpdate={function(fill) {
      let newStyle = {
        ...selectedMarker,
        fill: fill
      }
      setSelectedMarker(newStyle)
    }}></TerritoryFillPicker>
    <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
    <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} color={selectedMarker.outlineColor || defaultMarkerStyle.outlineColor} style={defaultMarkerStyle} onUpdate={function(fill) {
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
      console.log(reset, selectedMarker)
      setSelectedMarker(reset)
    }}>Reset</Button>
  </div>
}


function DefaultsProperties(props) {
  const {recentColors, setRecentColors, defaultValue, setDefaultValue, defaultStyle, setDefaultStyle, defaultDataVisualizer, setDefaultDataVisualizer} = props
  

  return (
    <div>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>DEFAULT STYLE</Typography>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
      <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} color={defaultStyle.fill} style={defaultStyle} onUpdate={function(fill) {
        let newStyle = {
          ...defaultStyle,
          fill: fill
        }
        setDefaultStyle(newStyle)
      }}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
      <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} color={defaultStyle.outlineColor} style={defaultStyle} onUpdate={function(fill) {
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
      <Typography style={{marginTop: "25px", fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>DEFAULT DATA VISUALIZATION</Typography>
      <TextField variant="filled" label="Value" size="small" sx={{marginTop: "5px", width: "100%"}} value={defaultValue} onChange={function(event) {
        setDefaultValue(event.target.value)
      }}></TextField>
      <DataVisualizerSelect dataVisualizerGetter={defaultDataVisualizer} dataVisualizerSetter={setDefaultDataVisualizer}></DataVisualizerSelect>
      <DataVisualizationEditor recentColors={recentColors} setRecentColors={setRecentColors} dataVisualizerGetter={defaultDataVisualizer} dataVisualizerSetter={setDefaultDataVisualizer}></DataVisualizationEditor>
    </div>
  )
}

function RightBar({territories, setTerritories, selectedTerritory, setSelectedTerritory, selectedMarker, setSelectedMarker, markers, setMarkers}) {
  const [deleteTerritoryAlertOpened, setDeleteTerritoryAlertOpened] = useState(false)
  const [deleteTerritoryTarget, setDeleteTerritoryTarget] = useState(null)
  const [deleteMarkerAlertOpened, setDeleteMarkerAlertOpened] = useState(false)
  const [deleteMarkerTarget, setDeleteMarkerTarget] = useState(null)

  return (
    <>
      <div id="right-bar-container" style={{position: "absolute", top: "0px", right: "0px", height: "100%", padding: "20px", boxSizing: "border-box"}}>
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

let SlideUpTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function DataVisualizationEditor({recentColors, setRecentColors, dataVisualizerGetter, dataVisualizerSetter}) {
  switch(dataVisualizerGetter.type) {
    case "geometryDash":
      return <div>
        <div style={{display: "flex"}}>
          <TextField style={{marginRight: "2.5px"}} variant="filled" value={dataVisualizerGetter.min} label="Min" size="small" onChange={function(event) {
            let newDataVisualizer = {
              ...dataVisualizerGetter,
              min: parseInt(event.target.value) || 0
            }
            dataVisualizerGetter.setUpdate(newDataVisualizer)
            dataVisualizerSetter(dataVisualizerGetter.clone())
          }}></TextField>
          <TextField style={{marginLeft: "2.5px"}} variant="filled" value={dataVisualizerGetter.max} label="Max" size="small" onChange={function(event) {
            let newDataVisualizer = {
              ...dataVisualizerGetter,
              max: parseInt(event.target.value) || 0
            }
            dataVisualizerGetter.setUpdate(newDataVisualizer)
            dataVisualizerSetter(dataVisualizerGetter.clone())
          }}></TextField>
        </div>
        <Typography style={{fontSize: "20px", lineHeight: "120%", marginTop: "5px"}}>Scale</Typography>
        <div style={{display: "flex", justifyContent: "center"}}>
          <Slider value={dataVisualizerGetter.data.scale} style={{width: "270px"}} step={0.15} marks min={0.25} max={4} valueLabelDisplay="auto" onChange={function(event) {
            let newDataVisualizer = dataVisualizerGetter.clone()
            newDataVisualizer.data.scale = event.target.value
            dataVisualizerSetter(newDataVisualizer)
          }}/>
        </div>
        
        <div style={{flexDirection: "column", display: "flex"}}>
          <FormControlLabel style={{marginTop: "-5px"}} control={
            <Switch checked={dataVisualizerGetter.reverse} onChange={function (event) {
              let newDataVisualizer = {
                ...dataVisualizerGetter,
                reverse: !dataVisualizerGetter.reverse
              }
              dataVisualizerGetter.setUpdate(newDataVisualizer)
              dataVisualizerSetter(dataVisualizerGetter.clone())
            }}/>
          } label="Reverse"/>
          <FormControlLabel style={{marginTop: "-10px"}} control={
            <Switch checked={dataVisualizerGetter.hideOnParseError} onChange={function (event) {
              let newDataVisualizer = {
                ...dataVisualizerGetter,
                hideOnParseError: !dataVisualizerGetter.hideOnParseError
              }
              dataVisualizerGetter.setUpdate(newDataVisualizer)
              dataVisualizerSetter(dataVisualizerGetter.clone())
            }}/>
          } label="Hide on error"/>
        </div>

        
      </div>
    
    case "text":
      var id = generateId()
      return <>
        <Typography style={{fontSize: "20px", lineHeight: "120%"}}>Fill</Typography>
        <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} allowDynamicFill={false} color={dataVisualizerGetter.style.fill} onUpdate={function(newFill) {
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
        <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} allowFlagFill={false} allowDynamicFill={false} color={dataVisualizerGetter.style.outlineColor} onUpdate={function(newFill) {
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

function TerritoryProperties({recentColors, setRecentColors, defaultDataVisualizer, selectedTerritory, setSelectedTerritory, setTerritories, defaultStyle, territories, defaultValue}) {
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
    valueInputOnChange = function(event) { changeValueSelectedTerritory(0, {value: event.target.value}) }
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
    valueInputOnChange = function(event) { changeValueSelectedTerritory(1, {value: event.target.value}) }
    secondaryDataVisualizationEditorValue = selectedTerritory
    secondaryDataVisualizationEditorOnChange = function(newValue) { changeValueSelectedTerritory(1, newValue) }
    resetButtonDataDisabled = selectedTerritory.value == null && selectedTerritory.dataOffsetX == 0 && selectedTerritory.dataOffsetY == 0
    resetButtonDataOnClick = function() { changeValueSelectedTerritory(1, {value: null, dataOffsetX: 0, dataOffsetY: 0}) }
  }

  return (
    <div>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>SELECTED TERRITORY STYLE: {territoryIdentifier}</Typography>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
      <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} color={fillPickerValue} onUpdate={fillPickerOnUpdate}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
      <TerritoryFillPicker recentColors={recentColors} setRecentColors={setRecentColors} color={outlineColorPickerValue} onUpdate={outlineColorOnUpdate}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline size</Typography>
      <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
        <Slider value={sizePickerSliderValue} style={{width: "270px"}} step={1} marks min={0} max={10} valueLabelDisplay="auto" onChange={sizeSliderOnChange}/>
      </div>
      <Button style={{marginTop: "5px"}} variant="contained" disabled={resetButtonStyleDisabled} onClick={resetButtonStyleOnClick}>Reset</Button>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid", marginTop: "25px"}}>DATA VISUALIZATION: {territoryIdentifier}</Typography>
      <TextField variant="filled" label="Value" size="small" sx={{marginTop: "5px", width: "100%"}} value={valueInputValue} onChange={valueInputOnChange}></TextField>
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


function TerritoryFillPicker(props) {
  const {recentColors, setRecentColors, allowFlagFill, color, mode, onColorChange, onColorFillChange, onUpdate, currentTool} = props
  const [opened, setOpened] = useState(false)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [offsetTop, setOffsetTop] = useState(0)
  const containerId = generateId()
  const backgroundId = generateId()

  return (
    <div id={containerId} style={{borderRadius: "5px", display: "flex", width: "100%", height: "40px", backgroundColor: "#565F83", cursor: "pointer"}} onClick={function(event) {
      if(!document.getElementById(backgroundId).matches(":hover")) {
        setOffsetLeft(event.target.offsetLeft - 5)
        setOffsetTop(parseInt(event.target.offsetTop + event.target.offsetHeight) + 10)
        setOpened(true)
      }
    }}>
      <div style={{flexGrow: "1", padding: "6.5px", paddingRight: "0px", boxSizing: "border-box"}}>
        <div style={{background: color.getBackgroundCSS(), width: "100%", height: "100%", borderRadius: "3px"}}>
          <TerritoryFillPickerPopup recentColors={recentColors} setRecentColors={setRecentColors} allowFlagFill={allowFlagFill} backgroundId={backgroundId} mode={mode} onUpdate={onUpdate} setOpened={setOpened} onColorFillChange={onColorFillChange} onColorChange={onColorChange} opened={opened} top={offsetTop} left={offsetLeft} color={color} ></TerritoryFillPickerPopup>
        </div>
      </div>
      
      <div style={{width: "45px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img src="icons/color-picker-sign.svg" style={{width: "10px"}}></img>
      </div>
    </div>
  )
}

function TerritoryFillPickerPopup(props) {
  let {recentColors, setRecentColors, color, opened, setOpened, style, onUpdate, mode, backgroundId, allowFlagFill} = props
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
              recentColors.map(recentColor => {
                let sameColor = color.r == recentColor.r && color.g == recentColor.g && color.b == recentColor.b && color.a == recentColor.a
                return <div style={{outline: sameColor ? "2px black solid" : "none", marginBottom: "10px", display: "inline-flex", marginRight: "10px", width: "20px", height: "20px", borderRadius: "50%", backgroundColor: `rgba(${recentColor.r}, ${recentColor.g}, ${recentColor.b}, ${recentColor.a})`}} onClick={function() {
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
                    <div style={{backgroundImage: `url(flags/${flag.id}.svg)`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain", height: "30px", width: "40px", marginRight: "10px"}}>

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
    default:
      content = <>
        
      </>
      break
  }

  return (
    <>
      <div className="bg" id={backgroundId} style={{zIndex: "10", position: "fixed", top: "0px", left: "0px", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.7)", display: opened ? "flex" : "none", alignItems: "center", justifyContent: "center"}} onClick={function(event) {
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
          <div className="popup-header" elevation={3} style={{padding: "0px", width: "100%"}}>
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
                default:
                  throw new Error("Unknown value: ", newValue)
              }
            }}>
              <Tab value={0} label="Color"></Tab>
              {allowFlagFill ? <Tab value={1} label="Flag"></Tab> : null}
            </Tabs>
          </div>
          <ThemeProvider theme={lightTheme}>
            { content }
          </ThemeProvider>
        </div>
      </div>
    </>
  )
}

function MapsChoiceContainer(props) {
  const {setStage, setChosenMap} = props
  const searchedMapNames = MAP_NAMES.filter(element => element.name.toLowerCase().includes(props.search.toLowerCase()))
  searchedMapNames.length = Math.min(searchedMapNames.length, 12)
  function editMap(element) {
    setStage("editor")
    setChosenMap(element)
  }
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

function SearchBarMaps(props) {
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
        console.log("dragging~!!!!!!!")
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
root.render(
  <App></App>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


///// WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Two different references?!???!??