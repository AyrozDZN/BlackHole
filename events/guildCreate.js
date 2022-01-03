const discord = require('discord.js')
const fs = require('fs')

module.exports = async (client, guild) => {
    
    client.guildSettings[guild.id] = {
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
    
    const audit = (await guild.fetchAuditLogs()).entries.first()
    if (audit.action === "BOT_ADD") {

        const setupEmbed = new discord.MessageEmbed()
            .setAuthor({user: client.user.username, avatarURL: client.user.avatarURL(), url: client.config.discord.link})
            .setTitle("SETUP")
            .setDescription("To setup the bot, you have to do the command `/setup` on your server, only an administrator or the creator will be able to execute this command")
            .setColor(client.config.discord.color)
            .setTimestamp()
            .setFooter({ text: `${client.user.username} • ${client.config.discord.footer}`, iconURL: client.user.avatarURL })

        if (audit.executor.id == guild.ownerId) {
            
            const channel = await audit.executor.createDM()
            channel.send({ content: `<@${audit.executor.id}>`, embeds: [setupEmbed] })
        
        } else {
            
            const channelAuditExecutor = await audit.executor.createDM()
            const owner = await guild.fetchOwner()
            const channelOwner = await owner.createDM()
            channelAuditExecutor.send({ content: `<@${audit.executor.id}>`, embeds: [setupEmbed] })
            channelOwner.send({ content: `<@${guild.ownerId}>`, embeds: [setupEmbed] })
        
        }
    }
};