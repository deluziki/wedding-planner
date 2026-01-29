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
import type { BreadcrumbItem, Menu, MenuItem, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    item?: MenuItem;
    menus: Menu[];
    defaultMenuId?: number;
}

export default function MenuItemForm({ wedding, item, menus, defaultMenuId }: Props) {
    const isEditing = !!item;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Menus', href: `/weddings/${wedding.id}/menus` },
        { title: isEditing ? 'Edit Item' : 'Add Item', href: isEditing ? `/weddings/${wedding.id}/menus/items/${item.id}/edit` : `/weddings/${wedding.id}/menus/items/create` },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        menu_id: item?.menu_id?.toString() || defaultMenuId?.toString() || '',
        name: item?.name || '',
        description: item?.description || '',
        category: item?.category || 'main',
        price: item?.price?.toString() || '',
        is_vegetarian: item?.is_vegetarian || false,
        is_vegan: item?.is_vegan || false,
        is_gluten_free: item?.is_gluten_free || false,
        allergens: item?.allergens?.join(', ') || '',
        notes: item?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/menus/items/${item.id}`);
        } else {
            post(`/weddings/${wedding.id}/menus/items`);
        }
    };

    const categories = [
        { value: 'appetizer', label: 'Appetizer' },
        { value: 'soup', label: 'Soup' },
        { value: 'salad', label: 'Salad' },
        { value: 'main', label: 'Main Course' },
        { value: 'side', label: 'Side Dish' },
        { value: 'dessert', label: 'Dessert' },
        { value: 'beverage', label: 'Beverage' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Menu Item`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild><Link href={`/weddings/${wedding.id}/menus`}><ArrowLeft className="h-4 w-4" /></Link></Button>
                    <PageHeader title={isEditing ? `Edit ${item.name}` : 'Add Menu Item'} description={isEditing ? 'Update item details' : 'Add a new item to the menu'} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Item Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Item Name *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g., Grilled Salmon" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="menu_id">Menu *</Label>
                                    <Select value={data.menu_id} onValueChange={(value) => setData('menu_id', value)}>
                                        <SelectTrigger><SelectValue placeholder="Select menu" /></SelectTrigger>
                                        <SelectContent>{menus.map((m) => (<SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={data.category} onValueChange={(value) => setData('category', value)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>{categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" type="number" min="0" step="0.01" value={data.price} onChange={(e) => setData('price', e.target.value)} placeholder="Optional" />
                                </div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={2} placeholder="Ingredients, preparation, etc." /></div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader><CardTitle className="text-base font-medium">Dietary Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2"><Checkbox id="is_vegetarian" checked={data.is_vegetarian} onCheckedChange={(checked) => setData('is_vegetarian', !!checked)} /><Label htmlFor="is_vegetarian" className="font-normal">Vegetarian</Label></div>
                                <div className="flex items-center gap-2"><Checkbox id="is_vegan" checked={data.is_vegan} onCheckedChange={(checked) => setData('is_vegan', !!checked)} /><Label htmlFor="is_vegan" className="font-normal">Vegan</Label></div>
                                <div className="flex items-center gap-2"><Checkbox id="is_gluten_free" checked={data.is_gluten_free} onCheckedChange={(checked) => setData('is_gluten_free', !!checked)} /><Label htmlFor="is_gluten_free" className="font-normal">Gluten-Free</Label></div>
                            </div>
                            <div className="space-y-2"><Label htmlFor="allergens">Allergens</Label><Input id="allergens" value={data.allergens} onChange={(e) => setData('allergens', e.target.value)} placeholder="Nuts, Dairy, Shellfish (comma-separated)" /></div>
                            <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={data.notes} onChange={(e) => setData('notes', e.target.value)} rows={2} /></div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/menus`}>Cancel</Link></Button>
                        <Button type="submit" disabled={processing}>{processing ? (isEditing ? 'Saving...' : 'Adding...') : (isEditing ? 'Save Changes' : 'Add Item')}</Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
