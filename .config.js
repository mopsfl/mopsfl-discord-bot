let prefix = "-"

module.exports = {
    prefix: prefix, // Prefix for commands
    activity_update_interval: 10000, // Update interval for the bot activity
    dm_commands: true, // If dm commands should be allowed 
    activities: [ // Bot activities
        `${prefix}help`,
    ],
    command_list: { // Commands list for the help command
        "STAFF": [
            "kick",
            "ban"
        ],
        "BOT": [
            "help",
            "ping",
        ],
    },
    ignored_guilds: [
        "",
    ]
}