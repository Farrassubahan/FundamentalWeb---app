import { getDatabase } from './db';
import {
  UserProfile,
  UserStats,
  LessonProgress,
  QuizHistoryItem,
  ProjectSubmission,
} from '@/types';

const HEART_REGEN_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes per heart

export const getUserProfile = async (): Promise<UserProfile | null> => {
  const db = getDatabase();
  const row = await db.getFirstAsync<{
    id: string;
    name: string;
    avatar: string;
    goal_minutes: number;
    created_at: string;
  }>('SELECT * FROM users LIMIT 1');

  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    goalMinutes: row.goal_minutes,
    createdAt: row.created_at,
  };
};

export const saveUserProfile = async (
  name: string,
  avatar: string,
  goalMinutes: number = 15
): Promise<UserProfile> => {
  const db = getDatabase();
  const existing = await getUserProfile();
  const now = new Date().toISOString();

  if (existing) {
    await db.runAsync(
      'UPDATE users SET name = ?, avatar = ?, goal_minutes = ? WHERE id = ?',
      [name, avatar, goalMinutes, existing.id]
    );
    return {
      id: existing.id,
      name,
      avatar,
      goalMinutes,
      createdAt: existing.createdAt,
    };
  }

  const id = `user_${Date.now()}`;
  await db.runAsync(
    'INSERT INTO users (id, name, avatar, goal_minutes, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, name, avatar, goalMinutes, now]
  );

  return { id, name, avatar, goalMinutes, createdAt: now };
};

export const getUserStats = async (): Promise<UserStats> => {
  const db = getDatabase();
  const nowIso = new Date().toISOString();
  const todayDateString = new Date().toISOString().split('T')[0];

  let stats = await db.getFirstAsync<{
    xp: number;
    level: number;
    streak: number;
    last_active_date: string;
    hearts: number;
    max_hearts: number;
    hearts_last_regen: string;
  }>('SELECT * FROM user_stats WHERE id = 1');

  if (!stats) {
    await db.runAsync(
      `INSERT INTO user_stats (id, xp, level, streak, last_active_date, hearts, max_hearts, hearts_last_regen)
       VALUES (1, 0, 1, 1, ?, 5, 5, ?)`,
      [todayDateString, nowIso]
    );
    return {
      xp: 0,
      level: 1,
      streak: 1,
      lastActiveDate: todayDateString,
      hearts: 5,
      maxHearts: 5,
      heartsLastRegen: nowIso,
    };
  }

  // Calculate offline heart regeneration
  let currentHearts = stats.hearts;
  let lastRegenTime = new Date(stats.hearts_last_regen).getTime();
  const nowTime = Date.now();

  if (currentHearts < stats.max_hearts) {
    const elapsed = nowTime - lastRegenTime;
    const heartsToAdd = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS);

    if (heartsToAdd > 0) {
      currentHearts = Math.min(stats.max_hearts, currentHearts + heartsToAdd);
      const remainder = elapsed % HEART_REGEN_INTERVAL_MS;
      lastRegenTime = nowTime - remainder;
      const updatedRegenIso = new Date(lastRegenTime).toISOString();

      await db.runAsync(
        'UPDATE user_stats SET hearts = ?, hearts_last_regen = ? WHERE id = 1',
        [currentHearts, updatedRegenIso]
      );
    }
  }

  // Calculate streak based on activity date
  let streak = stats.streak;
  if (stats.last_active_date !== todayDateString) {
    const lastActive = new Date(stats.last_active_date);
    const today = new Date(todayDateString);
    const diffDays = Math.floor(
      (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      // Activity on the following day increments streak
      streak += 1;
      await db.runAsync(
        'UPDATE user_stats SET streak = ?, last_active_date = ? WHERE id = 1',
        [streak, todayDateString]
      );
    } else if (diffDays > 1) {
      // Reset streak if missed a day
      streak = 1;
      await db.runAsync(
        'UPDATE user_stats SET streak = ?, last_active_date = ? WHERE id = 1',
        [1, todayDateString]
      );
    }
  }

  return {
    xp: stats.xp,
    level: stats.level,
    streak,
    lastActiveDate: todayDateString,
    hearts: currentHearts,
    maxHearts: stats.max_hearts,
    heartsLastRegen: new Date(lastRegenTime).toISOString(),
  };
};

export const addXP = async (amount: number): Promise<{ newXP: number; newLevel: number; leveledUp: boolean }> => {
  const db = getDatabase();
  const current = await getUserStats();
  const newXP = current.xp + amount;
  // Level curve: Level = floor(sqrt(XP / 50)) + 1
  const newLevel = Math.max(1, Math.floor(Math.sqrt(newXP / 50)) + 1);
  const leveledUp = newLevel > current.level;

  await db.runAsync(
    'UPDATE user_stats SET xp = ?, level = ? WHERE id = 1',
    [newXP, newLevel]
  );

  return { newXP, newLevel, leveledUp };
};

export const deductHeart = async (): Promise<number> => {
  const db = getDatabase();
  const current = await getUserStats();
  const newHearts = Math.max(0, current.hearts - 1);
  const nowIso = new Date().toISOString();

  await db.runAsync(
    'UPDATE user_stats SET hearts = ?, hearts_last_regen = ? WHERE id = 1',
    [newHearts, nowIso]
  );
  return newHearts;
};

export const refillHearts = async (): Promise<number> => {
  const db = getDatabase();
  const nowIso = new Date().toISOString();
  await db.runAsync(
    'UPDATE user_stats SET hearts = max_hearts, hearts_last_regen = ? WHERE id = 1',
    [nowIso]
  );
  return 5;
};

export const getAllLessonProgress = async (): Promise<Record<string, LessonProgress>> => {
  const db = getDatabase();
  const rows = await db.getAllAsync<{
    lesson_id: string;
    status: string;
    score: number;
    attempts: number;
    completed_at?: string;
  }>('SELECT * FROM lesson_progress');

  const map: Record<string, LessonProgress> = {};
  for (const row of rows) {
    map[row.lesson_id] = {
      lessonId: row.lesson_id,
      status: row.status as LessonProgress['status'],
      score: row.score,
      attempts: row.attempts,
      completedAt: row.completed_at,
    };
  }
  return map;
};

export const getLessonProgress = async (lessonId: string): Promise<LessonProgress | null> => {
  const db = getDatabase();
  const row = await db.getFirstAsync<{
    lesson_id: string;
    status: string;
    score: number;
    attempts: number;
    completed_at?: string;
  }>('SELECT * FROM lesson_progress WHERE lesson_id = ?', [lessonId]);

  if (!row) return null;
  return {
    lessonId: row.lesson_id,
    status: row.status as LessonProgress['status'],
    score: row.score,
    attempts: row.attempts,
    completedAt: row.completed_at,
  };
};

export const updateLessonProgress = async (
  lessonId: string,
  status: LessonProgress['status'],
  score: number = 0
): Promise<void> => {
  const db = getDatabase();
  const nowIso = new Date().toISOString();

  const existing = await getLessonProgress(lessonId);
  if (existing) {
    const highestScore = Math.max(existing.score, score);
    const newAttempts = existing.attempts + 1;
    await db.runAsync(
      `UPDATE lesson_progress
       SET status = ?, score = ?, attempts = ?, completed_at = ?
       WHERE lesson_id = ?`,
      [status, highestScore, newAttempts, status === 'completed' ? nowIso : existing.completedAt ?? null, lessonId]
    );
  } else {
    await db.runAsync(
      `INSERT INTO lesson_progress (lesson_id, status, score, attempts, completed_at)
       VALUES (?, ?, ?, 1, ?)`,
      [lessonId, status, score, status === 'completed' ? nowIso : null]
    );
  }
};

export const unlockLesson = async (lessonId: string): Promise<void> => {
  const db = getDatabase();
  const existing = await getLessonProgress(lessonId);
  if (!existing) {
    await db.runAsync(
      'INSERT INTO lesson_progress (lesson_id, status, score, attempts) VALUES (?, ?, 0, 0)',
      [lessonId, 'unlocked']
    );
  } else if (existing.status === 'locked') {
    await db.runAsync(
      'UPDATE lesson_progress SET status = ? WHERE lesson_id = ?',
      ['unlocked', lessonId]
    );
  }
};

export const addQuizHistory = async (
  lessonId: string,
  score: number,
  totalQuestions: number,
  xpEarned: number
): Promise<void> => {
  const db = getDatabase();
  const nowIso = new Date().toISOString();
  await db.runAsync(
    `INSERT INTO quiz_history (lesson_id, score, total_questions, xp_earned, timestamp)
     VALUES (?, ?, ?, ?, ?)`,
    [lessonId, score, totalQuestions, xpEarned, nowIso]
  );

  // Storage Optimization: Limit quiz history table to recent 50 entries
  await db.runAsync(
    `DELETE FROM quiz_history 
     WHERE id NOT IN (
       SELECT id FROM quiz_history 
       ORDER BY id DESC 
       LIMIT 50
     )`
  );
};

export const optimizeDatabaseStorage = async (): Promise<void> => {
  try {
    const db = getDatabase();
    await db.runAsync(
      `DELETE FROM quiz_history 
       WHERE id NOT IN (
         SELECT id FROM quiz_history 
         ORDER BY id DESC 
         LIMIT 50
       )`
    );
    await db.execAsync('VACUUM;');
  } catch (err) {
    console.warn('Database optimization notice:', err);
  }
};

export const getQuizHistory = async (): Promise<QuizHistoryItem[]> => {
  const db = getDatabase();
  const rows = await db.getAllAsync<{
    id: number;
    lesson_id: string;
    score: number;
    total_questions: number;
    xp_earned: number;
    timestamp: string;
  }>('SELECT * FROM quiz_history ORDER BY id DESC LIMIT 50');

  return rows.map((r) => ({
    id: r.id,
    lessonId: r.lesson_id,
    score: r.score,
    totalQuestions: r.total_questions,
    xpEarned: r.xp_earned,
    timestamp: r.timestamp,
  }));
};

export const getUnlockedBadgeIds = async (): Promise<string[]> => {
  const db = getDatabase();
  const rows = await db.getAllAsync<{ badge_id: string }>(
    'SELECT badge_id FROM user_badges'
  );
  return rows.map((r) => r.badge_id);
};

export const unlockBadge = async (badgeId: string): Promise<boolean> => {
  const db = getDatabase();
  const existing = await db.getFirstAsync<{ badge_id: string }>(
    'SELECT badge_id FROM user_badges WHERE badge_id = ?',
    [badgeId]
  );
  if (existing) return false;

  const nowIso = new Date().toISOString();
  await db.runAsync(
    'INSERT INTO user_badges (badge_id, unlocked_at) VALUES (?, ?)',
    [badgeId, nowIso]
  );
  return true;
};

export const saveProjectSubmission = async (
  projectId: string,
  htmlCode: string,
  cssCode: string,
  jsCode: string,
  completed: boolean
): Promise<void> => {
  const db = getDatabase();
  const nowIso = new Date().toISOString();

  const existing = await db.getFirstAsync<{ project_id: string }>(
    'SELECT project_id FROM project_submissions WHERE project_id = ?',
    [projectId]
  );

  if (existing) {
    await db.runAsync(
      `UPDATE project_submissions
       SET html_code = ?, css_code = ?, js_code = ?, completed = ?, completed_at = ?
       WHERE project_id = ?`,
      [htmlCode, cssCode, jsCode, completed ? 1 : 0, completed ? nowIso : null, projectId]
    );
  } else {
    await db.runAsync(
      `INSERT INTO project_submissions (project_id, html_code, css_code, js_code, completed, completed_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [projectId, htmlCode, cssCode, jsCode, completed ? 1 : 0, completed ? nowIso : null]
    );
  }
};

export const getProjectSubmission = async (
  projectId: string
): Promise<ProjectSubmission | null> => {
  const db = getDatabase();
  const row = await db.getFirstAsync<{
    project_id: string;
    html_code: string;
    css_code: string;
    js_code: string;
    completed: number;
    completed_at?: string;
  }>('SELECT * FROM project_submissions WHERE project_id = ?', [projectId]);

  if (!row) return null;
  return {
    projectId: row.project_id,
    htmlCode: row.html_code,
    cssCode: row.css_code,
    jsCode: row.js_code,
    completed: row.completed === 1,
    completedAt: row.completed_at,
  };
};

export const resetAllProgress = async (): Promise<void> => {
  const db = getDatabase();
  const nowIso = new Date().toISOString();
  const todayDateString = nowIso.split('T')[0];

  await db.execAsync(`
    DELETE FROM lesson_progress;
    DELETE FROM quiz_history;
    DELETE FROM user_badges;
    DELETE FROM project_submissions;
    UPDATE user_stats
    SET xp = 0, level = 1, streak = 1, last_active_date = '${todayDateString}',
        hearts = 5, max_hearts = 5, hearts_last_regen = '${nowIso}'
    WHERE id = 1;
    INSERT OR REPLACE INTO lesson_progress (lesson_id, status, score, attempts)
    VALUES ('html-101', 'unlocked', 0, 0);
  `);
};
