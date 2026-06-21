import { isEtsyConfigured } from "@/lib/env";
import type { EtsyListingView } from "@/types";
import { readImportedEtsyShop, saveImportedEtsyShop } from "@/services/local-store";

export async function importEtsyShop(shopUrl: string) {
  const parsedShop = parseEtsyShopUrl(shopUrl);
  if (!parsedShop) {
    throw new Error("Please enter a valid Etsy shop URL, for example https://www.etsy.com/shop/ShopName.");
  }

  if (!isEtsyConfigured) {
    const importedShop = await importPublicEtsyShop(parsedShop);
    saveImportedEtsyShop(importedShop);
    return { mode: "public-shop" as const, ...importedShop };
  }

  const importedShop = await importPublicEtsyShop(parsedShop);
  saveImportedEtsyShop(importedShop);
  return { mode: "api-ready" as const, ...importedShop };
}

export async function getEtsyListings() {
  return readImportedEtsyShop()?.listings ?? [];
}

export async function getImportedEtsyShop() {
  return readImportedEtsyShop();
}

type ParsedShopUrl = {
  shopName: string;
  url: string;
};

function parseEtsyShopUrl(input: string): ParsedShopUrl | null {
  try {
    const url = new URL(input.trim());
    if (!url.hostname.toLowerCase().endsWith("etsy.com")) {
      return null;
    }

    const parts = url.pathname.split("/").filter(Boolean);
    const shopIndex = parts.findIndex((part) => part.toLowerCase() === "shop");
    const shopName = shopIndex >= 0 ? parts[shopIndex + 1] : parts[0];

    if (!shopName) {
      return null;
    }

    return {
      shopName,
      url: `https://www.etsy.com/shop/${shopName}`
    };
  } catch {
    return null;
  }
}

async function importPublicEtsyShop(shop: ParsedShopUrl) {
  const rssListings = await fetchShopRss(shop);
  const listings = rssListings.length ? rssListings : await fetchShopPageListings(shop);

  if (!listings.length) {
    throw new Error(
      "No public Etsy listings could be imported from this shop link. The shop may be private, empty, region-blocked, or Etsy may have blocked public fetching. Add Etsy API credentials for the official import path."
    );
  }

  return {
    shop: {
      id: `shop-${slug(shop.shopName)}`,
      etsyShopId: shop.shopName,
      name: shop.shopName,
      url: shop.url
    },
    listings,
    importedAt: new Date().toISOString()
  };
}

async function fetchShopRss(shop: ParsedShopUrl): Promise<EtsyListingView[]> {
  const rssUrl = `${shop.url}/rss`;
  const response = await fetch(rssUrl, {
    headers: {
      "User-Agent": "PinPilot/0.1 local desktop app"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return [];
  }

  const xml = await response.text();
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).slice(0, 24);

  return items
    .map((match, index) => {
      const item = match[1];
      const title = decodeXml(readTag(item, "title"));
      const link = decodeXml(readTag(item, "link"));
      const descriptionHtml = decodeXml(readTag(item, "description"));
      const image = extractImage(descriptionHtml);
      const listingId = extractListingId(link) ?? `${shop.shopName}-${index + 1}`;

      if (!title || !link) {
        return null;
      }

      return toListing({
        shop,
        listingId,
        title,
        description: stripHtml(descriptionHtml) || title,
        image,
        listingUrl: link,
        index
      });
    })
    .filter((listing): listing is EtsyListingView => Boolean(listing));
}

async function fetchShopPageListings(shop: ParsedShopUrl): Promise<EtsyListingView[]> {
  const response = await fetch(shop.url, {
    headers: {
      "User-Agent": "Mozilla/5.0 PinPilot local desktop app",
      Accept: "text/html"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    return [];
  }

  const html = await response.text();
  const listingUrls = Array.from(
    new Set(
      Array.from(html.matchAll(/https:\/\/www\.etsy\.com\/listing\/(\d+)\/[^"'<\s?]+/g)).map((match) => match[0])
    )
  ).slice(0, 24);

  return listingUrls.map((listingUrl, index) => {
    const listingId = extractListingId(listingUrl) ?? `${shop.shopName}-${index + 1}`;
    const title = titleFromUrl(listingUrl);

    return toListing({
      shop,
      listingId,
      title,
      description: title,
      image: extractNearbyImage(html, listingId),
      listingUrl,
      index
    });
  });
}

function toListing({
  shop,
  listingId,
  title,
  description,
  image,
  listingUrl,
  index
}: {
  shop: ParsedShopUrl;
  listingId: string;
  title: string;
  description: string;
  image?: string;
  listingUrl: string;
  index: number;
}): EtsyListingView {
  const now = new Date().toISOString();

  return {
    id: `listing-${listingId}`,
    shopId: `shop-${slug(shop.shopName)}`,
    etsyListingId: listingId,
    title,
    description,
    price: 0,
    currency: "USD",
    images: image ? [image] : [],
    tags: inferTags(title),
    category: "Etsy Shop Listing",
    listingUrl,
    status: "active",
    createdAt: now,
    updatedAt: now
  };
}

function readTag(xml: string, tag: string) {
  return xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`))?.[1] ?? "";
}

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractImage(value: string) {
  return value.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1];
}

function extractNearbyImage(html: string, listingId: string) {
  const index = html.indexOf(listingId);
  if (index < 0) {
    return undefined;
  }

  const nearby = html.slice(Math.max(0, index - 2000), index + 2000);
  return nearby.match(/https:\/\/i\.etsystatic\.com\/[^"'\s]+/i)?.[0]?.replace(/\\u002F/g, "/");
}

function extractListingId(url: string) {
  return url.match(/\/listing\/(\d+)\//)?.[1];
}

function titleFromUrl(url: string) {
  const slugPart = url.split("/listing/")[1]?.split("/")[1] ?? "etsy-listing";
  return slugPart
    .split("?")[0]
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function inferTags(title: string) {
  return Array.from(
    new Set(
      title
        .toLowerCase()
        .split(/[^a-z0-9]+/)
        .filter((word) => word.length > 3)
        .slice(0, 8)
    )
  );
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
