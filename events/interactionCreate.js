const { MessageEmbed } = require('discord.js')

module.exports = async (client, interaction) => {
    if(!interaction.isCommand() && !interaction.isContextMenu()) return;

    const cmds = client.commands.get(interaction.commandName);

    if(!cmds) return;
    
    if (cmds.setupRequired && cmds.setupRequired == true) {
        const setupRequire = new MessageEmbed()
            .setAuthor(client.user.username, client.user.avatarURL(), client.config.discord.link)
            .setTitle("SETUP Requis")
            .setDescription("Pour éxécuter cette commande vous devez d'abbord faire `/setup` sur ce serveur.\nSeul les administrateurs et le créateur du serveur peuvent éxécuter cette commande.")
            .setColor(client.config.discord.colorError)
            .setTimestamp()
            .setFooter(`${client.user.username} - ${client.config.discord.footer}`, client.user.avatarURL())  
            
        interaction.reply({ embeds: [setupRequire], ephemeral: true })  
    }

    try {
        await cmds.run(client, interaction)
    } catch(e) {
        console.error(e)
    }
};