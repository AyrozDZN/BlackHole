
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const discord = require('discord.js');
const os = require('os')

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Affiche les informations du bot.'),

    async run(client, interaction) {

        let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);

            let { version } = require("discord.js");

            const botinfoEmbed = new MessageEmbed()
            .setColor(client.config.discord.color)
            .setTitle("👤 Information du Bot :")
            .addField("📋 Nom :", client.user.tag, true)
            .addField("📎 ID :", client.user.id, true)
            .addField("<:developer:851418063744270346> Développeur :", client.users.cache.get("292636011698192384").username, true)
            .addField("🗃 Serveurs : ", `${client.guilds.cache.size} Serveurs.`, true)
            .addField("👥 Utilisateurs :", `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} Utilisateurs.`, true)
            .addField("📊 Salons : ", `${client.channels.cache.size} Salons.`, true)
            .addField('📈 Uptime :', `${days} jour(s), ${hours} heure(s), ${minutes} minute(s), ${seconds} seconde(s).`, true)
            .addField('📉 Latence :', `${client.ws.ping} ms`, true)
            .addField("📋 Librairie :", `discord.js v${version}`, true)
            .addField("📦 Node ", `Node ${process.version}`, true)
            .addField("💻 Platforme", `\`\`${os.platform()}\`\``, true)
            .addField(`⚙️ Architecture`, `${os.arch()}`, true)
            .addField(`🚀 Processeur`, `${os.cpus().map(i => `${i.model}`)[0]}`, true)
            .addField(`📟 RAM`, `${Math.trunc((process.memoryUsage().heapUsed) / 1024 / 1000)} MB / ${Math.trunc(os.totalmem() / 1024 / 1000)} MB (${Math.round((Math.round(process.memoryUsage().heapUsed / 1024 / 1024) / Math.round(os.totalmem() / 1024 / 1024)) * 100)}%)`, true)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(`Demandé par ${interaction.member.displayName}\n${client.user.username}`)
            .setTimestamp()     
        
        interaction.reply({ embeds: [botinfoEmbed], ephemeral: true })
    }
}