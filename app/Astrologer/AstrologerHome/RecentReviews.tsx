"use client";

import { Sparkles, Star } from "lucide-react";

type ReviewItem = {
  id: string;
  rating: number;
  comment: string;
  created_at?: string;
};

export default function RecentReviews({ reviews }: { reviews: ReviewItem[] }) {
  return (
    <div className="w-full mt-2">
      {/* Heading */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-[20px] h-[20px] text-[#4898E1]" />
        <h2 className="text-[18px] font-semibold leading-[100%] capitalize">
          Recent Reviews
        </h2>
      </div>

      {/* Reviews List */}
      <div className="flex flex-col gap-4">
        {reviews.map((item, i) => (
          <div
            key={item.id || i}
            className="min-h-[110px] w-full rounded-[15px] bg-[#F5F5F5] p-[15px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              {/* Name + Date */}
              <div>
                <h3 className="text-[16px] font-semibold capitalize">
                  User
                </h3>

                <p className="text-[12px] font-normal text-gray-600 capitalize">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString("en-IN") : "-"}, Mumbai
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="w-[16px] h-[16px] text-yellow-500 fill-yellow-500" />
                <span className="text-[16px] font-semibold leading-[100%] capitalize">
                  {item.rating}
                </span>
              </div>
            </div>

            {/* Review Text */}
            <p className="text-[13px] font-normal leading-[22px] text-gray-700 capitalize">
              {item.comment}
            </p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-[13px] font-normal leading-[22px] text-gray-700 capitalize">No reviews found</p>}
      </div>
    </div>
  );
}
