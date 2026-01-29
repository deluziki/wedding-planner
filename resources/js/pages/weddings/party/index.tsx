import { Head, Link, router } from '@inertiajs/react';
import { Edit, Mail, MoreHorizontal, Phone, Plus, Trash2, User, Users } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Wedding, WeddingPartyMember } from '@/types';

interface Props {
    wedding: Wedding;
    members: WeddingPartyMember[];
}

export default function PartyIndex({ wedding, members }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Wedding Party', href: `/weddings/${wedding.id}/party` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<WeddingPartyMember | null>(null);

    const handleDelete = (member: WeddingPartyMember) => {
        setMemberToDelete(member);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (memberToDelete) {
            router.delete(`/weddings/${wedding.id}/party/${memberToDelete.id}`);
        }
        setShowDeleteDialog(false);
        setMemberToDelete(null);
    };

    const bridesSide = members.filter((m) => m.side === 'bride');
    const groomsSide = members.filter((m) => m.side === 'groom');

    const getRoleBadge = (role: string) => {
        const colors: Record<string, string> = {
            'maid_of_honor': 'bg-pink-100 text-pink-800',
            'best_man': 'bg-blue-100 text-blue-800',
            'bridesmaid': 'bg-pink-50 text-pink-700',
            'groomsman': 'bg-blue-50 text-blue-700',
            'flower_girl': 'bg-purple-100 text-purple-800',
            'ring_bearer': 'bg-green-100 text-green-800',
            'usher': 'bg-neutral-100 text-neutral-800',
        };
        return colors[role] || 'bg-neutral-100 text-neutral-800';
    };

    const formatRole = (role: string) => {
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const renderMemberCard = (member: WeddingPartyMember) => (
        <Card key={member.id} className="border-0 shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={member.photo} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-medium">{member.name}</p>
                                <Badge className={`mt-1 ${getRoleBadge(member.role)}`}>{formatRole(member.role)}</Badge>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild><Link href={`/weddings/${wedding.id}/party/${member.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleDelete(member)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                            {member.email && (
                                <a href={`mailto:${member.email}`} className="flex items-center gap-1 hover:text-foreground">
                                    <Mail className="h-3 w-3" />{member.email}
                                </a>
                            )}
                            {member.phone && (
                                <a href={`tel:${member.phone}`} className="flex items-center gap-1 hover:text-foreground">
                                    <Phone className="h-3 w-3" />{member.phone}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Wedding Party`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Wedding Party"
                    description="Manage your bridesmaids, groomsmen, and other party members"
                    actions={
                        <Button asChild>
                            <Link href={`/weddings/${wedding.id}/party/create`}><Plus className="mr-2 h-4 w-4" />Add Member</Link>
                        </Button>
                    }
                />

                {members.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title="No wedding party members yet"
                        description="Add your bridesmaids, groomsmen, and other wedding party members."
                        action={<Button asChild><Link href={`/weddings/${wedding.id}/party/create`}><Plus className="mr-2 h-4 w-4" />Add Member</Link></Button>}
                    />
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                            <h2 className="flex items-center gap-2 text-lg font-medium">
                                <span className="inline-block h-3 w-3 rounded-full bg-pink-400" />
                                Bride's Side ({bridesSide.length})
                            </h2>
                            {bridesSide.length === 0 ? (
                                <Card className="border-0 shadow-sm"><CardContent className="py-8 text-center text-muted-foreground">No members added yet</CardContent></Card>
                            ) : (
                                <div className="space-y-3">{bridesSide.map(renderMemberCard)}</div>
                            )}
                        </div>
                        <div className="space-y-4">
                            <h2 className="flex items-center gap-2 text-lg font-medium">
                                <span className="inline-block h-3 w-3 rounded-full bg-blue-400" />
                                Groom's Side ({groomsSide.length})
                            </h2>
                            {groomsSide.length === 0 ? (
                                <Card className="border-0 shadow-sm"><CardContent className="py-8 text-center text-muted-foreground">No members added yet</CardContent></Card>
                            ) : (
                                <div className="space-y-3">{groomsSide.map(renderMemberCard)}</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Member</DialogTitle>
                        <DialogDescription>Are you sure you want to remove {memberToDelete?.name} from the wedding party?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Remove</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </WeddingLayout>
    );
}
