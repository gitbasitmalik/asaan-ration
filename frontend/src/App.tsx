import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/components/language-provider"
import { NGOAuthProvider } from "@/components/ngo-auth-provider"
import Navigation from "@/components/navigation"
import HomePage from "@/pages/HomePage"
import DonatePage from "@/pages/DonatePage"
import RequestPage from "@/pages/RequestPage"
import NGOPage from "@/pages/NGOPage"
// import MapPage from "@/pages/MapPage"
import TransparencyPage from "@/pages/TransparencyPage"

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <LanguageProvider>
        <NGOAuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/request" element={<RequestPage />} />
                <Route path="/ngo" element={<NGOPage />} />
                {/* <Route path="/map" element={<MapPage />} /> */}
                <Route path="/transparency" element={<TransparencyPage />} />
              </Routes>
            </main>
          </div>
        </NGOAuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
