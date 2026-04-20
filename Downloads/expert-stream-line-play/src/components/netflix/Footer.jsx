import React from "react";

const FOOTER_LINKS = [
  "Audio Description", "Help Center", "Gift Cards", "Media Center",
  "Investor Relations", "Jobs", "Terms of Use", "Privacy",
  "Legal Notices", "Cookie Preferences", "Corporate Information", "Contact Us"
];

export default function Footer() {
  return (
    <footer className="bg-[#141414] text-gray-500 px-4 md:px-12 py-12 mt-8">
      <div className="max-w-5xl mx-auto">
        <p className="text-sm mb-6 hover:text-gray-300 cursor-pointer">Questions? Contact us.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          {FOOTER_LINKS.map((link) => (
            <a key={link} href="#" className="text-xs hover:text-gray-300 underline transition-colors">
              {link}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-600">© 2026 Netflix Clone Demo — For educational purposes only</p>
      </div>
    </footer>
  );
}