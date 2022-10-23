import React, {useState, useEffect, componentDidMount, useRef} from 'react';
import ReactDOM from 'react-dom/client';
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
import { getMapImageUrl, ajax, parseSvg, getTerritoryComputedStyle, typeToValue, generateId, orEmptyString, roundToTwo } from "./util"
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
import { RgbaColorPicker } from "react-colorful";
import { GeometryDashDataVisualizer, DataVisualizer } from "./dataVisualization"
import NumberInput from 'material-ui-number-input';
import 'typeface-roboto'


const root = ReactDOM.createRoot(document.getElementById('root'));
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});



function App() {
  const [mapSearch, setMapSearch] = useState("");
  const [stage, setStage] = useState("maps")
  const [chosenMap, setChosenMap] = useState(null)

  let toShow
  switch(stage) {
    case "maps":
      toShow =
        <Paper style={{height: "100vh", overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center"}}>
          <SearchBarMaps setMapSearch={setMapSearch}></SearchBarMaps>
          <MapsChoiceContainer search={mapSearch} setStage={setStage} setChosenMap={setChosenMap}></MapsChoiceContainer>
        </Paper>
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
  const [mapDimensions, setMapDimensions] = useState([])
  const [defaultValue, setDefaultValue] = useState("")
  const [currentZoom, setCurrentZoom] = useState(1)

  useEffect(function() {
    ajax(getMapImageUrl(chosenMap.id), "GET").then(data => {
      let svgData = parseSvg(data)
      setTerritoriesHTML(svgData.mapNodes)
      setTerritories(svgData.mapNodes.map((node, index) => {
        return {index, dataOffsetX: 0, dataOffsetY: 0, dataVisualizer: null, value: null, path: node.getAttribute("d"), boundingBox: node.getBBox(), id: node.id || node.dataset.id, name: node.getAttribute("name") || node.dataset.name, fill: null, outlineColor: null, outlineSize: null, hidden: false}
      }))
      svgData.close() // parseSvg pastes the svg into the dom to make node.getBBox() possible. .close() removes the svg from the document.
      setMapDimensions(svgData.dimensions)
    })
  }, [])

  const defaultMapCSSStyle = {
    cursor: "pointer",
    transition: "opacity 0.3s"
  }


  return(
    <Paper style={{height: "100%", width: "100%", display: "flex", overflow: "hidden"}}>
      <EditableMap currentZoom={currentZoom} setCurrentZoom={setCurrentZoom} defaultValue={defaultValue} defaultDataVisualizer={defaultDataVisualizer} mapDimensions={mapDimensions} territories={territories} defaultStyle={defaultStyle} selectedTerritory={selectedTerritory} defaultMapCSSStyle={defaultMapCSSStyle} setSelectedTerritory={setSelectedTerritory} territoriesHTML={territoriesHTML}></EditableMap>
      <Properties defaultValue={defaultValue} setDefaultValue={setDefaultValue} defaultDataVisualizer={defaultDataVisualizer} setDefaultDataVisualizer={setDefaultDataVisualizer} setSelectedTerritory={setSelectedTerritory} territories={territories} defaultStyle={defaultStyle} setDefaultStyle={setDefaultStyle} selectedTerritory={selectedTerritory} setTerritories={setTerritories}></Properties>
      <ZoomWidget currentZoom={currentZoom} setCurrentZoom={setCurrentZoom}></ZoomWidget>
      <RightBar></RightBar>
      
    </Paper>
  )
}

function ZoomWidget({currentZoom, setCurrentZoom}) {
  return <Paper elevation={24} style={{display: "flex", width: "180px", height: "50px", borderRadius: "10px", position: "absolute", right: "350px", top: "20px"}}>
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

    
  </Paper>
}

function EditableMap(props) {
  const {currentZoom, setCurrentZoom, mapDimensions, territories, defaultStyle, selectedTerritory, defaultMapCSSStyle, setSelectedTerritory, territoriesHTML, defaultDataVisualizer, defaultValue} = props
  
  let defs = <></>

  return (
    <div id="map-div" style={{position: "absolute", left: "0", top: "0", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}} onClick={function(event) {
      if(event.target.id == "map-div" || event.target.id == "map-svg") {
        setSelectedTerritory(null)
      }
    }} onWheel={function(event) {
      if(event.deltaY > 0) {
        let unrounded = Math.max(currentZoom + ((0 - currentZoom) / 5) || 0.1, 0.25)
        setCurrentZoom(roundToTwo(unrounded))
      } else {
        let unrounded = Math.min(currentZoom - ((0 - currentZoom) / 5) || 0.1, 3)
        setCurrentZoom(roundToTwo(unrounded))
      }
    }}>
      <svg id="map-svg" width={mapDimensions.width} height={mapDimensions.height} style={{transform: `translate(-50%,-50%) scale(${currentZoom})`, transition: "transform 0.1s", position: "absolute", top: "50%", left: "50%"}}>
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

                return <g key={territory.index} style={selectedTerritory ? {opacity: selectedTerritory.index == territory.index ? "1" : "0.3", ...defaultMapCSSStyle} : defaultMapCSSStyle}>
                  <path
                    d={territory.path}
                    fill={style.fill}
                    stroke={style.outlineColor}
                    strokeWidth={style.outlineSize}
                    style={defaultMapCSSStyle}
                    onClick={
                      function(event) {
                        if(selectedTerritory && (territory.index == selectedTerritory.index)) {
                          setSelectedTerritory(null)
                        } else {
                          setSelectedTerritory(territory)
                        }
                      }
                    }
                  ></path>
                  {(territory.dataVisualizer || defaultDataVisualizer).render(territory.boundingBox, territory.value || defaultValue, territory, territory.index + "b")}
                </g>
              }
            )
          }
        <defs>
          {defs}
        </defs>
      </svg>
    </div>
    
  )
}

function Properties(props) {
  const {defaultValue, setDefaultValue, defaultStyle, setDefaultStyle, selectedTerritory, setTerritories, territories, setSelectedTerritory, defaultDataVisualizer, setDefaultDataVisualizer} = props


  return (
    <div style={{position: "absolute", top: "0px", left: "0px", height: "100vh", width: "350px", padding: "20px", boxSizing: "border-box"}}>
      <Paper id="properties-panel" elevation={24} style={{width: "100%", height: "100%", borderRadius: "10px", padding: "8px", boxSizing: "border-box"}}>
        {
          selectedTerritory
            ? <TerritoryProperties defaultDataVisualizer={defaultDataVisualizer} defaultValue={defaultValue} territories={territories} setSelectedTerritory={setSelectedTerritory} selectedTerritory={selectedTerritory} setTerritories={setTerritories} defaultStyle={defaultStyle}></TerritoryProperties>
            : <DefaultsProperties defaultValue={defaultValue} setDefaultValue={setDefaultValue} defaultDataVisualizer={defaultDataVisualizer} setDefaultDataVisualizer={setDefaultDataVisualizer} defaultStyle={defaultStyle} setDefaultStyle={setDefaultStyle}></DefaultsProperties>
        }
      </Paper>
    </div>
  )
}

function DefaultsProperties(props) {
  const {defaultValue, setDefaultValue, defaultStyle, setDefaultStyle, defaultDataVisualizer, setDefaultDataVisualizer} = props
  

  return (
    <div>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>DEFAULT STYLE</Typography>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
      <TerritoryFillPicker color={defaultStyle.fill} style={defaultStyle} updateStyle={setDefaultStyle} mode={"fill"}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
      <TerritoryFillPicker color={defaultStyle.outlineColor} style={defaultStyle} updateStyle={setDefaultStyle} mode={"outlineColor"}></TerritoryFillPicker>
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
    <div style={{position: "absolute", top: "0px", right: "0px", height: "100vh", width: "350px", padding: "20px", boxSizing: "border-box"}}>
      <Paper id="right-panel" elevation={24} style={{width: "100%", height: "100%", borderRadius: "10px", padding: "8px", boxSizing: "border-box"}}>
        
      </Paper>
    </div>
  )
}

function DataVisualizationEditor({dataVisualizerGetter, dataVisualizerSetter}) {
  console.log(dataVisualizerGetter.reverse)
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
              console.log(event.target.value)
              let newDataVisualizer = {
                ...dataVisualizerGetter,
                reverse: !dataVisualizerGetter.reverse
              }
              dataVisualizerGetter.setUpdate(newDataVisualizer)
              dataVisualizerSetter(dataVisualizerGetter.clone())
            }}/>
        } label="Reverse"/>
      </div>
        
    case null:
      break;
    default:
      return <p>Error: Data visualizer type invalid.</p>
  }
}
function SecondaryDataVisualizationEditor({dataVisualizer, selectedTerritory, setSelectedTerritory, territories, setTerritories}) {
  switch(dataVisualizer.type) {
    case "geometryDash":
      return <div style={{display: "flex", flexDirection: "column"}}>
        <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Displace</Typography>
        <PositionSelect x={selectedTerritory.dataOffsetX} y={selectedTerritory.dataOffsetY} onChange={function(x, y) {
          let newTerritory = {
            ...selectedTerritory,
            dataOffsetX: x,
            dataOffsetY: y
          }
          setSelectedTerritory(newTerritory)
          setTerritories(territories.map(territory => {
            if(territory.index == selectedTerritory.index) {
              return newTerritory
            } else {
              return territory
            }
          }))
        }}/>
      </div>
  }
}

function TerritoryProperties({defaultDataVisualizer, selectedTerritory, setSelectedTerritory, setTerritories, defaultStyle, territories, defaultValue}) {
  console.log(selectedTerritory.value, selectedTerritory.dataOffsetX, selectedTerritory.dataOffsetY)
  return (
    <div>
      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid"}}>SELECTED TERRITORY STYLE: {selectedTerritory.name.toUpperCase()}</Typography>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Fill</Typography>
      <TerritoryFillPicker color={selectedTerritory.fill || defaultStyle.fill} style={selectedTerritory} updateStyle={function(newValue) {
        // the bug happens because selectedTerritory stays the same.
        let newTerritories = territories.map(territory => {
          if(territory.index == newValue.index) {
            return newValue
          }
          return territory
        })
        setTerritories(newTerritories)
        setSelectedTerritory(newValue)
      }} mode={"fill"}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline color</Typography>
      <TerritoryFillPicker color={selectedTerritory.outlineColor || defaultStyle.outlineColor} style={selectedTerritory} updateStyle={function(newValue) {
        // the bug happens because selectedTerritory stays the same.
        let newTerritories = territories.map(territory => {
          if(territory.index == newValue.index) {
            return newValue
          }
          return territory
        })
        setTerritories(newTerritories)
        setSelectedTerritory(newValue)
      }} mode={"outlineColor"}></TerritoryFillPicker>
      <Typography style={{fontSize: "20px", marginTop: "4px", lineHeight: "120%"}}>Outline size</Typography>
      <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
        <Slider value={selectedTerritory.outlineSize || defaultStyle.outlineSize} style={{width: "270px"}} step={1} marks min={0} max={10} valueLabelDisplay="auto" onChange={function(event) {
          let newTerritories = territories.map(territory => {
            if(territory.index == selectedTerritory.index) {
              return {
                ...territory,
                outlineSize: event.target.value
              }
            }
            return territory
          })
          setTerritories(newTerritories)
          setSelectedTerritory({
            ...selectedTerritory,
            outlineSize: event.target.value
          })
        }}/>
      </div>
      <Button style={{marginTop: "5px"}} variant="contained" disabled={selectedTerritory.fill == null && selectedTerritory.outlineColor == null && selectedTerritory.outlineSize == null} onClick={function() {
        let selectedTerritoryUpdated = {
          ...selectedTerritory,
          fill: null,
          outlineColor: null,
          outlineSize: null
        }
        let newTerritories = territories.map(territory => {
          if(territory.index == selectedTerritory.index) {
            return selectedTerritoryUpdated
          }
          return territory
        })
        setTerritories(newTerritories)
        setSelectedTerritory(selectedTerritoryUpdated)
      }}>Reset</Button>

      <Typography style={{fontSize: "15px", paddingLeft: "3px", boxSizing: "border-box", borderBottomColor: darkTheme.color, borderBottom: "1px solid", marginTop: "25px"}}>DATA VISUALIZATION: {selectedTerritory.name.toUpperCase()}</Typography>
      <TextField variant="filled" label="Value" size="small" sx={{marginTop: "5px", width: "100%"}} value={orEmptyString(selectedTerritory.value, defaultValue)} onChange={function(event) {
        let selectedTerritoryUpdated = {
          ...selectedTerritory,
          value: event.target.value,
        }
        let newTerritories = territories.map(territory => {
          if(territory.index == selectedTerritory.index) {
            return selectedTerritoryUpdated
          }
          return territory
        })
        setTerritories(newTerritories)
        setSelectedTerritory(selectedTerritoryUpdated)
      }}></TextField>
      <SecondaryDataVisualizationEditor dataVisualizer={defaultDataVisualizer} selectedTerritory={selectedTerritory} setSelectedTerritory={setSelectedTerritory} setTerritories={setTerritories} territories={territories}></SecondaryDataVisualizationEditor>
      <Button style={{marginTop: "5px"}} variant="contained" disabled={selectedTerritory.value == null && selectedTerritory.dataOffsetX == 0 && selectedTerritory.dataOffsetY == 0} onClick={function() {
        let selectedTerritoryUpdated = {
          ...selectedTerritory,
          value: null,
          dataOffsetX: 0,
          dataOffsetY: 0
        }
        let newTerritories = territories.map(territory => {
          if(territory.index == selectedTerritory.index) {
            return selectedTerritoryUpdated
          }
          return territory
        })
        setTerritories(newTerritories)
        setSelectedTerritory(selectedTerritoryUpdated)
      }}>Reset</Button>
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
  const {color, style, updateStyle, mode, onColorChange, onColorFillChange} = props
  const [opened, setOpened] = useState(false)
  const [offsetLeft, setOffsetLeft] = useState(0)
  const [offsetTop, setOffsetTop] = useState(0)
  const containerId = generateId()
  const backgroundId = generateId()

  return (
    <div id={containerId} style={{borderRadius: "5px", display: "flex", width: "100%", height: "40px", backgroundColor: "#525252", cursor: "pointer"}} onClick={function(event) {
      if(!document.getElementById(backgroundId).matches(":hover")) {
        setOffsetLeft(event.target.offsetLeft - 5)
        setOffsetTop(parseInt(event.target.offsetTop + event.target.offsetHeight) + 10)
        setOpened(true)
      }
    }}>
      <div style={{flexGrow: "1", padding: "6.5px", paddingRight: "0px", boxSizing: "border-box"}}>
        <div style={{background: color.getBackgroundCSS(), width: "100%", height: "100%", borderRadius: "3px"}}>
          <TerritoryFillPickerPopup backgroundId={backgroundId} style={style} mode={mode} updateStyle={updateStyle} setOpened={setOpened} onColorFillChange={onColorFillChange} onColorChange={onColorChange} opened={opened} top={offsetTop} left={offsetLeft} color={color} ></TerritoryFillPickerPopup>
        </div>
      </div>
      
      <div style={{width: "45px", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img src="icons/color-picker-sign.svg"></img>
      </div>
    </div>
  )
}

function TerritoryFillPickerPopup(props) {
  let {color, opened, setOpened, style, updateStyle, mode, backgroundId} = props
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
          let updateStyleArgument = {
            ...style
          }
          updateStyleArgument[mode] = color
          updateStyle(updateStyleArgument)
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
                    let updateStyleArgument = {
                      ...style
                    }
                    updateStyleArgument[mode] = color
                    updateStyle(updateStyleArgument)
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
        <Paper style={{borderTopLeftRadius: "10px", borderTopRightRadius: "10px", width: "800px", height: "400px", display: "flex", flexDirection: "column"}}>
          <Paper elevation={3} xs={{width: "100%", borderRadius: "10px"}}>
            <Tabs value={tabIndex} onChange={function(event, newValue) {
              let updateStyleArgument
              switch(newValue) {
                case 0:
                  // color fill
                  updateStyleArgument = {...style}
                  updateStyleArgument[mode] = color.toColorFill()
                  updateStyle(updateStyleArgument)
                  break
                case 1:
                  // flag fill
                  updateStyleArgument = {...style}
                  updateStyleArgument[mode] = color.toFlagFill()
                  updateStyle(updateStyleArgument)
                  break
                default:
                  throw new Error("Unknown value: ", newValue)
              }
              setTabIndex(newValue)
            }}>
              <Tab value={0} label="Color"></Tab>
              <Tab value={1} label="Flag"></Tab>
            </Tabs>
          </Paper>
          { content }
        </Paper>
      </div>
    </>
  )
}

function MapsChoiceContainer(props) {
  const {setStage, setChosenMap} = props
  const searchedMapNames = MAP_NAMES.filter(element => element.name.includes(props.search))
  function editMap(element) {
    setStage("editor")
    setChosenMap(element)
  }
  return (
    <Box display="flex" justifyContent="center">
      <Grid container spacing={6} style={{width: "1600px", marginTop: "0px"}}>
        {searchedMapNames.map((element, index) => {
          return <MapChoiceBox key={index} editMap={editMap} sx={12/5} element={element}></MapChoiceBox>
        })}
      </Grid>
    </Box>
  )
}

function SearchBarMaps(props) {
  const {setMapSearch} = props
  return (
    <div style={{width: "1542px", marginTop: "60px", marginBottom: "-20px"}}>
      <TextField id="filled-basic" label="Search" variant="standard" onChange={function(event) {
        setMapSearch(event.target.value)
      }}/>
    </div>
  )
}

function MapChoiceBox(props) {
  const {editMap} = props
  return (
    <Grid item xs={12/5}>
      <Card variant="outlined">
        <div style={{height: "180px", width: "100%", backgroundImage: `url(${getMapImageUrl(props.element.id)})`, backgroundPosition: "center", backgroundSize: "contain", backgroundRepeat: "no-repeat"}}></div>
        <CardContent style={{textAlign: "center"}}>
          <Typography style={{fontSize: "22px"}}>
            {props.element.name}
          </Typography>
        </CardContent>
        <CardActions>
          <Button variant="outlined" onClick={function() {
            editMap(props.element)
          }}>Edit</Button>
        </CardActions>
      </Card>
    </Grid>
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
root.render(
  <App></App>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


///// WTF!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Two different references?!???!??