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

function createArray(element1, element2) {
    if(Array.isArray(element1)) {
        let toReturn = [...element1, element2]
        return toReturn
    } else {
        return [element1, element2]
    }
}

function svgToPng(svg, callback) {
    const url = getSvgUrl(svg);
    svgUrlToPng(url, (imgData) => {
      callback(imgData);
      URL.revokeObjectURL(url);
    });
  }
function getSvgUrl(svg) {
    return URL.createObjectURL(new Blob([svg], {
        type: 'image/svg+xml'
    }));
}
function svgUrlToPng(svgUrl, callback) {
    const svgImage = document.createElement('img');
    document.body.appendChild(svgImage);
    svgImage.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.drawImage(svgImage, 0, 0);
        const imgData = canvas.toDataURL('image/png');
        callback(imgData);
        document.body.removeChild(svgImage);
    };
    svgImage.src = svgUrl;
}


function download(text, name, type) {
  var a = document.getElementById("a");
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
}

function isMobile() { return ('ontouchstart' in document.documentElement); }

export {
    getMapImageUrl,
    ajax,
    parseSvg,
    getTerritoryComputedStyle,
    typeToValue,
    generateId,
    orEmptyString,
    roundToTwo,
    createArray,
    svgToPng,
    download,
    isMobile
}