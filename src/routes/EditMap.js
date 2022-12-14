import { Editor } from "../index.js"
import { darkTheme } from "../constants.js"
import { get, post } from "../util.js"
import React, { useState, useEffect } from "react"
import {useParams} from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';

let updateTimeout = null

export default function EditMap() {
  let [chosenMap, setChosenMap] = useState(null)
  let [mapData, setMapData] = useState(null)
  let [mapId, setMapId] = useState(null)
  let [saving, setSaving] = useState(false)
  let routeParams = useParams()

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
  }, [])
  

  if(chosenMap) {
    return <ThemeProvider theme={darkTheme}>
      <Editor data={mapData} saving={saving} chosenMap={chosenMap} onUpdate={function(getData) {
        if(updateTimeout) {
          clearTimeout(updateTimeout)
        }
        setSaving(true)
        updateTimeout = setTimeout(function() {
          post(`/update-map/${mapId}`, getData()).then(() => {
            setSaving(false)
          })
        }, 1000)
      }}/>
    </ThemeProvider>
  } else {
    return null
  }
}