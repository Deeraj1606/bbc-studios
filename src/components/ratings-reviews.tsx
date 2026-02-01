"use client";

import { Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface RatingsReviewsProps {
    contentId: string;
}

interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    helpful: number;
    timestamp: number;
    liked?: boolean;
}

export function RatingsReviews({ contentId }: RatingsReviewsProps) {
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState("");
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [contentId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/reviews?contentId=${contentId}`);
            if (response.ok) {
                const data = await response.json();
                setReviews(data);

                // Find if the current user has already rated
                const myReview = data.find((r: any) => r.user === "You");
                if (myReview) {
                    setUserRating(myReview.rating);
                }
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveRating = async (rating: number) => {
        setUserRating(rating);
        // Automatically save rating to server even without a comment
        // This ensures the video "gets rated" instantly
        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentId,
                    rating,
                    comment: '', // Explicitly empty comment for "rating only"
                    user: 'You'
                }),
            });
            if (response.ok) {
                fetchReviews(); // Refresh list to update average
            }
        } catch (error) {
            console.error("Failed to save rating:", error);
        }
    };

    const submitReview = async () => {
        if (!newReview.trim() || userRating === 0) return;

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contentId,
                    rating: userRating,
                    comment: newReview,
                    user: 'You'
                }),
            });

            if (response.ok) {
                setNewReview("");
                setShowReviewForm(false);
                fetchReviews();
            }
        } catch (error) {
            console.error("Failed to submit review:", error);
        }
    };

    const toggleHelpful = (reviewId: string, isHelpful: boolean) => {
        // This would normally be an API call too, but we keep it simple for now
        const updated = reviews.map(review => {
            if (review.id === reviewId) {
                return {
                    ...review,
                    helpful: review.helpful + (isHelpful ? 1 : -1),
                    liked: isHelpful
                };
            }
            return review;
        });
        setReviews(updated);
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <div className="bg-card border border-border rounded-lg p-6 my-6">
            <h3 className="text-2xl font-bold text-foreground mb-6">Ratings & Reviews</h3>

            {/* Overall Rating */}
            <div className="flex items-center gap-8 mb-8 pb-6 border-b border-border">
                <div className="text-center">
                    <div className="text-5xl font-bold text-foreground mb-2">{avgRating}</div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star
                                key={i}
                                className={cn(
                                    "w-5 h-5",
                                    i <= Math.round(parseFloat(avgRating)) ? "text-primary fill-primary" : "text-gray-600"
                                )}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
                </div>

                <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-3">Rate this content</p>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button
                                key={i}
                                onClick={() => saveRating(i)}
                                onMouseEnter={() => setHoverRating(i)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="transition-transform hover:scale-110"
                            >
                                <Star
                                    className={cn(
                                        "w-8 h-8 transition-colors",
                                        i <= (hoverRating || userRating)
                                            ? "text-primary fill-primary"
                                            : "text-gray-600 hover:text-primary/50"
                                    )}
                                />
                            </button>
                        ))}
                        {userRating > 0 && (
                            <span className="ml-3 text-sm text-muted-foreground">
                                You rated this {userRating} star{userRating !== 1 ? 's' : ''}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Write Review */}
            {!showReviewForm ? (
                <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6"
                >
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">Write a review</span>
                </button>
            ) : (
                <div className="mb-6 bg-background border border-border rounded-lg p-4">
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Share your thoughts about this content..."
                        className="w-full bg-card border border-border rounded-lg p-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
                    />
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-muted-foreground">
                            {userRating === 0 ? "Please rate before submitting" : `Your rating: ${userRating} stars`}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowReviewForm(false);
                                    setNewReview("");
                                }}
                                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitReview}
                                disabled={!newReview.trim() || userRating === 0}
                                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Review
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review.id} className="bg-background border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-semibold text-foreground">{review.user}</span>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star
                                                key={i}
                                                className={cn(
                                                    "w-4 h-4",
                                                    i <= review.rating ? "text-primary fill-primary" : "text-gray-600"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(review.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        {review.comment && (
                            <p className="text-foreground mb-3">{review.comment}</p>
                        )}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => toggleHelpful(review.id, true)}
                                className={cn(
                                    "flex items-center gap-2 text-sm transition-colors",
                                    review.liked === true ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful ({review.helpful})</span>
                            </button>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <ThumbsDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
