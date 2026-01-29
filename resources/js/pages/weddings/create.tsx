import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Weddings', href: '/weddings' },
    { title: 'New Wedding', href: '/weddings/create' },
];

export default function CreateWedding() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        bride_name: '',
        groom_name: '',
        wedding_date: '',
        ceremony_time: '',
        reception_time: '',
        wedding_style: '',
        color_scheme: '',
        theme_description: '',
        total_budget: '',
        currency: 'USD',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/weddings');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Wedding" />

            <div className="flex h-full flex-1 flex-col gap-8 p-6">
                <PageHeader
                    title="Create New Wedding"
                    description="Start planning your perfect day"
                />

                <div className="mx-auto w-full max-w-2xl">
                    <form onSubmit={handleSubmit}>
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle className="font-serif text-xl font-light">
                                    Wedding Details
                                </CardTitle>
                                <CardDescription>
                                    Enter the basic information about your wedding
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="bride_name">
                                            Bride's Name
                                        </Label>
                                        <Input
                                            id="bride_name"
                                            value={data.bride_name}
                                            onChange={(e) =>
                                                setData('bride_name', e.target.value)
                                            }
                                            placeholder="Enter bride's name"
                                            required
                                        />
                                        {errors.bride_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.bride_name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="groom_name">
                                            Groom's Name
                                        </Label>
                                        <Input
                                            id="groom_name"
                                            value={data.groom_name}
                                            onChange={(e) =>
                                                setData('groom_name', e.target.value)
                                            }
                                            placeholder="Enter groom's name"
                                            required
                                        />
                                        {errors.groom_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.groom_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Wedding Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData('title', e.target.value)
                                        }
                                        placeholder="e.g., The Smith Wedding"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-6 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="wedding_date">
                                            Wedding Date
                                        </Label>
                                        <Input
                                            id="wedding_date"
                                            type="date"
                                            value={data.wedding_date}
                                            onChange={(e) =>
                                                setData('wedding_date', e.target.value)
                                            }
                                        />
                                        {errors.wedding_date && (
                                            <p className="text-sm text-destructive">
                                                {errors.wedding_date}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="ceremony_time">
                                            Ceremony Time
                                        </Label>
                                        <Input
                                            id="ceremony_time"
                                            type="time"
                                            value={data.ceremony_time}
                                            onChange={(e) =>
                                                setData('ceremony_time', e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reception_time">
                                            Reception Time
                                        </Label>
                                        <Input
                                            id="reception_time"
                                            type="time"
                                            value={data.reception_time}
                                            onChange={(e) =>
                                                setData('reception_time', e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="wedding_style">Style</Label>
                                        <Input
                                            id="wedding_style"
                                            value={data.wedding_style}
                                            onChange={(e) =>
                                                setData('wedding_style', e.target.value)
                                            }
                                            placeholder="e.g., Modern, Rustic, Beach"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="color_scheme">
                                            Color Scheme
                                        </Label>
                                        <Input
                                            id="color_scheme"
                                            value={data.color_scheme}
                                            onChange={(e) =>
                                                setData('color_scheme', e.target.value)
                                            }
                                            placeholder="e.g., Black & White, Blush & Gold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="theme_description">
                                        Theme Description
                                    </Label>
                                    <Textarea
                                        id="theme_description"
                                        value={data.theme_description}
                                        onChange={(e) =>
                                            setData(
                                                'theme_description',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Describe your wedding vision..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="total_budget">
                                            Total Budget
                                        </Label>
                                        <Input
                                            id="total_budget"
                                            type="number"
                                            min="0"
                                            step="100"
                                            value={data.total_budget}
                                            onChange={(e) =>
                                                setData('total_budget', e.target.value)
                                            }
                                            placeholder="Enter your budget"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency">Currency</Label>
                                        <Input
                                            id="currency"
                                            value={data.currency}
                                            onChange={(e) =>
                                                setData('currency', e.target.value)
                                            }
                                            placeholder="USD"
                                            maxLength={3}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4 pt-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/weddings">Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Create Wedding
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
