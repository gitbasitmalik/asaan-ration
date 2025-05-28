"use client";

import type React from "react";
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";
import { Heart, Phone, Package } from "lucide-react";

export default function DonatePage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    location: "",
    foodType: "",
    quantity: "",
    description: "",
    quantityUnit: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.VITE_API_URL}/donate`, formData);
      // Optionally show a success message here
    } catch (error) {
      // Optionally show an error message here
    }
  };

  const foodTypes = [
    "Rice/چاول",
    "Wheat/گندم",
    "Lentils/دال",
    "Cooking Oil/کھانا پکانے کا تیل",
    "Sugar/چینی",
    "Tea/چائے",
    "Flour/آٹا",
    "Canned Food/ڈبہ بند کھانا",
    "Fresh Vegetables/تازہ سبزیاں",
    "Other/دیگر",
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1
            className={`text-4xl font-bold mb-4 ${
              language === "ur" ? "font-urdu" : ""
            }`}
          >
            {language === "ur" ? "عطیہ دیں" : t("home.donate.title")}
          </h1>
          <p
            className={`text-xl text-muted-foreground ${
              language === "ur" ? "font-urdu" : ""
            }`}
          >
            {language === "ur"
              ? "اپنا عطیہ دیں اور کسی کی زندگی بدلیں"
              : t("home.donate.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className={language === "ur" ? "font-urdu" : ""}>
                  {language === "ur" ? "عطیہ کی تفصیلات" : "Donation Details"}
                </CardTitle>
                <CardDescription
                  className={language === "ur" ? "font-urdu" : ""}
                >
                  {language === "ur"
                    ? "براہ کرم اپنے عطیہ کی مکمل تفصیلات فراہم کریں"
                    : "Please provide details about your food donation"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className={language === "ur" ? "font-urdu" : ""}
                      >
                        {language === "ur" ? "نام" : t("form.name")}
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="contact"
                        className={language === "ur" ? "font-urdu" : ""}
                      >
                        {language === "ur" ? "رابطہ نمبر" : t("form.contact")}
                      </Label>
                      <Input
                        id="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={(e) =>
                          setFormData({ ...formData, contact: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="location"
                      className={language === "ur" ? "font-urdu" : ""}
                    >
                      {language === "ur" ? "شہر / علاقہ" : t("form.location")}
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={language === "ur" ? "font-urdu" : ""}>
                        {language === "ur" ? "کھانے کی قسم" : t("form.type")}
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setFormData({ ...formData, foodType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === "ur" ? "کھانے کی قسم منتخب کریں" : "Select food type"} />
                        </SelectTrigger>
                        <SelectContent>
                          {foodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="quantity"
                        className={language === "ur" ? "font-urdu" : ""}
                      >
                        {language === "ur" ? "مقدار" : t("form.quantity")}
                      </Label>
                      <input
                        type="number"
                        id="quantity"
                        placeholder={language === "ur" ? "مثلاً 10" : "e.g., 10"}
                        value={formData.quantity}
                        onChange={(e) =>
                          setFormData({ ...formData, quantity: e.target.value })
                        }
                        required
                        className="border px-3 py-2 rounded w-32"
                      />
                      <select
                        value={formData.quantityUnit}
                        onChange={(e) =>
                          setFormData({ ...formData, quantityUnit: e.target.value })
                        }
                        className="border px-2 py-2 rounded"
                      >
                        <option value="">{language === "ur" ? "یونٹ منتخب کریں" : "Select Unit"}</option>
                        <option value="kg">{language === "ur" ? "کلوگرام" : "kg"}</option>
                        <option value="bag">{language === "ur" ? "بیگ" : "bag"}</option>
                        <option value="litre">{language === "ur" ? "لیٹر" : "litre"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className={language === "ur" ? "font-urdu" : ""}
                    >
                      {language === "ur" ? "تفصیل" : t("form.description")}
                    </Label>
                    <Textarea
                      id="description"
                      placeholder={language === "ur" ? "عطیہ کی مزید تفصیلات..." : "Additional details about the donation..."}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    {language === "ur" ? "جمع کروائیں" : t("form.submit")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    language === "ur" ? "font-urdu" : ""
                  }`}
                >
                  <Package className="h-5 w-5" />
                  {language === "ur" ? "عطیہ رہنما اصول" : "Donation Guidelines"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "یقینی بنائیں کہ کھانے کی اشیاء تازہ اور معیاد کے اندر ہوں"
                      : "Ensure food items are fresh and within expiry date"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "اشیاء کو صاف اور بند پیکنگ میں رکھیں"
                      : "Pack items in clean, sealed containers"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "ہماری ٹیم 24 گھنٹوں میں آپ سے رابطہ کرے گی"
                      : "Our team will contact you within 24 hours"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "بڑے شہروں میں مفت پک اپ دستیاب ہے"
                      : "Free pickup available in major cities"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle
                  className={`flex items-center gap-2 ${
                    language === "ur" ? "font-urdu" : ""
                  }`}
                >
                  <Phone className="h-5 w-5" />
                  {language === "ur" ? "مدد چاہیے؟" : "Need Help?"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "ur"
                    ? "مدد کے لیے ہماری سپورٹ ٹیم سے رابطہ کریں"
                    : "Contact our support team for assistance"}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">📞 +92-300-1234567</p>
                  <p className="text-sm font-medium">📧 help@AsaanRation.pk</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}