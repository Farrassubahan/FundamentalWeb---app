import { HTML_LESSONS } from './htmlLessons';
import { CSS_LESSONS } from './cssLessons';
import { JS_LESSONS } from './jsLessons';
import { WEB_PROJECTS } from '../projects/webProjects';
import { Lesson, WebProject, WorldId } from '@/types';

export const ALL_LESSONS: Lesson[] = [
  ...HTML_LESSONS,
  ...CSS_LESSONS,
  ...JS_LESSONS,
];

export interface WorldMeta {
  id: WorldId;
  title: string;
  tagline: string;
  description: string;
  colorKey: 'html' | 'css' | 'javascript' | 'projects';
  icon: string;
  levelsCount: number;
}

export const WORLDS_META: WorldMeta[] = [
  {
    id: 'html',
    title: 'World 1: HTML Fundamentals',
    tagline: 'Pondasi Tulang Struktur Web',
    description: 'Pelajari tag, elemen, struktur dokumen, link, gambar, list, form, dan semantic HTML dari nol.',
    colorKey: 'html',
    icon: 'code-slash',
    levelsCount: 3,
  },
  {
    id: 'css',
    title: 'World 2: CSS Styling',
    tagline: 'Keindahan Visual & Tata Letak',
    description: 'Kuasai selector, warna, tipografi, box model, Flexbox, media query responsif, dan animasi halus.',
    colorKey: 'css',
    icon: 'color-palette',
    levelsCount: 4,
  },
  {
    id: 'javascript',
    title: 'World 3: JavaScript Logic',
    tagline: 'Otak Dinamis & Interaktivitas',
    description: 'Beri kecerdasan web: variabel, percabangan, fungsi, array, manipulasi DOM, hingga async/await.',
    colorKey: 'javascript',
    icon: 'flash',
    levelsCount: 5,
  },
  {
    id: 'projects',
    title: 'World 4: Web Projects',
    tagline: 'Portofolio Mandiri & Karya Nyata',
    description: 'Bangun 4 mini project terpandu: Profile Page, Calculator, To-Do List, dan Responsive Portfolio.',
    colorKey: 'projects',
    icon: 'rocket',
    levelsCount: 4,
  },
];

export const getAllLessons = (): Lesson[] => ALL_LESSONS;

export const getLessonById = (id: string): Lesson | undefined =>
  ALL_LESSONS.find((l) => l.id === id);

export const getLessonsByWorld = (worldId: WorldId): Lesson[] =>
  ALL_LESSONS.filter((l) => l.worldId === worldId);

export const getNextLesson = (currentId: string): Lesson | undefined => {
  const index = ALL_LESSONS.findIndex((l) => l.id === currentId);
  if (index >= 0 && index < ALL_LESSONS.length - 1) {
    return ALL_LESSONS[index + 1];
  }
  return undefined;
};

export const getAllProjects = (): WebProject[] => WEB_PROJECTS;

export const getProjectById = (id: string): WebProject | undefined =>
  WEB_PROJECTS.find((p) => p.id === id);
