const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'clean',
        description: 'This cleans the chat. This operation cannot be undone!',
        options: [
            {
                name: 'amount',
                description: 'Amount of last messages to delete',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    }
];

const rest = new REST().setToken(process.env.TOKEN);

async function registerCommands(){
    try{
        console.log(`Registering commands...`);
        const data = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: commands
            }
        );
        console.log(data);
        console.log(`Registered ${data.length} commands`);
    }catch(error) {console.log(`Error occured: \n${error}`);}
}
registerCommands();