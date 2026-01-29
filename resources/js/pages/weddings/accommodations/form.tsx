import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import WeddingLayout from '@/layouts/wedding-layout';
import type { Accommodation, BreadcrumbItem, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    accommodation?: Accommodation;
}

export default function AccommodationForm({ wedding, accommodation }: Props) {
    const isEditing = !!accommodation;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Accommodations', href: `/weddings/${wedding.id}/accommodations` },
        { title: isEditing ? 'Edit' : 'Add', href: isEditing ? `/weddings/${wedding.id}/accommodations/${accommodation.id}/edit` : `/weddings/${wedding.id}/accommodations/create` },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: accommodation?.name || '',
        type: accommodation?.type || 'hotel',
        address: accommodation?.address || '',
        city: accommodation?.city || '',
        state: accommodation?.state || '',
        country: accommodation?.country || '',
        postal_code: accommodation?.postal_code || '',
        phone: accommodation?.phone || '',
        email: accommodation?.email || '',
        website: accommodation?.website || '',
        room_block_size: accommodation?.room_block_size?.toString() || '',
        rooms_booked: accommodation?.rooms_booked?.toString() || '0',
        rate_per_night: accommodation?.rate_per_night?.toString() || '',
        booking_code: accommodation?.booking_code || '',
        booking_link: accommodation?.booking_link || '',
        block_deadline: accommodation?.block_deadline || '',
        check_in_date: accommodation?.check_in_date || '',
        check_out_date: accommodation?.check_out_date || '',
        is_primary: accommodation?.is_primary || false,
        amenities: accommodation?.amenities?.join(', ') || '',
        parking_info: accommodation?.parking_info || '',
        shuttle_info: accommodation?.shuttle_info || '',
        notes: accommodation?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/accommodations/${accommodation.id}`);
        } else {
            post(`/weddings/${wedding.id}/accommodations`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Accommodation`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild><Link href={`/weddings/${wedding.id}/accommodations`}><ArrowLeft className="h-4 w-4" /></Link></Button>
                    <PageHeader title={isEditing ? `Edit ${accommodation.name}` : 'Add Accommodation'} description={isEditing ? 'Update accommodation details' : 'Add a new accommodation option'} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Basic Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g., Grand Hotel" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hotel">Hotel</SelectItem>
                                            <SelectItem value="resort">Resort</SelectItem>
                                            <SelectItem value="airbnb">Airbnb</SelectItem>
                                            <SelectItem value="inn">Inn / B&B</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="is_primary" checked={data.is_primary} onCheckedChange={(checked) => setData('is_primary', !!checked)} />
                                <Label htmlFor="is_primary" className="font-normal">Primary accommodation</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Location & Contact</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="address">Address</Label><Input id="address" value={data.address} onChange={(e) => setData('address', e.target.value)} /></div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2"><Label htmlFor="city">City</Label><Input id="city" value={data.city} onChange={(e) => setData('city', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="state">State</Label><Input id="state" value={data.state} onChange={(e) => setData('state', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="postal_code">Postal Code</Label><Input id="postal_code" value={data.postal_code} onChange={(e) => setData('postal_code', e.target.value)} /></div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="website">Website</Label><Input id="website" type="url" value={data.website} onChange={(e) => setData('website', e.target.value)} /></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Room Block</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2"><Label htmlFor="room_block_size">Block Size</Label><Input id="room_block_size" type="number" min="0" value={data.room_block_size} onChange={(e) => setData('room_block_size', e.target.value)} placeholder="Number of rooms" /></div>
                                <div className="space-y-2"><Label htmlFor="rooms_booked">Rooms Booked</Label><Input id="rooms_booked" type="number" min="0" value={data.rooms_booked} onChange={(e) => setData('rooms_booked', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="rate_per_night">Rate per Night</Label><Input id="rate_per_night" type="number" min="0" step="0.01" value={data.rate_per_night} onChange={(e) => setData('rate_per_night', e.target.value)} /></div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="booking_code">Booking Code</Label><Input id="booking_code" value={data.booking_code} onChange={(e) => setData('booking_code', e.target.value)} placeholder="Group booking code" /></div>
                                <div className="space-y-2"><Label htmlFor="booking_link">Booking Link</Label><Input id="booking_link" type="url" value={data.booking_link} onChange={(e) => setData('booking_link', e.target.value)} /></div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2"><Label htmlFor="block_deadline">Block Deadline</Label><Input id="block_deadline" type="date" value={data.block_deadline} onChange={(e) => setData('block_deadline', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="check_in_date">Check-in Date</Label><Input id="check_in_date" type="date" value={data.check_in_date} onChange={(e) => setData('check_in_date', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="check_out_date">Check-out Date</Label><Input id="check_out_date" type="date" value={data.check_out_date} onChange={(e) => setData('check_out_date', e.target.value)} /></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Additional Info</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2"><Label htmlFor="amenities">Amenities</Label><Input id="amenities" value={data.amenities} onChange={(e) => setData('amenities', e.target.value)} placeholder="Pool, Spa, Restaurant (comma-separated)" /></div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="parking_info">Parking Info</Label><Textarea id="parking_info" value={data.parking_info} onChange={(e) => setData('parking_info', e.target.value)} rows={2} /></div>
                                <div className="space-y-2"><Label htmlFor="shuttle_info">Shuttle Info</Label><Textarea id="shuttle_info" value={data.shuttle_info} onChange={(e) => setData('shuttle_info', e.target.value)} rows={2} /></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} /></div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/accommodations`}>Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{processing ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Accommodation')}</Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
