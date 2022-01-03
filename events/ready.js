const discord = require('discord.js')
const moment = require('moment')
const humanizeDuration = require('humanize-duration')
const fs = require('fs')

module.exports = async (client) => {
    
    console.log(`Connecté sur : ${client.user.username}. Prêt sur ${client.guilds.cache.size} serveurs, pour un total de ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} membres.`);

    const statuses = [
        () => "https://blackhole.net・⚠️",
        () => "/help・⚠️",
        () => `${client.guilds.cache.size} Serveurs・⚠️`,
        () => `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)} Membres・⚠️`,
      ]
    let i = 0
    setInterval(() => { 
        client.user.setActivity(statuses[i](), {type: 'WATCHING'});  
        i = ++i % statuses.length
    }, 1e4)

    client.guilds.cache.forEach(guild => {
        if (!client.guildSettings[guild.id]) {
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

            console.log(`Creation of the ${guild.name}'s settings`)
        
            fs.writeFileSync('./config/guildSettings.json', JSON.stringify(client.guildSettings, null, 4), err => {
                if (err) throw err;
            })
        }
    });
};