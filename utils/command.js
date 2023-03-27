const config = require("../.config.js")

module.exports = {
    /**
     * @description Gets the command that's being used in the message
     * @param {String} message
     */
    getCommand: function(message) {
        if (!message) return
        return this.getArgs(message).shift().toLowerCase()
    },
    /**
     * @description Gets the args that are being used in the message
     * @param {String} message
     */
    getArgs: function(message) {
        if (!message || !message.content) return
        return message.content.slice(config.prefix.length).split(' ')
    },
    /**
     * @description Gets the raw args that are being used in the message as a string
     * @param {String} message
     * @param {String} command
     */
    getRawArgs: function(message, command) {
        if (!message || !command) return
        message.content.slice(config.prefix.length).replace(`${command}`, '').replace(' ', '')
    },
    /**
     * @description Checks if the message is a command (starts with the bot prefix)
     * @param {String} message
     */
    isCommand: function(message) {
        if (!message) return
        if (global.client.commands.find(c => c.command == this.getCommand(message))) {
            return message.content.startsWith(config.prefix) && this.getCommand(message) != ""
        }
    },
    /**
     * @description Gets the properties of a command from the command collection
     * @param {String} message
     */
    getProps: function(message) {
        if (!message) return
        return global.client.commands.find(c => c.command == this.getCommand(message))
    }
}