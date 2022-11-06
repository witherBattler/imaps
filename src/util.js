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

function getAnnotationComputedStyle(annotation, defaultStyle) {
    return getComputedStyleFromAnnotationObject({
        fill: annotation.fill || defaultStyle.fill,
        outlineColor: annotation.outlineColor || defaultStyle.outlineColor,
        outlineSize: annotation.outlineSiz || defaultStyle.outlineSize
    }, annotation)
}

function getComputedStyleFromAnnotationObject(style, annotation) {
    return {
        fill: style.fill.getBackground(annotation, "annotation-fill"),
        outlineColor: style.outlineColor.getBackground(annotation, "annotation-outlineColor"),
        outlineSize: style.outlineSize,
        defs: <>
            {style.fill.getDefs(annotation, "annotation-fill")}
            {style.outlineColor.getDefs(annotation, "annotation-outlineColor")}
        </>
    }
}
function getComputedStyleFromObject(style, territory, territoryHTML) {
    return {
        fill: style.fill.getBackground(territory, "fill"),
        outlineColor: style.outlineColor.getBackground(territory, "outlineColor"),
        outlineSize: style.outlineSize,
        defs: <>
            {style.fill.getDefs(territory, "fill")}
            {style.outlineColor.getDefs(territory, "outlineColor")}
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

async function svgToPng(svg) {
    const url = getSvgUrl(svg);
    return new Promise(function(resolve, reject) {
        svgUrlToPng(url, (imgData) => {
            resolve(imgData);
            URL.revokeObjectURL(url);
        });
    })
  }
function getSvgUrl(svg) {
    return URL.createObjectURL(new Blob([svg], {
        type: 'image/svg+xml'
    }));
}
function svgUrlToPng(svgUrl, callback) {
    const svgImage = document.createElement('img');
    document.body.appendChild(svgImage);
    
    // it "loads", not the images in the svg
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

function getRectFromPoints(point1, point2) {
    console.log(point1, point2)
    let left = Math.min(point1.x, point2.x)
    let right = Math.max(point1.x, point2.x)
    let top = Math.min(point1.y, point2.y)
    let bottom = Math.max(point1.y, point2.y)
    let width = right - left
    let height = bottom - top
    return {left, right, top, bottom, width, height}
}

async function convertSvgUrlsToBase64(svg) {
    let images = Array.from(svg.getElementsByTagName("image"))
    for(let i = 0; i != images.length; i++) {
        let image = images[0]
        console.log(image.getAttribute("href"))
        let base64href = await ajax(image.getAttribute("href"), "GET")
        image.setAttribute("href", base64href)
    }
    return svg
}

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
    isMobile,
    getAnnotationComputedStyle,
    getRectFromPoints,
    convertSvgUrlsToBase64
}