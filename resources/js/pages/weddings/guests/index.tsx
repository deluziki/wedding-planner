import { Head, Link, router, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Check,
    ChevronDown,
    Clock,
    Download,
    Filter,
    Mail,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Trash2,
    Upload,
    UserCheck,
    UserMinus,
    UserPlus,
    Users,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Guest, PaginatedData, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    guests: PaginatedData<Guest>;
    filters: {
        search?: string;
        rsvp_status?: string;
        side?: string;
        group?: string;
    };
    stats: {
        total: number;
        confirmed: number;
        pending: number;
        declined: number;
        maybe: number;
    };
    groups: string[];
}

export default function GuestsIndex({
    wedding,
    guests,
    filters,
    stats,
    groups,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Guests', href: `/weddings/${wedding.id}/guests` },
    ];

    const [selectedGuests, setSelectedGuests] = useState<number[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [guestToDelete, setGuestToDelete] = useState<Guest | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        setSearchValue(value);
        router.get(
            `/weddings/${wedding.id}/guests`,
            { ...filters, search: value || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string | undefined) => {
        router.get(
            `/weddings/${wedding.id}/guests`,
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (guest: Guest) => {
        setGuestToDelete(guest);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (guestToDelete) {
            router.delete(
                `/weddings/${wedding.id}/guests/${guestToDelete.id}`
            );
        }
        setShowDeleteDialog(false);
        setGuestToDelete(null);
    };

    const handleBulkDelete = () => {
        if (selectedGuests.length > 0) {
            router.delete(`/weddings/${wedding.id}/guests/bulk-delete`, {
                data: { ids: selectedGuests },
            });
            setSelectedGuests([]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedGuests.length === guests.data.length) {
            setSelectedGuests([]);
        } else {
            setSelectedGuests(guests.data.map((g) => g.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedGuests((prev) =>
            prev.includes(id)
                ? prev.filter((gId) => gId !== id)
                : [...prev, id]
        );
    };

    const getRsvpBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" />
                        Confirmed
                    </Badge>
                );
            case 'declined':
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <X className="mr-1 h-3 w-3" />
                        Declined
                    </Badge>
                );
            case 'maybe':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="mr-1 h-3 w-3" />
                        Maybe
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Guests`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Guest List"
                    description="Manage your wedding guests and RSVPs"
                    actions={
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        <Download className="mr-2 h-4 w-4" />
                                        Export
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <a
                                            href={`/weddings/${wedding.id}/guests/export?format=csv`}
                                        >
                                            Export as CSV
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <a
                                            href={`/weddings/${wedding.id}/guests/export?format=xlsx`}
                                        >
                                            Export as Excel
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="outline" asChild>
                                <Link href={`/weddings/${wedding.id}/guests/import`}>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Import
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/weddings/${wedding.id}/guests/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Guest
                                </Link>
                            </Button>
                        </div>
                    }
                />

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-black p-2">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {stats.total}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Guests
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-600 p-2">
                                    <UserCheck className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-green-800">
                                        {stats.confirmed}
                                    </p>
                                    <p className="text-xs text-green-700">
                                        Confirmed
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-neutral-100">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-neutral-500 p-2">
                                    <Clock className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {stats.pending}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Pending
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-yellow-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-yellow-500 p-2">
                                    <UserPlus className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-yellow-800">
                                        {stats.maybe}
                                    </p>
                                    <p className="text-xs text-yellow-700">
                                        Maybe
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-red-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-red-500 p-2">
                                    <UserMinus className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-red-800">
                                        {stats.declined}
                                    </p>
                                    <p className="text-xs text-red-700">
                                        Declined
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search guests..."
                                    value={searchValue}
                                    onChange={(e) =>
                                        handleSearch(e.target.value)
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.rsvp_status || 'all'}
                                    onValueChange={(value) =>
                                        handleFilterChange('rsvp_status', value)
                                    }
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="RSVP Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All RSVP</SelectItem>
                                        <SelectItem value="confirmed">
                                            Confirmed
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="declined">
                                            Declined
                                        </SelectItem>
                                        <SelectItem value="maybe">Maybe</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.side || 'all'}
                                    onValueChange={(value) =>
                                        handleFilterChange('side', value)
                                    }
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Side" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sides</SelectItem>
                                        <SelectItem value="bride">Bride</SelectItem>
                                        <SelectItem value="groom">Groom</SelectItem>
                                        <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                </Select>
                                {groups.length > 0 && (
                                    <Select
                                        value={filters.group || 'all'}
                                        onValueChange={(value) =>
                                            handleFilterChange('group', value)
                                        }
                                    >
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Groups
                                            </SelectItem>
                                            {groups.map((group) => (
                                                <SelectItem
                                                    key={group}
                                                    value={group}
                                                >
                                                    {group}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedGuests.length > 0 && (
                    <div className="flex items-center gap-4 rounded-lg bg-neutral-100 p-4">
                        <span className="text-sm font-medium">
                            {selectedGuests.length} guest
                            {selectedGuests.length !== 1 ? 's' : ''} selected
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBulkDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Selected
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedGuests([])}
                        >
                            Clear Selection
                        </Button>
                    </div>
                )}

                {/* Guest List */}
                {guests.data.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No guests yet"
                        description="Start building your guest list by adding your first guest."
                        action={
                            <Button asChild>
                                <Link
                                    href={`/weddings/${wedding.id}/guests/create`}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Guest
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <Card className="border-0 shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={
                                                selectedGuests.length ===
                                                guests.data.length
                                            }
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Group</TableHead>
                                    <TableHead>Side</TableHead>
                                    <TableHead>RSVP</TableHead>
                                    <TableHead>Party Size</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {guests.data.map((guest) => (
                                    <TableRow key={guest.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedGuests.includes(
                                                    guest.id
                                                )}
                                                onCheckedChange={() =>
                                                    toggleSelect(guest.id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Link
                                                href={`/weddings/${wedding.id}/guests/${guest.id}`}
                                                className="block"
                                            >
                                                <p className="font-medium hover:underline">
                                                    {guest.full_name}
                                                </p>
                                                {guest.relationship && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {guest.relationship}
                                                    </p>
                                                )}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {guest.email && (
                                                    <a
                                                        href={`mailto:${guest.email}`}
                                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Mail className="h-3 w-3" />
                                                        {guest.email}
                                                    </a>
                                                )}
                                                {guest.phone && (
                                                    <a
                                                        href={`tel:${guest.phone}`}
                                                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Phone className="h-3 w-3" />
                                                        {guest.phone}
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {guest.group ? (
                                                <Badge variant="outline">
                                                    {guest.group}
                                                </Badge>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {guest.side ? (
                                                <span className="capitalize">
                                                    {guest.side}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getRsvpBadge(guest.rsvp_status)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="tabular-nums">
                                                {1 + (guest.plus_one_count || 0)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
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
                                                            href={`/weddings/${wedding.id}/guests/${guest.id}`}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/weddings/${wedding.id}/guests/${guest.id}/edit`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(guest)
                                                        }
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}

                {/* Pagination */}
                {guests.meta.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Showing {guests.meta.from} to {guests.meta.to} of{' '}
                            {guests.meta.total} guests
                        </p>
                        <div className="flex gap-2">
                            {guests.links.prev && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={guests.links.prev}>Previous</Link>
                                </Button>
                            )}
                            {guests.links.next && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={guests.links.next}>Next</Link>
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Guest</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {guestToDelete?.full_name}?
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
