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
}

export function PatientList({ patients, onSelect, onAddNew }: PatientListProps) {
    return (
        <Card className="w-full">
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
                                        <td className="px-6 py-4">
                                            <Button variant="outline" onClick={() => onSelect(patient.id)}>
                                                View Details
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
