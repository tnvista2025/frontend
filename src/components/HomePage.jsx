// src/pages/HomePage.jsx

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mainVideo from "../assets/mainh.mp4";
import { apiService } from "../services/apiService";

const HomePage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // ===== State for dynamic destinations =====
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  
  const mobileMenuRef = useRef(null);
  const modalRef = useRef(null);

  // ✅ API URL for login (add this - இது missing ஆக இருந்துச்சு)
  const API_URL = 'http://127.0.0.1:8000';

  // ===== Fetch destinations from database =====
  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setLoadingDestinations(true);
    try {
      const places = await apiService.getAllPlaces();
      
      const featuredPlaces = places.filter(place => place.is_featured).slice(0, 4);
      const topDestinations = featuredPlaces.length > 0 ? featuredPlaces : places.slice(0, 4);
      
      const formattedDestinations = topDestinations.map(place => ({
        image: place.hero_image,
        title: place.name,
        subtitle: place.tagline || place.location?.split(',')[0] || "Must Visit",
        path: `/place/${place.id}`
      }));
      
      setDestinations(formattedDestinations);
    } catch (error) {
      console.error("Error loading destinations:", error);
      setDestinations(fallbackDestinations);
    } finally {
      setLoadingDestinations(false);
    }
  };

  // Fallback destinations
  const fallbackDestinations = [
    {
      image: "https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Mahabalipuram/gettyimages-1362987643-612x612.jpg",
      title: "Mahabalipuram",
      subtitle: "Ancient Shore",
      path: "/place/1"
    },
    {
      image: "https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Thanjavur/Big%20Temple/unnamed.webp",
      title: "Brihadeeswar Temple",
      subtitle: "Chola Grandeur",
      path: "/place/2"
    },
    {
      image: "https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/madurai/Meenachiamman-temple/meenachiamman10.jpg",
      title: "Meenakshi Amman Temple",
      subtitle: "Gopurams of Glory",
      path: "/place/3"
    },
    {
      image: "https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Ooty/36dd74c0c282468787f11f41889fdcea.jpg",
      title: "Ooty",
      subtitle: "Queen of Hills",
      path: "/place/4"
    },
  ];

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Login Modal Functions
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsMobileMenuOpen(false);
    setSuccessMessage("");
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setErrors({});
    setSuccessMessage("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: ""
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setSuccessMessage("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: ""
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setErrors({});
      setSuccessMessage("");
      
      try {
        const dataToSend = {
          email: formData.email,
          password: formData.password,
        };
        
        if (!isLogin) {
          dataToSend.name = formData.name;
        }
        
        const endpoint = isLogin ? '/api/login/' : '/api/signup/';
        const url = `${API_URL}/accounts${endpoint}`;
        
        console.log('📤 Sending to:', url);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setUser(data.user);
          
          setSuccessMessage(isLogin ? '✅ Login successful!' : '✅ Account created successfully!');
          
          setTimeout(() => {
            closeLoginModal();
            navigate('/');
          }, 1500);
          
        } else {
          setErrors(data);
          
          if (data.error === 'Invalid email or password' || data.non_field_errors) {
            setFormData(prev => ({ ...prev, password: '' }));
            const passwordInput = document.querySelector('input[name="password"]');
            if (passwordInput) {
              passwordInput.classList.add('animate-shake');
              setTimeout(() => {
                passwordInput.classList.remove('animate-shake');
              }, 500);
            }
          }
        }
      } catch (error) {
        console.error('❌ Connection error:', error);
        setErrors({ 
          general: 'Cannot connect to server. Make sure backend is running on Render.' 
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeLoginModal();
      }
    };

    if (isLoginModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLoginModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isLoginModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isLoginModalOpen]);

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  const DestinationCard = ({ image, title, subtitle }) => {
    const [imgError, setImgError] = useState(false);
    
    return (
      <div className="group relative h-[350px] sm:h-[380px] md:h-[400px] lg:h-[420px] rounded-br-3xl rounded-tl-3xl overflow-hidden shadow-xl cursor-pointer">
        <img
          src={imgError ? 'https://via.placeholder.com/600x400?text=Image+Not+Found' : image}
          alt={title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-xs sm:text-sm text-white/70">{subtitle}</p>
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mt-1">{title}</h3>
          <button className="mt-2 px-3 py-1.5 rounded-full bg-white text-black text-xs sm:text-sm font-medium">
            Explore
          </button>
        </div>
      </div>
    );
  };

  const carouselRef = useRef(null);
  const destinationSectionRef = useRef(null);
  const desktopHistorianRef = useRef(null);
  const mobileHistorianRef = useRef(null);

  const scrollToDestinations = () => {
    destinationSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    setIsMobileMenuOpen(false);
  };

  const scrollToAIHistorian = () => {
    if (desktopHistorianRef.current) {
      desktopHistorianRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    } else if (mobileHistorianRef.current) {
      mobileHistorianRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
    setIsMobileMenuOpen(false);
  };

  // AI HISTORIAN SECTION
  const desktopNarrationRef = useRef(null);
  const mobileNarrationRef = useRef(null);

  const englishNarration = `
Brihadeeswarar Temple in Thanjavur was built by Raja Raja Chola I in 1010 CE. It stands as one of the greatest achievements of Chola architecture. The temple is dedicated to Lord Shiva and is famous for its massive granite vimana rising over 216 feet. Its intricate carvings and detailed frescoes reflect the artistic brilliance of the Chola dynasty. Today, it is a UNESCO World Heritage Site and a symbol of Tamil heritage.
  `.trim();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [voices, setVoices] = useState([]);

  const getEnglishVoice = () => {
    const englishVoicePriority = [
      voices.find(voice => voice.lang === 'en-IN'),
      voices.find(voice => voice.lang === 'en-GB'),
      voices.find(voice => voice.lang === 'en-US'),
    ];
    return englishVoicePriority.find(voice => voice !== undefined);
  };

  const speakHistorian = () => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(englishNarration);
    
    utterance.lang = "en-IN";
    const englishVoice = getEnglishVoice();
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setDisplayText("");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // GLOBAL EFFECTS
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.documentElement.style.overflowX = "hidden";
  }, []);

  useEffect(() => {
    if (desktopNarrationRef.current) {
      desktopNarrationRef.current.scrollTop = desktopNarrationRef.current.scrollHeight;
    }
    if (mobileNarrationRef.current) {
      mobileNarrationRef.current.scrollTop = mobileNarrationRef.current.scrollHeight;
    }
  }, [displayText]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (!isSpeaking) return;

    let index = 0;
    setDisplayText("");
    
    const interval = setInterval(() => {
      if (index < englishNarration.length) {
        setDisplayText((prev) => prev + englishNarration[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* NAVBAR */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[92%] max-w-7xl">
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-xl rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-2xl">
          <img
            src="https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/logo/tnvistalogo.png"
            className="w-7 h-7 sm:w-8 sm:h-8 cursor-pointer"
            onClick={() => handleNavigation('/')}
            alt="TNVista"
            onError={(e) => e.target.src = 'https://via.placeholder.com/32?text=TN'}
          />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-10 text-sm text-white/90 items-center">
            <button onClick={scrollToDestinations} className="bg-white/20 px-4 py-1.5 rounded-full hover:from-green-500 hover:to-blue-500 transition-colors bg-gradient-to-r">
              Destinations
            </button>
            <button onClick={() => handleNavigation('/districtpage')} className="cursor-pointer hover:text-white transition bg-transparent border-none">
              Districts
            </button>
            <button onClick={() => handleNavigation('/pdktdist')} className="cursor-pointer hover:text-white transition bg-transparent border-none">
              Hidden Places
            </button>
            <button onClick={scrollToAIHistorian} className="cursor-pointer hover:text-white transition bg-transparent border-none">
              AI Historians
            </button>
            <button onClick={() => handleNavigation('/maduraidist')} className="cursor-pointer hover:text-white transition bg-transparent border-none">
              Gallery
            </button>
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-white font-medium">Hi, {getFirstName(user.name)}</span>
                <button onClick={handleLogout} className="bg-gradient-to-r from-white to-white text-gray-800 px-5 py-2 rounded-3xl text-sm font-semibold hover:from-green-500 hover:to-blue-600 hover:text-white transition-colors cursor-pointer">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={openLoginModal} className="bg-gradient-to-r from-white to-white text-gray-800 px-5 py-2 rounded-full text-sm font-semibold hover:from-green-500 hover:to-blue-600 hover:text-white transition-colors cursor-pointer">
                Sign up
              </button>
            )}
            
            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden relative w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <div className="w-4 flex flex-col gap-1">
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div ref={mobileMenuRef} className={`md:hidden absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
          <div className="flex flex-col p-2">
            <button onClick={scrollToDestinations} className="text-left px-4 py-3 text-white text-sm hover:bg-white/10 rounded-xl transition">Destinations</button>
            <button onClick={() => handleNavigation('/districtpage')} className="text-left px-4 py-3 text-white text-sm hover:bg-white/10 rounded-xl transition">Districts</button>
            <button onClick={() => handleNavigation('/pdktdist')} className="text-left px-4 py-3 text-white text-sm hover:bg-white/10 rounded-xl transition">Hidden Places</button>
            <button onClick={scrollToAIHistorian} className="text-left px-4 py-3 text-white text-sm hover:bg-white/10 rounded-xl transition">AI Historians</button>
            <button onClick={() => handleNavigation('/maduraidist')} className="text-left px-4 py-3 text-white text-sm hover:bg-white/10 rounded-xl transition">Gallery</button>
            <div className="border-t border-white/10 my-2"></div>
            {user ? (
              <div className="px-4 py-3">
                <div className="text-white text-sm mb-2">Hi, {user.name}</div>
                <button onClick={handleLogout} className="w-full bg-white/20 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition">Logout</button>
              </div>
            ) : (
              <button onClick={openLoginModal} className="text-left px-4 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-gray-100 transition">Sign up</button>
            )}
          </div>
        </div>
      </header>

      {/* LOGIN MODAL */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div ref={modalRef} className="relative bg-white rounded-4xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 px-8 py-6">
              <h2 className="text-3xl special-font text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-white/80 text-sm mt-1">{isLogin ? 'Sign in to continue to TN Vista' : 'Join TN Vista to explore Tamil Nadu'}</p>
            </div>
            <button onClick={closeLoginModal} className="absolute top-4 right-4 text-white/80 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            {successMessage && <div className="mx-8 mt-6 bg-green-50 text-green-700 p-3 rounded-lg text-sm font-medium">{successMessage}</div>}
            {errors.general && <div className="mx-8 mt-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm">{errors.general}</div>}
            <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border transition-all ${errors.name ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`} placeholder="Enter your full name" />
                  {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.name}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border transition-all ${errors.email ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`} placeholder="Enter your email" />
                {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border transition-all ${errors.password || errors.error ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`} placeholder={isLogin ? "Enter your password" : "Create a password"} />
                {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.password}</p>}
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border transition-all ${errors.confirmPassword ? 'border-red-500 bg-red-50 animate-shake' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`} placeholder="Confirm your password" />
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>{errors.confirmPassword}</p>}
                </div>
              )}
              {isLogin && <div className="text-right"><button type="button" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">Forgot password?</button></div>}
              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-2xl hover:from-green-700 hover:to-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                {isLoading ? <div className="flex items-center justify-center"><div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>Processing...</div> : (isLogin ? "Sign In" : "Create Account")}
              </button>
              <p className="text-center text-sm text-gray-600 mt-6">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" onClick={toggleMode} className="text-blue-600 hover:text-blue-800 font-semibold hover:underline">{isLogin ? "Sign up" : "Sign in"}</button>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative h-screen w-full">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover brightness-90">
          <source src={mainVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-6xl special-font leading-tight">THIS IS TAMIL NADU</h1>
          <p className="mt-4 sm:mt-6 text-white/20 max-w-xl text-base sm:text-lg px-2">Discover hidden gems, chill spots, and wild adventures.</p>
        </div>
      </section>

      {/* TOP DESTINATIONS */}
      <section ref={destinationSectionRef} className="relative py-12 sm:py-16 md:py-20 bg-cover bg-center scroll-mt-24 sm:scroll-mt-28" style={{ backgroundImage: "url('https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Mahabalipuram/sample/gettyimages-147659281-612x612.jpg')" }}>
        <div className="absolute inset-0 bg-white/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mb-6 sm:mb-10 text-center z-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl special-font bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">Top Destination</h2>
          <p className="text-xs sm:text-sm md:text-base text-black tracking-wider">Worth a Thousand Stories</p>
        </div>
        {loadingDestinations ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div ref={carouselRef} className="relative z-10 flex gap-3 sm:gap-4 overflow-x-auto px-[5vw] sm:px-[6vw] pb-4 snap-x snap-mandatory scroll-pl-[5vw] sm:scroll-pl-[6vw]">
            {destinations.map((d, i) => (
              <div key={i} className="shrink-0 w-[70vw] sm:w-[40vw] md:w-[26vw] lg:w-[22vw] cursor-pointer snap-start" onClick={() => handleNavigation(d.path)}>
                <DestinationCard {...d} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* AI HISTORIAN - DESKTOP */}
      <section ref={desktopHistorianRef} className="hidden md:block relative py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-black via-[#0a0c14] to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-5 w-40 h-40 bg-blue-700/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-5 w-60 h-60 bg-green-800/30 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="relative group w-full">
            <div className="overflow-hidden shadow-2xl">
              <img src="https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Thanjavur/Big%20Temple/unnamed.webp" alt="Brihadeeswarar Temple" className="w-full h-[300px] sm:h-[380px] md:h-[450px] object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/450x300?text=Temple'} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
              <p className="text-amber-200 text-xs font-light tracking-wider mb-1">CHOLA MASTERPIECE</p>
              <h3 className="text-xl sm:text-2xl font-light">Brihadeeswarar Temple</h3>
            </div>
          </div>
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-400' : 'bg-white/30'}`}></span>
              <span className="text-white/40 text-xs font-light tracking-wider">AI HISTORIAN</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light mb-4 tracking-tight">Voice Synthesis</h2>
            <p className="text-white/40 text-sm sm:text-base font-light mb-6 leading-relaxed">Experience the thousand-year history narrated with clarity.</p>
            <div ref={desktopNarrationRef} className="bg-white/5 rounded-2xl p-5 mb-6 h-[160px] sm:h-[180px] overflow-y-auto scroll-smooth border border-white/5">
              <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed">{displayText || <span className="text-white/30 italic">Click Listen to begin the narration...</span>}</p>
            </div>
            <button onClick={isSpeaking ? stopSpeaking : speakHistorian} className="w-full bg-white text-black rounded-full py-3.5 sm:py-4 px-6 text-sm font-medium tracking-wide">
              <div className="flex items-center justify-center gap-2">
                {isSpeaking ? (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg><span>Stop</span></>
                ) : (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg><span>Listen</span></>
                )}
              </div>
            </button>
            {isSpeaking && (
              <div className="flex justify-center items-center mt-5">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                  <span className="text-white/30 text-xs font-light ml-1">Speaking</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* AI HISTORIAN - MOBILE */}
      <section ref={mobileHistorianRef} className="md:hidden relative py-12 px-4 bg-gradient-to-b from-black via-[#0a0c14] to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-5 w-40 h-40 bg-blue-700/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-5 w-60 h-60 bg-green-800/30 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-0.5 h-6 bg-white/30 rounded-full"></div>
            <div><h2 className="text-white text-xl font-light">AI Historian</h2></div>
          </div>
          <div className="relative overflow-hidden shadow-2xl mb-6">
            <img src="https://ricowdhzntqrkvnjulox.supabase.co/storage/v1/object/public/tnvista2025allphotos/Thanjavur/Big%20Temple/unnamed.webp" alt="Brihadeeswarar Temple" className="w-full h-48 object-cover" onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Temple'} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-amber-200 text-xs font-light">CHOLA MASTERPIECE</p>
              <h3 className="text-white text-lg font-light">Brihadeeswarar Temple</h3>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-400' : 'bg-white/30'}`}></span>
              <span className="text-white/30 text-xs font-light">VOICE SYNTHESIS</span>
            </div>
            <div ref={mobileNarrationRef} className="bg-black/20 rounded-xl p-4 mb-4 h-[120px] overflow-y-auto scroll-smooth border border-white/5">
              <p className="text-white/60 text-sm font-light leading-relaxed">{displayText || <span className="text-white/20 italic">Tap Listen to begin...</span>}</p>
            </div>
            <button onClick={isSpeaking ? stopSpeaking : speakHistorian} className="w-full bg-white text-black rounded-full py-4 px-6 text-sm font-medium tracking-wide">
              <div className="flex items-center justify-center gap-2">
                {isSpeaking ? (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg><span>Stop</span></>
                ) : (
                  <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg><span>Listen</span></>
                )}
              </div>
            </button>
            {isSpeaking && (
              <div className="flex justify-center items-center mt-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-150"></div>
                  <span className="text-white/30 text-xs font-light ml-1">Speaking</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;