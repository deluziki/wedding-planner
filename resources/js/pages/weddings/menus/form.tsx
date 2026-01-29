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
import type { BreadcrumbItem, Menu, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    menu?: Menu;
}

export default function MenuForm({ wedding, menu }: Props) {
    const isEditing = !!menu;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Menus', href: `/weddings/${wedding.id}/menus` },
        { title: isEditing ? 'Edit Menu' : 'Add Menu', href: isEditing ? `/weddings/${wedding.id}/menus/${menu.id}/edit` : `/weddings/${wedding.id}/menus/create` },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: menu?.name || '',
        type: menu?.type || 'reception',
        description: menu?.description || '',
        notes: menu?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/menus/${menu.id}`);
        } else {
            post(`/weddings/${wedding.id}/menus`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Menu`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild><Link href={`/weddings/${wedding.id}/menus`}><ArrowLeft className="h-4 w-4" /></Link></Button>
                    <PageHeader title={isEditing ? `Edit ${menu.name}` : 'Add Menu'} description={isEditing ? 'Update menu details' : 'Create a new menu'} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Menu Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Menu Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g., Reception Dinner" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select value={data.type} onValueChange={(value) => setData('type', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="reception">Reception</SelectItem>
                                            <SelectItem value="rehearsal_dinner">Rehearsal Dinner</SelectItem>
                                            <SelectItem value="cocktail_hour">Cocktail Hour</SelectItem>
                                            <SelectItem value="brunch">Brunch</SelectItem>
                                            <SelectItem value="late_night">Late Night</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2} /></div>
                            <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={3} /></div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/menus`}>Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{processing ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Menu')}</Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
