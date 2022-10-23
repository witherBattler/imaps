function getMapImageUrl(id) {
    return `./maps/${id}.svg`
}

function ajax(url, method, data) {
    // fetch
    return new Promise((resolve, reject) => {
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            method: method,
            body: data
        }).then(res => res.text().then(json => {
            resolve(json)
        }))
    }).catch(err => {
        throw err
    })
}

function parseSvg(svgString) {
    let parser = new DOMParser()
    let documentSvg = parser.parseFromString(svgString, "text/xml")
    let mapNodes = Array.from(documentSvg.children[0].children).filter(element => element.tagName == "path")
    let svgElement = documentSvg.children[0]
    document.body.appendChild(svgElement)
    return {
        mapNodes,
        dimensions: {
            width: svgElement.getAttribute("width"),
            height: svgElement.getAttribute("height")
        },
        close: function() {
            svgElement.remove()
        }
    }
}

function getTerritoryComputedStyle(territory, defaultStyle, territoryHTML) {
    return getComputedStyleFromObject({
        fill: territory.fill || defaultStyle.fill,
        outlineColor: territory.outlineColor || defaultStyle.outlineColor,
        outlineSize: territory.outlineSize || defaultStyle.outlineSize
    }, territory, territoryHTML)
}

function getComputedStyleFromObject(style, territory, territoryHTML) {
    return {
        fill: style.fill.getBackground(territory, "fill", territoryHTML),
        outlineColor: style.outlineColor.getBackground(territory, "outlineColor", territoryHTML),
        outlineSize: style.outlineSize,
        defs: <>
            {style.fill.getDefs(territory, "fill", territoryHTML)}
            {style.outlineColor.getDefs(territory, "outlineColor", territoryHTML)}
        </>
    }
}

function typeToValue(string) {
    switch(string) {
        case "color":
            return 0
        case "flag":
            return 1
    }
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function orEmptyString(value1, value2) {
    return value1 == "" ? value1 : value1 || value2
}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}


export {
    getMapImageUrl,
    ajax,
    parseSvg,
    getTerritoryComputedStyle,
    typeToValue,
    generateId,
    orEmptyString,
    roundToTwo
}