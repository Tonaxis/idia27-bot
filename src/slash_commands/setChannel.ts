import {
  CommandInteraction,
  EmbedBuilder,
  resolveColor,
  SlashCommandBuilder,
} from "discord.js";
import db from "tona-db-mini";
import {
  DATA_COLLECTION_CHANNELS_CONFIG_KEYS,
  DataCollectionChannelsConfig,
  DataCollectionChannelsConfigKey,
  DataCollections,
  SlashCommand,
} from "../models";

export const command: SlashCommand = {
  name: "set_channel",
  data: new SlashCommandBuilder()
    .setName("set_channel")
    .setDescription(
      "Configure un salon, si aucun salon n'est renseigné, la configuration sera supprimée"
    )
    .addStringOption((option) =>
      option
        .setName("channel_type")
        .setDescription("Type de salon")
        .setRequired(true)
        .addChoices(
          DATA_COLLECTION_CHANNELS_CONFIG_KEYS.map((key) => {
            return { name: key, value: key };
          })
        )
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "Salon, si aucun salon n'est renseigné, la configuration sera supprimée"
        )
    ),
  execute: async (interaction: CommandInteraction) => {
    try {
      const channel_type = interaction.options
        .get("channel_type")
        ?.value?.toString();
      if (!channel_type) throw new Error("channel_type is required");

      const channelKey = channel_type as DataCollectionChannelsConfigKey;
      if (!DATA_COLLECTION_CHANNELS_CONFIG_KEYS.includes(channelKey)) {
        throw new Error("channel_type is invalid");
      }

      const channel = interaction.options.get("channel")?.channel;
      if (channel && !channel?.id) throw new Error("channel id is invalid");

      const collection = db.collection<DataCollectionChannelsConfig>(
        DataCollections.CHANNELS_CONFIG
      );

      const data = collection.get({
        key: channelKey,
      });
      let action: "NONE" | "ADD" | "UPDATE" | "DELETE" = "NONE";

      if (channel && !data.length) {
        collection.add({
          key: channelKey,
          channelId: channel.id,
        });
        action = "ADD";
      } else if (channel && data.length) {
        collection.update(
          {
            key: channelKey,
          },
          {
            channelId: channel.id,
          }
        );
        action = "UPDATE";
      } else if (!channel && data.length) {
        collection.del({
          key: channelKey,
        });
        action = "DELETE";
      }

      let title = `Rien n'a changé`;
      if (action === "ADD") {
        title = `Une configuration \`\`${channelKey}\`\` a été ajouté`;
      } else if (action === "UPDATE") {
        title = `La configuration \`\`${channelKey}\`\` a été mise à jour`;
      } else if (action === "DELETE") {
        title = `La configuration \`\`${channelKey}\`\` a été supprimée`;
      }

      let description = `Aucun salon n'était affecté à \`\`${channelKey}\`\``;
      if (action === "ADD") {
        description = `Le salon <#${channel?.id}> a été affecté à \`\`${channelKey}\`\``;
      } else if (action === "UPDATE") {
        description = `Le salon <#${channel?.id}> a été affecté à \`\`${channelKey}\`\`\n> Ancien salon: <#${data[0].channelId}>`;
      } else if (action === "DELETE") {
        description = `Le salon <#${
          channel?.id ?? data[0].channelId
        }> n'est plus affecté à \`\`${channelKey}\`\``;
      }

      await interaction.reply({
        embeds: [
          new EmbedBuilder().setTitle(title).setDescription(description),
        ],
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
