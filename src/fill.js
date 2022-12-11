class Fill {
    constructor() {
        this.data = {
            color: {
                r: 0,
                g: 0,
                b: 0,
                a: 1
            },
            flag: {
                id: "ad"
            }
        }
    }
    toColorFill() {
        return new ColorFill(this.data.color.r, this.data.color.g, this.data.color.b, this.data.color.a, this.data)
    }
    toFlagFill() {
        return new FlagFill(this.data.flag.id, this.data)
    }
    get getBackgroundCSS() {
        return this.getBackground
    }
    encode() {
        return {objectType: "fill", fillType: this.type, data: this.data}
    }
}

class ColorFill extends Fill {
    constructor(r, g, b, a, data) {
        super()
        this.r = r
        this.g = g
        this.b = b
        this.a = a
        this.data.color = {
            r,
            g,
            b,
            a
        }
        this.type = "color"
        this.data = data || this.data
    }
    getBackground() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
    }
    getDefs() {
        return null
    }
    setUpdate(newObject) {
        this.r = newObject.r
        this.g = newObject.g
        this.b = newObject.b
        this.a = newObject.a
        this.data.color = {
            r: newObject.r,
            g: newObject.g,
            b: newObject.b,
            a: newObject.a
        }
    }
    clone() {
        return new ColorFill(this.r, this.g, this.b, this.a, JSON.parse(JSON.stringify(this.data)))
    }
}

class FlagFill extends Fill {
    constructor(id, data) {
        super()
        this.id = id || "ad"
        this.type = "flag"
        this.data = data || this.data
    }
    getBackgroundCSS(territory, mode) {
        return `url("https://periphern.impixel.tech/flags/${this.id}.${this.id.includes("_") ? "png" : "svg"}")`
    }
    getBackground(territory, mode) {
        return `url(#${territory.index}.${mode})`
    }
    getDefs(territory, mode) {
        return <>
            <pattern id={`${territory.index}.${mode}`} width="100%" height="100%" patternContentUnits="objectBoundingBox" viewBox="0 0 1 1" preserveAspectRatio="xMidYMid slice">
                <image preserveAspectRatio="none" href={"https://periphern.impixel.tech/flags/" + this.id + (this.id.includes("_") ? ".png" : ".svg")} width="1" height="1"></image>
            </pattern>
        </>
    }
    setUpdate(newObject) {
        this.id = newObject.id
        this.data.flag.id = newObject.id
    }
    clone() {
        return new FlagFill(this.id, JSON.parse(JSON.stringify(this.data))) 
    }
}

function decodeFill(object) {
    switch(object.fillType) {
        case "color":
            return new ColorFill(object.data.color.r, object.data.color.g, object.data.color.b, object.data.color.a, object.data)
        case "flag":
            return new FlagFill(object.data.flag.id, object.data)
    }
}

export {
    ColorFill,
    FlagFill,
    decodeFill
}