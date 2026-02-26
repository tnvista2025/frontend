import React from 'react'
import Aboutbg1 from '../assets/aboutbg1.jpg'

const About = () => {
  return (
    <div
      className="relative w-full h-[500px] sm:h-[500px] md:h-[400px] lg:h-[600px] bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${Aboutbg1})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 rounded-3xl"></div>

      {/* Blurred Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-16 lg:px-24 py-6 sm:py-10 lg:py-16 
                      w-full max-w-[90%] sm:max-w-[600px] md:max-w-[800px] bg-gray-200/20 backdrop-blur-lg rounded-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-4xl special-font text-white mb-4">
          About <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">TnVista</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg lg:text-lg leading-loose sm:leading-relaxed md:leading-loose text-white font-semibold tamil-text">
          TnVista என்பது தமிழ்நாட்டின் அழகு, பாரம்பரியம், வரலாறு மற்றும் மறைந்திருக்கும்
          சுற்றுலா இடங்களை உலகம் அறியச் செய்வதற்காக உருவாக்கப்பட்ட ஒரு டிஜிட்டல் பயண தளம்.
          நவீன தொழில்நுட்பத்தையும் தமிழ் கலாசாரத்தின் செழுமையையும் இணைத்து,
          பயணிகளுக்கு புதிய அனுபவத்தை வழங்குவதே எங்கள் நோக்கம்.
        </p>
      </div>
    </div>
  )
}

export default About
