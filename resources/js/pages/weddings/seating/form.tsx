import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    table?: SeatingTable;
}

export default function SeatingForm({ wedding, table }: Props) {
    const isEditing = !!table;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Seating', href: `/weddings/${wedding.id}/seating` },
        {
            title: isEditing ? 'Edit Table' : 'Add Table',
            href: isEditing
                ? `/weddings/${wedding.id}/seating/${table.id}/edit`
                : `/weddings/${wedding.id}/seating/create`,
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: table?.name || '',
        table_number: table?.table_number?.toString() || '',
        capacity: table?.capacity?.toString() || '8',
        shape: table?.shape || 'round',
        location: table?.location || '',
        position_x: table?.position_x?.toString() || '',
        position_y: table?.position_y?.toString() || '',
        notes: table?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/seating/${table.id}`);
        } else {
            post(`/weddings/${wedding.id}/seating`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head
                title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Table`}
            />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/weddings/${wedding.id}/seating`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <PageHeader
                        title={isEditing ? `Edit ${table.name}` : 'Add Table'}
                        description={
                            isEditing
                                ? 'Update table details'
                                : 'Add a new table to your seating chart'
                        }
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Table Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Table Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Table Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Table 1, Head Table"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="table_number">Table Number</Label>
                                    <Input
                                        id="table_number"
                                        type="number"
                                        min="1"
                                        value={data.table_number}
                                        onChange={(e) =>
                                            setData('table_number', e.target.value)
                                        }
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="capacity">Capacity *</Label>
                                    <Input
                                        id="capacity"
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={data.capacity}
                                        onChange={(e) =>
                                            setData('capacity', e.target.value)
                                        }
                                        placeholder="8"
                                    />
                                    {errors.capacity && (
                                        <p className="text-sm text-destructive">
                                            {errors.capacity}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="shape">Shape</Label>
                                    <Select
                                        value={data.shape}
                                        onValueChange={(value) =>
                                            setData('shape', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="round">Round</SelectItem>
                                            <SelectItem value="square">
                                                Square
                                            </SelectItem>
                                            <SelectItem value="rectangular">
                                                Rectangular
                                            </SelectItem>
                                            <SelectItem value="oval">Oval</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={(e) =>
                                        setData('location', e.target.value)
                                    }
                                    placeholder="e.g., Near the dance floor, By the window"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Position (for visual chart) */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Position (Optional)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Set the position for the visual seating chart layout.
                            </p>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="position_x">X Position</Label>
                                    <Input
                                        id="position_x"
                                        type="number"
                                        value={data.position_x}
                                        onChange={(e) =>
                                            setData('position_x', e.target.value)
                                        }
                                        placeholder="0"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position_y">Y Position</Label>
                                    <Input
                                        id="position_y"
                                        type="number"
                                        value={data.position_y}
                                        onChange={(e) =>
                                            setData('position_y', e.target.value)
                                        }
                                        placeholder="0"
                                    />
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
                                placeholder="Any notes about this table..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/weddings/${wedding.id}/seating`}>
                                Cancel
                            </Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? isEditing
                                    ? 'Saving...'
                                    : 'Creating...'
                                : isEditing
                                  ? 'Save Changes'
                                  : 'Add Table'}
                        </Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
