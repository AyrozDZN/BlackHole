const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const humanizeDuration = require('humanize-duration')
const moment = require('moment')
const fs = require('fs')

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Avertir')
    .setType(2),

    async run(client, interaction) {

        const warnMember = interaction.guild.members.cache.get(interaction.targetId)
        const warnAuthor = interaction.member
        var reasonWarn = ""

        const permissionEmbed = new MessageEmbed()
            .setAuthor({ name: warnAuthor.user.username, iconURL: warnAuthor.user.avatarURL() })
            .setDescription("Vous n'avez pas la permission require pour éxécuter cette commande `MODERATE_MEMBERS` requis.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

        const botEmbed = new MessageEmbed()
            .setAuthor({ name: warnAuthor.user.username, iconURL: warnAuthor.user.avatarURL() })
            .setDescription("Vous ne pouvez pas warn un bot.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

        if (!warnAuthor.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ embeds: [permissionEmbed], ephemeral: true })
        if (warnMember.user.bot) return interaction.reply({ embeds: [botEmbed], ephemeral: true })

        const warnEmbed = new MessageEmbed()
            .setColor(client.config.discord.color)
            .setAuthor({ name: warnMember.user.username, iconURL: warnMember.user.avatarURL() })
            .setTitle(`Gestion du warn`)
            .addField("🏷 Membre warn :", warnMember.user.tag, true)
            .addField("🏷 Auteur du warn :", warnAuthor.user.tag, true)
            .addField("📎 Raison :", reasonWarn != "" ? reasonWarn : "Aucune raison")
            .addField("📆 Date du warn :", moment(interaction.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss'))
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })  

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('confirmed').setLabel("Valider").setStyle("SUCCESS"),
                new MessageButton().setCustomId('reason').setLabel("Entrer une raison").setStyle("SECONDARY"),
                new MessageButton().setCustomId('cancel').setLabel("Annuler").setStyle("DANGER")
            )    

        interaction.reply({ embeds: [warnEmbed], components: [row] })

        const filter = i => i.user.id == warnAuthor.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

        collector.on('collect', async i => {
            if (i.customId === 'confirmed') {
                if (!client.warns[interaction.guild.id]) client.warns[interaction.guild.id] = {}
                if (!client.warns[interaction.guild.id][warnMember.user.id]) client.warns[interaction.guild.id][warnMember.user.id] = []
                client.warns[interaction.guild.id][warnMember.user.id].unshift({
                    warnAuthor: warnAuthor.user.id,
                    reason: reasonWarn,
                    date: interaction.createdAt
                })

                fs.writeFileSync('./config/warns.json', JSON.stringify(client.warns, null, 4), err => {
                    if (err) throw err;
                })

                const successEmbed = new MessageEmbed()
                
                    .setAuthor({ name: warnMember.user.username, iconURL: warnMember.user.avatarURL() })
                    .setDescription(`Le membre à été warn.\n**Raison :** ${reasonWarn ? reasonWarn : "Aucune raison"}.`)
                    .setColor(client.config.discord.colorSuccess)
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

                interaction.editReply({ embeds: [successEmbed], components: [] })
                collector.stop('ended')
	        }
            
	        if (i.customId === 'reason') {
                
                interaction.editReply({ embeds: [warnEmbed], components: [] })

                const reasonEmbed = new MessageEmbed()
                    .setAuthor({ name: warnAuthor.user.username, iconURL: warnAuthor.user.avatarURL() })
                    .setDescription("Veuillez entrer une raison.")
                    .setColor(client.config.discord.color)
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

                i.reply({ embeds: [reasonEmbed], components: [] })
		
                const filter = m => m.author.id == warnAuthor.id;
                const collector2 = i.channel.createMessageCollector({ filter, time: 60000 });
                collector2.on('collect', m => {
                    reasonWarn = m.content
                    m.delete()
                    collector2.stop('ended')
                });
                collector2.on('end', (collected, reason) => {
                    i.deleteReply()
                    const updateWarnEmbed = new MessageEmbed()
                        .setColor(client.config.discord.color)
                        .setTitle(`Gestion du warn`)
                        .addField("🏷 Membre warn :", warnMember.user.tag)
                        .addField("🏷 Auteur du warn :", warnAuthor.user.tag)
                        .addField("📎 Raison :", reasonWarn != "" ? reasonWarn : "Aucune raison", true)
                        .addField("📆 Date du warn :", moment(interaction.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss'))
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })  
                    if (reason == 'ended') interaction.editReply({ embeds: [updateWarnEmbed], components: [row] })
                    collector.resetTimer()
                });
	        }

            if (i.customId === 'cancel') {
                const cancelEmbed = new MessageEmbed()
                    .setAuthor({ name: warnMember.user.username, iconURL: warnMember.user.avatarURL() })
                    .setDescription("Le membre n'a pas été warn.")
                    .setColor(client.config.discord.colorSuccess)
                    .setTimestamp()
                    .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

                interaction.editReply({ embeds: [cancelEmbed], components: [] })
                collector.stop('ended')
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason != 'time') return 

            const timeEmbed = new MessageEmbed()
                .setAuthor({ name: warnAuthor.user.username, iconURL: warnAuthor.user.avatarURL() })
                .setDescription("Vous n'avez pas répondu dans les temps, le warn a été annulé.")
                .setColor(client.config.discord.colorError)
                .setTimestamp()
                .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

            interaction.editReply({ embeds: [timeEmbed], components: [] })
        });
    }
}