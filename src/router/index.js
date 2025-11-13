import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/pages/Home.vue'
import Blog from '@/pages/Blog.vue'
import About from '@/pages/About.vue'
import Dashboard from '@/pages/Dashboard.vue'
import ImageOptimizationSuitePage from '@/pages/tools/ImageOptimizationSuitePage.vue'
import ToolsHub from '@/pages/tools/ToolsHub.vue'
import QRCodePage from '@/pages/tools/QRCodePage.vue'
import PasswordGeneratorPage from '@/pages/tools/PasswordGeneratorPage.vue'
import TextCaseConverterPage from '@/pages/tools/TextCaseConverterPage.vue'
import WordCounterPage from '@/pages/tools/WordCounterPage.vue'
import LoremIpsumPage from '@/pages/tools/LoremIpsumPage.vue'
import PercentageCalculatorPage from '@/pages/tools/PercentageCalculatorPage.vue'
import AgeCalculatorPage from '@/pages/tools/AgeCalculatorPage.vue'
import EmiCalculatorPage from '@/pages/tools/EmiCalculatorPage.vue'
import SipCalculatorPage from '@/pages/tools/SipCalculatorPage.vue'
import ProfitCalculatorPage from '@/pages/tools/ProfitCalculatorPage.vue'
import IndexFundCalculatorPage from '@/pages/tools/IndexFundCalculatorPage.vue'
import SignIn from '@/pages/auth/SignIn.vue'
import SignUp from '@/pages/auth/SignUp.vue'
import AuthCallback from '@/pages/auth/Callback.vue'
import Newsletter from '@/pages/Newsletter.vue'
import Contact from '@/pages/Contact.vue'
import ReceiptGeneratorPage from '@/pages/tools/ReceiptGeneratorPage.vue'
import EstimateQuotePage from '@/pages/tools/EstimateQuotePage.vue'
import ExpenseTrackerPage from '@/pages/tools/ExpenseTrackerPage.vue'
import TimesheetHoursPage from '@/pages/tools/TimesheetHoursPage.vue'
import BusinessDashboardPage from '@/pages/tools/BusinessDashboardPage.vue'
import ClientManagerPage from '@/pages/tools/ClientManagerPage.vue'
import GstCalculatorPage from '@/pages/tools/GstCalculatorPage.vue'
import PLStatementPage from '@/pages/tools/PLStatementPage.vue'
import USSalesTaxCalculatorPage from '@/pages/tools/USSalesTaxCalculatorPage.vue'
import BrandIdentityGeneratorPage from '@/pages/tools/BrandIdentityGeneratorPage.vue'
import ImportCostPricingCalculatorPage from '@/pages/tools/ImportCostPricingCalculatorPage.vue'
import Privacy from '@/pages/legal/Privacy.vue'
import Terms from '@/pages/legal/Terms.vue'
import Cookies from '@/pages/legal/Cookies.vue'
import BlogPost from '@/pages/blog/BlogPost.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/products', redirect: { name: 'tools' } },
  { path: '/tools', name: 'tools', component: ToolsHub },
  { path: '/tools/qr-code-generator', name: 'qr-code-generator', component: QRCodePage },
  { path: '/tools/password-generator', name: 'password-generator', component: PasswordGeneratorPage },
  { path: '/tools/text-case-converter', name: 'text-case-converter', component: TextCaseConverterPage },
  { path: '/tools/word-counter', name: 'word-counter', component: WordCounterPage },
  { path: '/tools/lorem-ipsum', name: 'lorem-ipsum', component: LoremIpsumPage },
  { path: '/tools/percentage-calculator', name: 'percentage-calculator', component: PercentageCalculatorPage },
  { path: '/tools/age-calculator', name: 'age-calculator', component: AgeCalculatorPage },
  { path: '/tools/emi-calculator', name: 'emi-calculator', component: EmiCalculatorPage },
  { path: '/tools/sip-calculator', name: 'sip-calculator', component: SipCalculatorPage },
  { path: '/tools/profit-calculator', name: 'profit-calculator', component: ProfitCalculatorPage },
  { path: '/tools/index-fund-calculator', name: 'index-fund-calculator', component: IndexFundCalculatorPage },
  { path: '/tools/import-cost-pricing', name: 'import-cost-pricing', component: ImportCostPricingCalculatorPage },
  { path: '/tools/brand-identity-generator', name: 'brand-identity-generator', component: BrandIdentityGeneratorPage },
  { path: '/auth/sign-in', name: 'sign-in', component: SignIn },
  { path: '/auth/sign-up', name: 'sign-up', component: SignUp },
  { path: '/auth/callback', name: 'auth-callback', component: AuthCallback },
  // Business tools
  { path: '/tools/receipt-generator', name: 'receipt-generator', component: ReceiptGeneratorPage },
  { path: '/tools/estimate-quote', name: 'estimate-quote', component: EstimateQuotePage },
  { path: '/tools/expense-tracker', name: 'expense-tracker', component: ExpenseTrackerPage },
  { path: '/tools/timesheet-hours', name: 'timesheet-hours', component: TimesheetHoursPage },
  { path: '/tools/business-dashboard', name: 'business-dashboard', component: BusinessDashboardPage },
  { path: '/tools/client-manager', name: 'client-manager', component: ClientManagerPage },
  { path: '/tools/gst-calculator', name: 'gst-calculator', component: GstCalculatorPage },
  { path: '/tools/pl-statement', name: 'pl-statement', component: PLStatementPage },
  { path: '/tools/us-sales-tax', name: 'us-sales-tax', component: USSalesTaxCalculatorPage },
  { path: '/newsletter', name: 'newsletter', component: Newsletter },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/blog', name: 'blog', component: Blog },
  { path: '/blog/:slug', name: 'blog-post', component: BlogPost },
  { path: '/about', name: 'about', component: About },
  { path: '/privacy', name: 'privacy', component: Privacy },
  { path: '/terms', name: 'terms', component: Terms },
  { path: '/cookies', name: 'cookies', component: Cookies },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/products/image-optimization-suite', name: 'image-optimization-suite', component: ImageOptimizationSuitePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router

