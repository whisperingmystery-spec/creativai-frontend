export type BrandIndustry =
  | 'ecommerce'
  | 'fashion'
  | 'technology'
  | 'health'
  | 'finance'
  | 'food'
  | 'education'
  | 'real-estate'
  | 'travel'

export interface ColorSwatch {
  name: string
  hex: string
  role: 'primary' | 'secondary' | 'accent' | 'background' | 'surface' | 'text'
}

export interface ColorPalette {
  id: string
  title: string
  description: string
  swatches: ColorSwatch[]
}

export interface TypographyScale {
  id: string
  title: string
  description: string
  heading: string
  subheading: string
  body: string
  supporting?: string
}

export interface BrandGuideline {
  title: string
  body: string
}

export interface IndustryPreset {
  industry: BrandIndustry
  headline: string
  description: string
  palettes: string[]
  typography: string[]
  voix?: BrandGuideline[]
}

export interface BrandIdentityInput {
  brandName: string
  industry: BrandIndustry
  tone: 'modern' | 'playful' | 'premium' | 'minimal' | 'friendly'
  keywords: string[]
  paletteId?: string
  typographyId?: string
}

export interface GeneratedBrandIdentity {
  brandName: string
  industry: BrandIndustry
  tone: string
  keywords: string[]
  palette: ColorPalette
  typography: TypographyScale
  messaging: BrandGuideline[]
  usage: BrandGuideline[]
}

export const colorPalettes: ColorPalette[] = [
  {
    id: 'tech-neon',
    title: 'Neon Flux',
    description: 'Energetic electric blues and violets for cutting-edge digital brands.',
    swatches: [
      { name: 'Electric Indigo', hex: '#5A45FF', role: 'primary' },
      { name: 'Aqua Flash', hex: '#20E3B2', role: 'secondary' },
      { name: 'Signal Pink', hex: '#FF4D8D', role: 'accent' },
      { name: 'Void Black', hex: '#0C0F23', role: 'background' },
      { name: 'Slate Blue', hex: '#1E254C', role: 'surface' },
      { name: 'Ice White', hex: '#F3F7FF', role: 'text' }
    ]
  },
  {
    id: 'natural-wellness',
    title: 'Calm Botanicals',
    description: 'Soft earth tones rooted in nature for wellness and health brands.',
    swatches: [
      { name: 'Sage Leaf', hex: '#7CA982', role: 'primary' },
      { name: 'Terracotta', hex: '#C67C54', role: 'secondary' },
      { name: 'Golden Honey', hex: '#E8B04C', role: 'accent' },
      { name: 'Stone Mist', hex: '#F2F1EC', role: 'background' },
      { name: 'Moss Shadow', hex: '#3F5D49', role: 'surface' },
      { name: 'Warm Charcoal', hex: '#2B2B2B', role: 'text' }
    ]
  },
  {
    id: 'luxury-gold',
    title: 'Auric Velvet',
    description: 'High-contrast deep blacks and metallic gold for premium experiences.',
    swatches: [
      { name: 'Obsidian', hex: '#080808', role: 'primary' },
      { name: 'Gilded Gold', hex: '#D4AF37', role: 'secondary' },
      { name: 'Champagne', hex: '#F7E7CE', role: 'accent' },
      { name: 'Velvet Nights', hex: '#10121B', role: 'background' },
      { name: 'Pearl', hex: '#FDF6EC', role: 'surface' },
      { name: 'Ivory', hex: '#F8F6F0', role: 'text' }
    ]
  },
  {
    id: 'ecommerce-playful',
    title: 'Pop Shop',
    description: 'Vibrant energetic hues designed for conversion-driven commerce.',
    swatches: [
      { name: 'Magenta Pop', hex: '#FF1B6B', role: 'primary' },
      { name: 'Digital Lilac', hex: '#845EF7', role: 'secondary' },
      { name: 'Sunny CTA', hex: '#FFB30F', role: 'accent' },
      { name: 'Soft Cloud', hex: '#F5F7FB', role: 'background' },
      { name: 'Cool Slate', hex: '#2E3A59', role: 'surface' },
      { name: 'Deep Navy', hex: '#1A1F3B', role: 'text' }
    ]
  },
  {
    id: 'finance-trust',
    title: 'Trust Line',
    description: 'Confident blues and structured neutrals for financial credibility.',
    swatches: [
      { name: 'Steadfast Blue', hex: '#1D4ED8', role: 'primary' },
      { name: 'Graphite', hex: '#111827', role: 'secondary' },
      { name: 'Emerald Growth', hex: '#10B981', role: 'accent' },
      { name: 'Cloud White', hex: '#F5F7FA', role: 'background' },
      { name: 'Steel', hex: '#4B5563', role: 'surface' },
      { name: 'Slate', hex: '#334155', role: 'text' }
    ]
  }
]

export const typographyScales: TypographyScale[] = [
  {
    id: 'modern-sans',
    title: 'Modern Sans',
    description: 'Clean geometric sans serif pairing for technology-forward companies.',
    heading: 'Space Grotesk, 600',
    subheading: 'Inter, 500',
    body: 'Inter, 400',
    supporting: 'Inter, 300'
  },
  {
    id: 'friendly-rounded',
    title: 'Friendly Rounded',
    description: 'Approachable rounded fonts for playful, consumer-facing brands.',
    heading: 'Poppins, 700',
    subheading: 'Nunito, 600',
    body: 'Nunito, 400'
  },
  {
    id: 'serif-elegance',
    title: 'Editorial Elegance',
    description: 'Classic serif headings paired with contemporary sans for luxury.',
    heading: 'Playfair Display, 700',
    subheading: 'Lora, 600',
    body: 'Source Sans Pro, 400',
    supporting: 'Source Sans Pro, 300'
  },
  {
    id: 'humanist',
    title: 'Humanist Professional',
    description: 'Humanist sans serif family optimized for legibility and trust.',
    heading: 'Source Sans Pro, 700',
    subheading: 'Source Sans Pro, 600',
    body: 'Source Sans Pro, 400'
  }
]

export const industryPresets: IndustryPreset[] = [
  {
    industry: 'technology',
    headline: 'Innovative by default',
    description: 'Highlight advanced features and effortless experiences.',
    palettes: ['tech-neon', 'finance-trust'],
    typography: ['modern-sans', 'humanist'],
    voix: [
      { title: 'Tone', body: 'Confident, optimistic, and visionary.' },
      { title: 'Visual cues', body: 'Use gradients, abstract patterns, and vivid accent colors sparingly.' }
    ]
  },
  {
    industry: 'ecommerce',
    headline: 'Conversion-driven storytelling',
    description: 'Focus on speed, clarity, and irresistable product presentation.',
    palettes: ['ecommerce-playful', 'tech-neon'],
    typography: ['friendly-rounded', 'modern-sans'],
    voix: [
      { title: 'Tone', body: 'Energetic, service-oriented, and helpful.' },
      { title: 'Call-to-Action', body: 'Highlight CTAs with accent colors and high contrast.' }
    ]
  },
  {
    industry: 'health',
    headline: 'Calm and trusted guidance',
    description: 'Use soothing tones, plenty of white space, and encouraging language.',
    palettes: ['natural-wellness'],
    typography: ['humanist'],
    voix: [
      { title: 'Tone', body: 'Empathetic, informative, and reassuring.' },
      { title: 'Imagery', body: 'Leverage lifestyle photography with natural lighting and minimal filters.' }
    ]
  },
  {
    industry: 'finance',
    headline: 'Built on trust',
    description: 'Balance stability with innovation through structured layouts and bold statements.',
    palettes: ['finance-trust', 'luxury-gold'],
    typography: ['humanist', 'serif-elegance'],
    voix: [
      { title: 'Tone', body: 'Clear, knowledgeable, and forward-looking.' },
      { title: 'Use of Gold', body: 'Apply gold accents sparingly for premium cues (buttons, highlights).' }
    ]
  },
  {
    industry: 'fashion',
    headline: 'Expressive and elevated',
    description: 'Contrast bold editorials with minimalist typography.',
    palettes: ['luxury-gold', 'tech-neon'],
    typography: ['serif-elegance', 'modern-sans'],
    voix: [
      { title: 'Tone', body: 'Confident, artistic, and trend-conscious.' },
      { title: 'Layout', body: 'Blend asymmetrical layouts with generous negative space.' }
    ]
  }
]

const defaultMessaging: BrandGuideline[] = [
  { title: 'Primary voice', body: 'Communicate with clarity, empathy, and purpose.' },
  { title: 'Audience focus', body: 'Highlight the specific problem your product solves before showcasing features.' },
  { title: 'CTA guidance', body: 'Use action-oriented verbs and supportive micro-copy to reinforce trust.' }
]

const defaultUsage: BrandGuideline[] = [
  { title: 'Logo spacing', body: 'Maintain clear space equal to the logo wordmark height around the logo.' },
  { title: 'Color usage', body: 'Keep primary color at ~60%, secondary at 30%, accent at 10% for balanced compositions.' },
  { title: 'Accessibility', body: 'Ensure text contrast ratio of at least 4.5:1 and provide alternatives for color-only signals.' }
]

const pickRandom = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)]

export const findPaletteById = (id: string | undefined): ColorPalette | undefined =>
  id ? colorPalettes.find((palette) => palette.id === id) : undefined

export const findTypographyById = (id: string | undefined): TypographyScale | undefined =>
  id ? typographyScales.find((scale) => scale.id === id) : undefined

export const findIndustryPreset = (industry: BrandIndustry): IndustryPreset | undefined =>
  industryPresets.find((preset) => preset.industry === industry)

export const generateBrandIdentity = (input: BrandIdentityInput): GeneratedBrandIdentity => {
  const preset = findIndustryPreset(input.industry)
  const palette =
    findPaletteById(input.paletteId) ||
    (preset ? findPaletteById(pickRandom(preset.palettes)) : undefined) ||
    colorPalettes[0]
  const typography =
    findTypographyById(input.typographyId) ||
    (preset ? findTypographyById(pickRandom(preset.typography)) : undefined) ||
    typographyScales[0]

  const messaging = [
    ...(preset?.voix || defaultMessaging),
    { title: 'Keyword Themes', body: input.keywords.length ? input.keywords.join(', ') : 'Define 3-5 brand values.' }
  ]

  const usage = [
    ...defaultUsage,
    {
      title: 'CTA example',
      body: `Use ${palette.swatches.find((swatch) => swatch.role === 'accent')?.name || 'accent'} for primary buttons with copy like “Start your ${input.brandName} journey”.`
    }
  ]

  return {
    brandName: input.brandName || 'Your Brand',
    industry: input.industry,
    tone: input.tone,
    keywords: input.keywords,
    palette,
    typography,
    messaging,
    usage
  }
}

export const formatSwatch = (swatch: ColorSwatch): string => `${swatch.name} — ${swatch.hex.toUpperCase()}`

export const summarizeTypography = (scale: TypographyScale): string => {
  const base = `${scale.heading} / ${scale.subheading} / ${scale.body}`
  return scale.supporting ? `${base} / ${scale.supporting}` : base
}

export const buildGuidelineSummary = (identity: GeneratedBrandIdentity): string => {
  const paletteSummary = identity.palette.swatches
    .filter((swatch) => ['primary', 'secondary', 'accent'].includes(swatch.role))
    .map((swatch) => formatSwatch(swatch))
    .join(' · ')
  return `${identity.brandName} · ${identity.industry.toUpperCase()} · ${identity.tone} · Palette: ${paletteSummary}`
}


