import { Head, Link, router } from '@inertiajs/react';
import { Check, DollarSign, Edit, ExternalLink, Gift, MoreHorizontal, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Gift as GiftType, GiftRegistry, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    registries: (GiftRegistry & { gifts: GiftType[] })[];
    stats: { total_gifts: number; purchased: number; total_value: number; purchased_value: number };
}

export default function GiftsIndex({ wedding, registries, stats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Gift Registry', href: `/weddings/${wedding.id}/gifts` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{ type: 'registry' | 'gift'; id: number; name: string } | null>(null);

    const handleDelete = (type: 'registry' | 'gift', id: number, name: string) => {
        setItemToDelete({ type, id, name });
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            const url = itemToDelete.type === 'registry' ? `/weddings/${wedding.id}/gifts/registries/${itemToDelete.id}` : `/weddings/${wedding.id}/gifts/${itemToDelete.id}`;
            router.delete(url);
        }
        setShowDeleteDialog(false);
        setItemToDelete(null);
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: wedding.currency || 'USD', minimumFractionDigits: 0 }).format(amount);

    const purchasedPercentage = stats.total_gifts > 0 ? Math.round((stats.purchased / stats.total_gifts) * 100) : 0;

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Gift Registry`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Gift Registry"
                    description="Manage your wedding gift registries"
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/gifts/registries/create`}><Plus className="mr-2 h-4 w-4" />Add Registry</Link></Button>
                            <Button asChild><Link href={`/weddings/${wedding.id}/gifts/create`}><Plus className="mr-2 h-4 w-4" />Add Gift</Link></Button>
                        </div>
                    }
                />

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-neutral-50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-black p-2"><Gift className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light">{stats.total_gifts}</p><p className="text-xs text-muted-foreground">Total Gifts</p></div></div></CardContent></Card>
                    <Card className="border-0 bg-green-50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-green-600 p-2"><Check className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light text-green-800">{stats.purchased}</p><p className="text-xs text-green-700">Purchased</p></div></div></CardContent></Card>
                    <Card className="border-0 bg-neutral-100"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-neutral-500 p-2"><DollarSign className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light">{formatCurrency(stats.total_value)}</p><p className="text-xs text-muted-foreground">Total Value</p></div></div></CardContent></Card>
                    <Card className="border-0 bg-neutral-50"><CardContent className="p-4"><div className="space-y-2"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Progress</p><p className="text-sm font-medium">{purchasedPercentage}%</p></div><Progress value={purchasedPercentage} className="h-2" /></div></CardContent></Card>
                </div>

                {registries.length === 0 ? (
                    <EmptyState
                        icon={Gift}
                        title="No gift registries yet"
                        description="Create a registry to start adding gifts."
                        action={<Button asChild><Link href={`/weddings/${wedding.id}/gifts/registries/create`}><Plus className="mr-2 h-4 w-4" />Add Registry</Link></Button>}
                    />
                ) : (
                    <Tabs defaultValue={registries[0]?.id.toString()}>
                        <TabsList>
                            {registries.map((registry) => (
                                <TabsTrigger key={registry.id} value={registry.id.toString()}>{registry.name}</TabsTrigger>
                            ))}
                        </TabsList>

                        {registries.map((registry) => (
                            <TabsContent key={registry.id} value={registry.id.toString()} className="mt-6">
                                <Card className="mb-4 border-0 shadow-sm">
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div>
                                            <h3 className="font-medium">{registry.name}</h3>
                                            {registry.store_name && <p className="text-sm text-muted-foreground">{registry.store_name}</p>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {registry.url && <Button variant="outline" size="sm" asChild><a href={registry.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1 h-3 w-3" />View</a></Button>}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild><Link href={`/weddings/${wedding.id}/gifts/registries/${registry.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete('registry', registry.id, registry.name)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>

                                {registry.gifts.length === 0 ? (
                                    <Card className="border-0 shadow-sm"><CardContent className="py-12 text-center"><ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" /><p className="mt-4 text-muted-foreground">No gifts in this registry yet.</p><Button className="mt-4" asChild><Link href={`/weddings/${wedding.id}/gifts/create?registry=${registry.id}`}><Plus className="mr-2 h-4 w-4" />Add Gift</Link></Button></CardContent></Card>
                                ) : (
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {registry.gifts.map((gift) => (
                                            <Card key={gift.id} className="border-0 shadow-sm">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h4 className="font-medium">{gift.name}</h4>
                                                            {gift.brand && <p className="text-sm text-muted-foreground">{gift.brand}</p>}
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem asChild><Link href={`/weddings/${wedding.id}/gifts/${gift.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleDelete('gift', gift.id, gift.name)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <p className="font-medium">{gift.price ? formatCurrency(gift.price) : '—'}</p>
                                                        {gift.is_purchased ? (
                                                            <Badge className="bg-green-100 text-green-800"><Check className="mr-1 h-3 w-3" />Purchased</Badge>
                                                        ) : (
                                                            <Badge variant="secondary">Available</Badge>
                                                        )}
                                                    </div>
                                                    {gift.purchased_by && <p className="mt-2 text-xs text-muted-foreground">By: {gift.purchased_by}</p>}
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
                        <DialogTitle>Delete {itemToDelete?.type === 'registry' ? 'Registry' : 'Gift'}</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{itemToDelete?.name}"? {itemToDelete?.type === 'registry' && 'This will also delete all gifts in this registry.'}</DialogDescription>
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
