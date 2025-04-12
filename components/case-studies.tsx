import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CaseStudies() {
  const caseStudies = [
    {
      title: "Financial Institution Breach Prevention",
      description:
        "Identified and remediated critical vulnerabilities in a major bank's infrastructure before they could be exploited by attackers.",
      category: "Financial Services",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Manufacturing IP Protection",
      description:
        "Uncovered and neutralized an ongoing corporate espionage operation targeting proprietary manufacturing processes.",
      category: "Manufacturing",
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      title: "Healthcare Data Security",
      description:
        "Strengthened security controls to protect sensitive patient data and ensure HIPAA compliance for a healthcare network.",
      category: "Healthcare",
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  return (
    <div className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Real-world examples of how our elite security services have protected organizations from sophisticated
            threats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {caseStudies.map((study, index) => (
            <div
              key={index}
              className="group rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-200"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={study.image || "/placeholder.svg"}
                  alt={study.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <div className="text-xs font-medium text-red-400 mb-1">{study.category}</div>
                  <h3 className="text-xl font-bold text-white">{study.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 mb-4">{study.description}</p>
                <Button variant="ghost" className="text-red-600 hover:text-red-700 p-0 flex items-center">
                  Read Case Study <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white">View All Case Studies</Button>
        </div>
      </div>
    </div>
  )
}
