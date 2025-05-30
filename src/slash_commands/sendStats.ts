import {
  CommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  MessagePayload,
  resolveColor,
  SlashCommandBuilder,
} from "discord.js";
import db from "tona-db-mini";
import statsSchoolWeekRemainings from "../messages/statsSchoolWeekRemainings";
import statsTrainingProgress from "../messages/statsTrainingProgress";
import { DataCollections, SlashCommand } from "../models";
import {
  DATA_COLLECTION_STATS_MESSAGES_TYPES,
  DataCollectionStatsMessages,
  DataCollectionStatsMessagesType,
} from "../models/dataCollectionStatsMessages";

export const command: SlashCommand = {
  name: "send_stats",
  data: new SlashCommandBuilder()
    .setName("send_stats")
    .setDescription("Envoie un message de statistiques")
    .addStringOption((option) =>
      option
        .setName("stats_type")
        .setDescription("Type de statistiques")
        .setRequired(true)
        .addChoices(
          DATA_COLLECTION_STATS_MESSAGES_TYPES.map((key) => {
            return { name: key, value: key };
          })
        )
    ),
  execute: async (interaction: CommandInteraction) => {
    try {
      const stats_type = interaction.options
        .get("stats_type")
        ?.value?.toString();
      if (!stats_type) throw new Error("stats_type is required");

      const statsKey = stats_type as DataCollectionStatsMessagesType;
      if (!DATA_COLLECTION_STATS_MESSAGES_TYPES.includes(statsKey)) {
        throw new Error("stats_type is invalid");
      }

      const collection = db.collection<DataCollectionStatsMessages>(
        DataCollections.STATS_MESSAGES
      );

      let messageContent: string | MessagePayload | InteractionReplyOptions = {
        content: "ERROR",
      };

      switch (statsKey) {
        case "TRAINING_PROGRESS":
          messageContent = statsTrainingProgress();
          break;

        case "SCHOOL_WEEK_REMAINING":
          messageContent = statsSchoolWeekRemainings();
          break;
      }

      const interactionResponse = await interaction.reply({
        ...messageContent,
        withResponse: true,
      });

      if (interactionResponse.interaction.responseMessageId) {
        collection.add({
          type: statsKey,
          channelId: interaction.channelId,
          messageId: interactionResponse.interaction.responseMessageId,
        });
      }
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
