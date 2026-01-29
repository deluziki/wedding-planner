import { Link, usePage } from '@inertiajs/react';
import {
    Calendar,
    ChefHat,
    ClipboardCheck,
    Clock,
    FileText,
    Gift,
    Heart,
    Hotel,
    LayoutDashboard,
    Mail,
    MapPin,
    PiggyBank,
    Store,
    Users,
    UsersRound,
} from 'lucide-react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavUser } from '@/components/nav-user';
import type { AppLayoutProps, Wedding } from '@/types';

interface WeddingLayoutProps extends AppLayoutProps {
    wedding: Wedding;
}

export default function WeddingLayout({
    children,
    breadcrumbs = [],
    wedding,
}: WeddingLayoutProps) {
    const { url } = usePage();

    const navItems = [
        {
            title: 'Dashboard',
            href: `/weddings/${wedding.id}/dashboard`,
            icon: LayoutDashboard,
        },
        {
            title: 'Guests',
            href: `/weddings/${wedding.id}/guests`,
            icon: Users,
        },
        {
            title: 'Wedding Party',
            href: `/weddings/${wedding.id}/party`,
            icon: UsersRound,
        },
        {
            title: 'Venues',
            href: `/weddings/${wedding.id}/venues`,
            icon: MapPin,
        },
        {
            title: 'Vendors',
            href: `/weddings/${wedding.id}/vendors`,
            icon: Store,
        },
        {
            title: 'Budget',
            href: `/weddings/${wedding.id}/budget`,
            icon: PiggyBank,
        },
        {
            title: 'Tasks',
            href: `/weddings/${wedding.id}/tasks`,
            icon: ClipboardCheck,
        },
        {
            title: 'Timeline',
            href: `/weddings/${wedding.id}/timeline`,
            icon: Clock,
        },
        {
            title: 'Seating',
            href: `/weddings/${wedding.id}/seating`,
            icon: Calendar,
        },
        {
            title: 'Invitations',
            href: `/weddings/${wedding.id}/invitations`,
            icon: Mail,
        },
        {
            title: 'Gifts',
            href: `/weddings/${wedding.id}/gifts`,
            icon: Gift,
        },
        {
            title: 'Menus',
            href: `/weddings/${wedding.id}/menus`,
            icon: ChefHat,
        },
        {
            title: 'Accommodations',
            href: `/weddings/${wedding.id}/accommodations`,
            icon: Hotel,
        },
        {
            title: 'Certificate',
            href: `/weddings/${wedding.id}/certificate`,
            icon: FileText,
        },
    ];

    const isActive = (href: string) => {
        return url.startsWith(href);
    };

    const daysUntil = wedding.wedding_date
        ? Math.ceil(
              (new Date(wedding.wedding_date).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
          )
        : null;

    return (
        <AppShell variant="sidebar">
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link href="/weddings" prefetch>
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
                                        <Heart className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {wedding.title}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {daysUntil !== null && daysUntil > 0
                                                ? `${daysUntil} days to go`
                                                : daysUntil === 0
                                                  ? 'Today!'
                                                  : wedding.wedding_date
                                                    ? 'Completed'
                                                    : 'Date not set'}
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Planning</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive(item.href)}
                                        >
                                            <Link href={item.href} prefetch>
                                                <item.icon className="size-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
