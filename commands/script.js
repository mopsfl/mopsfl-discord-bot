const { createEmbed } = require("../utils/embed.js")
const { Colors, PermissionsBitField } = require("discord.js")

module.exports = {
    enabled: true,

    category: "MOPSHUB",
    command: "script",

    arguments: "<game_name>",

    allow_dm: true,
    ignore_arguments: true, //wont throw any syntax error even if the arguments are wrong

    callback: async function(arg) {
        const client = global.client,
            message = arg.message

        if (!message) return
        let embed

        if (command.rawargs.length < 2) {
            embed = createEmbed({
                title: "mopsHub - Script",
                color: Colors.Green,
                timestamp: true,
                fields: [{
                    name: "Loader:",
                    value: '```lua\nloadstring(game:HttpGet("https://raw.githubusercontent.com/mopsfl/rbxmopshub/main/loader.lua"))()```'
                }],
                footer: {
                    text: "mopsHub"
                }
            })
        } else {
            let script_str = "`" + command.rawargs + "`"
            let loading_emoji = client.emojis.cache.find(emoji => emoji.name === 'loading')
            embed = createEmbed({
                description: `${loading_emoji} Searching script for ${script_str}...`,
                color: Colors.Yellow,
            })
        }

        if (embed) message.reply({ embeds: [embed] })
    }
}