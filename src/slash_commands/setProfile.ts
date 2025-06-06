import {
  CommandInteraction,
  EmbedBuilder,
  resolveColor,
  SlashCommandBuilder,
} from "discord.js";
import db from "tona-db-mini";
import { DataCollections, DataCollectionUsers, SlashCommand } from "../models";

export const command: SlashCommand = {
  name: "set_profile",
  data: new SlashCommandBuilder()
    .setName("set_profile")
    .setDescription("Définis les informations de profil")
    .addStringOption((option) =>
      option.setName("first_name").setDescription("Prénom").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("last_name").setDescription("Nom").setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("birthdate")
        .setDescription("Date de naissance (AAAA-MM-JJ)")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option
        .setName("mp")
        .setDescription("Active les alertes en message privé")
        .setRequired(false)
    ),
  execute: async (interaction: CommandInteraction) => {
    try {
      const first_name = interaction.options
        .get("first_name")
        ?.value?.toString();
      const last_name = interaction.options.get("last_name")?.value?.toString();
      const birthdate = interaction.options.get("birthdate")?.value?.toString();
      const mp = interaction.options.get("mp")?.value?.toString();

      const update: Partial<DataCollectionUsers> = {};
      if (first_name !== undefined) {
        update.first_name = first_name;
      }
      if (last_name !== undefined) {
        update.last_name = last_name;
      }
      if (birthdate !== undefined) {
        const date = new Date(birthdate);
        update.birthdate = date.toISOString()?.slice(0, 10);
        console.log(update.birthdate);
      }
      if (mp !== undefined) {
        update.mp = mp === "true";
      }

      const collection = db.collection<DataCollectionUsers>(
        DataCollections.USERS
      );

      collection.update({ discord_id: interaction.user.id }, update);

      let title = "Profil non mis à jour";
      let description = "Aucune modification effectuée";

      if (Object.keys(update).length >= 0) {
        title = "Profil mis à jour";
        description = Object.entries(update)
          .map(([key, value]) => `> ${key}: ${value}`)
          .join("\n");
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
