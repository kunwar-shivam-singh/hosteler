
"use client";

import { useState } from "react";
import { collection, query, orderBy, doc, deleteDoc, getDoc } from "firebase/firestore";
import { useFirebase, useMemoFirebase, useCollection } from "@/firebase";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, Trash2, Loader2, ShieldAlert, User, Home, Calendar } from "lucide-react";

export default function AdminReviewsPage() {
  const { firestore: db } = useFirebase();
  const { toast } = useToast();
  
  const reviewsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "reviews"), orderBy("createdAt", "desc"));
  }, [db]);

  const { data: reviews, isLoading } = useCollection(reviewsQuery);

  const handleDelete = async (review: any) => {
    if (!db || !confirm("Delete this review permanently?")) return;

    try {
      await deleteDoc(doc(db, "reviews", review.id));

      // Attempt to fix property stats
      const propRef = doc(db, "properties", review.propertyId);
      const propSnap = await getDoc(propRef);
      
      if (propSnap.exists()) {
        const propData = propSnap.data();
        const currentReviewCount = propData.reviewCount || 1;
        const currentAvgRating = propData.avgRating || 0;
        
        const newReviewCount = Math.max(0, currentReviewCount - 1);
        const newAvgRating = newReviewCount === 0 ? 0 : ((currentAvgRating * currentReviewCount) - review.rating) / newReviewCount;
        
        updateDocumentNonBlocking(propRef, {
          avgRating: newAvgRating,
          reviewCount: newReviewCount
        });
      }

      toast({ title: "Review Deleted", description: "Property statistics updated." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Action Failed", description: error.message });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-headline">Review Moderation</h1>
        <p className="text-muted-foreground">Monitor and manage tenant feedback across the platform.</p>
      </div>

      <Card className="rounded-[2rem] border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Global Reviews
          </CardTitle>
          <CardDescription>Total reviews: {reviews?.length || 0}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : reviews && reviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/30 border-b">
                  <tr>
                    <th className="p-4 font-bold">Reviewer</th>
                    <th className="p-4 font-bold">Listing</th>
                    <th className="p-4 font-bold">Rating</th>
                    <th className="p-4 font-bold">Comment</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="font-bold">{review.userName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-xs font-medium text-primary">
                          <Home className="h-3 w-3" />
                          {review.propertyId.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="max-w-xs truncate italic text-muted-foreground">"{review.comment}"</p>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-xl" onClick={() => handleDelete(review)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center text-muted-foreground italic">No reviews recorded yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
