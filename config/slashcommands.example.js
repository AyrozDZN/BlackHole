const fs = require('fs');
const discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [];
const slashCommandsFiles = fs.readdirSync(`./commands/`).filter(files => files.endsWith('.js'));

    for (const file of slashCommandsFiles) {
        const slash = require(`../commands/${file}`);
        commands.push(slash.data.toJSON())
    };

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