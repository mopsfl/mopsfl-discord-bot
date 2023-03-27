let prefix = "-"

module.exports = {
    prefix: prefix, //Prefix for commands
    activity_update_interval: 5, //Update interval for the bot activity
    dm_commands: true, //if dm commands should be allowed 
    activities: [ //Bot activities
        `${prefix}help`
    ],
    command_list: { //Commands list for the help command
        "BOT": [
            "help",
            "ping",
        ],
    }
}