const SteamUser = require('steam-user');
const config = require('./config')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, MessageAttachment, File } = require('discord.js');
const { codeBlock } = require("@discordjs/builders");
const discordClient = new Client({ intents: [Intents.FLAGS.GUILDS] });
const fs = require('fs');
const { time } = require('console');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = config.clientId;
const guildId = config.guildId;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.authToken);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();


discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

const client = new SteamUser();

const loginOptions = {
    accountName: config.accountName,
    password: config.password
}

client.logOn(loginOptions);

client.on('loggedOn', () => {
	setTimeout(() => {
		client.setPersona(SteamUser.EPersonaState.Online);
		client.gamesPlayed(730);
		const channel = discordClient.channels.cache.find(channel => channel.name === "steambot-status")
		channel.send(config.accountName + " successfully logged in!")		
	}, 5000);
})

client.on('error', (err) => {
    console.log(err)
    setTimeout(() => {
        client.logOn(loginOptions)
    }, 900000)
})

client.on("friendMessage", function(steamID, message) {
    console.log("Friend message from " + steamID+ ": " + message);
	const channel = discordClient.channels.cache.find(channel => channel.name === "steambot-messages")
	channel.send(steamID + " - " + message)
    client.chatMessage(steamID, "This account is currently running idle!");
});

client.on("lobbyInvite", (steamID, message) => {
	const channel = discordClient.channels.cache.find(channel => channel.name === "steambot-messages")
	channel.send(steamID + " - " + "invited to play a game")
    client.chatMessage(steamID, "I am currently AFK idling csgo!");
})

discordClient.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'start') {
		client.logOn(loginOptions);
		client.setPersona(SteamUser.EPersonaState.Online);
    	client.gamesPlayed(730);
		const channel = discordClient.channels.cache.find(channel => channel.name === "steambot-status")
		channel.send(config.accountName + " logged in!")
		interaction.reply("Done!")
	}
	if (interaction.commandName === 'stop') {
		client.logOff()
		const channel = discordClient.channels.cache.find(channel => channel.name === "steambot-status")
		channel.send(config.accountName + " logged off!")
		interaction.reply("Done!")
	}
	if (interaction.commandName === 'message') {
		var userSend = interaction.options.getString('steam64')
		var messageToSend = interaction.options.getString('messagesend')
		client.chatMessage(userSend, messageToSend)
		const channel = discordClient.channels.cache.find(channel => channel.name === "steambot-status")
		interaction.reply("Sent!")
		channel.send("Message to " + userSend + " was sent!")
	}
});

discordClient.login(config.authToken);