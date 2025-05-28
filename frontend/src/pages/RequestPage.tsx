import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { Users, Heart, Shield, MapPin } from "lucide-react"
import InteractiveMap from "@/components/interactive-map"
import axios from "axios"

export default function RequestPage() {
  const { t, language } = useLanguage()
  const [showMap, setShowMap] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    location: "",
    cnic : "",
    familySize: "",
    needType: "",
    description: "",
  })

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.VITE_API_URL}/`, formData)
      // Handle success response
    } catch (error) {
      console.error("Error submitting request:", error)
      
    }
  }

  const needTypes = [
    language === "ur" ? "ہنگامی خوراک" : "Emergency Food",
    language === "ur" ? "ماہانہ راشن" : "Monthly Rations",
    language === "ur" ? "بچوں کا کھانا" : "Baby Food",
    language === "ur" ? "طبی خوراک" : "Medical Diet",
    language === "ur" ? "بزرگوں کی دیکھ بھال" : "Elderly Care",
    language === "ur" ? "دیگر" : "Other",
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className={`text-4xl font-bold mb-4 ${language === "ur" ? "font-urdu" : ""}`}>
            {language === "ur" ? "راشن کی درخواست" : t("home.request.title")}
          </h1>
          <p className={`text-xl text-muted-foreground ${language === "ur" ? "font-urdu" : ""}`}>
            {language === "ur"
              ? "اگر آپ کو راشن یا خوراک کی ضرورت ہے تو براہ کرم نیچے فارم پُر کریں"
              : t("home.request.desc")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className={language === "ur" ? "font-urdu" : ""}>
                  {language === "ur" ? "درخواست کی تفصیلات" : "Request Details"}
                </CardTitle>
                <CardDescription className={language === "ur" ? "font-urdu" : ""}>
                  {language === "ur"
                    ? "براہ کرم اپنی ضرورت کی مکمل تفصیلات فراہم کریں"
                    : "Please provide details about your assistance needs"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className={language === "ur" ? "font-urdu" : ""}>
                        {language === "ur" ? "نام" : t("form.name")}
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact" className={language === "ur" ? "font-urdu" : ""}>
                        {language === "ur" ? "رابطہ نمبر" : t("form.contact")}
                      </Label>
                      <Input
                        id="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="familySize" className={language === "ur" ? "font-urdu" : ""}>
                        {language === "ur" ? "خاندان کے افراد کی تعداد" : t("form.familySize")}
                      </Label>
                      <Input
                        id="familySize"
                        type="number"
                        min="1"
                        value={formData.familySize}
                        onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnic" className={language === "ur" ? "font-urdu" : ""}>
                        {language === "ur" ? "شناختی کارڈ نمبر" : t("form.cnic")}
                      </Label>
                      <Input
                        id="cnic"
                        type="number"
                        min="1"
                        value={formData.cnic}
                        onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location" className={language === "ur" ? "font-urdu" : ""}>
                        {language === "ur" ? "شہر / علاقہ" : t("form.location")}
                      </Label>
                      <Input
                        id="location"
                        type="location"
                        placeholder={language === "ur" ? "اپنا پتہ یا علاقہ درج کریں" : "Enter your location or address"}
                        min="1"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className={language === "ur" ? "font-urdu" : ""}>
                        {language === "ur" ? "ضرورت کی قسم" : t("form.needType")}
                      </Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, needType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder={language === "ur" ? "ضرورت کی قسم منتخب کریں" : "Select need type"} />
                        </SelectTrigger>
                        <SelectContent>
                          {needTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className={language === "ur" ? "font-urdu" : ""}>
                      {language === "ur" ? "تفصیل" : t("form.description")}
                    </Label>
                    <Textarea
                      id="description"
                      placeholder={language === "ur" ? "اپنی صورتحال اور ضروریات کی وضاحت کریں..." : "Please describe your situation and specific needs..."}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
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
                <CardTitle className={`flex items-center gap-2 ${language === "ur" ? "font-urdu" : ""}`}>
                  <Shield className="h-5 w-5" />
                  {language === "ur" ? "تصدیقی عمل" : "Verification Process"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "تمام درخواستوں کی تصدیق ہماری این جی او ٹیم کرتی ہے"
                      : "All requests are verified by our partner NGOs"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "تصدیق میں عموماً 2-3 دن لگتے ہیں"
                      : "Verification typically takes 2-3 business days"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "ہنگامی کیسز کو ترجیح دی جاتی ہے"
                      : "Priority given to emergency cases"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "آپ کی معلومات کو خفیہ رکھا جاتا ہے"
                      : "Your information is kept confidential"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm">
                    {language === "ur"
                      ? "مقام کی معلومات سے ترسیل میں آسانی ہوتی ہے"
                      : "Location data helps with efficient delivery"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${language === "ur" ? "font-urdu" : ""}`}>
                  <Heart className="h-5 w-5" />
                  {language === "ur" ? "کیا توقع کریں" : "What to Expect"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{language === "ur" ? "1. جمع کروانا" : "1. Submission"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === "ur"
                      ? "آپ کی درخواست موصول اور ریکارڈ کر لی گئی ہے"
                      : "Your request is received and logged"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">{language === "ur" ? "2. تصدیق" : "2. Verification"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === "ur"
                      ? "این جی او ٹیم آپ کی تفصیلات کی تصدیق کرے گی"
                      : "NGO partner verifies your details"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">{language === "ur" ? "3. میچنگ" : "3. Matching"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === "ur"
                      ? "ہم آپ کو دستیاب عطیات سے میچ کریں گے"
                      : "We match you with available donations"}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">{language === "ur" ? "4. ترسیل" : "4. Delivery"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === "ur"
                      ? "راشن آپ تک پہنچا دیا جائے گا"
                      : "Food assistance is delivered to you"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}