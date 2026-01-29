import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    ChevronDown,
    ChevronRight,
    DollarSign,
    Edit,
    MoreHorizontal,
    PieChart,
    Plus,
    Trash2,
    TrendingDown,
    TrendingUp,
    Wallet,
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
import { Progress } from '@/components/ui/progress';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, BudgetCategory, BudgetItem, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    categories: (BudgetCategory & { items: BudgetItem[] })[];
    stats: {
        total_budget: number;
        total_estimated: number;
        total_actual: number;
        total_paid: number;
        remaining_budget: number;
        over_budget: boolean;
    };
}

export default function BudgetIndex({ wedding, categories, stats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Budget', href: `/weddings/${wedding.id}/budget` },
    ];

    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{
        type: 'category' | 'item';
        id: number;
        name: string;
    } | null>(null);

    const toggleCategory = (id: number) => {
        setExpandedCategories((prev) =>
            prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
        );
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: wedding.currency || 'USD',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleDelete = (type: 'category' | 'item', id: number, name: string) => {
        setItemToDelete({ type, id, name });
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            const url =
                itemToDelete.type === 'category'
                    ? `/weddings/${wedding.id}/budget/categories/${itemToDelete.id}`
                    : `/weddings/${wedding.id}/budget/items/${itemToDelete.id}`;
            router.delete(url);
        }
        setShowDeleteDialog(false);
        setItemToDelete(null);
    };

    const budgetUsedPercent =
        stats.total_budget > 0
            ? Math.min(
                  100,
                  Math.round((stats.total_actual / stats.total_budget) * 100)
              )
            : 0;

    const paidPercent =
        stats.total_actual > 0
            ? Math.round((stats.total_paid / stats.total_actual) * 100)
            : 0;

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Budget`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Budget"
                    description="Track your wedding expenses and stay on budget"
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link
                                    href={`/weddings/${wedding.id}/budget/categories/create`}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Category
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/weddings/${wedding.id}/budget/items/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Expense
                                </Link>
                            </Button>
                        </div>
                    }
                />

                {/* Budget Overview */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-black p-2">
                                    <Wallet className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {formatCurrency(stats.total_budget)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Budget
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-neutral-100">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-neutral-500 p-2">
                                    <DollarSign className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {formatCurrency(stats.total_actual)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Spent
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-600 p-2">
                                    <TrendingDown className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-green-800">
                                        {formatCurrency(stats.total_paid)}
                                    </p>
                                    <p className="text-xs text-green-700">Total Paid</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`border-0 ${
                            stats.over_budget ? 'bg-red-50' : 'bg-neutral-50'
                        }`}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`rounded-full p-2 ${
                                        stats.over_budget
                                            ? 'bg-red-500'
                                            : 'bg-neutral-400'
                                    }`}
                                >
                                    {stats.over_budget ? (
                                        <TrendingUp className="h-4 w-4 text-white" />
                                    ) : (
                                        <TrendingDown className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <div>
                                    <p
                                        className={`text-2xl font-light ${
                                            stats.over_budget
                                                ? 'text-red-800'
                                                : ''
                                        }`}
                                    >
                                        {formatCurrency(
                                            Math.abs(stats.remaining_budget)
                                        )}
                                    </p>
                                    <p
                                        className={`text-xs ${
                                            stats.over_budget
                                                ? 'text-red-700'
                                                : 'text-muted-foreground'
                                        }`}
                                    >
                                        {stats.over_budget
                                            ? 'Over Budget'
                                            : 'Remaining'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Budget Progress */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Budget Used
                                    </span>
                                    <span className="text-sm font-medium">
                                        {budgetUsedPercent}%
                                    </span>
                                </div>
                                <Progress
                                    value={budgetUsedPercent}
                                    className={`mt-2 h-3 ${
                                        stats.over_budget
                                            ? '[&>div]:bg-red-500'
                                            : ''
                                    }`}
                                />
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {formatCurrency(stats.total_actual)} of{' '}
                                    {formatCurrency(stats.total_budget)}
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Payments Made
                                    </span>
                                    <span className="text-sm font-medium">
                                        {paidPercent}%
                                    </span>
                                </div>
                                <Progress value={paidPercent} className="mt-2 h-3" />
                                <p className="mt-2 text-xs text-muted-foreground">
                                    {formatCurrency(stats.total_paid)} of{' '}
                                    {formatCurrency(stats.total_actual)} spent
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Categories & Items */}
                {categories.length === 0 ? (
                    <EmptyState
                        icon={PieChart}
                        title="No budget categories yet"
                        description="Create categories to organize your wedding expenses."
                        action={
                            <Button asChild>
                                <Link
                                    href={`/weddings/${wedding.id}/budget/categories/create`}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Category
                                </Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {categories.map((category) => {
                            const isExpanded = expandedCategories.includes(
                                category.id
                            );
                            const categoryTotal = category.items.reduce(
                                (sum, item) => sum + (item.actual_cost || 0),
                                0
                            );
                            const categoryEstimate = category.items.reduce(
                                (sum, item) => sum + (item.estimated_cost || 0),
                                0
                            );
                            const categoryPaid = category.items.reduce(
                                (sum, item) => sum + (item.paid_amount || 0),
                                0
                            );
                            const categoryProgress =
                                category.allocated_amount > 0
                                    ? Math.round(
                                          (categoryTotal /
                                              category.allocated_amount) *
                                              100
                                      )
                                    : 0;

                            return (
                                <Card
                                    key={category.id}
                                    className="border-0 shadow-sm"
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={() =>
                                                    toggleCategory(category.id)
                                                }
                                                className="flex items-center gap-2 text-left"
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                                <div>
                                                    <CardTitle className="text-base font-medium">
                                                        {category.name}
                                                    </CardTitle>
                                                    <p className="text-xs text-muted-foreground">
                                                        {category.items.length}{' '}
                                                        item
                                                        {category.items.length !==
                                                        1
                                                            ? 's'
                                                            : ''}
                                                    </p>
                                                </div>
                                            </button>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-medium">
                                                        {formatCurrency(
                                                            categoryTotal
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        of{' '}
                                                        {formatCurrency(
                                                            category.allocated_amount
                                                        )}{' '}
                                                        allocated
                                                    </p>
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
                                                                href={`/weddings/${wedding.id}/budget/categories/${category.id}/edit`}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Edit Category
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={`/weddings/${wedding.id}/budget/items/create?category=${category.id}`}
                                                            >
                                                                <Plus className="mr-2 h-4 w-4" />
                                                                Add Item
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                handleDelete(
                                                                    'category',
                                                                    category.id,
                                                                    category.name
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
                                        </div>
                                        <Progress
                                            value={Math.min(categoryProgress, 100)}
                                            className={`mt-2 h-2 ${
                                                categoryProgress > 100
                                                    ? '[&>div]:bg-red-500'
                                                    : ''
                                            }`}
                                        />
                                    </CardHeader>

                                    {isExpanded && category.items.length > 0 && (
                                        <CardContent className="pt-0">
                                            <div className="mt-4 divide-y">
                                                {category.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex items-center justify-between py-3"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-medium">
                                                                    {item.name}
                                                                </p>
                                                                {item.is_paid && (
                                                                    <Badge className="bg-green-100 text-green-800">
                                                                        Paid
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {item.vendor && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {item.vendor.name}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <div className="text-right">
                                                                <p className="font-medium tabular-nums">
                                                                    {formatCurrency(
                                                                        item.actual_cost ||
                                                                            item.estimated_cost ||
                                                                            0
                                                                    )}
                                                                </p>
                                                                {item.estimated_cost &&
                                                                    item.actual_cost &&
                                                                    item.actual_cost !==
                                                                        item.estimated_cost && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Est:{' '}
                                                                            {formatCurrency(
                                                                                item.estimated_cost
                                                                            )}
                                                                        </p>
                                                                    )}
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
                                                                            href={`/weddings/${wedding.id}/budget/items/${item.id}/edit`}
                                                                        >
                                                                            <Edit className="mr-2 h-4 w-4" />
                                                                            Edit
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                'item',
                                                                                item.id,
                                                                                item.name
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
                                                    </div>
                                                ))}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-4"
                                                asChild
                                            >
                                                <Link
                                                    href={`/weddings/${wedding.id}/budget/items/create?category=${category.id}`}
                                                >
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Item
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    )}

                                    {isExpanded && category.items.length === 0 && (
                                        <CardContent className="pt-0">
                                            <div className="py-6 text-center">
                                                <p className="text-sm text-muted-foreground">
                                                    No items in this category
                                                </p>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2"
                                                    asChild
                                                >
                                                    <Link
                                                        href={`/weddings/${wedding.id}/budget/items/create?category=${category.id}`}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        Add Item
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Delete {itemToDelete?.type === 'category' ? 'Category' : 'Item'}
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{itemToDelete?.name}"?
                            {itemToDelete?.type === 'category' &&
                                ' This will also delete all items in this category.'}
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
