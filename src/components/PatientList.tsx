import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface PatientListItem {
    id: string;
    name: string;
    age: number;
    sex: string;
    dateOfSurgery: string;
    created_at: string;
}

interface PatientListProps {
    patients: PatientListItem[];
    onSelect: (id: string) => void;
    onAddNew: () => void;
    onDelete: (id: string) => void;
}

export function PatientList({ patients, onSelect, onAddNew, onDelete }: PatientListProps) {
    const [patientToDelete, setPatientToDelete] = useState<PatientListItem | null>(null);

    const confirmDelete = () => {
        if (patientToDelete) {
            onDelete(patientToDelete.id);
            setPatientToDelete(null);
        }
    };

    return (
        <Card className="w-full relative">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Registered Patients</CardTitle>
                <Button onClick={onAddNew}>Add New Patient</Button>
            </CardHeader>
            <CardContent>
                {patients.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No patients registered yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Age/Sex</th>
                                    <th className="px-6 py-3">Surgery Date</th>
                                    <th className="px-6 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map((patient) => (
                                    <tr key={patient.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{patient.name}</td>
                                        <td className="px-6 py-4">{patient.age} / {patient.sex}</td>
                                        <td className="px-6 py-4">{patient.dateOfSurgery}</td>
                                        <td className="px-6 py-4 space-x-2">
                                            <Button variant="outline" onClick={() => onSelect(patient.id)}>
                                                View Details
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="border-red-500 text-red-500 hover:bg-red-50"
                                                onClick={() => setPatientToDelete(patient)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>

            {/* Confirmation Dialog Overlay */}
            {patientToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Deletion</h3>
                        <p className="text-slate-500 mb-6">
                            Are you sure you want to delete the record for <strong className="text-slate-900">{patientToDelete.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button variant="outline" onClick={() => setPatientToDelete(null)}>
                                Cancel
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={confirmDelete}>
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
