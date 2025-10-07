export const routes = {
  // Dashboard
  dashboard: () => '/dashboard',
  
  // Customers
  customers: {
    list: () => '/dashboard/customers',
    view: (id: string) => `/dashboard/customers/${id}`,
    edit: (id: string) => `/dashboard/customers/${id}/edit`,
    new: () => '/dashboard/customers/new',
  },
  
  // Services
  services: {
    list: () => '/dashboard/services',
    view: (id: string) => `/dashboard/services/${id}`,
    edit: (id: string) => `/dashboard/services/${id}/edit`,
    new: () => '/dashboard/services/new',
  },
  
  // Inventory/Stock
  inventory: {
    list: () => '/dashboard/stock',
    view: (id: string) => `/dashboard/stock/${id}`,
    edit: (id: string) => `/dashboard/stock/${id}/edit`,
    new: () => '/dashboard/stock/new',
  },
  
  // Cash (Double-entry ledger)
  cash: () => '/cash',
  cashNew: () => '/cash/new',
  cashView: (id: string) => `/cash/entry/${id}`,
  cashEdit: (id: string) => `/cash/entry/${id}/edit`,
  
  // Kasa (Cash Register)
  kasa: {
    list: () => '/dashboard/kasa',
    view: (id: string) => `/dashboard/kasa/entry/${id}`,
    edit: (id: string) => `/dashboard/kasa/entry/${id}/edit`,
    new: () => '/dashboard/kasa/new',
  },
  
  // Alacaklar (Receivables/Invoices)
  alacaklar: {
    list: () => '/dashboard/alacaklar',
    view: (id: string) => `/dashboard/alacaklar/${id}`,
    new: () => '/dashboard/alacaklar/new',
  },
  
  // AR (Accounts Receivable)
  ar: () => '/ar',
  
  // Invoices
  invoices: () => '/invoices',
  invoiceView: (id: string) => `/invoices/${id}`,
  invoiceNew: () => '/invoices/new',
  
  // AI Recommendations
  recommendations: () => '/ai/recommendations',
  
  // Health & Diagnostics
  health: () => '/healthz',
  
  // Staff
  staff: {
    list: () => '/dashboard/staff',
    view: (id: string) => `/dashboard/staff/${id}`,
    edit: (id: string) => `/dashboard/staff/${id}/edit`,
    new: () => '/dashboard/staff/new',
  },
  
  // Periodic Maintenance
  maintenance: {
    list: () => '/dashboard/maintenance',
    view: (id: string) => `/dashboard/maintenance/${id}`,
    edit: (id: string) => `/dashboard/maintenance/${id}/edit`,
    new: () => '/dashboard/maintenance/new',
  },
  
  // Categories
  categories: {
    list: () => '/dashboard/categories',
    view: (id: string) => `/dashboard/categories/${id}`,
    edit: (id: string) => `/dashboard/categories/${id}/edit`,
    new: () => '/dashboard/categories/new',
  },
  
  // Analytics
  analytics: () => '/dashboard/analytics',
  
  // Settings
  settings: () => '/dashboard/settings',
  
  // Help
  help: () => '/dashboard/help',
  
  // Auth
  auth: {
    login: () => '/login',
    logout: () => '/logout',
  },
  
  // Dev/Diagnostics
  diagnostics: () => '/dev/diagnostics',
} as const

// Type helper for route parameters
export type RouteParams<T extends string> = T extends `${string}:${infer P}${string}` ? P : never

// Helper function to build dynamic routes
export function buildRoute<T extends keyof typeof routes>(
  route: T,
  ...params: any[]
): string {
  const routeFn = routes[route] as any
  return typeof routeFn === 'function' ? routeFn(...params) : routeFn
}
