export interface ServiceItem {
  slug: string;
  number: string;
  icon: string;
  title: string;
  description: string;
  obligation: string;
  pricing: string;
  overageLabel: string;
  overage: string;
}

export const services: ServiceItem[] = [
  {
    slug: 'paid-social',
    number: '01',
    icon: 'share',
    title: 'Paid Social Media Management',
    description:
      'End-to-end strategic management, optimization, and monitoring of paid advertising campaigns across authorized networks (e.g., Meta, TikTok, Reddit). Includes custom audience architecture, tracking pixel deployment validation, budget pacing management, algorithmic optimization, and strategic copywriting variations.',
    obligation: 'Provide all final, production-ready creative assets (video, imagery, graphics).',
    pricing: 'Billed transparently via flat monthly tiers aligned to your approved monthly media budget.',
    overageLabel: 'Overage Governance',
    overage: 'Requests exceeding assigned tier caps incur a clear $150/month per campaign fee and $50 per individual ad setup fee. No surprises.',
  },
  {
    slug: 'ppc-search',
    number: '02',
    icon: 'search',
    title: 'Pay-Per-Click (PPC) Search Management',
    description:
      'Oversight of strategy, development, management, and continuous optimization of paid search engine marketing campaigns (e.g., Google Ads, Microsoft Ads). Encompasses keyword research, negative keyword pruning, search query analysis, bidding strategy management, text-based ad copy formulation, and landing page relevance consulting.',
    obligation: 'Provide platform billing credentials, target URL destinations, and brand guidelines.',
    pricing: 'Governed strictly by your specific PPC spend tier based on your monthly budget.',
    overageLabel: 'Overage Governance',
    overage: 'Concurrent active campaigns exceeding assigned tier limits are billed at an overage rate of $150/month per campaign.',
  },
  {
    slug: 'programmatic',
    number: '03',
    icon: 'monitor',
    title: 'Programmatic Advertising Management',
    description:
      'Deployment and management of real-time bidding (RTB) programmatic media campaigns across display, native, and digital video channels using advanced Demand-Side Platforms (DSPs). Services include audience targeting framework design, inventory quality curation, fraud mitigation protocols, and cross-channel performance optimization.',
    obligation: 'Provide finalized banner assets, video files, and destination links.',
    pricing: 'Billed transparently via a flat fee or a clear agency management percentage formula tied directly to your monthly programmatic spend tier. No hidden markups on inventory.',
    overageLabel: '',
    overage: '',
  },
  {
    slug: 'ooh',
    number: '04',
    icon: 'map-pin',
    title: 'Out-of-Home (OOH) Media Procurement',
    description:
      'Strategic procurement and execution agent for Out-of-Home (OOH) media campaigns. Scope scales by spend bracket and includes market inventory sourcing, publisher contract negotiations, traffic/impression data reviews, competitive market auditing, multi-location mapping, production coordination, and final proof-of-performance verification.',
    obligation: 'Provide high-resolution, print-ready or digital-ready creative assets built to exact publisher specifications.',
    pricing: 'Structured as a flat strategic procurement fee or a visible percentage of total media costs, subject to a strict minimum project floor fee.',
    overageLabel: 'Financial Rule',
    overage: 'All approved OOH commitments are non-cancelable by the Client and must be 100% pre-funded 14 business days prior to vendor deadlines.',
  },
  {
    slug: 'fractional-cmo',
    number: '05',
    icon: 'layers',
    title: 'Fractional CMO',
    description:
      'High-level marketing architecture design, senior strategic alignment, cross-agency collaboration, and complete growth ecosystem oversight. Through our fractional consulting, we also coordinate and manage specialized external services beyond our core media buying—seamlessly connecting and collaborating with our curated network of vetted partner agencies (including SEO specialists, PR firms, creative production houses, and web developers) to act as a single, unified marketing force.',
    obligation: 'Provide access to business growth metrics, legacy agency performance data, and high-level strategic growth targets.',
    pricing: 'Structured as a custom monthly retainer scoped to your growth targets and partner network needs — finalized during your Alignment Call.',
    overageLabel: '',
    overage: '',
  },
];
