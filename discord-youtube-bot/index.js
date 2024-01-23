const { Client, GatewayIntentBits } = require("discord.js");
// now we need to create a client through which we can interact with server
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// now we will setup a listener
client.on("messageCreate", (message) => {
  console.log(message.content);
  // if the message is from bot, don't reply over it
  if (message.author.bot) {
    return;
  }
  // else reply over the message
  else {
    message.reply({
      content: "hi from bot",
    });
  }
});

// now we will setup a listener for slash commands
client.on("interactionCreate", (interaction) => {
  console.log(interaction);
  interaction.reply("pong");
});

client.login(
  "TaKqy4CmWA3T7JE4KAcaIvBm99Vf6V3V"
);
