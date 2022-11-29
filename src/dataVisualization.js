import { GEOMETRY_DASH_ICONS } from "./constants.js"
import { generateId, orEmptyString } from "./util.js"
import { ColorFill } from "./fill.js"

class DataVisualizer {
    constructor(data) {
        this.type = null
        this.id = generateId()
        this.data = data || {
            text: {
                style: {
                    fill: new ColorFill(255, 255, 255, 1),
                    outlineColor: new ColorFill(0, 0, 0, 1),
                    outlineSize: 4,
                    fontSize: 22,
                    fontFamily: "rubik",
                    fontWeight: "400",
                    italic: false,
                },
            },
            geometryDash: {
                min: 0,
                max: 10,
                reverse: false,
                hideOnParseError: true
            },
            scale: 1
        }
    }
    render() {

    }
    convertToType(type) {
        switch(type) {
            case 0:
                return new DataVisualizer(this.data)
            case 1:
                return new TextDataVisualizer(this.data.text.style, this.data)
            case 2:
                return new GeometryDashDataVisualizer(this.data.geometryDash.min, this.data.geometryDash.max, this.data.geometryDash.reverse, this.data.geometryDash.hideOnParseError, this.data)
        }
    }
    getTypeIndex() {
        switch(this.type) {
            case null:
                return 0
            case "text":
                return 1
            case "geometryDash":
                return 2
        }
    }
}

class TextDataVisualizer extends DataVisualizer {
    constructor(style, data) {
        super()
        this.data = data || this.data;
        this.style = style
        this.type = "text"
    }
    render(boundingBox, data, territory, id) {
        let center = {x: territory.dataOffsetX + boundingBox.x + boundingBox.width / 2, y: territory.dataOffsetY + boundingBox.y + boundingBox.height / 2}

        return <g key={territory.id + ".data-visualizer"}>
            <defs>
                {this.style.fill.getDefs(territory, "data-visualizer.fill")}
                {this.style.outlineColor.getDefs(territory, "data-visualizer.outline-color")}
            </defs>
            <text
                fill={this.style.fill.getBackground(territory, "data-visualizer.fill")}
                stroke={this.style.outlineColor.getBackground(territory, "data-visualizer.fill")}
                strokeWidth={this.style.outlineSize}
                className="data-visualizer"
                x={center.x}
                y={center.y}
                fontSize={this.style.fontSize}
                fontFamily={this.style.fontFamily}
                fontWeight={this.style.fontWeight}
                fontStyle={this.style.italic ? "italic" : null}
                style={{transform: `scale(${this.data.scale})`, paintOrder: "stroke", zIndex: "10", textAnchor: "middle", dominantBaseline: "middle", pointerEvents: "none", userSelect: "none"}}
            >{data}</text>
        </g>
    }
    clone() {
        return new TextDataVisualizer(this.style, this.data)
    }
    setUpdate(newObject) {
        this.style = newObject.style
        this.data.text = {
            style: newObject.style
        }
    }
    getFontIndex() {
        switch(this.style.fontFamily) {
            case "rubik":
                return 1
            case "helvetica":
                return 2
            case "oblivian":
                return 3
            case "georgia":
                return 4
            case "trebuchet":
                return 5
            case "roboto":
                return 6
            case "century gothic":
                return 7
            case "rockwell":
                return 8
            case "verdana":
                return 9
        }
    }
    getFontFromIndex(index) {
        switch(index) {
            case 1:
                return "rubik"
            case 2:
                return "helvetica"
            case 3:
                return "oblivian"
            case 4:
                return "georgia"
            case 5:
                return "trebuchet"
            case 6:
                return "roboto"
            case 7:
                return "century gothic"
            case 8:
                return "rockwell"
            case 9:
                return "verdana"
        }
    }
}

const GEOMETRY_DASH_ICON_WIDTH = 50
const GEOMETRY_DASH_ICON_HEIGHT = 40

class GeometryDashDataVisualizer extends DataVisualizer {
    constructor(min, max, reverse, hideOnParseError, data) {
        super()
        this.data = data || this.data
        this.min = orEmptyString(min, 0)
        this.max = orEmptyString(max, 0)
        this.reverse = reverse || false
        this.type = "geometryDash"
        this.hideOnParseError = hideOnParseError
    }
    render(boundingBox, data, territory, id) {
        let center = {x: boundingBox.x + boundingBox.width / 2, y: boundingBox.y + boundingBox.height / 2}
        let imagePosition = {x: center.x - GEOMETRY_DASH_ICON_WIDTH / 2, y: center.y - GEOMETRY_DASH_ICON_HEIGHT / 2}
        let imageUrl
        if(!data || isNaN(parseInt(data))) {
            if(this.hideOnParseError) {
                return
            }
            imageUrl = "https://periphern.impixel.tech/geometryDash/Unrated.webp"
        } else {
            data = parseInt(data)
            // return the <> according to the boundingBox.
            let minMaxDifference = this.max - this.min
            let imageIndex = Math.max(Math.min((Math.round((data - this.min) / minMaxDifference * 10)), 10), 0)
            if(this.reverse) {
                imageIndex = 10 - imageIndex
            }
            imageUrl = "https://periphern.impixel.tech/geometryDash/" + GEOMETRY_DASH_ICONS[imageIndex].id + ".webp"
        }
        return <image key={territory.index + ".data-visualizer"} style={{transform: `scale(${this.data.scale})`, pointerEvents: "none", zIndex: "10"}} id={id} x={imagePosition.x + territory.dataOffsetX} y={imagePosition.y + territory.dataOffsetY} width={GEOMETRY_DASH_ICON_WIDTH} height={GEOMETRY_DASH_ICON_HEIGHT} href={imageUrl}></image>
    }
    clone() {
        return new GeometryDashDataVisualizer(this.min, this.max, this.reverse, this.hideOnParseError, this.data)
    }
    setUpdate(newObject) {
        this.min = newObject.min
        this.max = newObject.max
        this.reverse = newObject.reverse
        this.hideOnParseError = newObject.hideOnParseError
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