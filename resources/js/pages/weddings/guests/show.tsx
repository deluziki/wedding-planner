import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowLeft,
    Calendar,
    Check,
    Clock,
    Edit,
    Mail,
    MapPin,
    Phone,
    Trash2,
    User,
    Users,
    Utensils,
    X,
} from 'lucide-react';
import { useState } from 'react';
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
import { Separator } from '@/components/ui/separator';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Guest, SeatingTable, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    guest: Guest & { table?: SeatingTable };
}

export default function GuestsShow({ wedding, guest }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Guests', href: `/weddings/${wedding.id}/guests` },
        { title: guest.full_name, href: `/weddings/${wedding.id}/guests/${guest.id}` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        router.delete(`/weddings/${wedding.id}/guests/${guest.id}`);
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

    const formatAddress = () => {
        const parts = [
            guest.address,
            guest.city,
            guest.state,
            guest.postal_code,
            guest.country,
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${guest.full_name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/weddings/${wedding.id}/guests`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-light tracking-tight">
                                    {guest.full_name}
                                </h1>
                                {getRsvpBadge(guest.rsvp_status)}
                                {guest.is_child && (
                                    <Badge variant="outline">
                                        Child {guest.age && `(${guest.age})`}
                                    </Badge>
                                )}
                            </div>
                            {guest.relationship && (
                                <p className="text-muted-foreground">
                                    {guest.relationship}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/weddings/${wedding.id}/guests/${guest.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Info */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Contact Information */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base font-medium">
                                    <User className="h-4 w-4" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {guest.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-neutral-100 p-2">
                                            <Mail className="h-4 w-4 text-neutral-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <a
                                                href={`mailto:${guest.email}`}
                                                className="hover:underline"
                                            >
                                                {guest.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {guest.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-neutral-100 p-2">
                                            <Phone className="h-4 w-4 text-neutral-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Phone
                                            </p>
                                            <a
                                                href={`tel:${guest.phone}`}
                                                className="hover:underline"
                                            >
                                                {guest.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {formatAddress() && (
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-full bg-neutral-100 p-2">
                                            <MapPin className="h-4 w-4 text-neutral-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Address
                                            </p>
                                            <p>{formatAddress()}</p>
                                        </div>
                                    </div>
                                )}
                                {!guest.email && !guest.phone && !formatAddress() && (
                                    <p className="text-muted-foreground">
                                        No contact information available
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* RSVP & Attendance */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base font-medium">
                                    <Calendar className="h-4 w-4" />
                                    RSVP & Attendance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            RSVP Status
                                        </p>
                                        <div className="mt-1">
                                            {getRsvpBadge(guest.rsvp_status)}
                                        </div>
                                        {guest.rsvp_responded_at && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Responded:{' '}
                                                {format(
                                                    new Date(guest.rsvp_responded_at),
                                                    'MMM d, yyyy'
                                                )}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Party Size
                                        </p>
                                        <p className="mt-1 text-lg font-medium">
                                            {1 + (guest.plus_one_count || 0)} guest
                                            {1 + (guest.plus_one_count || 0) !== 1
                                                ? 's'
                                                : ''}
                                        </p>
                                        {guest.plus_one_name && (
                                            <p className="text-sm text-muted-foreground">
                                                +1: {guest.plus_one_name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Ceremony
                                        </p>
                                        <p className="mt-1 flex items-center gap-1">
                                            {guest.attending_ceremony ? (
                                                <>
                                                    <Check className="h-4 w-4 text-green-600" />
                                                    <span>Attending</span>
                                                </>
                                            ) : (
                                                <>
                                                    <X className="h-4 w-4 text-red-600" />
                                                    <span>Not Attending</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Reception
                                        </p>
                                        <p className="mt-1 flex items-center gap-1">
                                            {guest.attending_reception ? (
                                                <>
                                                    <Check className="h-4 w-4 text-green-600" />
                                                    <span>Attending</span>
                                                </>
                                            ) : (
                                                <>
                                                    <X className="h-4 w-4 text-red-600" />
                                                    <span>Not Attending</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Meal & Dietary */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base font-medium">
                                    <Utensils className="h-4 w-4" />
                                    Meal & Dietary Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Meal Choice
                                        </p>
                                        <p className="mt-1">
                                            {guest.meal_choice || (
                                                <span className="text-muted-foreground">
                                                    Not selected
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Dietary Restrictions
                                        </p>
                                        <div className="mt-1">
                                            {guest.dietary_restrictions &&
                                            guest.dietary_restrictions.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {guest.dietary_restrictions.map(
                                                        (restriction) => (
                                                            <Badge
                                                                key={restriction}
                                                                variant="outline"
                                                            >
                                                                {restriction}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">
                                                    None
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {guest.special_requests && (
                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground">
                                            Special Requests
                                        </p>
                                        <p className="mt-1">{guest.special_requests}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {guest.notes && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">{guest.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Guest Details */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base font-medium">
                                    <Users className="h-4 w-4" />
                                    Guest Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Side
                                    </p>
                                    <p className="mt-1 capitalize">
                                        {guest.side ? (
                                            `${guest.side}'s Guest`
                                        ) : (
                                            <span className="text-muted-foreground">
                                                Not specified
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Group
                                    </p>
                                    <p className="mt-1">
                                        {guest.group ? (
                                            <Badge variant="outline">
                                                {guest.group}
                                            </Badge>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                No group
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Relationship
                                    </p>
                                    <p className="mt-1">
                                        {guest.relationship || (
                                            <span className="text-muted-foreground">
                                                Not specified
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seating */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">
                                    Seating Assignment
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {guest.table ? (
                                    <div className="space-y-2">
                                        <div className="rounded-lg bg-neutral-50 p-4 text-center">
                                            <p className="text-lg font-medium">
                                                {guest.table.name}
                                            </p>
                                            {guest.seat_number && (
                                                <p className="text-sm text-muted-foreground">
                                                    Seat #{guest.seat_number}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            asChild
                                        >
                                            <Link
                                                href={`/weddings/${wedding.id}/seating`}
                                            >
                                                View Seating Chart
                                            </Link>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-muted-foreground">
                                            No seat assigned
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="mt-2"
                                            asChild
                                        >
                                            <Link
                                                href={`/weddings/${wedding.id}/guests/${guest.id}/edit`}
                                            >
                                                Assign Seat
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Invitation Status */}
                        {guest.invitation && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">
                                        Invitation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Status
                                            </span>
                                            <Badge
                                                variant={
                                                    guest.invitation.status === 'sent'
                                                        ? 'default'
                                                        : 'secondary'
                                                }
                                            >
                                                {guest.invitation.status}
                                            </Badge>
                                        </div>
                                        {guest.invitation.sent_at && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">
                                                    Sent
                                                </span>
                                                <span className="text-sm">
                                                    {format(
                                                        new Date(
                                                            guest.invitation.sent_at
                                                        ),
                                                        'MMM d, yyyy'
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Quick Actions */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {guest.email && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a href={`mailto:${guest.email}`}>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Email
                                        </a>
                                    </Button>
                                )}
                                {guest.phone && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a href={`tel:${guest.phone}`}>
                                            <Phone className="mr-2 h-4 w-4" />
                                            Call
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <Link
                                        href={`/weddings/${wedding.id}/guests/${guest.id}/edit`}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Guest
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Guest</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {guest.full_name}? This
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
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </WeddingLayout>
    );
}
