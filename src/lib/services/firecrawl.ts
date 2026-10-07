// Firecrawl web scraping service

const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v0';

interface FirecrawlResponse {
  success: boolean;
  data?: {
    content: string;
    metadata: {
      title: string;
      description?: string;
      language?: string;
    };
  };
  error?: string;
}

interface FirecrawlCrawlResponse {
  success: boolean;
  data?: {
    pages: Array<{
      content: string;
      url: string;
      metadata: {
        title: string;
        description?: string;
      };
    }>;
  };
  error?: string;
}

export async function scrapeUrl(url: string): Promise<{ content: string; metadata: any } | null> {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        pageOptions: {
          onlyMainContent: true,
        },
      }),
    });

    const data: FirecrawlResponse = await response.json();

    if (data.success && data.data) {
      return {
        content: data.data.content,
        metadata: data.data.metadata,
      };
    }

    console.error('Firecrawl scrape error:', data.error);
    return null;
  } catch (error) {
    console.error('Firecrawl request failed:', error);
    return null;
  }
}

export async function crawlWebsite(
  url: string,
  maxPages: number = 15
): Promise<Array<{ url: string; title: string; content: string; type: string }>> {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/crawl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`,
      },
      body: JSON.stringify({
        url,
        pageOptions: {
          onlyMainContent: true,
        },
        crawlerOptions: {
          maxDepth: 2,
          maxPages,
          followRobots: true,
        },
      }),
    });

    const data: FirecrawlCrawlResponse = await response.json();

    if (data.success && data.data) {
      return data.data.pages.map((page) => ({
        url: page.url,
        title: page.metadata.title || 'Untitled',
        content: page.content,
        type: classifyPageType(page.url, page.metadata.title || ''),
      }));
    }

    console.error('Firecrawl crawl error:', data.error);
    return [];
  } catch (error) {
    console.error('Firecrawl crawl request failed:', error);
    return [];
  }
}

function classifyPageType(url: string, title: string): string {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();

  const patterns: Array<{ type: string; keywords: string[] }> = [
    { type: 'homepage', keywords: ['home'] },
    { type: 'about', keywords: ['about', 'about-us', 'company', 'story', 'team', 'who we are'] },
    { type: 'services', keywords: ['service', 'services', 'what we do', 'solutions'] },
    { type: 'products', keywords: ['product', 'products', 'catalog'] },
    { type: 'pricing', keywords: ['pricing', 'price', 'cost', 'rates', 'fees'] },
    { type: 'contact', keywords: ['contact', 'reach us', 'get in touch'] },
    { type: 'booking', keywords: ['book', 'appointment', 'schedule', 'reserve', 'consultation'] },
    { type: 'quote', keywords: ['quote', 'estimate', 'quote-request'] },
    { type: 'faq', keywords: ['faq', 'frequently asked', 'questions', 'help'] },
    { type: 'testimonials', keywords: ['testimonial', 'reviews', 'testimonials', 'review', 'feedback'] },
    { type: 'case-studies', keywords: ['case study', 'case studies', 'portfolio', 'work', 'projects'] },
    { type: 'blog', keywords: ['blog', 'news', 'articles', 'insights'] },
    { type: 'careers', keywords: ['careers', 'jobs', 'hiring', 'join us', 'open positions'] },
    { type: 'locations', keywords: ['location', 'locations', 'area', 'service area', 'branches'] },
  ];

  for (const pattern of patterns) {
    if (pattern.keywords.some(kw => urlLower.includes(kw) || titleLower.includes(kw))) {
      return pattern.type;
    }
  }

  return 'other';
}
