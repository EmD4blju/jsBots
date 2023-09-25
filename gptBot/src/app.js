require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { OpenAI } = require('openai');

const TOKEN = process.env.TOKEN;

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    organization: process.env.ORG_KEY
});

const client = new Client({
    intents:[
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`✅🪙  Correct TOKEN applied`,`\n✅ ${client.user.tag} is running...`);
});

client.on('messageCreate', async (message) => {
    if(message.author.bot) return;
    if(message.channel.id != process.env.CHANNEL_ID) return;
    if(message.content.startsWith('!')) return;

    let conversationLog = [{ role: 'system', content: 'You are friendly chatbot' }];
    
    await message.channel.sendTyping();

    let previousMessages = await message.channel.messages.fetch({ limit: 15 });
    previousMessages.reverse();

    previousMessages.forEach((msg) => {
        if(message.content.startsWith('!')) return;
        if(msg.author.id != client.user.id && message.author.bot) return;
        if(msg.author.id != message.author.id) return;

        conversationLog.push({
            role: 'user',
            content: msg.content
        });
    });

    

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: conversationLog
    }).then((response) => message.reply(response.choices[0].message.content)).catch((error) => console.log(`Error occured: ${error}`));

    // message.reply(result);
});

client.login(TOKEN);