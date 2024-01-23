const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "ping",
    description: "replies with pong",
  },
];

const rest = new REST({ version: "10" }).setToken(
  "TaKqy4CmWA3T7JE4KAcaIvBm99Vf6V3V"
);

// immediately invoked function expression
(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands("1197972407785365595"), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
