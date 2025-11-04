import React from "react";
import { Facebook, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f172a] text-gray-300 py-10 px-6 md:px-16 lg:px-24 text-center">
      {/* Logo + Project Info */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#38bdf8]">
          Smart Study Schedule Generator
        </h1>
        <p className="text-sm mt-2 text-gray-400">
          PM Shri KV Ballygunge • Built for Hackathon under{" "}
          <a
            href="https://vidyasetu.ai/"
            target="_blank"
            rel="noreferrer"
            className="text-[#38bdf8] hover:underline"
          >
            AI Vidyasetu
          </a>
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm md:text-base mb-8">
        <a href="/" className="hover:text-[#38bdf8] transition-colors">
          Home
        </a>
        <a href="/resources" className="hover:text-[#38bdf8] transition-colors">
          Resources
        </a>
        <a
          href="mailto:mantusantra591@gmail.com"
          className="hover:text-[#38bdf8] transition-colors"
        >
          Contact
        </a>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center gap-8 mb-8">
        <a
          href="https://github.com/IamDaGod-kira/generator-3s-kvb/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all duration-300 hover:scale-110"
          aria-label="GitHub"
        >
          <Github size={20} />
        </a>
        <a
          href="https://www.facebook.com/p/Kendriya-Vidyalaya-Ballygunge-BMC-Kolkata-61552271397541/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-600 hover:border-[#38bdf8] hover:text-[#38bdf8] transition-all duration-300 hover:scale-110"
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </a>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 w-4/5 mx-auto mb-6" />

      {/* Copyright */}
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} Smart Study Schedule Generator. All rights
        reserved.
      </p>
    </footer>
  );
}
