const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const humanizeDuration = require('humanize-duration')
const moment = require('moment')
const fs = require('fs')

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Sanctionner')
    .setType(2),

    async run(client, interaction) {

        const warnMember = interaction.guild.members.cache.get(interaction.targetId)
        const warnAuthor = interaction.member
        var reasonWarn = ""

        const warnEmbed = new MessageEmbed()
            .setColor(client.config.discord.color)
            .setTitle(`Gestion du warn`)
            .addField("🏷 Membre warn :", warnMember.user.tag)
            .addField("🏷 Auteur du warn :", warnAuthor.user.tag)
            .addField("📎 Raison :", reasonWarn != "" ? reasonWarn : "Aucune raison", true)
            .addField("📆 Date du warn :", moment(interaction.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss'))
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())  

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('confirmed').setLabel("Valider").setStyle("SUCCESS"),
                new MessageButton().setCustomId('reason').setLabel("Entrer une raison").setStyle("SECONDARY"),
                new MessageButton().setCustomId('cancel').setLabel("Annuler").setStyle("DANGER")
            )

        const permissionEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("Permission manquante")
            .setDescription("Vous n'avez pas la permission require pour éxécuter cette commande `MODERATE_MEMBERS` requis.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())

        const timeEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("Warn annulé")
            .setDescription("Vous n'avez pas répondu dans les temps, le warn a été annulé.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())

        const successEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("Warn confirmé")
            .setDescription("Le warn à bien été enregistré.")
            .setColor(client.config.discord.colorSuccess)
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())

        const cancelEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("Warn annulé")
            .setDescription("Le warn à bien été annulé.")
            .setColor(client.config.discord.colorSuccess)
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())

        const reasonEmbed = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("Raison du warn")
            .setDescription("Veuillez entrer une raison.")
            .setColor(client.config.discord.color)
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())

        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId('noReason').setLabel("Aucune raison").setStyle("DANGER")
            )

        if (!interaction.member.permissions.has('MODERATE_MEMBERS')) return interaction.reply({ embeds: [permissionEmbed], ephemeral: true })  
            
        interaction.reply({ embeds: [warnEmbed], components: [row] })

        const filter = i => i.user.id == warnAuthor.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

        collector.on('collect', async i => {
            if (i.customId === 'confirmed') {
                if (!client.warns[interaction.guild.id]) client.warns[interaction.guild.id] = {}
                if (!client.warns[interaction.guild.id][warnMember.user.id]) client.warns[interaction.guild.id][warnMember.user.id] = []
                client.warns[interaction.guild.id][warnMember.user.id].push({
                    warnAuthor: warnAuthor.user.id,
                    reason: reasonWarn,
                    date: interaction.createdAt
                })

                fs.writeFileSync('./config/warns.json', JSON.stringify(client.warns, null, 4), err => {
                    if (err) throw err;
                })

                interaction.editReply({ embeds: [successEmbed], components: [] })
                collector.stop('ended')
	        }
            
	        if (i.customId === 'reason') {
                
                interaction.editReply({ embeds: [warnEmbed], components: [] })

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
                        .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())  
                    if (reason == 'ended') interaction.editReply({ embeds: [updateWarnEmbed], components: [row] })
                    collector.resetTimer()
                });
	        }

            if (i.customId === 'cancel') {
                interaction.editReply({ embeds: [cancelEmbed], components: [] })
                collector.stop('ended')
            }
        });

        collector.on('end', (collected, reason) => {
            if (reason == 'time') return interaction.editReply({ embeds: [timeEmbed], components: [] })
        });
    }
}