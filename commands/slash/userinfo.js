
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
            .setAuthor({user: member.user.username, avatarURL: member.user.avatarURL()})
            .setTitle(`Information de l'utilisateur.`)
            .setDescription(`**🏷 Surnom :** ${member.nickname ? member.nickname : "Aucun"},\n**📎 Identifiant : **${member.id}.`)
            .addField("📆 Date de création :", `${moment(member.user.createdAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}.\nIl y a ${humanizeDuration(moment().diff(moment(member.user.createdAt)), { units: ["y", "mo", "d", "h"], round: true, language: "fr", largest: 2, delimiter: " et "})}.`, true)
            .addField("📆 Date d'arrivé :", `${moment(member.joinedAt).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}.\nIl y a ${humanizeDuration(moment().diff(moment(member.joinedAt)), { units: ["y", "mo", "d", "h"], round: true, language: "fr", largest: 2, delimiter: " et "})}.`, true)
            .addField(`🔮 Boost :`, member.premiumSince ? `Depuis ${moment(member.premiumSince).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}.Il y a ${humanizeDuration(moment().diff(moment(member.premiumSince)), { units: ["y", "mo", "d", "h"], round: true, language: "fr", largest: 2, delimiter: " et "})}.` : "Ne boost pas")
            .setThumbnail(`${member.user.displayAvatarURL()}?size=4096`)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })   
            
        interaction.reply({ embeds: [UserInfo], ephemeral: true })  
    }
}