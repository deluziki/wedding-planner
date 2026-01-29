import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, BudgetCategory, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    category?: BudgetCategory;
}

export default function BudgetCategoryForm({ wedding, category }: Props) {
    const isEditing = !!category;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Budget', href: `/weddings/${wedding.id}/budget` },
        {
            title: isEditing ? 'Edit Category' : 'Add Category',
            href: isEditing
                ? `/weddings/${wedding.id}/budget/categories/${category.id}/edit`
                : `/weddings/${wedding.id}/budget/categories/create`,
        },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name || '',
        allocated_amount: category?.allocated_amount?.toString() || '',
        description: category?.description || '',
        sort_order: category?.sort_order?.toString() || '0',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/weddings/${wedding.id}/budget/categories/${category.id}`);
        } else {
            post(`/weddings/${wedding.id}/budget/categories`);
        }
    };

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head
                title={`${wedding.title} - ${isEditing ? 'Edit' : 'Add'} Budget Category`}
            />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/weddings/${wedding.id}/budget`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <PageHeader
                        title={isEditing ? `Edit ${category.name}` : 'Add Category'}
                        description={
                            isEditing
                                ? 'Update budget category details'
                                : 'Create a new budget category'
                        }
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-0 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">
                                Category Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="e.g., Venue, Catering, Photography"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="allocated_amount">
                                        Allocated Budget
                                    </Label>
                                    <Input
                                        id="allocated_amount"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.allocated_amount}
                                        onChange={(e) =>
                                            setData('allocated_amount', e.target.value)
                                        }
                                        placeholder="0.00"
                                    />
                                    {errors.allocated_amount && (
                                        <p className="text-sm text-destructive">
                                            {errors.allocated_amount}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    placeholder="Optional description for this category"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sort_order">Display Order</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min="0"
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData('sort_order', e.target.value)
                                    }
                                    className="w-24"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lower numbers appear first
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/weddings/${wedding.id}/budget`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? isEditing
                                    ? 'Saving...'
                                    : 'Creating...'
                                : isEditing
                                  ? 'Save Changes'
                                  : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </div>
        </WeddingLayout>
    );
}
