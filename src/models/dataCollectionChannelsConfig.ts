export const DATA_COLLECTION_CHANNELS_CONFIG_KEYS = [
  "ATTENDANCES_RECORD_MANAGER",
] as const;

export type DataCollectionChannelsConfigKey =
  (typeof DATA_COLLECTION_CHANNELS_CONFIG_KEYS)[number];

export type DataCollectionChannelsConfig = {
  key: DataCollectionChannelsConfigKey;
  channelId: string;
};
