import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DnaIcon } from "@/components/icons/dna"
import { ArrowRight, CheckCircle, Shield, Users, Microscope, HeartPulse } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <DnaIcon className="h-6 w-6" />
            <span className="text-xl font-bold">GenomicInsights</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:underline underline-offset-4">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-6 pt-24 pb-16 md:pt-32 md:pb-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Personalized Healthcare <br />
          <span className="text-primary">Through Genomic Insights</span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Unlock the power of your DNA to receive personalized healthcare recommendations, treatment plans, and insights
          tailored specifically to your genetic profile.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/auth/register">
            <Button size="lg" className="gap-2">
              Start Your Journey <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Comprehensive Healthcare Platform</h2>
          <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
            Our platform combines genomic data with cutting-edge telehealth services to provide a complete healthcare
            experience tailored to your unique genetic profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Personalized Health Plans</h3>
            <p className="text-muted-foreground">
              Receive health recommendations and treatment plans based on your unique genetic profile.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Virtual Consultations</h3>
            <p className="text-muted-foreground">
              Connect with healthcare providers specialized in genomic medicine through secure video calls.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Microscope className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Lab Results & Analysis</h3>
            <p className="text-muted-foreground">
              View and understand your lab results with detailed explanations of their genomic implications.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your genetic data and health information are protected with enterprise-grade security.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Medication Management</h3>
            <p className="text-muted-foreground">
              Track medications and receive alerts about potential genetic interactions.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
            <div className="p-3 rounded-full bg-primary/10 mb-4">
              <ArrowRight className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Continuous Monitoring</h3>
            <p className="text-muted-foreground">
              Track your health metrics over time and receive updates as new genomic research emerges.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How GenomicInsights Works</h2>
            <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
              Our simple process helps you unlock the power of your genetic information for better healthcare outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-card p-6 rounded-lg border relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 mt-2">Register & Connect</h3>
              <p className="text-muted-foreground">
                Create your account and securely upload your genetic test results or order a test through our platform.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 mt-2">Receive Insights</h3>
              <p className="text-muted-foreground">
                Our system analyzes your genetic data and provides personalized health insights and recommendations.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg border relative">
              <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 mt-2">Ongoing Care</h3>
              <p className="text-muted-foreground">
                Connect with specialized healthcare providers through our telehealth platform for personalized care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 md:py-24">
        <div className="rounded-lg bg-primary p-8 md:p-12 text-primary-foreground text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Transform Your Healthcare Experience?
          </h2>
          <p className="text-lg mb-8 max-w-[800px] mx-auto opacity-90">
            Join thousands of patients who have already discovered the benefits of personalized genomic healthcare. Your
            journey to better health starts here.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="gap-2">
              Get Started Today <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted">
        <div className="container py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DnaIcon className="h-5 w-5" />
                <span className="text-lg font-bold">GenomicInsights</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Personalized healthcare through genomic insights, making precision medicine accessible to everyone.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-3">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Research
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    HIPAA Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} GenomicInsights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
