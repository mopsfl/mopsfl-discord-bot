const { createEmbed } = require("../utils/embed")
const { Colors } = require("discord.js")
const { create } = require("../utils/commandList")
const { getEmoji } = require("../utils/misc")

module.exports = {
    enabled: true,

    category: "STAFF",
    command: "kick",

    arguments: "<user>",
    min_args: 1,

    allow_dm: false,
    ignore_arguments: false, //wont throw any syntax error even if the arguments are wrong

    callback: async function(arg) {
        const client = global.client,
            message = arg.message || arg

        if (!message) return
        let user = message.mentions.members.first()
        if (user) {
            if (user.id != message.author.id) {
                if (user.bot == false) {

                } else {
                    let error_embed = createEmbed({
                        description: `${getEmoji("delete")} You can't kick bots with this command!`,
                        color: Colors.Red,
                    })
                    message.reply({ embeds: [error_embed] })
                }
            } else {
                let error_embed = createEmbed({
                    description: `${getEmoji("delete")} You can't kick yourself from this server!`,
                    color: Colors.Red,
                })
                message.reply({ embeds: [error_embed] })
            }
        } else {
            let invalid_user = isNaN(arg.args[1].replace("<@", "").replace(">", "")) ? "`" + arg.args[1] + "`" : `${arg.args[1] }`
            let error_embed = createEmbed({
                description: `${getEmoji("delete")} Unable to find ${invalid_user} in this server.`,
                color: Colors.Red,
            })
            message.reply({ embeds: [error_embed] })
        }
    }
}