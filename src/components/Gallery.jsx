// Gallery.jsx
import React from "react";
import mainVideo from "../assets/mainh.mp4";

const Gallery = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12 font-sans">
      {/* Gallery tag */}
      <div className="text-red-600 text-xs sm:text-sm special-font tracking-[1px] mb-1 sm:mb-2 uppercase">
        Gallery
      </div>

      {/* Header with title and "View in Gallery" */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-8 lg:mb-10">
        <h2 className="text-xl sm:text-3xl lg:text-4xl special-font text-gray-900 m-0 leading-tight">
          High Quality Images and Videos
        </h2>
        <a href="/todos" className="text-blue-500 font-semibold text-sm sm:text-base flex items-center gap-1 sm:gap-1.5 underline hover:underline group mt-1 sm:mt-0">
          View in Gallery 
        </a>
      </div>

      {/* MAIN GALLERY LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 lg:gap-6">
        {/* LEFT SIDE - BIG VIDEO CARD */}
        <div className="w-full lg:w-[66%]">
          <div className="w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg bg-black">
            <video 
              poster="https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Thanjavur/Big%20Temple/gettyimages-1161897799-612x612.jpg"
              controls
              preload="metadata"
              className="w-full aspect-video object-cover"
            >
              <source src={mainVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* RIGHT SIDE - TWO IMAGE CARDS STACKED */}
        <div className="w-full lg:w-[34%] flex flex-row lg:flex-col gap-4 sm:gap-5 lg:gap-6">
          {/* TOP IMAGE CARD - becomes left on mobile */}
          <div className="w-1/2 lg:w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg">
            <img 
              src="https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Mahabalipuram/gettyimages-1160001553-612x612.jpg" 
              alt="Mahabalipuram"
              className="w-full aspect-video object-cover"
            />
          </div>

          {/* BOTTOM IMAGE CARD - becomes right on mobile */}
          <div className="w-1/2 lg:w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-md sm:shadow-lg">
            <img 
              src="https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Coimbatore/Gedee-Car-Museum/Gedee-Car-Museum1.png" 
              alt="Thirumalai Nayak Palace"
              className="w-full aspect-video object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;