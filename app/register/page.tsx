"use client";
import { useState } from "react";
import { Loader2, Download, CheckCircle2, Users, Lightbulb, Mail, User } from "lucide-react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    teamName: "",
    idea: "",
    leaderName: "",
    leaderEmail: "",
    members: ""
  });

  const [qr, setQr] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.teamName.trim()) newErrors.teamName = "Team name is required";
    if (!form.idea.trim()) newErrors.idea = "Event idea is required";
    if (!form.leaderName.trim()) newErrors.leaderName = "Leader name is required";

    if (!form.leaderEmail.trim()) {
      newErrors.leaderEmail = "Leader email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.leaderEmail)) {
      newErrors.leaderEmail = "Please enter a valid email";
    }

    if (!form.members.trim()) {
      newErrors.members = "At least one team member is required";
    }

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
          ...form,
          members: form.members.split(",").map(m => m.trim()).filter(Boolean)
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
    link.download = `gdg-event-ticket-${ticketId}.png`;
    link.click();
  };

  const resetForm = () => {
    setForm({
      teamName: "",
      idea: "",
      leaderName: "",
      leaderEmail: "",
      members: ""
    });
    setQr(null);
    setTicketId("");
    setError("");
    setErrors({});
  };

  if (qr) {
    return (
      <div className="min-h-screen bg-white">
        {/* GDG Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-xl font-normal text-gray-700">Google Developer Groups</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-normal text-gray-900 mb-4">All set!</h1>
            <p className="text-xl text-gray-600">Your team has been successfully registered</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden mb-8">
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

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={downloadQR}
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-3"
            >
              <Download className="w-5 h-5" />
              Download Ticket
            </button>
            <button
              onClick={resetForm}
              className="flex-1 bg-white text-gray-700 py-4 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all border border-gray-300 flex items-center justify-center gap-3"
            >
              Register Another Team
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* GDG Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xl font-normal text-gray-700">Google Developer Groups</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-normal text-gray-900 mb-4">Event Registration</h1>
          <p className="text-xl text-gray-600">Join us for an amazing developer experience</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={form.teamName}
                    onChange={e => setForm({ ...form, teamName: e.target.value })}
                    placeholder="Enter your team name"
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.teamName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                  />
                </div>
                {errors.teamName && <p className="text-red-600 text-sm mt-2 ml-1">{errors.teamName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Idea
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-4 pointer-events-none">
                    <Lightbulb className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    value={form.idea}
                    onChange={e => setForm({ ...form, idea: e.target.value })}
                    placeholder="Describe your innovative event idea"
                    rows={4}
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder-gray-400 ${errors.idea ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                  />
                </div>
                {errors.idea && <p className="text-red-600 text-sm mt-2 ml-1">{errors.idea}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Leader Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={form.leaderName}
                      onChange={e => setForm({ ...form, leaderName: e.target.value })}
                      placeholder="Leader name"
                      className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.leaderName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                    />
                  </div>
                  {errors.leaderName && <p className="text-red-600 text-sm mt-2 ml-1">{errors.leaderName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Leader Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={form.leaderEmail}
                      onChange={e => setForm({ ...form, leaderEmail: e.target.value })}
                      placeholder="leader@example.com"
                      className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 ${errors.leaderEmail ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                        }`}
                    />
                  </div>
                  {errors.leaderEmail && <p className="text-red-600 text-sm mt-2 ml-1">{errors.leaderEmail}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members
                </label>
                <div className="relative">
                  <div className="absolute top-3.5 left-4 pointer-events-none">
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <textarea
                    value={form.members}
                    onChange={e => setForm({ ...form, members: e.target.value })}
                    placeholder="John Doe, Jane Smith, Mike Johnson"
                    rows={3}
                    className={`w-full pl-12 pr-4 py-3.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 placeholder-gray-400 ${errors.members ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                  />
                </div>
                {errors.members && <p className="text-red-600 text-sm mt-2 ml-1">{errors.members}</p>}
                <p className="text-xs text-gray-500 mt-2 ml-1">Separate member names with commas</p>
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering your team...
                  </>
                ) : (
                  'Register Team'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By registering, you agree to our event terms and conditions
          </p>
        </div>
      </div>
    </div>
  );
}