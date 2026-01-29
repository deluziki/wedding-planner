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
import type { BreadcrumbItem, SeatingTable, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    seatingTables: SeatingTable[];
    groups: string[];
}

export default function GuestsCreate({ wedding, seatingTables, groups }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Guests', href: `/weddings/${wedding.id}/guests` },
        { title: 'Add Guest', href: `/weddings/${wedding.id}/guests/create` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        group: '',
        side: '' as 'bride' | 'groom' | 'both' | '',
        relationship: '',
        rsvp_status: 'pending' as 'pending' | 'confirmed' | 'declined' | 'maybe',
        attending_ceremony: true,
        attending_reception: true,
        plus_one_allowed: 0,
        plus_one_name: '',
        dietary_restrictions: '',
        meal_choice: '',
        special_requests: '',
        table_id: '' as string | number,
        seat_number: '' as string | number,
        is_child: false,
        age: '' as string | number,
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/weddings/${wedding.id}/guests`);
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Add Guest`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/weddings/${wedding.id}/guests`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <PageHeader
                        title="Add Guest"
                        description="Add a new guest to your wedding"
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">
                                        First Name *
                                    </Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData('first_name', e.target.value)
                                        }
                                        placeholder="First name"
                                    />
                                    {errors.first_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.first_name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last Name *</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        placeholder="Last name"
                                    />
                                    {errors.last_name && (
                                        <p className="text-sm text-destructive">
                                            {errors.last_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
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
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
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
                                    {errors.phone && (
                                        <p className="text-sm text-destructive">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_child"
                                        checked={data.is_child}
                                        onCheckedChange={(checked) =>
                                            setData('is_child', !!checked)
                                        }
                                    />
                                    <Label htmlFor="is_child" className="font-normal">
                                        This is a child
                                    </Label>
                                </div>
                                {data.is_child && (
                                    <div className="flex items-center gap-2">
                                        <Label htmlFor="age" className="font-normal">
                                            Age:
                                        </Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            min="0"
                                            max="17"
                                            value={data.age}
                                            onChange={(e) =>
                                                setData('age', e.target.value)
                                            }
                                            className="w-20"
                                        />
                                    </div>
                                )}
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

                    {/* Guest Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Guest Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="group">Group</Label>
                                    <Input
                                        id="group"
                                        value={data.group}
                                        onChange={(e) =>
                                            setData('group', e.target.value)
                                        }
                                        placeholder="e.g., Family, Friends, Work"
                                        list="group-suggestions"
                                    />
                                    <datalist id="group-suggestions">
                                        {groups.map((g) => (
                                            <option key={g} value={g} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="side">Side</Label>
                                    <Select
                                        value={data.side}
                                        onValueChange={(value: 'bride' | 'groom' | 'both') =>
                                            setData('side', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select side" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="bride">
                                                Bride's Guest
                                            </SelectItem>
                                            <SelectItem value="groom">
                                                Groom's Guest
                                            </SelectItem>
                                            <SelectItem value="both">
                                                Both
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="relationship">Relationship</Label>
                                    <Input
                                        id="relationship"
                                        value={data.relationship}
                                        onChange={(e) =>
                                            setData('relationship', e.target.value)
                                        }
                                        placeholder="e.g., Cousin, College Friend"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* RSVP & Attendance */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                RSVP & Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="rsvp_status">RSVP Status</Label>
                                    <Select
                                        value={data.rsvp_status}
                                        onValueChange={(value: 'pending' | 'confirmed' | 'declined' | 'maybe') =>
                                            setData('rsvp_status', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="confirmed">
                                                Confirmed
                                            </SelectItem>
                                            <SelectItem value="declined">
                                                Declined
                                            </SelectItem>
                                            <SelectItem value="maybe">Maybe</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="plus_one_allowed">
                                        Plus Ones Allowed
                                    </Label>
                                    <Input
                                        id="plus_one_allowed"
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={data.plus_one_allowed}
                                        onChange={(e) =>
                                            setData(
                                                'plus_one_allowed',
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="plus_one_name">Plus One Name</Label>
                                    <Input
                                        id="plus_one_name"
                                        value={data.plus_one_name}
                                        onChange={(e) =>
                                            setData('plus_one_name', e.target.value)
                                        }
                                        placeholder="If known"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="attending_ceremony"
                                        checked={data.attending_ceremony}
                                        onCheckedChange={(checked) =>
                                            setData('attending_ceremony', !!checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="attending_ceremony"
                                        className="font-normal"
                                    >
                                        Attending Ceremony
                                    </Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="attending_reception"
                                        checked={data.attending_reception}
                                        onCheckedChange={(checked) =>
                                            setData('attending_reception', !!checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="attending_reception"
                                        className="font-normal"
                                    >
                                        Attending Reception
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Meal & Dietary */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Meal & Dietary Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="meal_choice">Meal Choice</Label>
                                    <Input
                                        id="meal_choice"
                                        value={data.meal_choice}
                                        onChange={(e) =>
                                            setData('meal_choice', e.target.value)
                                        }
                                        placeholder="e.g., Chicken, Beef, Vegetarian"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dietary_restrictions">
                                        Dietary Restrictions
                                    </Label>
                                    <Input
                                        id="dietary_restrictions"
                                        value={data.dietary_restrictions}
                                        onChange={(e) =>
                                            setData(
                                                'dietary_restrictions',
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g., Vegetarian, Gluten-free"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="special_requests">
                                    Special Requests
                                </Label>
                                <Textarea
                                    id="special_requests"
                                    value={data.special_requests}
                                    onChange={(e) =>
                                        setData('special_requests', e.target.value)
                                    }
                                    placeholder="Any special requests or accommodations..."
                                    rows={2}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Seating */}
                    {seatingTables.length > 0 && (
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">
                                    Seating Assignment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="table_id">Table</Label>
                                        <Select
                                            value={data.table_id?.toString() || ''}
                                            onValueChange={(value) =>
                                                setData('table_id', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select table" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {seatingTables.map((table) => (
                                                    <SelectItem
                                                        key={table.id}
                                                        value={table.id.toString()}
                                                    >
                                                        {table.name} (
                                                        {table.guests?.length || 0}/
                                                        {table.capacity})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="seat_number">Seat Number</Label>
                                        <Input
                                            id="seat_number"
                                            type="number"
                                            min="1"
                                            value={data.seat_number}
                                            onChange={(e) =>
                                                setData('seat_number', e.target.value)
                                            }
                                            placeholder="Seat number"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

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
                                placeholder="Any additional notes about this guest..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/weddings/${wedding.id}/guests`}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Guest'}
                        </Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
