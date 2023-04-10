const { createEmbed } = require("../utils/embed")
const { Colors, PermissionsBitField } = require("discord.js")
const { create } = require("../utils/commandList")
const { getEmoji } = require("../utils/misc")
const commandFunctions = require("../utils/command")

module.exports = {
    enabled: true,

    category: "STAFF",
    command: "kick",

    arguments: "<user>",
    min_args: 1,

    required_permissions: [
        PermissionsBitField.Flags.ModerateMembers
    ],

    allow_dm: false,
    ignore_arguments: false, //wont throw any syntax error even if the arguments are wrong

    callback: async function(arg) {
        try {
            const client = global.client,
                message = arg.message || arg

            if (!message) return
            let user = message.mentions.members.first()
            if (user) {
                if (user.id != message.author.id) {
                    if (!user.bot) {
                        let allowed = true
                        for (let i = 0; i < this.required_permissions.length; i++) {
                            const permission_bit = this.required_permissions[i];
                            if (commandFunctions.hasPermission(message.member, permission_bit)) allowed = false
                        }
                        if (!allowed) {
                            let embed = createEmbed({
                                title: `${getEmoji("failed")} Missing Permissions`,
                                color: Colors.Red,
                                description: `You are not allowed to kick ${user}.`,
                                timestamp: true
                            })
                            return message.reply({ embeds: [embed] })
                        }

                    } else {
                        let error_embed = createEmbed({
                            description: `${getEmoji("failed")} You can't kick bots with this command!`,
                            color: Colors.Red,
                        })
                        return message.reply({ embeds: [error_embed] })
                    }
                } else {
                    let error_embed = createEmbed({
                        description: `${getEmoji("failed")} You can't kick yourself from this server!`,
                        color: Colors.Red,
                    })
                    return message.reply({ embeds: [error_embed] })
                }
            } else {
                let invalid_user = isNaN(arg.args[1].replace("<@", "").replace(">", "")) ? "`" + arg.args[1] + "`" : `${arg.args[1] }`
                let error_embed = createEmbed({
                    description: `${getEmoji("error")} Unable to find ${invalid_user} in this server.`,
                    color: Colors.Red,
                })
                return message.reply({ embeds: [error_embed] })
            }
        } catch (e) {
            commandFunctions.sendErrorMessage(e, arg.message || arg)
            console.error(e)
        }
    }
}