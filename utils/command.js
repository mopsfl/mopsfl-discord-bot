const { prefix } = require("../.config.js")
const { createEmbed } = require("../utils/embed")
const { getEmoji } = require("../utils/misc")

const { PermissionsBitField, User, Collection, Message, Colors } = require("discord.js")

module.exports = {
    /**
     * @description Gets the command that's being used in the message
     * @param { Message } message
     */
    getCommand: function(message) {
        if (!message) return
        return this.getArgs(message).shift().toLowerCase()
    },
    /**
     * @description Gets the args that are being used in the message
     * @param { Message } message
     */
    getArgs: function(message) {
        if (!message || !message.content) return
        return message.content.slice(prefix.length).split(' ')
    },
    /**
     * @description Gets the raw args that are being used in the message as a string
     * @param { Message } message
     * @param { String } command
     */
    getRawArgs: function(message) {
        if (!message) return
        return message.content.slice(prefix.length).slice(this.getCommand(message).length + 1)
    },
    /**
     * @description Checks if the message is a command (starts with the bot prefix)
     * @param { Message } message
     */
    isCommand: function(message) {
        if (!message) return
        if (global.client.commands.find(c => c.command == this.getCommand(message))) {
            return message.content.startsWith(prefix) && this.getCommand(message) != ""
        }
    },
    /**
     * @description Gets the properties of a command from the command collection
     * @param { Message } message
     */
    getProps: function(message) {
        if (!message) return
        return global.client.commands.find(c => c.command == this.getCommand(message))
    },
    /**
     * @description Checks if the message mentioned the bot
     * @param { String } message
     */
    isBotMention: function(message) {
        if (!message) return
        return message.mentions.users.find(id => id == global.client.user.id)
    },
    /**
     * @description Parses all the mentions from a message
     * @param { Message } message
     */
    parseMentions: function(message) {
        if (!message) return
        const mentions = message.mentions.users
        if (!mentions) return
        let users = []

        mentions.forEach(async(id) => {
            await global.client.users.fetch(id).then(user => {
                users[id] = user
            }).catch(console.error)
        })
        return users
    },
    /**
     * @description Checks if the user has the specified permission(s)
     * @param { User } user 
     * @param { PermissionsBitField | [ PermissionsBitField ] } permission_bit 
     */
    hasPermission: function(user, permission_bit) {
        if (!user || !permission_bit) return
        return user.permissions.has(permission_bit) || user.permissions.has(PermissionsBitField.Flags.Administrator)
    },
    /**
     * @description Sents a error message
     * @param { Error } error
     * @param { Message } message
     */
    sendErrorMessage: function(error, message) {
        if (!message) return
        let error_message = "```" + `${error.message}` + "```"
        let error_name = "```" + `${error.name}` + "```"
        let error_embed = createEmbed({
            title: `${getEmoji("error")} Internal Error - ${error_name}`,
            color: Colors.Red,
            fields: [
                { name: "Error:", value: `${error_message}` },
            ],
            timestamp: true,
        })
        return message.reply({ embeds: [error_embed] })
    }
}