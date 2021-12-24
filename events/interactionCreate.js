const discord = require('discord.js')

module.exports = async (client, interaction) => {
    if(!interaction.isCommand() && !interaction.isContextMenu()) return;

    const cmds = client.commands.get(interaction.commandName);

    if(!cmds) return;

    try {
        await cmds.run(client, interaction)
    } catch(e) {
        console.error(e)
    }
};