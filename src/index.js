import React, {useState, useEffect, componentDidMount, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import './default.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { MAP_NAMES, FLAGS } from "./constants"
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
import { getRectFromPoints, getMapImageUrl, ajax, parseSvg, getTerritoryComputedStyle, typeToValue, generateId, orEmptyString, roundToTwo, createArray, svgToPng, download, isMobile, getAnnotationComputedStyle } from "./util"
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
import { RgbaColorPicker } from "react-colorful";
import { GeometryDashDataVisualizer, DataVisualizer } from "./dataVisualization"
import * as ReactDOMServer from 'react-dom/server';
import MenuIcon from '@mui/icons-material/Menu';
import 'typeface-roboto'

const SvgSaver = require("svg-saver-node")
const svgSaver = new SvgSaver(window)


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
              <div className="content-row" id="usages-content">
                <p className="title">Ways you can use Periphern</p>
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

function mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML) {
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
    gElement.appendChild(pathElement)
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
  
  return svgElement
}

function Editor(props) {
  const chosenMap = props.chosenMap
  const [defaultStyle, setDefaultStyle] = useState({
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


  function downloadSvg() {
    let element = mapFromProperties(territories, mapDimensions, defaultValue, defaultStyle, defaultDataVisualizer, territoriesHTML)
    let base64 = btoa(unescape(encodeURIComponent(element.outerHTML)))
    const a = document.createElement("a")
    const e = new MouseEvent("click")
    a.download = "map.svg"
    a.href = "data:image/svg+xml;base64," + base64
    a.dispatchEvent(e)
  }

  useEffect(function() {
    ajax(getMapImageUrl(chosenMap.id), "GET").then(data => {
      let svgData = parseSvg(data)
      setTerritoriesHTML(svgData.mapNodes)
      setTerritories(svgData.mapNodes.map((node, index) => {
        return {index, dataOffsetX: 0, dataOffsetY: 0, dataVisualizer: null, value: null, path: node.getAttribute("d"), boundingBox: node.getBBox(), id: node.id || node.dataset.id, name: node.getAttribute("name") || node.dataset.name || node.getAttribute("title"), fill: null, outlineColor: null, outlineSize: null, hidden: false}
      }))
      svgData.close() // parseSvg pastes the svg into the dom to make node.getBBox() possible. .close() removes the svg from the document.
      setMapDimensions(svgData.dimensions)
    })
  }, [])

  

  
  

  let defaultMapCSSStyle = {
    cursor: "pointer",
    transition: "opacity 0.3s"
  }
  if(currentTool != "cursor") {
    defaultMapCSSStyle.cursor = null
  }


  return(
    <div style={{height: "100%", width: "100%", display: "flex", overflow: "hidden", backgroundColor: "#2A2E4A", backgroundImage: "none", cursor: currentTool == "rectangle" || currentTool == "ellipse" || currentTool == "text" ? "crosshair" : null}}>
      <EditableMap currentTool={currentTool} currentZoom={currentZoom} setCurrentZoom={setCurrentZoom} defaultValue={defaultValue} defaultDataVisualizer={defaultDataVisualizer} mapDimensions={mapDimensions} territories={territories} defaultStyle={defaultStyle} selectedTerritory={selectedTerritory} defaultMapCSSStyle={defaultMapCSSStyle} setSelectedTerritory={setSelectedTerritory} territoriesHTML={territoriesHTML} annotations={annotations} setAnnotations={setAnnotations}></EditableMap>
      <Properties defaultValue={defaultValue} setDefaultValue={setDefaultValue} defaultDataVisualizer={defaultDataVisualizer} setDefaultDataVisualizer={setDefaultDataVisualizer} setSelectedTerritory={setSelectedTerritory} territories={territories} defaultStyle={defaultStyle} setDefaultStyle={setDefaultStyle} selectedTerritory={selectedTerritory} setTerritories={setTerritories}></Properties>
      <ZoomWidget currentZoom={currentZoom} setCurrentZoom={setCurrentZoom}></ZoomWidget>
      <RightBar></RightBar>
      <Toolbar downloadSvg={downloadSvg} currentTool={currentTool} setCurrentTool={setCurrentTool}></Toolbar>
    </div>
  )
}

function Toolbar({setCurrentTool, currentTool, downloadSvg}) {
  return <div id="toolbar">
    <ToolbarButton name="CURSOR" icon="icons/cursor.svg" selected={currentTool == "cursor"} onClick={function() {
      setCurrentTool("cursor")
    }}></ToolbarButton>
    <ToolbarButton name="ANNOTATIONS" icon="icons/cursor-annotation.svg" selected={currentTool == "annotations"} onClick={function() {
      setCurrentTool("annotations")
    }}></ToolbarButton>
    <ToolbarButton name="RECTANGLE" icon="icons/rectangle.svg" selected={currentTool == "rectangle"} onClick={function() {
      setCurrentTool("rectangle")
    }}></ToolbarButton>
    <ToolbarButton name="ELLIPSE" icon="icons/ellipse.svg" selected={currentTool == "ellipse"} onClick={function() {
      setCurrentTool("ellipse")
    }}></ToolbarButton>
    <ToolbarButton name="TEXT" icon="icons/text.svg" selected={currentTool == "text"} onClick={function() {
      setCurrentTool("text")
    }}></ToolbarButton>
    <ToolbarButton name="DOWNLOAD" icon="icons/download.svg" selected={false} onClick={function() {
      downloadSvg()
    }}></ToolbarButton>
  </div>
}
function ToolbarButton({name, icon, selected, onClick}) {
  return <div onClick={onClick} className="toolbar-button">
    <div className={selected ? "top selected" : "top"}>
      <img src={icon}></img>
    </div>
    <div className="bottom">
      {name}
    </div>

  </div>
}

function ZoomWidget({currentZoom, setCurrentZoom}) {
  return <div id="zoom-panel" style={{boxShadow: "#00000059 -7px 12px 60px", backgroundColor: "#465077", display: "flex", width: "180px", height: "50px", borderRadius: "10px", position: "absolute", top: "20px"}}>
    <Typography style={{fontSize: "18px", width: "80px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>{(currentZoom * 100).toFixed()}%</Typography>
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
}

let selectingTerritories = false
let annotationFirstPoint = {x: null, y: null}
let currentlyDrawingAnnotation = false

function EditableMap(props) {
  const {annotations, setAnnotations, currentTool, currentZoom, setCurrentZoom, mapDimensions, territories, defaultStyle, selectedTerritory, defaultMapCSSStyle, setSelectedTerritory, territoriesHTML, defaultDataVisualizer, defaultValue} = props
  const [previewAnnotation, setPreviewAnnotation] = useState(null)
  const [annotationFirstPoint, setAnnotationFirstPoint] = useState({x: null, y: null})

  let defs = <></>
  let mobile = isMobile()
  

  return (
    <div className={currentTool} id="map-div" style={{position: "absolute", left: "0", top: "0", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} onMouseDown={function(event) {
      if(event.target.id == "map-div" || event.target.id == "map-svg") {
        setSelectedTerritory(null)
      }
      if(currentTool == "rectangle" || currentTool == "ellipse" || currentTool == "text") {
        let mapRect = document.getElementById("map-svg").getBoundingClientRect()
        let [mouseX, mouseY] = [(event.clientX - mapRect.x) / currentZoom, (event.clientY - mapRect.y) / currentZoom]
        setAnnotationFirstPoint({x: mouseX, y: mouseY})
      }
      switch(currentTool) {
        case "rectangle":
          setPreviewAnnotation(<rect/>)
          break;
        case "ellipse":
          setPreviewAnnotation(<ellipse/>)
          break;
        case "text":
          setPreviewAnnotation(<text/>)
          break;
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
      if(currentTool == "rectangle" || currentTool == "ellipse" || currentTool == "text") {
        var mapRect = document.getElementById("map-svg").getBoundingClientRect()
        var [mouseX, mouseY] = [(event.clientX - mapRect.x) / currentZoom, (event.clientY - mapRect.y) / currentZoom]
        var annotationRect = getRectFromPoints({x: mouseX, y: mouseY}, annotationFirstPoint)
      }
      if(currentTool == "rectangle") {
        setAnnotations([...annotations, {
          type: "rectangle",
          x: annotationRect.left,
          y: annotationRect.top,
          width: annotationRect.width,
          height: annotationRect.height,
          borderRadius: 3,
          fill: null,
          outlineColor: null,
          outlineSize: null
        }])
        setPreviewAnnotation(null)
      } else if(currentTool == "ellipse") {
        setAnnotations([...annotations, {
          type: "ellipse",
          x: annotationRect.left,
          y: annotationRect.top,
          width: annotationRect.width,
          height: annotationRect.height,
          fill: null,
          outlineColor: null,
          outlineSize: null
        }])
        setPreviewAnnotation(null)
      }
    }} onMouseMove={mobile ? null : function(event) {
      if(!previewAnnotation) return
      let mapRect, mouseX, mouseY, annotationRect
      if(previewAnnotation && currentTool == "rectangle" || currentTool == "ellipse" || currentTool == "text") {
        mapRect = document.getElementById("map-svg").getBoundingClientRect()
        mouseX = (event.clientX - mapRect.x) / currentZoom
        mouseY = (event.clientY - mapRect.y) / currentZoom
        annotationRect = getRectFromPoints({x: mouseX, y: mouseY}, annotationFirstPoint)
      }
      if(currentTool == "rectangle" && previewAnnotation) {
        setPreviewAnnotation(<rect fill="#0188D299" x={annotationRect.left} y={annotationRect.top} width={annotationRect.width} height={annotationRect.height}/>)
      }
      if(currentTool == "ellipse" && previewAnnotation) {
        setPreviewAnnotation(<ellipse fill="#0188D299" cx={annotationRect.left + annotationRect.width / 2} cy={annotationRect.top + annotationRect.height / 2} ry={annotationRect.height / 2} rx={annotationRect.width / 2}/>)
      }
    }} onTouchEnd={!mobile ? null : function(event) {
      selectingTerritories = false
    }}>
      <svg id="map-svg" onTouchMove={!mobile ? null : function(event) {
        if(!selectingTerritories) return
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
      }} width={mapDimensions.width} height={mapDimensions.height} style={{transform: `translate(-50%,-50%) scale(${currentZoom})`, transition: "transform 0.1s", position: "absolute", top: "50%", left: "50%"}}>
          {
            territories
              .filter(territory => {
                return !territory.hidden
              })
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
                    data-index={territory.index}
                    d={territory.path}
                    fill={style.fill}
                    stroke={style.outlineColor}
                    strokeWidth={style.outlineSize}
                    style={defaultMapCSSStyle}
                    onMouseDown={mobile ? null :
                      function(event) {
                        if(currentTool != "cursor") return
                        if(selectedTerritory && (territory.index == selectedTerritory.index)) {
                          setSelectedTerritory(null)
                        } else {
                          setSelectedTerritory(territory)
                        }
                        selectingTerritories = true
                      }
                    }
                    onTouchStart={!mobile ? null :
                      function(event) {
                        if(currentTool != "cursor") return
                        if(selectedTerritory && (territory.index == selectedTerritory.index)) {
                          setSelectedTerritory(null)
                        } else {
                          setSelectedTerritory(territory)
                        }
                        selectingTerritories = true
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
                </g>
              }
            )
          }
          {
            territories
              .filter(territory => {
                return !territory.hidden
              })
              .map((territory) => {
                return (territory.dataVisualizer || defaultDataVisualizer).render(territory.boundingBox, territory.value || defaultValue, territory, territory.index + "b")
              })
          }
          
          <AnnotationRenderer currentTool={currentTool} annotations={annotations} setAnnotations={setAnnotations}></AnnotationRenderer>
          {previewAnnotation}
        <defs>
          {defs}
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
        }
      })
    }
    <defs>
      {defs}
    </defs>
  </>
}

function Properties(props) {
  const {defaultValue, setDefaultValue, defaultStyle, setDefaultStyle, selectedTerritory, setTerritories, territories, setSelectedTerritory, defaultDataVisualizer, setDefaultDataVisualizer} = props

  return (
    <div id="properties-container" style={{position: "absolute", top: "0px", left: "0px", height: "100vh", padding: "20px", boxSizing: "border-box"}}>
      <div id="properties-panel" elevation={24} style={{boxShadow: "#00000059 -7px 12px 60px", backgroundColor: "#465077", width: "100%", height: "100%", borderRadius: "10px", padding: "8px", boxSizing: "border-box"}}>
        {
          selectedTerritory
            ? <TerritoryProperties defaultDataVisualizer={defaultDataVisualizer} defaultValue={defaultValue} territories={territories} setSelectedTerritory={setSelectedTerritory} selectedTerritory={selectedTerritory} setTerritories={setTerritories} defaultStyle={defaultStyle}></TerritoryProperties>
            : <DefaultsProperties defaultValue={defaultValue} setDefaultValue={setDefaultValue} defaultDataVisualizer={defaultDataVisualizer} setDefaultDataVisualizer={setDefaultDataVisualizer} defaultStyle={defaultStyle} setDefaultStyle={setDefaultStyle}></DefaultsProperties>
        }
      </div>
    </div>
  )
}

function DefaultsProperties(props) {
  const {defaultValue, setDefaultValue, defaultStyle, setDefaultStyle, defaultDataVisualizer, setDefaultDataVisualizer} = props
  

  return (
    <div>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>DEFAULT STYLE</Typography>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
      <TerritoryFillPicker color={defaultStyle.fill} style={defaultStyle} onUpdate={function(fill) {
        let newStyle = {
          ...defaultStyle,
          fill: fill
        }
        setDefaultStyle(newStyle)
      }}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
      <TerritoryFillPicker color={defaultStyle.outlineColor} style={defaultStyle} onUpdate={function(fill) {
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
      <DataVisualizationEditor dataVisualizerGetter={defaultDataVisualizer} dataVisualizerSetter={setDefaultDataVisualizer}></DataVisualizationEditor>
    </div>
  )
}

function RightBar(props) {
  const {} = props

  return (
    <div id="right-bar-container" style={{position: "absolute", top: "0px", right: "0px", height: "100vh", padding: "20px", boxSizing: "border-box"}}>
      <div id="right-bar" style={{boxShadow: "#00000059 -7px 12px 60px", backgroundColor: "#465077", width: "100%", height: "100%", borderRadius: "10px", padding: "8px", boxSizing: "border-box"}}>
        
      </div>
    </div>
  )
}

function DataVisualizationEditor({dataVisualizerGetter, dataVisualizerSetter}) {
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
        <FormControlLabel control={
          <Switch checked={dataVisualizerGetter.reverse} onChange={function (event) {
            let newDataVisualizer = {
              ...dataVisualizerGetter,
              reverse: !dataVisualizerGetter.reverse
            }
            dataVisualizerGetter.setUpdate(newDataVisualizer)
            dataVisualizerSetter(dataVisualizerGetter.clone())
          }}/>
        } label="Reverse"/>
      </div>
    
    case "text":
      var id = generateId()
      return <>
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
        <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Displace</Typography>
        <PositionSelect x={selectedTerritory.dataOffsetX} y={selectedTerritory.dataOffsetY} onChange={function(x, y) {
          onChange({dataOffsetX: x, dataOffsetY: y})
        }}/>
      </div>
  }
}

function TerritoryProperties({defaultDataVisualizer, selectedTerritory, setSelectedTerritory, setTerritories, defaultStyle, territories, defaultValue}) {
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
  let resetButtonStyleDisabled = false
  let outlineColorPickerValue = null
  let outlineColorOnUpdate = null
  let resetButtonStyleOnClick = null
  let valueInputValue = null
  let valueInputOnChange = null
  let secondaryDataVisualizationEditorValue = null
  let secondaryDataVisualizationEditorOnChange = null
  let resetButtonDataDisabled = false
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
      resetButtonStyleDisabled = selectedTerritory[i].fill == null && selectedTerritory[i].outlineColor == null && selectedTerritory[i].outlineSize == null
    }
    resetButtonStyleOnClick = function() { changeValueSelectedTerritory(0, {fill: null, outlineColor: null, outlineSize: null})}
    valueInputValue = orEmptyString(selectedTerritory[0].value, defaultValue)
    valueInputOnChange = function(event) { changeValueSelectedTerritory(0, {value: event.target.value}) }
    secondaryDataVisualizationEditorValue = selectedTerritory[0]
    secondaryDataVisualizationEditorOnChange = function(newValue) { console.log("it doing the changing"); changeValueSelectedTerritory(0, newValue) }
    for(let i = 0; i != selectedTerritory.length; i++) {
      resetButtonDataDisabled = selectedTerritory[i].value == null && selectedTerritory[i].dataOffsetX == 0 && selectedTerritory[i].dataOffsetY == 0
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
      <TerritoryFillPicker color={fillPickerValue} onUpdate={fillPickerOnUpdate}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
      <TerritoryFillPicker color={outlineColorPickerValue} onUpdate={outlineColorOnUpdate}></TerritoryFillPicker>
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
  const {color, style, updateStyle, mode, onColorChange, onColorFillChange, onUpdate, currentTool} = props
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
          <TerritoryFillPickerPopup backgroundId={backgroundId} mode={mode} onUpdate={onUpdate} setOpened={setOpened} onColorFillChange={onColorFillChange} onColorChange={onColorChange} opened={opened} top={offsetTop} left={offsetLeft} color={color} ></TerritoryFillPickerPopup>
        </div>
      </div>
      
      <div style={{width: "45px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img src="icons/color-picker-sign.svg" style={{width: "10px"}}></img>
      </div>
    </div>
  )
}

function TerritoryFillPickerPopup(props) {
  let {color, opened, setOpened, style, onUpdate, mode, backgroundId} = props
  const [flagSearch, setFlagSearch] = useState("")
  const [tabIndex, setTabIndex] = useState(typeToValue(color.type))


  let flagsSearched = FLAGS.filter(flag => flag.name.toLowerCase().includes(flagSearch.toLowerCase()) || flag.id.toLowerCase().includes(flagSearch.toLowerCase()))
  flagsSearched.length = Math.min(flagsSearched.length, 10)

  let content
  switch(color.type) {
    case "color":
      content = <div style={{flexGrow: "1", padding: "20px", boxSizing: "border-box"}}>
        <RgbaColorPicker color={color} onChange={function(newValue) {
          color = color.clone()
          color.r = newValue.r
          color.g = newValue.g
          color.b = newValue.b
          color.a = newValue.a
          color.setUpdate(color)
          onUpdate(color)
        }}></RgbaColorPicker>
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
      <div className="bg" id={backgroundId} style={{zIndex: "10", position: "fixed", top: "0px", left: "0px", width: "100vw", height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.7)", display: opened ? "flex" : "none", alignItems: "center", justifyContent: "center"}} onClick={function(event) {
        if(event.target.className == "bg") {
          setOpened(false)

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
              setTabIndex(newValue)
            }}>
              <Tab value={0} label="Color"></Tab>
              <Tab value={1} label="Flag"></Tab>
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