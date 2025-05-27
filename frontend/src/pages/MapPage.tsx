// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { useLanguage } from "@/components/language-provider"
// import InteractiveMap from "@/components/interactive-map"
// import { MapPin, Heart, Users, Clock, TrendingUp } from "lucide-react"

// export default function MapPage() {
//   const { t, language } = useLanguage()

//   const mockDonations = [
//     {
//       id: 1,
//       donor: "Ahmed Khan",
//       type: "Rice - 20kg",
//       location: "Karachi",
//       time: "2 hours ago",
//       lat: 24.8607,
//       lng: 67.0011,
//     },
//     {
//       id: 2,
//       donor: "Anonymous",
//       type: "Cooking Oil - 5L",
//       location: "Lahore",
//       time: "4 hours ago",
//       lat: 31.5204,
//       lng: 74.3587,
//     },
//     {
//       id: 3,
//       donor: "Fatima Store",
//       type: "Mixed Rations",
//       location: "Islamabad",
//       time: "6 hours ago",
//       lat: 33.6844,
//       lng: 73.0479,
//     },
//   ]

//   const mockRequests = [
//     {
//       id: 1,
//       family: "Khan Family",
//       need: "Monthly Rations",
//       location: "Karachi",
//       urgency: "high",
//       lat: 24.8615,
//       lng: 67.0099,
//     },
//     {
//       id: 2,
//       family: "Bibi Family",
//       need: "Baby Food",
//       location: "Lahore",
//       urgency: "urgent",
//       lat: 31.5304,
//       lng: 74.3487,
//     },
//     {
//       id: 3,
//       family: "Ali Family",
//       need: "Emergency Food",
//       location: "Faisalabad",
//       urgency: "medium",
//       lat: 31.4504,
//       lng: 73.135,
//     },
//   ]

//   const stats = [
//     { label: "Active Locations", value: "45", icon: MapPin, color: "text-blue-500" },
//     { label: "Recent Donations", value: "23", icon: Heart, color: "text-green-500" },
//     { label: "Pending Requests", value: "18", icon: Users, color: "text-orange-500" },
//     { label: "Real-time Updates", value: "Live", icon: TrendingUp, color: "text-purple-500" },
//   ]

//   return (
//     <div className="min-h-screen py-12 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <MapPin className="h-16 w-16 mx-auto mb-4 text-primary" />
//           <h1 className={`text-4xl font-bold mb-4 ${language === "ur" ? "font-urdu" : ""}`}>{t("map.title")}</h1>
//           <p className={`text-xl text-muted-foreground ${language === "ur" ? "font-urdu" : ""}`}>
//             Real-time interactive view of donations and requests across Pakistan
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, index) => (
//             <Card key={index}>
//               <CardContent className="pt-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
//                     <p className="text-2xl font-bold">{stat.value}</p>
//                   </div>
//                   <stat.icon className={`h-8 w-8 ${stat.color}`} />
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Interactive Map */}
//         <div className="mb-8">
//           <InteractiveMap />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Recent Donations */}
//           <Card>
//             <CardHeader>
//               <CardTitle className={`flex items-center gap-2 ${language === "ur" ? "font-urdu" : ""}`}>
//                 <Heart className="h-5 w-5 text-green-500" />
//                 {t("map.donations")}
//               </CardTitle>
//               <CardDescription>Latest food donations across Pakistan</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {mockDonations.map((donation) => (
//                   <div key={donation.id} className="border rounded-lg p-4">
//                     <div className="flex items-start justify-between mb-2">
//                       <div>
//                         <h4 className="font-semibold">{donation.donor}</h4>
//                         <p className="text-sm text-muted-foreground">{donation.type}</p>
//                       </div>
//                       <Badge
//                         variant="secondary"
//                         className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
//                       >
//                         Donated
//                       </Badge>
//                     </div>
//                     <div className="flex items-center justify-between text-sm text-muted-foreground">
//                       <span className="flex items-center gap-1">
//                         <MapPin className="h-4 w-4" />
//                         {donation.location}
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock className="h-4 w-4" />
//                         {donation.time}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           {/* Pending Requests */}
//           <Card>
//             <CardHeader>
//               <CardTitle className={`flex items-center gap-2 ${language === "ur" ? "font-urdu" : ""}`}>
//                 <Users className="h-5 w-5 text-blue-500" />
//                 {t("map.requests")}
//               </CardTitle>
//               <CardDescription>Families waiting for assistance</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {mockRequests.map((request) => (
//                   <div key={request.id} className="border rounded-lg p-4">
//                     <div className="flex items-start justify-between mb-2">
//                       <div>
//                         <h4 className="font-semibold">{request.family}</h4>
//                         <p className="text-sm text-muted-foreground">{request.need}</p>
//                       </div>
//                       <Badge
//                         variant={
//                           request.urgency === "urgent"
//                             ? "destructive"
//                             : request.urgency === "high"
//                               ? "default"
//                               : "secondary"
//                         }
//                       >
//                         {request.urgency}
//                       </Badge>
//                     </div>
//                     <div className="flex items-center text-sm text-muted-foreground">
//                       <MapPin className="h-4 w-4 mr-1" />
//                       {request.location}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>


//       </div>
//     </div>
//   )
// }
