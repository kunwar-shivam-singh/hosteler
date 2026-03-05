
"use client";

import { useState, useEffect } from "react";
import { collection, query, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Loader2, User, Mail, Phone, Calendar, UserCheck, AlertTriangle, 
  Trash2, ShieldAlert, ShieldCheck, Ban, UserMinus 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const db = useFirestore();
  const { role, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (db && role === "admin") {
      fetchUsers();
    }
  }, [db, role]);

  const fetchUsers = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      results.sort((a: any, b: any) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      
      setUsers(results);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Fetch Failed", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockStatus = async (userId: string, currentStatus: string) => {
    if (!db) return;
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    try {
      await updateDoc(doc(db, "users", userId), { status: newStatus });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      toast({ title: `User ${newStatus}`, description: `Account has been ${newStatus}.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const deleteUserRecord = async (userId: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast({ title: "User Deleted", description: "Record removed from database." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: error.message });
    }
  };

  const getRoleBadge = (userRole: string) => {
    switch (userRole) {
      case "admin": return <Badge className="bg-red-100 text-red-700 border-none px-3 font-bold">ADMIN</Badge>;
      case "owner": return <Badge className="bg-green-100 text-green-700 border-none px-3 font-bold">OWNER</Badge>;
      default: return <Badge className="bg-blue-100 text-blue-700 border-none px-3 font-bold">TENANT</Badge>;
    }
  };

  if (authLoading) return <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  if (role !== "admin") return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="text-2xl font-bold">Unauthorized</h2>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-headline">User Ops</h1>
        <p className="text-muted-foreground">Global directory and account moderation.</p>
      </div>

      <Card className="rounded-[2.5rem] border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Registered Directory
          </CardTitle>
          <CardDescription>Manage {users.length} unique profiles.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="p-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground">User Profile</th>
                    <th className="p-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Role</th>
                    <th className="p-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Status</th>
                    <th className="p-6 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-primary/10 p-2.5 rounded-2xl">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-base">{u.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">{getRoleBadge(u.role)}</td>
                      <td className="p-6">
                        <Badge className={`rounded-lg px-3 py-1 border-none font-bold ${
                          u.status === 'blocked' ? 'bg-red-500 text-white' : 'bg-green-100 text-green-700'
                        }`}>
                          {u.status === 'blocked' ? 'BLOCKED' : 'ACTIVE'}
                        </Badge>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleBlockStatus(u.id, u.status)}
                            title={u.status === 'blocked' ? "Unblock User" : "Block User"}
                            className={`rounded-xl ${u.status === 'blocked' ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                          >
                            {u.status === 'blocked' ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-xl">
                                <UserMinus className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl border-none">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User Record?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove their profile from the database. Note: This does not delete their authentication account.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteUserRecord(u.id)} className="bg-destructive hover:bg-destructive/90 rounded-xl">
                                  Confirm Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
