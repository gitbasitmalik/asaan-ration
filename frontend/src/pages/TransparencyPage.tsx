"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Eye, Heart, MapPin, Clock, TrendingUp } from "lucide-react"
import { formatDistanceToNow, isThisMonth } from "date-fns"

type Donation = {
  _id?: string
  name?: string
  foodType?: string
  quantity?: string
  quantityUnit?: string
  location?: string
  createdAt?: string
  status?: string
  recipient?: string
  deliveredTo?: string
  deliveredAt?: string
}

type Request = {
  _id?: string
  name?: string
  familySize?: number
  location?: string
  status?: string
  createdAt?: string
}

export default function TransparencyPage() {
  const { t, language } = useLanguage()

  const [donations, setDonations] = useState<Donation[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      axios.get("http://localhost:8000/donations"),
      axios.get("http://localhost:8000/request"),
    ])
      .then(([donRes, reqRes]) => {
        setDonations(donRes.data)
        setRequests(reqRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  // Stats
  const totalDonationsThisMonth = donations.filter(d =>
    d.createdAt && isThisMonth(new Date(d.createdAt))
  ).length

  const familiesFed = requests.filter(r => r.status === "completed").length

  // Unique cities from donations and requests
  const donationCities = donations.map(d => d.location).filter(Boolean)
  const requestCities = requests.map(r => r.location).filter(Boolean)
  const allCities = Array.from(new Set([...donationCities, ...requestCities]))
  const citiesCovered = allCities.length

  const stats = [
    {
      label: language === "ur" ? "اس ماہ کی کل عطیات" : "Total Donations This Month",
      value: totalDonationsThisMonth.toLocaleString(),
      icon: Heart,
      color: "text-red-500"
    },
    {
      label: language === "ur" ? "مدد شدہ خاندان" : "Families Fed",
      value: familiesFed.toLocaleString(),
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      label: language === "ur" ? "شامل شہر" : "Cities Covered",
      value: citiesCovered.toLocaleString(),
      icon: MapPin,
      color: "text-blue-500"
    },
  ]

  // Build recent feed: combine donations and completed requests, sort by date
  const feed = [
    ...donations
      .filter(d => d.createdAt)
      .map(d => ({
        type: "donation",
        donor: d.name || (language === "ur" ? "گمنام" : t("transparency.anonymous")),
        item: `${d.foodType || ""}${d.quantity ? ` - ${d.quantity}${d.quantityUnit || ""}` : ""}`,
        area: d.location || (language === "ur" ? "نامعلوم" : "Unknown"),
        time: d.createdAt,
        status: d.status === "delivered" ? "delivered" : "in-transit",
        recipient: d.deliveredTo || "",
      })),
    ...requests
      .filter(r => r.status === "completed" && r.createdAt)
      .map(r => ({
        type: "request",
        donor: "",
        item: "",
        area: r.location || (language === "ur" ? "نامعلوم" : "Unknown"),
        time: r.createdAt,
        status: "delivered",
        recipient: `${r.name || (language === "ur" ? "خاندان" : "Family")}${r.familySize ? ` (${r.familySize} ${language === "ur" ? "افراد" : "members"})` : ""}`,
      })),
  ]
    .sort((a, b) => new Date(b.time ?? "").getTime() - new Date(a.time ?? "").getTime())
    .slice(0, 10)

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Eye className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className={`text-4xl font-bold mb-4 ${language === "ur" ? "font-urdu" : ""}`}>
            {language === "ur" ? "شفافیت" : t("transparency.title")}
          </h1>
          <p className={`text-xl text-muted-foreground ${language === "ur" ? "font-urdu" : ""}`}>
            {language === "ur"
              ? "ہر عطیہ اور ہر خاندان کی مدد کی مکمل تفصیل یہاں دیکھیں"
              : t("transparency.subtitle")}
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold">{loading ? "..." : stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Donations Feed */}
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${language === "ur" ? "font-urdu" : ""}`}>
              <Heart className="h-5 w-5 text-red-500" />
              {language === "ur" ? "حالیہ سرگرمیاں" : t("transparency.recent")}
            </CardTitle>
            <CardDescription>
              {language === "ur"
                ? "عطیات اور ان کے اثرات کی تازہ ترین معلومات"
                : "Live feed of donations and their impact on families"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loading && <div className="text-muted-foreground">{language === "ur" ? "لوڈ ہو رہا ہے..." : "Loading..."}</div>}
              {!loading && feed.length === 0 && (
                <div className="text-muted-foreground">{language === "ur" ? "ابھی تک کوئی سرگرمی نہیں۔" : "No recent activity yet."}</div>
              )}
              {!loading && feed.map((donation, idx) => (
                <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {donation.type === "donation"
                            ? donation.donor
                            : donation.recipient}
                        </h3>
                        <Badge
                          variant={donation.status === "delivered" ? "default" : "secondary"}
                          className={
                            donation.status === "delivered"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                              : ""
                          }
                        >
                          {donation.status === "delivered"
                            ? language === "ur" ? "پہنچا دیا گیا" : "Delivered"
                            : language === "ur" ? "راستے میں" : "In Transit"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {donation.type === "donation" && (
                          <div>
                            <span className="font-medium text-muted-foreground">
                              {language === "ur" ? "عطیہ:" : "Donated:"}
                            </span>
                            <p className="font-semibold">{donation.item}</p>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-muted-foreground">
                            {language === "ur" ? "وصول کنندہ:" : "Recipient:"}
                          </span>
                          <p className="font-semibold">{donation.recipient || (language === "ur" ? "—" : "—")}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">
                            {language === "ur" ? "مقام:" : "Location:"}
                          </span>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {donation.area}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">
                            {language === "ur" ? "وقت:" : "Time:"}
                          </span>
                          <p className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDistanceToNow(new Date(donation.time ?? ""), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transparency Commitment */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {language === "ur" ? "ہماری شفافیت کی یقین دہانی" : "Our Transparency Commitment"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">
                  {language === "ur" ? "ہم کیا ٹریک کرتے ہیں" : "What We Track"}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {language === "ur" ? "ہر عطیہ کا مکمل ریکارڈ" : "Every donation from source to recipient"}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {language === "ur" ? "حقیقی وقت میں ترسیل کی صورتحال" : "Real-time delivery status updates"}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {language === "ur" ? "اثر کے اعداد و شمار اور نتائج" : "Impact metrics and family outcomes"}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">
                  {language === "ur" ? "پرائیویسی کا تحفظ" : "Privacy Protection"}
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {language === "ur" ? "عطیہ دہندگان کے لیے گمنامی کا آپشن" : "Donor anonymity options available"}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {language === "ur" ? "وصول کنندگان کی تفصیلات خفیہ رکھی جاتی ہیں" : "Recipient details kept confidential"}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {language === "ur" ? "ڈیٹا کو محفوظ طریقے سے ہینڈل کیا جاتا ہے" : "Secure data handling practices"}
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}