import { INITIAL_BADGES } from '@/constants/badges';
import { Badge, UserStats } from '@/types';
import { unlockBadge, getUnlockedBadgeIds } from '@/database/repository';

export const XP_FOR_PERFECT_QUIZ = 15;
export const XP_FOR_COMPLETED_LESSON = 30;
export const XP_FOR_COMPLETED_PROJECT = 100;

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

export const getLevelInfo = (xp: number): LevelInfo => {
  // Level formula: Level = floor(sqrt(xp / 50)) + 1
  const safeXp = Math.max(0, Math.floor(Number(xp) || 0));
  const level = Math.max(1, Math.floor(Math.sqrt(safeXp / 50)) + 1);
  const currentThreshold = Math.pow(level - 1, 2) * 50;
  const nextThreshold = Math.pow(level, 2) * 50;
  const xpInCurrentLevel = Math.max(0, safeXp - currentThreshold);
  const xpNeeded = Math.max(1, nextThreshold - currentThreshold);
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeeded) * 100)));

  return {
    level,
    currentLevelXp: xpInCurrentLevel,
    nextLevelXp: xpNeeded,
    progressPercent,
  };
};

export const checkAndAwardBadges = async (
  stats: UserStats,
  completedLessonsCount: number,
  completedProjectsCount: number
): Promise<Badge[]> => {
  const currentUnlockedIds = new Set(await getUnlockedBadgeIds());
  const newlyUnlocked: Badge[] = [];

  for (const badge of INITIAL_BADGES) {
    if (currentUnlockedIds.has(badge.id)) continue;

    let qualifies = false;
    switch (badge.category) {
      case 'lesson':
        qualifies = completedLessonsCount >= badge.targetValue;
        break;
      case 'streak':
        qualifies = stats.streak >= badge.targetValue;
        break;
      case 'xp':
        qualifies = stats.xp >= badge.targetValue;
        break;
      case 'project':
        qualifies = completedProjectsCount >= badge.targetValue;
        break;
    }

    if (qualifies) {
      const success = await unlockBadge(badge.id);
      if (success) {
        newlyUnlocked.push(badge);
      }
    }
  }

  return newlyUnlocked;
};

export const getHeartRegenCountdown = (lastRegenIso: string): string => {
  const intervalMs = 30 * 60 * 1000;
  const lastTime = new Date(lastRegenIso).getTime();
  const nextTime = lastTime + intervalMs;
  const remainingMs = Math.max(0, nextTime - Date.now());

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
