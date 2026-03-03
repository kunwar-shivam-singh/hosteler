
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, query, where, addDoc, deleteDoc } from "firebase/firestore";
import { useFirebase, useMemoFirebase, useCollection } from "@/firebase";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  IndianRupee, 
  Phone, 
  ArrowLeft, 
  Loader2, 
  MessageSquare,
  Star,
  Trash2,
  User
} from "lucide-react";
import Image from "next/image";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, userName } = useAuth();
  const { firestore: db } = useFirebase();
  const { toast } = useToast();
  
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!db || !id) return;
      try {
        const docRef = doc(db, "properties", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProperty({ id: docSnap.id, ...docSnap.data() });
        } else {
          router.push("/tenant/dashboard");
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, router, db]);

  const reviewsQuery = useMemoFirebase(() => {
    if (!db || !id) return null;
    // Removed orderBy to avoid requiring composite indexes
    return query(
      collection(db, "reviews"),
      where("propertyId", "==", id)
    );
  }, [db, id]);

  const { data: reviews, isLoading: reviewsLoading } = useCollection(reviewsQuery);

  // Client-side sort for reviews
  const sortedReviews = useMemo(() => {
    if (!reviews) return [];
    return [...reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
  }, [reviews]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !id) return;

    const hasAlreadyReviewed = reviews?.some(r => r.userId === user.uid);
    if (hasAlreadyReviewed) {
      toast({ variant: "destructive", title: "Review Denied", description: "You have already reviewed this property." });
      return;
    }

    setIsSubmittingReview(true);
    try {
      const reviewData = {
        propertyId: id,
        userId: user.uid,
        userName: userName || "Verified Tenant",
        rating: reviewRating,
        comment: reviewComment,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, "reviews"), reviewData);

      // Denormalize stats on property
      const currentReviewCount = property.reviewCount || 0;
      const currentAvgRating = property.avgRating || 0;
      const newReviewCount = currentReviewCount + 1;
      const newAvgRating = ((currentAvgRating * currentReviewCount) + reviewRating) / newReviewCount;

      const propertyRef = doc(db, "properties", id as string);
      updateDocumentNonBlocking(propertyRef, {
        avgRating: newAvgRating,
        reviewCount: newReviewCount
      });

      setProperty(prev => ({ ...prev, avgRating: newAvgRating, reviewCount: newReviewCount }));
      setReviewComment("");
      toast({ title: "Review Posted!", description: "Thank you for sharing your experience." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Post Failed", description: error.message });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const deleteReview = async (reviewId: string, rating: number) => {
    if (!db || !id || !confirm("Delete your review?")) return;

    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      
      const currentReviewCount = property.reviewCount || 1;
      const currentAvgRating = property.avgRating || 0;
      const newReviewCount = Math.max(0, currentReviewCount - 1);
      const newAvgRating = newReviewCount === 0 ? 0 : ((currentAvgRating * currentReviewCount) - rating) / newReviewCount;

      const propertyRef = doc(db, "properties", id as string);
      updateDocumentNonBlocking(propertyRef, {
        avgRating: newAvgRating,
        reviewCount: newReviewCount
      });

      setProperty(prev => ({ ...prev, avgRating: newAvgRating, reviewCount: newReviewCount }));
      toast({ title: "Review Removed" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Delete Failed", description: error.message });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) return null;

  const whatsappLink = `https://wa.me/${property.contactNumber?.replace(/\D/g, "")}?text=Hi, I am interested in your PG listing: ${property.pgName} found on PG Locator.`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <Button variant="ghost" className="rounded-xl" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-3xl overflow-hidden shadow-lg border bg-white">
        <div className="relative aspect-video md:aspect-square">
          <Image 
            src={property.images?.[0] || "https://picsum.photos/seed/p1/800/800"} 
            alt={property.pgName} 
            fill 
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 p-2 hidden md:grid">
          {property.images?.slice(1, 5).map((img: string, i: number) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
              <Image src={img} alt="Property" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold font-headline">{property.pgName}</h1>
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 mr-1 text-primary" />
                  {property.area}, {property.city}
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold mt-2">
                  <Star className="h-4 w-4 fill-amber-500" />
                  {property.avgRating ? property.avgRating.toFixed(1) : "No ratings yet"}
                  <span className="text-muted-foreground text-xs font-normal ml-1">({property.reviewCount || 0} reviews)</span>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-lg px-4 py-1">
                ₹{property.rent} <span className="text-xs ml-1 font-normal opacity-70">/ mo</span>
              </Badge>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
            <h2 className="text-xl font-bold font-headline">About this Stay</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
            <h2 className="text-xl font-bold font-headline">Reviews</h2>
            
            {user && !reviews?.some(r => r.userId === user.uid) && (
              <form onSubmit={handleReviewSubmit} className="space-y-4 p-4 bg-muted/20 rounded-2xl border border-dashed">
                <p className="text-sm font-bold">Write a review</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className={`h-6 w-6 ${star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Tell others about your experience..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="rounded-xl"
                  required
                />
                <Button type="submit" className="w-full rounded-xl" disabled={isSubmittingReview}>
                  {isSubmittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
                </Button>
              </form>
            )}

            <div className="space-y-4">
              {reviewsLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto" />
              ) : sortedReviews.length > 0 ? (
                sortedReviews.map((review: any) => (
                  <div key={review.id} className="p-4 rounded-2xl border bg-muted/5 space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full"><User className="h-4 w-4 text-primary" /></div>
                        <div>
                          <p className="text-sm font-bold">{review.userName}</p>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`h-3 w-3 ${s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{review.comment}"</p>
                    {review.userId === user?.uid && (
                      <button 
                        onClick={() => deleteReview(review.id, review.rating)}
                        className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground text-sm italic py-8">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-primary/10 sticky top-24 space-y-6">
            <h2 className="text-xl font-bold font-headline">Contact Owner</h2>
            <div className="space-y-3">
              <Button asChild className="w-full h-14 text-lg font-bold rounded-2xl bg-primary">
                <a href={`tel:${property.contactNumber}`}>
                  <Phone className="mr-2 h-5 w-5" /> Call Now
                </a>
              </Button>
              <Button asChild className="w-full h-14 text-lg font-bold rounded-2xl bg-[#25D366] border-none text-white">
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
