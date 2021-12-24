const discord = require('discord.js')

module.exports = async (client, guild) => {
    
    if (guild.available == false) return;
    
    const audit = (await guild.fetchAuditLogs()).entries.first()
    if (audit.action === "BOT_ADD") {

        const setupEmbed = new discord.MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("SETUP")
            .setDescription("To setup the bot, you have to do the command `/setup` on your server, only an administrator or the creator will be able to execute this command")
            .setColor(client.config.discord.color)
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())

        if (audit.executor.id == guild.ownerId) {
            
            const channel = await audit.executor.createDM()
            channel.send({ content: `<@${audit.executor.id}>`, embeds: [setupEmbed] })
        
        } else {
            
            const channelAuditExecutor = audit.executor.createDM()
            const channelOwner = guild.members.cache.get(guild.ownerId).user.createDM()
            channelAuditExecutor.send({ content: `<@${audit.executor.id}>`, embeds: [setupEmbed] })
            channelOwner.send({ content: `<@${guild.ownerId}>`, embeds: [setupEmbed] })
        
        }
    }
};