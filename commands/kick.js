const { createEmbed } = require("../utils/embed")
const { Colors, PermissionsBitField } = require("discord.js")
const { getEmoji } = require("../utils/misc")
const commandFunctions = require("../utils/command")

module.exports = {
    enabled: true,

    category: "STAFF",
    command: "kick",

    arguments: "<user> <reason>",
    min_args: 1,
    max_args: 2,

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
                    if (!user.user.bot) {
                        let allowed = true
                        for (let i = 0; i < this.required_permissions.length; i++) {
                            const permission_bit = this.required_permissions[i];
                            if (commandFunctions.hasPermission(message.member, permission_bit) && message.member.roles.highest.position > user.roles.highest.position) allowed = false
                        }
                        if (!allowed) {
                            let embed_missingperms = createEmbed({
                                description: `${getEmoji("failed")} Missing Permissions`,
                                color: Colors.Red,
                                description: `You are not allowed to kick ${user}.`,
                                timestamp: true
                            })
                            return await message.reply({ embeds: [embed_missingperms] })
                        }
                        let embed_final = createEmbed({
                            title: `${getEmoji("check")} Successfully kicked member.`,
                            description: `${user} has been kicked.`,
                            color: Colors.Green,
                            timestamp: true,
                            fields: [
                                { name: "Reason", value: arg.rawargs.slice(user.id.length + 3) || "No reason provided" }
                            ]
                        })
                        let guild_string = "`" + `${message.guild.name}` + "`"
                        let embed_kicked = createEmbed({
                            title: `${getEmoji("warn")} You've been kicked.`,
                            description: `You've been kicked from ${guild_string}.`,
                            color: Colors.Orange,
                            timestamp: true,
                            fields: [
                                { name: "Reason", value: arg.rawargs.slice(user.id.length + 3) || "No reason provided" }
                            ]
                        })
                        await user.send({ embeds: [embed_kicked] })
                        await user.kick(arg.rawargs.slice(user.id.length + 3) || "No reason provided")
                        return await message.reply({ embeds: [embed_final] })
                    } else {
                        let embed_kickb = createEmbed({
                            description: `${getEmoji("failed")} You can't kick bots with this command!`,
                            color: Colors.Red,
                        })
                        return await message.reply({ embeds: [embed_kickb] })
                    }
                } else {
                    let embed_kicky = createEmbed({
                        description: `${getEmoji("failed")} You can't kick yourself from this server!`,
                        color: Colors.Red,
                    })
                    return await message.reply({ embeds: [embed_kicky] })
                }
            } else {
                let invalid_user = isNaN(arg.args[1].replace("<@", "").replace(">", "")) ? "`" + arg.args[1] + "`" : `${arg.args[1] }`
                let error_embed = createEmbed({
                    description: `${getEmoji("error")} Unable to find ${invalid_user} in this server.`,
                    color: Colors.Red,
                })
                return await message.reply({ embeds: [error_embed] })
            }
        } catch (e) {
            commandFunctions.sendErrorMessage(e, arg.message || arg)
            console.error(e)
        }
    }
}