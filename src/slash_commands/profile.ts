import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import db from "tona-db-mini";
import {
  DataCollections,
  DataCollectionUsers,
  DataCollectionWeeks,
  SlashCommand,
} from "../models";
import { getWeekNumber } from "../utils/date";
import { safeReplyError } from "../utils/interaction";

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

      const userCollection = db.collection<DataCollectionUsers>(
        DataCollections.USERS
      );

      const weeksCollection = db.collection<DataCollectionWeeks>(
        DataCollections.WEEKS
      );

      const currentYear = new Date().getFullYear();
      const currentWeek = getWeekNumber(new Date());

      const user = userCollection.get({ discord_id: userId })[0];

      const week = weeksCollection
        .get(
          (w) =>
            w.attendances_record_manager_uid === user.uid &&
            ((w.year === currentYear && w.week > currentWeek) ||
              w.year > currentYear)
        )
        .sort((a, b) => a.year - b.year && a.week - b.week)[0];

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
            **Prochain tour pour la fiche de présence:**
            > ${
              week
                ? `Semaine ${week.week} de ${week.year}`
                : "Pas encore disponible"
            }
            `),
        ],
      });
    } catch (error) {
      await safeReplyError(interaction, error);
    }
  },
};
