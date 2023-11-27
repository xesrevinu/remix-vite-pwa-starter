// All prefix "_main/*" routes are protected
// prettier-ignore
export const protectedRoutes: Array<RegExp> = [
  /^\/invoices/,
  /^\/settings/,
  /^\/$/,
];

// Add the route paths that you need to work offline
// (For me, all of them are needed)
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
