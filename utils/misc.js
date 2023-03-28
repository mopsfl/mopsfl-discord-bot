const moment = require("moment")

module.exports = {
    /**
     * @description Formats milliseconds
     * @param {Number} ms
     */
    formatMS: function(ms) {

    },
    /**
     * @description Gets a emoji with the given name
     * @param {String} name
     */
    getEmoji: function(name) {
        if (!name) return
        let emoji = global.client.emojis.cache.find(emoji => emoji.name === name)

        return emoji
    }
}