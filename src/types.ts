export type SectionType = 'hero' | 'page';
export type ContentBlockType = 'text' | 'imageText' | 'timeline';
export type ImagePosition = 'left' | 'right';
export type ThemeName = 'light' | 'dark' | 'catppuccin';
export type SectionBackground = 'plain' | 'fade';

export interface NavItem {
  label: string;
  href?: string;
  dropdown?: { label: string; href: string }[];
}

export interface BaseSection {
  id: string;
  type: SectionType;
  title: string;
  background?: SectionBackground;
  renderMode?: 'main-page' | 'new-page';
}

export interface HeroData extends BaseSection {
  type: 'hero';
  subtitle?: string;
  description?: string;
  image?: string;
  email?: string;
  linkedin?: string;
}

export interface AssetLink {
  label: string;
  href: string;
}

export interface ContentImage {
  src: string;
  alt?: string;
}

export interface TimelineItem {
  date: string;
  startDate?: string;
  title: string;
  subtitle?: string;
  description: string;
  tags?: string[];
}

export interface ContentBlock {
  type: ContentBlockType;
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  images?: (string | ContentImage)[];
  imageAlt?: string;
  imagePosition?: ImagePosition;
  tags?: string[];
  assets?: AssetLink[];
  timelineItems?: TimelineItem[];
}

export interface PageData extends BaseSection {
  type: 'page';
  description?: string;
  blocks?: ContentBlock[];
  items?: ContentBlock[];
}

export type PortfolioSection = HeroData | PageData;

export interface PortfolioJSON {
  nav: NavItem[];
  sections: PortfolioSection[];
}
