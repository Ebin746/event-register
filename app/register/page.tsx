"use client";
import { useState, useEffect } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Loader2,
  User as UserIcon,
  Mail,
  Phone,
  Building,
  GraduationCap,
  Calendar,
  Ticket,
} from "lucide-react";
import TicketDisplay from "@/components/TicketDisplay";

interface TicketData {
  ticketId: string;
  qr: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  campus: string;
  year: string;
}

export default function RegisterPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    campus: "",
    year: "",
  });

  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingRegistration, setCheckingRegistration] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [registrationLimit, setRegistrationLimit] = useState(82);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill email and name from Clerk user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
      }));
    }
  }, [user]);

  // Check if user is already registered
  useEffect(() => {
    if (isSignedIn) {
      checkRegistration();
    }
  }, [isSignedIn]);

  const checkRegistration = async () => {
    setCheckingRegistration(true);
    try {
      const res = await fetch("/api/ticket");
      const data = await res.json();

      setTotalRegistrations(data.totalRegistrations || 0);
      setRegistrationLimit(data.registrationLimit || 82);

      if (res.ok && data.registered) {
        setIsRegistered(true);
        setTicketData({
          ticketId: data.ticketId,
          qr: data.qr,
          name: data.name,
          email: data.email,
          phone: data.phone,
          department: data.department,
          campus: data.campus,
          year: data.year,
        });
      } else {
        setIsRegistered(false);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
      setIsRegistered(false);
    } finally {
      setCheckingRegistration(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.department.trim())
      newErrors.department = "Department is required";
    if (!form.campus.trim()) newErrors.campus = "Campus is required";
    if (!form.year.trim()) newErrors.year = "Year is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    setError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          department: form.department,
          campus: form.campus,
          year: form.year,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await res.json();
      setTicketData({
        ticketId: data.ticketId,
        qr: data.qr,
        name: form.name,
        email: form.email,
        phone: form.phone,
        department: form.department,
        campus: form.campus,
        year: form.year,
      });
      setIsRegistered(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!ticketData) return;
    const link = document.createElement("a");
    link.href = ticketData.qr;
    link.download = `gdg-study-jam-ticket-${ticketData.ticketId}.png`;
    link.click();
  };

  // Loading state
  if (!isLoaded || checkingRegistration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100 animate-fade-in-up">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ticket className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Auth Required
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Please sign in to register for the GDG Study Jam and claim your
            ticket.
          </p>
          <SignInButton mode="modal">
            <button className="w-full py-4 bg-blue-600 text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
              Sign In to Continue
            </button>
          </SignInButton>
          <button
            onClick={() => router.push("/")}
            className="mt-6 text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Already registered - show ticket
  if (isRegistered && ticketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xl font-normal text-gray-700">
                Google Developer Groups
              </span>
            </div>
            <UserButton />
          </div>
        </div>

        <TicketDisplay
          ticketId={ticketData.ticketId}
          qr={ticketData.qr}
          name={ticketData.name}
          email={ticketData.email}
          phone={ticketData.phone}
          department={ticketData.department}
          campus={ticketData.campus}
          year={ticketData.year}
          onDownload={downloadQR}
        />
      </div>
    );
  }

  // Registration Closed UI
  if (!isRegistered && totalRegistrations >= registrationLimit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-xl font-normal text-gray-700">
                Google Developer Groups
              </span>
            </div>
            <UserButton />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden text-center p-12">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Registration Closed
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              We've reached the maximum capacity for this event. Thank you for
              your interest!
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Registration form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xl font-normal text-gray-700">
              Google Developer Groups
            </span>
          </div>
          <UserButton />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-normal text-gray-900 mb-4">
            Study Jam Registration
          </h1>
          <p className="text-xl text-gray-600">
            Join us for an amazing learning experience
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 h-2"></div>

          <div className="p-8">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.name
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                      }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm mt-2 ml-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    readOnly
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1">
                  Email from your account
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="Enter your phone number"
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.phone
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                      }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-2 ml-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) =>
                        setForm({ ...form, department: e.target.value })
                      }
                      placeholder="e.g., Computer Science"
                      className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.department
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                  </div>
                  {errors.department && (
                    <p className="text-red-600 text-sm mt-2 ml-1">
                      {errors.department}
                    </p>
                  )}
                </div>

                {/* Campus */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campus
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <GraduationCap className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={form.campus}
                      onChange={(e) =>
                        setForm({ ...form, campus: e.target.value })
                      }
                      placeholder="e.g., SOE CUSAT"
                      className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.campus
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                        }`}
                    />
                  </div>
                  {errors.campus && (
                    <p className="text-red-600 text-sm mt-2 ml-1">
                      {errors.campus}
                    </p>
                  )}
                </div>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Study
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <select
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 ${errors.year
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                      }`}
                  >
                    <option value="">Select your year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.year && (
                  <p className="text-red-600 text-sm mt-2 ml-1">
                    {errors.year}
                  </p>
                )}
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By registering, you agree to our event terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}
