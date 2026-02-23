import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';

export interface PatientData {
    name: string;
    age: string;
    sex: 'Male' | 'Female' | '';
    address: string;
    dateOfSurgery: string;
    drugHx: string;
    pmh: string;
    psh: string;
}

interface PatientFormProps {
    data: PatientData;
    onChange: (field: keyof PatientData, value: string) => void;
}

export function PatientForm({ data, onChange }: PatientFormProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Patient Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Patient Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => onChange('name', e.target.value)}
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                            id="age"
                            type="number"
                            value={data.age}
                            onChange={(e) => onChange('age', e.target.value)}
                            placeholder="Age"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sex">Sex</Label>
                        <select
                            id="sex"
                            className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={data.sex}
                            onChange={(e) => onChange('sex', e.target.value)}
                        >
                            <option value="">Select Sex</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            value={data.address}
                            onChange={(e) => onChange('address', e.target.value)}
                            placeholder="Address"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="surgeryDate">Date of Surgery</Label>
                        <Input
                            id="surgeryDate"
                            type="date"
                            value={data.dateOfSurgery}
                            onChange={(e) => onChange('dateOfSurgery', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="drugHx">Drug History (Drug Hx)</Label>
                    <textarea
                        id="drugHx"
                        className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.drugHx}
                        onChange={(e) => onChange('drugHx', e.target.value)}
                        placeholder="List current medications..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pmh">Past Medical History (PMH)</Label>
                    <textarea
                        id="pmh"
                        className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.pmh}
                        onChange={(e) => onChange('pmh', e.target.value)}
                        placeholder="Previous medical conditions..."
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="psh">Past Surgical History (PSH)</Label>
                    <textarea
                        id="psh"
                        className="flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={data.psh}
                        onChange={(e) => onChange('psh', e.target.value)}
                        placeholder="Previous surgeries..."
                    />
                </div>
            </CardContent>
        </Card>
    );
}
