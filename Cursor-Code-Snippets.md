# CreatiVAI Agency - Quick Reference Guide & Code Snippets
## For Cursor Implementation

---

## PART 1: RESPONSIVE DESIGN QUICK REFERENCE

### TailwindCSS Breakpoints (Mobile-First):
```
Default (mobile): <640px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Common Responsive Patterns:

**Pattern 1: Grid Layout**
```html
<!-- 1 column mobile, 2 columns tablet, 3 columns desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>
```

**Pattern 2: Hidden/Visible on Breakpoints**
```html
<!-- Hide on mobile, show on tablet+ -->
<div class="hidden md:block">Desktop only content</div>

<!-- Show on mobile, hide on desktop -->
<div class="md:hidden">Mobile only content</div>
```

**Pattern 3: Text Responsive**
```html
<!-- Base: small text, md: medium, lg: large -->
<h1 class="text-2xl md:text-3xl lg:text-4xl">Responsive Heading</h1>
```

**Pattern 4: Spacing Responsive**
```html
<!-- Base: p-4 (1rem), md: p-6 (1.5rem), lg: p-8 (2rem) -->
<div class="p-4 md:p-6 lg:p-8">Responsive padding</div>
```

**Pattern 5: Flex Direction**
```html
<!-- Stack vertical on mobile, horizontal on desktop -->
<div class="flex flex-col lg:flex-row gap-4">
  <div class="flex-1">Item 1</div>
  <div class="flex-1">Item 2</div>
</div>
```

### Testing Checklist:
- [ ] 375px (iPhone SE) - single column, readable
- [ ] 768px (iPad) - two columns, good spacing
- [ ] 1024px (Small laptop) - three columns
- [ ] 1440px (Desktop) - full width, not stretched
- [ ] 3840px (4K) - proper max-width container

---

## PART 2: GSAP ANIMATION CODE SNIPPETS

### Animation Utilities (Save to /src/utils/gsapAnimations.js):

```javascript
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// 1. HOVER ANIMATIONS
export const setupHoverAnimation = (selector) => {
  const elements = document.querySelectorAll(selector)
  elements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      gsap.to(el, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })
}

// 2. SCROLL TRIGGER ANIMATION
export const setupScrollAnimation = (selector, animation) => {
  gsap.utils.toArray(selector).forEach((element) => {
    gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(element, animation)
        }
      }
    })
  })
}

// 3. STAGGERED ANIMATION
export const staggerAnimation = (selector, staggerDelay = 0.1) => {
  gsap.to(selector, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: staggerDelay,
    ease: 'power2.out'
  })
}

// 4. TIMELINE ANIMATION
export const createTimeline = () => {
  return gsap.timeline()
}

// 5. PULSE ANIMATION
export const pulseAnimation = (element) => {
  const tl = gsap.timeline({ repeat: -1 })
  tl.to(element, {
    scale: 1.05,
    duration: 0.5,
    ease: 'power2.inOut'
  })
  .to(element, {
    scale: 1,
    duration: 0.5,
    ease: 'power2.inOut'
  })
  return tl
}

// 6. LOADING SPINNER
export const spinnerAnimation = (element) => {
  gsap.to(element, {
    rotation: 360,
    duration: 2,
    repeat: -1,
    ease: 'linear'
  })
}

// 7. SHAKE ANIMATION (for errors)
export const shakeAnimation = (element) => {
  const tl = gsap.timeline()
  tl.to(element, {
    x: -10,
    duration: 0.05
  })
  .to(element, {
    x: 10,
    duration: 0.05
  }, 0.05)
  .to(element, {
    x: -10,
    duration: 0.05
  }, 0.1)
  .to(element, {
    x: 0,
    duration: 0.05
  }, 0.15)
  return tl
}

// 8. SLIDE IN ANIMATION
export const slideInAnimation = (element, direction = 'left') => {
  const fromX = direction === 'left' ? -100 : 100
  gsap.from(element, {
    x: fromX,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out'
  })
}

// 9. FADE IN ANIMATION
export const fadeInAnimation = (element, delay = 0) => {
  gsap.from(element, {
    opacity: 0,
    duration: 0.6,
    delay: delay,
    ease: 'power2.out'
  })
}

// 10. COUNTER ANIMATION (for stats)
export const counterAnimation = (element, startValue, endValue, duration = 2) => {
  const obj = { value: startValue }
  gsap.to(obj, {
    value: endValue,
    duration: duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.ceil(obj.value)
    }
  })
}
```

### Usage in Vue Component:

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { setupHoverAnimation, pulseAnimation } from '@/utils/gsapAnimations'

const uploadArea = ref(null)
const spinner = ref(null)

onMounted(() => {
  // Animate card hovers
  setupHoverAnimation('.tool-card')
  
  // Animate spinner
  pulseAnimation(spinner.value)
  
  // Setup hover on upload area
  uploadArea.value.addEventListener('dragover', () => {
    gsap.to(uploadArea.value, {
      scale: 1.02,
      borderColor: '#3B82F6',
      backgroundColor: '#F0F7FF'
    })
  })
})
</script>

<template>
  <div 
    ref="uploadArea"
    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
  >
    <div ref="spinner" class="inline-block">
      🌀 Processing...
    </div>
  </div>
</template>
```

---

## PART 3: VUE 3 COMPOSITION API SNIPPETS

### Component Template Structure:

```vue
<script setup>
// Imports
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/stores/someStore'

// Router & Stores
const router = useRouter()
const store = useStore()

// State
const isLoading = ref(false)
const userData = ref(null)
const error = ref(null)

// Computed
const isFormValid = computed(() => {
  return userData.value?.name && userData.value?.email
})

// Methods
const handleSubmit = async () => {
  isLoading.value = true
  try {
    await store.updateUser(userData.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Fetch data on component mount
  userData.value = store.currentUser
})

// Watchers
watch(
  () => store.currentUser,
  (newUser) => {
    userData.value = newUser
  }
)
</script>

<template>
  <div class="container">
    <!-- Error Display -->
    <div v-if="error" class="bg-red-100 text-red-700 p-4 rounded">
      {{ error }}
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <input
        v-model="userData.name"
        type="text"
        placeholder="Your name"
        class="w-full px-4 py-2 border rounded"
      />

      <!-- Submit Button -->
      <button
        :disabled="isLoading || !isFormValid"
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {{ isLoading ? 'Saving...' : 'Save Changes' }}
      </button>
    </form>
  </div>
</template>
```

### Composition API Patterns:

**Pattern 1: Fetch Data**
```javascript
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/data')
    data.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
```

**Pattern 2: Form Handling**
```javascript
const form = ref({
  name: '',
  email: '',
  message: ''
})

const errors = ref({})

const validateForm = () => {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Name required'
  if (!form.value.email) errors.value.email = 'Email required'
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  try {
    await submitForm(form.value)
    // Show success
  } catch (err) {
    errors.value.submit = err.message
  }
}
```

**Pattern 3: Reactive State Management**
```javascript
import { reactive, computed } from 'vue'

const state = reactive({
  items: [],
  filter: 'all',
  sortBy: 'date'
})

const filteredItems = computed(() => {
  return state.items
    .filter(item => {
      if (state.filter === 'active') return !item.completed
      if (state.filter === 'completed') return item.completed
      return true
    })
    .sort((a, b) => {
      if (state.sortBy === 'date') return b.date - a.date
      return a.name.localeCompare(b.name)
    })
})
```

---

## PART 4: SUPABASE AUTHENTICATION SETUP

### 1. Initialize Supabase Client:

```javascript
// /src/services/supabaseAuth.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Sign up with email (passwordless)
export const signUpWithEmail = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  return { data, error }
}

// Get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return error
}

// Listen to auth changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}
```

### 2. Create Pinia Auth Store:

```javascript
// /src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  signUpWithEmail, 
  getCurrentUser, 
  signOut, 
  onAuthStateChange 
} from '@/services/supabaseAuth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const signUp = async (email) => {
    loading.value = true
    error.value = null
    const { error: err } = await signUpWithEmail(email)
    if (err) error.value = err.message
    loading.value = false
  }

  const checkUser = async () => {
    loading.value = true
    const currentUser = await getCurrentUser()
    user.value = currentUser
    loading.value = false
  }

  const logout = async () => {
    await signOut()
    user.value = null
  }

  // Setup listener on store initialization
  onAuthStateChange((event, session) => {
    user.value = session?.user || null
  })

  return { user, loading, error, signUp, checkUser, logout }
})
```

### 3. Setup Route Protection:

```javascript
// /src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/auth/login', component: () => import('@/pages/auth/LoginPage.vue') },
  { path: '/auth/callback', component: () => import('@/pages/auth/CallbackPage.vue') },
  { 
    path: '/dashboard', 
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.user) {
    next('/auth/login')
  } else {
    next()
  }
})

export default router
```

---

## PART 5: CANVAS API IMAGE PROCESSING

### Image Compression:

```javascript
// /src/utils/imageProcessing.js
export const compressImage = (file, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob(
          (blob) => resolve(blob),
          'image/jpeg',
          quality
        )
      }
      img.src = event.target.result
    }
    
    reader.readAsDataURL(file)
  })
}
```

### Image Conversion:

```javascript
export const convertImage = (file, targetFormat) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        const mimeType = {
          'jpg': 'image/jpeg',
          'png': 'image/png',
          'webp': 'image/webp'
        }[targetFormat]
        
        canvas.toBlob(resolve, mimeType)
      }
      img.src = event.target.result
    }
    
    reader.readAsDataURL(file)
  })
}
```

### Add Text to Image:

```javascript
export const addTextToImage = (file, text, options = {}) => {
  const {
    fontSize = 40,
    fontFamily = 'Arial',
    color = '#FFFFFF',
    x = 50,
    y = 50,
    opacity = 1
  } = options
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        // Draw text
        ctx.font = `${fontSize}px ${fontFamily}`
        ctx.fillStyle = color
        ctx.globalAlpha = opacity
        ctx.fillText(text, x, y)
        
        canvas.toBlob(resolve, 'image/png')
      }
      img.src = event.target.result
    }
    
    reader.readAsDataURL(file)
  })
}
```

---

## PART 6: DRAG & DROP ZONE COMPONENT

```vue
<!-- /src/components/layout/DragDropZone.vue -->
<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  onFileDrop: Function,
  acceptedFormats: {
    type: Array,
    default: () => ['image/jpeg', 'image/png', 'image/webp']
  },
  maxSizeMB: {
    type: Number,
    default: 50
  }
})

const isDragging = ref(false)
const dropZone = ref(null)

const handleDragOver = (e) => {
  e.preventDefault()
  isDragging.value = true
  gsap.to(dropZone.value, {
    scale: 1.02,
    borderColor: '#3B82F6',
    backgroundColor: '#F0F7FF',
    duration: 0.2
  })
}

const handleDragLeave = () => {
  isDragging.value = false
  gsap.to(dropZone.value, {
    scale: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    duration: 0.2
  })
}

const handleDrop = (e) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = e.dataTransfer.files
  if (files.length > 0) {
    const file = files[0]
    
    // Validate file
    if (!props.acceptedFormats.includes(file.type)) {
      alert('Invalid file format')
      return
    }
    
    if (file.size > props.maxSizeMB * 1024 * 1024) {
      alert(`File too large (max ${props.maxSizeMB}MB)`)
      return
    }
    
    props.onFileDrop(file)
  }
}

const handleFileInput = (e) => {
  const file = e.target.files[0]
  if (file) props.onFileDrop(file)
}
</script>

<template>
  <div
    ref="dropZone"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition"
  >
    <p class="text-gray-600 mb-4">Drag & drop your image here</p>
    <input
      type="file"
      @change="handleFileInput"
      :accept="acceptedFormats.join(',')"
      class="hidden"
      id="file-input"
    />
    <label for="file-input" class="inline-block">
      <button
        type="button"
        class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Or click to select
      </button>
    </label>
  </div>
</template>
```

---

## PART 7: RESPONSIVE NAVIGATION EXAMPLE

```vue
<!-- /src/components/common/Navbar.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="text-2xl font-bold text-blue-600">
          CreatiVAI
        </div>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex space-x-6">
          <router-link to="/" class="hover:text-blue-600">Home</router-link>
          <router-link to="/products" class="hover:text-blue-600">Tools</router-link>
          <router-link to="/blog" class="hover:text-blue-600">Blog</router-link>
          
          <div v-if="authStore.user" class="flex items-center space-x-4">
            <router-link to="/dashboard" class="hover:text-blue-600">
              Dashboard
            </router-link>
            <button
              @click="handleLogout"
              class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
          <div v-else>
            <router-link to="/auth/login" class="bg-blue-600 text-white px-4 py-2 rounded">
              Login
            </router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMenu"
          class="lg:hidden p-2 rounded hover:bg-gray-100"
        >
          ☰
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="lg:hidden pb-4">
        <router-link to="/" class="block py-2 hover:text-blue-600">Home</router-link>
        <router-link to="/products" class="block py-2 hover:text-blue-600">Tools</router-link>
        <router-link to="/blog" class="block py-2 hover:text-blue-600">Blog</router-link>
        <div v-if="authStore.user" class="mt-4 space-y-2">
          <router-link to="/dashboard" class="block py-2 hover:text-blue-600">
            Dashboard
          </router-link>
          <button
            @click="handleLogout"
            class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        <div v-else class="mt-4">
          <router-link to="/auth/login" class="block bg-blue-600 text-white px-4 py-2 rounded text-center">
            Login
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
```

---

## PART 8: ENVIRONMENT VARIABLES (.env.local)

```
# Supabase Configuration
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=[your-anon-key-here]

# Stripe Configuration
VITE_STRIPE_PUBLIC_KEY=pk_live_[your-public-key]

# Remove.bg API (Optional for Phase 1)
VITE_REMOVEBG_API_KEY=[api-key-optional]

# WordPress API
VITE_WORDPRESS_API_URL=https://creativaiagency.com/wp-json

# App URLs
VITE_APP_URL=http://localhost:5173
VITE_CALLBACK_URL=http://localhost:5173/auth/callback
```

---

## PART 9: TESTING COMMANDS

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Test responsive design
# Chrome DevTools → Device Toolbar → Test on different devices

# Lighthouse audit
# Chrome DevTools → Lighthouse → Generate report

# Performance profiling
# Chrome DevTools → Performance → Record and analyze
```

---

## PART 10: COMMON ERRORS & FIXES

### Error: "Supabase client not initialized"
**Fix:** Check .env.local has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### Error: "Images not loading on mobile"
**Fix:** Check responsive classes are correct (test with Chrome DevTools Device Emulation)

### Error: "Animation stuttering on scroll"
**Fix:** Use Chrome DevTools Performance tab to profile, reduce animation complexity

### Error: "File download failing"
**Fix:** Check Canvas.toBlob() is called with correct MIME type

### Error: "Auth not persisting on page reload"
**Fix:** Check LocalStorage not disabled, verify Supabase auth session setup

---

## FINAL CHECKLIST FOR CURSOR PROMPTS

When giving instructions to Cursor, verify you include:
- ✅ FILE PATH (exact location)
- ✅ REQUIREMENTS (specific functionality)
- ✅ CODE STYLE (Vue 3 Composition, TailwindCSS, etc.)
- ✅ TESTING INSTRUCTIONS (how to verify it works)
- ✅ RESPONSIVE REQUIREMENTS (mobile/tablet/desktop)
- ✅ EXPECTED OUTPUT (what should result)

**Example Prompt Format:**
```
TASK: Build Image Converter Tool Component

FILE PATH: /src/components/tools/ImageConverter.vue

REQUIREMENTS:
- Drag-drop file upload with GSAP hover animation
- Format selection dropdown (PNG, JPG, WebP)
- Real-time preview (before/after split view)
- Quality slider (40-100)
- Download button that exports Canvas as file
- Show file size before/after

CODE STYLE:
- Vue 3 Composition API
- All styling with TailwindCSS (no custom CSS)
- Use /src/utils/gsapAnimations.js for hover effects
- Use /src/utils/imageProcessing.js for Canvas operations

RESPONSIVE:
- Mobile (375px): Single column, full-width preview
- Desktop (1024px): Two columns side-by-side preview

TESTING:
- Drag JPEG file, convert to PNG, verify download
- Test quality slider changes file size
- Test on mobile portrait and desktop

EXPECTED OUTPUT:
- File: ImageConverter.vue with complete functionality
- Preview updates in real-time
- Download creates correct file format
- Works on mobile and desktop
```

---

**You're ready to give these instructions to Cursor!**
Start with Phase 1, Task 1 and work through systematically.
Good luck! 🚀
