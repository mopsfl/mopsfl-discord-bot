const { createEmbed } = require("../utils/embed.js")
const { Colors } = require("discord.js")

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
        await message.reply({ embeds: [embed] }).then(async(msg) => {
            const ping = msg.createdTimestamp - message.createdTimestamp
            await msg.edit({
                embeds: [createEmbed({ description: "Received a ping of: `" + `${ping+"ms"}` + "`", color: Colors.Green })]
            })
        })
    }
}