import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import {
    Calendar,
    Clock,
    Edit,
    MapPin,
    MoreHorizontal,
    Plus,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, TimelineEvent, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    events: TimelineEvent[];
}

export default function TimelineIndex({ wedding, events }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Timeline', href: `/weddings/${wedding.id}/timeline` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [eventToDelete, setEventToDelete] = useState<TimelineEvent | null>(null);

    const handleDelete = (event: TimelineEvent) => {
        setEventToDelete(event);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (eventToDelete) {
            router.delete(
                `/weddings/${wedding.id}/timeline/${eventToDelete.id}`
            );
        }
        setShowDeleteDialog(false);
        setEventToDelete(null);
    };

    const formatTime = (time: string) => {
        try {
            const [hours, minutes] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(hours), parseInt(minutes));
            return format(date, 'h:mm a');
        } catch {
            return time;
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            ceremony: 'bg-purple-100 text-purple-800',
            reception: 'bg-blue-100 text-blue-800',
            photos: 'bg-pink-100 text-pink-800',
            preparation: 'bg-yellow-100 text-yellow-800',
            entertainment: 'bg-green-100 text-green-800',
            food: 'bg-orange-100 text-orange-800',
            other: 'bg-neutral-100 text-neutral-800',
        };
        return colors[category?.toLowerCase()] || colors.other;
    };

    // Group events by type (ceremony day vs other)
    const ceremonyEvents = events.filter((e) => e.event_type === 'wedding_day');
    const otherEvents = events.filter((e) => e.event_type !== 'wedding_day');

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Timeline`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Timeline"
                    description="Plan your wedding day schedule"
                    actions={
                        <Button asChild>
                            <Link href={`/weddings/${wedding.id}/timeline/create`}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Event
                            </Link>
                        </Button>
                    }
                />

                {events.length === 0 ? (
                    <EmptyState
                        icon={Clock}
                        title="No timeline events yet"
                        description="Start planning your wedding day by adding timeline events."
                        action={
                            <Button asChild>
                                <Link
                                    href={`/weddings/${wedding.id}/timeline/create`}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Event
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <Tabs defaultValue="wedding-day" className="w-full">
                        <TabsList>
                            <TabsTrigger value="wedding-day">
                                Wedding Day ({ceremonyEvents.length})
                            </TabsTrigger>
                            <TabsTrigger value="other">
                                Other Events ({otherEvents.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="wedding-day" className="mt-6">
                            {ceremonyEvents.length === 0 ? (
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="py-12 text-center">
                                        <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-medium">
                                            No wedding day events
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Add events for your wedding day schedule.
                                        </p>
                                        <Button className="mt-4" asChild>
                                            <Link
                                                href={`/weddings/${wedding.id}/timeline/create?type=wedding_day`}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Event
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="relative">
                                    {/* Timeline line */}
                                    <div className="absolute left-[39px] top-0 h-full w-0.5 bg-neutral-200" />

                                    <div className="space-y-4">
                                        {ceremonyEvents
                                            .sort((a, b) =>
                                                (a.start_time || '').localeCompare(
                                                    b.start_time || ''
                                                )
                                            )
                                            .map((event, index) => (
                                                <div
                                                    key={event.id}
                                                    className="relative flex gap-4"
                                                >
                                                    {/* Time marker */}
                                                    <div className="flex w-20 flex-shrink-0 flex-col items-center">
                                                        <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
                                                            {event.start_time
                                                                ? formatTime(
                                                                      event.start_time
                                                                  ).split(' ')[0]
                                                                : '—'}
                                                        </div>
                                                        {event.start_time && (
                                                            <span className="mt-1 text-xs text-muted-foreground">
                                                                {
                                                                    formatTime(
                                                                        event.start_time
                                                                    ).split(' ')[1]
                                                                }
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Event card */}
                                                    <Card className="flex-1 border-0 shadow-sm">
                                                        <CardContent className="p-4">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <h3 className="font-medium">
                                                                            {event.title}
                                                                        </h3>
                                                                        {event.category && (
                                                                            <Badge
                                                                                className={getCategoryColor(
                                                                                    event.category
                                                                                )}
                                                                            >
                                                                                {
                                                                                    event.category
                                                                                }
                                                                            </Badge>
                                                                        )}
                                                                    </div>

                                                                    {event.description && (
                                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                                            {
                                                                                event.description
                                                                            }
                                                                        </p>
                                                                    )}

                                                                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                                        {event.duration_minutes && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock className="h-3 w-3" />
                                                                                {
                                                                                    event.duration_minutes
                                                                                }{' '}
                                                                                min
                                                                            </span>
                                                                        )}
                                                                        {event.location && (
                                                                            <span className="flex items-center gap-1">
                                                                                <MapPin className="h-3 w-3" />
                                                                                {
                                                                                    event.location
                                                                                }
                                                                            </span>
                                                                        )}
                                                                        {event.attendees && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Users className="h-3 w-3" />
                                                                                {
                                                                                    event.attendees
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger
                                                                        asChild
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <MoreHorizontal className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            asChild
                                                                        >
                                                                            <Link
                                                                                href={`/weddings/${wedding.id}/timeline/${event.id}/edit`}
                                                                            >
                                                                                <Edit className="mr-2 h-4 w-4" />
                                                                                Edit
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            onClick={() =>
                                                                                handleDelete(
                                                                                    event
                                                                                )
                                                                            }
                                                                            className="text-destructive"
                                                                        >
                                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                                            Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="other" className="mt-6">
                            {otherEvents.length === 0 ? (
                                <Card className="border-0 shadow-sm">
                                    <CardContent className="py-12 text-center">
                                        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <h3 className="mt-4 text-lg font-medium">
                                            No other events
                                        </h3>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Add rehearsal dinners, bachelor parties, etc.
                                        </p>
                                        <Button className="mt-4" asChild>
                                            <Link
                                                href={`/weddings/${wedding.id}/timeline/create`}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Event
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {otherEvents.map((event) => (
                                        <Card
                                            key={event.id}
                                            className="border-0 shadow-sm"
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {event.title}
                                                        </h3>
                                                        {event.category && (
                                                            <Badge
                                                                className={`mt-1 ${getCategoryColor(
                                                                    event.category
                                                                )}`}
                                                            >
                                                                {event.category}
                                                            </Badge>
                                                        )}
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
                                                                    href={`/weddings/${wedding.id}/timeline/${event.id}/edit`}
                                                                >
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDelete(event)
                                                                }
                                                                className="text-destructive"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                {event.description && (
                                                    <p className="mt-2 text-sm text-muted-foreground">
                                                        {event.description}
                                                    </p>
                                                )}

                                                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                                                    {event.event_date && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(
                                                                new Date(
                                                                    event.event_date
                                                                ),
                                                                'MMM d, yyyy'
                                                            )}
                                                        </div>
                                                    )}
                                                    {event.start_time && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTime(event.start_time)}
                                                            {event.end_time &&
                                                                ` - ${formatTime(
                                                                    event.end_time
                                                                )}`}
                                                        </div>
                                                    )}
                                                    {event.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="h-3 w-3" />
                                                            {event.location}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Event</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{eventToDelete?.title}"?
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
