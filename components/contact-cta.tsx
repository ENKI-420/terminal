import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield } from "lucide-react"

export default function ContactCTA() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold">AgileDefense Systems</h2>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to secure your organization?</h2>

            <p className="text-lg text-slate-300 mb-8">
              Contact our team of security experts to discuss your specific needs and how we can help protect your
              critical assets from evolving threats.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-red-500 font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Initial Consultation</h3>
                  <p className="text-slate-300">
                    We'll discuss your security concerns, business requirements, and objectives.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-red-500 font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Tailored Proposal</h3>
                  <p className="text-slate-300">
                    Receive a customized security assessment plan designed for your specific needs.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-red-500 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Execution & Reporting</h3>
                  <p className="text-slate-300">
                    Our experts conduct the assessment and provide detailed findings and recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">SOC 2 Compliant</div>
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">ISO 27001 Certified</div>
              <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-medium">CMMC Level 3</div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg p-8 text-slate-900">
              <h3 className="text-2xl font-bold mb-6">Request a Security Assessment</h3>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <Input id="name" placeholder="John Smith" className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">
                      Company
                    </label>
                    <Input id="company" placeholder="Your Company" className="w-full" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="you@example.com" className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                      Phone
                    </label>
                    <Input id="phone" placeholder="(123) 456-7890" className="w-full" />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-slate-700 mb-1">
                    Service of Interest
                  </label>
                  <select id="service" className="w-full rounded-md border border-slate-300 py-2 px-3">
                    <option value="">Select a service</option>
                    <option value="pentest">Penetration Testing</option>
                    <option value="redteam">Red Team Operations</option>
                    <option value="counter">Counter-Intelligence</option>
                    <option value="social">Social Engineering</option>
                    <option value="other">Other Services</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your security needs"
                    className="w-full min-h-[120px]"
                  />
                </div>

                <div className="pt-2">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Request Assessment</Button>
                </div>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Your information is secure and will never be shared with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
