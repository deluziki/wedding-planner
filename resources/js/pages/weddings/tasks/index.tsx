import { Head, Link, router } from '@inertiajs/react';
import { format, isPast, isToday, isTomorrow, addDays } from 'date-fns';
import {
    Calendar,
    Check,
    CheckCircle2,
    ChevronDown,
    Circle,
    Clock,
    Filter,
    ListTodo,
    MoreHorizontal,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Task, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    tasks: Task[];
    filters: {
        search?: string;
        status?: string;
        priority?: string;
        category?: string;
    };
    stats: {
        total: number;
        completed: number;
        pending: number;
        overdue: number;
    };
    categories: string[];
}

export default function TasksIndex({
    wedding,
    tasks,
    filters,
    stats,
    categories,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Tasks', href: `/weddings/${wedding.id}/tasks` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [searchValue, setSearchValue] = useState(filters.search || '');

    const handleSearch = (value: string) => {
        setSearchValue(value);
        router.get(
            `/weddings/${wedding.id}/tasks`,
            { ...filters, search: value || undefined },
            { preserveState: true, replace: true }
        );
    };

    const handleFilterChange = (key: string, value: string | undefined) => {
        router.get(
            `/weddings/${wedding.id}/tasks`,
            { ...filters, [key]: value === 'all' ? undefined : value },
            { preserveState: true, replace: true }
        );
    };

    const toggleTaskStatus = (task: Task) => {
        router.patch(`/weddings/${wedding.id}/tasks/${task.id}/toggle`, {}, {
            preserveState: true,
        });
    };

    const handleDelete = (task: Task) => {
        setTaskToDelete(task);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (taskToDelete) {
            router.delete(`/weddings/${wedding.id}/tasks/${taskToDelete.id}`);
        }
        setShowDeleteDialog(false);
        setTaskToDelete(null);
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <Badge className="bg-red-100 text-red-800">High</Badge>;
            case 'medium':
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                );
            case 'low':
                return <Badge className="bg-green-100 text-green-800">Low</Badge>;
            default:
                return <Badge variant="secondary">Normal</Badge>;
        }
    };

    const getDueDateLabel = (dueDate: string) => {
        const date = new Date(dueDate);
        if (isPast(date) && !isToday(date)) {
            return (
                <span className="text-red-600">
                    Overdue - {format(date, 'MMM d')}
                </span>
            );
        }
        if (isToday(date)) {
            return <span className="font-medium text-yellow-600">Today</span>;
        }
        if (isTomorrow(date)) {
            return <span className="text-yellow-600">Tomorrow</span>;
        }
        return format(date, 'MMM d, yyyy');
    };

    const completionPercentage =
        stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    // Group tasks by category
    const tasksByCategory = tasks.reduce(
        (acc, task) => {
            const category = task.category || 'Uncategorized';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(task);
            return acc;
        },
        {} as Record<string, Task[]>
    );

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Tasks`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Tasks"
                    description="Manage your wedding planning checklist"
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild>
                                <Link
                                    href={`/weddings/${wedding.id}/tasks/generate`}
                                >
                                    Generate Default Tasks
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href={`/weddings/${wedding.id}/tasks/create`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Task
                                </Link>
                            </Button>
                        </div>
                    }
                />

                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-neutral-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-black p-2">
                                    <ListTodo className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {stats.total}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Tasks
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-green-600 p-2">
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-green-800">
                                        {stats.completed}
                                    </p>
                                    <p className="text-xs text-green-700">
                                        Completed
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-neutral-100">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-neutral-500 p-2">
                                    <Circle className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light">
                                        {stats.pending}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Pending
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-red-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-red-500 p-2">
                                    <Clock className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-light text-red-800">
                                        {stats.overdue}
                                    </p>
                                    <p className="text-xs text-red-700">Overdue</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                Overall Progress
                            </span>
                            <span className="text-sm font-medium">
                                {completionPercentage}%
                            </span>
                        </div>
                        <Progress value={completionPercentage} className="mt-2 h-2" />
                        <p className="mt-2 text-xs text-muted-foreground">
                            {stats.completed} of {stats.total} tasks completed
                        </p>
                    </CardContent>
                </Card>

                {/* Filters */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search tasks..."
                                    value={searchValue}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={(value) =>
                                        handleFilterChange('status', value)
                                    }
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">
                                            Completed
                                        </SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={filters.priority || 'all'}
                                    onValueChange={(value) =>
                                        handleFilterChange('priority', value)
                                    }
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priority</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                                {categories.length > 0 && (
                                    <Select
                                        value={filters.category || 'all'}
                                        onValueChange={(value) =>
                                            handleFilterChange('category', value)
                                        }
                                    >
                                        <SelectTrigger className="w-[150px]">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                All Categories
                                            </SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Task List */}
                {tasks.length === 0 ? (
                    <EmptyState
                        icon={ListTodo}
                        title="No tasks yet"
                        description="Start planning by adding tasks or generate a default checklist."
                        action={
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <Link
                                        href={`/weddings/${wedding.id}/tasks/generate`}
                                    >
                                        Generate Default Tasks
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link
                                        href={`/weddings/${wedding.id}/tasks/create`}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Task
                                    </Link>
                                </Button>
                            </div>
                        }
                    />
                ) : (
                    <div className="space-y-6">
                        {Object.entries(tasksByCategory).map(
                            ([category, categoryTasks]) => (
                                <Card key={category} className="border-0 shadow-sm">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center justify-between text-base font-medium">
                                            <span>{category}</span>
                                            <Badge variant="secondary">
                                                {
                                                    categoryTasks.filter(
                                                        (t) => t.is_completed
                                                    ).length
                                                }
                                                /{categoryTasks.length}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="divide-y">
                                            {categoryTasks.map((task) => (
                                                <div
                                                    key={task.id}
                                                    className={`flex items-start gap-3 py-3 ${
                                                        task.is_completed
                                                            ? 'opacity-60'
                                                            : ''
                                                    }`}
                                                >
                                                    <Checkbox
                                                        checked={task.is_completed}
                                                        onCheckedChange={() =>
                                                            toggleTaskStatus(task)
                                                        }
                                                        className="mt-1"
                                                    />
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <p
                                                                    className={`font-medium ${
                                                                        task.is_completed
                                                                            ? 'line-through'
                                                                            : ''
                                                                    }`}
                                                                >
                                                                    {task.title}
                                                                </p>
                                                                {task.description && (
                                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                                        {task.description}
                                                                    </p>
                                                                )}
                                                                <div className="mt-2 flex items-center gap-2">
                                                                    {getPriorityBadge(
                                                                        task.priority
                                                                    )}
                                                                    {task.due_date && (
                                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                            <Calendar className="h-3 w-3" />
                                                                            {getDueDateLabel(
                                                                                task.due_date
                                                                            )}
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
                                                                            href={`/weddings/${wedding.id}/tasks/${task.id}/edit`}
                                                                        >
                                                                            Edit
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                task
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
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{taskToDelete?.title}"?
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
