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
import type { BreadcrumbItem, VendorCategory, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    categories: VendorCategory[];
}

export default function VendorsCreate({ wedding, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Vendors', href: `/weddings/${wedding.id}/vendors` },
        { title: 'Add Vendor', href: `/weddings/${wedding.id}/vendors/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        category_id: '' as string | number,
        name: '',
        contact_name: '',
        email: '',
        phone: '',
        website: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        status: 'researching' as 'researching' | 'pending' | 'booked' | 'cancelled',
        price: '' as string | number,
        deposit_amount: '' as string | number,
        deposit_due_date: '',
        deposit_paid: false,
        final_payment_due_date: '',
        final_payment_paid: false,
        contract_signed: false,
        contract_file: '',
        is_favorite: false,
        rating: '' as string | number,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/weddings/${wedding.id}/vendors`);
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Add Vendor`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/weddings/${wedding.id}/vendors`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <PageHeader
                        title="Add Vendor"
                        description="Add a new vendor to your wedding"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Basic Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Vendor Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Elegant Florals"
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
                                        value={data.category_id?.toString() || ''}
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

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(value: 'researching' | 'pending' | 'booked' | 'cancelled') =>
                                            setData('status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="researching">
                                                Researching
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="booked">
                                                Booked
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        type="url"
                                        value={data.website}
                                        onChange={(e) =>
                                            setData('website', e.target.value)
                                        }
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="is_favorite"
                                    checked={data.is_favorite}
                                    onCheckedChange={(checked) =>
                                        setData('is_favorite', !!checked)
                                    }
                                />
                                <Label htmlFor="is_favorite" className="font-normal">
                                    Mark as favorite
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="contact_name">Contact Name</Label>
                                    <Input
                                        id="contact_name"
                                        value={data.contact_name}
                                        onChange={(e) =>
                                            setData('contact_name', e.target.value)
                                        }
                                        placeholder="Contact person"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="email@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Street Address</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="123 Main Street"
                                />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        onChange={(e) =>
                                            setData('city', e.target.value)
                                        }
                                        placeholder="City"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state">State/Province</Label>
                                    <Input
                                        id="state"
                                        value={data.state}
                                        onChange={(e) =>
                                            setData('state', e.target.value)
                                        }
                                        placeholder="State"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        value={data.country}
                                        onChange={(e) =>
                                            setData('country', e.target.value)
                                        }
                                        placeholder="Country"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">Postal Code</Label>
                                    <Input
                                        id="postal_code"
                                        value={data.postal_code}
                                        onChange={(e) =>
                                            setData('postal_code', e.target.value)
                                        }
                                        placeholder="12345"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Payments */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Pricing & Payments
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Total Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) =>
                                            setData('price', e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deposit_amount">
                                        Deposit Amount
                                    </Label>
                                    <Input
                                        id="deposit_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.deposit_amount}
                                        onChange={(e) =>
                                            setData('deposit_amount', e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deposit_due_date">
                                        Deposit Due Date
                                    </Label>
                                    <Input
                                        id="deposit_due_date"
                                        type="date"
                                        value={data.deposit_due_date}
                                        onChange={(e) =>
                                            setData('deposit_due_date', e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="deposit_paid"
                                        checked={data.deposit_paid}
                                        onCheckedChange={(checked) =>
                                            setData('deposit_paid', !!checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="deposit_paid"
                                        className="font-normal"
                                    >
                                        Deposit paid
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="contract_signed"
                                        checked={data.contract_signed}
                                        onCheckedChange={(checked) =>
                                            setData('contract_signed', !!checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="contract_signed"
                                        className="font-normal"
                                    >
                                        Contract signed
                                    </Label>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="final_payment_due_date">
                                        Final Payment Due Date
                                    </Label>
                                    <Input
                                        id="final_payment_due_date"
                                        type="date"
                                        value={data.final_payment_due_date}
                                        onChange={(e) =>
                                            setData(
                                                'final_payment_due_date',
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2 self-end pb-2">
                                    <Checkbox
                                        id="final_payment_paid"
                                        checked={data.final_payment_paid}
                                        onCheckedChange={(checked) =>
                                            setData('final_payment_paid', !!checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="final_payment_paid"
                                        className="font-normal"
                                    >
                                        Final payment paid
                                    </Label>
                                </div>
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
                                placeholder="Any additional notes about this vendor..."
                                rows={4}
                            />
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/weddings/${wedding.id}/vendors`}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Vendor'}
                        </Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
