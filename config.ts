// All prefix "_main/*" routes are protected
// prettier-ignore
export const protectedRoutes: Array<RegExp> = [
  /^\/invoices/,
  /^\/settings/,
  /^\/$/,
];

export const dynamicPaths: Array<RegExp> = [
  // Marketing
  /^\/home/,
  /^\/about/,
  /^\/pricing/,
  /^\/terms/,
  /^\/privacy/,

  // Auth
  /^\/sign-in/,
  /^\/sign-up/,

  // Application
  ...protectedRoutes,
];
