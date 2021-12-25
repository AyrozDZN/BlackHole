const discord = require('discord.js');
const fs = require('fs');

const client = new discord.Client({
    intents: [
        discord.Intents.FLAGS.GUILDS,
        discord.Intents.FLAGS.GUILD_VOICE_STATES,
        discord.Intents.FLAGS.GUILD_BANS,
        discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        discord.Intents.FLAGS.GUILD_MESSAGES,
        discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.config = require('./config/config');
client.emotes = client.config.emojis;
client.commands = new discord.Collection();

//Slash and Context Commands Handler
fs.readdirSync('./commands').forEach(dirs => {
    const commandsFiles = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commandsFiles) {
        const cmds = require(`./commands/${dirs}/${file}`);
        console.log(`Commande chargé ${file}`);
        client.commands.set(cmds.data.name, cmds);
    };
});

//Events handler
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of events) {
    console.log(`Event discord.js chargé : ${file}`)
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
};

//Anti-Raid setup
client.guildSettings = require('./config/guildSettings.json')
client.warns = require('./config/warns.json')

client.numAddBotMap = new Map()
client.numBanMap = new Map()
client.numKickMap = new Map()
client.numEveryoneMap = new Map()
client.numLinkMap = new Map()
client.numSpamMap = new Map()
client.numWebhookMap = new Map()
client.numCreateChannelMap = new Map()
client.numDeleteChannelMap = new Map()

client.login(client.config.discord.token);