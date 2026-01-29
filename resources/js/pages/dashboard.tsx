import { Head, Link } from '@inertiajs/react';
import { Plus, Heart, Calendar, Users, DollarSign } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { BreadcrumbItem } from '@/types';

interface Wedding {
    id: number;
    title: string;
    date: string;
    partner1_name: string;
    partner2_name: string;
    venue?: string;
    guests_count: number;
    budget: number;
}

interface DashboardProps {
    weddings: Wedding[];
    stats: {
        total_weddings: number;
        upcoming_weddings: number;
        total_guests: number;
        total_budget: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ weddings = [], stats }: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600">Total Weddings</CardTitle>
                            <Heart className="h-4 w-4 text-rose-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_weddings || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600">Upcoming</CardTitle>
                            <Calendar className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.upcoming_weddings || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600">Total Guests</CardTitle>
                            <Users className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.total_guests || 0}</div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-neutral-600">Total Budget</CardTitle>
                            <DollarSign className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats?.total_budget || 0)}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Weddings List or Empty State */}
                <Card className="border-0 shadow-sm flex-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Your Weddings</CardTitle>
                            <CardDescription>Manage all your wedding plans</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/weddings/create">
                                <Plus className="mr-2 h-4 w-4" />
                                New Wedding
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {weddings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-neutral-100 p-4 mb-4">
                                    <Heart className="h-8 w-8 text-neutral-400" />
                                </div>
                                <h3 className="text-lg font-medium text-neutral-900 mb-1">No weddings yet</h3>
                                <p className="text-sm text-neutral-500 mb-4 max-w-sm">
                                    Start planning your perfect wedding by creating your first wedding plan.
                                </p>
                                <Button asChild>
                                    <Link href="/weddings/create">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Wedding
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {weddings.map((wedding) => (
                                    <Link
                                        key={wedding.id}
                                        href={`/weddings/${wedding.id}/dashboard`}
                                        className="block"
                                    >
                                        <Card className="border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all cursor-pointer">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-lg">{wedding.title}</CardTitle>
                                                <CardDescription>
                                                    {wedding.partner1_name} & {wedding.partner2_name}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex items-center text-neutral-600">
                                                        <Calendar className="mr-2 h-4 w-4" />
                                                        {formatDate(wedding.date)}
                                                    </div>
                                                    {wedding.venue && (
                                                        <div className="text-neutral-500 truncate">
                                                            {wedding.venue}
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between pt-2 border-t">
                                                        <span className="text-neutral-500">
                                                            {wedding.guests_count} guests
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatCurrency(wedding.budget)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
