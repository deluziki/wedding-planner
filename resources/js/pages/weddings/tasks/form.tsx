import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { BreadcrumbItem, Task, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    task?: Task;
    categories: string[];
}

export default function TaskForm({ wedding, task, categories }: Props) {
    const isEditing = !!task;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Tasks', href: `/weddings/${wedding.id}/tasks` },
        {
            title: isEditing ? 'Edit Task' : 'Add Task',
            href: isEditing
                ? `/weddings/${wedding.id}/tasks/${task.id}/edit`
                : `/weddings/${wedding.id}/tasks/create`,
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        title: task?.title || '',
        description: task?.description || '',
        category: task?.category || '',
        priority: task?.priority || 'medium',
        due_date: task?.due_date || '',
        reminder_date: task?.reminder_date || '',
        is_completed: task?.is_completed || false,
        assigned_to: task?.assigned_to || '',
        notes: task?.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/tasks/${task.id}`);
        } else {
            post(`/weddings/${wedding.id}/tasks`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Task`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/weddings/${wedding.id}/tasks`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <PageHeader
                        title={isEditing ? `Edit Task` : 'Add Task'}
                        description={
                            isEditing
                                ? 'Update task details'
                                : 'Add a new task to your checklist'
                        }
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Task Details */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Task Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Task Title *</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g., Book photographer"
                                />
                                {errors.title && (
                                    <p className="text-sm text-destructive">
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Add more details about this task..."
                                    rows={3}
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Input
                                        id="category"
                                        value={data.category}
                                        onChange={(e) =>
                                            setData('category', e.target.value)
                                        }
                                        placeholder="e.g., Venue, Photography"
                                        list="category-suggestions"
                                    />
                                    <datalist id="category-suggestions">
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(value) =>
                                            setData('priority', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high">High</SelectItem>
                                            <SelectItem value="medium">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="low">Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dates */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Dates
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) =>
                                            setData('due_date', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="reminder_date">Reminder Date</Label>
                                    <Input
                                        id="reminder_date"
                                        type="date"
                                        value={data.reminder_date}
                                        onChange={(e) =>
                                            setData('reminder_date', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assignment */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Assignment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="assigned_to">Assigned To</Label>
                                <Input
                                    id="assigned_to"
                                    value={data.assigned_to}
                                    onChange={(e) =>
                                        setData('assigned_to', e.target.value)
                                    }
                                    placeholder="Person responsible for this task"
                                />
                            </div>

                            {isEditing && (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="is_completed"
                                        checked={data.is_completed}
                                        onCheckedChange={(checked) =>
                                            setData('is_completed', !!checked)
                                        }
                                    />
                                    <Label
                                        htmlFor="is_completed"
                                        className="font-normal"
                                    >
                                        Mark as completed
                                    </Label>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Notes */}
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Any additional notes..."
                                rows={3}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/weddings/${wedding.id}/tasks`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? isEditing
                                    ? 'Saving...'
                                    : 'Creating...'
                                : isEditing
                                  ? 'Save Changes'
                                  : 'Add Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
