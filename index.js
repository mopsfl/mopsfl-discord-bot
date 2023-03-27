const { create } = require("domain")
const express = require("express"),
    {
        Client,
        GatewayIntentBits,
        PermissionsBitField,
        ActivityType,
        Partials,
        Colors,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle,
        EmbedBuilder,
        Collection
    } = require("discord.js"),
    config = require("./.config.js"),
    fs = require("fs")

require("dotenv").config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ],
    partials: [Partials.Channel],
    fetchAllMembers: false
})

client.commands = new Collection()
fs.readdir("./commands", (err, files) => {
    if (err) throw err;

    files.forEach(f => {
        const props = require(`./commands/${f}`)
        client.commands.set(props.command, props)
    })
})

//UTILS
const commandList = require("./utils/commandList"),
    commandFunctions = require("./utils/command"),
    { createEmbed } = require("./utils/embed")

// CLIENT READY
client.on("ready", async() => {
    const servers = client.guilds.cache.size

    setInterval(() => {
        const i = Math.floor(Math.random() * config.activities.length)
        client.user.setPresence({
            activities: [{
                name: `${config.activities[i]}`,
                type: ActivityType.Watching
            }],
            status: `${config.activities[i]}`
        })
    }, config.activity_update_interval || 5000)

    console.log(`Logged in as ${client.user.tag}!\nListening to ${servers} servers.`)
})

// COMMAND HANDLER

client.on("messageCreate", async(message) => {
    if (message.author.bot) return
    try {
        if (commandFunctions.isCommand(message)) {
            const command = {
                cmd: commandFunctions.getCommand(message),
                args: commandFunctions.getArgs(message),
                props: commandFunctions.getProps(message),
                message: message,
            }
            if (message.guild == null && !command.props.allow_dm || !command.props.enabled) return
            let arg_length = command.props.arguments != "" ? 0 : command.props.arguments.length
            if (((command.args.length - 1) > arg_length || (command.args.length - 1) < arg_length) && !command.props.ignore_arguments) {
                let usage_args = command.props.arguments.length > 0 ? "`" + `${command.props.arguments}` + "`" : ""
                let usage_cmd = "`" + `${config.prefix}${command.cmd}` + "`"
                let embed = createEmbed({
                    title: "Syntax Error",
                    color: Colors.Red,
                    fields: [
                        { name: "Usage:", value: `${usage_cmd} ${usage_args}` }
                    ],
                    timestamp: true
                })
                message.reply({ embeds: [embed] })
                return
            }
            command.props.callback(command).then(() => {
                console.log(`'${command.cmd}' command requested by ${message.author.tag}`)
            })
        }
    } catch (e) {
        console.error(e)
    }
})

//SETUP

try {
    client.login(process.env.TOKEN).then(() => {
        global.client = client
    }).catch(console.error)
} catch (e) {
    console.error(e)
}