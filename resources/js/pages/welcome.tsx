import { Head, Link, usePage } from '@inertiajs/react';
import { Heart, Users, Calendar, DollarSign, CheckSquare, MapPin } from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    const features = [
        {
            icon: Users,
            title: 'Guest Management',
            description: 'Track RSVPs, dietary requirements, seating arrangements, and contact information for all your guests.',
        },
        {
            icon: DollarSign,
            title: 'Budget Tracking',
            description: 'Stay on top of your wedding budget with expense categories, payment tracking, and real-time totals.',
        },
        {
            icon: CheckSquare,
            title: 'Task Checklist',
            description: 'Never miss a deadline with our comprehensive wedding checklist and task management system.',
        },
        {
            icon: Calendar,
            title: 'Timeline Planning',
            description: 'Create detailed timelines for your wedding day and all the events leading up to it.',
        },
        {
            icon: MapPin,
            title: 'Vendor Management',
            description: 'Keep track of all your vendors, contracts, payments, and contact information in one place.',
        },
        {
            icon: Heart,
            title: 'And Much More',
            description: 'Seating charts, menus, invitations, gift registry, accommodations, and wedding party management.',
        },
    ];

    return (
        <>
            <Head title="Wedding Planner">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-white">
                {/* Header */}
                <header className="border-b border-neutral-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                <Heart className="h-8 w-8 text-neutral-900" />
                                <span className="ml-2 text-xl font-semibold text-neutral-900">Wedding Planner</span>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
                                            >
                                                Get Started
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white py-20 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-6xl">
                                Plan Your Perfect
                                <span className="block text-neutral-600">Wedding Day</span>
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600">
                                Your all-in-one wedding planning solution. Manage guests, budget, vendors,
                                and every detail of your special day in one beautiful, organized place.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg bg-neutral-900 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-neutral-800 transition-colors"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-neutral-900 px-8 py-3 text-base font-medium text-white shadow-sm hover:bg-neutral-800 transition-colors"
                                        >
                                            Start Planning Free
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="rounded-lg border border-neutral-300 bg-white px-8 py-3 text-base font-medium text-neutral-700 shadow-sm hover:bg-neutral-50 transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
                                Everything You Need
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
                                From the first save-the-date to the last dance, we've got you covered.
                            </p>
                        </div>
                        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border border-neutral-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
                                        <feature.icon className="h-6 w-6 text-neutral-700" />
                                    </div>
                                    <h3 className="mt-6 text-lg font-semibold text-neutral-900">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-2 text-neutral-600">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-neutral-900 py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Ready to Start Planning?
                            </h2>
                            <p className="mx-auto mt-4 max-w-xl text-lg text-neutral-300">
                                Join thousands of couples who have planned their perfect wedding with us.
                            </p>
                            <div className="mt-8">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="inline-block rounded-lg bg-white px-8 py-3 text-base font-medium text-neutral-900 shadow-sm hover:bg-neutral-100 transition-colors"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-lg bg-white px-8 py-3 text-base font-medium text-neutral-900 shadow-sm hover:bg-neutral-100 transition-colors"
                                    >
                                        Create Free Account
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-neutral-100 py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center">
                            <Heart className="h-5 w-5 text-neutral-400" />
                            <span className="ml-2 text-sm text-neutral-500">
                                Wedding Planner &copy; {new Date().getFullYear()}
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
