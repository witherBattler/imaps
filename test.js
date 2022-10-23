const {MAP_NAMES} = require("./src/constants")
const http = require("https")
const fs = require("fs")

/* 
const file = fs.createWriteStream("pics/file.svg")
const request = http.get(MAP_NAMES[0].url, function(response) {
    response.pipe(file)
    file.on("finish", () => {
        file.close()
    })
})

MAP_NAMES.forEach(map => {
    const file = fs.createWriteStream(`pics/${map.name}.svg`)
    const request = http.get(map.url, function(response) {
        response.pipe(file)
        file.on("finish", () => {
            file.close()
        })
    })
}) */

MAP_NAMES.forEach(map => {
    if(map.name != map.id) {
        fs.rename(`./public/maps/${map.name}.svg`, `./public/maps/${map.id}.svg`, function(err) {
            console.log(err)
        })
    }
})