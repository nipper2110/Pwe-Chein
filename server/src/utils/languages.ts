// The languages the site is translated into. Must match client/src/i18n.
export const LANGUAGES = ["en", "my", "th"] as const;
export type Language = (typeof LANGUAGES)[number];
