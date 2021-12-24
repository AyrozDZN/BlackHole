const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Renvoie le ping en ms.'),

    async run(client, interaction) {
        console.log(interaction)
        interaction.reply({ content: `Pong! **${client.ws.ping}ms**`, ephemeral: true })
        
    }
}