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
import type { BreadcrumbItem, Gift, GiftRegistry, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    gift?: Gift;
    registries: GiftRegistry[];
    defaultRegistryId?: number;
}

export default function GiftForm({ wedding, gift, registries, defaultRegistryId }: Props) {
    const isEditing = !!gift;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Gift Registry', href: `/weddings/${wedding.id}/gifts` },
        { title: isEditing ? 'Edit Gift' : 'Add Gift', href: isEditing ? `/weddings/${wedding.id}/gifts/${gift.id}/edit` : `/weddings/${wedding.id}/gifts/create` },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        registry_id: gift?.registry_id?.toString() || defaultRegistryId?.toString() || '',
        name: gift?.name || '',
        brand: gift?.brand || '',
        description: gift?.description || '',
        price: gift?.price?.toString() || '',
        quantity_requested: gift?.quantity_requested?.toString() || '1',
        quantity_purchased: gift?.quantity_purchased?.toString() || '0',
        url: gift?.url || '',
        image_url: gift?.image_url || '',
        priority: gift?.priority || 'medium',
        category: gift?.category || '',
        is_purchased: gift?.is_purchased || false,
        purchased_by: gift?.purchased_by || '',
        thank_you_sent: gift?.thank_you_sent || false,
        notes: gift?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/gifts/${gift.id}`);
        } else {
            post(`/weddings/${wedding.id}/gifts`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Gift`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild><Link href={`/weddings/${wedding.id}/gifts`}><ArrowLeft className="h-4 w-4" /></Link></Button>
                    <PageHeader title={isEditing ? `Edit ${gift.name}` : 'Add Gift'} description={isEditing ? 'Update gift details' : 'Add a new gift to your registry'} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Gift Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Gift Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g., KitchenAid Stand Mixer" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registry_id">Registry *</Label>
                                    <Select value={data.registry_id} onValueChange={(value) => setData('registry_id', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select registry" /></SelectTrigger>
                                        <SelectContent>{registries.map((r) => (<SelectItem key={r.id} value={r.id.toString()}>{r.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2"><Label htmlFor="brand">Brand</Label><Input id="brand" value={data.brand} onChange={(e) => setData('brand', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="price">Price</Label><Input id="price" type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} /></div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select value={data.priority} onValueChange={(value) => setData('priority', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2} /></div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="url">Product URL</Label><Input id="url" type="url" value={data.url} onChange={(e) => setData('url', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" value={data.category} onChange={(e) => setData('category', e.target.value)} placeholder="e.g., Kitchen, Bedroom" /></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Quantity & Status</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="quantity_requested">Quantity Requested</Label><Input id="quantity_requested" type="number" min="1" value={data.quantity_requested} onChange={(e) => setData('quantity_requested', e.target.value)} /></div>
                                <div className="space-y-2"><Label htmlFor="quantity_purchased">Quantity Purchased</Label><Input id="quantity_purchased" type="number" min="0" value={data.quantity_purchased} onChange={(e) => setData('quantity_purchased', e.target.value)} /></div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2"><Checkbox id="is_purchased" checked={data.is_purchased} onCheckedChange={(checked) => setData('is_purchased', !!checked)} /><Label htmlFor="is_purchased" className="font-normal">Purchased</Label></div>
                                <div className="flex items-center gap-2"><Checkbox id="thank_you_sent" checked={data.thank_you_sent} onCheckedChange={(checked) => setData('thank_you_sent', !!checked)} /><Label htmlFor="thank_you_sent" className="font-normal">Thank you sent</Label></div>
                            </div>
                            {data.is_purchased && (
                                <div className="space-y-2"><Label htmlFor="purchased_by">Purchased By</Label><Input id="purchased_by" value={data.purchased_by} onChange={(e) => setData('purchased_by', e.target.value)} placeholder="Guest name" /></div>
                            )}
                            <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={2} /></div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/gifts`}>Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{processing ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Gift')}</Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
