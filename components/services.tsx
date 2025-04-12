import {
  Shield,
  Users,
  Server,
  Cloud,
  Code,
  Database,
  Smartphone,
  FileText,
  AlertTriangle,
  Eye,
  Lock,
  Fingerprint,
} from "lucide-react"

export default function Services() {
  const services = [
    {
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      title: "Vulnerability Assessment",
      description:
        "Comprehensive scanning and analysis to identify security weaknesses in your systems and applications.",
    },
    {
      icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
      title: "Red Team Operations",
      description: "Simulate sophisticated attacks to test your security posture and response capabilities.",
    },
    {
      icon: <Eye className="h-10 w-10 text-purple-500" />,
      title: "Counter-Intelligence",
      description: "Protect against corporate espionage with advanced threat detection and prevention strategies.",
    },
    {
      icon: <Users className="h-10 w-10 text-green-500" />,
      title: "Social Engineering Testing",
      description: "Evaluate your organization's resilience against manipulation and deception tactics.",
    },
    {
      icon: <Server className="h-10 w-10 text-yellow-500" />,
      title: "Network Security",
      description: "Secure your infrastructure against unauthorized access and data breaches.",
    },
    {
      icon: <Cloud className="h-10 w-10 text-indigo-500" />,
      title: "Cloud Security",
      description: "Ensure your cloud environments are configured securely and protected from threats.",
    },
    {
      icon: <Code className="h-10 w-10 text-cyan-500" />,
      title: "Application Security",
      description: "Identify and remediate vulnerabilities in your web and mobile applications.",
    },
    {
      icon: <Database className="h-10 w-10 text-orange-500" />,
      title: "Data Protection",
      description: "Implement robust controls to safeguard sensitive information and intellectual property.",
    },
    {
      icon: <Smartphone className="h-10 w-10 text-pink-500" />,
      title: "Mobile Security",
      description: "Secure your mobile devices and applications against emerging threats.",
    },
    {
      icon: <FileText className="h-10 w-10 text-teal-500" />,
      title: "Compliance Assessment",
      description: "Ensure your security practices meet industry standards and regulatory requirements.",
    },
    {
      icon: <Lock className="h-10 w-10 text-amber-500" />,
      title: "Incident Response",
      description: "Rapid containment and remediation of security incidents to minimize damage.",
    },
    {
      icon: <Fingerprint className="h-10 w-10 text-lime-500" />,
      title: "Digital Forensics",
      description: "Investigate security breaches to determine scope, impact, and attribution.",
    },
  ]

  return (
    <div className="bg-slate-100 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Security Services</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our elite team delivers a full spectrum of offensive and defensive security services to protect your
            organization from evolving threats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-slate-200 hover:border-slate-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
