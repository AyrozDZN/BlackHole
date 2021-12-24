const fs = require('fs');
const discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [];
fs.readdirSync('./commands').forEach(dirs => {
    const commandsFiles = fs.readdirSync(`./commands/${dirs}`).filter(files => files.endsWith('.js'));

    for (const file of commandsFiles) {
        const cmd = require(`../commands/${dirs}/${file}`);
        commands.push(cmd.data.toJSON())
    };
});

const rest = new REST({ version: "9" }).setToken("Type your token here")

createSlash()

async function createSlash() {
    try {
        await rest.put(
            Routes.applicationCommands("ID of the Bot", "ID of the server"), {
                body: commands
            }
        )
        console.log('Slash Commande ajouté')
    } catch(e) {
        console.log(e)
    }
}