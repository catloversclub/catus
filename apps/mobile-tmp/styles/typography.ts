// Typography styles for CatUs app
// Usage in className: "font-headline1", "font-body1", etc.

export const typography = {
  // Headline styles
  headline1: {
    fontSize: 32,
    lineHeight: 32 * 1.45, // 145%
    fontWeight: "700" as const,
    letterSpacing: 32 * -0.02, // -2%
  },
  headline2: {
    fontSize: 25,
    lineHeight: 25 * 1.45,
    fontWeight: "700" as const,
    letterSpacing: 25 * -0.02,
  },

  // Title styles
  title1: {
    fontSize: 21,
    lineHeight: 21 * 1.45,
    fontWeight: "700" as const,
    letterSpacing: 21 * -0.02,
  },
  title2: {
    fontSize: 18,
    lineHeight: 18 * 1.45,
    fontWeight: "700" as const,
    letterSpacing: 18 * -0.02,
  },
  title3: {
    fontSize: 16,
    lineHeight: 16 * 1.45,
    fontWeight: "600" as const,
    letterSpacing: 16 * -0.02,
  },

  // Body styles
  body1: {
    fontSize: 16,
    lineHeight: 16 * 1.6, // 160%
    fontWeight: "600" as const,
    letterSpacing: 16 * -0.02,
  },
  body2: {
    fontSize: 16,
    lineHeight: 16 * 1.6,
    fontWeight: "500" as const,
    letterSpacing: 16 * -0.03, // -3%
  },
  body3: {
    fontSize: 14,
    lineHeight: 14 * 1.6,
    fontWeight: "600" as const,
    letterSpacing: 14 * -0.03,
  },
  body4: {
    fontSize: 14,
    lineHeight: 14 * 1.6,
    fontWeight: "400" as const,
    letterSpacing: 14 * -0.04, // -4%
  },

  // Label styles
  label1: {
    fontSize: 12,
    lineHeight: 12 * 1.5, // 150%
    fontWeight: "400" as const,
    letterSpacing: 12 * -0.03,
  },
  label2: {
    fontSize: 10,
    lineHeight: 10 * 1.4, // 140%
    fontWeight: "400" as const,
    letterSpacing: 10 * -0.02,
  },
};

// Font size for Tailwind (in pixels)
export const fontSize = {
  headline1: [
    "32px",
    { lineHeight: "46px", letterSpacing: "-0.64px", fontWeight: "700" },
  ],
  headline2: [
    "25px",
    { lineHeight: "36px", letterSpacing: "-0.5px", fontWeight: "700" },
  ],
  title1: [
    "21px",
    { lineHeight: "30px", letterSpacing: "-0.42px", fontWeight: "700" },
  ],
  title2: [
    "18px",
    { lineHeight: "26px", letterSpacing: "-0.36px", fontWeight: "700" },
  ],
  title3: [
    "16px",
    { lineHeight: "23px", letterSpacing: "-0.32px", fontWeight: "600" },
  ],
  body1: [
    "16px",
    { lineHeight: "26px", letterSpacing: "-0.32px", fontWeight: "600" },
  ],
  body2: [
    "16px",
    { lineHeight: "26px", letterSpacing: "-0.48px", fontWeight: "500" },
  ],
  body3: [
    "14px",
    { lineHeight: "22px", letterSpacing: "-0.42px", fontWeight: "600" },
  ],
  body4: [
    "14px",
    { lineHeight: "22px", letterSpacing: "-0.56px", fontWeight: "400" },
  ],
  label1: [
    "12px",
    { lineHeight: "18px", letterSpacing: "-0.36px", fontWeight: "400" },
  ],
  label2: [
    "10px",
    { lineHeight: "14px", letterSpacing: "-0.2px", fontWeight: "400" },
  ],
} as const;

export default typography;
