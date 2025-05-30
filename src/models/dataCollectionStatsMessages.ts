export const DATA_COLLECTION_STATS_MESSAGES_TYPES = [
  "TRAINING_PROGRESS",
  "SCHOOL_WEEK_REMAINING",
] as const;

export type DataCollectionStatsMessagesType =
  (typeof DATA_COLLECTION_STATS_MESSAGES_TYPES)[number];

export type DataCollectionStatsMessages = {
  type: DataCollectionStatsMessagesType;
  channelId: string;
  messageId: string;
};
