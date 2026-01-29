import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { Check, Clock, Edit, Mail, MoreHorizontal, Plus, Send, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import WeddingLayout from '@/layouts/wedding-layout';
import type { BreadcrumbItem, Guest, Invitation, Wedding } from '@/types';

interface Props {
    wedding: Wedding;
    invitations: (Invitation & { guest?: Guest })[];
    stats: { total: number; sent: number; opened: number; responded: number };
}

export default function InvitationsIndex({ wedding, invitations, stats }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Weddings', href: '/weddings' },
        { title: wedding.title, href: `/weddings/${wedding.id}/dashboard` },
        { title: 'Invitations', href: `/weddings/${wedding.id}/invitations` },
    ];

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [invitationToDelete, setInvitationToDelete] = useState<Invitation | null>(null);

    const handleDelete = (invitation: Invitation) => {
        setInvitationToDelete(invitation);
        setShowDeleteDialog(true);
    };

    const confirmDelete = () => {
        if (invitationToDelete) {
            router.delete(`/weddings/${wedding.id}/invitations/${invitationToDelete.id}`);
        }
        setShowDeleteDialog(false);
        setInvitationToDelete(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'sent': return <Badge className="bg-blue-100 text-blue-800"><Send className="mr-1 h-3 w-3" />Sent</Badge>;
            case 'opened': return <Badge className="bg-purple-100 text-purple-800"><Mail className="mr-1 h-3 w-3" />Opened</Badge>;
            case 'responded': return <Badge className="bg-green-100 text-green-800"><Check className="mr-1 h-3 w-3" />Responded</Badge>;
            default: return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Draft</Badge>;
        }
    };

    const sentPercentage = stats.total > 0 ? Math.round((stats.sent / stats.total) * 100) : 0;
    const respondedPercentage = stats.sent > 0 ? Math.round((stats.responded / stats.sent) * 100) : 0;

    return (
        <WeddingLayout breadcrumbs={breadcrumbs} wedding={wedding}>
            <Head title={`${wedding.title} - Invitations`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <PageHeader
                    title="Invitations"
                    description="Track and manage your wedding invitations"
                    actions={
                        <div className="flex gap-2">
                            <Button variant="outline" asChild><Link href={`/weddings/${wedding.id}/invitations/send`}><Send className="mr-2 h-4 w-4" />Send Invitations</Link></Button>
                            <Button asChild><Link href={`/weddings/${wedding.id}/invitations/create`}><Plus className="mr-2 h-4 w-4" />Create Invitation</Link></Button>
                        </div>
                    }
                />

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-neutral-50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-black p-2"><Mail className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></div></div></CardContent></Card>
                    <Card className="border-0 bg-blue-50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-blue-600 p-2"><Send className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light text-blue-800">{stats.sent}</p><p className="text-xs text-blue-700">Sent</p></div></div></CardContent></Card>
                    <Card className="border-0 bg-purple-50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-purple-600 p-2"><Mail className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light text-purple-800">{stats.opened}</p><p className="text-xs text-purple-700">Opened</p></div></div></CardContent></Card>
                    <Card className="border-0 bg-green-50"><CardContent className="p-4"><div className="flex items-center gap-3"><div className="rounded-full bg-green-600 p-2"><Check className="h-4 w-4 text-white" /></div><div><p className="text-2xl font-light text-green-800">{stats.responded}</p><p className="text-xs text-green-700">Responded</p></div></div></CardContent></Card>
                </div>

                {/* Progress */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Sent</span><span className="text-sm font-medium">{sentPercentage}%</span></div>
                                <Progress value={sentPercentage} className="mt-2 h-2" />
                                <p className="mt-2 text-xs text-muted-foreground">{stats.sent} of {stats.total} invitations sent</p>
                            </div>
                            <div>
                                <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Response Rate</span><span className="text-sm font-medium">{respondedPercentage}%</span></div>
                                <Progress value={respondedPercentage} className="mt-2 h-2" />
                                <p className="mt-2 text-xs text-muted-foreground">{stats.responded} of {stats.sent} responded</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {invitations.length === 0 ? (
                    <EmptyState
                        icon={Mail}
                        title="No invitations yet"
                        description="Create invitations for your wedding guests."
                        action={<Button asChild><Link href={`/weddings/${wedding.id}/invitations/create`}><Plus className="mr-2 h-4 w-4" />Create Invitation</Link></Button>}
                    />
                ) : (
                    <Card className="border-0 shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Sent</TableHead>
                                    <TableHead>Responded</TableHead>
                                    <TableHead className="w-12"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invitations.map((invitation) => (
                                    <TableRow key={invitation.id}>
                                        <TableCell>
                                            <p className="font-medium">{invitation.guest?.full_name || 'Unknown Guest'}</p>
                                            {invitation.guest?.email && <p className="text-xs text-muted-foreground">{invitation.guest.email}</p>}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                                        <TableCell>{invitation.sent_at ? format(new Date(invitation.sent_at), 'MMM d, yyyy') : '—'}</TableCell>
                                        <TableCell>{invitation.responded_at ? format(new Date(invitation.responded_at), 'MMM d, yyyy') : '—'}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild><Link href={`/weddings/${wedding.id}/invitations/${invitation.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleDelete(invitation)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Invitation</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this invitation? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </WeddingLayout>
    );
}
