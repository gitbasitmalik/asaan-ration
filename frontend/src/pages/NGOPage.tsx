"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/components/language-provider";
import { useNGOAuth } from "@/components/ngo-auth-provider";
import {
  Shield,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";

// --- Types ---
type Request = {
  _id?: string;
  name: string;
  location?: string;
  familySize?: number;
  needType?: string;
  status?: string;
  submittedAt?: string;
  description?: string;
  urgency?: string;
  contact?: string;
  cnic?: string;
  createdAt?: string;
  completedBy?: string;
};
type Donation = {
  _id?: string;
  name: string;
  location?: string;
  foodType?: string;
  description?: string;
  contact?: string;
  quantity?: string;
  quantityUnit?: string;
};
type AllocationModalProps = {
  open: boolean;
  onClose: () => void;
  request: Request | null;
  donations: Donation[];
  onAllocate: (
    donation: Donation,
    request: Request,
    allocateQty: number
  ) => void;
};

// --- Allocation Modal ---
function AllocationModal({
  open,
  onClose,
  request,
  donations,
  onAllocate,
}: AllocationModalProps) {
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    if (open) {
      const initial: { [id: string]: number } = {};
      donations.forEach((d) => {
        if (d._id && Number(d.quantity) > 0) {
          initial[d._id] = 1;
        }
      });
      setQuantities(initial);
    }
  }, [open, donations]);

  if (!open || !request) return null;

  const handleQuantityChange = (id: string, max: number, value: string) => {
    let qty = Math.max(1, Math.min(Number(value), max));
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Allocate Donation</h2>
        <p className="mb-2">
          Select a donation and quantity to allocate to <b>{request.name}</b>:
        </p>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {donations.filter((d) => Number(d.quantity) > 0).length === 0 && (
            <div className="text-sm text-muted-foreground">
              No available donations.
            </div>
          )}
          {donations
            .filter((d) => Number(d.quantity) > 0)
            .map((donation) => {
              const maxQty = Number(donation.quantity);
              return (
                <div
                  key={donation._id}
                  className="border rounded p-2 flex justify-between items-center gap-2"
                >
                  <div>
                    <div className="font-semibold">
                      {donation.foodType} ({donation.quantity}{" "}
                      {donation.quantityUnit})
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {donation.name} - {donation.location}
                    </div>
                  </div>
                  <input
                    type="number"
                    min={1}
                    max={maxQty}
                    value={quantities[donation._id!] || 1}
                    onChange={(e) =>
                      handleQuantityChange(
                        donation._id!,
                        maxQty,
                        e.target.value
                      )
                    }
                    className="w-16 border rounded px-1 py-0.5 text-center"
                  />
                  <button
                    className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80"
                    onClick={() =>
                      onAllocate(
                        donation,
                        request,
                        quantities[donation._id!] || 1
                      )
                    }
                  >
                    Allocate
                  </button>
                </div>
              );
            })}
        </div>
        <button className="mt-4 text-sm text-blue-600" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function NGOPage() {
  const { t, language } = useLanguage();
  const { ngo, login, signup, logout, isLoading } = useNGOAuth();
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    registrationNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [request, setRequest] = useState<Request[]>([]);
  const [donation, setDonation] = useState<Donation[]>([]);
  const [error, setError] = useState("");

  // Modal state
  const [allocationModalOpen, setAllocationModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  // Fetch requests and donations
  useEffect(() => {
    axios
      .get("https://asaan-ration-d15a.vercel.app/request", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ngo_token")}`,
        },
      })
      .then((res) => setRequest(res.data))
      .catch((err) => console.error("Error fetching requests:", err));
  }, []);
  useEffect(() => {
    axios
      .get("https://asaan-ration-d15a.vercel.app/donations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ngo_token")}`,
        },
      })
      .then((res) => setDonation(res.data))
      .catch((err) => console.error("Error fetching donations:", err));
  }, []);

  // Auth handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(loginData.email, loginData.password);
    } catch (err: any) {
      setError(err);
    }
  };
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      await signup({
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
        city: signupData.city,
        registrationNumber: signupData.registrationNumber,
        password: signupData.password,
      });
      setAuthMode("login");
      setError("Signup successful! Await admin approval.");
    } catch (err: any) {
      setError(err);
    }
  };

  const handleOpenAllocateModal = (request: Request) => {
    setSelectedRequest(request);
    setAllocationModalOpen(true);
  };

  const handleAllocate = async (
    donationItem: Donation,
    requestItem: Request,
    allocateQty: number
  ) => {
    const qty = Number(donationItem.quantity || 0);
    if (qty <= 0 || allocateQty <= 0 || allocateQty > qty) return;

    try {
      if (!ngo || typeof ngo !== "object") {
        alert("NGO information is missing. Please log in again.");
        return;
      }
      await axios.patch(
        `https://asaan-ration-d15a.vercel.app/request/${requestItem._id}`,
        {
          status: "completed",
          completedBy: ngo._id || ngo.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ngo_token")}`,
          },
        }
      );
      await axios.patch(
        `https://asaan-ration-d15a.vercel.app/donations/${donationItem._id}`,
        {
          quantity: qty - allocateQty,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ngo_token")}`,
          },
        }
      );

      setRequest((prev) =>
        prev.map((r) =>
          r._id === requestItem._id
            ? { ...r, status: "completed", completedBy: ngo._id || ngo.email }
            : r
        )
      );
      setDonation((prev) =>
        prev.map((d) =>
          d._id === donationItem._id
            ? { ...d, quantity: String(qty - allocateQty) }
            : d
        )
      );
    } catch (err) {
      alert("Failed to allocate. Please try again.");
    }

    setAllocationModalOpen(false);
    setSelectedRequest(null);
  };

  // --- Stats ---
  const familiesHelped = request.filter(
    (r) =>
      r.status === "completed" &&
      r.completedBy ===
        (ngo && typeof ngo === "object" ? ngo._id || ngo.email : "")
  ).length;

  const today = new Date();
  const fulfilledToday = request.filter((r) => {
    if (
      r.status !== "completed" ||
      r.completedBy !==
        (ngo && typeof ngo === "object" ? ngo._id || ngo.email : "")
    )
      return false;
    const dateStr = r.createdAt || r.submittedAt;
    if (!dateStr) return false;
    const reqDate = new Date(dateStr);
    return (
      reqDate.getFullYear() === today.getFullYear() &&
      reqDate.getMonth() === today.getMonth() &&
      reqDate.getDate() === today.getDate()
    );
  }).length;

  if (!ngo || typeof ngo !== "object") {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
            <CardTitle
              className={`text-2xl ${language === "ur" ? "font-urdu" : ""}`}
            >
              {authMode === "login" ? "NGO Login" : "NGO Registration"}
            </CardTitle>
            <CardDescription className={language === "ur" ? "font-urdu" : ""}>
              {authMode === "login"
                ? "Login to access your NGO dashboard"
                : "Register your NGO to start helping families"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={authMode}
              onValueChange={(value) =>
                setAuthMode(value as "login" | "signup")
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      t("btn.login")
                    )}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ngo-name">NGO Name</Label>
                    <Input
                      id="ngo-name"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({ ...signupData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            phone: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={signupData.city}
                        onChange={(e) =>
                          setSignupData({ ...signupData, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-number">Registration #</Label>
                      <Input
                        id="reg-number"
                        value={signupData.registrationNumber}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            registrationNumber: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-500 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create NGO Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- NGO Dashboard ---
  return (
    <div className="min-h-screen py-12 px-4">
      <AllocationModal
        open={allocationModalOpen}
        onClose={() => setAllocationModalOpen(false)}
        request={selectedRequest}
        donations={donation}
        onAllocate={handleAllocate}
      />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1
              className={`text-4xl font-bold mb-2 ${
                language === "ur" ? "font-urdu" : ""
              }`}
            >
              {t("ngo.title")}
            </h1>
            <p className="text-xl text-muted-foreground">
              Welcome back, {ngo.name}!
            </p>
            <p className="text-sm text-muted-foreground">
              {ngo.city} • {ngo.registrationNumber}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Open Requests
                  </p>
                  <p className="text-2xl font-bold">
                    {request.filter((r) => r.status !== "completed").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Available Donations
                  </p>
                  <p className="text-2xl font-bold">
                    {donation.filter((d) => Number(d.quantity) > 0).length}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fulfilled Today
                  </p>
                  <p className="text-2xl font-bold">{fulfilledToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Families Helped
                  </p>
                  <p className="text-2xl font-bold">{familiesHelped}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">Assistance Requests</TabsTrigger>
            <TabsTrigger value="donations">Available Donations</TabsTrigger>
            <TabsTrigger value="completed">Completed Requests</TabsTrigger>
          </TabsList>

          {/* Pending Requests */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className={language === "ur" ? "font-urdu" : ""}>
                  {t("ngo.requests")}
                </CardTitle>
                <CardDescription>
                  Review and manage incoming assistance requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {request
                    .filter((req) => req.status !== "completed")
                    .map((req) => (
                      <div
                        className="border rounded-lg p-4 space-y-3"
                        key={req._id}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">Name: {req.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Location:{" "}
                              {req.location || "Location not provided"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                req.status === "pending"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {req.status}
                            </Badge>
                            {req.status !== "completed" && (
                              <Button
                                size="sm"
                                onClick={() => handleOpenAllocateModal(req)}
                              >
                                Allocate
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Family Size:</span>{" "}
                            {req.familySize}
                          </div>
                          <div>
                            <span className="font-medium">Need Type:</span>{" "}
                            {req.needType}
                          </div>
                          <div>
                            <span className="font-medium">CNIC Number:</span>{" "}
                            {req.cnic || "Not provided"}
                          </div>
                          <div>
                            <span className="font-medium">Contact:</span>{" "}
                            {req.contact}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Description: {req.description}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Donations */}
          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>Available Donations</CardTitle>
                <CardDescription>
                  Manage and allocate incoming donations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {donation
                    .filter((donation) => Number(donation.quantity) > 0)
                    .map((donation) => (
                      <div
                        key={donation._id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">
                              Donor: {donation.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Food Type: {donation.foodType}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Quantity: {donation.quantity}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Unit: {donation.quantityUnit}
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Location:</span>
                            {donation.location}
                          </div>
                          <div>
                            <span className="font-medium">Contact:</span>
                            {donation.contact}
                          </div>
                          <div>
                            <span className="font-medium">Description:</span>
                            {donation.description}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Requests */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Requests</CardTitle>
                <CardDescription>
                  Record of all fulfilled allocations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {request.filter(
                    (req) =>
                      req.status === "completed" &&
                      req.completedBy === (ngo._id || ngo.email)
                  ).length === 0 && (
                    <div className="text-muted-foreground">
                      No completed requests yet.
                    </div>
                  )}
                  {request
                    .filter(
                      (req) =>
                        req.status === "completed" &&
                        req.completedBy === (ngo._id || ngo.email)
                    )
                    .map((req) => (
                      <div
                        className="border rounded-lg p-4 space-y-3"
                        key={req._id}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">Name: {req.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              Location:{" "}
                              {req.location || "Location not provided"}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary">completed</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Family Size:</span>{" "}
                            {req.familySize}
                          </div>
                          <div>
                            <span className="font-medium">Need Type:</span>{" "}
                            {req.needType}
                          </div>
                          <div>
                            <span className="font-medium">CNIC Number:</span>{" "}
                            {req.cnic || "Not provided"}
                          </div>
                          <div>
                            <span className="font-medium">Contact:</span>{" "}
                            {req.contact}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Description: {req.description}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
