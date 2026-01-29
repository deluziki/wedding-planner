import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Calendar, Heart, MoreHorizontal, Plus, Trash2, Users } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { EmptyState } from '@/components/empty-state';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Wedding } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Weddings', href: '/weddings' },
];

interface Props {
    weddings: Wedding[];
}

export default function WeddingsIndex({ weddings }: Props) {
    const handleDelete = (wedding: Wedding) => {
        if (confirm('Are you sure you want to delete this wedding?')) {
            router.delete(`/weddings/${wedding.id}`);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planning':
                return 'bg-neutral-100 text-neutral-800';
            case 'confirmed':
                return 'bg-black text-white';
            case 'completed':
                return 'bg-neutral-200 text-neutral-600';
            case 'cancelled':
                return 'bg-neutral-300 text-neutral-500';
            default:
                return 'bg-neutral-100 text-neutral-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Weddings" />

            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <PageHeader
                    title="My Weddings"
                    description="Plan and manage your perfect day"
                    actions={
                        <Button asChild>
                            <Link href="/weddings/create">
                                <Plus className="mr-2 h-4 w-4" />
                                New Wedding
                            </Link>
                        </Button>
                    }
                />

                {weddings.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="No weddings yet"
                        description="Start planning your special day by creating your first wedding."
                        action={
                            <Button asChild>
                                <Link href="/weddings/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Wedding
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {weddings.map((wedding) => {
                            const daysUntil = wedding.wedding_date
                                ? Math.ceil(
                                      (new Date(wedding.wedding_date).getTime() -
                                          new Date().getTime()) /
                                          (1000 * 60 * 60 * 24)
                                  )
                                : null;

                            return (
                                <Card
                                    key={wedding.id}
                                    className="group relative overflow-hidden border-0 bg-gradient-to-br from-neutral-50 to-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    {/* Cover Image or Pattern */}
                                    <div className="relative h-40 bg-gradient-to-br from-neutral-100 to-neutral-200">
                                        {wedding.cover_image ? (
                                            <img
                                                src={wedding.cover_image}
                                                alt={wedding.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center">
                                                <Heart className="h-12 w-12 text-neutral-300" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute bottom-4 left-4">
                                            <Badge
                                                variant="secondary"
                                                className={getStatusColor(wedding.status)}
                                            >
                                                {wedding.status}
                                            </Badge>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-2 top-2 h-8 w-8 bg-white/80 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleDelete(wedding)
                                                    }
                                                    className="text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <CardContent className="p-5">
                                        <Link
                                            href={`/weddings/${wedding.id}/dashboard`}
                                            className="block"
                                        >
                                            <h3 className="font-serif text-xl font-light tracking-wide">
                                                {wedding.bride_name} &{' '}
                                                {wedding.groom_name}
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {wedding.title}
                                            </p>

                                            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                                                {wedding.wedding_date && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3.5 w-3.5" />
                                                        {format(
                                                            new Date(
                                                                wedding.wedding_date
                                                            ),
                                                            'MMM d, yyyy'
                                                        )}
                                                    </div>
                                                )}
                                                {wedding.guests_count !==
                                                    undefined && (
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        {wedding.guests_count} guests
                                                    </div>
                                                )}
                                            </div>

                                            {daysUntil !== null && daysUntil > 0 && (
                                                <div className="mt-4 rounded-md bg-neutral-50 p-3 text-center">
                                                    <p className="text-2xl font-light">
                                                        {daysUntil}
                                                    </p>
                                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                                        days to go
                                                    </p>
                                                </div>
                                            )}
                                        </Link>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
