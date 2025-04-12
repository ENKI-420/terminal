import { Shield, Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-xl font-bold">AgileDefense Systems</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Providing elite cybersecurity services to protect organizations from advanced threats and corporate
              espionage.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Penetration Testing
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Red Team Operations
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Counter-Intelligence
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Social Engineering
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Network Security
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Cloud Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  White Papers
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Security Advisories
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Webinars
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-white">
                  Security Tools
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <span className="text-slate-400">
                  1234 Cyber Avenue, Suite 500
                  <br />
                  Arlington, VA 22201
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-red-500 mr-2" />
                <a href="tel:+18005551234" className="text-slate-400 hover:text-white">
                  (800) 555-1234
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-red-500 mr-2" />
                <a href="mailto:info@agiledefense.army" className="text-slate-400 hover:text-white">
                  info@agiledefense.army
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} AgileDefense Systems. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-white text-sm">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
