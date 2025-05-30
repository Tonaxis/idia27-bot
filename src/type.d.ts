import "discord.js";

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_CLIENT_ID: string;
      DISCORD_TOKEN: string;
    }
  }
}

export declare module "discord.js" {
  interface Client {
    slashCommands: Collection<string, SlashCommand>;
    buttonActions: Collection<string, ButtonAction>;
  }
}
