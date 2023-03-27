const fs = require("fs")

fs.readdir("./commands", (err, files) => {
    if (err) throw err;

    files.forEach(f => {
        const props = require(`./commands/${f}`)
        console.log(props)
    })
})