// Research Service - Extracts business signals from scraped content

import { scrapeUrl, crawlWebsite } from './firecrawl';
import { generateContent, generateJSON } from '../gemini';
import type {
  ScrapedPage,
  BusinessSignals,
  LeadGenSignals,
  OperationalSignals,
  WebsiteFeatures,
  RawResearch,
} from '../types';

export interface ResearchResult {
  scrapedPages: ScrapedPage[];
  businessSignals: BusinessSignals;
  leadGenSignals: LeadGenSignals;
  operationalSignals: OperationalSignals;
  websiteFeatures: WebsiteFeatures;
}

export async function researchWebsite(url: string): Promise<ResearchResult | null> {
  // First, try to crawl the website for comprehensive data
  const pages = await crawlWebsite(url, 15);

  if (pages.length === 0) {
    // Fallback to single page scrape
    const singlePage = await scrapeUrl(url);
    if (singlePage) {
      pages.push({
        url,
        title: singlePage.metadata.title || 'Homepage',
        content: singlePage.content,
        type: 'homepage',
      });
    }
  }

  if (pages.length === 0) {
    return null;
  }

  // Combine all content for analysis
  const combinedContent = pages
    .map(p => `[${p.type.toUpperCase()}] ${p.title}\n${p.content}`)
    .join('\n\n---\n\n');

  // Extract signals using AI
  const [businessSignals, leadGenSignals, operationalSignals, websiteFeatures] = await Promise.all([
    extractBusinessSignals(combinedContent, url),
    extractLeadGenSignals(combinedContent),
    extractOperationalSignals(combinedContent),
    extractWebsiteFeatures(pages),
  ]);

  return {
    scrapedPages: pages,
    businessSignals,
    leadGenSignals,
    operationalSignals,
    websiteFeatures,
  };
}

async function extractBusinessSignals(content: string, url: string): Promise<BusinessSignals> {
  const prompt = `Analyze this website content and extract business information. Return ONLY valid JSON.

Website URL: ${url}

Content to analyze:
${content.slice(0, 10000)}

Extract the following in JSON format:
{
  "companyName": "extracted or null",
  "industry": "extracted or null",
  "services": ["array of services offered"],
  "products": ["array of products if any"],
  "targetCustomers": ["array of customer types"],
  "geographicMarket": "local/regional/national/international or null",
  "businessModel": "B2B/B2C/B2B2C/service/ecommerce or null",
  "primaryCTA": "main call to action or null",
  "contactMethods": ["array of contact methods found"]
}

Return ONLY the JSON object, no markdown formatting.`;

  try {
    const result = await generateJSON<BusinessSignals>(prompt);
    return result;
  } catch (error) {
    console.error('Error extracting business signals:', error);
    return {};
  }
}

async function extractLeadGenSignals(content: string): Promise<LeadGenSignals> {
  const prompt = `Analyze this website content for lead generation signals. Return ONLY valid JSON.

Content to analyze:
${content.slice(0, 10000)}

Extract lead generation elements found:
{
  "contactForms": number of contact forms found,
  "quoteForms": number of quote/estimate request forms,
  "bookingForms": number of booking/scheduling forms,
  "phoneNumbers": ["array of phone numbers found"],
  "emailAddresses": ["array of email addresses found"],
  "liveChat": boolean if live chat is mentioned/visible,
  "chatbots": boolean if chatbot is mentioned/visible,
  "calendars": boolean if calendar booking is mentioned,
  "consultationForms": boolean if consultation forms exist,
  "leadMagnets": ["array of lead magnets like ebooks, guides, etc."],
  "newsletterForms": boolean if newsletter signup exists
}

Return ONLY the JSON object, no markdown formatting.`;

  try {
    const result = await generateJSON<LeadGenSignals>(prompt);
    return result;
  } catch (error) {
    console.error('Error extracting lead gen signals:', error);
    return {};
  }
}

async function extractOperationalSignals(content: string): Promise<OperationalSignals> {
  const prompt = `Analyze this website content for operational/business process signals. Return ONLY valid JSON.

Content to analyze:
${content.slice(0, 10000)}

Look for evidence of these business processes:
{
  "quotes": boolean if quotes/estimates are mentioned,
  "estimates": boolean if estimates are mentioned,
  "scheduling": boolean if scheduling/appointments are mentioned,
  "consultations": boolean if consultations are offered,
  "customerOnboarding": boolean if onboarding process is mentioned,
  "followUps": boolean if follow-up processes are mentioned,
  "reviews": boolean if reviews/testimonials are collected,
  "documents": boolean if documents/forms are mentioned,
  "reporting": boolean if reporting/dashboards are mentioned,
  "notifications": boolean if notifications/alerts are mentioned
}

Return ONLY the JSON object, no markdown formatting.`;

  try {
    const result = await generateJSON<OperationalSignals>(prompt);
    return result;
  } catch (error) {
    console.error('Error extracting operational signals:', error);
    return {};
  }
}

function extractWebsiteFeatures(pages: ScrapedPage[]): WebsiteFeatures {
  const features: WebsiteFeatures = {};

  for (const page of pages) {
    const content = page.content.toLowerCase();
    const title = page.title.toLowerCase();
    const url = page.url.toLowerCase();

    // Contact forms
    if (content.includes('contact') && (content.includes('form') || content.includes('input'))) {
      features.hasContactForm = true;
    }

    // Quote forms
    if (url.includes('quote') || url.includes('estimate') ||
        title.includes('quote') || title.includes('estimate')) {
      features.hasQuoteForm = true;
    }

    // Booking systems
    if (url.includes('book') || url.includes('schedule') || url.includes('appointment') ||
        title.includes('book') || title.includes('schedule')) {
      features.hasBookingSystem = true;
    }

    // Chat
    if (content.includes('chat') || content.includes('chatbot') || content.includes('messenger')) {
      features.hasChatbot = true;
    }

    // Phone CTA
    if (content.includes('tel:') || content.includes('phone') || content.includes('call us')) {
      features.hasPhoneCTA = true;
    }

    // Email contact
    if (content.includes('@') && content.includes('email')) {
      features.hasEmailContact = true;
    }

    // FAQ
    if (url.includes('faq') || title.includes('faq') || content.includes('frequently asked')) {
      features.hasFAQ = true;
    }

    // Blog
    if (url.includes('blog') || title.includes('blog')) {
      features.hasBlog = true;
    }

    // Testimonials
    if (url.includes('testimonial') || url.includes('review') ||
        title.includes('testimonial') || title.includes('review')) {
      features.hasTestimonials = true;
    }

    // Pricing
    if (url.includes('pricing') || title.includes('pricing') ||
        title.includes('price') || content.includes('$')) {
      features.hasPricing = true;
    }

    // Portfolio/Case studies
    if (url.includes('portfolio') || url.includes('case-study') ||
        title.includes('portfolio') || title.includes('our work')) {
      features.hasCaseStudies = true;
    }

    // Newsletter
    if (content.includes('newsletter') || content.includes('subscribe')) {
      features.hasNewsletter = true;
    }

    // Live chat
    if (content.includes('live chat') || content.includes('chat with us')) {
      features.hasLiveChat = true;
    }
  }

  return features;
}
