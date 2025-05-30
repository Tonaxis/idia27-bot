import { Client, Collection, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { readdirSync } from "fs";
import { join } from "path";
import { ButtonAction, SlashCommand } from "./models";
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
});

export async function setup() {
  client.slashCommands = new Collection<string, SlashCommand>();
  client.buttonActions = new Collection<string, ButtonAction>();

  const handlersDirss = join(__dirname, "handlers");

  readdirSync(handlersDirss).forEach((file) => {
    require(`${handlersDirss}/${file}`)(client);
  });

  client.login(process.env.DISCORD_TOKEN);
}

setup();
