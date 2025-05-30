import { ButtonInteraction } from "discord.js";

export type ButtonAction = {
  name: string;
  execute(interaction: ButtonInteraction): Promise<void>;
};
