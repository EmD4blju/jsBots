const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
const weather = require('weather-js');
dotenv.config();
const TOKEN = process.env.TOKEN;
const URL = process.env.API_URL;
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]

});

client.on('ready', () => {
    console.log(`✅🪙  Correct TOKEN applied`,`\n✅ ${client.user.tag} is running...`);
});

client.on('interactionCreate', async (interaction) => {
    // console.log(interaction);
    if(!interaction.isCommand()) return;
    if(interaction.commandName == 'weather'){

        const city = interaction.options.get('city');
        const country = interaction.options.get('country');
        weather.find({ search: `${city.value}, ${country.value}`, degreeType: 'C' }, async (error, response) => {
            if(error){
                console.log(error);
                return;
            }

            const exampleEmbed = new EmbedBuilder()
                .setColor(response[0].current.temperature > 15 ? 0xfc0303 : 0x035afc)
                .setTitle(response[0].location.name)
                .setThumbnail(response[0].current.imageUrl)
                .addFields(
                    { name: '🌡️ Temperature:', value: `${response[0].current.temperature} °${response[0].location.degreetype}`},
                    { name: '💦 Humidity:', value: `${response[0].current.humidity}`},
                    { name: '🍃 Windspeed:', value: `${response[0].current.windspeed}`}
                )
                .setTimestamp();
            await interaction.reply({ embeds: [exampleEmbed] });    
        });


    }
    if(interaction.commandName == 'time'){
        let time = new Date().toTimeString();
        await interaction.reply(time);
    }

});

client.on('messageCreate', (message) => {
    if(message.author.bot) return;
    if(message.content == 'Hello there') message.reply('General Kenobi');
    if(message.content == 'Ping') message.reply('Pong');
    if(message.content == '$inspire') getQuote(message, URL);
});

async function getQuote(message, url){
    const response = fetch(url)
        .then(resolve => resolve.json())
        .then(data => message.channel.send(`📖 ${data[0].q}\n ~ ${data[0].a}`));
}

client.login(TOKEN);