import {
  CommandInteraction,
  EmbedBuilder,
  MessageFlags,
  resolveColor,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../models";
import { periodicEvents } from "../singletons";

export const command: SlashCommand = {
  name: "force_periodic_event",
  data: new SlashCommandBuilder()
    .setName("force_periodic_event")
    .setDescription("Force l'execution d'un évènement periodique")
    .addStringOption((option) =>
      option
        .setName("event")
        .setDescription("L'évènement à exécuter")
        .setRequired(true)
        .addChoices(
          Array.from(periodicEvents.keys()).map((key) => {
            return { name: key, value: key };
          })
        )
    ),
  execute: async (interaction: CommandInteraction) => {
    try {
      const event = interaction.options.get("event")?.value?.toString();
      if (!event) throw new Error("event is required");

      periodicEvents.get(event)?.execute(new Date(), interaction.client);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Évènement exécuté")
            .setDescription(`> **Évènement**: \`\`${event}\`\``),
        ],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Une erreur est survenue")
            .setDescription(`${error}`)
            .setColor(resolveColor("#FF0000")),
        ],
      });
    }
  },
};
