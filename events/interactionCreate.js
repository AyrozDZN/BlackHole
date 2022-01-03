const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = async (client, interaction) => {
    if(!interaction.isCommand() && !interaction.isContextMenu()) return;

    const cmds = client.commands.get(interaction.commandName);

    if(!cmds) return;
    
    if (cmds.setupRequired && cmds.setupRequired == true) {
        const setupRequire = new MessageEmbed()
            .setAuthor({user: client.user.username, avatarURL: client.user.avatarURL(), url: client.config.discord.link})
            .setTitle("SETUP Requis")
            .setDescription("Pour éxécuter cette commande vous devez d'abbord faire `/setup` sur ce serveur.\nSeul les administrateurs et le créateur du serveur peuvent éxécuter cette commande.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })  
            
        return interaction.reply({ embeds: [setupRequire], ephemeral: true })  
    }

    if (!client.guildSettings[interaction.guild.id]) {
        client.guildSettings[interaction.guild.id] = {
            "addBot": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            },
            "everyone": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            },
            "link": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            },
            "spam": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            },
            "massBan": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            },
            "massKick": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            },
            "webhooks": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            },
            "channelCreate": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            },
            "channelDelete": {
                "whitelist": [],
                "status": false,
                "times": 0,
                "duration": 0,
                "sanction": "kick"
            }
        }
    
        fs.writeFileSync('./config/guildSettings.json', JSON.stringify(client.guildSettings, null, 4), err => {
            if (err) throw err;
        })
    }

    try {
        await cmds.run(client, interaction)
    } catch(e) {
        console.error(e)
    }
};