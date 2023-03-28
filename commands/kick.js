const { createEmbed } = require("../utils/embed.js")
const { Colors } = require("discord.js")

module.exports = {
    enabled: true,

    category: "STAFF",
    command: "kick",

    arguments: "<user>",
    min_args: 1,

    allow_dm: false,
    ignore_arguments: false, //wont throw any syntax error even if the arguments are wrong

    callback: async function(command) {
        const client = global.client,
            message = command.message


    }
}