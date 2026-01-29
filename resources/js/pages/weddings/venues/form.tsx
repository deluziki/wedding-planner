import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Venue, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    venue?: Venue;
}

export default function VenueForm({ wedding, venue }: Props) {
    const isEditing = !!venue;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Venues', href: `/weddings/${wedding.id}/venues` },
        {
            title: isEditing ? 'Edit Venue' : 'Add Venue',
            href: isEditing
                ? `/weddings/${wedding.id}/venues/${venue.id}/edit`
                : `/weddings/${wedding.id}/venues/create`,
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: venue?.name || '',
        type: venue?.type || 'both',
        address: venue?.address || '',
        city: venue?.city || '',
        state: venue?.state || '',
        country: venue?.country || '',
        postal_code: venue?.postal_code || '',
        contact_name: venue?.contact_name || '',
        email: venue?.email || '',
        phone: venue?.phone || '',
        website: venue?.website || '',
        capacity: venue?.capacity?.toString() || '',
        cost: venue?.cost?.toString() || '',
        deposit_amount: venue?.deposit_amount?.toString() || '',
        deposit_paid: venue?.deposit_paid || false,
        is_booked: venue?.is_booked || false,
        is_primary: venue?.is_primary || false,
        parking_info: venue?.parking_info || '',
        accessibility_info: venue?.accessibility_info || '',
        notes: venue?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/venues/${venue.id}`);
        } else {
            post(`/weddings/${wedding.id}/venues`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Venue`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/weddings/${wedding.id}/venues`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <PageHeader
                        title={isEditing ? `Edit ${venue.name}` : 'Add Venue'}
                        description={isEditing ? 'Update venue details' : 'Add a new venue'}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Venue Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g., Grand Ballroom" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ceremony">Ceremony</SelectItem>
                                            <SelectItem value="reception">Reception</SelectItem>
                                            <SelectItem value="both">Both</SelectItem>
                                            <SelectItem value="rehearsal">Rehearsal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_booked" checked={data.is_booked} onCheckedChange={(checked) => setData('is_booked', !!checked)} />
                                    <Label htmlFor="is_booked" className="font-normal">Booked</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox id="is_primary" checked={data.is_primary} onCheckedChange={(checked) => setData('is_primary', !!checked)} />
                                    <Label htmlFor="is_primary" className="font-normal">Primary venue</Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Address</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder="123 Wedding Lane" />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" value={data.state} onChange={(e) => setData('state', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="postal_code">Postal Code</Label><Input id="postal_code" value={data.postal_code} onChange={(e) => setData('postal_code', e.target.value)} /></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Contact</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2"><Label htmlFor="contact_name">Contact Name</Label><Input id="contact_name" value={data.contact_name} onChange={(e) => setData('contact_name', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="website">Website</Label><Input id="website" value={data.website} onChange={(e) => setData('website', e.target.value)} /></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Details & Pricing</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2"><Label htmlFor="capacity">Capacity</Label><Input id="capacity" type="number" min="0" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="cost">Cost</Label><Input id="cost" type="number" min="0" step="0.01" value={data.cost} onChange={(e) => setData('cost', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="deposit_amount">Deposit</Label><Input id="deposit_amount" type="number" min="0" step="0.01" value={data.deposit_amount} onChange={(e) => setData('deposit_amount', e.target.value)} /></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="deposit_paid" checked={data.deposit_paid} onCheckedChange={(checked) => setData('deposit_paid', !!checked)} />
                                <Label htmlFor="deposit_paid" className="font-normal">Deposit paid</Label>
                            </div>
                            <div className="space-y-2"><Label htmlFor="parking_info">Parking Information</Label><Textarea id="parking_info" value={data.parking_info} onChange={(e) => setData('parking_info', e.target.value)} rows={2} /></div>
                            <div className="space-y-2"><Label htmlFor="accessibility_info">Accessibility</Label><Textarea id="accessibility_info" value={data.accessibility_info} onChange={(e) => setData('accessibility_info', e.target.value)} rows={2} /></div>
                            <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} /></div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/venues`}>Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{processing ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Add Venue')}</Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
