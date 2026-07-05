const SITE_URL = process.env.SITE_URL;
const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;
const BING_SITE_VERIFICATION = process.env.BING_SITE_VERIFICATION;

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  author: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  socialLinks: string[];
  twitter?: {
    site: string;
    creator: string;
  };
  verification?: {
    google?: string;
    bing?: string;
  };
  /**
   * Branding configuration
   * Logo files: Replace SVGs in src/assets/branding/
   * Favicon: Replace in public/favicon.svg
   */
  branding: {
    /** Logo alt text for accessibility */
    logo: {
      alt: string;
    };
    /** Favicon path (lives in public/) */
    favicon: {
      svg: string;
    };
    /** Theme colors for manifest and browser UI */
    colors: {
      /** Browser toolbar color (hex) */
      themeColor: string;
      /** PWA splash screen background (hex) */
      backgroundColor: string;
    };
  };
}

const siteConfig: SiteConfig = {
  name: 'Murry Street Media',
  description: 'Fractional CMO consulting and paid media engineered for enterprise-level transparency, accountability, and growth.',
  url: SITE_URL || 'https://murrystreetmedia.com',
  ogImage: '/og-default.png',
  author: 'Murry Street Media LLC',
  // Demo contact info - replace with your actual business details
  email: 'lacey@murrystreet.com',
  phone: '+1 (214) 555-0100',
  address: {
    street: 'Dallas, TX',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
    country: 'US',
  },
  socialLinks: [
    'https://murrystreetmedia.com',
  ],
  // Twitter metadata - update with your actual handles or remove
  // twitter: {
  //   site: '@yourhandle',
  //   creator: '@yourhandle',
  // },
  verification: {
    google: GOOGLE_SITE_VERIFICATION,
    bing: BING_SITE_VERIFICATION,
  },
  // Branding: Logo files live in src/assets/branding/
  // Replace the SVG files there with your own branding
  branding: {
    logo: {
      alt: 'Murry Street Media',
    },
    favicon: {
      svg: '/favicon.svg',
    },
    colors: {
      themeColor: '#DFE11D',
      backgroundColor: '#ffffff',
    },
  },
};

export default siteConfig;
