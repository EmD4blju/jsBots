require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { OpenAI } = require('openai');

const TOKEN = process.env.TOKEN;

const openai = new OpenAI({
    apiKey: process.env.API_KEY
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
    conversationLog.push({
        role: 'user',
        content: message.content
    });

    await message.channel.sendTyping();

    const result = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct-0914',
        messages: conversationLog
    })

    message.reply(result.data.choices[0].message);
});

client.login(TOKEN);