const embed = require("./utils/embed")
const commandList = require("./utils/commandList")

let cmdlist = commandList.create()
let newembed = embed.createEmbed("title", "desc", undefined, true, { author: { name: "author" }, footer: { text: "footer" }, fields: cmdlist })