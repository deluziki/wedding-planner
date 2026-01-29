import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Wedding, WeddingPartyMember } from '@/types';

interface Props {
    wedding: Wedding;
    member?: WeddingPartyMember;
}

export default function PartyForm({ wedding, member }: Props) {
    const isEditing = !!member;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Wedding Party', href: `/weddings/${wedding.id}/party` },
        { title: isEditing ? 'Edit Member' : 'Add Member', href: isEditing ? `/weddings/${wedding.id}/party/${member.id}/edit` : `/weddings/${wedding.id}/party/create` },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: member?.name || '',
        role: member?.role || 'bridesmaid',
        side: member?.side || 'bride',
        email: member?.email || '',
        phone: member?.phone || '',
        address: member?.address || '',
        outfit_status: member?.outfit_status || 'not_started',
        outfit_notes: member?.outfit_notes || '',
        speech_order: member?.speech_order?.toString() || '',
        notes: member?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/party/${member.id}`);
        } else {
            post(`/weddings/${wedding.id}/party`);
        }
    };

    const roles = [
        { value: 'maid_of_honor', label: 'Maid of Honor' },
        { value: 'best_man', label: 'Best Man' },
        { value: 'bridesmaid', label: 'Bridesmaid' },
        { value: 'groomsman', label: 'Groomsman' },
        { value: 'matron_of_honor', label: 'Matron of Honor' },
        { value: 'junior_bridesmaid', label: 'Junior Bridesmaid' },
        { value: 'junior_groomsman', label: 'Junior Groomsman' },
        { value: 'flower_girl', label: 'Flower Girl' },
        { value: 'ring_bearer', label: 'Ring Bearer' },
        { value: 'usher', label: 'Usher' },
        { value: 'officiant', label: 'Officiant' },
        { value: 'reader', label: 'Reader' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Party Member`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild><Link href={`/weddings/${wedding.id}/party`}><ArrowLeft className="h-4 w-4" /></Link></Button>
                    <PageHeader title={isEditing ? `Edit ${member.name}` : 'Add Member'} description={isEditing ? 'Update party member details' : 'Add a new wedding party member'} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Basic Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Full name" />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role *</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{roles.map((role) => (<SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="side">Side *</Label>
                                    <Select value={data.side} onValueChange={(value) => setData('side', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bride">Bride's Side</SelectItem>
                                            <SelectItem value="groom">Groom's Side</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Contact Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="address">Address</Label><Textarea id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} rows={2} /></div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Outfit & Duties</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="outfit_status">Outfit Status</Label>
                                    <Select value={data.outfit_status} onValueChange={(value) => setData('outfit_status', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="not_started">Not Started</SelectItem>
                                            <SelectItem value="shopping">Shopping</SelectItem>
                                            <SelectItem value="ordered">Ordered</SelectItem>
                                            <SelectItem value="alterations">Alterations</SelectItem>
                                            <SelectItem value="ready">Ready</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="speech_order">Speech Order</Label>
                                    <Input id="speech_order" type="number" min="0" value={data.speech_order} onChange={(e) => setData('speech_order', e.target.value)} placeholder="Leave blank if no speech" />
                                </div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="outfit_notes">Outfit Notes</Label><Textarea id="outfit_notes" value={data.outfit_notes} onChange={(e) => setData('outfit_notes', e.target.value)} rows={2} /></div>
                            <div className="space-y-2"><Label htmlFor="notes">Additional Notes</Label><Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} /></div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/party`}>Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{processing ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Member')}</Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
