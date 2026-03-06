import {
  CommandInteraction,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../models";
import { periodicEvents } from "../singletons";
import { safeReplyError } from "../utils/interaction";

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
      await interaction.deferReply({
        flags: MessageFlags.Ephemeral,
      });

      const event = interaction.options.get("event")?.value?.toString();
      if (!event) throw new Error("event is required");

      await periodicEvents.get(event)?.execute(new Date(), interaction.client);

      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle("Évènement exécuté")
            .setDescription(`> **Évènement**: \`\`${event}\`\``),
        ],
      });
    } catch (error) {
      await safeReplyError(interaction, error);
    }
  },
};
