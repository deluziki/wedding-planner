import { Head, Link, router } from '@inertiajs/react';
import { ChefHat, Edit, MoreHorizontal, Plus, Trash2, Utensils } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Menu, MenuItem, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    menus: (Menu & { items: MenuItem[] })[];
}

export default function MenusIndex({ wedding, menus }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Menus', href: `/weddings/${wedding.id}/menus` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'menu' | 'item'; id: number; name: string } | null>(null);

    const handleDelete = (type: 'menu' | 'item', id: number, name: string) => {
        setItemToDelete({ type, id, name });
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            const url = itemToDelete.type === 'menu' ? `/weddings/${wedding.id}/menus/${itemToDelete.id}` : `/weddings/${wedding.id}/menus/items/${itemToDelete.id}`;
            router.delete(url);
        }
        setShowDeleteDialog(false);
        setItemToDelete(null);
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: wedding.currency || 'USD', minimumFractionDigits: 0 }).format(amount);

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            appetizer: 'bg-yellow-100 text-yellow-800',
            soup: 'bg-orange-100 text-orange-800',
            salad: 'bg-green-100 text-green-800',
            main: 'bg-red-100 text-red-800',
            side: 'bg-blue-100 text-blue-800',
            dessert: 'bg-pink-100 text-pink-800',
            beverage: 'bg-purple-100 text-purple-800',
        };
        return colors[category?.toLowerCase()] || 'bg-neutral-100 text-neutral-800';
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Menus`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Menus"
                    description="Plan your wedding meal options"
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/menus/create`}><Plus className="mr-2 h-4 w-4" />Add Menu</Link></Button>
                            {menus.length > 0 && <Button asChild><Link href={`/weddings/${wedding.id}/menus/items/create`}><Plus className="mr-2 h-4 w-4" />Add Item</Link></Button>}
                        </div>
                    }
                />

                {menus.length === 0 ? (
                    <EmptyState
                        icon={Utensils}
                        title="No menus yet"
                        description="Create menus for your reception, rehearsal dinner, or other events."
                        action={<Button asChild><Link href={`/weddings/${wedding.id}/menus/create`}><Plus className="mr-2 h-4 w-4" />Add Menu</Link></Button>}
                    />
                ) : (
                    <Tabs defaultValue={menus[0]?.id.toString()}>
                        <TabsList>
                            {menus.map((menu) => (<TabsTrigger key={menu.id} value={menu.id.toString()}>{menu.name}</TabsTrigger>))}
                        </TabsList>

                        {menus.map((menu) => (
                            <TabsContent key={menu.id} value={menu.id.toString()} className="mt-6">
                                <Card className="mb-4 border-0 shadow-sm">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div>
                                            <h3 className="font-medium">{menu.name}</h3>
                                            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                                <Badge variant="secondary">{menu.type}</Badge>
                                                {menu.description && <span>• {menu.description}</span>}
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild><Link href={`/weddings/${wedding.id}/menus/${menu.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit Menu</Link></DropdownMenuItem>
                                                <DropdownMenuItem asChild><Link href={`/weddings/${wedding.id}/menus/items/create?menu=${menu.id}`}><Plus className="mr-2 h-4 w-4" />Add Item</Link></DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete('menu', menu.id, menu.name)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </CardContent>
                                </Card>

                                {menu.items.length === 0 ? (
                                    <Card className="border-0 shadow-sm">
                                        <CardContent className="py-12 text-center">
                                            <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-4 text-muted-foreground">No items in this menu yet.</p>
                                            <Button className="mt-4" asChild><Link href={`/weddings/${wedding.id}/menus/items/create?menu=${menu.id}`}><Plus className="mr-2 h-4 w-4" />Add Item</Link></Button>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Group items by category */}
                                        {Object.entries(
                                            menu.items.reduce((acc, item) => {
                                                const cat = item.category || 'Other';
                                                if (!acc[cat]) acc[cat] = [];
                                                acc[cat].push(item);
                                                return acc;
                                            }, {} as Record<string, MenuItem[]>)
                                        ).map(([category, items]) => (
                                            <Card key={category} className="border-0 shadow-sm">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                                                        <Badge className={getCategoryColor(category)}>{category}</Badge>
                                                        <span className="text-muted-foreground">({items.length})</span>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="divide-y">
                                                        {items.map((item) => (
                                                            <div key={item.id} className="flex items-start justify-between py-3">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-medium">{item.name}</p>
                                                                        {item.is_vegetarian && <Badge variant="outline" className="text-xs">V</Badge>}
                                                                        {item.is_vegan && <Badge variant="outline" className="text-xs">VG</Badge>}
                                                                        {item.is_gluten_free && <Badge variant="outline" className="text-xs">GF</Badge>}
                                                                    </div>
                                                                    {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                                                                    {item.allergens && item.allergens.length > 0 && (
                                                                        <p className="mt-1 text-xs text-muted-foreground">Allergens: {item.allergens.join(', ')}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {item.price && <span className="font-medium">{formatCurrency(item.price)}</span>}
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem asChild><Link href={`/weddings/${wedding.id}/menus/items/${item.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem onClick={() => handleDelete('item', item.id, item.name)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {itemToDelete?.type === 'menu' ? 'Menu' : 'Item'}</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{itemToDelete?.name}"? {itemToDelete?.type === 'menu' && 'This will also delete all items in this menu.'}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </WeddingLayout>
    );
}
