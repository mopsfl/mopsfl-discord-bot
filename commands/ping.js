const { createEmbed } = require("../utils/embed.js")
const { Colors } = require("discord.js")
const commandList = require("../utils/commandList")
const { create } = require("../utils/commandList")

module.exports = {
    enabled: true,

    category: "BOT",
    command: "ping",

    arguments: "",

    allow_dm: true,
    ignore_arguments: true, //wont throw any syntax error even if the arguments are wrong

    callback: async function(command) {
        const client = global.client,
            message = command.message

        let embed = createEmbed({
            description: "Pinging... Please wait!",
            color: Colors.Yellow,
        })
        message.reply({ embeds: [embed] }).then(msg => {
            const ping = msg.createdTimestamp - message.createdTimestamp
            msg.edit({
                embeds: [createEmbed({ description: "Received a ping of: `" + `${ping+"ms"}` + "`", color: Colors.Green, timestamp: true })]
            })
        })
    }
}