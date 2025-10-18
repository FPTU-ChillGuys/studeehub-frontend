"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Brain,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { LoginForm } from "./LoginForm";
import { useAuth } from "@/hooks/useAuth";

const HomePage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { login, signUp } = useAuth();

  // Function để scroll mượt mà đến section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Function để mở modal login
  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
  };
  // Function để đóng modal login
  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    userName: "",
    confirmPassword: "",
  });

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description:
        "Upload your documents and let AI generate personalized review questions tailored to your learning style.",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-accent to-muted",
    },
    {
      icon: Target,
      title: "Personalized Learning Paths",
      description:
        "Get customized study plans that adapt to your progress and help you achieve your academic goals.",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-accent to-muted",
    },
    {
      icon: Users,
      title: "Community Learning",
      description:
        "Connect with fellow learners, ask questions, and share knowledge in our vibrant Q&A forum.",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-accent to-muted",
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description:
        "Monitor your learning journey with detailed analytics, achievements, and performance insights.",
      color: "text-primary",
      bgColor: "bg-gradient-to-br from-accent to-muted",
    },
  ];

  const benefits = [
    "Upload any document format (PDF, DOC, images, videos)",
    "AI generates diverse question types automatically",
    "Track your progress with detailed analytics",
    "Join a community of passionate learners",
    "Study offline with downloaded content",
    "Personalized learning recommendations",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative z-10 px-6 py-4 bg-card/90 backdrop-blur-md border-b border-border shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo.PNG" alt="Logo" width={40} height={40} />
            <span className="text-xl font-bold text-primary">StudeeHub</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("features")}
              className="nav-button text-muted-foreground hover:text-foreground transition-colors font-medium hover:cursor-help"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="nav-button text-muted-foreground hover:text-foreground transition-colors font-medium hover:cursor-help"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="nav-button text-muted-foreground hover:text-foreground transition-colors font-medium hover:cursor-help"
            >
              Benefits
            </button>

            <button
              onClick={handleOpenLogin}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all transform hover:scale-105 font-medium shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-foreground">Learn</span>
              <br />
              <span className="text-primary">Anything</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your AI-powered learning companion that transforms any document
              into personalized study materials and connects you with a
              community of learners.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleOpenLogin}
              className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl hover:bg-primary/90 transition-all transform hover:scale-105 font-semibold text-lg flex items-center space-x-2 shadow-2xl hover:shadow-xl hover:cursor-grab"
            >
              <span>Try StudeeHub</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free to start • No credit card required</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border hover:border-border/80 transition-all">
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-muted-foreground">Active Learners</div>
            </div>
            <div className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border hover:border-border/80 transition-all">
              <div className="text-3xl font-bold text-primary">1M+</div>
              <div className="text-muted-foreground">Questions Generated</div>
            </div>
            <div className="text-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border hover:border-border/80 transition-all">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to excel in your studies
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              StudeeHub combines the power of AI with community learning to
              create the most effective study experience possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="text-center group p-6 bg-background/60 backdrop-blur-sm rounded-2xl hover:bg-background hover:shadow-2xl transition-all duration-300 border border-border hover:border-border/80"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="px-6 py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How StudeeHub Works?
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border hover:shadow-2xl transition-all">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center shadow-xl">
                <Upload className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                1. Upload Your Materials
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Upload any document, image, or video. Our AI supports all major
                formats and can extract knowledge from any source.
              </p>
            </div>

            <div className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border hover:shadow-2xl transition-all">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center shadow-xl">
                <Sparkles className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                2. AI Generates Questions
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced AI analyzes your content and creates personalized
                questions that help you understand and remember key concepts.
              </p>
            </div>

            <div className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border hover:shadow-2xl transition-all">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary rounded-full flex items-center justify-center shadow-xl">
                <Zap className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                3. Learn & Improve
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Practice with your personalized questions, track your progress,
                and connect with other learners in our community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="px-6 py-20 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-8">
            Why choose StudeeHub?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-accent/50 rounded-xl border border-border hover:border-border/80 transition-all hover:shadow-md"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <span className="text-foreground font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Image src="/logo.PNG" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold text-primary">StudeeHub</span>
            </div>
            <div className="flex items-center space-x-6 text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
              <button
                onClick={handleOpenLogin}
                className="hover:text-foreground transition-colors font-medium"
              >
                Login
              </button>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 © StudeeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Form */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="w-full max-w-sm">
            <LoginForm
              showCloseButton={true}
              onClose={handleCloseLogin}
              onLogin={async (email, password) => {
                const result = await login(email, password);
                if (result?.success) {
                  handleCloseLogin();
                }
                return result;
              }}
              onSignUp={async (email, password, fullName, userName) => {
                const result = await signUp(
                  email,
                  password,
                  fullName,
                  userName
                );
                if (result?.success) {
                  //handleCloseLogin();
                }
                return result;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
