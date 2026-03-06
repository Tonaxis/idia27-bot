import {
  CommandInteraction,
  DiscordAPIError,
  EmbedBuilder,
  RepliableInteraction,
  resolveColor,
} from "discord.js";

function buildErrorEmbed(error: unknown) {
  return new EmbedBuilder()
    .setTitle("Une erreur est survenue")
    .setDescription(`${error}`)
    .setColor(resolveColor("#FF0000"));
}

export async function safeReplyError(
  interaction: CommandInteraction | RepliableInteraction,
  error: unknown
) {
  const payload = {
    embeds: [buildErrorEmbed(error)],
    flags: ["Ephemeral"] as const,
  };

  try {
    if (interaction.deferred || interaction.replied) {
      await interaction.followUp(payload);
      return;
    }

    await interaction.reply(payload);
  } catch (replyError) {
    if (
      replyError instanceof DiscordAPIError &&
      (replyError.code === 10062 || replyError.code === 40060)
    ) {
      console.error(
        `[INTERACTION] Could not send error response (code ${replyError.code})`
      );
      return;
    }

    throw replyError;
  }
}
