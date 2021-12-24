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
client.slashCommands = new discord.Collection();

//Slash Commands Handler
const slashCommandsFiles = fs.readdirSync(`./commands/`).filter(files => files.endsWith('.js'));

    for (const file of slashCommandsFiles) {
        const slash = require(`./commands/${file}`);
        console.log(`Slash Commande chargé ${file}`);
        client.slashCommands.set(slash.data.name, slash);
    };

//Events handler
const events = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of events) {
    console.log(`Event discord.js chargé : ${file}`)
    const event = require(`./events/${file}`);
    client.on(file.split(".")[0], event.bind(null, client));
};

client.login(client.config.discord.token);