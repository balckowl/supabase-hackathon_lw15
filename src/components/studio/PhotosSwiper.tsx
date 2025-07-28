"use client"

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { photoSchemaType } from '@/server/models/studios.schema';
import { Walter_Turncoat } from 'next/font/google';

// Custom font
const walter = Walter_Turncoat({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-walter'
});

type Props = {
  photos: photoSchemaType[];
};

export default function PhotosSwiper({ photos }: Props) {
  // More realistic paper/mount color palette
  const palette = [
    { gradient: "bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300", bg: "bg-amber-200" },
    { gradient: "bg-gradient-to-br from-lime-100 via-lime-200 to-lime-300", bg: "bg-lime-200" },
    { gradient: "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300", bg: "bg-slate-200" },
    { gradient: "bg-gradient-to-br from-blue-gray-100 via-blue-gray-200 to-blue-gray-300", bg: "bg-blue-gray-200" },
    { gradient: "bg-gradient-to-br from-rose-100 via-rose-200 to-rose-300", bg: "bg-rose-200" },
    { gradient: "bg-gradient-to-br from-green-100 via-green-200 to-green-300", bg: "bg-green-200" },
    { gradient: "bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300", bg: "bg-purple-200" },
  ]

  const rotations = [
    "rotate-1",
    "-rotate-1",
    "rotate-2",
    "-rotate-2",
    "rotate-3",
    "-rotate-3",
  ];

  return (
    <Swiper
      navigation
      modules={[Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      centeredSlides
      centerInsufficientSlides
      className="max-w-[800px] mx-auto"
    >
      {photos.map((photo, i) => {
        const color = palette[i % palette.length];
        const pinRot = rotations[i % rotations.length];
        const photoRot = rotations[(i + 3) % rotations.length];

        return (
          <SwiperSlide key={i} className="flex flex-col items-center">
            <div className="relative mb-7 mt-15">
              {/* Pin */}
              <div
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 ${pinRot}`}
              >
                <div
                  className={`${color.gradient} h-6 w-6 rounded-full border border-gray-300 shadow-lg`}
                />
                <div className="h-6 w-[2.5px] bg-gray-500 shadow-inner" />
              </div>

              {/* Mount & photo */}
              <div
                className={`${color.bg} p-3 border border-gray-200 overflow-hidden shadow-2xl transform w-[500px] mx-auto ${photoRot}`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>

            {/* Title & underline */}
            <div className="mb-2">
              <h2
                className={`mt-4 text-center text-lg font-semibold mb-2 ${walter.className}`}
              >
                {photo.title}
              </h2>
              <img
                src="/underline.png"
                className="h-1 w-full max-w-[400px] mx-auto"
              />
            </div>

            {/* Description */}
            <p className={`max-w-[500px] mx-auto ${walter.className} text-center`}>
              {photo.description}
            </p>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
