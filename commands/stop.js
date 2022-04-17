const { SlashCommandBuilder } = require('@discordjs/builders');

const stopCommand = {
    data: new SlashCommandBuilder()
      .setName("stop")
      .setDescription("Stops the CSGO Idler")
};

module.exports = stopCommand