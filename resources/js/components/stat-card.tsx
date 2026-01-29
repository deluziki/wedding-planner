import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    className?: string;
}

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    className,
}: StatCardProps) {
    return (
        <Card className={cn('border-0 shadow-none', className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {title}
                        </p>
                        <p className="mt-2 text-3xl font-light tracking-tight">
                            {value}
                        </p>
                        {subtitle && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                    </div>
                    {Icon && (
                        <div className="rounded-full bg-muted p-3">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
