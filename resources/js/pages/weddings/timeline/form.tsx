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
import type { BreadcrumbItem, TimelineEvent, Venue, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    event?: TimelineEvent;
    venues: Venue[];
    defaultType?: string;
}

export default function TimelineForm({
    wedding,
    event,
    venues,
    defaultType,
}: Props) {
    const isEditing = !!event;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Timeline', href: `/weddings/${wedding.id}/timeline` },
        {
            title: isEditing ? 'Edit Event' : 'Add Event',
            href: isEditing
                ? `/weddings/${wedding.id}/timeline/${event.id}/edit`
                : `/weddings/${wedding.id}/timeline/create`,
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        title: event?.title || '',
        description: event?.description || '',
        event_type: event?.event_type || defaultType || 'wedding_day',
        category: event?.category || '',
        event_date: event?.event_date || wedding.date || '',
        start_time: event?.start_time || '',
        end_time: event?.end_time || '',
        duration_minutes: event?.duration_minutes?.toString() || '',
        location: event?.location || '',
        venue_id: event?.venue_id?.toString() || '',
        attendees: event?.attendees || '',
        vendor_ids: event?.vendor_ids || [],
        notes: event?.notes || '',
        sort_order: event?.sort_order?.toString() || '0',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/timeline/${event.id}`);
        } else {
            post(`/weddings/${wedding.id}/timeline`);
        }
    };

    const categories = [
        'Preparation',
        'Ceremony',
        'Photos',
        'Cocktail Hour',
        'Reception',
        'Entertainment',
        'Food',
        'Speeches',
        'Dancing',
        'Other',
    ];

    const eventTypes = [
        { value: 'wedding_day', label: 'Wedding Day' },
        { value: 'rehearsal', label: 'Rehearsal' },
        { value: 'rehearsal_dinner', label: 'Rehearsal Dinner' },
        { value: 'bachelor_party', label: 'Bachelor Party' },
        { value: 'bachelorette_party', label: 'Bachelorette Party' },
        { value: 'bridal_shower', label: 'Bridal Shower' },
        { value: 'welcome_party', label: 'Welcome Party' },
        { value: 'brunch', label: 'Post-Wedding Brunch' },
        { value: 'other', label: 'Other' },
    ];

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head
                title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Timeline Event`}
            />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/weddings/${wedding.id}/timeline`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <PageHeader
                        title={isEditing ? 'Edit Event' : 'Add Event'}
                        description={
                            isEditing
                                ? 'Update timeline event details'
                                : 'Add a new event to your timeline'
                        }
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Event Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Event Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Ceremony, First Dance"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="event_type">Event Type</Label>
                                    <Select
                                        value={data.event_type}
                                        onValueChange={(value) =>
                                            setData('event_type', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {eventTypes.map((type) => (
                                                <SelectItem
                                                    key={type.value}
                                                    value={type.value}
                                                >
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) =>
                                            setData('category', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Add details about this event..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Date & Time */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Date & Time
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="event_date">Date</Label>
                                    <Input
                                        id="event_date"
                                        type="date"
                                        value={data.event_date}
                                        onChange={(e) =>
                                            setData('event_date', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="start_time">Start Time</Label>
                                    <Input
                                        id="start_time"
                                        type="time"
                                        value={data.start_time}
                                        onChange={(e) =>
                                            setData('start_time', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_time">End Time</Label>
                                    <Input
                                        id="end_time"
                                        type="time"
                                        value={data.end_time}
                                        onChange={(e) =>
                                            setData('end_time', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration_minutes">
                                        Duration (minutes)
                                    </Label>
                                    <Input
                                        id="duration_minutes"
                                        type="number"
                                        min="0"
                                        value={data.duration_minutes}
                                        onChange={(e) =>
                                            setData('duration_minutes', e.target.value)
                                        }
                                        placeholder="e.g., 30"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Location */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {venues.length > 0 && (
                                    <div className="space-y-2">
                                        <Label htmlFor="venue_id">Venue</Label>
                                        <Select
                                            value={data.venue_id}
                                            onValueChange={(value) =>
                                                setData('venue_id', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select venue" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    No venue
                                                </SelectItem>
                                                {venues.map((venue) => (
                                                    <SelectItem
                                                        key={venue.id}
                                                        value={venue.id.toString()}
                                                    >
                                                        {venue.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="location">
                                        Location / Room Name
                                    </Label>
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        placeholder="e.g., Garden, Ballroom"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Additional Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="attendees">Attendees</Label>
                                    <Input
                                        id="attendees"
                                        value={data.attendees}
                                        onChange={(e) =>
                                            setData('attendees', e.target.value)
                                        }
                                        placeholder="e.g., Bride, Groom, Wedding Party"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">Display Order</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) =>
                                            setData('sort_order', e.target.value)
                                        }
                                        className="w-24"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Any additional notes..."
                                    rows={3}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/weddings/${wedding.id}/timeline`}>
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
                                  : 'Add Event'}
                        </Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
