"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronDown,
  Sparkles,
  Code,
  Coffee,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSignedIn) {
      router.push("/register");
    } else {
      openSignIn({
        fallbackRedirectUrl: "/register",
        signUpFallbackRedirectUrl: "/register",
      });
    }
  };

  const faqs = [
    {
      question: "What is this Study Jam about?",
      answer:
        "This is a 2-hour Study Jam session organized by GDG SOE CUSAT. It's an interactive learning event where participants collaborate, learn new technologies, and work on hands-on projects together.",
    },
    {
      question: "What should I bring to the event?",
      answer:
        "Bring your laptop, QR ticket (you'll receive it after registration), a valid ID, and your enthusiasm to learn! We'll provide refreshments and all necessary materials.",
    },
    {
      question: "Is there any registration fee?",
      answer:
        "No, this Study Jam is completely free! Just register and show up with your QR ticket on the event day.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-red-200/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-200/25 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-40 right-1/4 w-72 h-72 bg-green-200/20 rounded-full blur-3xl animate-blob animation-delay-6000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Floating Icons */}
            <div className="absolute top-10 left-10 animate-float hidden lg:block">
              <Code className="w-8 h-8 text-blue-400/40" />
            </div>
            <div className="absolute top-20 right-20 animate-float animation-delay-2000 hidden lg:block">
              <Sparkles className="w-10 h-10 text-yellow-400/40" />
            </div>
            <div className="absolute bottom-10 left-1/4 animate-float animation-delay-4000 hidden lg:block">
              <Coffee className="w-8 h-8 text-red-400/40" />
            </div>

            {/* GDG Logo Text */}
            <div className="inline-block animate-fade-in-up">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-3">
                <span className="inline-block hover:scale-125 transition-transform duration-300 cursor-pointer text-blue-500">
                  G
                </span>
                <span className="inline-block hover:scale-125 transition-transform duration-300 cursor-pointer text-red-500">
                  D
                </span>
                <span className="inline-block hover:scale-125 transition-transform duration-300 cursor-pointer text-yellow-500">
                  G
                </span>
                <span className="text-gray-700"> Study Jam</span>
              </h1>
              <div className="h-1.5 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 rounded-full animate-gradient-x"></div>
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-700 mb-3">
                Innovation & Learning Session
              </h2>
              <p className="text-base sm:text-lg text-gray-500 font-medium">
                GDG SOE CUSAT
              </p>
            </div>

            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4 animate-fade-in-up animation-delay-400 leading-relaxed">
              Join us for an exciting 2-hour Study Jam filled with hands-on
              learning, collaboration, and community building
            </p>

            {/* CTA Button */}
            <div className="animate-fade-in-up animation-delay-600">
              <button
                onClick={handleRegisterClick}
                className="group relative px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Register Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Date Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 hover:-translate-y-2 animate-fade-in-up">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl group-hover:from-blue-500 group-hover:to-blue-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Date
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  20th Jan 2026
                </p>
              </div>
            </div>
          </div>

          {/* Time Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-red-200 hover:-translate-y-2 animate-fade-in-up animation-delay-100">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-xl group-hover:from-red-500 group-hover:to-red-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Time
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300">
                  4:15pm to 6pm
                </p>
              </div>
            </div>
          </div>

          {/* Venue Card */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-200 hover:-translate-y-2 animate-fade-in-up animation-delay-200">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl group-hover:from-yellow-500 group-hover:to-yellow-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Venue
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
                  CS1 & CS2
                </p>
                <p className="text-xs text-gray-600">SOE, CUSAT</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 border border-gray-100 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></div>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
              About the Study Jam
            </h3>
            <div className="h-1 w-12 bg-gradient-to-r from-yellow-500 to-green-500 rounded-full"></div>
          </div>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-base">
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                GDG SOE CUSAT
              </span>{" "}
              is excited to bring you an engaging 2-hour{" "}
              <span className="font-semibold text-gray-800">Study Jam</span>{" "}
              that combines hands-on learning, innovation, and networking
              opportunities.
            </p>
            <p className="text-base">
              Whether you're a seasoned developer or just starting your tech
              journey, this Study Jam is designed to inspire collaboration,
              enhance your skills, and foster connections within our vibrant
              community.
            </p>
            <p className="text-base">
              Register now and be part of this exciting learning experience at
              the{" "}
              <span className="font-semibold text-gray-800">
                NLP Block, School of Engineering, CUSAT
              </span>
              !
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
        <div className="text-center mb-8 sm:mb-12">
          <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3 animate-fade-in-up">
            Frequently Asked Questions
          </h3>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full mx-auto"></div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300 group"
              >
                <span className="font-semibold text-gray-800 text-base sm:text-lg pr-4 group-hover:text-blue-600 transition-colors duration-300">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-all duration-500 group-hover:text-blue-600 ${
                    openFaq === index ? "rotate-180 text-blue-600" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openFaq === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-5 sm:px-6 pb-4 sm:pb-5 text-gray-600 text-sm sm:text-base leading-relaxed border-t border-gray-100 pt-4 bg-gradient-to-b from-blue-50/30 to-transparent">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 rounded-3xl shadow-2xl p-8 sm:p-12 text-center text-white overflow-hidden group">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="relative z-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animate-fade-in-up">
              Ready to Join Us?
            </h3>
            <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-blue-100 animate-fade-in-up animation-delay-200">
              Don't miss out on this amazing Study Jam!
            </p>
            <button
              onClick={handleRegisterClick}
              className="px-8 sm:px-10 py-3 sm:py-4 bg-white text-blue-600 text-base sm:text-lg font-bold rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 hover:bg-gray-50 animate-fade-in-up animation-delay-400"
            >
              Register Now →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-600 relative">
        <p className="text-sm font-medium">
          Organized by{" "}
          <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            GDG SOE CUSAT
          </span>
        </p>
        <p className="text-xs mt-2 text-gray-500">
          © 2026 Google Developer Groups. All rights reserved.
        </p>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </main>
  );
}
