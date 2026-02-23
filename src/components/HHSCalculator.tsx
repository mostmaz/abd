
import { Label } from './ui/Label';
import { Button } from './ui/Button';

export interface HHSData {
    pain: number;
    limp: number;
    support: number;
    distance: number;
    sitting: number;
    transport: number;
    stairs: number;
    socks: number;
    deformity: {
        flexion: boolean;
        abduction: boolean;
        rotation: boolean;
        discrepancy: boolean;
    };
    rom: {
        flexion: string;
        abduction: string;
        adduction: string;
        extRotation: string;
        intRotation: string;
    };
}

export const initialHHS: HHSData = {
    pain: 44,
    limp: 11,
    support: 11,
    distance: 11,
    sitting: 5,
    transport: 1,
    stairs: 4,
    socks: 4,
    deformity: { flexion: true, abduction: true, rotation: true, discrepancy: true },
    rom: { flexion: '140', abduction: '40', adduction: '40', extRotation: '40', intRotation: '40' }
};

export function calculateHHS(hhs: HHSData): number {
    let score = 0;
    score += hhs.pain;
    score += hhs.limp;
    score += hhs.support;
    score += hhs.distance;
    score += hhs.sitting;
    score += hhs.transport;
    score += hhs.stairs;
    score += hhs.socks;

    // Deformity: 4 points if all true
    if (hhs.deformity.flexion && hhs.deformity.abduction && hhs.deformity.rotation && hhs.deformity.discrepancy) {
        score += 4;
    }

    // ROM points
    const totalDegrees =
        (parseInt(hhs.rom.flexion) || 0) +
        (parseInt(hhs.rom.abduction) || 0) +
        (parseInt(hhs.rom.adduction) || 0) +
        (parseInt(hhs.rom.extRotation) || 0) +
        (parseInt(hhs.rom.intRotation) || 0);

    if (totalDegrees >= 211) score += 5;
    else if (totalDegrees >= 161) score += 4;
    else if (totalDegrees >= 101) score += 3;
    else if (totalDegrees >= 61) score += 2;
    else if (totalDegrees >= 31) score += 1;

    return score;
}

interface HHSCalculatorProps {
    data: HHSData;
    onChange: (data: HHSData) => void;
    onClose: () => void;
}

export function HHSCalculator({ data, onChange, onClose }: HHSCalculatorProps) {
    const handleChange = (field: keyof HHSData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const handleDeformityChange = (field: keyof HHSData['deformity'], value: boolean) => {
        onChange({ ...data, deformity: { ...data.deformity, [field]: value } });
    };

    const handleROMChange = (field: keyof HHSData['rom'], value: string) => {
        onChange({ ...data, rom: { ...data.rom, [field]: value } });
    };

    return (
        <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold text-slate-900">Harris Hip Score Calculator</h3>
                <div className="text-2xl font-black text-slate-900 bg-white px-4 py-2 rounded-lg border border-slate-200">
                    Total: {calculateHHS(data)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pain */}
                <div className="space-y-4">
                    <Label className="text-lg font-bold">Pain</Label>
                    <select
                        className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-slate-900 transition-all"
                        value={data.pain}
                        onChange={(e) => handleChange('pain', parseInt(e.target.value))}
                    >
                        <option value={44}>None or ignores it (44)</option>
                        <option value={40}>Slight, occasional, no compromise (40)</option>
                        <option value={30}>Mild pain, no effect on average activity (30)</option>
                        <option value={20}>Moderate pain, tolerable, requires aspirin (20)</option>
                        <option value={10}>Marked pain, serious limitation (10)</option>
                        <option value={0}>Totally disabled, bedridden (0)</option>
                    </select>

                    <Label className="text-lg font-bold">Limp</Label>
                    <select
                        className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-slate-900 transition-all"
                        value={data.limp}
                        onChange={(e) => handleChange('limp', parseInt(e.target.value))}
                    >
                        <option value={11}>None (11)</option>
                        <option value={8}>Slight (8)</option>
                        <option value={5}>Moderate (5)</option>
                        <option value={0}>Severe (0)</option>
                    </select>
                </div>

                {/* Support */}
                <div className="space-y-4">
                    <Label className="text-lg font-bold">Support</Label>
                    <select
                        className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-slate-900 transition-all"
                        value={data.support}
                        onChange={(e) => handleChange('support', parseInt(e.target.value))}
                    >
                        <option value={11}>None (11)</option>
                        <option value={7}>Cane for long walks (7)</option>
                        <option value={5}>Cane most of the time (5)</option>
                        <option value={3}>One crutch (3)</option>
                        <option value={2}>Two canes (2)</option>
                        <option value={0}>Two crutches or not able to walk (0)</option>
                    </select>

                    <Label className="text-lg font-bold">Distance Walked</Label>
                    <select
                        className="w-full p-3 rounded-lg border bg-white focus:ring-2 focus:ring-slate-900 transition-all"
                        value={data.distance}
                        onChange={(e) => handleChange('distance', parseInt(e.target.value))}
                    >
                        <option value={11}>Unlimited (11)</option>
                        <option value={8}>Six blocks (8)</option>
                        <option value={5}>Two or three blocks (5)</option>
                        <option value={2}>Indoors only (2)</option>
                        <option value={0}>Bed and chair only (0)</option>
                    </select>
                </div>

                {/* Mobility components */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <Label className="font-bold">Activities</Label>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Sitting</span>
                                <select className="w-full p-2 text-sm border rounded bg-white" value={data.sitting} onChange={e => handleChange('sitting', parseInt(e.target.value))}>
                                    <option value={5}>Ordinary chair 1hr (5)</option>
                                    <option value={3}>High chair 30m (3)</option>
                                    <option value={0}>Unable to sit comfortably (0)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Public Transport</span>
                                <select className="w-full p-2 text-sm border rounded bg-white" value={data.transport} onChange={e => handleChange('transport', parseInt(e.target.value))}>
                                    <option value={1}>Yes (1)</option>
                                    <option value={0}>No (0)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Stairs</span>
                                <select className="w-full p-2 text-sm border rounded bg-white" value={data.stairs} onChange={e => handleChange('stairs', parseInt(e.target.value))}>
                                    <option value={4}>Without railing (4)</option>
                                    <option value={2}>Using a railing (2)</option>
                                    <option value={1}>Any manner (1)</option>
                                    <option value={0}>Unable (0)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-medium">Socks/Shoes</span>
                                <select className="w-full p-2 text-sm border rounded bg-white" value={data.socks} onChange={e => handleChange('socks', parseInt(e.target.value))}>
                                    <option value={4}>With ease (4)</option>
                                    <option value={2}>With difficulty (2)</option>
                                    <option value={0}>Unable (0)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deformity */}
                <div className="space-y-4">
                    <Label className="font-bold">Absence of Deformity (All Yes = 4pts)</Label>
                    <div className="space-y-3 bg-white p-4 rounded-lg border">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={data.deformity.flexion} onChange={e => handleDeformityChange('flexion', e.target.checked)} className="w-5 h-5 accent-slate-900" />
                            <span className="text-sm">Less than 30° fixed flexion contracture</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={data.deformity.abduction} onChange={e => handleDeformityChange('abduction', e.target.checked)} className="w-5 h-5 accent-slate-900" />
                            <span className="text-sm">Less than 10° fixed abduction</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={data.deformity.rotation} onChange={e => handleDeformityChange('rotation', e.target.checked)} className="w-5 h-5 accent-slate-900" />
                            <span className="text-sm">Less than 10° fixed internal rotation</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" checked={data.deformity.discrepancy} onChange={e => handleDeformityChange('discrepancy', e.target.checked)} className="w-5 h-5 accent-slate-900" />
                            <span className="text-sm">Limb length discrepancy &lt; 3.2cm</span>
                        </label>
                    </div>
                </div>

                {/* Range of Motion */}
                <div className="md:col-span-2 space-y-4">
                    <Label className="font-bold">Range of Motion (Degrees)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-500">Flexion (*140)</span>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={data.rom.flexion}
                                onChange={e => handleROMChange('flexion', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-500">Abduction (*40)</span>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={data.rom.abduction}
                                onChange={e => handleROMChange('abduction', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-500">Adduction (*40)</span>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={data.rom.adduction}
                                onChange={e => handleROMChange('adduction', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-500">Ext. Rotation (*40)</span>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={data.rom.extRotation}
                                onChange={e => handleROMChange('extRotation', e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-semibold text-slate-500">Int. Rotation (*40)</span>
                            <input
                                type="number"
                                className="w-full p-2 border rounded"
                                value={data.rom.intRotation}
                                onChange={e => handleROMChange('intRotation', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t">
                <Button onClick={onClose} size="lg">Apply HHS Result</Button>
            </div>
        </div>
    );
}
