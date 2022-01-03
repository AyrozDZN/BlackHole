const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const humanizeDuration = require('humanize-duration')
const moment = require('moment')
moment.locale('fr')
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('warnlist')
    .setDescription("Affiche la liste des avertissements d'un membre")
    .addUserOption(option => option.setName("membre").setDescription("Membre en question.")),

    async run(client, interaction) {

        const member = interaction.options.getMember("membre") || interaction.member
        const author = interaction.member

        const permissionEmbed = new MessageEmbed()
            .setAuthor({ name: author.user.username, iconURL: author.user.avatarURL() })
            .setDescription("Vous n'avez pas la permission require pour éxécuter cette commande `MODERATE_MEMBERS` requis.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

        const botEmbed = new MessageEmbed()
            .setAuthor({ name: author.user.username, iconURL: author.user.avatarURL() })
            .setDescription("Vous ne pouvez pas warn un bot.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

        if (!author.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ embeds: [permissionEmbed], ephemeral: true })
        if (member.user.bot) return interaction.reply({ embeds: [botEmbed], ephemeral: true })

        const noWarnEmbed = new MessageEmbed()
            .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
            .setDescription("Ce membre n'a reçu aucun avertissement")
            .setColor(client.config.discord.color)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

        if (!client.warns[interaction.guild.id]) return interaction.reply({ embeds: [noWarnEmbed] })
        if (!client.warns[interaction.guild.id][member.user.id]) return interaction.reply({ embeds: [noWarnEmbed] })

        var i = 1;
        var warnCounterDate = [0, 0, 0]
        var text = "";
        client.warns[interaction.guild.id][member.user.id].forEach(warn => {
            if (moment().diff(moment(warn.date)) < 86400000) warnCounterDate[0]++
            if (moment().diff(moment(warn.date)) < 604800000) warnCounterDate[1]++
            warnCounterDate[2]++

            if (i <= 10) text += `**${i}# ${warn.reason != "" ? warn.reason.length >= 50 ? warn.reason.substring(0, 50) + "..." : warn.reason : "Aucune raison"}** • ${humanizeDuration(moment().diff(moment(warn.date)), { units: ["y", "mo", "d", "h", "m", "s"], round: true, language: "fr", largest: 2, delimiter: " et "})}\n`
            i++
        })

        const warnListEmbed = new MessageEmbed()
            .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
            .addField("Dernières 24 heures", `${warnCounterDate[0]} ${warnCounterDate[0] > 1 ? 'avertissements' : 'avertissement'}`, true)
            .addField("Derniers 7 jours", `${warnCounterDate[1]} ${warnCounterDate[1] > 1 ? 'avertissements' : 'avertissement'}`, true)
            .addField("Total", `${warnCounterDate[2]} ${warnCounterDate[2] > 1 ? 'avertissements' : 'avertissement'}`, true)
            .addField("Les 10 derniers avertissements", text)
            .setColor(client.config.discord.color)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })
        
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId("deleteAllWarn").setLabel("Supprimer tout les avertissements").setStyle("SECONDARY")
            )
        
        interaction.reply({ embeds: [warnListEmbed], components: [row] })

        const filter = i => i.user.id == author.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'deleteAllWarn') {
                delete client.warns[interaction.guild.id][member.user.id]

                fs.writeFileSync('./config/warns.json', JSON.stringify(client.warns, null, 4), err => {
                    if (err) throw err;
                })

                const successEmbed = new MessageEmbed()
                    .setAuthor({ name: member.user.username, iconURL: member.user.avatarURL() })
                    .setDescription(`Les warns du membre on été supprimé.`)
                    .setColor(client.config.discord.colorSuccess)
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

                interaction.editReply({ embeds: [successEmbed], components: [] })
                collector.stop('ended')
	        }
        });

        collector.on('end', (collected, reason) => {
            if (reason != 'time') return 

            interaction.editReply({ embeds: [warnListEmbed], components: [] })
        });
    }
}