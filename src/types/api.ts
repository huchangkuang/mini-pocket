import type { Accent } from "@/pages/classify/constants";
import type { FavoriteCategory } from "@/pages/favorites/constants";

export type ApiResponse<T = unknown> = {
  code: number;
  message: string;
  data: T;
};

export type ApiCategory = {
  id: number;
  code: string;
  label: string;
};

export type ApiTool = {
  id: number;
  routePath: string;
  name: string;
  description: string;
  iconKey: string;
  accent: Accent;
  category: {
    code: string;
    label: string;
  };
  heat: string;
  heatScore: number;
  isFavorite: boolean;
};

export type ApiToolsList = {
  list: ApiTool[];
  total: number;
  page: number;
  pageSize: number;
};

export type ApiFavorite = {
  id: number;
  routePath: string;
  name: string;
  description: string;
  iconKey: string;
  accent: Accent;
  tag: string;
  favoriteCategory: FavoriteCategory;
  category: {
    code: string;
    label: string;
  };
};

export type ApiFavoritesList = {
  list: ApiFavorite[];
  total: number;
};

export type ApiUserStats = {
  activeDaysCount: number;
  usedToolsCount: number;
  favoriteCount: number;
  totalXp: number;
};

export type ApiUserLevel = {
  current: number;
  title: string;
  totalXp: number;
  xpCurrent: number;
  xpTarget: number;
  percent: number;
  nextTitle: string | null;
  xpToNextLevel: number;
  usesToNextLevel: number;
  hint: string;
  isMaxLevel: boolean;
};

export type ApiLevelConfig = {
  level: number;
  minXp: number;
  title: string;
};

export type ApiUserProfile = {
  id: number;
  nickname: string | null;
  avatarUrl: string | null;
  joinDate: string;
};

export type ApiUserMe = ApiUserProfile & {
  stats: ApiUserStats;
  level: ApiUserLevel;
};

export type ApiRecordActiveDayResult = {
  recorded: boolean;
  stats: ApiUserStats;
  level: ApiUserLevel;
};

export type ApiRecordToolUseResult = {
  isNew: boolean;
  toolId: number;
  xpGained: number;
  leveledUp: boolean;
  newTitle: string | null;
  stats: ApiUserStats;
  level: ApiUserLevel;
  heatScore?: number;
  heat?: string;
};

export type ApiLoginResult = {
  token: string;
  user: ApiUserProfile;
};

export type ApiUploadResult = {
  ossKey: string;
  url: string;
  mimeType: string;
};

export type PersistScope = "feedback" | "general";

export type ApiPersistedFile = {
  ossKey: string;
  url: string;
  sourceOssKey: string;
};

export type ApiPersistStorageResult = {
  files: ApiPersistedFile[];
};

export type ApiToggleFavoriteResult = {
  isFavorite: boolean;
  item: ApiFavorite | null;
};

export type FeedbackType = "feature" | "performance" | "style" | "other";

export type ApiSubmitFeedbackResult = {
  id: number;
  createdAt: string;
};

export type ListToolsQuery = {
  category?: string;
  keyword?: string;
  sort?: "heat" | "default";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type ListFavoritesQuery = {
  category?: string;
  keyword?: string;
};

export type ApiDecision = {
  id: number;
  title: string;
  options: string[];
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiDecisionSummary = {
  id: number;
  title: string;
  options: string[];
  isActive: boolean;
};

export type ApiDecisionsList = {
  current: ApiDecisionSummary;
  list: ApiDecisionSummary[];
};

// ── 猜数字对战 ──

export type ApiCreateGameResult = {
  gameId: string;
  createdAt: string;
  status: "waiting";
};

export type ApiGuessRecord = {
  guess: string;
  result: string;
  attemptNumber: number;
};

export type ApiGameInfo = {
  gameId: string;
  creator: {
    nickname: string | null;
    avatarUrl: string | null;
  };
  status: "waiting" | "won";
  myHistory: ApiGuessRecord[];
  isCreator: boolean;
};

export type ApiGameGuessResult = {
  result: string;
  attemptNumber: number;
  won: boolean;
  history: ApiGuessRecord[];
};
