import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Building2,
    Check,
    ChevronDown,
    Clock,
    DollarSign,
    ExternalLink,
    Filter,
    Mail,
    MoreHorizontal,
    Phone,
    Plus,
    Search,
    Star,
    Trash2,
    X,
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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Vendor, VendorCategory, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    vendors: Vendor[];
    categories: VendorCategory[];
    filters: {
        search?: string;
        category_id?: string;
        status?: string;
    };
    stats: {
        total: number;
        booked: number;
        pending: number;
        total_cost: number;
        total_paid: number;
    };
}

export default function VendorsIndex({
    wedding,
    vendors,
    categories,
    filters,
    stats,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Vendors', href: `/weddings/${wedding.id}/vendors` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        setSearchValue(value);
        router.get(
            `/weddings/${wedding.id}/vendors`,
            { ...filters, search: value || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string | undefined) => {
        router.get(
            `/weddings/${wedding.id}/vendors`,
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (vendor: Vendor) => {
        setVendorToDelete(vendor);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (vendorToDelete) {
            router.delete(
                `/weddings/${wedding.id}/vendors/${vendorToDelete.id}`
            );
        }
        setShowDeleteDialog(false);
        setVendorToDelete(null);
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

    const paymentProgress =
        stats.total_cost > 0
            ? Math.round((stats.total_paid / stats.total_cost) * 100)
            : 0;

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Vendors`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Vendors"
                    description="Manage your wedding vendors and services"
                    actions={
                        <Button asChild>
                            <Link href={`/weddings/${wedding.id}/vendors/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Vendor
                            </Link>
                        </Button>
                    }
                />

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-black p-2">
                                    <Building2 className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {stats.total}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Vendors
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-600 p-2">
                                    <Check className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-green-800">
                                        {stats.booked}
                                    </p>
                                    <p className="text-xs text-green-700">
                                        Booked
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-neutral-100">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-neutral-500 p-2">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {formatCurrency(stats.total_cost)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Cost
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        Payments
                                    </p>
                                    <p className="text-sm font-medium">
                                        {paymentProgress}%
                                    </p>
                                </div>
                                <Progress value={paymentProgress} className="h-2" />
                                <p className="text-xs text-muted-foreground">
                                    {formatCurrency(stats.total_paid)} of{' '}
                                    {formatCurrency(stats.total_cost)}
                                </p>
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
                                    placeholder="Search vendors..."
                                    value={searchValue}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.category_id || 'all'}
                                    onValueChange={(value) =>
                                        handleFilterChange('category_id', value)
                                    }
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Categories
                                        </SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category.id}
                                                value={category.id.toString()}
                                            >
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={(value) =>
                                        handleFilterChange('status', value)
                                    }
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="researching">
                                            Researching
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="booked">Booked</SelectItem>
                                        <SelectItem value="cancelled">
                                            Cancelled
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vendor List */}
                {vendors.length === 0 ? (
                    <EmptyState
                        icon={Building2}
                        title="No vendors yet"
                        description="Start adding vendors for your wedding services."
                        action={
                            <Button asChild>
                                <Link href={`/weddings/${wedding.id}/vendors/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Vendor
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {vendors.map((vendor) => (
                            <Card
                                key={vendor.id}
                                className="group border-0 shadow-sm transition-shadow hover:shadow-md"
                            >
                                <CardContent className="p-0">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={`/weddings/${wedding.id}/vendors/${vendor.id}`}
                                                        className="font-medium hover:underline"
                                                    >
                                                        {vendor.name}
                                                    </Link>
                                                    {vendor.is_favorite && (
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {vendor.category?.name ||
                                                        'Uncategorized'}
                                                </p>
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
                                                            href={`/weddings/${wedding.id}/vendors/${vendor.id}`}
                                                        >
                                                            View Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link
                                                            href={`/weddings/${wedding.id}/vendors/${vendor.id}/edit`}
                                                        >
                                                            Edit
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            handleDelete(vendor)
                                                        }
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <div className="mt-3">
                                            {getStatusBadge(vendor.status)}
                                        </div>

                                        {/* Contact Info */}
                                        <div className="mt-4 space-y-1">
                                            {vendor.contact_name && (
                                                <p className="text-sm">
                                                    {vendor.contact_name}
                                                </p>
                                            )}
                                            {vendor.email && (
                                                <a
                                                    href={`mailto:${vendor.email}`}
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <Mail className="h-3 w-3" />
                                                    {vendor.email}
                                                </a>
                                            )}
                                            {vendor.phone && (
                                                <a
                                                    href={`tel:${vendor.phone}`}
                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    <Phone className="h-3 w-3" />
                                                    {vendor.phone}
                                                </a>
                                            )}
                                        </div>

                                        {/* Pricing */}
                                        {vendor.price && (
                                            <div className="mt-4 rounded-lg bg-neutral-50 p-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">
                                                        Price
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatCurrency(vendor.price)}
                                                    </span>
                                                </div>
                                                {vendor.deposit_amount && (
                                                    <div className="mt-1 flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">
                                                            Deposit
                                                        </span>
                                                        <span className="text-sm">
                                                            {formatCurrency(
                                                                vendor.deposit_amount
                                                            )}
                                                            {vendor.deposit_paid && (
                                                                <Check className="ml-1 inline h-3 w-3 text-green-600" />
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Website */}
                                        {vendor.website && (
                                            <a
                                                href={vendor.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                Visit Website
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Vendor</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {vendorToDelete?.name}?
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
