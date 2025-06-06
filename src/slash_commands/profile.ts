import {
  CommandInteraction,
  EmbedBuilder,
  resolveColor,
  SlashCommandBuilder,
} from "discord.js";
import db from "tona-db-mini";
import { DataCollections, DataCollectionUsers, SlashCommand } from "../models";

export const command: SlashCommand = {
  name: "profile",
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Affiche le profil")
    .addMentionableOption((option) =>
      option.setName("user").setDescription("Utilisateur").setRequired(false)
    ),
  execute: async (interaction: CommandInteraction) => {
    try {
      let userId = interaction.options.get("user")?.value?.toString();

      if (userId === undefined) userId = interaction.user.id;

      const collection = db.collection<DataCollectionUsers>(
        DataCollections.USERS
      );

      const user = collection.get({ discord_id: userId })[0];

      await interaction.reply({
        embeds: [
          new EmbedBuilder().setTitle(`Profil de ${user.first_name}`)
            .setDescription(`
            **Prénom:** ${user.first_name}
            **Nom:** ${user.last_name}
            **Date de naissance:** ${new Date(user.birthdate).getDate()}/${
            new Date(user.birthdate).getMonth() + 1
          }/${new Date(user.birthdate).getFullYear()}
            **Age:** ${Math.floor(
              (new Date().getTime() - new Date(user.birthdate).getTime()) /
                1000 /
                60 /
                60 /
                24 /
                365
            )}
            **Alertes MP:** ${user.mp ? "Oui" : "Non"}  
            `),
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
