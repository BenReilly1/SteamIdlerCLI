const { SlashCommandBuilder } = require('@discordjs/builders');

const stopCommand = {
    data: new SlashCommandBuilder()
      .setName("message")
      .setDescription("Messages a user")
      .addStringOption((option) =>option.setName("steam64").setDescription("User to message in SteamID").setRequired(true))
      .addStringOption((option) =>
          option
            .setName("messagesend")
            .setDescription("Message to send")
            .setRequired(true)
      )
};

module.exports = stopCommand