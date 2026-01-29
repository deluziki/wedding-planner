import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Bed, Calendar, DollarSign, Edit, ExternalLink, MapPin, MoreHorizontal, Phone, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import WeddingLayout from '@/layouts/wedding-layout';
import type { Accommodation, BreadcrumbItem, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    accommodations: Accommodation[];
    stats: { total_rooms: number; booked_rooms: number; total_guests: number };
}

export default function AccommodationsIndex({ wedding, accommodations, stats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Accommodations', href: `/weddings/${wedding.id}/accommodations` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [accommodationToDelete, setAccommodationToDelete] = useState<Accommodation | null>(null);

    const handleDelete = (accommodation: Accommodation) => {
        setAccommodationToDelete(accommodation);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (accommodationToDelete) {
            router.delete(`/weddings/${wedding.id}/accommodations/${accommodationToDelete.id}`);
        }
        setShowDeleteDialog(false);
        setAccommodationToDelete(null);
    };

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: wedding.currency || 'USD', minimumFractionDigits: 0 }).format(amount);

    const bookedPercentage = stats.total_rooms > 0 ? Math.round((stats.booked_rooms / stats.total_rooms) * 100) : 0;

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Accommodations`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Accommodations"
                    description="Manage hotel blocks and guest accommodations"
                    actions={<Button asChild><Link href={`/weddings/${wedding.id}/accommodations/create`}><Plus className="mr-2 h-4 w-4" />Add Accommodation</Link></Button>}
                />

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="border-0 bg-neutral-50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-black p-2"><Bed className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light">{stats.total_rooms}</p><p className="text-xs text-muted-foreground">Total Rooms</p></div></div></CardContent></Card>
                    <Card className="border-0 bg-green-50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-green-600 p-2"><Users className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light text-green-800">{stats.booked_rooms}</p><p className="text-xs text-green-700">Booked</p></div></div></CardContent></Card>
                    <Card className="border-0 bg-neutral-50"><CardContent className="p-4"><div className="space-y-2"><div className="flex items-center justify-between"><p className="text-sm text-muted-foreground">Booking Progress</p><p className="text-sm font-medium">{bookedPercentage}%</p></div><Progress value={bookedPercentage} className="h-2" /></div></CardContent></Card>
                </div>

                {accommodations.length === 0 ? (
                    <EmptyState
                        icon={Bed}
                        title="No accommodations yet"
                        description="Add hotels or other accommodations for your guests."
                        action={<Button asChild><Link href={`/weddings/${wedding.id}/accommodations/create`}><Plus className="mr-2 h-4 w-4" />Add Accommodation</Link></Button>}
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {accommodations.map((accommodation) => (
                            <Card key={accommodation.id} className="border-0 shadow-sm">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-base font-medium">{accommodation.name}</CardTitle>
                                            {accommodation.type && <Badge variant="secondary" className="mt-1">{accommodation.type}</Badge>}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild><Link href={`/weddings/${wedding.id}/accommodations/${accommodation.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDelete(accommodation)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {accommodation.address && (
                                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                            <span>{[accommodation.address, accommodation.city].filter(Boolean).join(', ')}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        {accommodation.room_block_size && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Bed className="h-4 w-4" />
                                                <span>{accommodation.room_block_size} rooms</span>
                                            </div>
                                        )}
                                        {accommodation.rate_per_night && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <DollarSign className="h-4 w-4" />
                                                <span>{formatCurrency(accommodation.rate_per_night)}/night</span>
                                            </div>
                                        )}
                                        {accommodation.block_deadline && (
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>Deadline: {format(new Date(accommodation.block_deadline), 'MMM d')}</span>
                                            </div>
                                        )}
                                    </div>
                                    {accommodation.booking_code && (
                                        <div className="rounded bg-neutral-100 px-3 py-2 text-sm">
                                            <span className="text-muted-foreground">Booking Code: </span>
                                            <span className="font-mono font-medium">{accommodation.booking_code}</span>
                                        </div>
                                    )}
                                    <div className="flex gap-2 pt-2">
                                        {accommodation.phone && <Button variant="outline" size="sm" asChild><a href={`tel:${accommodation.phone}`}><Phone className="mr-1 h-3 w-3" />Call</a></Button>}
                                        {accommodation.website && <Button variant="outline" size="sm" asChild><a href={accommodation.website} target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-1 h-3 w-3" />Website</a></Button>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Accommodation</DialogTitle>
                        <DialogDescription>Are you sure you want to delete "{accommodationToDelete?.name}"?</DialogDescription>
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
