// @ts-nocheck

import type { HtmlLinkDescriptor, PrefetchPageDescriptor } from "@remix-run/react";
// This file copy from https://github.com/remix-run/react-router/tree/main/packages/react-router
// not reexport from react-router because react-router tree shaking not work

const paramRe = /^:\w+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const invariant = function (value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
};
const warning = function (cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
      // ignore
    }
  }
};
const isSplat = (s) => s === "*";
const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
const parsePath = function (path) {
  const parsedPath = {};
  if (path) {
    const hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    const searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
};
const stripBasename = function (pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  const startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  const nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
};
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const explodeOptionalSegments = function (path) {
  const segments = path.split("/");
  if (segments.length === 0) return [];
  const [first, ...rest] = segments;
  const isOptional = first.endsWith("?");
  const required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  const restExploded = explodeOptionalSegments(rest.join("/"));
  const result = [];
  result.push(...restExploded.map((subpath) => (subpath === "" ? required : [required, subpath].join("/"))));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => (path.startsWith("/") && exploded === "" ? "/" : exploded));
};
const compareIndexes = function (a, b) {
  const siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
  return siblings ? a[a.length - 1] - b[b.length - 1] : 0;
};
const rankRouteBranches = function (branches) {
  branches.sort((a, b) =>
    a.score !== b.score
      ? b.score - a.score
      : compareIndexes(
          a.routesMeta.map((meta) => meta.childrenIndex),
          b.routesMeta.map((meta) => meta.childrenIndex)
        )
  );
};
const computeScore = function (path, index) {
  const segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments
    .filter((s) => !isSplat(s))
    .reduce(
      (score, segment) =>
        score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue),
      initialScore
    );
};
const safelyDecodeURI = function (value) {
  try {
    return decodeURI(value);
  } catch (error) {
    warning(
      false,
      'The URL path "' +
        value +
        '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
        ("encoding (" + error + ").")
    );
    return value;
  }
};
const safelyDecodeURIComponent = function (value, paramName) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    warning(
      false,
      'The value for the URL param "' +
        paramName +
        '" will not be decoded because' +
        (' the string "' + value + '" is a malformed URL segment. This is probably') +
        (" due to a bad percent encoding (" + error + ").")
    );
    return value;
  }
};
const matchPath = function (pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true,
    };
  }
  const [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  const match = pathname.match(matcher);
  if (!match) return null;
  const matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  const captureGroups = match.slice(1);
  const params = compiledParams.reduce((memo, _ref, index) => {
    const { isOptional, paramName } = _ref;
    if (paramName === "*") {
      const splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = undefined;
    } else {
      memo[paramName] = safelyDecodeURIComponent(value || "", paramName);
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern,
  };
};
const compilePath = function (path, caseSensitive, end) {
  if (caseSensitive === undefined) {
    caseSensitive = false;
  }
  if (end === undefined) {
    end = true;
  }
  warning(
    path === "*" || !path.endsWith("*") || path.endsWith("/*"),
    'Route path "' +
      path +
      '" will be treated as if it were ' +
      ('"' +
        path.replace(/\*$/, "/*") +
        '" because the `*` character must always follow a `/` in the pattern. To get rid of this warning, ') +
      ('please change the route path to "' + path.replace(/\*$/, "/*") + '".')
  );
  const params = [];
  let regexpSource =
    "^" +
    path
      .replace(/\/*\*?$/, "")
      .replace(/^\/*/, "/")
      .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
      .replace(/\/:(\w+)(\?)?/g, (_, paramName, isOptional) => {
        params.push({
          paramName,
          isOptional: isOptional != null,
        });
        return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
      });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*",
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else;
  const matcher = new RegExp(regexpSource, caseSensitive ? undefined : "i");
  return [matcher, params];
};
const matchRouteBranch = function (branch, pathname) {
  const { routesMeta } = branch;
  const matchedParams = {};
  let matchedPathname = "/";
  const matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    const meta = routesMeta[i];
    const end = i === routesMeta.length - 1;
    const remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    const match = matchPath(
      {
        path: meta.relativePath,
        caseSensitive: meta.caseSensitive,
        end,
      },
      remainingPathname
    );
    if (!match) return null;
    Object.assign(matchedParams, match.params);
    const route = meta.route;
    matches.push({
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route,
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
};
const flattenRoutes = function (routes, branches, parentsMeta, parentPath) {
  if (branches === undefined) {
    branches = [];
  }
  if (parentsMeta === undefined) {
    parentsMeta = [];
  }
  if (parentPath === undefined) {
    parentPath = "";
  }
  const flattenRoute = (route, index, relativePath) => {
    const meta = {
      relativePath: relativePath === undefined ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route,
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(
        meta.relativePath.startsWith(parentPath),
        'Absolute route path "' +
          meta.relativePath +
          '" nested under path ' +
          ('"' +
            parentPath +
            '" is not valid. An absolute child route path must start with the combined path of all its parent routes.')
      );
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    const path = joinPaths([parentPath, meta.relativePath]);
    const routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta,
    });
  };
  routes.forEach((route, index) => {
    let _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (const exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
};
const matchRoutes = function (routes, locationArg, basename) {
  if (basename === undefined) {
    basename = "/";
  }
  const location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  const pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  const branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], safelyDecodeURI(pathname));
  }
  return matches;
};
const groupRoutesByParentId = function (manifest) {
  const routes = {};
  Object.values(manifest).forEach((route) => {
    const parentId = route.parentId || "";
    if (!routes[parentId]) {
      routes[parentId] = [];
    }
    routes[parentId].push(route);
  });
  return routes;
};
const createRoutes = function (manifest, parentId = "", routesByParentId = groupRoutesByParentId(manifest)) {
  return (routesByParentId[parentId] || []).map((route) => ({
    ...route,
    children: createRoutes(manifest, route.id, routesByParentId),
  }));
};

function getKeyedLinksForMatches(matches, routeModules, manifest): Array<KeyedLinkDescriptor> {
  const descriptors = matches
    .map((match): Array<Array<LinkDescriptor>> => {
      const module = routeModules[match.route.id];
      const route = manifest.routes[match.route.id];
      return [route.css ? route.css.map((href) => ({ rel: "stylesheet", href })) : [], module.links?.() || []];
    })
    .flat(2);

  const preloads = getCurrentPageModulePreloadHrefs(matches, manifest);
  return dedupeLinkDescriptors(descriptors, preloads);
}

function getCurrentPageModulePreloadHrefs(
  matches: Array<AgnosticDataRouteMatch>,
  manifest: AssetsManifest
): Array<string> {
  return dedupeHrefs(
    matches
      .map((match) => {
        const route = manifest.routes[match.route.id];
        let hrefs = [route.module];

        if (route.imports) {
          hrefs = hrefs.concat(route.imports);
        }

        return hrefs;
      })
      .flat(1)
  );
}

function dedupeHrefs(hrefs: Array<string>): Array<string> {
  return [...new Set(hrefs)];
}

function dedupeLinkDescriptors<Descriptor extends LinkDescriptor>(
  descriptors: Array<Descriptor>,
  preloads?: Array<string>
): Array<KeyedLinkDescriptor<Descriptor>> {
  const set = new Set();
  const preloadsSet = new Set(preloads);

  return descriptors.reduce((deduped, descriptor) => {
    const alreadyModulePreload =
      preloads &&
      !isPageLinkDescriptor(descriptor) &&
      descriptor.as === "script" &&
      descriptor.href &&
      preloadsSet.has(descriptor.href);

    if (alreadyModulePreload) {
      return deduped;
    }

    const key = JSON.stringify(sortKeys(descriptor));
    if (!set.has(key)) {
      set.add(key);
      deduped.push({ key, link: descriptor });
    }

    return deduped;
  }, [] as Array<KeyedLinkDescriptor<Descriptor>>);
}

function sortKeys<Obj extends { [Key in keyof Obj]: Obj[Key] }>(obj: Obj): Obj {
  const sorted = {} as Obj;
  const keys = Object.keys(obj).sort();

  for (const key of keys) {
    sorted[key as keyof Obj] = obj[key as keyof Obj];
  }

  return sorted;
}

type KeyedLinkDescriptor<Descriptor extends LinkDescriptor = LinkDescriptor> = {
  key: string;
  link: Descriptor;
};

type LinkDescriptor = HtmlLinkDescriptor | PrefetchPageDescriptor;

function isPageLinkDescriptor(object: any): object is PrefetchPageDescriptor {
  return object != null && typeof object.page === "string";
}

export { createRoutes, getKeyedLinksForMatches, matchRoutes };
