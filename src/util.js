import {serverLocation} from "./constants.js"

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
export async function post(route, body) {
    let s = await fetch(serverLocation + route, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Session-Id': window.localStorage.getItem("sessionId"),
      },
      body: JSON.stringify(body)
    })
    
    return s.text()
  }
  
  export async function get(route) {
    let s = await fetch(serverLocation + route, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Session-Id': window.localStorage.getItem("sessionId"),
      },
    })
    
    return s.text()
  }

function parseSvg(svgString) {
    let parser = new DOMParser()
    let documentSvg = parser.parseFromString(svgString, "text/xml")
    let mapNodes = Array.from(documentSvg.getElementsByTagName("path")) // Array.from(documentSvg.children[0].children).filter(element => element.tagName == "path")
    let svgElement = documentSvg.children[0]
    document.body.appendChild(svgElement)
    return {
        mapNodes,
        dimensions: {
            width: parseInt(svgElement.getAttribute("width")),
            height: parseInt(svgElement.getAttribute("height"))
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
        outlineSize: annotation.outlineSize || defaultStyle.outlineSize
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
        case "image":
            return 2
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

function svgToPng(svg) {
    const url = getSvgUrl(svg);
    return new Promise(function(resolve, reject) {
        svgUrlToType(url, "image/png", (imgData) => {
            resolve(imgData);
            URL.revokeObjectURL(url);
        });
    })
}
function svgToJpg(svg) {
    const url = getSvgUrl(svg)
    return new Promise(function(resolve, reject) {
        svgUrlToType(url, "image/jpeg", (imgData) => {
            resolve(imgData);
            URL.revokeObjectURL(url);
        });
    })
}
function svgToWebp(svg) {
    const url = getSvgUrl(svg)
    return new Promise(function(resolve, reject) {
        svgUrlToType(url, "image/webp", (imgData) => {
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
function svgUrlToType(svgUrl, type, callback) {
    const svgImage = document.createElement('img');
    document.body.appendChild(svgImage);
    
    svgImage.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = svgImage.clientWidth;
        canvas.height = svgImage.clientHeight;
        const canvasCtx = canvas.getContext('2d');
        canvasCtx.drawImage(svgImage, 0, 0);
        const imgData = canvas.toDataURL(type);
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

function stringIsBase64(string) {
    try {
        window.atob(string)
        return true
    } catch(e) {
        return false
    }
}

function convertSvgUrlsToBase64(svg) {
    let images = Array.from(svg.getElementsByTagName("image"))
    return new Promise(async function(resolve, reject) {
        if(images.length) {
            let loadedCount = 0
            for(let i = 0; i != images.length; i++) {
                let image = images[i]
                if(stringIsBase64(image.getAttribute("href"))) {
                    continue
                }
                let response = await fetch(image.getAttribute("href"))
                let blob = await response.blob()
                let reader = new FileReader()
                reader.onload = function() {
                    image.setAttribute("href", this.result)
                    loadedCount++
                    if(loadedCount == images.length) {
                        resolve(svg)
                    }
                }
                reader.readAsDataURL(blob)
            }
        } else {
            resolve(svg)
        }
        
    })  
}

function combineBoundingBoxes(boundingBox1, boundingBox2) {
    let x = Math.min(boundingBox1.x, boundingBox2.x)
    let y = Math.min(boundingBox1.y, boundingBox2.y)
    let right1 = boundingBox1.x + boundingBox1.width
    let right2 = boundingBox2.x + boundingBox2.width
    let bottom1 = boundingBox1.y + boundingBox1.height
    let bottom2 = boundingBox2.y + boundingBox2.height
    let right = Math.max(right1, right2)
    let bottom = Math.max(bottom1, bottom2)
    let width = right - x
    let height = bottom - y
    
    return {x, y, width, height}
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
}

const getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function getImageDataCoordinate(imageData, x, y) {
    var red = imageData.data[((imageData.width * y) + x) * 4];
    var green = imageData.data[((imageData.width * y) + x) * 4 + 1];
    var blue = imageData.data[((imageData.width * y) + x) * 4 + 2];
    var alpha = imageData.data[((imageData.width * y) + x) * 4 + 3];
    return {
        r: red,
        g: green,
        b: blue,
        a: alpha
    }
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbaToHex(r, g, b, a) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
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
    convertSvgUrlsToBase64,
    svgToJpg,
    svgToWebp,
    combineBoundingBoxes,
    hexToRgb,
    getBase64,
    getImageDataCoordinate,
    rgbaToHex
}