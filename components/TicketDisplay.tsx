"use client";
import {
  Download,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  Building,
  GraduationCap,
  User as UserIcon,
  X,
} from "lucide-react";

interface TicketDisplayProps {
  ticketId: string;
  qr: string;
  name?: string;
  email?: string;
  phone?: string;
  department?: string;
  campus?: string;
  year?: string;
  onDownload: () => void;
  onClose?: () => void;
}

export default function TicketDisplay({
  ticketId,
  qr,
  name,
  email,
  phone,
  department,
  campus,
  year,
  onDownload,
  onClose,
}: TicketDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-3 sm:p-6">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in-up">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 h-1.5"></div>

        <div className="p-4 sm:p-8">
          <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-center md:items-start">
            {/* Left Side: QR & ID */}
            <div className="flex flex-col items-center w-full md:w-1/3 space-y-4">
              <div className="flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-0 sm:text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-green-100 text-green-600 rounded-full sm:mb-2">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="text-left sm:text-center">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Registration Confirmed
                  </h2>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    You are all set!
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <img
                  src={qr}
                  alt="QR Code"
                  className="w-40 h-40 object-contain"
                />
              </div>

              <div className="text-center w-full">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  TICKET ID
                </p>
                <div className="bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-100">
                  <p className="text-lg font-mono font-bold text-gray-800 tracking-tight break-all">
                    {ticketId}
                  </p>
                </div>
              </div>

              {/* WhatsApp Group Link */}
              <a
                href="https://chat.whatsapp.com/IyWFtxgp9Mh29d4K3eIjMB"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Join WhatsApp Group
              </a>

              {/* Actions moved to left column for better mobile flow */}
              <div className="flex flex-col gap-3 w-full pt-2">
                <button
                  onClick={onDownload}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Download Ticket
                </button>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="sm:hidden bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Side: Details & Actions */}
            <div className="flex flex-col w-full md:w-2/3 justify-between h-full space-y-4 sm:space-y-6">
              {/* Notice Moved Up */}
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-start gap-3">
                <div className="text-amber-500 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Important:</strong> Show this QR code at the event
                  entrance for check-in.
                </p>
              </div>

              {/* User Details Grid */}
              <div className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 border-b border-slate-200 pb-2">
                  Attendee Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                  {name && (
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                        <UserIcon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase">
                          Name
                        </p>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {name}
                        </p>
                      </div>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase">
                          Email
                        </p>
                        <p
                          className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[140px]"
                          title={email}
                        >
                          {email}
                        </p>
                      </div>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase">
                          Phone
                        </p>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {department && (
                    <div className="hidden sm:flex items-center gap-2.5">
                      <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg">
                        <Building className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase">
                          Department
                        </p>
                        <p
                          className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[140px]"
                          title={department}
                        >
                          {department}
                        </p>
                      </div>
                    </div>
                  )}
                  {campus && (
                    <div className="hidden sm:flex items-center gap-2.5">
                      <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                        <GraduationCap className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase">
                          Campus
                        </p>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {campus}
                        </p>
                      </div>
                    </div>
                  )}
                  {year && (
                    <div className="hidden sm:flex items-center gap-2.5">
                      <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 font-medium uppercase">
                          Year
                        </p>
                        <p className="text-sm font-semibold text-gray-800 leading-tight">
                          {year}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions for Desktop Header (Optional: User button if needed in future) */}
              {onClose && (
                <div className="hidden sm:flex justify-end pt-2">
                  <button
                    onClick={onClose}
                    className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
