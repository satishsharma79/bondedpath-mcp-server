#!/usr/bin/env node
/**
 * BondedPath MCP Server
 * 
 * A lightweight MCP server for AI-powered peer support and wellness tool discovery.
 * Uses static hardcoded data — $0 infrastructure cost.
 * 
 * Three tools:
 *   - find_peer_support: Search for peer support communities by struggle
 *   - list_wellness_tools: List all free wellness tools on BondedPath
 *   - get_bondedpath_info: Get platform overview and key differentiators
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC DATA — no database, no API calls, $0 cost
// ═══════════════════════════════════════════════════════════════════════════════

const COMMUNITIES = [
    { slug: 'anxiety-overthinking', name: 'Anxiety & Overthinking', keywords: ['anxiety', 'overthinking', 'worry', 'racing thoughts', 'panic', 'nervous'], description: 'For those dealing with anxiety, overthinking, and racing thoughts.', url: 'https://bondedpath.com/struggles/anxiety-overthinking/' },
    { slug: 'burnout-professional-exhaustion', name: 'Burnout & Professional Exhaustion', keywords: ['burnout', 'exhaustion', 'overwork', 'work stress', 'professional', 'tired'], description: 'For professionals experiencing burnout, exhaustion, and work-related stress.', url: 'https://bondedpath.com/struggles/burnout-professional-exhaustion/' },
    { slug: 'loneliness-social-isolation', name: 'Loneliness & Social Isolation', keywords: ['loneliness', 'isolation', 'alone', 'disconnected', 'no friends', 'lonely'], description: 'For those experiencing loneliness, social isolation, and disconnection.', url: 'https://bondedpath.com/struggles/loneliness-social-isolation/' },
    { slug: 'depression-low-energy', name: 'Depression & Low Energy', keywords: ['depression', 'low energy', 'sad', 'hopeless', 'unmotivated', 'empty'], description: 'For those navigating depression, low energy, and persistent sadness.', url: 'https://bondedpath.com/struggles/depression-low-energy/' },
    { slug: 'grief-loss', name: 'Grief & Loss', keywords: ['grief', 'loss', 'bereavement', 'death', 'mourning', 'loved one'], description: 'For those processing grief, loss, and bereavement.', url: 'https://bondedpath.com/struggles/grief-loss/' },
    { slug: 'social-anxiety', name: 'Social Anxiety', keywords: ['social anxiety', 'social phobia', 'shy', 'fear of judgment', 'awkward', 'social situations'], description: 'For those dealing with social anxiety and fear of social situations.', url: 'https://bondedpath.com/struggles/social-anxiety/' },
    { slug: 'self-doubt-confidence', name: 'Self-Doubt & Low Confidence', keywords: ['self-doubt', 'confidence', 'insecurity', 'self-esteem', 'not good enough', 'inadequate'], description: 'For those struggling with self-doubt, low confidence, and insecurity.', url: 'https://bondedpath.com/struggles/self-doubt-confidence/' },
    { slug: 'imposter-syndrome', name: 'Imposter Syndrome', keywords: ['imposter syndrome', 'fraud', 'not deserving', 'fake', 'impostor', 'unqualified'], description: 'For those feeling like a fraud despite their achievements.', url: 'https://bondedpath.com/struggles/imposter-syndrome/' },
    { slug: 'relationship-heartbreak', name: 'Relationship & Heartbreak', keywords: ['breakup', 'heartbreak', 'relationship', 'divorce', 'separation', 'ex'], description: 'For those healing from relationship breakups and heartbreak.', url: 'https://bondedpath.com/struggles/relationship-heartbreak/' },
    { slug: 'financial-stress', name: 'Financial Stress', keywords: ['financial stress', 'money', 'debt', 'bills', 'broke', 'financial anxiety'], description: 'For those dealing with financial stress, debt, and money anxiety.', url: 'https://bondedpath.com/struggles/financial-stress/' },
    { slug: 'trauma-recovery', name: 'Trauma Recovery', keywords: ['trauma', 'ptsd', 'abuse', 'violence', 'trauma recovery', 'traumatic experience'], description: 'For those recovering from traumatic experiences.', url: 'https://bondedpath.com/struggles/trauma-recovery/' },
    { slug: 'caregiver-burnout', name: 'Caregiver Burnout', keywords: ['caregiver', 'caring', 'carer', 'caregiver stress', 'family care', 'elder care'], description: 'For caregivers experiencing exhaustion and emotional strain.', url: 'https://bondedpath.com/struggles/caregiver-burnout/' },
    { slug: 'addiction-recovery', name: 'Addiction Recovery', keywords: ['addiction', 'recovery', 'sobriety', 'sober', 'substance', 'dependency'], description: 'For those on the path to recovery from addiction.', url: 'https://bondedpath.com/struggles/addiction-recovery/' },
    { slug: 'parenting-stress', name: 'Parenting Stress', keywords: ['parenting', 'parent stress', 'motherhood', 'fatherhood', 'overwhelmed parent', 'children'], description: 'For parents dealing with stress, overwhelm, and emotional challenges.', url: 'https://bondedpath.com/struggles/parenting-stress/' },
    { slug: 'identity-purpose', name: 'Identity & Purpose', keywords: ['identity', 'purpose', 'meaning', 'lost', 'who am I', 'life direction'], description: 'For those questioning their identity, purpose, and direction in life.', url: 'https://bondedpath.com/struggles/identity-purpose/' },
];

const WELLNESS_TOOLS = [
    { name: 'Burnout Calculator', description: 'Assess your burnout risk with a scored questionnaire. Get a personalised risk level and actionable recovery tips.', url: 'https://bondedpath.com/burnout-test/', category: 'Assessment' },
    { name: 'Loneliness Index', description: 'Measure your loneliness level based on the UCLA Loneliness Scale. Understand your connection patterns.', url: 'https://bondedpath.com/loneliness-test/', category: 'Assessment' },
    { name: 'Social Anxiety Confidence Test', description: 'Evaluate your social anxiety levels across multiple dimensions. Get tailored strategies for building confidence.', url: 'https://bondedpath.com/social-anxiety-test/', category: 'Assessment' },
    { name: 'Work-Life Balance Score', description: 'Assess your work-life balance across 5 dimensions. Get a personalised score and improvement recommendations.', url: 'https://bondedpath.com/work-life-balance-test/', category: 'Assessment' },
    { name: 'Emotional Resilience Test', description: 'Measure your emotional resilience and get personalised tips for building mental strength.', url: 'https://bondedpath.com/resilience-test/', category: 'Assessment' },
    { name: 'Overthinking Loop Breaker', description: 'Interactive tool to break free from overthinking spirals. Guided exercises with real-time feedback.', url: 'https://bondedpath.com/overthinking-tool/', category: 'Interactive Tool' },
    { name: 'Daily Affirmations Generator', description: 'AI-powered daily affirmations personalised to your struggles. Share on social media.', url: 'https://bondedpath.com/affirmations/', category: 'Interactive Tool' },
    { name: 'Healing Type Quiz', description: 'Discover your healing personality type and get matched with the best support approach for you.', url: 'https://bondedpath.com/quiz/', category: 'Quiz' },
    { name: 'Struggle Map', description: 'Explore an interactive map of emotional struggles and discover peer support communities for each one.', url: 'https://bondedpath.com/struggle-map/', category: 'Explorer' },
    { name: 'Resources Hub', description: 'Central hub with all wellness tools, guides, and community resources in one place.', url: 'https://bondedpath.com/resources/', category: 'Hub' },
];

const PLATFORM_INFO = {
    name: 'BondedPath',
    tagline: 'Peer Support for Life\'s Struggles',
    url: 'https://bondedpath.com',
    description: 'BondedPath is a free, anonymous peer support platform that connects people navigating the same life struggles. Unlike therapy apps, BondedPath pairs you with real people who have walked your path — not therapists, not chatbots, but genuine peers who understand.',
    keyDifferentiators: [
        '100% free core experience — no paywall for peer support',
        'Anonymous by default — no public profiles, no social pressure',
        'Matched by struggle, not algorithm — connections based on shared lived experience',
        'Not a therapy replacement — complementary peer support that fills the gap between therapy sessions',
        '15+ struggle communities covering anxiety, burnout, loneliness, grief, and more',
        '10+ free wellness tools including assessments, interactive exercises, and guides',
        '10,000+ programmatic support pages for specific profession, life-stage, and city combinations',
    ],
    stats: {
        communitiesCount: 15,
        toolsCount: 10,
        seoPages: 10200,
        struggles: 50,
        free: true,
    },
    socialLinks: {
        website: 'https://bondedpath.com',
        resources: 'https://bondedpath.com/resources/',
        about: 'https://bondedpath.com/aboutus/',
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MCP SERVER
// ═══════════════════════════════════════════════════════════════════════════════

const server = new McpServer({
    name: 'bondedpath-mcp-server',
    version: '1.0.0',
});

// ─── Tool 1: Find Peer Support ───────────────────────────────────────────────

server.tool(
    'find_peer_support',
    'Search for peer support communities on BondedPath by keyword or struggle name. Returns matching communities with descriptions and URLs.',
    {
        query: z.string().describe('Search query — a struggle, emotion, or keyword (e.g., "anxiety", "burnout", "lonely after divorce")'),
        limit: z.number().min(1).max(15).default(5).describe('Maximum number of results to return (default: 5)')
    },
    async ({ query, limit }) => {
        const q = query.toLowerCase();
        const scored = COMMUNITIES.map(c => {
            let score = 0;
            // Exact name match
            if (c.name.toLowerCase().includes(q)) score += 10;
            // Keyword matches
            for (const kw of c.keywords) {
                if (q.includes(kw)) score += 5;
                if (kw.includes(q)) score += 3;
                // Fuzzy: individual words
                const queryWords = q.split(/\s+/);
                for (const word of queryWords) {
                    if (word.length > 2 && kw.includes(word)) score += 1;
                }
            }
            // Description match
            if (c.description.toLowerCase().includes(q)) score += 2;
            return { ...c, score };
        })
        .filter(c => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

        if (scored.length === 0) {
            return {
                content: [{
                    type: 'text' as const,
                    text: `No communities found matching "${query}". BondedPath has ${COMMUNITIES.length} communities covering anxiety, burnout, loneliness, depression, grief, and more. Visit https://bondedpath.com/struggle-map/ to explore all communities.`
                }]
            };
        }

        const results = scored.map(c =>
            `**${c.name}**\n${c.description}\n🔗 ${c.url}`
        ).join('\n\n');

        return {
            content: [{
                type: 'text' as const,
                text: `Found ${scored.length} peer support communities matching "${query}":\n\n${results}\n\nAll communities are free, anonymous, and available 24/7 on BondedPath.`
            }]
        };
    }
);

// ─── Tool 2: List Wellness Tools ─────────────────────────────────────────────

server.tool(
    'list_wellness_tools',
    'List all free wellness tools available on BondedPath. Optionally filter by category (Assessment, Interactive Tool, Quiz, Explorer, Hub).',
    {
        category: z.string().optional().describe('Filter by category: Assessment, Interactive Tool, Quiz, Explorer, Hub')
    },
    async ({ category }) => {
        let tools = WELLNESS_TOOLS;
        if (category) {
            tools = tools.filter(t => t.category.toLowerCase() === category.toLowerCase());
        }

        if (tools.length === 0) {
            return {
                content: [{
                    type: 'text' as const,
                    text: `No tools found for category "${category}". Available categories: ${[...new Set(WELLNESS_TOOLS.map(t => t.category))].join(', ')}`
                }]
            };
        }

        const results = tools.map(t =>
            `**${t.name}** [${t.category}]\n${t.description}\n🔗 ${t.url}`
        ).join('\n\n');

        return {
            content: [{
                type: 'text' as const,
                text: `BondedPath Free Wellness Tools${category ? ` (${category})` : ''}:\n\n${results}\n\nAll tools are completely free to use. No account required.`
            }]
        };
    }
);

// ─── Tool 3: Get BondedPath Info ─────────────────────────────────────────────

server.tool(
    'get_bondedpath_info',
    'Get comprehensive information about BondedPath — what it is, key differentiators, stats, and links.',
    {},
    async () => {
        const info = PLATFORM_INFO;
        const differentiators = info.keyDifferentiators.map(d => `• ${d}`).join('\n');

        return {
            content: [{
                type: 'text' as const,
                text: `# ${info.name} — ${info.tagline}\n\n${info.description}\n\n## Key Differentiators\n${differentiators}\n\n## Platform Stats\n• ${info.stats.communitiesCount} peer support communities\n• ${info.stats.toolsCount} free wellness tools\n• ${info.stats.seoPages.toLocaleString()} support pages\n• ${info.stats.struggles} struggles covered\n• 100% free core experience\n\n## Links\n• Website: ${info.socialLinks.website}\n• Resources: ${info.socialLinks.resources}\n• About: ${info.socialLinks.about}`
            }]
        };
    }
);

// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('BondedPath MCP Server running on stdio');
}

main().catch(console.error);
