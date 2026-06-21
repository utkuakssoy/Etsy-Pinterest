import type {
  AnalyticsSnapshotView,
  EtsyListingView,
  PinDraftView,
  PinterestBoardView
} from "@/types";

export const demoUser = {
  id: "demo-user",
  email: "seller@pinpilot.demo",
  name: "Demo Seller"
};

export const demoShop = {
  id: "demo-shop",
  etsyShopId: "etsy-demo-shop",
  name: "Northline Studio",
  url: "https://www.etsy.com/shop/northlinestudio"
};

export const demoProducts: EtsyListingView[] = [
  {
    id: "listing-ceramic-mug",
    shopId: demoShop.id,
    etsyListingId: "10000001",
    title: "Handmade speckled ceramic coffee mug with blue glaze",
    description:
      "Wheel-thrown stoneware mug with a speckled clay body, glossy blue glaze, and comfortable handle. Each mug is fired in small batches and made for everyday coffee or tea rituals.",
    price: 34,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=80"],
    tags: ["ceramic mug", "coffee lover gift", "stoneware", "handmade pottery", "blue mug"],
    category: "Home & Living / Kitchen & Dining",
    listingUrl: "https://www.etsy.com/listing/10000001/handmade-speckled-ceramic-coffee-mug",
    status: "active",
    createdAt: "2026-05-11T10:00:00.000Z",
    updatedAt: "2026-06-12T10:00:00.000Z"
  },
  {
    id: "listing-printable-planner",
    shopId: demoShop.id,
    etsyListingId: "10000002",
    title: "Minimal printable weekly planner PDF for small business owners",
    description:
      "A clean undated weekly planner designed for Etsy sellers, makers, and independent business owners. Includes priority planning, content prompts, and order tracking sections.",
    price: 9,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80"],
    tags: ["printable planner", "weekly planner", "small business planner", "etsy seller tools", "digital download"],
    category: "Paper & Party Supplies / Calendars & Planners",
    listingUrl: "https://www.etsy.com/listing/10000002/minimal-printable-weekly-planner",
    status: "active",
    createdAt: "2026-04-19T10:00:00.000Z",
    updatedAt: "2026-06-10T10:00:00.000Z"
  },
  {
    id: "listing-linen-tote",
    shopId: demoShop.id,
    etsyListingId: "10000003",
    title: "Personalized linen market tote bag with embroidered initials",
    description:
      "Durable linen blend tote bag with custom embroidered initials. A practical bridesmaid gift, teacher gift, or everyday market bag with a soft natural texture.",
    price: 28,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80"],
    tags: ["personalized tote", "embroidered bag", "bridesmaid gift", "teacher gift", "linen tote"],
    category: "Bags & Purses / Totes",
    listingUrl: "https://www.etsy.com/listing/10000003/personalized-linen-market-tote",
    status: "active",
    createdAt: "2026-05-30T10:00:00.000Z",
    updatedAt: "2026-06-14T10:00:00.000Z"
  }
];

export const demoBoards: PinterestBoardView[] = [
  { id: "board-gifts", pinterestBoardId: "b-1", name: "Thoughtful Gift Ideas", description: "Buyer-intent seasonal gift pins." },
  { id: "board-home", pinterestBoardId: "b-2", name: "Calm Home Finds", description: "Home decor and kitchen product inspiration." },
  { id: "board-business", pinterestBoardId: "b-3", name: "Small Business Planning", description: "Productivity tools for makers." }
];

export const demoPinDrafts: PinDraftView[] = [
  {
    id: "pin-1",
    productId: "listing-ceramic-mug",
    boardId: "board-home",
    title: "Handmade Ceramic Mug for Cozy Morning Coffee",
    description: "A speckled blue stoneware mug for coffee lovers who want a handmade piece for slow mornings and everyday rituals.",
    destinationUrl: demoProducts[0].listingUrl,
    imageUrl: demoProducts[0].images[0],
    status: "scheduled",
    scheduledAt: "2026-06-24T13:00:00.000Z",
    createdAt: "2026-06-18T10:00:00.000Z"
  },
  {
    id: "pin-2",
    productId: "listing-printable-planner",
    boardId: "board-business",
    title: "Printable Weekly Planner for Etsy Sellers",
    description: "Plan listings, content, and order tasks with a minimal weekly planner made for small business owners.",
    destinationUrl: demoProducts[1].listingUrl,
    imageUrl: demoProducts[1].images[0],
    status: "draft",
    scheduledAt: null,
    createdAt: "2026-06-19T10:00:00.000Z"
  }
];

export const demoAnalytics: AnalyticsSnapshotView[] = [
  { id: "a-1", impressions: 1420, outboundClicks: 92, saves: 134, ctr: 6.48, date: "2026-06-16", productId: "listing-ceramic-mug", pinDraftId: "pin-1" },
  { id: "a-2", impressions: 980, outboundClicks: 57, saves: 83, ctr: 5.82, date: "2026-06-17", productId: "listing-printable-planner", pinDraftId: "pin-2" },
  { id: "a-3", impressions: 760, outboundClicks: 38, saves: 71, ctr: 5.0, date: "2026-06-18", productId: "listing-linen-tote", pinDraftId: null }
];
