
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useFirebase, useMemoFirebase, useCollection } from "@/firebase";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Loader2, Home, User, Calendar } from "lucide-react";

export default function OwnerReviewsPage() {
  const { user } = useAuth();
  const { firestore: db } = useFirebase();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyProperties = async () => {
      if (!db || !user) return;
      try {
        const q = query(collection(db, "properties"), where("ownerId", "==", user.uid));
        const snap = await getDocs(q);
        setProperties(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMyProperties();
  }, [db, user]);

  const propertyIds = properties.map(p => p.id);
  
  const reviewsQuery = useMemoFirebase(() => {
    if (!db || propertyIds.length === 0) return null;
    // Removed orderBy to avoid requiring composite indexes
    return query(
      collection(db, "reviews"),
      where("propertyId", "in", propertyIds)
    );
  }, [db, propertyIds.length]);

  const { data: reviews, isLoading: reviewsLoading } = useCollection(reviewsQuery);

  // Client-side sort
  const sortedReviews = useMemo(() => {
    if (!reviews) return [];
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [reviews]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold font-headline">Tenant Feedback</h1>
        <p className="text-muted-foreground">Reviews and ratings for all your listed properties.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reviewsLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : sortedReviews.length > 0 ? (
          sortedReviews.map((review: any) => {
            const prop = properties.find(p => p.id === review.propertyId);
            return (
              <Card key={review.id} className="rounded-[2rem] border-none shadow-sm overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-full"><User className="h-5 w-5 text-primary" /></div>
                          <div>
                            <p className="font-bold">{review.userName}</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="rounded-xl border-primary/20 text-primary bg-primary/5 flex gap-1">
                           <Home className="h-3 w-3" /> {prop?.pgName || "Property"}
                        </Badge>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-2xl border">
                        <p className="text-sm italic text-muted-foreground">"{review.comment}"</p>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                        <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}</div>
                        <div className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> Rating: {review.rating}/5</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed">
             <Star className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
             <p className="text-muted-foreground font-bold">No reviews yet for your properties.</p>
          </div>
        )}
      </div>
    </div>
  );
}
