"use client";
import { Download, CheckCircle2, Calendar, Mail, Phone, Building, GraduationCap, User as UserIcon, X } from "lucide-react";

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
    onClose
}: TicketDisplayProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 sm:p-6">
            <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-fade-in-up">
                {/* Header Bar */}
                <div className="bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 to-green-500 h-1.5"></div>

                <div className="p-5 sm:p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

                        {/* Left Side: QR & ID */}
                        <div className="flex flex-col items-center w-full md:w-1/3 space-y-4">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-full mb-2">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-800">Registration Confirmed</h2>
                                <p className="text-sm text-gray-500">You are all set!</p>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                <img src={qr} alt="QR Code" className="w-40 h-40 object-contain" />
                            </div>

                            <div className="text-center w-full">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">TICKET ID</p>
                                <div className="bg-gray-50 py-1.5 px-3 rounded-lg border border-gray-100">
                                    <p className="text-lg font-mono font-bold text-gray-800 tracking-tight break-all">{ticketId}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Details & Actions */}
                        <div className="flex flex-col w-full md:w-2/3 justify-between h-full space-y-6">

                            {/* User Details Grid */}
                            <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-100">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Attendee Details</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                    {name && (
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><UserIcon className="w-3.5 h-3.5" /></div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase">Name</p>
                                                <p className="text-sm font-semibold text-gray-800 leading-tight">{name}</p>
                                            </div>
                                        </div>
                                    )}
                                    {email && (
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-red-100 text-red-600 rounded-lg"><Mail className="w-3.5 h-3.5" /></div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase">Email</p>
                                                <p className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[140px]" title={email}>{email}</p>
                                            </div>
                                        </div>
                                    )}
                                    {phone && (
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-green-100 text-green-600 rounded-lg"><Phone className="w-3.5 h-3.5" /></div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase">Phone</p>
                                                <p className="text-sm font-semibold text-gray-800 leading-tight">{phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {department && (
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-lg"><Building className="w-3.5 h-3.5" /></div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase">Department</p>
                                                <p className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[140px]" title={department}>{department}</p>
                                            </div>
                                        </div>
                                    )}
                                    {campus && (
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg"><GraduationCap className="w-3.5 h-3.5" /></div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase">Campus</p>
                                                <p className="text-sm font-semibold text-gray-800 leading-tight">{campus}</p>
                                            </div>
                                        </div>
                                    )}
                                    {year && (
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><Calendar className="w-3.5 h-3.5" /></div>
                                            <div>
                                                <p className="text-[10px] text-gray-500 font-medium uppercase">Year</p>
                                                <p className="text-sm font-semibold text-gray-800 leading-tight">{year}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notice */}
                            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 flex items-start gap-3">
                                <div className="text-amber-500 mt-0.5"><CheckCircle2 className="w-4 h-4" /></div>
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    <strong>Important:</strong> Show this QR code at the event entrance for check-in.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onDownload}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    Download Ticket
                                </button>
                                {onClose && (
                                    <button
                                        onClick={onClose}
                                        className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center"
                                        aria-label="Close"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
        </div>
    );
}
