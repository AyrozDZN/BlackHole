const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const moment = require('moment')

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('Voir le profil')
    .setType(2),

    async run(client, interaction) {
        const member = interaction.guild.members.cache.get(interaction.targetId)

        const data = client.profiles[member.user.id] || {
            description: "",
            badges: []
        }

        const UserInfo = new MessageEmbed()
            .setColor(client.config.discord.color)
            .setAuthor({ name: "Profil de" + member.user.username, iconURL: member.user.avatarURL() })
            .setDescription(data.description != "" ? data.description : "Aucune description")
            //.addField("Badges", data.badges.length > 0 ? data.badges.map(el => ":" + el + ":").join(" ") : "Aucun badge", true)
            .setThumbnail(`${member.user.displayAvatarURL()}?size=4096`)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton().setCustomId("editProfil").setLabel("Modifier le profil").setStyle("DANGER"),
                new MessageButton().setCustomId("deleteProfil").setLabel("Supprimer le profil").setStyle("SECONDARY")
            )
            
        interaction.reply({ embeds: [UserInfo], components: [row] })  
    }
}