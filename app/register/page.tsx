"use client";
import { useState, useEffect } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Loader2, Download, CheckCircle2, User as UserIcon, Mail, Phone, Building, GraduationCap, Calendar } from "lucide-react";

export default function RegisterPage() {
  const { user, isLoaded, isSignedIn } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    campus: "",
    year: ""
  });

  const [qr, setQr] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-fill email and name from Clerk user
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || ""
      }));
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.department.trim()) newErrors.department = "Department is required";
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
          year: form.year
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await res.json();
      setQr(data.qr);
      setTicketId(data.ticketId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qr) return;
    const link = document.createElement('a');
    link.href = qr;
    link.download = `gdg-study-jam-ticket-${ticketId}.png`;
    link.click();
  };

  const resetForm = () => {
    setForm({
      name: user?.fullName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phone: "",
      department: "",
      campus: "",
      year: ""
    });
    setQr(null);
    setTicketId("");
    setError("");
    setErrors({});
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
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
              <span className="text-xl font-normal text-gray-700">Google Developer Groups</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-16 text-center">
          <h1 className="text-5xl font-normal text-gray-900 mb-4">Study Jam Registration</h1>
          <p className="text-xl text-gray-600 mb-8">Please sign in to register for the event</p>

          <SignInButton mode="modal">
            <button className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Sign In to Register
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // Success page
  if (qr) {
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
              <span className="text-xl font-normal text-gray-700">Google Developer Groups</span>
            </div>
            <UserButton />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-normal text-gray-900 mb-4">All set!</h1>
            <p className="text-xl text-gray-600">You have been successfully registered</p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 h-2"></div>

            <div className="p-8">
              <div className="text-center mb-8">
                <p className="text-sm font-medium text-gray-500 mb-2">TICKET ID</p>
                <p className="text-3xl font-mono font-medium text-gray-900">{ticketId}</p>
              </div>

              <div className="flex justify-center mb-8">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                  <img src={qr} alt="QR Code" className="w-72 h-72" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Important</p>
                    <p>Please save this QR code. You will need to present it at the event entrance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={downloadQR}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
          >
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
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
            <span className="text-xl font-normal text-gray-700">Google Developer Groups</span>
          </div>
          <UserButton />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-normal text-gray-900 mb-4">Study Jam Registration</h1>
          <p className="text-xl text-gray-600">Join us for an amazing learning experience</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 h-2"></div>

          <div className="p-8">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                  />
                </div>
                {errors.name && <p className="text-red-600 text-sm mt-2 ml-1">{errors.name}</p>}
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
                <p className="text-xs text-gray-500 mt-2 ml-1">Email from your account</p>
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
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="Enter your phone number"
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                  />
                </div>
                {errors.phone && <p className="text-red-600 text-sm mt-2 ml-1">{errors.phone}</p>}
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
                      onChange={e => setForm({ ...form, department: e.target.value })}
                      placeholder="e.g., Computer Science"
                      className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.department ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                    />
                  </div>
                  {errors.department && <p className="text-red-600 text-sm mt-2 ml-1">{errors.department}</p>}
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
                      onChange={e => setForm({ ...form, campus: e.target.value })}
                      placeholder="e.g., SOE CUSAT"
                      className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.campus ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
                    />
                  </div>
                  {errors.campus && <p className="text-red-600 text-sm mt-2 ml-1">{errors.campus}</p>}
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
                    onChange={e => setForm({ ...form, year: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 ${errors.year ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}`}
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
                {errors.year && <p className="text-red-600 text-sm mt-2 ml-1">{errors.year}</p>}
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
                  'Complete Registration'
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