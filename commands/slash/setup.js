const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, version } = require('discord.js');
const humanizeDuration = require('humanize-duration')
const moment = require('moment')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure le bot.'),

    async run(client, interaction) {
        
    }
}