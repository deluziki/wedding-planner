import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Building,
    Calendar,
    Check,
    DollarSign,
    Edit,
    ExternalLink,
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
    Plus,
    Star,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Venue, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    venues: Venue[];
}

export default function VenuesIndex({ wedding, venues }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Venues', href: `/weddings/${wedding.id}/venues` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [venueToDelete, setVenueToDelete] = useState<Venue | null>(null);

    const handleDelete = (venue: Venue) => {
        setVenueToDelete(venue);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (venueToDelete) {
            router.delete(`/weddings/${wedding.id}/venues/${venueToDelete.id}`);
        }
        setShowDeleteDialog(false);
        setVenueToDelete(null);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: wedding.currency || 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getTypeBadge = (type: string) => {
        const colors: Record<string, string> = {
            ceremony: 'bg-purple-100 text-purple-800',
            reception: 'bg-blue-100 text-blue-800',
            both: 'bg-green-100 text-green-800',
            rehearsal: 'bg-yellow-100 text-yellow-800',
        };
        return colors[type] || 'bg-neutral-100 text-neutral-800';
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Venues`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Venues"
                    description="Manage your wedding venues"
                    actions={
                        <Button asChild>
                            <Link href={`/weddings/${wedding.id}/venues/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Venue
                            </Link>
                        </Button>
                    }
                />

                {venues.length === 0 ? (
                    <EmptyState
                        icon={Building}
                        title="No venues yet"
                        description="Add venues for your ceremony, reception, or other events."
                        action={
                            <Button asChild>
                                <Link href={`/weddings/${wedding.id}/venues/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Venue
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {venues.map((venue) => (
                            <Card key={venue.id} className="border-0 shadow-sm">
                                <CardContent className="p-0">
                                    {venue.cover_image && (
                                        <div className="relative h-40 overflow-hidden rounded-t-lg">
                                            <img
                                                src={venue.cover_image}
                                                alt={venue.name}
                                                className="h-full w-full object-cover"
                                            />
                                            {venue.is_booked && (
                                                <Badge className="absolute right-2 top-2 bg-green-600">
                                                    <Check className="mr-1 h-3 w-3" />
                                                    Booked
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium">
                                                        {venue.name}
                                                    </h3>
                                                    {venue.is_primary && (
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    )}
                                                </div>
                                                <Badge
                                                    className={`mt-1 ${getTypeBadge(
                                                        venue.type
                                                    )}`}
                                                >
                                                    {venue.type}
                                                </Badge>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/weddings/${wedding.id}/venues/${venue.id}/edit`}
                                                        >
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(venue)
                                                        }
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="mt-4 space-y-2 text-sm">
                                            {venue.address && (
                                                <div className="flex items-start gap-2 text-muted-foreground">
                                                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                                    <span>
                                                        {[
                                                            venue.address,
                                                            venue.city,
                                                            venue.state,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(', ')}
                                                    </span>
                                                </div>
                                            )}
                                            {venue.capacity && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    <span>
                                                        Capacity: {venue.capacity}
                                                    </span>
                                                </div>
                                            )}
                                            {venue.cost && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <DollarSign className="h-4 w-4" />
                                                    <span>
                                                        {formatCurrency(venue.cost)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex gap-2">
                                            {venue.phone && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a href={`tel:${venue.phone}`}>
                                                        <Phone className="mr-1 h-3 w-3" />
                                                        Call
                                                    </a>
                                                </Button>
                                            )}
                                            {venue.website && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={venue.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <ExternalLink className="mr-1 h-3 w-3" />
                                                        Website
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
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
                        <DialogTitle>Delete Venue</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{venueToDelete?.name}"?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </WeddingLayout>
    );
}
