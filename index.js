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
    fs = require("fs"),
    app = express(),
    moment = require("moment")

require("dotenv").config()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildModeration,
    ],
    partials: [Partials.Channel],
    fetchAllMembers: false
})

client.commands = new Collection()
client.command_logs = new Collection()

fs.readdir("./commands", (err, files) => {
    if (err) throw err;

    files.forEach(f => {
        try {
            const props = require(`./commands/${f}`)
            client.commands.set(props.command, props)
        } catch (e) { console.error(e) }
    })
})

//UTILS
const commandList = require("./utils/commandList"),
    commandFunctions = require("./utils/command"),
    { createEmbed } = require("./utils/embed"),
    misc = require("./utils/misc.js")

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
    console.log(`Successfully logged in as ${client.user.tag}!\nListening to ${servers} servers.`)
})

// COMMAND HANDLER

client.on("messageCreate", async(message) => {
    if (message.author.bot) return
    try {
        if (commandFunctions.isCommand(message)) {
            const command = {
                cmd: commandFunctions.getCommand(message),
                args: commandFunctions.getArgs(message),
                rawargs: commandFunctions.getRawArgs(message),
                props: commandFunctions.getProps(message),
                message: message,
            }
            if (message.guild == null && !command.props.allow_dm || !command.props.enabled) return
            let arg_length = command.props.arguments.length == 0 ? 0 : command.props.min_args || 0
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
                client.command_logs.set(command.cmd, command)
                console.log(`'${command.cmd}' command requested by ${message.author.tag}`)
            })
        } else if (commandFunctions.isBotMention(message)) {
            const helpCommand = client.commands.find(cmd => cmd.command == "help")
            if (helpCommand) helpCommand.callback(message)
        }
    } catch (e) {
        console.error(e)
    }
})

//SERVER

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next()
})


app.get("/api/*", (req, res, next) => {
    try {
        if (!req.query.auth || req.query.auth != process.env.APIKEY) return res.status(401).json({ code: 401, message: "No Authorization" })
    } catch (e) {
        res.status(500).json({ code: 500, message: "Internal Server Error" });
        console.error(e)
    }
    next();
})
app.get("/", (req, res) => res.json({ code: 200, message: "OK" }))
app.get("/api", (req, res) => res.json({ code: 200, message: "OK" }))
app.get("/api/client", (req, res) => res.status(200).json({ code: 200, status: client.options.ws.presence.status }))
app.get("/api/client/uptime", (req, res) => res.json({ code: 200, uptime: client.uptime }))
app.get("/api/client/commandlogs", (req, res) => res.json(client.command_logs))
app.get("/api/client/info", (req, res) => res.status(200).json(client))
app.get("/api/test", (req, res) => {
    try {
        res.status(200).json({ code: 200, status: client.options.ws.presence.status })
    } catch (e) {
        console.error(e)
        res.status(500).json({ code: 500, message: "Internal Server Error" })
    }
})
app.get("/*", (req, res) => res.json({ code: 404, message: "Page Not Found" }))

//SETUP

try {
    client.login(process.env.TOKEN).then(() => {
        console.info("Logging in...")
        global.client = client
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server started")
        })
    }).catch(console.error)
} catch (e) {
    console.error(e)
}