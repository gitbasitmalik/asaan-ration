"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, MapPin, Clock } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { formatDistanceToNow } from "date-fns"

export default function HomePage() {
  const { t, language } = useLanguage()

  const [donationCount, setDonationCount] = useState(0)
  const [familiesHelped, setFamiliesHelped] = useState(0)
  const [openRequests, setOpenRequests] = useState(0)
  const [activityFeed, setActivityFeed] = useState<any[]>([])

  useEffect(() => {
    let donationActivities: any[] = []
    let requestActivities: any[] = []

    // Fetch donations and sum all quantities
    axios.get(`${process.env.VITE_API_URL}/donations`)
      .then(res => {
        const total = res.data.reduce(
          (sum: number, d: any) => sum + (Number(d.quantity) || 0),
          0
        )
        setDonationCount(total)

        // Prepare donation activities
        donationActivities = res.data
          .filter((d: any) => d.createdAt)
          .map((d: any) => ({
            type: "donation",
            message: language === "ur"
              ? `نئی عطیہ: ${d.quantity}${d.quantityUnit || ""} ${d.foodType || ""} (${d.location || "نامعلوم"})`
              : `New donation: ${d.quantity}${d.quantityUnit || ""} ${d.foodType || ""} in ${d.location || "Unknown"}`,
            date: d.createdAt,
          }))
        setActivityFeed((prev: any[]) => [...prev, ...donationActivities])
      })
      .catch(() => setDonationCount(0))

    // Fetch requests and count completed & open
    axios.get(`${process.env.VITE_API_URL}/request`)
      .then(res => {
        const completed = res.data.filter((r: any) => r.status === "completed").length
        setFamiliesHelped(completed)
        const open = res.data.filter((r: any) => r.status !== "completed").length
        setOpenRequests(open)

        // Prepare request activities
        requestActivities = res.data
          .filter((r: any) => r.status === "completed" && r.createdAt)
          .map((r: any) => ({
            type: "request",
            message: language === "ur"
              ? `درخواست پوری ہوئی: ${r.name || "ایک خاندان"} کو راشن مل گیا`
              : `Request fulfilled: ${r.name || "A family"} received rations`,
            date: r.createdAt,
          }))
        setActivityFeed((prev: any[]) => [...prev, ...requestActivities])
      })
      .catch(() => {
        setFamiliesHelped(0)
        setOpenRequests(0)
      })
  }, [language])

  // Sort and limit to latest 5
  const sortedFeed = activityFeed
    .filter(a => a.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const stats = [
    {
      label: language === "ur" ? "کھلی درخواستیں" : "Open Requests",
      value: openRequests.toLocaleString(),
      icon: Clock
    },
    {
      label: language === "ur" ? "کل عطیات" : t("home.stats.donations"),
      value: donationCount.toLocaleString(),
      icon: Heart
    },
    {
      label: language === "ur" ? "مدد شدہ خاندان" : t("home.stats.families"),
      value: familiesHelped.toLocaleString(),
      icon: Users
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${language === "ur" ? "font-urdu" : ""}`}>
            {language === "ur" ? "راشن برج" : t("home.title")}
          </h1>
          <p className={`text-xl md:text-2xl text-muted-foreground mb-8 ${language === "ur" ? "font-urdu" : ""}`}>
            {language === "ur"
              ? "پاکستان میں بھوک کے خلاف ایک ساتھ"
              : t("home.subtitle")}
          </p>
          <p
            className={`text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed ${language === "ur" ? "font-urdu text-right" : ""}`}
          >
            {language === "ur"
              ? "ہماری مہم کا مقصد ہر ضرورت مند خاندان تک راشن پہنچانا ہے۔ آپ بھی اس مشن کا حصہ بنیں!"
              : t("home.mission")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/donate">{language === "ur" ? "عطیہ دیں" : t("btn.donate")}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/request">{language === "ur" ? "درخواست دیں" : t("btn.request")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className={`text-muted-foreground ${language === "ur" ? "font-urdu" : ""}`}>{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Real-time Updates Section */}
      <section className="py-16 px-4 bg-muted/50">
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>
              {language === "ur" ? "حقیقی وقت کی سرگرمی" : "Real-time Activity Feed"}
            </CardTitle>
            <CardDescription>
              {language === "ur"
                ? "پلیٹ فارم پر ہونے والی تازہ ترین سرگرمیاں"
                : "Live updates from across the platform"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sortedFeed.length === 0 && (
                <div className="text-muted-foreground">
                  {language === "ur" ? "ابھی تک کوئی سرگرمی نہیں۔" : "No recent activity yet."}
                </div>
              )}
              {sortedFeed.map((activity, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    activity.type === "donation"
                      ? "bg-green-50 dark:bg-green-950"
                      : "bg-blue-50 dark:bg-blue-950"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      activity.type === "donation"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <p className={`text-sm ${language === "ur" ? "font-urdu text-right w-full" : ""}`}>
                    {activity.message} - {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${language === "ur" ? "font-urdu" : ""}`}>
                  <Heart className="h-6 w-6 text-primary" />
                  {language === "ur" ? "عطیہ دیں" : t("home.donate.title")}
                </CardTitle>
                <CardDescription className={language === "ur" ? "font-urdu text-right" : ""}>
                  {language === "ur"
                    ? "اپنا عطیہ دیں اور کسی کی زندگی بدلیں"
                    : t("home.donate.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/donate">{language === "ur" ? "عطیہ دیں" : t("btn.donate")}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${language === "ur" ? "font-urdu" : ""}`}>
                  <Users className="h-6 w-6 text-primary" />
                  {language === "ur" ? "درخواست دیں" : t("home.request.title")}
                </CardTitle>
                <CardDescription className={language === "ur" ? "font-urdu text-right" : ""}>
                  {language === "ur"
                    ? "اگر آپ کو راشن کی ضرورت ہے تو یہاں درخواست دیں"
                    : t("home.request.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/request">{language === "ur" ? "درخواست دیں" : t("btn.request")}</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${language === "ur" ? "font-urdu" : ""}`}>
                  <MapPin className="h-6 w-6 text-primary" />
                  {language === "ur" ? "این جی او لاگ ان" : t("home.ngo.title")}
                </CardTitle>
                <CardDescription className={language === "ur" ? "font-urdu text-right" : ""}>
                  {language === "ur"
                    ? "این جی او ڈیش بورڈ میں لاگ ان کریں"
                    : t("home.ngo.desc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="/ngo">{language === "ur" ? "لاگ ان" : t("btn.login")}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${language === "ur" ? "font-urdu" : ""}`}>
            {language === "ur"
              ? "آج ہی ہمارے مشن کا حصہ بنیں"
              : "Join Our Mission Today"}
          </h2>
          <p className={`text-xl mb-8 opacity-90 ${language === "ur" ? "font-urdu" : ""}`}>
            {language === "ur"
              ? "آئیں، ہم سب مل کر پاکستان میں بھوک کا خاتمہ کریں"
              : "Together, we can ensure no family goes hungry in Pakistan"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/map">{language === "ur" ? "نقشہ دیکھیں" : t("btn.viewMap")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link to="/transparency">{language === "ur" ? "شفافیت دیکھیں" : t("btn.learnMore")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}