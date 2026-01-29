import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, BudgetCategory, BudgetItem, Vendor, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    item?: BudgetItem;
    categories: BudgetCategory[];
    vendors: Vendor[];
    defaultCategoryId?: number;
}

export default function BudgetItemForm({
    wedding,
    item,
    categories,
    vendors,
    defaultCategoryId,
}: Props) {
    const isEditing = !!item;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Budget', href: `/weddings/${wedding.id}/budget` },
        {
            title: isEditing ? 'Edit Item' : 'Add Expense',
            href: isEditing
                ? `/weddings/${wedding.id}/budget/items/${item.id}/edit`
                : `/weddings/${wedding.id}/budget/items/create`,
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        category_id: item?.category_id?.toString() || defaultCategoryId?.toString() || '',
        vendor_id: item?.vendor_id?.toString() || '',
        name: item?.name || '',
        description: item?.description || '',
        estimated_cost: item?.estimated_cost?.toString() || '',
        actual_cost: item?.actual_cost?.toString() || '',
        paid_amount: item?.paid_amount?.toString() || '',
        is_paid: item?.is_paid || false,
        payment_date: item?.payment_date || '',
        due_date: item?.due_date || '',
        notes: item?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/budget/items/${item.id}`);
        } else {
            post(`/weddings/${wedding.id}/budget/items`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head
                title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Budget Item`}
            />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/weddings/${wedding.id}/budget`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <PageHeader
                        title={isEditing ? `Edit ${item.name}` : 'Add Expense'}
                        description={
                            isEditing
                                ? 'Update expense details'
                                : 'Add a new expense to your budget'
                        }
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Expense Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Expense Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Venue Rental, Photography"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category_id">Category *</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData('category_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    {errors.category_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vendor_id">Vendor (Optional)</Label>
                                <Select
                                    value={data.vendor_id}
                                    onValueChange={(value) =>
                                        setData('vendor_id', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select vendor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">No vendor</SelectItem>
                                        {vendors.map((vendor) => (
                                            <SelectItem
                                                key={vendor.id}
                                                value={vendor.id.toString()}
                                            >
                                                {vendor.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Optional description"
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Costs */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Costs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="estimated_cost">
                                        Estimated Cost
                                    </Label>
                                    <Input
                                        id="estimated_cost"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.estimated_cost}
                                        onChange={(e) =>
                                            setData('estimated_cost', e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="actual_cost">Actual Cost</Label>
                                    <Input
                                        id="actual_cost"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.actual_cost}
                                        onChange={(e) =>
                                            setData('actual_cost', e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paid_amount">Amount Paid</Label>
                                    <Input
                                        id="paid_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.paid_amount}
                                        onChange={(e) =>
                                            setData('paid_amount', e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData('due_date', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="payment_date">Payment Date</Label>
                                    <Input
                                        id="payment_date"
                                        type="date"
                                        value={data.payment_date}
                                        onChange={(e) =>
                                            setData('payment_date', e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_paid"
                                    checked={data.is_paid}
                                    onCheckedChange={(checked) =>
                                        setData('is_paid', !!checked)
                                    }
                                />
                                <Label htmlFor="is_paid" className="font-normal">
                                    Mark as fully paid
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Any additional notes..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/weddings/${wedding.id}/budget`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? isEditing
                                    ? 'Saving...'
                                    : 'Creating...'
                                : isEditing
                                  ? 'Save Changes'
                                  : 'Add Expense'}
                        </Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
