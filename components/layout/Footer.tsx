import Link from "next/link";
import { Leaf, MessageCircle, Star } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-800/60 bg-gray-950/50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">NutriHabit AI</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Transform your eating habits with AI-powered nutrition intelligence. 
              Build sustainable health routines, one day at a time.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-emerald-400 transition-colors">
                <Star className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {["Features", "How It Works", "Pricing", "Roadmap"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {["About", "Blog", "Privacy Policy", "Terms of Service"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2024 NutriHabit AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Powered by Google Gemini AI & Google Cloud
          </p>
        </div>
      </div>
    </footer>
  );
}
