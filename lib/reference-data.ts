export const SEGMENTS = [
  { code: "curious", label: "The Curious One" },
  { code: "student", label: "The Student" },
  { code: "practitioner", label: "The Practitioner" },
  { code: "teacher", label: "The Teacher" },
  { code: "lapsed", label: "The One Who Left" },
] as const;

export const TEACHING_ROLES = [
  { code: "classes", label: "I teach classes" },
  { code: "own-school", label: "I teach & run my own school or group" },
  { code: "admin", label: "I run a school but don't teach regularly" },
  { code: "online", label: "I teach primarily online" },
] as const;

export const GRADUATION_LEVELS = [
  { code: "monitor", label: "Monitor / Instructor" },
  { code: "professor", label: "Professor" },
  { code: "contra-mestre", label: "Contra-Mestre" },
  { code: "mestre", label: "Mestre" },
  { code: "grao-mestre", label: "Grão-Mestre" },
  { code: "ungraded", label: "Not formally graded" },
] as const;

export const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "pt", label: "Português", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "fr", label: "Français", dir: "ltr" },
] as const;
