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
    secrets = require("dotenv").config(),
    config = require("./.config.js"),
    { MongoClient } = require("mongodb"),
    fs = require("fs")

const URI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mopsfldiscordbot.pdtp3ig.mongodb.net/?retryWrites=true&w=majority`

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
    commandFunctions = require("./utils/command")

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
                props: commandFunctions.getProps(message)
            }
            if (message.guild == null && !command.props.allow_dm) return
            console.log(command)
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