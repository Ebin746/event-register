"use client"
import React, { useState, useEffect } from 'react';
import { Search, QrCode, CheckCircle, XCircle, Users, Clock, Check, AlertCircle } from 'lucide-react';

// Type definitions
interface Team {
  _id: string;
  ticketId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  idea: string;
  members?: string[];
  checkedIn: boolean;
  checkedInAt?: string;
  createdAt: string;
}

interface QRScannerProps {
  onScan: (ticketId: string) => void;
  onClose: () => void;
}

interface NotificationType {
  message: string;
  type: 'success' | 'warning' | 'error';
}

// QR Scanner Component
const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrame: number | undefined;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        setError('Camera access denied. Use manual search instead.');
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  // Simulate QR scan - in production use jsQR library
  const handleManualInput = () => {
    const ticketId = prompt('Enter Ticket ID (e.g., EVT-ABC12345):');
    if (ticketId) {
      onScan(ticketId.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
        >
          <XCircle className="w-8 h-8" />
        </button>

        <div className="bg-white rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Scan QR Code</h3>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm mb-4">
              {error}
            </div>
          ) : (
            <div className="relative mb-4">
              <video
                ref={videoRef}
                className="w-full rounded-lg bg-gray-900"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-4 border-green-500 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-white"></div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleManualInput}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Enter Ticket ID Manually
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            Note: Install jsQR for automatic scanning
          </p>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard
export default function AdminDashboard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
  const [notification, setNotification] = useState<NotificationType | null>(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = teams.filter(team =>
        team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.leaderName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeams(filtered);
    } else {
      setFilteredTeams(teams);
    }
  }, [searchTerm, teams]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/teams');
      const data = await res.json();

      const teamsData: Team[] = data.teams || [];
      setTeams(teamsData);
      setFilteredTeams(teamsData);

      const verified = teamsData.filter(t => t.checkedIn).length;
      setStats({
        total: teamsData.length,
        verified: verified,
        pending: teamsData.length - verified
      });
    } catch (error) {
      showNotification('Failed to load teams', 'error');
    }
    setLoading(false);
  };

  const verifyTeam = async (ticketId: string) => {
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId })
      });

      const data = await res.json();

      if (res.ok) {
        showNotification(`✓ ${data.team.teamName} verified successfully!`, 'success');
        fetchTeams();
        setShowScanner(false);
      } else if (res.status === 409) {
        showNotification(`Already verified: ${data.team.teamName}`, 'warning');
      } else {
        showNotification(data.error || 'Verification failed', 'error');
      }
    } catch (error) {
      showNotification('Network error. Please try again.', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'warning' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleQRScan = (ticketId: string) => {
    verifyTeam(ticketId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Verification</h1>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-600' :
            notification.type === 'warning' ? 'bg-yellow-600' :
              'bg-red-600'
          } text-white font-medium`}>
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Verified</p>
                <p className="text-2xl font-bold text-green-600">{stats.verified}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="bg-white rounded-lg p-4 mb-6 border">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by team name, ticket ID, or leader..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>

        {/* Teams List */}
        <div className="space-y-3">
          {filteredTeams.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                {searchTerm ? 'No teams found matching your search' : 'No teams registered yet'}
              </p>
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team._id}
                className={`bg-white rounded-lg p-4 border-l-4 ${team.checkedIn ? 'border-green-500 bg-green-50' : 'border-orange-500'
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 truncate">{team.teamName}</h3>
                      {team.checkedIn && (
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Ticket:</span> {team.ticketId}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Leader:</span> {team.leaderName}
                      </p>
                      <p className="text-gray-600 truncate">
                        <span className="font-medium">Email:</span> {team.leaderEmail}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Members:</span> {team.members?.length || 0}
                      </p>
                      {team.checkedIn && team.checkedInAt && (
                        <p className="text-gray-500 text-xs">
                          Verified: {new Date(team.checkedInAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {!team.checkedIn && (
                    <button
                      onClick={() => verifyTeam(team.ticketId)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" />
                      Verify
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}