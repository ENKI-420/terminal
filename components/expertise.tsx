import { CheckCircle } from "lucide-react"

export default function Expertise() {
  return (
    <div className="bg-slate-900 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Elite Expertise in <span className="text-red-500">Offensive Security</span>
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Our team consists of former military cyber operators, intelligence professionals, and industry-leading
              security experts with decades of combined experience.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Military-Grade Methodology</h3>
                  <p className="text-slate-300">
                    We apply rigorous, battle-tested approaches developed in national security environments to protect
                    commercial enterprises.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Advanced Threat Intelligence</h3>
                  <p className="text-slate-300">
                    Stay ahead of emerging threats with our continuous monitoring and intelligence-driven security
                    assessments.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-bold mb-1">Ethical Approach</h3>
                  <p className="text-slate-300">
                    We operate with the highest standards of integrity and confidentiality, ensuring responsible
                    security testing.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">Advanced Persistent Threats</div>
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">Zero-Day Exploits</div>
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">Supply Chain Attacks</div>
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">Insider Threats</div>
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">Social Engineering</div>
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">Ransomware Prevention</div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-red-600 rounded-lg blur-lg opacity-20"></div>
              <div className="relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                <div className="grid grid-cols-2 gap-px bg-slate-700">
                  <div className="bg-slate-800 p-6">
                    <div className="text-4xl font-bold text-red-500 mb-2">150+</div>
                    <div className="text-slate-300">Critical vulnerabilities discovered</div>
                  </div>
                  <div className="bg-slate-800 p-6">
                    <div className="text-4xl font-bold text-blue-500 mb-2">98%</div>
                    <div className="text-slate-300">Success rate in red team operations</div>
                  </div>
                  <div className="bg-slate-800 p-6">
                    <div className="text-4xl font-bold text-green-500 mb-2">200+</div>
                    <div className="text-slate-300">Organizations protected</div>
                  </div>
                  <div className="bg-slate-800 p-6">
                    <div className="text-4xl font-bold text-purple-500 mb-2">24/7</div>
                    <div className="text-slate-300">Incident response availability</div>
                  </div>
                </div>

                <div className="p-6 bg-slate-800">
                  <h3 className="text-xl font-bold mb-4">Industry Certifications</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-700 p-3 rounded text-center text-sm">OSCP</div>
                    <div className="bg-slate-700 p-3 rounded text-center text-sm">CISSP</div>
                    <div className="bg-slate-700 p-3 rounded text-center text-sm">CEH</div>
                    <div className="bg-slate-700 p-3 rounded text-center text-sm">GPEN</div>
                    <div className="bg-slate-700 p-3 rounded text-center text-sm">CISM</div>
                    <div className="bg-slate-700 p-3 rounded text-center text-sm">GXPN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
