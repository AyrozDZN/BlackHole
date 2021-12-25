const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const humanizeDuration = require('humanize-duration')
const moment = require('moment')

module.exports = {
    setupRequired: "false",
    category: "AntiRaid",
    data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Configure le bot.'),

    async run(client, interaction) {
        client.guildSettings[interaction.guild.id] = {
            "antiAddBot": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            },
            "antiEveryone": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            },
            "antiLink": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            },
            "antiSpam": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            },
            "antiMassBan": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            },
            "antiMassKick": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            },
            "antiWebhooks": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            },
            "antiChannelCreate": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            },
            "antiChannelDelete": {
                "whitelist": {
                    "members": [],
                    "roles": []
                },
                "status": false,
                "times": 3,
                "duration": 5000,
                "sanction": "kick"
            }
        }
    
        fs.writeFileSync('./config/guildSettings.json', JSON.stringify(client.guildSettings, null, 4), err => {
            if (err) throw err;
        })
    
    }
}