const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const backup = require('discord-backup');
const moment = require('moment')
moment.locale('fr')
const humanizeDuration = require('humanize-duration')

module.exports = {
    category: 'Backup',
    data: new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Permet de gérer les backup, crée, voir les infos, charger.')
    .addSubcommand(subcommand => subcommand.setName("create").setDescription("Crée une backup du serveur."))
    .addSubcommand(subcommand => subcommand.setName("info").setDescription("Affiche les informations d'une backup.").addStringOption(option => option.setName("id").setDescription("Identifiant de la backup").setRequired(true)))
    .addSubcommand(subcommand => subcommand.setName("load").setDescription("Charge une backup sur le serveur").addStringOption(option => option.setName("id").setDescription("Identifiant de la backup").setRequired(true))),

    async run(client, interaction) {
        if(!interaction.member.permissions.has('ADMINISTRATOR')){
            return interaction.reply({ embeds: [{color: client.config.discord.colorError, description: `${client.emotes.error} Vous n'avez pas la permission administrateur !`}], ephemeral: true })
        }

        const backupID = interaction.options.getString('id') || ""

        switch (interaction.options.getSubcommand()) {
            case "create":
                backup.create(interaction.guild, interaction.user).then((backupData) => {
        
                    return interaction.reply({ embeds: [{color: client.config.discord.colorSuccess, description: `La backup a été crée : \n\n\`\`\`Utilise /backup-load ${backupData.id} pour charger la backup.\`\`\`\n\`\`\`Utilise /backup-info ${backupData.id} pour afficher les informations.\`\`\``}], ephemeral: true })
        
                }).catch(() => {
        
                    return interaction.reply({ embeds: [{color: client.config.discord.colorError, description: `Une erreur c'est produit, vérifier que le bot à la permission administrateur !`}], ephemeral: true })
        
                });
                break

            case "info":
        
                backup.fetch(backupID).then((backup) => {
        
                    var channels = ""
        
                    backup.data.channels.categories.forEach(categorie => {
                        if (channels == "") {
                            channels = channels + categorie.name + " :\n"
                        } else {
                            channels = channels + "\n" + categorie.name + " :\n"
                        }
                        channels = channels + categorie.children.map(salon => '➜ ' + salon.name).join("\n")
                    })
        
                    backup.data.channels.others.forEach(others => {
                        channels = channels + "\n" + others.name
                    })
        
                    const backupEmbed = new MessageEmbed()
                        .setAuthor(backup.data.name, backup.data.iconURL)
                        .setTitle(`Information sur la backup du serveur :`)
                        .setDescription(`**ID :** ${backup.data.id}\n**Date de création :** ${moment(backup.data.createdTimestamp).format('[Le] DD/MM/YYYY [à] HH:mm:ss')}\n**Taille :** ${backup.size} kb`)
                        .addField("Salons :", `\`\`\`${channels}\`\`\``, true)
                        .addField("Rôles :", `\`\`\`${backup.data.roles.map(role => role.name).join('\n')}\`\`\``, true)
                        .setThumbnail(backup.data.iconURL)
                        .setTimestamp()
                        .setFooter(`${client.user.username} • ${client.config.discord.footer}`, client.user.avatarURL())  

                    interaction.reply({ embeds : [backupEmbed], ephemeral: true })
        
                }).catch((err) => {
        
                    if (err === 'No backup found')
                        interaction.reply({ embeds : [{color: client.config.discord.colorError, description: `${client.emotes.error} L'id \`${backupID}\` n'as pas été trouvé !`}], ephemeral: true })
                });
                break

            case "load":

            console.log(backupID)
        
                backup.fetch(backupID).then(async backupInfos => {
                    
                    if (backupInfos.data.author != interaction.user.id) return interaction.reply({ embeds: [{color: client.config.discord.colorError, description: `${client.emotes.error} Vous ne pouvez pas utiliser la backup d'une autre personne !`}], ephemeral: true })
        
                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('yes')
                            .setLabel('Oui')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('no')
                            .setLabel('Non')
                            .setStyle('DANGER'),
                    );
        
                    await interaction.reply({ embeds: [{color: client.config.discord.color, description: `${client.emotes.warning} Attention tout les salons, roles et paramètre du serveur vont être effacé, voulez vous vraiment continuer !`}], ephemeral: true, components: [row] })
                       
                    const filter = i => ['yes', 'no'].includes(i.customId) && i.user.id == interaction.user.id;
        
                    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });
                    
                    collector.on('collect', async i => {
                        if (i.customId === 'yes') {
                            backup.load(backupID, interaction.guild).catch((err) => {
                        
                                if (err === 'No backup found')
                                    return interaction.editReply({ embeds: [{color: client.config.discord.colorError, description: `${client.emotes.error} L'Id \`${backupID}\` n'as pas été trouvé !`}], ephemeral: true, components: []});
                            
                            });
                        } else {
                            
                            return interaction.editReply({ embeds: [{color: client.config.discord.colorError, description: `${client.emotes.error} Le chargement de la backup a été annulé !`}], ephemeral: true, components: [] });
        
                        }
                    });
                    
                }).catch(() => {
                    return interaction.reply({ embeds: [{color: client.config.discord.colorError, description: `${client.emotes.error} L'Id \`${backupID}\` n'as pas été trouvé !`}], ephemeral: true });
                });
                break
        }
    }
}