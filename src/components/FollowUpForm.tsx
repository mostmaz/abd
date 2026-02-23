import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';

import { HHSCalculator, type HHSData, initialHHS, calculateHHS } from './HHSCalculator';

export interface FollowUpData {
    painScore: string;
    rom: string;
    loda: string;
    hhsScore: string;
    hhsDetailed?: HHSData;
    xrayOne?: File | null;
    mriOne?: File | null;
}

interface FollowUpFormProps {
    title: string;
    data: FollowUpData;
    onChange: (field: keyof FollowUpData, value: any) => void;
}

export function FollowUpForm({ title, data, onChange }: FollowUpFormProps) {
    const [showCalculator, setShowCalculator] = React.useState(false);

    const handleFileChange = (field: 'xrayOne' | 'mriOne', e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onChange(field, file);
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="painScore">Pain Score (VAS 0-10)</Label>
                        <Input
                            id="painScore"
                            type="number"
                            min="0"
                            max="10"
                            value={data.painScore}
                            onChange={(e) => onChange('painScore', e.target.value)}
                            placeholder="0-10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rom">Range of Motion (ROM)</Label>
                        <Input
                            id="rom"
                            value={data.rom}
                            onChange={(e) => onChange('rom', e.target.value)}
                            placeholder="Degrees etc."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="loda">LODA</Label>
                        <Input
                            id="loda"
                            value={data.loda}
                            onChange={(e) => onChange('loda', e.target.value)}
                            placeholder="LODA Score"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="hhsScore" className="flex items-center justify-between">
                            <span>HHS Score</span>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => setShowCalculator(!showCalculator)}
                            >
                                {showCalculator ? 'Close Calculator' : 'Recalculate HHS'}
                            </Button>
                        </Label>
                        <Input
                            id="hhsScore"
                            value={data.hhsScore}
                            onChange={(e) => onChange('hhsScore', e.target.value)}
                            placeholder="Harris Hip Score"
                            className="font-bold text-lg"
                        />
                        {showCalculator && (
                            <div className="col-span-full mt-4">
                                <HHSCalculator
                                    data={data.hhsDetailed || initialHHS}
                                    onChange={(newHHS) => {
                                        onChange('hhsDetailed', newHHS);
                                        onChange('hhsScore', calculateHHS(newHHS).toString());
                                    }}
                                    onClose={() => setShowCalculator(false)}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="space-y-2">
                        <Label htmlFor="xray">X-Ray Film</Label>
                        <Input
                            id="xray"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange('xrayOne', e)}
                        />
                        {data.xrayOne && <p className="text-sm text-green-600">File selected: {data.xrayOne.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mri">MRI Film</Label>
                        <Input
                            id="mri"
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange('mriOne', e)}
                        />
                        {data.mriOne && <p className="text-sm text-green-600">File selected: {data.mriOne.name}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
