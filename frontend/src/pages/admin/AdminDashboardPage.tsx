import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { RoyalLoader } from '../../components/ui/RoyalLoader';
import {
  ShieldCheck,
  Users,
  Coins,
  FileCheck,
  AlertOctagon,
  Check,
  X,
  FileText,
  Trash2,
  Building,
  RefreshCw
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [verificationQueue, setVerificationQueue] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [privacyRequests, setPrivacyRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const [aData, vData, cData, pData] = await Promise.all([
        api.getAdminAnalytics(),
        api.getVerificationQueue(),
        api.getComplaints(),
        api.getPrivacyRequests()
      ]);
      setAnalytics(aData);
      setVerificationQueue(vData);
      setComplaints(cData);
      setPrivacyRequests(pData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerificationDecision = async (vendorId: string, action: 'approve' | 'reject' | 'request_more_info') => {
    try {
      await api.updateVerificationDecision(vendorId, action, `Admin decision by ${user?.full_name || 'Administrator'}`);
      await loadAdminData();
      alert(`Vendor status updated to ${action === 'approve' ? 'Approved (Verified by The Royal Knot)' : action}.`);
    } catch (err) {
      console.error('Verification decision error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <RoyalLoader message="Connecting to platform administrative command & governance ledger..." />
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-white border border-gold-300 p-6 sm:p-8 shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                Super-Admin Console
              </span>
              <span className="text-xs text-charcoal-400">Governance & Platform Integrity</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Maharaj Digvijay (Admin Concierge)
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Overseeing platform verification, financial escrow stability, and compliance auditing.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gold-300 bg-ivory-100 hover:bg-gold-50 text-xs font-semibold text-charcoal-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold-600" />
            <span>Audit Refresh</span>
          </button>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gold-300 p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
              Total Managed Weddings
            </span>
            <span className="font-serif text-3xl font-bold text-charcoal-900 block">
              {analytics?.metrics?.total_weddings || 1}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">100% On-Track</span>
          </div>

          <div className="bg-white rounded-2xl border border-gold-300 p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
              Vendor Directory
            </span>
            <span className="font-serif text-3xl font-bold text-charcoal-900 block">
              {analytics?.metrics?.total_vendors || 5}
            </span>
            <span className="text-[11px] text-gold-700 font-medium">
              {analytics?.metrics?.verified_vendors || 3} Formally Verified
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gold-300 p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
              Escrow Cleared Volume
            </span>
            <span className="font-serif text-2xl font-bold text-burgundy-900 block">
              ₹{((analytics?.metrics?.total_cleared_volume_inr || 830400) / 100000).toFixed(1)} Lakhs
            </span>
            <span className="text-[11px] text-charcoal-500">Staged Escrow Protocol</span>
          </div>

          <div className="bg-white rounded-2xl border border-gold-300 p-5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400 block mb-1">
              Verification Queue
            </span>
            <span className="font-serif text-3xl font-bold text-amber-800 block">
              {verificationQueue.length}
            </span>
            <span className="text-[11px] text-amber-700 font-medium">Requires Document Audit</span>
          </div>
        </div>

        {/* VENDOR VERIFICATION QUEUE (Section 5.6 & 18) */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                  Vendor Verification & Compliance Queue
                </h2>
              </div>
              <p className="text-xs text-charcoal-500">
                Section 5.6 Rule: Only authorized administrators can grant the ‘Verified by The Royal Knot’ trust mark.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              {verificationQueue.length} In Review
            </span>
          </div>

          {verificationQueue.length === 0 ? (
            <div className="p-8 text-center bg-ivory-50 rounded-2xl border border-gold-200 text-xs text-charcoal-500">
              No vendors currently pending verification. All active partners meet quality protocols.
            </div>
          ) : (
            <div className="space-y-4">
              {verificationQueue.map((v) => (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-ivory-50 border border-gold-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-lg font-bold text-charcoal-900">
                        {v.business_name}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-charcoal-600 bg-white px-2 py-0.5 rounded border border-gold-200">
                        {v.category}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                        {v.verified_status}
                      </span>
                    </div>

                    <p className="text-charcoal-600 mb-2">
                      Representative: {v.representative_name} • City: {v.city} • PAN/GST: <span className="font-mono">{v.pan_gst}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {v.documents?.map((doc: any, i: number) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-gold-200 text-[11px] text-charcoal-700">
                          <FileText className="w-3 h-3 text-gold-600" />
                          <span>{doc.name}</span>
                          <span className="text-[10px] text-emerald-700 font-bold">({doc.status})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleVerificationDecision(v.id, 'approve')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold uppercase tracking-wider text-xs shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Vendor</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerificationDecision(v.id, 'reject')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 font-semibold uppercase tracking-wider text-xs transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DPDP DATA PRIVACY & COMPLAINTS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-gold-300 p-6 shadow-royal">
            <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">
              Statutory Privacy & Deletion Requests
            </h3>
            <p className="text-xs text-charcoal-500 mb-4">
              Under Indian DPDP Act & GDPR compliance mandates.
            </p>
            {privacyRequests.length === 0 ? (
              <p className="text-xs text-charcoal-400 italic bg-ivory-50 p-4 rounded-xl border border-gold-200">
                No outstanding data deletion or export requests.
              </p>
            ) : (
              <div className="space-y-3">
                {privacyRequests.map((r) => (
                  <div key={r.id} className="p-3.5 bg-ivory-50 rounded-xl border border-gold-200 text-xs">
                    <div className="flex justify-between font-bold text-charcoal-800">
                      <span>{r.request_type}</span>
                      <span className="uppercase text-[10px] text-amber-800">{r.status}</span>
                    </div>
                    <p className="text-charcoal-500 mt-1">{r.details || 'User requested account expunction.'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-gold-300 p-6 shadow-royal">
            <h3 className="font-serif text-xl font-bold text-charcoal-800 mb-2">
              Client Complaints & Disputes
            </h3>
            <p className="text-xs text-charcoal-500 mb-4">
              Real-time conflict mediation between couples, planners, and vendors.
            </p>
            {complaints.length === 0 ? (
              <p className="text-xs text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                ✓ Zero open complaints. All vendor deliveries in good standing.
              </p>
            ) : (
              <div className="space-y-3">
                {complaints.map((c) => (
                  <div key={c.id} className="p-3.5 bg-ivory-50 rounded-xl border border-gold-200 text-xs">
                    <span className="font-bold text-charcoal-800 block">{c.title}</span>
                    <p className="text-charcoal-500">{c.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
