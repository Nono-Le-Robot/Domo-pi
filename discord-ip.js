const config = require('./config');
const canalID = "1174664215684972606"; // canal présence
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] 
});

client.on('ready', async () => {
    channel = client.channels.cache.get(canalID);
});

client.on('messageCreate', async (message) => {
    if(channel && message.author.username !== "PixaidBot"){
        const fetchedMessages = await channel.messages.fetch({ limit: 100 });
        channel.bulkDelete(fetchedMessages);
        console.clear();
    }
    const { default: fetch } = await import('node-fetch');  // Utilisez import() pour importer fetch dynamiquement
    const ip = await fetch('https://api64.ipify.org/').then(response => response.text());
    const messageContent = message.content.trim().toLowerCase(); 
    if(messageContent.includes('ip')){
        channel.send(ip)
    }
    else{
    }
})

client.login(config.discordToken);