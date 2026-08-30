import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  FileArrowUp, 
  Users, 
  EnvelopeOpen, 
  Warning, 
  CalendarCheck, 
  Notebook, 
  Plus, 
  Trash, 
  X, 
  Download, 
  Clock, 
  UserGear,
  House
} from '@phosphor-icons/react';

interface AdminComplianceProps {
  token: string;
  triggerSuccess: (msg: string) => void;
}

export const AdminCompliance: React.FC<AdminComplianceProps> = ({ token, triggerSuccess }) => {
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');
  const [adminRole, setAdminRole] = useState<string>('admin');
  const [loading, setLoading] = useState<boolean>(true);

  // Lists State
  const [stats, setStats] = useState<any>({});
  const [policies, setPolicies] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [consents, setConsents] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  // Modal Control
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Policy Form State
  const [policyForm, setPolicyForm] = useState({
    id: '',
    title: '',
    description: '',
    content: '',
    status: 'draft',
    version: '1.0',
    effectiveDate: '',
    attachments: [] as any[]
  });
  const [editingPolicy, setEditingPolicy] = useState<any | null>(null);
  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Document Upload Form State
  const [docForm, setDocForm] = useState({
    name: '',
    visibility: 'public',
    status: 'published',
    expiryDate: ''
  });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Student Consent Form State
  const [consentForm, setConsentForm] = useState({
    studentId: '',
    consentType: 'media',
    status: 'granted',
    givenBy: '',
    policyVersion: '1.0',
    proof: ''
  });

  // Complaint View State
  const [viewingComplaint, setViewingComplaint] = useState<any | null>(null);
  const [complaintNotes, setComplaintNotes] = useState('');

  // Incident Form State
  const [incidentForm, setIncidentForm] = useState({
    type: 'injury',
    date: '',
    description: '',
    involvedPeople: '',
    actionsTaken: '',
    status: 'reported',
    confidentialNotes: ''
  });

  // Reminder Form State
  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    type: 'policy-review',
    dueDate: ''
  });

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load Admin Profile (Role)
      const pRes = await fetch('http://localhost:5000/api/admin/profile', { headers });
      if (pRes.ok) {
        const pData = await pRes.json();
        setAdminRole(pData.role || 'admin');
        
        // Load Incident Log only if superadmin
        if (pData.role === 'superadmin') {
          const incRes = await fetch('http://localhost:5000/api/admin/compliance/incidents', { headers });
          if (incRes.ok) {
            const incData = await incRes.json();
            setIncidents(incData.incidents || []);
          }
        }
      }

      // 2. Load Stats
      const statsRes = await fetch('http://localhost:5000/api/admin/compliance/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats || {});
      }

      // 3. Load Policies
      const polRes = await fetch('http://localhost:5000/api/admin/compliance/policies', { headers });
      if (polRes.ok) {
        const polData = await polRes.json();
        setPolicies(polData.policies || []);
      }

      // 4. Load Documents
      const docRes = await fetch('http://localhost:5000/api/admin/compliance/documents', { headers });
      if (docRes.ok) {
        const docData = await docRes.json();
        setDocuments(docData.documents || []);
      }

      // 5. Load Consents
      const conRes = await fetch('http://localhost:5000/api/admin/compliance/consents', { headers });
      if (conRes.ok) {
        const conData = await conRes.json();
        setConsents(conData.consents || []);
      }

      // 6. Load Complaints
      const compRes = await fetch('http://localhost:5000/api/admin/compliance/complaints', { headers });
      if (compRes.ok) {
        const compData = await compRes.json();
        setComplaints(compData.complaints || []);
      }

      // 7. Load Reminders
      const remRes = await fetch('http://localhost:5000/api/admin/compliance/reminders', { headers });
      if (remRes.ok) {
        const remData = await remRes.json();
        setReminders(remData.reminders || []);
      }

      // 8. Load Audit Logs
      const auditRes = await fetch('http://localhost:5000/api/admin/compliance/audit-logs', { headers });
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.logs || []);
      }

      // 9. Load Students for Consents
      const studRes = await fetch('http://localhost:5000/api/admin/students', { headers });
      if (studRes.ok) {
        const studData = await studRes.json();
        setStudents(studData.students || []);
      }

    } catch (err) {
      console.error("Failed to load compliance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // Insert Rich Text Formatting HTML tags into textarea
  const insertHTMLTag = (tag: string, placeholder = "") => {
    const textarea = contentTextAreaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(startPos, endPos) || placeholder;

    let replacement = "";
    if (tag === 'p') replacement = `<p>${selectedText}</p>`;
    else if (tag === 'strong') replacement = `<strong>${selectedText}</strong>`;
    else if (tag === 'em') replacement = `<em>${selectedText}</em>`;
    else if (tag === 'h2') replacement = `<h2>${selectedText}</h2>`;
    else if (tag === 'ul') replacement = `<ul>\n  <li>${selectedText}</li>\n</ul>`;
    else if (tag === 'li') replacement = `<li>${selectedText}</li>`;

    const newContent = text.substring(0, startPos) + replacement + text.substring(endPos);
    setPolicyForm({ ...policyForm, content: newContent });

    // refocus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + tag.length + 2, startPos + tag.length + 2 + selectedText.length);
    }, 50);
  };

  // Create or Update Policy
  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyForm.id.trim() || !policyForm.title.trim()) {
      alert("Policy ID and Title are required.");
      return;
    }

    const isEdit = !!editingPolicy;
    const url = isEdit 
      ? `http://localhost:5000/api/admin/compliance/policies/${policyForm.id}`
      : 'http://localhost:5000/api/admin/compliance/policies';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(policyForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess(`Policy ${isEdit ? 'updated' : 'created'} successfully.`);
        setActiveModal(null);
        setEditingPolicy(null);
        loadData();
      } else {
        alert(data.error || "Failed to save policy.");
      }
    } catch (err) {
      alert("Error saving policy record.");
    }
  };

  const handleEditPolicyClick = (policy: any) => {
    setEditingPolicy(policy);
    setPolicyForm({
      id: policy.id,
      title: policy.title,
      description: policy.description || '',
      content: policy.content || '',
      status: policy.status || 'draft',
      version: policy.version || '1.0',
      effectiveDate: policy.effectiveDate ? policy.effectiveDate.split('T')[0] : '',
      attachments: policy.attachments || []
    });
    setActiveModal('policy');
  };

  const handleDeletePolicy = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this policy?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/compliance/policies/${id}`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        triggerSuccess("Policy deleted successfully.");
        loadData();
      }
    } catch (err) {
      alert("Failed to delete policy.");
    }
  };

  // Upload Document
  const handleUploadDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docForm.name.trim() || !docFile) {
      alert("Please enter a name and choose a file to upload.");
      return;
    }

    setIsUploadingDoc(true);
    const formData = new FormData();
    formData.append('name', docForm.name);
    formData.append('visibility', docForm.visibility);
    formData.append('status', docForm.status);
    if (docForm.expiryDate) formData.append('expiryDate', docForm.expiryDate);
    formData.append('file', docFile);

    try {
      const response = await fetch('http://localhost:5000/api/admin/compliance/documents', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess("Document uploaded successfully.");
        setActiveModal(null);
        setDocForm({ name: '', visibility: 'public', status: 'published', expiryDate: '' });
        setDocFile(null);
        loadData();
      } else {
        alert(data.error || "Failed to upload document.");
      }
    } catch (err) {
      alert("Error contacting upload server.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this document from storage?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/admin/compliance/documents/${id}`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        triggerSuccess("Document deleted successfully.");
        loadData();
      }
    } catch (err) {
      alert("Failed to delete document.");
    }
  };

  // Record Consent
  const handleSaveConsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentForm.studentId || !consentForm.givenBy) {
      alert("Student selection and Given By fields are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/compliance/consents', {
        method: 'POST',
        headers,
        body: JSON.stringify(consentForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess("Student consent status recorded.");
        setActiveModal(null);
        setConsentForm({ studentId: '', consentType: 'media', status: 'granted', givenBy: '', policyVersion: '1.0', proof: '' });
        loadData();
      } else {
        alert(data.error || "Failed to save consent.");
      }
    } catch (err) {
      alert("Error saving consent.");
    }
  };

  // Complaint Notes & Status Update
  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingComplaint) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/compliance/complaints/${viewingComplaint.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: viewingComplaint.status,
          internalNotes: complaintNotes
        })
      });
      if (response.ok) {
        triggerSuccess("Complaint updated successfully.");
        setViewingComplaint(null);
        loadData();
      }
    } catch (err) {
      alert("Failed to update complaint.");
    }
  };

  // Create Incident Report
  const handleSaveIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentForm.date || !incidentForm.description) {
      alert("Date and description are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/compliance/incidents', {
        method: 'POST',
        headers,
        body: JSON.stringify(incidentForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess("Incident/Safeguarding report logged.");
        setActiveModal(null);
        setIncidentForm({ type: 'injury', date: '', description: '', involvedPeople: '', actionsTaken: '', status: 'reported', confidentialNotes: '' });
        loadData();
      } else {
        alert(data.error || "Failed to save incident report.");
      }
    } catch (err) {
      alert("Failed to connect to backend log.");
    }
  };

  // Create Reminder
  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderForm.title || !reminderForm.dueDate) {
      alert("Title and due date are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/compliance/reminders', {
        method: 'POST',
        headers,
        body: JSON.stringify(reminderForm)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        triggerSuccess("Compliance calendar reminder created.");
        setActiveModal(null);
        setReminderForm({ title: '', description: '', type: 'policy-review', dueDate: '' });
        loadData();
      } else {
        alert(data.error || "Failed to save reminder.");
      }
    } catch (err) {
      alert("Error saving reminder.");
    }
  };

  const handleToggleReminderStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      const response = await fetch(`http://localhost:5000/api/admin/compliance/reminders/${id}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: nextStatus })
      });
      if (response.ok) {
        triggerSuccess("Reminder status updated.");
        loadData();
      }
    } catch (err) {
      alert("Failed to toggle reminder status.");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-12 text-center border border-border-gray rounded-xl shadow-sm">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-light font-semibold text-xs">Loading Compliance Center...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Center Subnavigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-gray/50 pb-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: <House size={16} /> },
          { id: 'policies', label: 'Policies CMS', icon: <ShieldCheck size={16} /> },
          { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
          { id: 'consents', label: 'Student Consents', icon: <Users size={16} /> },
          { id: 'complaints', label: 'Complaints', icon: <EnvelopeOpen size={16} /> },
          { id: 'safeguarding', label: 'Safeguarding & Incidents', icon: <Warning size={16} /> },
          { id: 'calendar', label: 'Calendar', icon: <CalendarCheck size={16} /> },
          { id: 'audit', label: 'Audit Logs', icon: <Notebook size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center gap-1.5 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
              activeSubTab === tab.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-transparent text-text-body hover:bg-soft-light hover:text-primary'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: DASHBOARD */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6 text-left">
          {/* Headline */}
          <div>
            <h3 className="text-base font-extrabold text-primary">Compliance Dashboard Overview</h3>
            <p className="text-text-light text-xs mt-0.5">Summary of policies, consent status, and pending calendar items.</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 border border-border-gray rounded-xl shadow-xs">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-0.5">Total Policies</span>
              <p className="text-2xl font-black text-primary">{stats.totalPolicies || 0}</p>
              <div className="flex gap-2 text-[10px] text-text-light font-semibold mt-1">
                <span className="text-emerald-600">Published: {stats.publishedPolicies || 0}</span>
                <span>Drafts: {stats.draftPolicies || 0}</span>
              </div>
            </div>

            <div className="bg-white p-5 border border-border-gray rounded-xl shadow-xs">
              <span className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-0.5">Total Documents</span>
              <p className="text-2xl font-black text-primary">{stats.totalDocuments || 0}</p>
              <div className="flex gap-2 text-[10px] text-text-light font-semibold mt-1">
                <span className="text-primary">Public: {stats.publicDocs || 0}</span>
                <span>Internal: {stats.internalDocs + stats.privateDocs || 0}</span>
              </div>
            </div>

            <div className="bg-white p-5 border border-border-gray rounded-xl shadow-xs">
              <span className="block text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-0.5">Expiring Reminders</span>
              <p className="text-2xl font-black text-rose-600">{stats.expiringSoonReminders || 0}</p>
              <span className="block text-[10px] text-text-light font-semibold mt-1">Due within next 30 days</span>
            </div>

            <div className="bg-white p-5 border border-border-gray rounded-xl shadow-xs">
              <span className="block text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-0.5">Open Complaints / Incidents</span>
              <p className="text-2xl font-black text-amber-600">
                {stats.openComplaints || 0} / {adminRole === 'superadmin' ? stats.openIncidents || 0 : '-'}
              </p>
              <span className="block text-[10px] text-text-light font-semibold mt-1">Pending grievance cases</span>
            </div>
          </div>

          {/* Quick Tasks / Audit Logs Quick View */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Expiration Reminders List */}
            <div className="bg-white p-5 border border-border-gray rounded-xl shadow-xs">
              <h4 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Upcoming Deadlines & Actions</h4>
              <div className="space-y-3">
                {reminders.filter(r => r.status === 'pending').slice(0, 3).map((rem, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-soft-light rounded-lg border border-border-gray/50">
                    <div>
                      <span className="block text-xs font-bold text-primary">{rem.title}</span>
                      <span className="block text-[10px] text-text-light mt-0.5">Due: {formatDate(rem.dueDate)}</span>
                    </div>
                    <span className="text-[9px] bg-rose-50 text-rose-600 border border-rose-200 py-0.5 px-2.5 rounded-full font-black uppercase">
                      Pending
                    </span>
                  </div>
                ))}
                {reminders.filter(r => r.status === 'pending').length === 0 && (
                  <p className="text-xs text-text-light italic text-center py-6">No pending reminders due soon.</p>
                )}
              </div>
            </div>

            {/* Recent Logs List */}
            <div className="bg-white p-5 border border-border-gray rounded-xl shadow-xs">
              <h4 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider">Recent Audit Activity</h4>
              <div className="space-y-3">
                {auditLogs.slice(0, 3).map((log, idx) => (
                  <div key={idx} className="p-3 bg-soft-light rounded-lg border border-border-gray/50 flex gap-3 text-xs">
                    <Clock size={16} className="text-text-light mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold text-primary">{log.user}</span> <span className="text-text-body">{log.details}</span>
                      <span className="block text-[9px] text-text-light mt-0.5">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-xs text-text-light italic text-center py-6">No recent audit logs recorded.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: POLICIES CMS */}
      {activeSubTab === 'policies' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-border-gray/50">
            <div>
              <h3 className="text-base font-extrabold text-primary">Compliance Policies Management</h3>
              <p className="text-text-light text-xs mt-0.5">Create and publish legal frameworks linked directly to the public footer.</p>
            </div>
            <button
              onClick={() => {
                setEditingPolicy(null);
                setPolicyForm({ id: '', title: '', description: '', content: '', status: 'draft', version: '1.0', effectiveDate: '', attachments: [] });
                setActiveModal('policy');
              }}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2 px-4 rounded-xl cursor-pointer text-xs flex items-center gap-1 border-none"
            >
              <Plus size={16} /> New Policy
            </button>
          </div>

          {/* Policy List Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-soft-light text-text-light border-b border-border-gray">
                  <th className="py-3 px-4 font-bold">Policy Name / ID</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Version</th>
                  <th className="py-3 px-4 font-bold">Effective Date</th>
                  <th className="py-3 px-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map(pol => (
                  <tr key={pol.id} className="border-b border-border-gray/50 hover:bg-soft-light/20">
                    <td className="py-3.5 px-4">
                      <span className="block font-bold text-primary">{pol.title}</span>
                      <span className="block text-[10px] text-text-light mt-0.5">{pol.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-full ${
                        pol.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : pol.status === 'draft'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {pol.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-text-body">{pol.version}</td>
                    <td className="py-3.5 px-4 font-medium text-text-body">{formatDate(pol.effectiveDate)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditPolicyClick(pol)}
                          className="bg-primary/5 text-primary hover:bg-primary hover:text-white p-1.5 rounded-lg transition-all cursor-pointer border-none"
                          title="Edit Policy"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePolicy(pol.id)}
                          className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white p-1.5 rounded-lg transition-all cursor-pointer border-none"
                          title="Delete Policy"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: DOCUMENTS */}
      {activeSubTab === 'documents' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-border-gray/50">
            <div>
              <h3 className="text-base font-extrabold text-primary">Compliance Document Storage</h3>
              <p className="text-text-light text-xs mt-0.5">Upload safeguarding audits, licenses, waivers, and reference assets.</p>
            </div>
            <button
              onClick={() => setActiveModal('document')}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2 px-4 rounded-xl cursor-pointer text-xs flex items-center gap-1 border-none"
            >
              <FileArrowUp size={16} /> Upload Document
            </button>
          </div>

          {/* Document list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map(doc => (
              <div key={doc.id} className="bg-white p-4 border border-border-gray rounded-xl flex gap-3 items-start justify-between">
                <div className="flex gap-2.5 items-start">
                  <div className="w-10 h-10 bg-soft-light border border-border-gray rounded-lg flex items-center justify-center text-xl shrink-0">
                    📂
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-primary">{doc.name}</span>
                    <span className="block text-[10px] text-text-light mt-0.5">{doc.id}</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className={`text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-full ${
                        doc.visibility === 'public'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {doc.visibility}
                      </span>
                      {doc.expiryDate && (
                        <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-100 py-0.5 px-2 rounded-full font-bold">
                          Expires: {formatDate(doc.expiryDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <a
                    href={doc.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-soft-light border border-border-gray rounded-lg hover:border-primary text-primary transition-all flex items-center justify-center decoration-none"
                    title="Download / View"
                  >
                    <Download size={14} />
                  </a>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all cursor-pointer border-none"
                    title="Delete Document"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: STUDENT CONSENTS */}
      {activeSubTab === 'consents' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-border-gray/50">
            <div>
              <h3 className="text-base font-extrabold text-primary">Student Consent Registrar</h3>
              <p className="text-text-light text-xs mt-0.5">Manage and record parental consents for media publication, medical, and data sharing.</p>
            </div>
            <button
              onClick={() => setActiveModal('consent')}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2 px-4 rounded-xl cursor-pointer text-xs flex items-center gap-1 border-none"
            >
              <Plus size={16} /> Record Consent
            </button>
          </div>

          {/* Consents table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-soft-light text-text-light border-b border-border-gray">
                  <th className="py-3 px-4 font-bold">Student ID</th>
                  <th className="py-3 px-4 font-bold">Consent Type</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Signed By</th>
                  <th className="py-3 px-4 font-bold">Version</th>
                  <th className="py-3 px-4 font-bold">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {consents.map(con => (
                  <tr key={con.id} className="border-b border-border-gray/50 hover:bg-soft-light/20">
                    <td className="py-3.5 px-4 font-bold text-primary">{con.studentId}</td>
                    <td className="py-3.5 px-4 font-bold uppercase text-text-body">{con.consentType}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-full ${
                        con.status === 'granted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : con.status === 'withdrawn'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {con.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-text-body">{con.givenBy}</td>
                    <td className="py-3.5 px-4 font-semibold text-text-body">{con.policyVersion}</td>
                    <td className="py-3.5 px-4 font-medium text-text-body">{formatDate(con.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 5: COMPLAINTS */}
      {activeSubTab === 'complaints' && (
        <div className="space-y-6 text-left">
          <div>
            <h3 className="text-base font-extrabold text-primary">Grievance & Redressal Complaints</h3>
            <p className="text-text-light text-xs mt-0.5">Review complaints submitted from the website compliance form and update status.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-soft-light text-text-light border-b border-border-gray">
                  <th className="py-3 px-4 font-bold">Complaint ID</th>
                  <th className="py-3 px-4 font-bold">Reporter</th>
                  <th className="py-3 px-4 font-bold">Subject</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Date Filed</th>
                  <th className="py-3 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(comp => (
                  <tr key={comp.id} className="border-b border-border-gray/50 hover:bg-soft-light/20">
                    <td className="py-3.5 px-4 font-bold text-primary">{comp.id}</td>
                    <td className="py-3.5 px-4 font-bold text-text-body">{comp.reporterName}</td>
                    <td className="py-3.5 px-4 font-medium text-text-body">{comp.subject}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-full ${
                        comp.status === 'resolved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : comp.status === 'pending'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-text-light">{formatDate(comp.createdAt)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setViewingComplaint(comp);
                          setComplaintNotes(comp.internalNotes || '');
                        }}
                        className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-1.5 px-3 rounded-lg cursor-pointer text-[10px] border-none"
                      >
                        Redress
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 6: SAFEGUARDING & INCIDENTS (Superadmin restricted) */}
      {activeSubTab === 'safeguarding' && (
        <div className="space-y-6 text-left">
          {adminRole !== 'superadmin' ? (
            <div className="p-8 border border-rose-200 bg-rose-50 text-center rounded-xl animate-scale-up">
              <Warning size={48} className="text-rose-500 mx-auto mb-3" />
              <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider">Access Denied</h3>
              <p className="text-xs text-rose-700 font-semibold leading-relaxed max-w-[380px] mx-auto mt-1">
                Safeguarding incident logs containing sensitive minor or conduct files are restricted to Super Administrators. You do not have permissions to access this database.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center pb-4 border-b border-border-gray/50">
                <div>
                  <h3 className="text-base font-extrabold text-primary">Safeguarding & Incident Logs</h3>
                  <p className="text-text-light text-xs mt-0.5">Record confidential minor safeguarding incidents and general training ground injuries.</p>
                </div>
                <button
                  onClick={() => setActiveModal('incident')}
                  className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2 px-4 rounded-xl cursor-pointer text-xs flex items-center gap-1 border-none"
                >
                  <Plus size={16} /> Log Incident
                </button>
              </div>

              {/* Incidents Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-soft-light text-text-light border-b border-border-gray">
                      <th className="py-3 px-4 font-bold">Incident ID</th>
                      <th className="py-3 px-4 font-bold">Type</th>
                      <th className="py-3 px-4 font-bold">Date</th>
                      <th className="py-3 px-4 font-bold">Involved People</th>
                      <th className="py-3 px-4 font-bold">Status</th>
                      <th className="py-3 px-4 font-bold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidents.map(inc => (
                      <tr key={inc.id} className="border-b border-border-gray/50 hover:bg-soft-light/20">
                        <td className="py-3.5 px-4 font-bold text-primary">{inc.id}</td>
                        <td className="py-3.5 px-4 font-bold uppercase text-text-body">{inc.type}</td>
                        <td className="py-3.5 px-4 font-semibold text-text-body">{formatDate(inc.date)}</td>
                        <td className="py-3.5 px-4 font-medium text-text-body">{inc.involvedPeople}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block text-[9px] font-black uppercase tracking-wider py-0.5 px-2 rounded-full ${
                            inc.status === 'closed'
                              ? 'bg-slate-100 text-slate-700 border border-slate-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {inc.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-text-light truncate max-w-[200px]" title={inc.description}>
                          {inc.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* SUBTAB 7: CALENDAR & REMINDERS */}
      {activeSubTab === 'calendar' && (
        <div className="space-y-6 text-left">
          <div className="flex justify-between items-center pb-4 border-b border-border-gray/50">
            <div>
              <h3 className="text-base font-extrabold text-primary">Compliance Review Calendar</h3>
              <p className="text-text-light text-xs mt-0.5">Plan and execute audits, policy review dates, and fire safety certificate expirations.</p>
            </div>
            <button
              onClick={() => setActiveModal('reminder')}
              className="bg-primary text-white hover:bg-accent hover:text-primary transition-all font-bold py-2 px-4 rounded-xl cursor-pointer text-xs flex items-center gap-1 border-none"
            >
              <Plus size={16} /> Add Event
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-soft-light text-text-light border-b border-border-gray">
                  <th className="py-3 px-4 font-bold">Event Title</th>
                  <th className="py-3 px-4 font-bold">Type</th>
                  <th className="py-3 px-4 font-bold">Due Date</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {reminders.map(rem => (
                  <tr key={rem.id} className="border-b border-border-gray/50 hover:bg-soft-light/20">
                    <td className="py-3.5 px-4">
                      <span className="block font-bold text-primary">{rem.title}</span>
                      <span className="block text-[10px] text-text-light mt-0.5">{rem.description}</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold uppercase text-text-body">{rem.type}</td>
                    <td className="py-3.5 px-4 font-bold text-text-body">{formatDate(rem.dueDate)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[9px] font-black uppercase tracking-wider py-0.5 px-2.5 rounded-full ${
                        rem.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {rem.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleReminderStatus(rem.id, rem.status)}
                        className={`font-bold py-1.5 px-3 rounded-lg cursor-pointer text-[10px] border-none ${
                          rem.status === 'completed'
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {rem.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 8: AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="space-y-6 text-left">
          <div>
            <h3 className="text-base font-extrabold text-primary">System Compliance Audit Logs</h3>
            <p className="text-text-light text-xs mt-0.5">Read-only history tracking administrator actions, policy additions, and uploads.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-soft-light text-text-light border-b border-border-gray">
                  <th className="py-3 px-4 font-bold">Timestamp</th>
                  <th className="py-3 px-4 font-bold">Admin</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                  <th className="py-3 px-4 font-bold">Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} className="border-b border-border-gray/50 hover:bg-soft-light/20">
                    <td className="py-3.5 px-4 font-semibold text-text-light">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3.5 px-4 font-bold text-primary flex items-center gap-1.5"><UserGear size={16} /> {log.user}</td>
                    <td className="py-3.5 px-4 font-black uppercase text-[10px] text-text-body">{log.action}</td>
                    <td className="py-3.5 px-4 font-semibold text-text-body">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: POLICY FORM */}
      {activeModal === 'policy' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 text-left animate-fade-in">
          <div className="bg-white rounded-2xl border border-border-gray shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col justify-between overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-border-gray/50 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-primary">
                {editingPolicy ? 'Edit Compliance Policy' : 'Create Compliance Policy'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-text-light hover:text-primary cursor-pointer border-none bg-transparent outline-none">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Policy Slug ID *</label>
                  <input
                    type="text"
                    disabled={!!editingPolicy}
                    required
                    value={policyForm.id}
                    onChange={(e) => setPolicyForm({ ...policyForm, id: e.target.value })}
                    placeholder="E.g. privacy-policy"
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl font-semibold outline-none focus:border-primary disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Policy Title *</label>
                  <input
                    type="text"
                    required
                    value={policyForm.title}
                    onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                    placeholder="E.g. Privacy Policy"
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl font-semibold outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Brief Description</label>
                <input
                  type="text"
                  value={policyForm.description}
                  onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                  placeholder="Summary shown on cards/headers"
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl font-semibold outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={policyForm.status}
                    onChange={(e) => setPolicyForm({ ...policyForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl font-semibold outline-none focus:border-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Version</label>
                  <input
                    type="text"
                    value={policyForm.version}
                    onChange={(e) => setPolicyForm({ ...policyForm, version: e.target.value })}
                    placeholder="E.g. 1.0"
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl font-semibold outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Effective Date</label>
                  <input
                    type="date"
                    value={policyForm.effectiveDate}
                    onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl font-semibold outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Rich text formatting toolbar helper */}
              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1">
                  Policy Body Content (HTML formatting)
                </label>
                <div className="flex gap-1.5 bg-soft-light border border-border-gray border-b-0 p-2 rounded-t-xl">
                  <button type="button" onClick={() => insertHTMLTag('strong', 'bold text')} className="px-2.5 py-1 bg-white border border-border-gray rounded font-black cursor-pointer hover:bg-slate-100">B</button>
                  <button type="button" onClick={() => insertHTMLTag('em', 'italic text')} className="px-2.5 py-1 bg-white border border-border-gray rounded font-black italic cursor-pointer hover:bg-slate-100">I</button>
                  <button type="button" onClick={() => insertHTMLTag('h2', 'Heading')} className="px-2 py-1 bg-white border border-border-gray rounded font-extrabold cursor-pointer hover:bg-slate-100">H2</button>
                  <button type="button" onClick={() => insertHTMLTag('p', 'Paragraph')} className="px-2.5 py-1 bg-white border border-border-gray rounded font-semibold cursor-pointer hover:bg-slate-100">P</button>
                  <button type="button" onClick={() => insertHTMLTag('ul', 'List Item')} className="px-2 py-1 bg-white border border-border-gray rounded font-bold cursor-pointer hover:bg-slate-100">List</button>
                </div>
                <textarea
                  ref={contentTextAreaRef}
                  rows={8}
                  required
                  value={policyForm.content}
                  onChange={(e) => setPolicyForm({ ...policyForm, content: e.target.value })}
                  placeholder="Enter policy content in HTML format or use the toolbar buttons to construct formatting..."
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-b-xl font-semibold outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              {/* Attachment selector checklist */}
              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">
                  Link Documents (Attachments)
                </label>
                <div className="border border-border-gray rounded-xl p-3 bg-slate-50 max-h-32 overflow-y-auto space-y-2">
                  {documents.filter(d => d.visibility === 'public' && d.status === 'published').map(doc => {
                    const isAttached = policyForm.attachments.some(a => a.path === doc.path);
                    return (
                      <div key={doc.id} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`attach-${doc.id}`}
                          checked={isAttached}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPolicyForm({
                                ...policyForm,
                                attachments: [...policyForm.attachments, { name: doc.name, path: doc.path }]
                              });
                            } else {
                              setPolicyForm({
                                ...policyForm,
                                attachments: policyForm.attachments.filter(a => a.path !== doc.path)
                              });
                            }
                          }}
                          className="rounded border-border-gray text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor={`attach-${doc.id}`} className="font-semibold text-text-body cursor-pointer select-none">
                          {doc.name}
                        </label>
                      </div>
                    );
                  })}
                  {documents.filter(d => d.visibility === 'public' && d.status === 'published').length === 0 && (
                    <p className="text-[10px] text-text-light italic">No public published documents available to attach.</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold rounded-xl cursor-pointer border-none"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DOCUMENT UPLOAD FORM */}
      {activeModal === 'document' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 text-left animate-fade-in">
          <div className="bg-white rounded-2xl border border-border-gray shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-border-gray/50 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-primary">Upload Document</h3>
              <button onClick={() => setActiveModal(null)} className="text-text-light hover:text-primary cursor-pointer border-none bg-transparent outline-none">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="p-6 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Document Name *</label>
                <input
                  type="text"
                  required
                  value={docForm.name}
                  onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                  placeholder="E.g. Waiver Signature Form"
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Visibility</label>
                  <select
                    value={docForm.visibility}
                    onChange={(e) => setDocForm({ ...docForm, visibility: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  >
                    <option value="public">Public</option>
                    <option value="internal">Internal Only</option>
                    <option value="private">Private (Restricted)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={docForm.status}
                    onChange={(e) => setDocForm({ ...docForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={docForm.expiryDate}
                  onChange={(e) => setDocForm({ ...docForm, expiryDate: e.target.value })}
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Select File *</label>
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setDocFile(e.target.files[0]);
                    }
                  }}
                  className="w-full bg-slate-50 border border-border-gray py-2 px-3 rounded-xl outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingDoc}
                  className="px-5 py-2.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold rounded-xl cursor-pointer border-none flex items-center gap-1.5"
                >
                  {isUploadingDoc ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: STUDENT CONSENT FORM */}
      {activeModal === 'consent' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 text-left animate-fade-in">
          <div className="bg-white rounded-2xl border border-border-gray shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-border-gray/50 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-primary">Record Student Consent</h3>
              <button onClick={() => setActiveModal(null)} className="text-text-light hover:text-primary cursor-pointer border-none bg-transparent outline-none">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveConsent} className="p-6 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Select Student *</label>
                <select
                  required
                  value={consentForm.studentId}
                  onChange={(e) => setConsentForm({ ...consentForm, studentId: e.target.value })}
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.studentId} value={s.studentId}>
                      {s.fullName} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Consent Type</label>
                  <select
                    value={consentForm.consentType}
                    onChange={(e) => setConsentForm({ ...consentForm, consentType: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  >
                    <option value="media">Media Release</option>
                    <option value="medical">Medical Treatment</option>
                    <option value="safeguarding">Safeguarding</option>
                    <option value="data-sharing">Data Sharing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={consentForm.status}
                    onChange={(e) => setConsentForm({ ...consentForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  >
                    <option value="granted">Granted</option>
                    <option value="denied">Denied</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Signed By *</label>
                  <input
                    type="text"
                    required
                    value={consentForm.givenBy}
                    onChange={(e) => setConsentForm({ ...consentForm, givenBy: e.target.value })}
                    placeholder="Parent / Guardian Name"
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Policy Version</label>
                  <input
                    type="text"
                    value={consentForm.policyVersion}
                    onChange={(e) => setConsentForm({ ...consentForm, policyVersion: e.target.value })}
                    placeholder="E.g. 1.0"
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Proof / Document Link (Optional)</label>
                <input
                  type="text"
                  value={consentForm.proof}
                  onChange={(e) => setConsentForm({ ...consentForm, proof: e.target.value })}
                  placeholder="URL of signed copy or scanned proof"
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold rounded-xl cursor-pointer border-none"
                >
                  Save Consent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: COMPLAINT REDRESS VIEW */}
      {viewingComplaint && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 text-left animate-fade-in">
          <div className="bg-white rounded-2xl border border-border-gray shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-border-gray/50 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-primary">Redress Grievance Complaint</h3>
              <button onClick={() => setViewingComplaint(null)} className="text-text-light hover:text-primary cursor-pointer border-none bg-transparent outline-none">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateComplaint} className="p-6 space-y-4 text-xs">
              <div className="bg-soft-light border border-border-gray rounded-xl p-4 space-y-3 font-semibold text-text-body">
                <div>
                  <span className="block text-[9px] font-bold text-text-light uppercase tracking-wider">Complaint ID / Date</span>
                  <p className="text-xs text-primary font-black">{viewingComplaint.id} - {formatDate(viewingComplaint.createdAt)}</p>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-text-light uppercase tracking-wider">Reporter Name / Email</span>
                  <p className="text-xs text-text-body font-bold">{viewingComplaint.reporterName} ({viewingComplaint.reporterEmail})</p>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-text-light uppercase tracking-wider">Subject</span>
                  <p className="text-xs text-text-body font-bold">{viewingComplaint.subject}</p>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-text-light uppercase tracking-wider">Description Narrative</span>
                  <p className="text-xs text-text-body font-medium leading-relaxed mt-1 bg-white p-3 rounded-lg border border-border-gray/50">{viewingComplaint.description}</p>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Action Status</label>
                <select
                  value={viewingComplaint.status}
                  onChange={(e) => setViewingComplaint({ ...viewingComplaint, status: e.target.value })}
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl font-bold outline-none focus:border-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Private Internal Notes (Never public)</label>
                <textarea
                  rows={3}
                  value={complaintNotes}
                  onChange={(e) => setComplaintNotes(e.target.value)}
                  placeholder="Record internal redress steps, conversations with wardens, etc. Private security notes."
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl font-semibold outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setViewingComplaint(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold rounded-xl cursor-pointer border-none"
                >
                  Save Redress Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: LOG INCIDENT FORM */}
      {activeModal === 'incident' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 text-left animate-fade-in">
          <div className="bg-white rounded-2xl border border-border-gray shadow-2xl max-w-xl w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-border-gray/50 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-primary">Log Incident (Superadmin Only)</h3>
              <button onClick={() => setActiveModal(null)} className="text-text-light hover:text-primary cursor-pointer border-none bg-transparent outline-none">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveIncident} className="p-6 space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Incident Type</label>
                  <select
                    value={incidentForm.type}
                    onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  >
                    <option value="injury">Physical Injury</option>
                    <option value="safeguarding">Safeguarding / Harassment</option>
                    <option value="conduct">Conduct Violation</option>
                    <option value="other">Other Incident</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Date occurred *</label>
                  <input
                    type="date"
                    required
                    value={incidentForm.date}
                    onChange={(e) => setIncidentForm({ ...incidentForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Involved People</label>
                  <input
                    type="text"
                    value={incidentForm.involvedPeople}
                    onChange={(e) => setIncidentForm({ ...incidentForm, involvedPeople: e.target.value })}
                    placeholder="Names of students/coaches"
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Status</label>
                  <select
                    value={incidentForm.status}
                    onChange={(e) => setIncidentForm({ ...incidentForm, status: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  >
                    <option value="reported">Reported</option>
                    <option value="investigating">Investigating</option>
                    <option value="closed">Closed / Solved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Incident Description *</label>
                <textarea
                  rows={3}
                  required
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  placeholder="Record description of the incident..."
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Actions Taken</label>
                <input
                  type="text"
                  value={incidentForm.actionsTaken}
                  onChange={(e) => setIncidentForm({ ...incidentForm, actionsTaken: e.target.value })}
                  placeholder="Actions taken by administration"
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Confidential Security Notes</label>
                <textarea
                  rows={3}
                  value={incidentForm.confidentialNotes}
                  onChange={(e) => setIncidentForm({ ...incidentForm, confidentialNotes: e.target.value })}
                  placeholder="Write internal findings. Strictly private, only visible to superadmin."
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold rounded-xl cursor-pointer border-none"
                >
                  Log Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: COMPLIANCE REMINDER FORM */}
      {activeModal === 'reminder' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-5 text-left animate-fade-in">
          <div className="bg-white rounded-2xl border border-border-gray shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-border-gray/50 flex justify-between items-center">
              <h3 className="text-base font-extrabold text-primary">Add Compliance Event / Deadline</h3>
              <button onClick={() => setActiveModal(null)} className="text-text-light hover:text-primary cursor-pointer border-none bg-transparent outline-none">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveReminder} className="p-6 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Event Title *</label>
                <input
                  type="text"
                  required
                  value={reminderForm.title}
                  onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                  placeholder="E.g. Fire Audit Inspection"
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Description</label>
                <input
                  type="text"
                  value={reminderForm.description}
                  onChange={(e) => setReminderForm({ ...reminderForm, description: e.target.value })}
                  placeholder="Brief context details"
                  className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Event Type</label>
                  <select
                    value={reminderForm.type}
                    onChange={(e) => setReminderForm({ ...reminderForm, type: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  >
                    <option value="policy-review">Policy Review</option>
                    <option value="document-expiry">Certificate Expiry</option>
                    <option value="audit">Safety / Medical Audit</option>
                    <option value="other">Other Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-text-light uppercase tracking-wider mb-1.5">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={reminderForm.dueDate}
                    onChange={(e) => setReminderForm({ ...reminderForm, dueDate: e.target.value })}
                    className="w-full bg-slate-50 border border-border-gray py-2.5 px-4 rounded-xl outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border-gray/50">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-accent hover:text-primary text-white font-bold rounded-xl cursor-pointer border-none"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
