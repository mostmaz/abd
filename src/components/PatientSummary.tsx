import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { type PatientData } from './PatientForm';
import { type FollowUpData } from './FollowUpForm';

interface PatientSummaryProps {
    patientData: PatientData;
    followUps: {
        [key: string]: Partial<FollowUpData> & { xray_path?: string; mri_path?: string };
    };
}

export function PatientSummary({ patientData, followUps }: PatientSummaryProps) {
    const API_BASE = '';

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Patient Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold text-slate-500">Name:</span> {patientData.name}</div>
                    <div><span className="font-semibold text-slate-500">Age:</span> {patientData.age}</div>
                    <div><span className="font-semibold text-slate-500">Sex:</span> {patientData.sex}</div>
                    <div><span className="font-semibold text-slate-500">Address:</span> {patientData.address}</div>
                    <div><span className="font-semibold text-slate-500">Date of Surgery:</span> {patientData.dateOfSurgery}</div>
                    <div className="md:col-span-2"><span className="font-semibold text-slate-500">Drug Hx:</span> {patientData.drugHx}</div>
                    <div className="md:col-span-2"><span className="font-semibold text-slate-500">PMH:</span> {patientData.pmh}</div>
                    <div className="md:col-span-2"><span className="font-semibold text-slate-500">PSH:</span> {patientData.psh}</div>
                </CardContent>
            </Card>

            {Object.entries(followUps).map(([label, data]) => (
                <Card key={label}>
                    <CardHeader>
                        <CardTitle>{label === 'fu1' ? '1st' : label === 'fu2' ? '2nd' : label === 'fu3' ? '3rd' : label} Follow Up</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="font-semibold text-slate-500">Pain Score:</span> {data.painScore}</div>
                        <div><span className="font-semibold text-slate-500">ROM:</span> {data.rom}</div>
                        <div><span className="font-semibold text-slate-500">LODA:</span> {data.loda}</div>
                        <div><span className="font-semibold text-slate-500">HHS Score:</span> {data.hhsScore}</div>

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 mt-2">
                            <div className="space-y-2">
                                <span className="font-semibold text-slate-500 block">X-Ray Film:</span>
                                {data.xray_path ? (
                                    <div className="rounded-lg overflow-hidden border border-slate-200">
                                        <img
                                            src={`${API_BASE}/${data.xray_path}`}
                                            alt="X-ray"
                                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(`${API_BASE}/${data.xray_path}`, '_blank')}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-slate-50 flex items-center justify-center rounded-lg border border-dashed border-slate-200 text-slate-400 italic">
                                        No X-ray uploaded
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <span className="font-semibold text-slate-500 block">MRI Film:</span>
                                {data.mri_path ? (
                                    <div className="rounded-lg overflow-hidden border border-slate-200">
                                        <img
                                            src={`${API_BASE}/${data.mri_path}`}
                                            alt="MRI"
                                            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(`${API_BASE}/${data.mri_path}`, '_blank')}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-slate-50 flex items-center justify-center rounded-lg border border-dashed border-slate-200 text-slate-400 italic">
                                        No MRI uploaded
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
