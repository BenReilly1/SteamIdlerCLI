const { SlashCommandBuilder } = require('@discordjs/builders');

const startCommand = {
    data: new SlashCommandBuilder()
      .setName("start")
      .setDescription("Starts the CSGO Idler")
};

module.exports = startCommand
  