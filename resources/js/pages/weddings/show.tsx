import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    Edit,
    Heart,
    MapPin,
    Palette,
    PiggyBank,
    Users,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    stats: {
        total_spent: number;
        total_paid: number;
        remaining_budget: number;
        days_until_wedding: number | null;
    };
}

export default function ShowWedding({ wedding, stats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}` },
    ];

    const budgetProgress = wedding.total_budget
        ? (stats.total_spent / wedding.total_budget) * 100
        : 0;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: wedding.currency || 'USD',
        }).format(amount);
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={wedding.title} />

            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 text-white">
                    <div className="absolute right-0 top-0 opacity-10">
                        <Heart className="h-64 w-64 -translate-y-8 translate-x-8" />
                    </div>
                    <div className="relative">
                        <div className="flex items-start justify-between">
                            <div>
                                <Badge
                                    variant="secondary"
                                    className="mb-4 bg-white/20 text-white"
                                >
                                    {wedding.status}
                                </Badge>
                                <h1 className="font-serif text-4xl font-light tracking-wide">
                                    {wedding.bride_name} & {wedding.groom_name}
                                </h1>
                                <p className="mt-2 text-white/70">{wedding.title}</p>
                            </div>
                            <Button variant="secondary" size="sm" asChild>
                                <Link href={`/weddings/${wedding.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Link>
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-6 text-sm">
                            {wedding.wedding_date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-white/50" />
                                    {format(
                                        new Date(wedding.wedding_date),
                                        'EEEE, MMMM d, yyyy'
                                    )}
                                </div>
                            )}
                            {wedding.ceremony_time && (
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-white/50" />
                                    Ceremony at {wedding.ceremony_time}
                                </div>
                            )}
                            {wedding.wedding_style && (
                                <div className="flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-white/50" />
                                    {wedding.wedding_style} style
                                </div>
                            )}
                        </div>

                        {stats.days_until_wedding !== null &&
                            stats.days_until_wedding > 0 && (
                                <div className="mt-8 inline-block rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                                    <p className="text-center text-4xl font-light">
                                        {stats.days_until_wedding}
                                    </p>
                                    <p className="text-center text-xs uppercase tracking-wider text-white/70">
                                        days until the big day
                                    </p>
                                </div>
                            )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Guests"
                        value={wedding.guests_count || 0}
                        subtitle={`${wedding.confirmed_guests_count || 0} confirmed`}
                        icon={Users}
                        className="bg-neutral-50"
                    />
                    <StatCard
                        title="Budget"
                        value={formatCurrency(wedding.total_budget || 0)}
                        subtitle={`${formatCurrency(stats.remaining_budget)} remaining`}
                        icon={PiggyBank}
                        className="bg-neutral-50"
                    />
                    <StatCard
                        title="Tasks"
                        value={`${wedding.completed_tasks_count || 0}/${wedding.tasks_count || 0}`}
                        subtitle="completed"
                        icon={Clock}
                        className="bg-neutral-50"
                    />
                    <StatCard
                        title="Vendors"
                        value={wedding.booked_vendors_count || 0}
                        subtitle={`of ${wedding.vendors_count || 0} booked`}
                        icon={MapPin}
                        className="bg-neutral-50"
                    />
                </div>

                {/* Budget Progress */}
                {wedding.total_budget && (
                    <Card className="border-0 bg-neutral-50 shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-base font-medium">
                                <span>Budget Overview</span>
                                <span className="text-sm font-normal text-muted-foreground">
                                    {budgetProgress.toFixed(0)}% spent
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Progress value={budgetProgress} className="h-2" />
                            <div className="mt-4 flex justify-between text-sm">
                                <div>
                                    <p className="text-muted-foreground">Spent</p>
                                    <p className="font-medium">
                                        {formatCurrency(stats.total_spent)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-muted-foreground">Remaining</p>
                                    <p className="font-medium">
                                        {formatCurrency(stats.remaining_budget)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Quick Links */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Link href={`/weddings/${wedding.id}/guests`}>
                        <Card className="cursor-pointer border-0 bg-neutral-50 shadow-none transition-colors hover:bg-neutral-100">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-white p-3">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Manage Guests</p>
                                    <p className="text-sm text-muted-foreground">
                                        {wedding.guests_count || 0} guests,{' '}
                                        {wedding.pending_guests_count || 0} pending RSVP
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={`/weddings/${wedding.id}/budget`}>
                        <Card className="cursor-pointer border-0 bg-neutral-50 shadow-none transition-colors hover:bg-neutral-100">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-white p-3">
                                    <PiggyBank className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">Track Budget</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatCurrency(stats.total_paid)} paid
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href={`/weddings/${wedding.id}/tasks`}>
                        <Card className="cursor-pointer border-0 bg-neutral-50 shadow-none transition-colors hover:bg-neutral-100">
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className="rounded-full bg-white p-3">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">View Tasks</p>
                                    <p className="text-sm text-muted-foreground">
                                        {wedding.pending_tasks_count || 0} tasks pending
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                {/* Venues */}
                {wedding.venues && wedding.venues.length > 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Venues
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {wedding.venues.map((venue) => (
                                    <div
                                        key={venue.id}
                                        className="rounded-lg bg-neutral-50 p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Badge
                                                    variant="outline"
                                                    className="mb-2"
                                                >
                                                    {venue.type}
                                                </Badge>
                                                <h4 className="font-medium">
                                                    {venue.name}
                                                </h4>
                                                {venue.address && (
                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        {venue.address}, {venue.city}
                                                    </p>
                                                )}
                                            </div>
                                            {venue.is_booked && (
                                                <Badge className="bg-black text-white">
                                                    Booked
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </WeddingLayout>
    );
}
