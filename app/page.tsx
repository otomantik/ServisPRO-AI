import { ArrowRight, Wrench, Sparkles, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <Wrench className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          ServisPro AI
        </h1>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-600 mb-3 flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          Akıllı Servis Yönetimi
        </p>
        
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          AI destekli profesyonel servis yönetim platformu ile işlerinizi kolaylaştırın. 
          Her şey kontrolünüzde!
        </p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Wrench className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Akıllı Yönetim</h3>
            <p className="text-sm text-gray-600">800+ servis kaydı, otomatik takip ve raporlama</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Destekli</h3>
            <p className="text-sm text-gray-600">Öngörüler, analizler ve akıllı öneriler</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Gelişmiş Raporlama</h3>
            <p className="text-sm text-gray-600">Detaylı finansal raporlar ve grafikler</p>
          </div>
        </div>

        {/* CTA Button */}
        <a 
          href="/dashboard" 
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
        >
          Dashboard'a Git
          <ArrowRight className="w-5 h-5" />
        </a>

        {/* Footer */}
        <p className="mt-12 text-sm text-gray-500">
          150+ Müşteri • 800+ Servis • 18 Stok Kalemi
        </p>
      </div>
    </div>
  )
}
