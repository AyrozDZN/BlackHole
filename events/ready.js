const discord = require('discord.js')

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
};