import { Check, Globe2, Star } from "lucide-react";

import CourseContentList from "@/app/User/courses/CourseContentList";
import CourseHero from "@/app/User/courses/CourseHero";
import CourseSidebarCard from "@/app/User/courses/CourseSidebarCard";
import {
  courseContent,
  courseIncludes,
  courseLearnPoints,
  descriptionParagraphs,
  relatedTopics,
  requirements,
  review,
} from "@/app/User/courses/courseData";

export default function CoursesPage() {
  return (
    <main className="bg-white px-3 pb-10 pt-4 sm:px-5 lg:px-6 lg:pb-12">
      <div className="mx-auto space-y-8">
        <CourseHero />

        <section className="space-y-9">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="space-y-8">
              <section className="rounded-[16px] border border-[#d4d4d4] bg-white p-4 sm:p-5">
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#171717]">
                  What You&apos;ll Learn
                </h3>

                <div className="mt-5 grid gap-x-1 gap-y-1 sm:grid-cols-2">
                  {courseLearnPoints.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <Check
                        className="mt-1 h-5 w-6 shrink-0 text-[#4898E1]"
                        strokeWidth={3}
                      />
                      <p className="text-[13px] font-normal text-[#2d2d36]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#171717]">
                  Explore Related Topics
                </h3>
                <div className="mt-4 flex flex-wrap gap-1">
                  {relatedTopics.map((topic) => (
                    <span
                      key={topic}
                      className="inline-flex min-w-[110px] items-center justify-center rounded-[8px] bg-[#efefef] px-4 py-2.5 text-[11px] font-medium text-[#4a4a4f]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#171717]">
                  This Course Includes:
                </h3>
                <div className="mt-4 grid space-y-2 sm:grid-cols-3 xl:grid-cols-3">
                  {courseIncludes.map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-1 text-[12px] font-normal text-[#33333a]"
                    >
                      <Globe2
                        className="h-[15px] w-[15px] shrink-0"
                        strokeWidth={2.1}
                      />
                      <span className="tracking-tighter">
                        Lorem ipsum dolor{" "}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#171717]">
                  Course Content
                </h3>
                <div className="mt-5">
                  <CourseContentList items={courseContent} />
                </div>
                <button
                  type="button"
                  className="mt-5 text-[13px] font-medium text-[#4898E1]"
                >
                  20 more contents
                </button>
              </section>
              <section>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#171717]">
                  Requirements
                </h3>
                <ul className="mt-4 space-y-4  text-[13px] font-normal text-[#33333a] marker:text-[#33333a]">
                  {requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#171717]">
                  Description
                </h3>
                <div className="mt-4 space-y-4 text-[13px] font-normal text-[#33333a]">
                  {descriptionParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-4 text-[13px] font-medium text-[#4898E1]"
                >
                  Show more
                </button>
              </section>
              <section className="border-t border-[#d9d9d9] pt-8">
                <div className="flex flex-wrap items-center gap-3 text-[#1c1c22]">
                  <span className="inline-flex items-center gap-2 text-[14px] font-medium tracking-[-0.04em]">
                    <Star
                      className="h-5 w-5 fill-[#f2c200] text-[#f2c200]"
                      strokeWidth={1.8}
                    />
                    4.8 Ratings
                  </span>
                  <span className="text-[#9893a0]">•</span>
                  <span className="text-[14px] font-medium tracking-[-0.04em]">
                    10,467 Students
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#e8d7ff_0%,#f5efff_100%)] text-[11px] font-medium text-[#4898E1]">
                    VB
                  </div>
                  <div>
                    <div className="flex  flex-col gap-3">
                      <h4 className="text-[16px] font-semibold text-[#1b1b20]">
                        {review.author}
                      </h4>
                      <div className="flex gap-0.5 text-[#f2c200]">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className="h-3 w-3 fill-current"
                            strokeWidth={1.8}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 max-w-4xl text-[13px] font-normal text-[#33333a]">
                      {review.body}
                    </p>
                  </div>
                </div>
              </section>
            </section>

            <CourseSidebarCard />
          </div>
        </section>
      </div>
    </main>
  );
}
