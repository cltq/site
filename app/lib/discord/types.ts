export type DiscordStatus = "online" | "idle" | "dnd" | "offline";

export type WidgetTheme = "dark" | "light" | "auto";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface DiscordCustomStatus {
  text: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  } | null;
}

export interface SpotifyData {
  song: string;
  artist: string;
  album: string;
  albumArt?: string;
  cover?: string;
  startedAt?: number;
  endsAt?: number;
  progressMs?: number;
  duration?: number;
  trackId?: string;
  trackUrl?: string;
}

export interface ActivityTimestamps {
  start?: number;
  end?: number;
}

export interface ActivityEmoji {
  name: string;
  id?: string;
  animated?: boolean;
}

export interface ActivityParty {
  size?: number;
  max?: number;
}

export interface ActivityAssets {
  largeImage?: string;
  largeText?: string;
  smallImage?: string;
  smallText?: string;
  large_image?: string;
  large_text?: string;
  small_image?: string;
  small_text?: string;
}

export interface ActivityData {
  id?: string;
  name: string;
  type: number | string;
  details?: string;
  state?: string;
  applicationId?: string;
  icon?: string;
  largeImage?: string;
  largeText?: string;
  smallImage?: string;
  smallText?: string;
  assets?: ActivityAssets;
  timestamps?: ActivityTimestamps;
  emoji?: ActivityEmoji | null;
  party?: ActivityParty;
}

export interface DiscordGuild {
  identityGuildId?: string | null;
  identityEnabled?: boolean;
  tag?: string | null;
  badge?: string | null;
}

export interface DiscordBadgeData {
  id: string;
  badges: string[];
  publicFlags: number;
}

export interface DiscordGuildData {
  id: string;
  guildId?: string;
  guildName?: string;
  primaryGuild?: DiscordGuild;
}

export interface DiscordProfile {
  id: string;
  username: string;
  displayName: string;
  globalName?: string;
  avatar: string;
  banner?: string;
  accentColor?: string;
  badges?: string[];
  premiumType?: number | null;
  premiumBadge?: string | null;
  boostBadge?: string | null;
  guildId?: string;
  guildName?: string;
  primaryGuild?: DiscordGuild;
  createdAt?: string;
}

export interface DiscordPresence {
  id: string;
  username: string;
  displayName: string;
  globalName?: string;
  avatar: string;
  banner?: string;
  accentColor?: string;
  badges?: string[];
  premiumType?: number | null;
  premiumBadge?: string | null;
  boostBadge?: string | null;
  boostedSince?: string | null;
  status: DiscordStatus;
  customStatus?: string | DiscordCustomStatus | null;
  spotify?: SpotifyData | null;
  activities: ActivityData[];
  mobile?: boolean;
  desktop?: boolean;
  web?: boolean;
  guildId?: string;
  guildName?: string;
  primaryGuild?: DiscordGuild;
  publicFlags?: number;
  createdAt?: string;
  updatedAt?: number;
}

export interface DiscordStatusData {
  id: string;
  status: DiscordStatus;
}

export interface DiscordWidgetProps {
  theme?: WidgetTheme;
  showSpotify?: boolean;
  showActivities?: boolean;
  showCustomStatus?: boolean;
  animated?: boolean;
  compact?: boolean;
  className?: string;
  apiBaseUrl?: string;
}
