import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../models";

export const command: SlashCommand = {
  name: "ping",
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  execute: async (interaction: CommandInteraction) => {
    await interaction.reply(`Pong! ${interaction.client.ws.ping}ms`);
  },
};
