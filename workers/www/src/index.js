import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
import manifestJSON from "__STATIC_CONTENT_MANIFEST";

const assetManifest = JSON.parse(manifestJSON);
const GOAKAL_BASE_URL = "https://goakal.com";
const DEFAULT_SCHOOL_ID = "jagoalgoid";
const KV_KEY_PREFIX = "goakal:classes:";

const LEVEL_ORDER = {
  fundamental: 1,
  intermediate: 2,
  advanced: 3,
};

function normalizeWhitespace(value) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim();
}

function inferLevelKey(title) {
  const lowered = normalizeWhitespace(title).toLowerCase();
  if (lowered.includes("fundamental")) return "fundamental";
  if (lowered.includes("intermediate")) return "intermediate";
  if (lowered.includes("advanced")) return "advanced";
  return "other";
}

function buildJsonResponse(payload, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  if (!headers.has("cache-control")) {
    headers.set("cache-control", "public, max-age=60");
  }
  return new Response(JSON.stringify(payload), {
    ...init,
    headers,
  });
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Fetch failed (${response.status}) for ${url}`);
  }
  return response.json();
}

function toCurrencyValue(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

async function scrapeClassesSnapshot(schoolId) {
  const [landing, classesResult] = await Promise.all([
    fetchJson(`${GOAKAL_BASE_URL}/api/schools/${schoolId}/landing-info`).catch(() => null),
    fetchJson(`${GOAKAL_BASE_URL}/api/schools/${schoolId}/classes`),
  ]);

  const classes = Array.isArray(classesResult?.generalClasses) ? classesResult.generalClasses : [];

  const classLevels = await Promise.all(
    classes.map(async (generalClass) => {
      const details = await fetchJson(
        `${GOAKAL_BASE_URL}/api/generalClass/${generalClass.cuid}?promo=&referral=`
      ).catch(() => ({ priceScheme: [] }));

      const priceSchemes = Array.isArray(details?.priceScheme) ? details.priceScheme : [];
      const normalizedPrices = priceSchemes
        .map((scheme) => toCurrencyValue(scheme.mainAmount))
        .filter((price) => price !== null);

      const levelKey = inferLevelKey(generalClass.title);
      const classUrlId = normalizeWhitespace(generalClass.url_id);

      return {
        level_key: levelKey,
        parent_class: {
          title: normalizeWhitespace(generalClass.title),
          url_id: classUrlId,
          general_class_cuid: normalizeWhitespace(generalClass.cuid),
          parent_page_url: `https://goakal.com/${schoolId}/${classUrlId}`,
          starting_price: normalizedPrices.length > 0 ? Math.min(...normalizedPrices) : null,
          currency: "IDR",
          modules_count: priceSchemes.length,
        },
        modular_classes: priceSchemes.map((scheme) => {
          const shortId = normalizeWhitespace(scheme.shortId);
          return {
            short_id: shortId,
            title: normalizeWhitespace(scheme.title),
            price: toCurrencyValue(scheme.mainAmount),
            discounted_price: toCurrencyValue(scheme.discountedAmount),
            currency: "IDR",
            apply_url: `https://goakal.com/${schoolId}/${classUrlId}/${shortId}/apply`,
          };
        }),
      };
    })
  );

  classLevels.sort((a, b) => {
    const left = LEVEL_ORDER[a.level_key] ?? 99;
    const right = LEVEL_ORDER[b.level_key] ?? 99;
    if (left !== right) return left - right;
    return a.parent_class.title.localeCompare(b.parent_class.title);
  });

  return {
    generated_at: new Date().toISOString(),
    source: {
      base_url: GOAKAL_BASE_URL,
      endpoints: [
        `/api/schools/${schoolId}/landing-info`,
        `/api/schools/${schoolId}/classes`,
        "/api/generalClass/{generalClassCuid}?promo=&referral=",
      ],
    },
    school: {
      id: normalizeWhitespace(landing?.school?.id || ""),
      url_id: normalizeWhitespace(landing?.school?.urlId || schoolId),
      name: normalizeWhitespace(landing?.school?.name || schoolId),
      description: normalizeWhitespace(landing?.school?.description || ""),
    },
    class_levels: classLevels,
  };
}

function buildKvKey(schoolId) {
  return `${KV_KEY_PREFIX}${schoolId}`;
}

async function readClassesFromKv(env, schoolId) {
  if (!env.CLASSES_KV) return null;
  const raw = await env.CLASSES_KV.get(buildKvKey(schoolId));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function writeClassesToKv(env, schoolId, payload) {
  if (!env.CLASSES_KV) return false;
  await env.CLASSES_KV.put(buildKvKey(schoolId), JSON.stringify(payload));
  return true;
}

async function syncClassesData(env, schoolId) {
  const snapshot = await scrapeClassesSnapshot(schoolId);
  const savedToKv = await writeClassesToKv(env, schoolId, snapshot);
  return { snapshot, savedToKv };
}

async function readStaticClassesJson(env, ctx) {
  try {
    const request = new Request("https://static.local/data/goakal-classes.json");
    const response = await getAssetFromKV(
      { request, waitUntil: ctx.waitUntil.bind(ctx) },
      { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest }
    );
    if (!response?.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const schoolId = env.GOAKAL_SCHOOL_ID || DEFAULT_SCHOOL_ID;

    if (url.pathname === "/api/classes" && request.method === "GET") {
      const refresh = url.searchParams.get("refresh") === "1";
      const requestedSchool = normalizeWhitespace(url.searchParams.get("school") || schoolId) || schoolId;

      if (!refresh) {
        const cached = await readClassesFromKv(env, requestedSchool);
        if (cached) {
          return buildJsonResponse(cached, { headers: { "x-data-source": "kv-cache" } });
        }
      }

      try {
        const { snapshot, savedToKv } = await syncClassesData(env, requestedSchool);
        return buildJsonResponse(snapshot, {
          headers: { "x-data-source": savedToKv ? "kv-refresh" : "live-scrape" },
        });
      } catch (error) {
        const fallbackKv = await readClassesFromKv(env, requestedSchool);
        if (fallbackKv) {
          return buildJsonResponse(fallbackKv, {
            headers: { "x-data-source": "kv-stale" },
          });
        }

        const fallbackStatic = await readStaticClassesJson(env, ctx);
        if (fallbackStatic) {
          return buildJsonResponse(fallbackStatic, {
            headers: { "x-data-source": "static-fallback" },
          });
        }

        return buildJsonResponse(
          {
            error: "Failed to get classes data",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 502, headers: { "cache-control": "no-store" } }
        );
      }
    }

    if (url.pathname === "/api/classes/sync" && request.method === "POST") {
      const requestedSchool = normalizeWhitespace(url.searchParams.get("school") || schoolId) || schoolId;
      const expectedToken = env.SYNC_TOKEN || "";
      if (!expectedToken) {
        return buildJsonResponse(
          { error: "Sync endpoint is disabled: missing SYNC_TOKEN" },
          { status: 503, headers: { "cache-control": "no-store" } }
        );
      }

      const incomingToken = request.headers.get("x-sync-token") || "";
      if (incomingToken !== expectedToken) {
        return buildJsonResponse(
          { error: "Unauthorized" },
          { status: 401, headers: { "cache-control": "no-store" } }
        );
      }

      try {
        const { snapshot, savedToKv } = await syncClassesData(env, requestedSchool);
        return buildJsonResponse(
          {
            ok: true,
            school: requestedSchool,
            saved_to_kv: savedToKv,
            generated_at: snapshot.generated_at,
          },
          { headers: { "cache-control": "no-store" } }
        );
      } catch (error) {
        return buildJsonResponse(
          {
            ok: false,
            message: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 502, headers: { "cache-control": "no-store" } }
        );
      }
    }

    try {
      return await getAssetFromKV(
        { request, waitUntil: ctx.waitUntil.bind(ctx) },
        { ASSET_NAMESPACE: env.__STATIC_CONTENT, ASSET_MANIFEST: assetManifest }
      );
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },

  async scheduled(event, env, ctx) {
    const schoolId = env.GOAKAL_SCHOOL_ID || DEFAULT_SCHOOL_ID;
    ctx.waitUntil(
      syncClassesData(env, schoolId).catch((error) => {
        console.error("Scheduled sync failed:", error);
      })
    );
  },
};
