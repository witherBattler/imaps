import { Editor } from "../index.js"
import { darkTheme } from "../constants.js"
import { get, post } from "../util.js"
import React, { useState, useEffect } from "react"
import {useParams} from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import { TopBar } from "./Dashboard"

let updateTimeout = null

export default function EditMap() {
  let [chosenMap, setChosenMap] = useState(null)
  let [mapData, setMapData] = useState(null)
  let [mapId, setMapId] = useState(null)
  let [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState(null)
  let routeParams = useParams()

  console.log(mapData)

  useEffect(function() {
    get(`/map/${routeParams.id}`).then(mapData => {
      if(mapData == "Not logged in/session ID invalid.") {
        window.location = "/login"
      } else if(mapData == "Map with this ID on your account wasn't found.") {
        window.location = "/dashboard"
      } else {
        mapData = JSON.parse(mapData)
        setChosenMap(mapData.map)
        setMapId(mapData.id)
        setMapData(mapData)
      }
    })
    get("/self-data").then(function(selfData) {
      if(selfData != "Not logged in/session ID invalid.") {
        setUserData(JSON.parse(selfData))
      } else {
        window.location = "/login"
      }
    })
  }, [])
  

  if(chosenMap) {
    return <ThemeProvider theme={darkTheme}>
      <link rel="stylesheet" href="dashboard.css"></link>
      <TopBar userData={userData}></TopBar>
      <Editor removeHeight="60px" data={mapData} saving={saving} chosenMap={chosenMap} onUpdate={function(getData) {
        if(updateTimeout) {
          clearTimeout(updateTimeout)
        }
        setSaving(true)
        updateTimeout = setTimeout(async function() {
          let data = getData()
          data.preview = await data.preview
          data.preview.setAttributeNS(null, "viewBox", `0 0 ${data.preview.getAttribute("width")} ${data.preview.getAttribute("height")}`)
          data.preview.setAttribute("width", "100%")
          data.preview.setAttribute("height", "100%")
          data.preview = data.preview.outerHTML
          post(`/update-map/${mapId}`, data).then(() => {
            setSaving(false)
          })
        }, 1000)
      }}/>
    </ThemeProvider>
  } else {
    return null
  }
}