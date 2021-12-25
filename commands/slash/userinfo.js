
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const humanizeDuration = require('humanize-duration')
const moment = require('moment')

module.exports = {
    setupRequired: false,
    category: "Info",
    data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Affiche les informations d\'un membre.')
    .addUserOption(option => option.setName("membre").setDescription('Mentionne le membre en question.')),

    async run(client, interaction) {

        member = interaction.options.getMember('membre') || interaction.member;

        const UserInfo = new MessageEmbed()
            .setColor(client.config.discord.color)
            .setTitle(`Information de l'utilisateur **${member.user.username}**`)
            .setDescription(`Liste des informations de l'utilisateur.`) 
            .addField("📋 Tag :", member.user.tag, true)
            .addField("🏷 Surnom :", member.nickname ? member.nickname : "Aucun", true)
            .addField("📎 Identifiant :", member.id, true)
            .addField(`🔮 Boost :`, member.premiumSince ? `Depuis ${moment(member.premiumSince).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}, il y a ${humanizeDuration(moment().diff(moment(member.premiumSince)), { units: ["y", "mo", "d", "h"], round: true, language: "fr", largest: 2, delimiter: " et "})}` : "Ne boost pas")
            .addField("📆 Date de création :", `${moment(member.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}, il y a ${humanizeDuration(moment().diff(moment(member.user.createdAt)), { units: ["y", "mo", "d", "h"], round: true, language: "fr", largest: 2, delimiter: " et "})}`)
            .addField("📆 Date d'arrivé :", `${moment(member.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}, il y a ${humanizeDuration(moment().diff(moment(member.joinedAt)), { units: ["y", "mo", "d", "h"], round: true, language: "fr", largest: 2, delimiter: " et "})}`)
            .addField(`🗂 Autres :`, `${member.user.flags.toArray().length} Badges\n${member.roles.cache.filter(roles => roles.name !== "@everyone").size} Rôles\n${member.permissions.toArray().length} Permissions`, true)
            .setThumbnail(`${member.user.displayAvatarURL()}?size=4096`)
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())   
            
        interaction.reply({ embeds: [UserInfo], ephemeral: true })  
    }
}