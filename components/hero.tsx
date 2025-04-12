import { Button } from "@/components/ui/button"
import { Shield, Lock, AlertTriangle } from "lucide-react"

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-red-500 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Binary code overlay */}
      <div className="absolute inset-0 z-0 opacity-5 overflow-hidden font-mono text-xs text-white">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap">
            {Array.from({ length: 100 }).map((_, j) => (
              <span key={j}>{Math.round(Math.random())}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-red-500 mr-2" />
              <h2 className="text-xl font-bold text-white">AgileDefense Systems</h2>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Proactive <span className="text-red-500">Cybersecurity</span> For The Modern Battlefield
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-lg">
              Protecting your organization from advanced threats through ethical hacking, red teaming, and corporate
              espionage defense.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Request Security Assessment
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Explore Services
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg blur opacity-25"></div>
              <div className="relative bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
                <div className="p-1 bg-slate-800">
                  <div className="flex items-center">
                    <div className="flex space-x-1 ml-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="mx-auto text-xs text-slate-400">terminal</div>
                  </div>
                </div>
                <div className="p-4 font-mono text-sm text-green-500">
                  <div className="mb-2">$ initiating_security_scan</div>
                  <div className="mb-2">{">"} Scanning network perimeter...</div>
                  <div className="mb-2">{">"} Identifying vulnerabilities...</div>
                  <div className="mb-2">{">"} Testing defense systems...</div>
                  <div className="mb-2 text-red-500">{">"} 3 critical vulnerabilities detected</div>
                  <div className="mb-2 text-yellow-500">{">"} 7 medium risk issues found</div>
                  <div className="mb-2">{">"} Generating remediation plan...</div>
                  <div className="animate-pulse">{">"} _</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <Lock className="h-10 w-10 text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Penetration Testing</h3>
            <p className="text-slate-300">
              Identify vulnerabilities before attackers do with our comprehensive penetration testing services.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <AlertTriangle className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Red Team Operations</h3>
            <p className="text-slate-300">
              Simulate real-world attacks to test your organization's detection and response capabilities.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700">
            <Shield className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Counter-Intelligence</h3>
            <p className="text-slate-300">
              Protect your intellectual property and sensitive data from corporate espionage attempts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
