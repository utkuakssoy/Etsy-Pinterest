export type ListingStatus = "active" | "draft" | "inactive";
export type PinStatus = "draft" | "scheduled" | "published" | "failed";

export type EtsyListingView = {
  id: string;
  shopId: string;
  etsyListingId: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  tags: string[];
  category: string;
  listingUrl: string;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
};

export type PinConcept = {
  template: string;
  headline: string;
  visualDirection: string;
  targetKeyword: string;
};

export type SeoGenerationResult = {
  pinterestTitles: string[];
  pinterestDescriptions: string[];
  keywords: string[];
  etsyTitleSuggestion: string;
  etsyDescriptionSuggestion: string;
  boardSuggestions: string[];
  pinConcepts: PinConcept[];
};

export type PinterestBoardView = {
  id: string;
  pinterestBoardId: string;
  name: string;
  description: string;
};

export type PinDraftView = {
  id: string;
  productId: string;
  boardId: string;
  title: string;
  description: string;
  destinationUrl: string;
  imageUrl: string;
  status: PinStatus;
  scheduledAt: string | null;
  createdAt: string;
  pinterestPinId?: string;
  publishedUrl?: string;
};

export type PinterestPublishResult = {
  id: string;
  url?: string;
};

export type AnalyticsSnapshotView = {
  id: string;
  impressions: number;
  outboundClicks: number;
  saves: number;
  ctr: number;
  date: string;
  productId: string;
  pinDraftId: string | null;
};
