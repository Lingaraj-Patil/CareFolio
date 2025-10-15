import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Brain, Shield, Users, Stethoscope, Heart, TrendingUp, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background animate-fade-in">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 transition-smooth">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CareFolio
            </h1>
          </div>
          <div className="flex gap-3">
            <Link to="/auth">
              <Button variant="outline" className="transition-smooth hover:border-primary">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button className="transition-smooth hover:opacity-90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight animate-scale-in">
            Your <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">AI-Powered</span>
            <br />Health Companion
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Bridge the gap between wellness and medical care with personalized plans, expert connections, 
            and blockchain-secured health data.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 transition-smooth hover:opacity-90 hover:scale-105">
                Start Your Journey
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 transition-smooth hover:border-primary">
              Learn More
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 animate-fade-in">
          <Card className="p-6 shadow-medium hover:shadow-strong transition-smooth hover:-translate-y-1">
            <div className="text-3xl font-bold text-primary">10K+</div>
            <div className="text-sm text-muted-foreground">Active Users</div>
          </Card>
          <Card className="p-6 shadow-medium hover:shadow-strong transition-smooth hover:-translate-y-1">
            <div className="text-3xl font-bold text-secondary">500+</div>
            <div className="text-sm text-muted-foreground">Healthcare Experts</div>
          </Card>
          <Card className="p-6 shadow-medium hover:shadow-strong transition-smooth hover:-translate-y-1">
            <div className="text-3xl font-bold text-accent">99.9%</div>
            <div className="text-sm text-muted-foreground">Data Security</div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Intelligent Healthcare Platform</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Combining AI, blockchain, and expert medical care for a personalized health experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 hover:shadow-strong transition-smooth hover:-translate-y-1 gradient-card">
            <Brain className="w-12 h-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">AI Health Triage</h4>
            <p className="text-muted-foreground">
              Smart classification directs you to wellness or expert pathways based on your health profile.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-strong transition-smooth hover:-translate-y-1 gradient-card">
            <Activity className="w-12 h-12 text-secondary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Personalized Plans</h4>
            <p className="text-muted-foreground">
              Dynamic nutrition and workout plans tailored to your conditions and goals.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-strong transition-smooth hover:-translate-y-1 gradient-card">
            <Shield className="w-12 h-12 text-accent mb-4" />
            <h4 className="text-xl font-semibold mb-2">Blockchain Security</h4>
            <p className="text-muted-foreground">
              Immutable health data logging with consent-based sharing and full privacy control.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-strong transition-smooth hover:-translate-y-1 gradient-card">
            <Stethoscope className="w-12 h-12 text-primary mb-4" />
            <h4 className="text-xl font-semibold mb-2">Expert Connection</h4>
            <p className="text-muted-foreground">
              Direct access to verified doctors and specialists for personalized medical guidance.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How CareFolio Works</h3>
            <p className="text-muted-foreground">Simple, secure, and personalized healthcare in 4 steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Sign Up & Profile</h4>
              <p className="text-sm text-muted-foreground">Complete your health assessment</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">AI Triage</h4>
              <p className="text-sm text-muted-foreground">Get classified into the right pathway</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Personalized Plan</h4>
              <p className="text-sm text-muted-foreground">Receive your custom health plan</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Track & Connect</h4>
              <p className="text-sm text-muted-foreground">Monitor progress & reach experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Built For Everyone</h3>
          <p className="text-muted-foreground">Whether you're a patient, doctor, or administrator</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-strong transition-smooth hover:-translate-y-2 gradient-card">
            <Users className="w-16 h-16 text-primary mx-auto mb-4" />
            <h4 className="text-2xl font-semibold mb-2">Patients</h4>
            <p className="text-muted-foreground mb-6">
              Personalized wellness tracking, AI-powered plans, and direct expert access
            </p>
            <Link to="/auth">
              <Button variant="outline" className="w-full transition-smooth hover:border-primary">Get Started</Button>
            </Link>
          </Card>

          <Card className="p-8 text-center hover:shadow-strong transition-smooth hover:-translate-y-2 gradient-card">
            <Stethoscope className="w-16 h-16 text-secondary mx-auto mb-4" />
            <h4 className="text-2xl font-semibold mb-2">Doctors</h4>
            <p className="text-muted-foreground mb-6">
              Secure patient data access, AI summaries, and streamlined communication
            </p>
            <Link to="/auth">
              <Button variant="outline" className="w-full transition-smooth hover:border-secondary">Join Network</Button>
            </Link>
          </Card>

          <Card className="p-8 text-center hover:shadow-strong transition-smooth hover:-translate-y-2 gradient-card">
            <Lock className="w-16 h-16 text-accent mx-auto mb-4" />
            <h4 className="text-2xl font-semibold mb-2">Administrators</h4>
            <p className="text-muted-foreground mb-6">
              Platform management, blockchain oversight, and system analytics
            </p>
            <Link to="/auth">
              <Button variant="outline" className="w-full transition-smooth hover:border-accent">Admin Access</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-primary to-secondary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-4 animate-fade-in">Ready to Transform Your Health Journey?</h3>
          <p className="text-xl mb-8 opacity-90 animate-fade-in">Join thousands of users trusting CareFolio with their wellness</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8 transition-smooth hover:scale-105">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary" />
            <span className="font-semibold text-foreground">CareFolio</span>
          </div>
          <p className="text-sm">© 2025 CareFolio. Secure, Intelligent, Personalized Healthcare.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
