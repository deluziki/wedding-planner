import { Head, Link, router } from '@inertiajs/react';
import {
    Circle,
    Edit,
    MoreHorizontal,
    Plus,
    Square,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Progress } from '@/components/ui/progress';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Guest, SeatingTable, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    tables: (SeatingTable & { guests: Guest[] })[];
    unassignedGuests: Guest[];
    stats: {
        total_tables: number;
        total_capacity: number;
        total_seated: number;
        unassigned: number;
    };
}

export default function SeatingIndex({
    wedding,
    tables,
    unassignedGuests,
    stats,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Seating', href: `/weddings/${wedding.id}/seating` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [tableToDelete, setTableToDelete] = useState<SeatingTable | null>(null);

    const handleDelete = (table: SeatingTable) => {
        setTableToDelete(table);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (tableToDelete) {
            router.delete(`/weddings/${wedding.id}/seating/${tableToDelete.id}`);
        }
        setShowDeleteDialog(false);
        setTableToDelete(null);
    };

    const getTableShape = (shape: string) => {
        switch (shape) {
            case 'round':
                return <Circle className="h-4 w-4" />;
            case 'square':
                return <Square className="h-4 w-4" />;
            case 'rectangular':
                return (
                    <div className="h-3 w-5 rounded-sm border-2 border-current" />
                );
            default:
                return <Circle className="h-4 w-4" />;
        }
    };

    const seatedPercentage =
        stats.total_capacity > 0
            ? Math.round((stats.total_seated / stats.total_capacity) * 100)
            : 0;

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Seating`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Seating Chart"
                    description="Organize table assignments for your guests"
                    actions={
                        <Button asChild>
                            <Link href={`/weddings/${wedding.id}/seating/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Table
                            </Link>
                        </Button>
                    }
                />

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-black p-2">
                                    <Square className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {stats.total_tables}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Tables
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-neutral-100">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-neutral-500 p-2">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {stats.total_capacity}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Capacity
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-600 p-2">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-green-800">
                                        {stats.total_seated}
                                    </p>
                                    <p className="text-xs text-green-700">Seated</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-yellow-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-yellow-500 p-2">
                                    <Users className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-yellow-800">
                                        {stats.unassigned}
                                    </p>
                                    <p className="text-xs text-yellow-700">
                                        Unassigned
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Seating Progress
                            </span>
                            <span className="text-sm font-medium">
                                {seatedPercentage}%
                            </span>
                        </div>
                        <Progress value={seatedPercentage} className="mt-2 h-2" />
                        <p className="mt-2 text-xs text-muted-foreground">
                            {stats.total_seated} of {stats.total_capacity} seats filled
                        </p>
                    </CardContent>
                </Card>

                {tables.length === 0 ? (
                    <EmptyState
                        icon={Square}
                        title="No tables yet"
                        description="Create tables to start assigning guests."
                        action={
                            <Button asChild>
                                <Link href={`/weddings/${wedding.id}/seating/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Table
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Tables */}
                        <div className="space-y-4 lg:col-span-2">
                            <h2 className="text-lg font-medium">Tables</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {tables.map((table) => {
                                    const occupancy = table.guests?.length || 0;
                                    const isFull = occupancy >= table.capacity;

                                    return (
                                        <Card
                                            key={table.id}
                                            className="border-0 shadow-sm"
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {getTableShape(
                                                            table.shape || 'round'
                                                        )}
                                                        <CardTitle className="text-base font-medium">
                                                            {table.name}
                                                        </CardTitle>
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
                                                                    href={`/weddings/${wedding.id}/seating/${table.id}/edit`}
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDelete(table)
                                                                }
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="mb-3 flex items-center justify-between">
                                                    <Badge
                                                        variant={
                                                            isFull
                                                                ? 'default'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {occupancy}/{table.capacity}{' '}
                                                        seats
                                                    </Badge>
                                                    {table.table_number && (
                                                        <span className="text-sm text-muted-foreground">
                                                            #{table.table_number}
                                                        </span>
                                                    )}
                                                </div>

                                                {table.guests &&
                                                table.guests.length > 0 ? (
                                                    <div className="space-y-1">
                                                        {table.guests.map((guest) => (
                                                            <div
                                                                key={guest.id}
                                                                className="flex items-center justify-between rounded bg-neutral-50 px-2 py-1 text-sm"
                                                            >
                                                                <span>
                                                                    {guest.full_name}
                                                                </span>
                                                                {guest.seat_number && (
                                                                    <span className="text-xs text-muted-foreground">
                                                                        Seat{' '}
                                                                        {
                                                                            guest.seat_number
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        No guests assigned
                                                    </p>
                                                )}

                                                {!isFull && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-3 w-full"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/weddings/${wedding.id}/seating/${table.id}/assign`}
                                                        >
                                                            <Plus className="mr-2 h-3 w-3" />
                                                            Assign Guests
                                                        </Link>
                                                    </Button>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Unassigned Guests */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-medium">
                                Unassigned Guests ({unassignedGuests.length})
                            </h2>
                            <Card className="border-0 shadow-sm">
                                <CardContent className="p-4">
                                    {unassignedGuests.length === 0 ? (
                                        <p className="text-center text-sm text-muted-foreground">
                                            All confirmed guests have been assigned
                                            seats.
                                        </p>
                                    ) : (
                                        <div className="max-h-96 space-y-2 overflow-y-auto">
                                            {unassignedGuests.map((guest) => (
                                                <div
                                                    key={guest.id}
                                                    className="flex items-center justify-between rounded bg-neutral-50 px-3 py-2"
                                                >
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {guest.full_name}
                                                        </p>
                                                        {guest.group && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {guest.group}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/weddings/${wedding.id}/guests/${guest.id}/edit`}
                                                        >
                                                            Assign
                                                        </Link>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Table</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{tableToDelete?.name}"?
                            Guests assigned to this table will become unassigned. This
                            action cannot be undone.
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
