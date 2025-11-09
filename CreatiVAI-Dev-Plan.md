# CreatiVAI Agency - Complete Development Plan for Cursor
## Step-by-Step Implementation Guide for Image Tools Platform

---

## SECTION 0: TECH STACK FINAL DECISION

### Why These Technologies:

**Frontend Framework: Vue.js 3 (NOT vanilla JS)**
- Reason: Scalable component reusability (add tools incrementally without refactoring)
- Reason: Easier state management (user accounts, file handling, tool settings)
- Reason: Progressive enhancement (can start simple, scale to complex)
- Reason: 51% adoption rate in 2024 (battle-tested for production)
- Reason: 18-20KB compressed (lightweight vs React's bloat)
- Bundle Size: ~32KB gzipped (acceptable for web tools)

**Styling: TailwindCSS + Headless UI**
- Reason: Mobile-first responsive design (you need responsive on ALL devices)
- Reason: Utility-first = fast to add animations and effects
- Reason: No CSS file management (everything in classes)
- Reason: Dark mode support built-in (future feature)
- Bundle Size: ~15KB with PurgeCSS (minimal)

**Animation Library: GSAP (GreenSock Animation Platform)**
- Reason: Framework-agnostic (works with Vue, vanilla, everything)
- Reason: Timeline-based animations (complex sequences needed)
- Reason: ScrollTrigger plugin (scroll-based animations for landing page)
- Reason: Battle-tested performance (23KB compressed, tree-shakable)
- Reason: Superior to Framer Motion for non-React projects
- Free Core License: $0 (premium plugins optional later)

**Database: Supabase (PostgreSQL with Auth)**
- Reason: Free tier = $0/month (vs Firebase's limited firestore)
- Reason: Managed PostgreSQL (relational = better for user accounts)
- Reason: Built-in Auth (JWT, passwordless login)
- Reason: Auto-generated REST API (no backend coding needed)
- Reason: Real-time subscriptions with WebSockets
- Reason: No vendor lock-in (self-hostable if needed)
- Free Tier: 50k MAUs, 500MB database, 1GB storage

**User Authentication: Supabase Auth + WordPress Plugin Bridge**
- Why NOT plain WordPress plugins: Heavy, database-bloating, slow
- Why Supabase: Lightweight, REST API, works with static HTML tools
- Implementation: Supabase handles auth, WordPress gets user data via webhook

**Payment Gateway: Stripe (recommended) + WooCommerce**
- Reason: For subscriptions and digital products
- Reason: WooCommerce Stripe plugin = simple setup
- Reason: No monthly fees, only transaction fees (2.2% + $0.30)
- Reason: Supports subscriptions, one-time payments, digital downloads
- Alternative: Lemonsqueezy (even simpler for digital products, but Stripe more established)

**Image Processing: Browser-Side (Canvas API + WebAssembly)**
- All image tools run client-side = $0 server costs
- No upload to servers = privacy-first advantage
- Zero latency = instant processing

**Hosting:**
- Frontend/Tools: Vercel, Netlify, or Cloudflare Pages (FREE tier = $0)
- WordPress/Blog: Your existing host (SiteGround, Kinsta, etc.)
- Database: Supabase Cloud ($0 free tier)
- Edge Functions: Supabase Edge Functions (for API bridges)

**Total Monthly Cost: $0-20** (just WordPress hosting)

---

## SECTION 1: PROJECT STRUCTURE

```
creativaiagency-com/
│
├── /frontend (Vue 3 + TailwindCSS + GSAP - Deploy to Vercel)
│   ├── src/
│   │   ├── components/
│   │   │   ├── tools/
│   │   │   │   ├── ImageConverter.vue
│   │   │   │   ├── ImageCompressor.vue
│   │   │   │   ├── AddText.vue
│   │   │   │   └── BackgroundRemover.vue
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.vue
│   │   │   │   ├── SignupForm.vue
│   │   │   │   └── UserProfile.vue
│   │   │   ├── common/
│   │   │   │   ├── Header.vue
│   │   │   │   ├── Footer.vue
│   │   │   │   └── Navbar.vue
│   │   │   └── layout/
│   │   │       ├── ToolLayout.vue
│   │   │       └── DragDropZone.vue
│   │   ├── pages/
│   │   │   ├── Home.vue (landing with 2-3 featured tools)
│   │   │   ├── Products.vue (catalog of all tools by category)
│   │   │   ├── Tools/
│   │   │   │   ├── Converter.vue
│   │   │   │   ├── Compressor.vue
│   │   │   │   ├── TextTool.vue
│   │   │   │   └── BackgroundRemover.vue
│   │   │   ├── Dashboard.vue (logged-in user dashboard)
│   │   │   └── NotFound.vue
│   │   ├── services/
│   │   │   ├── supabaseAuth.js (Supabase auth logic)
│   │   │   ├── imageProcessing.js (Canvas operations)
│   │   │   └── api.js (API calls to backend)
│   │   ├── stores/ (Pinia state management)
│   │   │   ├── authStore.js (user auth state)
│   │   │   └── toolStore.js (tool history, settings)
│   │   ├── utils/
│   │   │   ├── animations.js (GSAP animation helpers)
│   │   │   └── validators.js (form validation)
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   └── package.json
│
├── /wordpress (Blog + payments - stays on existing host)
│   ├── wp-content/plugins/
│   │   └── creativai-supabase-bridge/
│   │       ├── creativai-supabase-bridge.php (main plugin)
│   │       ├── includes/
│   │       │   ├── class-supabase-webhook.php
│   │       │   └── class-user-sync.php
│   │       └── templates/
│   │           └── dashboard.php
│   ├── wp-content/themes/
│   │   └── creativai-child-theme/
│   │       ├── functions.php (enqueue scripts, WooCommerce integration)
│   │       ├── template-parts/
│   │       │   ├── header.php
│   │       │   ├── footer.php
│   │       │   └── blog-card.php
│   │       └── style.css
│   └── [existing WordPress files]
│
├── /backend (Edge Functions + Webhooks - optional, use Supabase Edge Functions)
│   ├── functions/
│   │   ├── webhook-user-sync.js (Supabase → WordPress sync)
│   │   └── payment-callback.js (Stripe webhook handler)
│   └── supabase/
│       └── functions/ (deployed to Supabase)
│
└── /docs
    ├── API-REFERENCE.md
    ├── DEPLOYMENT-GUIDE.md
    └── DATABASE-SCHEMA.md
```

---

## SECTION 2: TECHNOLOGY DECISION TABLE

| Component | Technology | Why | Cost | Scalability |
|-----------|-----------|-----|------|-------------|
| **Frontend** | Vue 3 | Component reusability, progressive framework | $0 | Excellent |
| **Styling** | TailwindCSS | Responsive utilities, mobile-first | $0 | Excellent |
| **Animation** | GSAP | Timeline control, performance | $0 | Excellent |
| **Database** | Supabase (PostgreSQL) | Relational, built-in auth, REST API | $0-25/mo | Excellent |
| **Auth** | Supabase Auth | JWT-based, passwordless, no passwords | $0 | Excellent |
| **Payment** | Stripe + WooCommerce | Industry standard, subscriptions | Transaction fees | Excellent |
| **Frontend Hosting** | Vercel/Netlify | Git-based deployment, free tier | $0-20/mo | Excellent |
| **Backend** | Supabase Edge Functions | Serverless, no management | $0-5/mo | Excellent |
| **WordPress Blog** | Existing host | Already running | Current cost | Good |
| **Image Processing** | Canvas API + WASM | Browser-side, $0 servers | $0 | Good (limited by browser) |

**Total Monthly Cost: $0-50** (mostly WordPress hosting)

---

## SECTION 3: DATABASE SCHEMA (Supabase/PostgreSQL)

```sql
-- Users table (automatically created by Supabase Auth)
-- id (UUID, auto), email, created_at, updated_at

-- User profiles (additional user data)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username VARCHAR(50) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pro, premium
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tool usage history (for user dashboard)
CREATE TABLE tool_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name VARCHAR(100), -- 'compressor', 'converter', 'text_tool', 'bg_remover'
  file_size_before INT,
  file_size_after INT,
  processing_time_ms INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saved presets (for user tool preferences)
CREATE TABLE tool_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name VARCHAR(100),
  preset_name VARCHAR(255),
  settings JSONB, -- {quality: 80, format: 'jpg', ...}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscription/Payment records (synced from Stripe)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  plan_name VARCHAR(100),
  status VARCHAR(50), -- 'active', 'cancelled', 'past_due'
  current_period_start DATE,
  current_period_end DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only see their own data)
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view own tool usage"
  ON tool_usage FOR SELECT
  USING (auth.uid() = user_id);

-- Add similar policies for other tables...
```

---

## SECTION 4: RESPONSIVE DESIGN REQUIREMENTS (Mobile-First)

### Breakpoints (TailwindCSS defaults):
- **sm**: 640px (tablets)
- **md**: 768px (tablets, small laptops)
- **lg**: 1024px (laptops)
- **xl**: 1280px (desktops)
- **2xl**: 1536px (large screens)

### Mobile-First Responsive Strategy:

```
Base (mobile, <640px):
├── Single column layouts
├── Full-width buttons
├── Stack all elements vertically
└── Touch-friendly spacing (min 44px tap targets)

Tablet (sm, 640px+):
├── Two-column layouts where appropriate
├── Inline controls
└── Optimized spacing

Desktop (lg, 1024px+):
├── Three-column grid for tool categories
├── Sidebar navigation
└── Wider preview panes

Large Desktop (xl, 1280px+):
├── Four-column layouts
├── Multiple tools side-by-side
└── Advanced filters visible
```

### Responsive Implementation Pattern (in every component):

```vue
<!-- Example: Tool container responsive layout -->
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
    <!-- Base: 1 column (mobile) -->
    <!-- md: 2 columns (tablets) -->
    <!-- lg: 3 columns (desktops) -->
  </div>
</template>
```

### MUST TEST ON:
- iPhone SE (375px)
- iPhone 12 (390px)
- Samsung Galaxy S21 (360px)
- iPad (768px)
- iPad Pro (1024px)
- MacBook Air (1440px)
- 4K Monitor (3840px)

---

## SECTION 5: ANIMATIONS SPECIFICATION

### Animation Categories (GSAP):

**Category 1: Page Transitions (ScrollTrigger)**
- Tools fade in as user scrolls
- Categories slide in from left/right
- Parallax background movement on hero

**Category 2: Micro-interactions (GSAP.to())**
- Hover effects on buttons (scale, color)
- Tool card hover animations (shadow, lift)
- Icon animations on tool cards

**Category 3: Form Interactions (GSAP.timeline())**
- Input field focus animations (border glow)
- Form submit button animation (loading state)
- Success notification slides in

**Category 4: Drag & Drop Animations**
- File drag-over area highlights (scale, color)
- Upload progress animation (width increase)
- File preview animation (fade in, scale)

**Category 5: Tool Processing Animations**
- Processing spinner (rotation)
- Progress bar (width, color change)
- Result preview fade-in

### Animation Performance Requirements:
- 60 FPS on mobile devices (test on real phones)
- Max animation duration: 500ms (don't make users wait)
- GPU acceleration enabled (will-change CSS property)
- Disable animations on low-end devices (prefers-reduced-motion)

### GSAP Implementation Pattern:

```javascript
// In utils/animations.js
export const animateButtonHover = (element) => {
  gsap.to(element, {
    scale: 1.05,
    duration: 0.3,
    ease: "power2.out"
  });
};

export const animateFileUpload = (element) => {
  return gsap.timeline()
    .to(element, { opacity: 1, duration: 0.3 })
    .to(element, { y: -10, duration: 0.2 }, 0)
    .to(element, { scale: 1.02, duration: 0.2 }, 0);
};
```

---

## SECTION 6: AUTHENTICATION FLOW

### User Authentication System:

```
User signup/login flow:
1. User enters email on SignupForm.vue
2. Supabase sends passwordless link to email
3. User clicks link, gets JWT token
4. Frontend stores JWT in localStorage
5. Frontend auto-logs in on page reload
6. Protected routes check JWT validity
7. API calls include JWT in Authorization header

No passwords stored anywhere = maximum security
```

### Implementation:

**Step 1: Supabase Auth Configuration**
- Enable "Email" provider (no password)
- Set email redirect URL to: `https://creativaiagency.com/auth/callback`

**Step 2: Frontend Auth Service**
```javascript
// services/supabaseAuth.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY'
)

export const signUp = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: 'https://creativaiagency.com/auth/callback',
    },
  })
  return { data, error }
}

export const checkUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

**Step 3: Protected Routes (Vue Router)**
```javascript
// router/index.js
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const user = useAuthStore().user
  
  if (requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})
```

### Required Pages:
- `/auth/login` - Email entry form
- `/auth/signup` - Email entry form (same as login, redirects)
- `/auth/callback` - Handles email link redirect
- `/dashboard` - User dashboard (protected route)

---

## SECTION 7: WORDPRESS INTEGRATION (Blog + Payments)

### WordPress Plugin: Supabase Bridge

This plugin syncs Supabase users to WordPress for blog comments and payment tracking.

```php
<?php
/**
 * Plugin Name: CreatiVAI Supabase Bridge
 * Description: Sync Supabase users to WordPress for blog integration
 * Version: 1.0
 */

// When Supabase user is created, webhook calls this:
add_action('rest_api_init', function() {
  register_rest_route('creativai/v1', '/user-sync', array(
    'methods' => 'POST',
    'callback' => 'creativai_sync_user_to_wordpress',
    'permission_callback' => 'verify_supabase_webhook'
  ));
});

function creativai_sync_user_to_wordpress($request) {
  $data = $request->get_json_params();
  $user_email = $data['email'];
  $supabase_id = $data['id'];
  
  // Check if WordPress user exists
  $wp_user = get_user_by('email', $user_email);
  
  if (!$wp_user) {
    // Create WordPress user (no password, can't login directly)
    wp_create_user(
      sanitize_user($user_email),
      wp_generate_password(16, false),
      $user_email
    );
  }
  
  // Store Supabase ID in user meta for reference
  update_user_meta($wp_user->ID, 'supabase_id', $supabase_id);
  
  return new WP_REST_Response('User synced', 200);
}

function verify_supabase_webhook($request) {
  $token = $request->get_header('X-Supabase-Webhook-Signature');
  // Verify token matches Supabase webhook secret
  return true; // Simplified, add real verification
}
?>
```

### WordPress Setup:
1. Install WooCommerce plugin
2. Install Stripe Payment Gateway plugin
3. Create custom plugin (creativai-supabase-bridge) above
4. Add Supabase webhook to call WordPress API on new user signup

### WooCommerce + Stripe Setup:
- Digital product: "Pro Membership ($4.99/month)"
- Stripe integration handles recurring payments
- WordPress stores payment records in wp_posts with order type

---

## SECTION 8: STEP-BY-STEP BUILD PHASES

### PHASE 1: FOUNDATION (Week 1-2) - Cursor: Start Here
**Deliverables:**
- Vue 3 + TailwindCSS project structure
- Responsive mobile-first layout
- Navigation/Header/Footer components
- Authentication pages (no functionality yet, just UI)

**Cursor Instructions (Phase 1):**

```
TASK 1: Initialize Vue 3 + TailwindCSS Project
- Create new Vue 3 project: npm create vite@latest creativai-frontend -- --template vue
- Install dependencies: npm install
- Install TailwindCSS: npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p
- Configure tailwind.config.js with custom colors for CreatiVAI brand
- Create folder structure: /src/components, /src/pages, /src/services, /src/stores, /src/utils
- Test: npm run dev (should show blank Vue app)

TASK 2: Build Responsive Navigation Component
- Create /src/components/common/Navbar.vue
- Mobile-first: hamburger menu on small screens
- Desktop: horizontal navigation menu on lg screens
- Include: Logo, Nav links (Home, Products, Blog, Dashboard), User menu
- Responsive breakpoints: sm:hidden (hide hamburger), lg:block (show horizontal menu)
- Use TailwindCSS classes for all styling (NO custom CSS)

TASK 3: Build Mobile-First Layout System
- Create /src/components/layout/MainLayout.vue
- Responsive container: max-w-7xl mx-auto px-4 md:px-6 lg:px-8
- Grid for Products page: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Test on mobile (375px), tablet (768px), desktop (1280px)
- Verify all text is readable on mobile without horizontal scroll

TASK 4: Build Authentication UI (No Backend Yet)
- Create /src/pages/auth/LoginPage.vue
- Email input field with validation UI
- "Send Link" button
- Success message placeholder (will connect later)
- Create /src/pages/auth/CallbackPage.vue
- Simple loading state while processing redirect
- Redirect to /dashboard after auth

TASK 5: Build Home Page Layout
- Create /src/pages/Home.vue
- Hero section (responsive text, CTA button)
- 2-3 featured tool cards (responsive grid)
- Features section
- Footer with links
- Test responsiveness on 5 different device sizes
```

**Expected Output After Phase 1:**
- Working Vue 3 app with responsive navigation
- 4 basic pages (Home, Products, Login, Dashboard) - structure only, no functionality
- Mobile, tablet, and desktop layouts working
- All text readable on smallest screen (375px)

---

### PHASE 2: IMAGE TOOLS (Week 3-4) - Cursor: Build First Tool

**Deliverables:**
- 4 working image processing tools
- Canvas API image processing
- Real-time preview
- Download functionality

**Cursor Instructions (Phase 2):**

```
TASK 1: Build Image Converter Tool Component
- Create /src/components/tools/ImageConverter.vue
- Drag-drop upload area (with animation on hover)
- Format selection: PNG, JPG, WebP
- Real-time preview (before/after split view)
- Quality slider (for lossy formats)
- Download button (triggers Canvas export)
- Canvas implementation:
  - Use Canvas.toDataURL('image/jpeg') for conversion
  - Use Canvas.toBlob() for efficient blob creation
  - Set filename based on selected format
- Use utils/animations.js for drag-drop hover animation
- Responsive: single column on mobile, two columns on desktop (preview side-by-side)

TASK 2: Build Image Compressor Tool Component
- Create /src/components/tools/ImageCompressor.vue
- Similar drag-drop upload to converter
- Quality slider (1-100)
- Real-time file size preview (showing savings %)
- Before/after preview
- Download compressed image
- Canvas implementation:
  - Use Canvas.getContext('2d').drawImage()
  - Use Canvas.toBlob(callback, 'image/jpeg', quality)
  - Loop through quality levels to find optimal compression

TASK 3: Build Add Text to Image Tool
- Create /src/components/tools/AddText.vue
- Drag-drop image upload
- Text input field
- Font size slider
- Color picker
- Position controls (X, Y coordinates)
- Font selection dropdown
- Canvas implementation:
  - Use context.fillText() for text rendering
  - Handle text wrapping for long strings
  - Add text layer on top of image
  - Export final image with text overlay

TASK 4: Build Background Remover Tool (API Version)
- Create /src/components/tools/BackgroundRemover.vue
- Drag-drop upload
- API integration placeholder (will use remove.bg API)
- Loading state while processing
- Preview with removed background
- Download button
- Add API key management to Supabase

TASK 5: Create Shared Drag-Drop Component
- Create /src/components/layout/DragDropZone.vue
- Reusable component for all tools
- Accept file drop, show preview
- Size validation (warn if >50MB)
- File type validation (only images)
- Use GSAP for hover animations (scale, color change)

TASK 6: Build Tool Page Template
- Create /src/pages/tools/ToolPage.vue (generic template)
- Tool title and description
- Drag-drop zone
- Settings/controls panel
- Preview area (before/after)
- Download button
- Mobile responsive: full width on mobile, 2-column on desktop

TASK 7: Create Image Processing Utils
- Create /src/utils/imageProcessing.js
- Function: compressImage(file, quality)
- Function: convertFormat(file, targetFormat)
- Function: addTextToImage(imageData, textConfig)
- Function: removeBackground(imageData) - placeholder
- All functions return Promise with blob result
```

**Expected Output After Phase 2:**
- 4 working image tools
- All tools have drag-drop, preview, and download
- Tools are responsive (tested on 3 screen sizes)
- All image processing happens in browser (no server uploads)

---

### PHASE 3: AUTHENTICATION (Week 5) - Cursor: Connect to Supabase

**Deliverables:**
- Supabase auth integration
- Protected routes
- User dashboard
- Login/signup flow

**Cursor Instructions (Phase 3):**

```
TASK 1: Setup Supabase Client
- Create /src/services/supabaseAuth.js
- Initialize Supabase client:
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
- Store SUPABASE_URL and SUPABASE_ANON_KEY in .env.local
- Create function: signUpWithEmail(email)
  - Call supabase.auth.signInWithOtp({email})
- Create function: checkUser()
  - Call supabase.auth.getUser()
- Create function: logOut()
  - Call supabase.auth.signOut()

TASK 2: Create Pinia Auth Store
- Create /src/stores/authStore.js using Pinia
- State: user (null or user object), loading, error
- Actions:
  - signUp(email) - calls supabaseAuth.signUpWithEmail
  - checkAuth() - calls supabaseAuth.checkUser
  - logout() - calls supabaseAuth.logOut
- Getters: isAuthenticated

TASK 3: Implement Protected Routes
- Create /src/router/index.js with Vue Router
- Routes:
  - / (Home) - public
  - /products - public
  - /tools/* - public
  - /blog - public
  - /auth/login - public
  - /auth/callback - public (handles redirect)
  - /dashboard - protected (requires auth)
- Route guard: beforeEach checks isAuthenticated
- Redirect to /auth/login if not authenticated

TASK 4: Build Callback Handler
- Create /src/pages/auth/CallbackPage.vue
- Intercepts redirect from Supabase email link
- Extract session/token from URL
- Show loading spinner
- Auto-redirect to /dashboard on success
- Handle errors (show error message)

TASK 5: Connect Login Form to Supabase
- Update /src/pages/auth/LoginPage.vue
- Add form submission handler
- Call authStore.signUp(email)
- Show success message: "Check your email for login link"
- Handle errors (email already used, network error, etc.)

TASK 6: Build User Dashboard
- Create /src/pages/Dashboard.vue (protected route)
- Display user email
- Show user profile form (name, avatar)
- List subscription status
- Logout button
- Link to manage account settings

TASK 7: Add Auth Check on App Load
- Update /src/App.vue
- In onMounted, call authStore.checkAuth()
- If session exists, auto-restore user login
- Show loading spinner during check
```

**Expected Output After Phase 3:**
- Complete auth flow working
- Users can sign up with email
- Users receive login link in email
- Protected routes work
- User dashboard displays correctly

---

### PHASE 4: WORDPRESS INTEGRATION (Week 6) - Cursor: Connect Blog

**Deliverables:**
- WordPress Supabase bridge plugin
- Blog page with posts
- User sync from Supabase to WordPress
- Payment integration setup

**Cursor Instructions (Phase 4):**

```
TASK 1: Create WordPress Supabase Bridge Plugin
- Create /wordpress/wp-content/plugins/creativai-supabase-bridge/
- File: creativai-supabase-bridge.php (main plugin)
- Plugin header with Name, Description, Version
- Enqueue custom CSS/JS if needed
- Register custom REST endpoint: /creativai/v1/user-sync

TASK 2: Implement User Sync Webhook
- Add webhook handler in bridge plugin
- When Supabase user signs up, webhook POSTs to WordPress
- WordPress creates corresponding user in wp_users table
- Store Supabase ID in user_meta for reference
- Verify webhook signature for security

TASK 3: Configure Supabase Webhook
- In Supabase dashboard, create webhook for auth.users table
- Event: Insert
- HTTP endpoint: https://yourwordpresssite.com/wp-json/creativai/v1/user-sync
- Custom headers: X-Supabase-Webhook-Signature: [secret]

TASK 4: Build Blog Page Component
- Create /src/pages/Blog.vue
- Fetch latest blog posts from WordPress REST API
- Display post title, excerpt, date, author
- Responsive grid: 1 column mobile, 3 columns desktop
- Link to full post on WordPress blog
- Use WP REST API: GET /wp-json/wp/v2/posts

TASK 5: Setup WooCommerce + Stripe
- In WordPress dashboard, install WooCommerce plugin
- Install Stripe Payment Gateway plugin
- Connect Stripe account
- Create digital product: "Pro Membership ($4.99/month)"
- Configure Stripe Webhook: subscribe to customer.subscription.* events
- Webhook URL: https://yourwordpresssite.com/[webhook-receiver]

TASK 6: Create Pricing Page
- Create /src/pages/Pricing.vue
- Display pricing tiers: Free, Pro, Premium
- Features per tier
- "Subscribe Now" button links to Stripe Checkout
- On successful payment, Stripe webhook updates Supabase subscription table

TASK 7: Add Subscription Check in Dashboard
- Update /src/pages/Dashboard.vue
- Fetch user subscription from Supabase
- Display current plan
- Link to upgrade plan
- Disable premium features for free users
```

**Expected Output After Phase 4:**
- WordPress plugin syncing Supabase users
- Blog posts display in Vue app
- Pricing page working
- Stripe integration ready for subscriptions

---

### PHASE 5: ANIMATIONS & POLISH (Week 7-8) - Cursor: Add GSAP

**Deliverables:**
- Page transition animations
- Scroll-triggered animations
- Micro-interactions on all UI elements
- Optimized performance (60 FPS)

**Cursor Instructions (Phase 5):**

```
TASK 1: Setup GSAP Library
- npm install gsap
- Create /src/utils/gsapAnimations.js
- Import: gsap, ScrollTrigger plugin
- gsap.registerPlugin(ScrollTrigger)
- Configure defaults:
  gsap.defaults({duration: 0.3, ease: "power2.out"})

TASK 2: Implement Page Entrance Animations
- Hero section fades in on page load
- Tools cards stagger fade-in (100ms delay between each)
- Features section slides in from bottom
- Use ScrollTrigger for scroll-based animations
- Test on mobile: animations still smooth at 60 FPS

TASK 3: Add Hover Animations to UI Elements
- Tool cards: scale 1.05 on hover, shadow increase
- Buttons: scale 1.05, color transition on hover
- Links: underline animation (width increase)
- All animations use utils/gsapAnimations.js functions
- Disable animations on touch devices (mobile has no hover)

TASK 4: Animate Drag-Drop Zone
- File hover: scale 1.02, border glow, background color change
- File drop: brief pulse animation
- Use timeline for sequenced animations

TASK 5: Add Tool Processing Animations
- Upload progress: bar fills from 0-100%
- Processing spinner: continuous rotation (no end)
- Result preview: fade in + slide up animation
- Success checkmark: scale bounce animation

TASK 6: Implement Form Animations
- Input focus: bottom border expands with color change
- Form error: shake animation (left-right)
- Form success: checkmark animation
- Use GSAP timeline for coordinated sequences

TASK 7: Add Scroll-Triggered Animations
- Tool cards appear as user scrolls (fade + slide)
- Numbers count up when visible ("1000+ users")
- Use ScrollTrigger for viewport-based triggers
- Performance: use will-change CSS property

TASK 8: Performance Optimization
- Disable complex animations on low-end devices
- Use CSS transforms only (no layout thrashing)
- Test 60 FPS on mobile device (iPhone SE, Android budget phone)
- Profile in Chrome DevTools: Performance tab
- Remove animations that cause frame drops
```

**Expected Output After Phase 5:**
- Smooth animations throughout app
- All animations 60 FPS tested
- Scroll-triggered animations working
- Micro-interactions enhance UX
- No jank or stuttering on mobile

---

### PHASE 6: TESTING & DEPLOYMENT (Week 9) - Cursor: Test & Deploy

**Deliverables:**
- Fully tested app
- Deployed to Vercel
- Production-ready code

**Cursor Instructions (Phase 6):**

```
TASK 1: Responsive Design Testing
- Test on: iPhone SE (375px), iPad (768px), MacBook (1440px), 4K (3840px)
- Check: No horizontal scrolling on mobile
- Check: Text readable (min 16px on mobile)
- Check: Buttons tappable (min 44px touch target)
- Check: Images load quickly on 3G connection
- Use Chrome DevTools Device Emulation
- Use real mobile devices for final test

TASK 2: Animation Performance Testing
- Chrome DevTools → Performance tab
- Record interaction while scrolling, using tools
- Check: FPS stays above 55 (60 is ideal)
- Check: Frame rendering time < 16ms
- Remove any animations causing dropped frames
- Test on budget Android phone (most critical)

TASK 3: Authentication Flow Testing
- Sign up with email
- Check email receives login link
- Click link, verify auto-login
- Check /dashboard loads and shows user info
- Test logout
- Verify protected routes block unauth users

TASK 4: Tool Functionality Testing
- Test each tool with various file types and sizes
- Verify preview updates in real-time
- Verify download creates correct file
- Test on both desktop and mobile
- Test file size validation (warn >50MB)
- Test drag-drop on mobile (touch event)

TASK 5: Cross-Browser Testing
- Chrome, Firefox, Safari, Edge
- Check: All animations work
- Check: All buttons clickable
- Check: Forms accept input
- Check: No console errors
- Use BrowserStack for old browsers if needed

TASK 6: Accessibility Testing
- Check: Color contrast sufficient (WCAG AA)
- Check: Keyboard navigation works (Tab key)
- Check: Forms have labels (for screen readers)
- Check: Images have alt text
- Use axe DevTools browser extension

TASK 7: Build for Production
- npm run build (creates /dist folder)
- Verify build size: target < 500KB gzipped
- Check: No console warnings in production
- Source maps enabled for debugging

TASK 8: Deploy to Vercel
- Create account on vercel.com
- Connect GitHub repo
- Set environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
- Click Deploy
- Verify deployed app works at https://creativaiagency.com
- Test all features on production domain
```

**Expected Output After Phase 6:**
- Production-ready app deployed
- All features working across devices/browsers
- Performance optimized (60 FPS)
- Accessibility compliant

---

## SECTION 9: CURSOR PROMPT TEMPLATE

When giving instructions to Cursor, use this exact format:

```
TASK [NUMBER]: [SHORT TITLE]

FILE PATH: [exact path where file goes]

REQUIREMENTS:
- Requirement 1
- Requirement 2
- Requirement 3

CODE STYLE:
- Use Vue 3 Composition API (not Options API)
- Use TailwindCSS for all styling (no custom CSS files)
- Use ESM imports (import X from 'Y')
- Add TypeScript JSDoc comments for functions
- Components must be responsive mobile-first

TESTING:
- Test on mobile (375px), tablet (768px), desktop (1280px)
- [Specific test case]
- [Specific test case]

OUTPUT:
- [Specific expected result]
- [Specific expected result]
```

---

## SECTION 10: SCALABILITY & FUTURE FEATURES

### Phase 7 (Month 3-4): Additional Tools
- AI Image Upscaler (TensorFlow.js)
- Batch processing (process 5+ images)
- QR code generator
- SVG to PNG converter
- Image filters (brightness, contrast, saturation)

### Phase 8 (Month 5-6): Advanced Features
- Email newsletter signup (Supabase emails)
- Tool templates/presets
- File storage (save converted images for 24 hours)
- Team collaboration (invite users to project)
- API for developers (programmatic access)

### Phase 9 (Year 2): Enterprise Features
- Advanced analytics (see which tools users love)
- White-label version (resell for agencies)
- Mobile app (React Native)
- Offline mode (Progressive Web App)
- Enterprise SSO (SAML, OAuth)

### Architecture Allows Easy Scaling:
- Vue components: Add new tool = one new component
- Supabase database: Add new tables without affecting existing code
- Stripe: Add new subscription tiers without code changes
- Static hosting on Vercel: Auto-scales to unlimited users ($0 cost)
- Browser-side processing: No server load = infinite scalability

---

## SECTION 11: ENVIRONMENT VARIABLES (.env.local)

```
# Supabase
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key]

# Stripe
VITE_STRIPE_PUBLIC_KEY=pk_live_[your-public-key]

# Remove.bg API (for background remover - optional for Phase 1)
VITE_REMOVEBG_API_KEY=[your-api-key]

# WordPress
VITE_WORDPRESS_API_URL=https://creativaiagency.com/wp-json

# Firebase (optional, for future analytics)
VITE_FIREBASE_PROJECT_ID=[optional]
```

---

## SECTION 12: DEPLOYMENT CHECKLIST

Before launching to production:

**Code Quality:**
- [ ] No console.log() left in code (except logging service)
- [ ] No hardcoded API keys or secrets
- [ ] All components have proper error handling
- [ ] All async operations have loading/error states
- [ ] No unused imports or dead code

**Performance:**
- [ ] Build size < 500KB gzipped
- [ ] LightHouse score >= 85 (Performance)
- [ ] First Contentful Paint (FCP) < 2 seconds
- [ ] Largest Contentful Paint (LCP) < 2.5 seconds

**Security:**
- [ ] HTTPS enabled
- [ ] Content Security Policy (CSP) headers set
- [ ] CORS properly configured
- [ ] User data encrypted in transit
- [ ] Supabase Row Level Security (RLS) enabled

**Accessibility:**
- [ ] WCAG 2.1 AA compliant
- [ ] axe DevTools reports 0 violations
- [ ] Keyboard navigation works completely
- [ ] Screen reader compatible

**Testing:**
- [ ] Tested on 5 different device sizes
- [ ] Tested on 4 different browsers
- [ ] All features tested on production domain
- [ ] Authentication flow tested end-to-end
- [ ] Payment flow tested with Stripe test mode

---

## SECTION 13: SUPPORT & MAINTENANCE

### Monthly Maintenance:
- Update npm dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`
- Monitor Supabase usage (free tier limits)
- Monitor Vercel bandwidth usage
- Review analytics: which tools are most used

### Common Issues & Fixes:
- **Tool not loading on mobile**: Check responsive breakpoints
- **Animation stuttering**: Disable animation, check DevTools Performance tab
- **Auth not working**: Check Supabase email redirect URL configured
- **File download failing**: Check CORS headers on image URL
- **Database full**: Clean up old tool_usage records monthly

---

## FINAL RECOMMENDATION

**Start Phase 1 TODAY (this week):**
1. Create Vue 3 project
2. Install TailwindCSS
3. Build Navbar component
4. Test responsive on mobile

**By end of Phase 1 (2 weeks):**
- You have shell of app
- You understand Vue 3 component structure
- You're comfortable with TailwindCSS responsive classes

**By end of Phase 2 (4 weeks):**
- You have 4 working tools
- Users can process images immediately
- No auth required yet (launch and get initial users)

**By end of Phase 3 (5 weeks):**
- Authentication working
- Users create accounts
- Ready for monetization

**By end of Phase 6 (9 weeks):**
- Full production app
- Deployed on Vercel
- Ready to market

**Total Timeline: 9 weeks (~ 2 months) to production with high quality**

---

## QUICK START - COPY & PASTE

```bash
# Week 1, Day 1 - Get started now:

# Create project
npm create vite@latest creativai-frontend -- --template vue
cd creativai-frontend

# Install dependencies
npm install
npm install -D tailwindcss postcss autoprefixer
npm install pinia vue-router @supabase/supabase-js gsap

# Setup Tailwind
npx tailwindcss init -p

# Create folder structure
mkdir -p src/components/{common,tools,layout}
mkdir -p src/pages/auth
mkdir -p src/pages/tools
mkdir -p src/services
mkdir -p src/stores
mkdir -p src/utils

# Start development
npm run dev

# Now: Give Cursor the Phase 1, Task 1 instruction above
```

That's it. You're ready to start building. Every subsequent phase just adds more features—the core structure never changes.

Good luck! 🚀

---

**Document Version**: 1.0
**Last Updated**: November 7, 2025
**For Use With**: Cursor AI Code Editor
**Target Deployment**: Vercel (frontend) + Existing WordPress host (blog)
