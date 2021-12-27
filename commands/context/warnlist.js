const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Message } = require('discord.js');
const humanizeDuration = require('humanize-duration')
const moment = require('moment')
moment.locale('fr')
const fs = require('fs')

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Liste Avertissement')
    .setType(2),

    async run(client, interaction) {

        const member = interaction.guild.members.cache.get(interaction.targetId)
        const author = interaction.member

        const botEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("Commande impossible")
            .setDescription("Vous ne pouvez pas éxécuter cette commande sur un bot.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter(`${client.user.username} • ${client.config.discord.footer}`, client.user.avatarURL())

        const permissionEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("Permission manquante")
            .setDescription("Vous n'avez pas la permission require pour éxécuter cette commande `MODERATE_MEMBERS` requis.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter(`${client.user.username} • ${client.config.discord.footer}`, client.user.avatarURL())

        if (!author.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ embeds: [permissionEmbed], ephemeral: true })
        if (member.user.bot) return interaction.reply({ embeds: [botEmbed], ephemeral: true })
        
        const noWarnEmbed = new MessageEmbed()
            .setAuthor(member.user.username, member.user.avatarURL())
            .setTitle("Liste des avertissements : ")
            .setDescription("Ce membre n'a reçu aucun avertissement")
            .setColor(client.config.discord.color)
            .setTimestamp()
            .setFooter(`${client.user.username} • ${client.config.discord.footer}`, client.user.avatarURL())

        if (!client.warns[interaction.guild.id]) return interaction.reply({ embeds: [noWarnEmbed] })
        if (!client.warns[interaction.guild.id][member.user.id]) return interaction.reply({ embeds: [noWarnEmbed ]})

        var i = 1;
        var warnCounterDate = [0, 0, 0]
        var text = "";
        client.warns[interaction.guild.id][member.user.id].forEach(warn => {
            if (moment().diff(moment(warn.date)) < 86400000) warnCounterDate[0]++
            if (moment().diff(moment(warn.date)) < 604800000) warnCounterDate[1]++
            warnCounterDate[2]++

            if (i <= 10) text += `**${warn.reason.length >= 50 ? warn.reason.substring(0, 50) + "..." : warn.reason}** • ${humanizeDuration(moment().diff(moment(warn.date)), { units: ["y", "mo", "d", "h", "m", "s"], round: true, language: "fr", largest: 2, delimiter: " et "})}\n`
            i++
        })
   
        console.log(text)

        const warnListEmbed = new MessageEmbed()
            .setAuthor(member.user.username, member.user.avatarURL())
            .addField("Dernières 24 heures", `${warnCounterDate[0]} ${warnCounterDate[0] > 1 ? 'avertissements' : 'avertissement'}`, true)
            .addField("Derniers 7 jours", `${warnCounterDate[1]} ${warnCounterDate[1] > 1 ? 'avertissements' : 'avertissement'}`, true)
            .addField("Total", `${warnCounterDate[2]} ${warnCounterDate[2] > 1 ? 'avertissements' : 'avertissement'}`, true)
            .addField("Les 10 derniers avertissements", text)
            .setColor(client.config.discord.color)
            .setTimestamp()
            .setFooter(`${client.user.username} • ${client.config.discord.footer}`, client.user.avatarURL())
        
        interaction.reply({ embeds: [warnListEmbed] })
    }
}