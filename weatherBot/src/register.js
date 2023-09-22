const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');
require('dotenv').config();
const commands = [
    {
        name: 'weather',
        description: 'This gets current weather',
        options: [
            {
                name: 'city',
                description: 'City for weather to check',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'country',
                description: 'Country for weather to check [PL, US, EN]',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'time',
        description: 'This gets current time'
    }
];

const rest = new REST().setToken(process.env.TOKEN);

async function sendAPI(){
    try{
        console.log(`Registering ${commands.length} commands`);
        const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), 
            {
                body: commands
            }
        );
        console.log(data);
        console.log(`Registered ${data.length} commands`);
    }catch(err){
        console.log("Error occured: ", err);
    }
} 

sendAPI();