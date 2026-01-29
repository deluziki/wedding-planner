import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowLeft,
    Building2,
    Calendar,
    Check,
    Clock,
    DollarSign,
    Edit,
    ExternalLink,
    FileText,
    Mail,
    MapPin,
    Phone,
    Star,
    Trash2,
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
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Vendor, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    vendor: Vendor;
}

export default function VendorsShow({ wedding, vendor }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Vendors', href: `/weddings/${wedding.id}/vendors` },
        { title: vendor.name, href: `/weddings/${wedding.id}/vendors/${vendor.id}` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const handleDelete = () => {
        router.delete(`/weddings/${wedding.id}/vendors/${vendor.id}`);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'booked':
                return (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="mr-1 h-3 w-3" />
                        Booked
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        <X className="mr-1 h-3 w-3" />
                        Cancelled
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        Researching
                    </Badge>
                );
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: wedding.currency || 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatAddress = () => {
        const parts = [
            vendor.address,
            vendor.city,
            vendor.state,
            vendor.postal_code,
            vendor.country,
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    };

    const paidAmount =
        (vendor.deposit_paid ? vendor.deposit_amount || 0 : 0) +
        (vendor.final_payment_paid
            ? (vendor.price || 0) - (vendor.deposit_amount || 0)
            : 0);
    const paymentProgress =
        vendor.price && vendor.price > 0
            ? Math.round((paidAmount / vendor.price) * 100)
            : 0;

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${vendor.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`/weddings/${wedding.id}/vendors`}>
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-light tracking-tight">
                                    {vendor.name}
                                </h1>
                                {vendor.is_favorite && (
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                )}
                                {getStatusBadge(vendor.status)}
                            </div>
                            <p className="text-muted-foreground">
                                {vendor.category?.name || 'Uncategorized'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link
                                href={`/weddings/${wedding.id}/vendors/${vendor.id}/edit`}
                            >
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
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Contact Information */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base font-medium">
                                    <Building2 className="h-4 w-4" />
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {vendor.contact_name && (
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-neutral-100 p-2">
                                            <Building2 className="h-4 w-4 text-neutral-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Contact Person
                                            </p>
                                            <p>{vendor.contact_name}</p>
                                        </div>
                                    </div>
                                )}
                                {vendor.email && (
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-neutral-100 p-2">
                                            <Mail className="h-4 w-4 text-neutral-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Email
                                            </p>
                                            <a
                                                href={`mailto:${vendor.email}`}
                                                className="hover:underline"
                                            >
                                                {vendor.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {vendor.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-neutral-100 p-2">
                                            <Phone className="h-4 w-4 text-neutral-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Phone
                                            </p>
                                            <a
                                                href={`tel:${vendor.phone}`}
                                                className="hover:underline"
                                            >
                                                {vendor.phone}
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
                                {vendor.website && (
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-neutral-100 p-2">
                                            <ExternalLink className="h-4 w-4 text-neutral-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Website
                                            </p>
                                            <a
                                                href={vendor.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                {vendor.website}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pricing & Payments */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base font-medium">
                                    <DollarSign className="h-4 w-4" />
                                    Pricing & Payments
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Payment Progress */}
                                {vendor.price && vendor.price > 0 && (
                                    <div className="rounded-lg bg-neutral-50 p-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Payment Progress
                                            </span>
                                            <span className="font-medium">
                                                {paymentProgress}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={paymentProgress}
                                            className="mt-2 h-2"
                                        />
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            {formatCurrency(paidAmount)} of{' '}
                                            {formatCurrency(vendor.price)} paid
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Total Price
                                        </p>
                                        <p className="mt-1 text-2xl font-light">
                                            {vendor.price
                                                ? formatCurrency(vendor.price)
                                                : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Contract
                                        </p>
                                        <p className="mt-1 flex items-center gap-1">
                                            {vendor.contract_signed ? (
                                                <>
                                                    <Check className="h-4 w-4 text-green-600" />
                                                    <span>Signed</span>
                                                </>
                                            ) : (
                                                <>
                                                    <X className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        Not signed
                                                    </span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Deposit */}
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Deposit Amount
                                        </p>
                                        <p className="mt-1 font-medium">
                                            {vendor.deposit_amount
                                                ? formatCurrency(
                                                      vendor.deposit_amount
                                                  )
                                                : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Deposit Due
                                        </p>
                                        <p className="mt-1">
                                            {vendor.deposit_due_date
                                                ? format(
                                                      new Date(
                                                          vendor.deposit_due_date
                                                      ),
                                                      'MMM d, yyyy'
                                                  )
                                                : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Status
                                        </p>
                                        <p className="mt-1 flex items-center gap-1">
                                            {vendor.deposit_paid ? (
                                                <Badge className="bg-green-100 text-green-800">
                                                    <Check className="mr-1 h-3 w-3" />
                                                    Paid
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Unpaid
                                                </Badge>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <Separator />

                                {/* Final Payment */}
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Final Payment
                                        </p>
                                        <p className="mt-1 font-medium">
                                            {vendor.price && vendor.deposit_amount
                                                ? formatCurrency(
                                                      vendor.price -
                                                          vendor.deposit_amount
                                                  )
                                                : vendor.price
                                                  ? formatCurrency(vendor.price)
                                                  : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Due Date
                                        </p>
                                        <p className="mt-1">
                                            {vendor.final_payment_due_date
                                                ? format(
                                                      new Date(
                                                          vendor.final_payment_due_date
                                                      ),
                                                      'MMM d, yyyy'
                                                  )
                                                : '—'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            Status
                                        </p>
                                        <p className="mt-1 flex items-center gap-1">
                                            {vendor.final_payment_paid ? (
                                                <Badge className="bg-green-100 text-green-800">
                                                    <Check className="mr-1 h-3 w-3" />
                                                    Paid
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">
                                                    Unpaid
                                                </Badge>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {vendor.notes && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap">
                                        {vendor.notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status Card */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">
                                    Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Booking Status
                                    </p>
                                    <div className="mt-1">
                                        {getStatusBadge(vendor.status)}
                                    </div>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Category
                                    </p>
                                    <p className="mt-1">
                                        {vendor.category?.name || 'Uncategorized'}
                                    </p>
                                </div>
                                {vendor.rating && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Rating
                                            </p>
                                            <div className="mt-1 flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Star
                                                        key={star}
                                                        className={`h-4 w-4 ${
                                                            star <= vendor.rating!
                                                                ? 'fill-yellow-400 text-yellow-400'
                                                                : 'text-neutral-300'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">
                                    Quick Actions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {vendor.email && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a href={`mailto:${vendor.email}`}>
                                            <Mail className="mr-2 h-4 w-4" />
                                            Send Email
                                        </a>
                                    </Button>
                                )}
                                {vendor.phone && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a href={`tel:${vendor.phone}`}>
                                            <Phone className="mr-2 h-4 w-4" />
                                            Call
                                        </a>
                                    </Button>
                                )}
                                {vendor.website && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        asChild
                                    >
                                        <a
                                            href={vendor.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Visit Website
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    asChild
                                >
                                    <Link
                                        href={`/weddings/${wedding.id}/vendors/${vendor.id}/edit`}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Vendor
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Payment Reminders */}
                        {(vendor.deposit_due_date || vendor.final_payment_due_date) && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-base font-medium">
                                        <Calendar className="h-4 w-4" />
                                        Payment Dates
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {vendor.deposit_due_date && (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Deposit
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            vendor.deposit_due_date
                                                        ),
                                                        'MMM d, yyyy'
                                                    )}
                                                </p>
                                            </div>
                                            {vendor.deposit_paid ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-yellow-600" />
                                            )}
                                        </div>
                                    )}
                                    {vendor.final_payment_due_date && (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Final Payment
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            vendor.final_payment_due_date
                                                        ),
                                                        'MMM d, yyyy'
                                                    )}
                                                </p>
                                            </div>
                                            {vendor.final_payment_paid ? (
                                                <Check className="h-4 w-4 text-green-600" />
                                            ) : (
                                                <Clock className="h-4 w-4 text-yellow-600" />
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Vendor</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {vendor.name}? This
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
