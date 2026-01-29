import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    Circle,
    Clock,
    Heart,
    PiggyBank,
    Store,
    Users,
} from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, BudgetItem, Task, Vendor, Wedding } from '@/types';

interface Props {
    wedding: Wedding & {
        tasks: Task[];
        vendors: Vendor[];
    };
    budgetSummary: {
        total_budget: number | null;
        total_estimated: number;
        total_actual: number;
        total_paid: number;
    };
    upcomingPayments: BudgetItem[];
}

export default function WeddingDashboard({
    wedding,
    budgetSummary,
    upcomingPayments,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Dashboard', href: `/weddings/${wedding.id}/dashboard` },
    ];

    const daysUntil = wedding.wedding_date
        ? Math.ceil(
              (new Date(wedding.wedding_date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
          )
        : null;

    const formatCurrency = (amount: number | null) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: wedding.currency || 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const budgetProgress = budgetSummary.total_budget
        ? (budgetSummary.total_actual / budgetSummary.total_budget) * 100
        : 0;

    const taskProgress = wedding.tasks_count
        ? ((wedding.completed_tasks_count || 0) / wedding.tasks_count) * 100
        : 0;

    const guestProgress = wedding.guests_count
        ? ((wedding.confirmed_guests_count || 0) / wedding.guests_count) * 100
        : 0;

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Dashboard`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-black p-8 text-white">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-white/5" />

                    <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm uppercase tracking-wider text-white/60">
                                {wedding.wedding_date
                                    ? format(new Date(wedding.wedding_date), 'EEEE, MMMM d, yyyy')
                                    : 'Date not set'}
                            </p>
                            <h1 className="mt-2 font-serif text-3xl font-light md:text-4xl">
                                {wedding.bride_name} & {wedding.groom_name}
                            </h1>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {wedding.wedding_style && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/10 text-white"
                                    >
                                        {wedding.wedding_style}
                                    </Badge>
                                )}
                                {wedding.color_scheme && (
                                    <Badge
                                        variant="secondary"
                                        className="bg-white/10 text-white"
                                    >
                                        {wedding.color_scheme}
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {daysUntil !== null && daysUntil >= 0 && (
                            <div className="text-center md:text-right">
                                <div className="inline-flex flex-col items-center rounded-xl bg-white/10 px-8 py-4 backdrop-blur-sm">
                                    <Heart className="mb-2 h-6 w-6" />
                                    <p className="text-4xl font-light md:text-5xl">
                                        {daysUntil}
                                    </p>
                                    <p className="text-xs uppercase tracking-wider text-white/60">
                                        {daysUntil === 1 ? 'day' : 'days'} to go
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <Link
                                    href={`/weddings/${wedding.id}/guests`}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    View all
                                </Link>
                            </div>
                            <p className="mt-4 text-3xl font-light">
                                {wedding.confirmed_guests_count || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                of {wedding.guests_count || 0} guests confirmed
                            </p>
                            <Progress value={guestProgress} className="mt-3 h-1" />
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <PiggyBank className="h-5 w-5 text-muted-foreground" />
                                <Link
                                    href={`/weddings/${wedding.id}/budget`}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    View all
                                </Link>
                            </div>
                            <p className="mt-4 text-3xl font-light">
                                {formatCurrency(budgetSummary.total_actual)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                of {formatCurrency(budgetSummary.total_budget)} spent
                            </p>
                            <Progress value={budgetProgress} className="mt-3 h-1" />
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                                <Link
                                    href={`/weddings/${wedding.id}/tasks`}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    View all
                                </Link>
                            </div>
                            <p className="mt-4 text-3xl font-light">
                                {wedding.completed_tasks_count || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                of {wedding.tasks_count || 0} tasks completed
                            </p>
                            <Progress value={taskProgress} className="mt-3 h-1" />
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <Store className="h-5 w-5 text-muted-foreground" />
                                <Link
                                    href={`/weddings/${wedding.id}/vendors`}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    View all
                                </Link>
                            </div>
                            <p className="mt-4 text-3xl font-light">
                                {wedding.booked_vendors_count || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                vendors booked
                            </p>
                            <div className="mt-3 flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full ${
                                            i < (wedding.booked_vendors_count || 0)
                                                ? 'bg-black'
                                                : 'bg-neutral-200'
                                        }`}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Upcoming Tasks */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-medium">
                                Upcoming Tasks
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/weddings/${wedding.id}/tasks`}>
                                    View all
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {wedding.tasks && wedding.tasks.length > 0 ? (
                                <div className="space-y-3">
                                    {wedding.tasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-start gap-3 rounded-lg bg-neutral-50 p-3"
                                        >
                                            <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {task.title}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                    {task.due_date && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {format(
                                                                new Date(task.due_date),
                                                                'MMM d'
                                                            )}
                                                        </span>
                                                    )}
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                                    <p>No pending tasks</p>
                                    <Button
                                        variant="link"
                                        className="mt-2"
                                        asChild
                                    >
                                        <Link href={`/weddings/${wedding.id}/tasks`}>
                                            Add tasks
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Payments */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-medium">
                                Upcoming Payments
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/weddings/${wedding.id}/budget`}>
                                    View all
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {upcomingPayments && upcomingPayments.length > 0 ? (
                                <div className="space-y-3">
                                    {upcomingPayments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between rounded-lg bg-neutral-50 p-3"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium truncate">
                                                    {payment.name}
                                                </p>
                                                {payment.due_date && (
                                                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Clock className="h-3 w-3" />
                                                        Due{' '}
                                                        {format(
                                                            new Date(payment.due_date),
                                                            'MMM d, yyyy'
                                                        )}
                                                    </p>
                                                )}
                                            </div>
                                            <p className="font-medium">
                                                {formatCurrency(
                                                    (payment.actual_cost ||
                                                        payment.estimated_cost ||
                                                        0) -
                                                        (payment.paid_amount || 0)
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-sm text-muted-foreground">
                                    <PiggyBank className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                                    <p>No upcoming payments</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Booked Vendors */}
                {wedding.vendors && wedding.vendors.length > 0 && (
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base font-medium">
                                Booked Vendors
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={`/weddings/${wedding.id}/vendors`}>
                                    View all
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {wedding.vendors.map((vendor) => (
                                    <div
                                        key={vendor.id}
                                        className="rounded-lg border p-4"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Badge variant="outline" className="mb-2">
                                                    {vendor.category?.name || 'Vendor'}
                                                </Badge>
                                                <p className="font-medium">{vendor.name}</p>
                                                {vendor.company_name && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {vendor.company_name}
                                                    </p>
                                                )}
                                            </div>
                                            {vendor.final_price && (
                                                <p className="text-sm font-medium">
                                                    {formatCurrency(vendor.final_price)}
                                                </p>
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
