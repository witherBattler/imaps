import { GEOMETRY_DASH_ICONS } from "./constants.js"
import { generateId, orEmptyString } from "./util.js"

class DataVisualizer {
    constructor(data) {
        this.type = null
        this.id = generateId()
        this.data = {
            geometryDash: {
                min: 0,
                max: 10,
                reverse: false
            }
        } || data
    }
    render() {

    }
    convertToType(type) {
        switch(type) {
            case 0:
                return new DataVisualizer(this.data)
            case 2:
                return new GeometryDashDataVisualizer(this.data.geometryDash.min, this.data.geometryDash.max, this.data.geometryDash.reverse, this.data)
        }
    }
    getTypeIndex() {
        switch(this.type) {
            case null:
                return 0
            case "geometryDash":
                return 2
        }
    }
}

const GEOMETRY_DASH_ICON_WIDTH = 50
const GEOMETRY_DASH_ICON_HEIGHT = 40

class GeometryDashDataVisualizer extends DataVisualizer {
    constructor(min, max, reverse, data) {
        super()
        this.data = data || this.data
        this.min = orEmptyString(min, 0)
        this.max = orEmptyString(max, 0)
        this.reverse = reverse || false
        this.type = "geometryDash"
    }
    render(boundingBox, data, territory, id) {
        let center = {x: boundingBox.x + boundingBox.width / 2, y: boundingBox.y + boundingBox.height / 2}
        let imagePosition = {x: center.x - GEOMETRY_DASH_ICON_WIDTH / 2, y: center.y - GEOMETRY_DASH_ICON_HEIGHT / 2}
        let imageUrl
        if(!data || isNaN(parseInt(data))) {
            imageUrl = "./geometryDash/Unrated.webp"
        } else {
            data = parseInt(data)
            // return the <> according to the boundingBox.
            let minMaxDifference = this.max - this.min
            let imageIndex = Math.max(Math.min((Math.round((data - this.min) / minMaxDifference * 10)), 10), 0)
            if(this.reverse) {
                imageIndex = 10 - imageIndex
            }
            imageUrl = "./geometryDash/" + GEOMETRY_DASH_ICONS[imageIndex].id + ".webp"
        }
        return <image style={{pointerEvents: "none"}} id={id} x={imagePosition.x + territory.dataOffsetX} y={imagePosition.y + territory.dataOffsetY} width={GEOMETRY_DASH_ICON_WIDTH} height={GEOMETRY_DASH_ICON_HEIGHT} href={imageUrl}>

        </image>
    }
    clone() {
        return new GeometryDashDataVisualizer(this.min, this.max, this.reverse, this.data)
    }
    setUpdate(newObject) {
        this.min = newObject.min
        this.max = newObject.max
        this.reverse = newObject.reverse
        this.data.geometryDash = {
            min: newObject.min,
            max: newObject.max,
            reverse: newObject.reverse
        }
    }
}

export {
    GeometryDashDataVisualizer,
    DataVisualizer,
}