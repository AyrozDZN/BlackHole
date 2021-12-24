const discord = require('discord.js')

module.exports = async (client, interaction) => {
    if(!interaction.isCommand()) return;

    const slashCmds = client.slashCommands.get(interaction.commandName);

    if(!slashCmds) return;

    try {
        await slashCmds.run(client, interaction)
    } catch(e) {
        console.error(e)
    }
};