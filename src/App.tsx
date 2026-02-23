import { useState, useEffect } from 'react';
import { PatientForm, type PatientData } from './components/PatientForm';
import { FollowUpForm, type FollowUpData } from './components/FollowUpForm';
import { PatientSummary } from './components/PatientSummary';
import { PatientList } from './components/PatientList';
import { Button } from './components/ui/Button';

function App() {
  // Use empty string so requests go to the same origin (e.g. /api/patients)
  // Nginx will catch these and proxy them to the backend Port 3001
  const API_BASE = '';

  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);

  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    age: '',
    sex: '',
    address: '',
    dateOfSurgery: '',
    drugHx: '',
    pmh: '',
    psh: '',
  });

  const [followUp1, setFollowUp1] = useState<FollowUpData>({
    painScore: '', rom: '', loda: '', hhsScore: '', xrayOne: null, mriOne: null
  });
  const [followUp2, setFollowUp2] = useState<FollowUpData>({
    painScore: '', rom: '', loda: '', hhsScore: '', xrayOne: null, mriOne: null
  });
  const [followUp3, setFollowUp3] = useState<FollowUpData>({
    painScore: '', rom: '', loda: '', hhsScore: '', xrayOne: null, mriOne: null
  });

  const [activeTab, setActiveTab] = useState<'patient' | 'fu1' | 'fu2' | 'fu3' | 'summary'>('patient');

  useEffect(() => {
    if (view === 'list') {
      fetchPatients();
    }
  }, [view]);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/patients`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const fetchPatientDetails = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/patients/${id}`);
      const data = await response.json();
      setSelectedPatient(data);
      setView('detail');
    } catch (error) {
      console.error('Failed to fetch patient details:', error);
    }
  };

  const handleEditClick = () => {
    if (!selectedPatient) return;

    setEditingPatientId(selectedPatient.patientData.id);
    setPatientData(selectedPatient.patientData);
    setFollowUp1({ ...selectedPatient.followUps.fu1, xrayOne: null, mriOne: null });
    setFollowUp2({ ...selectedPatient.followUps.fu2, xrayOne: null, mriOne: null });
    setFollowUp3({ ...selectedPatient.followUps.fu3, xrayOne: null, mriOne: null });

    setView('form');
    setActiveTab('patient');
  };

  const handlePatientChange = (field: keyof PatientData, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const createFollowUpHandler = (setter: React.Dispatch<React.SetStateAction<FollowUpData>>) =>
    (field: keyof FollowUpData, value: any) => {
      setter(prev => ({ ...prev, [field]: value }));
    };

  const handleSave = async () => {
    const formData = new FormData();
    const data = {
      patientData,
      followUps: {
        fu1: followUp1,
        fu2: followUp2,
        fu3: followUp3
      }
    };

    formData.append('data', JSON.stringify(data));

    // Add files
    if (followUp1.xrayOne) formData.append('fu1_xray', followUp1.xrayOne);
    if (followUp1.mriOne) formData.append('fu1_mri', followUp1.mriOne);
    if (followUp2.xrayOne) formData.append('fu2_xray', followUp2.xrayOne);
    if (followUp2.mriOne) formData.append('fu2_mri', followUp2.mriOne);
    if (followUp3.xrayOne) formData.append('fu3_xray', followUp3.xrayOne);
    if (followUp3.mriOne) formData.append('fu3_mri', followUp3.mriOne);

    try {
      const url = editingPatientId
        ? `${API_BASE}/api/patients/${editingPatientId}`
        : `${API_BASE}/api/patients`;

      const method = editingPatientId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        alert(editingPatientId ? 'Patient record updated successfully!' : 'Patient record saved successfully!');
        resetForm();
        setView('list');
      } else {
        const err = await response.json();
        alert('Error: ' + err.error);
      }
    } catch (error) {
      alert('Failed to connect to server. Error: ' + (error as Error).message);
    }
  };

  const resetForm = () => {
    setPatientData({ name: '', age: '', sex: '', address: '', dateOfSurgery: '', drugHx: '', pmh: '', psh: '' });
    setFollowUp1({ painScore: '', rom: '', loda: '', hhsScore: '', xrayOne: null, mriOne: null });
    setFollowUp2({ painScore: '', rom: '', loda: '', hhsScore: '', xrayOne: null, mriOne: null });
    setFollowUp3({ painScore: '', rom: '', loda: '', hhsScore: '', xrayOne: null, mriOne: null });
    setEditingPatientId(null);
    setActiveTab('patient');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between pb-6 border-b border-slate-200">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clinical Data Manager</h1>
          {view === 'list' ? (
            <Button onClick={() => setView('form')}>New Record</Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={() => { resetForm(); setView('list'); }}>Back to List</Button>
              {view === 'detail' && <Button onClick={handleEditClick}>Edit Record</Button>}
              {view === 'form' && <Button onClick={handleSave}>{editingPatientId ? 'Update Record' : 'Finalize & Save'}</Button>}
            </div>
          )}
        </header>

        {view === 'list' && (
          <div className="animate-in fade-in duration-500">
            <PatientList
              patients={patients}
              onSelect={fetchPatientDetails}
              onAddNew={() => setView('form')}
            />
          </div>
        )}

        {view === 'form' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
            <div className="flex space-x-2 border-b border-slate-200 mb-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('patient')}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'patient' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-50 text-slate-500 hover:text-slate-700'
                  }`}
              >
                Patient Info
              </button>
              <button
                onClick={() => setActiveTab('fu1')}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'fu1' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
              >
                1st Follow Up
              </button>
              <button
                onClick={() => setActiveTab('fu2')}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'fu2' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
              >
                2nd Follow Up
              </button>
              <button
                onClick={() => setActiveTab('fu3')}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'fu3' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
              >
                3rd Follow Up
              </button>
              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${activeTab === 'summary' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
              >
                Review Current
              </button>
            </div>

            <main>
              {activeTab === 'patient' && <PatientForm data={patientData} onChange={handlePatientChange} />}
              {activeTab === 'fu1' && <FollowUpForm title="1st Follow Up" data={followUp1} onChange={createFollowUpHandler(setFollowUp1)} />}
              {activeTab === 'fu2' && <FollowUpForm title="2nd Follow Up" data={followUp2} onChange={createFollowUpHandler(setFollowUp2)} />}
              {activeTab === 'fu3' && <FollowUpForm title="3rd Follow Up" data={followUp3} onChange={createFollowUpHandler(setFollowUp3)} />}
              {activeTab === 'summary' && (
                <PatientSummary
                  patientData={patientData}
                  followUps={{ fu1: followUp1, fu2: followUp2, fu3: followUp3 }}
                />
              )}
            </main>
          </div>
        )}

        {view === 'detail' && selectedPatient && (
          <div className="animate-in zoom-in duration-500">
            <PatientSummary
              patientData={selectedPatient.patientData}
              followUps={selectedPatient.followUps}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
