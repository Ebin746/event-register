import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      
      {/* Google Style Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold tracking-tight">
          <span className="text-blue-500">G</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-500">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>{" "}
          Hackathon 2026
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Build. Innovate. Compete. Win.
        </p>
      </div>

      {/* Event Card */}
      <div className="max-w-xl bg-gray-50 rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">Open Innovation Challenge</h2>
        <p className="text-gray-700 mb-4">
          Theme: AI for Social Good, Web3, Smart Healthcare, FinTech, Climate Tech
        </p>

        <div className="text-left text-sm text-gray-600 mb-6">
          <p><b>Date:</b> March 15–16, 2026</p>
          <p><b>Venue:</b> Google Developer Community Hall</p>
          <p><b>Team Size:</b> 2 – 5 Members</p>
          <p><b>Prize Pool:</b> ₹5,00,000</p>
        </div>

        {/* Main CTA */}
        <Link href="/register">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition">
            🚀 Register Your Team Now
          </button>
        </Link>

        <p className="text-xs text-gray-500 mt-3">
          Click to enter team details and get your QR ticket
        </p>
      </div>
    </main>
  );
}
