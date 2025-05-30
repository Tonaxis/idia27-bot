import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export type SlashCommand = {
  name: string;
  data: SlashCommandBuilder | any;
  execute(interaction: CommandInteraction): Promise<void>;
};
