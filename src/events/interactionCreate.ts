import { Client, Events, Interaction } from "discord.js";
import { BotEvent } from "../models";

const event: BotEvent = {
  name: Events.InteractionCreate,
  once: false,
  async execute(client: Client, interaction: Interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.slashCommands.get(
        interaction.commandName
      );

      if (!command) return;

      await command.execute(interaction);
      console.log(
        `[EVENT:${this.name}] /${interaction.commandName} used by ${interaction.user.username}`
      );
    }

    if (interaction.isButton()) {
      const buttonAction = interaction.client.buttonActions.get(
        interaction.customId.split(":")[0]
      );

      if (!buttonAction) return;

      await buttonAction.execute(interaction);
      console.log(
        `[EVENT:${this.name}] button ${
          interaction.customId.split(":")[0]
        } pressed by ${interaction.user.username}`
      );
    }
  },
};

export default event;
