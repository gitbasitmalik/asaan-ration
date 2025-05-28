"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.donate": "Donate",
    "nav.request": "Request",
    "nav.ngo": "NGO ",
    "nav.map": "Map View",
    "nav.transparency": "Transparency",

    // Homepage
    "home.title": "AsaanRation",
    "home.subtitle": "Connecting Hearts, Sharing Hope",
    "home.mission":
      "Our mission is to bridge the gap between food donors and those in need across Pakistan. We ensure transparent, efficient distribution of food and rations to verified recipients through our network of trusted NGOs.",
    "home.donate.title": "Donate Food & Rations",
    "home.donate.desc": "Share your surplus food and help families in need",
    "home.request.title": "Request Assistance",
    "home.request.desc": "Submit your request for food assistance",
    "home.ngo.title": "NGO Portal",
    "home.ngo.desc": "Manage and fulfill donation requests",
    "home.stats.donations": "Total Donations",
    "home.stats.families": "Families Helped",
    "home.stats.ngos": "Partner NGOs",

    // Forms
    "form.name": "Full Name",
    "form.contact": "Contact Number",
    "form.location": "Location/Address",
    "form.submit": "Submit",
    "form.quantity": "Quantity",
    "form.type": "Type of Food/Ration",
    "form.familySize": "Family Size",
    "form.needType": "Type of Need",
    "form.description": "Description",
    'form.cnic': "CNIC Number",

    // Buttons
    "btn.donate": "Donate Now",
    "btn.request": "Request Help",
    "btn.login": "Login",
    "btn.viewMap": "View Map",
    "btn.learnMore": "Learn More",

    // NGO Dashboard
    "ngo.title": "NGO Dashboard",
    "ngo.requests": "Open Requests",
    "ngo.fulfilled": "Mark as Fulfilled",

    // Map
    "map.title": "Donation & Request Map",
    "map.donations": "Recent Donations",
    "map.requests": "Pending Requests",

    // Transparency
    "transparency.title": "Donation Transparency",
    "transparency.subtitle": "Track how your donations are making a difference",
    "transparency.recent": "Recent Donations",
    "transparency.anonymous": "Anonymous Donor",
  },
  ur: {
    // Navigation
    "nav.home": "ہوم",
    "nav.donate": "عطیہ",
    "nav.request": "درخواست",
    "nav.ngo": "این جی او لاگ ان",
    "nav.map": "نقشہ",
    "nav.transparency": "شفافیت",

    // Homepage
    "home.title": "آسان راشن",
    "home.subtitle": "دلوں کو جوڑنا، امید بانٹنا",
    "home.mission":
      "ہمارا مشن پاکستان بھر میں کھانے کے عطیہ دہندگان اور ضرورت مندوں کے درمیان فاصلے کو ختم کرنا ہے۔ ہم قابل اعتماد این جی اوز کے نیٹ ورک کے ذریعے تصدیق شدہ وصول کنندگان کو کھانے اور راشن کی شفاف، موثر تقسیم کو یقینی بناتے ہیں۔",
    "home.donate.title": "کھانا اور راشن کا عطیہ",
    "home.donate.desc":
      "اپنا اضافی کھانا بانٹیں اور ضرورت مند خاندانوں کی مدد کریں",
    "home.request.title": "مدد کی درخواست",
    "home.request.desc": "کھانے کی مدد کے لیے اپنی درخواست جمع کریں",
    "home.ngo.title": "این جی او پورٹل",
    "home.ngo.desc": "عطیات کی درخواستوں کا انتظام اور تکمیل",
    "home.stats.donations": "کل عطیات",
    "home.stats.families": "مدد شدہ خاندان",
    "home.stats.ngos": "پارٹنر این جی اوز",

    // Forms
    "form.name": "پورا نام",
    "form.contact": "رابطہ نمبر",
    "form.location": "مقام/پتہ",
    "form.submit": "جمع کریں",
    "form.quantity": "مقدار",
    "form.type": "کھانے/راشن کی قسم",
    "form.familySize": "خاندان کا سائز",
    "form.needType": "ضرورت کی قسم",
    "form.description": "تفصیل",
    "form.cnic": "جمع شناختی کارڈ نمبر",

    // Buttons
    "btn.donate": "ابھی عطیہ کریں",
    "btn.request": "مدد کی درخواست",
    "btn.login": "لاگ ان",
    "btn.viewMap": "نقشہ دیکھیں",
    "btn.learnMore": "مزید جانیں",

    // NGO Dashboard
    "ngo.title": "این جی او ڈیش بورڈ",
    "ngo.requests": "کھلی درخواستیں",
    "ngo.fulfilled": "مکمل کے طور پر نشان زد کریں",

    // Map
    "map.title": "عطیات اور درخواست کا نقشہ",
    "map.donations": "حالیہ عطیات",
    "map.requests": "زیر التواء درخواستیں",

    // Transparency
    "transparency.title": "عطیات کی شفافیت",
    "transparency.subtitle": "دیکھیں کہ آپ کے عطیات کیسے فرق لا رہے ہیں",
    "transparency.recent": "حالیہ عطیات",
    "transparency.anonymous": "گمنام عطیہ دہندہ",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return (
      translations[language][key as keyof (typeof translations)["en"]] || key
    );
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
