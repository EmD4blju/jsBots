require('dotenv').config();

const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`✅🪙  Correct TOKEN applied`,`\n✅ ${client.user.tag} is running...`);
    client.channels.cache.get(CHANNEL_ID).send('🧹 I am here! Ready for clean-up...');
});

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand) return;

    if(interaction.commandName == 'clean'){
        const channel = interaction.channel;
        const amount = interaction.options.get('amount');

        channel.messages.fetch({ limit: amount.value }).then(async (messages) => {
            messages.forEach(message => message.delete());

            const embed = new EmbedBuilder()
                .setColor(0x1eeb29)
                .setTitle(`Deleted ${messages.size} messages`);

            await interaction.reply({ embeds: [embed]});
        });
    }
});

client.login(TOKEN);