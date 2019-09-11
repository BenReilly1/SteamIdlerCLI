const SteamUser = require('steam-user');
const config = require('./config')

const client = new SteamUser();

const loginOptions = {
    accountName: config.accountName,
    password: config.password
}

client.logOn(loginOptions);

client.on('loggedOn', () => {
    console.log('Logged in')
    client.setPersona(SteamUser.EPersonaState.Online);
    client.gamesPlayed(730);
})

client.on('error', (err) => {
    console.log(err)
    setTimeout(() => {
        client.logOn(loginOptions)
    }, 900000)
})

client.on("friendMessage", function(steamID, message) {
    console.log("Friend message from " + steamID+ ": " + message);
    client.chatMessage(steamID, "This account is currently running idle!");
});

client.on("lobbyInvite", (steamID, message) => {
    client.chatMessage(steamID, "I am currently AFK idling csgo!");
})