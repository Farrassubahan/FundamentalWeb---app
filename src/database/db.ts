import * as SQLite from 'expo-sqlite';

let databaseInstance: SQLite.SQLiteDatabase | null = null;

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!databaseInstance) {
    databaseInstance = SQLite.openDatabaseSync('bprotic_web_academy.db');
  }
  return databaseInstance;
};

export const initDatabase = async (): Promise<void> => {
  const db = getDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      goal_minutes INTEGER DEFAULT 15,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_stats (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 1,
      streak INTEGER NOT NULL DEFAULT 1,
      last_active_date TEXT NOT NULL,
      hearts INTEGER NOT NULL DEFAULT 5,
      max_hearts INTEGER NOT NULL DEFAULT 5,
      hearts_last_regen TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lesson_progress (
      lesson_id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      attempts INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS quiz_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lesson_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      xp_earned INTEGER NOT NULL,
      timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      badge_id TEXT PRIMARY KEY,
      unlocked_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_submissions (
      project_id TEXT PRIMARY KEY,
      html_code TEXT NOT NULL,
      css_code TEXT NOT NULL,
      js_code TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_quiz_history_lesson ON quiz_history(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_history_timestamp ON quiz_history(timestamp);
    CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(status);
  `);
};
