
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const humanizeDuration = require('humanize-duration')
const moment = require('moment')
const os = require('os')

module.exports = {
    setupRequired: "false",
    category: "Info",
    data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Affiche les informations du bot.'),

    async run(client, interaction) {

        const botInfo = new MessageEmbed()
            .setColor(client.config.discord.color)
            .setTitle("👤 Information du Bot :")
            .addField("📋 Nom :", client.user.tag, true)
            .addField("📎 ID :", client.user.id, true)
            .addField("🧑‍💻 Developer :", client.config.discord.developer, true)
            .addField(`🚀 Processeur`, `${os.cpus().map(i => `${i.model}`)[0]}`, true)
            .addField(`⚙️ Architecture`, `${os.arch()}`, true)
            .addField(`📟 RAM`, `${Math.trunc((process.memoryUsage().heapUsed) / 1024 / 1000)} MB / ${Math.trunc(os.totalmem() / 1024 / 1000)} MB (${Math.round((Math.round(process.memoryUsage().heapUsed / 1024 / 1024) / Math.round(os.totalmem() / 1024 / 1024)) * 100)}%)`, true)
            .addField('📉 Latence :', `${client.ws.ping} ms`, true)
            .addField('📈 Uptime :', `${moment().add(-client.uptime, 'ms').format('[Depuis le] DD/MM/YYYY [à] HH:mm:ss')}.\nIl y a ${humanizeDuration(moment(client.uptime), { units: ["y", "mo", "d", "h"], round: true, language: "fr", largest: 2, delimiter: " et "})}`, true)
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp()
            .setFooter(`${client.user.username} • ${client.config.discord.footer}`, client.user.avatarURL())   
        
        interaction.reply({ embeds: [botInfo], ephemeral: true })
    }
}