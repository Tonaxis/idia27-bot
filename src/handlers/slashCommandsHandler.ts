import {
  Client,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { SlashCommand } from "../models";

module.exports = async (client: Client) => {
  const body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
  const slashCommandsDir = join(__dirname, "../slash_commands");

  readdirSync(slashCommandsDir).forEach((file) => {
    if (!file.endsWith(".js")) return;

    const slashCommand: SlashCommand =
      require(`${slashCommandsDir}/${file}`).command;

    body.push(slashCommand.data.toJSON());
    client.slashCommands.set(slashCommand.name, slashCommand);

    console.log(`[HANDLER] ▶️  SlashCommand ${slashCommand.name} loaded`);
  });

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: body,
    });
  } catch (error) {
    console.error(error);
  }
};
