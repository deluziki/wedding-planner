import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, Check, Edit, FileText, MapPin, User } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, MarriageCertificate, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    certificate: MarriageCertificate | null;
}

export default function CertificateIndex({ wedding, certificate }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Certificate', href: `/weddings/${wedding.id}/certificate` },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        certificate_number: certificate?.certificate_number || '',
        issue_date: certificate?.issue_date || '',
        issue_location: certificate?.issue_location || '',
        spouse1_full_name: certificate?.spouse1_full_name || '',
        spouse1_birth_date: certificate?.spouse1_birth_date || '',
        spouse1_birth_place: certificate?.spouse1_birth_place || '',
        spouse1_nationality: certificate?.spouse1_nationality || '',
        spouse2_full_name: certificate?.spouse2_full_name || '',
        spouse2_birth_date: certificate?.spouse2_birth_date || '',
        spouse2_birth_place: certificate?.spouse2_birth_place || '',
        spouse2_nationality: certificate?.spouse2_nationality || '',
        officiant_name: certificate?.officiant_name || '',
        officiant_title: certificate?.officiant_title || '',
        witness1_name: certificate?.witness1_name || '',
        witness2_name: certificate?.witness2_name || '',
        registration_number: certificate?.registration_number || '',
        notes: certificate?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (certificate) {
            put(`/weddings/${wedding.id}/certificate`);
        } else {
            post(`/weddings/${wedding.id}/certificate`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Marriage Certificate`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Marriage Certificate"
                    description="Record your official marriage documentation"
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Certificate Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base font-medium">
                                <FileText className="h-4 w-4" />
                                Certificate Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="certificate_number">Certificate Number</Label>
                                    <Input id="certificate_number" value={data.certificate_number} onChange={(e) => setData('certificate_number', e.target.value)} placeholder="Enter certificate number" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="issue_date">Issue Date</Label>
                                    <Input id="issue_date" type="date" value={data.issue_date} onChange={(e) => setData('issue_date', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registration_number">Registration Number</Label>
                                    <Input id="registration_number" value={data.registration_number} onChange={(e) => setData('registration_number', e.target.value)} placeholder="Optional" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="issue_location">Issue Location</Label>
                                <Input id="issue_location" value={data.issue_location} onChange={(e) => setData('issue_location', e.target.value)} placeholder="City, State/Country" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Spouse 1 */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base font-medium">
                                <User className="h-4 w-4" />
                                Spouse 1
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="spouse1_full_name">Full Legal Name</Label>
                                    <Input id="spouse1_full_name" value={data.spouse1_full_name} onChange={(e) => setData('spouse1_full_name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="spouse1_birth_date">Date of Birth</Label>
                                    <Input id="spouse1_birth_date" type="date" value={data.spouse1_birth_date} onChange={(e) => setData('spouse1_birth_date', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="spouse1_birth_place">Place of Birth</Label>
                                    <Input id="spouse1_birth_place" value={data.spouse1_birth_place} onChange={(e) => setData('spouse1_birth_place', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="spouse1_nationality">Nationality</Label>
                                    <Input id="spouse1_nationality" value={data.spouse1_nationality} onChange={(e) => setData('spouse1_nationality', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Spouse 2 */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base font-medium">
                                <User className="h-4 w-4" />
                                Spouse 2
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="spouse2_full_name">Full Legal Name</Label>
                                    <Input id="spouse2_full_name" value={data.spouse2_full_name} onChange={(e) => setData('spouse2_full_name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="spouse2_birth_date">Date of Birth</Label>
                                    <Input id="spouse2_birth_date" type="date" value={data.spouse2_birth_date} onChange={(e) => setData('spouse2_birth_date', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="spouse2_birth_place">Place of Birth</Label>
                                    <Input id="spouse2_birth_place" value={data.spouse2_birth_place} onChange={(e) => setData('spouse2_birth_place', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="spouse2_nationality">Nationality</Label>
                                    <Input id="spouse2_nationality" value={data.spouse2_nationality} onChange={(e) => setData('spouse2_nationality', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Officiant & Witnesses */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Officiant & Witnesses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="officiant_name">Officiant Name</Label>
                                    <Input id="officiant_name" value={data.officiant_name} onChange={(e) => setData('officiant_name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="officiant_title">Officiant Title</Label>
                                    <Input id="officiant_title" value={data.officiant_title} onChange={(e) => setData('officiant_title', e.target.value)} placeholder="e.g., Minister, Judge" />
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="witness1_name">Witness 1</Label>
                                    <Input id="witness1_name" value={data.witness1_name} onChange={(e) => setData('witness1_name', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="witness2_name">Witness 2</Label>
                                    <Input id="witness2_name" value={data.witness2_name} onChange={(e) => setData('witness2_name', e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} placeholder="Any additional notes about the certificate..." rows={3} />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : certificate ? 'Update Certificate' : 'Save Certificate'}
                        </Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
