'use strict';

// Scroll reveal observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      entry.target.classList.remove('pre-animate');
    }
  });
}, { threshold: 0.1 });

window.revealObserver = revealObserver;

document.querySelectorAll('.reveal').forEach((el) => {
  // Only hide-then-animate if JS actually runs; CSS alone always keeps content visible.
  el.classList.add('pre-animate');
  revealObserver.observe(el);
});

// Counter animations for stats
document.querySelectorAll('.stat-num[data-target]').forEach((el) => {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const suffix = el.getAttribute('data-suffix') || '';
  
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      const duration = 1800;
      let startTime = null;
      
      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        // Cubic ease-out
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = Math.round(eased * target);
        
        if (target >= 1000) {
          el.textContent = (val >= 1000 ? Math.round(val / 1000) + 'k' : val) + suffix;
        } else {
          el.textContent = val + suffix;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }
      
      requestAnimationFrame(animate);
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });
  
  counterObserver.observe(el);
});

// =========================================
// 3D PREMIUM MUSEUM GALLERY
// =========================================

const GALLERY_DATA = {
  "corporate": [
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Geometric branding mural for a software startup in Guindy, Chennai.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co1.jpg",
        "left": "./assets/images/creations/corporate-offices/co1.jpg",
        "right": "./assets/images/creations/corporate-offices/co1.jpg",
        "wide": "./assets/images/creations/corporate-offices/co1.jpg",
        "close": "./assets/images/creations/corporate-offices/co1.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Creative wall art designed for a fintech startup in TIDEL Park, Coimbatore.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co10.jpg",
        "left": "./assets/images/creations/corporate-offices/co10.jpg",
        "right": "./assets/images/creations/corporate-offices/co10.jpg",
        "wide": "./assets/images/creations/corporate-offices/co10.jpg",
        "close": "./assets/images/creations/corporate-offices/co10.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Biophilic accent wall for a digital marketing agency in Besant Nagar, Chennai.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co2.jpg",
        "left": "./assets/images/creations/corporate-offices/co2.jpg",
        "right": "./assets/images/creations/corporate-offices/co2.jpg",
        "wide": "./assets/images/creations/corporate-offices/co2.jpg",
        "close": "./assets/images/creations/corporate-offices/co2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Abstract corporate mural installed in the lounge of a tech startup in Madurai.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co3.jpg",
        "left": "./assets/images/creations/corporate-offices/co3.jpg",
        "right": "./assets/images/creations/corporate-offices/co3.jpg",
        "wide": "./assets/images/creations/corporate-offices/co3.jpg",
        "close": "./assets/images/creations/corporate-offices/co3.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Custom wall painting for a co-working space in Cross Cut Road, Coimbatore.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co4.jpg",
        "left": "./assets/images/creations/corporate-offices/co4.jpg",
        "right": "./assets/images/creations/corporate-offices/co4.jpg",
        "wide": "./assets/images/creations/corporate-offices/co4.jpg",
        "close": "./assets/images/creations/corporate-offices/co4.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Inspirational mural painted for an edtech startup in Adyar, Chennai.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co5.jpg",
        "left": "./assets/images/creations/corporate-offices/co5.jpg",
        "right": "./assets/images/creations/corporate-offices/co5.jpg",
        "wide": "./assets/images/creations/corporate-offices/co5.jpg",
        "close": "./assets/images/creations/corporate-offices/co5.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Modern abstract line mural for a workspace in Trichy.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co6.jpg",
        "left": "./assets/images/creations/corporate-offices/co6.jpg",
        "right": "./assets/images/creations/corporate-offices/co6.jpg",
        "wide": "./assets/images/creations/corporate-offices/co6.jpg",
        "close": "./assets/images/creations/corporate-offices/co6.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Minimalist clean wall art for a creative agency in Salem.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co7.jpg",
        "left": "./assets/images/creations/corporate-offices/co7.jpg",
        "right": "./assets/images/creations/corporate-offices/co7.jpg",
        "wide": "./assets/images/creations/corporate-offices/co7.jpg",
        "close": "./assets/images/creations/corporate-offices/co7.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Vibrant office lobby mural painted for a local startup in Guindy, Chennai.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co8.jpg",
        "left": "./assets/images/creations/corporate-offices/co8.jpg",
        "right": "./assets/images/creations/corporate-offices/co8.jpg",
        "wide": "./assets/images/creations/corporate-offices/co8.jpg",
        "close": "./assets/images/creations/corporate-offices/co8.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Flowing shapes mural for a product startup in TIDEL Park, Coimbatore.",
      "images": {
        "front": "./assets/images/creations/corporate-offices/co9.jpg",
        "left": "./assets/images/creations/corporate-offices/co9.jpg",
        "right": "./assets/images/creations/corporate-offices/co9.jpg",
        "wide": "./assets/images/creations/corporate-offices/co9.jpg",
        "close": "./assets/images/creations/corporate-offices/co9.jpg"
      }
    }
  ],
  "cafes": [
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Aesthetic branding mural painted at a local specialty coffee shop in Besant Nagar, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg",
        "left": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg",
        "right": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg",
        "close": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Traditional hand-painted artwork for a local family restaurant in Mylapore, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg",
        "left": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg",
        "right": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg",
        "close": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Modern wall mural for an organic cafe in Cross Cut Road, Coimbatore.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg",
        "left": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg",
        "right": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg",
        "close": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Vibrant botanical mural inside a dessert parlour in K.K. Nagar, Madurai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr1.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr1.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr1.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr1.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr1.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Quirky cartoon wall art for a college hangout cafe in Trichy.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr2.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr2.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr2.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr2.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Contemporary mural for a tea lounge in Salem.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr3.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr3.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr3.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr3.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr3.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Rustic theme mural painted for a traditional eatery in Karaikudi.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr4.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr4.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr4.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr4.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr4.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Geometric mural for an ice cream parlor in Adyar, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr5.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr5.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr5.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr5.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr5.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Aesthetic branding mural painted at a local specialty coffee shop in Besant Nagar, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr6.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr6.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr6.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr6.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr6.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Traditional hand-painted artwork for a local family restaurant in Mylapore, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr7.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr7.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr7.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr7.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr7.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Modern wall mural for an organic cafe in Cross Cut Road, Coimbatore.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr8.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr8.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr8.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr8.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr8.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Vibrant botanical mural inside a dessert parlour in K.K. Nagar, Madurai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg",
        "left": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg",
        "right": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg",
        "close": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Quirky cartoon wall art for a college hangout cafe in Trichy.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg",
        "left": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg",
        "right": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg",
        "close": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg"
      }
    }
  ],
  "schools": [
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Fun illustrative wall painting for a local nursery school in Adyar, Chennai.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc1.jpg",
        "left": "./assets/images/creations/schools-education/sc1.jpg",
        "right": "./assets/images/creations/schools-education/sc1.jpg",
        "wide": "./assets/images/creations/schools-education/sc1.jpg",
        "close": "./assets/images/creations/schools-education/sc1.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Interactive cartoon library mural for a primary school in Salem.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc10.jpg",
        "left": "./assets/images/creations/schools-education/sc10.jpg",
        "right": "./assets/images/creations/schools-education/sc10.jpg",
        "wide": "./assets/images/creations/schools-education/sc10.jpg",
        "close": "./assets/images/creations/schools-education/sc10.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Educational science-themed mural for a high school in Trichy.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc2.jpg",
        "left": "./assets/images/creations/schools-education/sc2.jpg",
        "right": "./assets/images/creations/schools-education/sc2.jpg",
        "wide": "./assets/images/creations/schools-education/sc2.jpg",
        "close": "./assets/images/creations/schools-education/sc2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Playful animal kingdom mural for a playschool in Coimbatore.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc3.jpg",
        "left": "./assets/images/creations/schools-education/sc3.jpg",
        "right": "./assets/images/creations/schools-education/sc3.jpg",
        "wide": "./assets/images/creations/schools-education/sc3.jpg",
        "close": "./assets/images/creations/schools-education/sc3.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Motivational quotes and geometric mural in a school courtyard at Madurai.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc4.jpg",
        "left": "./assets/images/creations/schools-education/sc4.jpg",
        "right": "./assets/images/creations/schools-education/sc4.jpg",
        "wide": "./assets/images/creations/schools-education/sc4.jpg",
        "close": "./assets/images/creations/schools-education/sc4.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Artistic historical timeline mural for a school corridor in Mylapore, Chennai.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc5.jpg",
        "left": "./assets/images/creations/schools-education/sc5.jpg",
        "right": "./assets/images/creations/schools-education/sc5.jpg",
        "wide": "./assets/images/creations/schools-education/sc5.jpg",
        "close": "./assets/images/creations/schools-education/sc5.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Fun illustrative wall painting for a local nursery school in Adyar, Chennai.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc6.jpg",
        "left": "./assets/images/creations/schools-education/sc6.jpg",
        "right": "./assets/images/creations/schools-education/sc6.jpg",
        "wide": "./assets/images/creations/schools-education/sc6.jpg",
        "close": "./assets/images/creations/schools-education/sc6.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Interactive cartoon library mural for a primary school in Salem.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc7.jpg",
        "left": "./assets/images/creations/schools-education/sc7.jpg",
        "right": "./assets/images/creations/schools-education/sc7.jpg",
        "wide": "./assets/images/creations/schools-education/sc7.jpg",
        "close": "./assets/images/creations/schools-education/sc7.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Educational science-themed mural for a high school in Trichy.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc8.jpg",
        "left": "./assets/images/creations/schools-education/sc8.jpg",
        "right": "./assets/images/creations/schools-education/sc8.jpg",
        "wide": "./assets/images/creations/schools-education/sc8.jpg",
        "close": "./assets/images/creations/schools-education/sc8.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Playful animal kingdom mural for a playschool in Coimbatore.",
      "images": {
        "front": "./assets/images/creations/schools-education/sc9.jpg",
        "left": "./assets/images/creations/schools-education/sc9.jpg",
        "right": "./assets/images/creations/schools-education/sc9.jpg",
        "wide": "./assets/images/creations/schools-education/sc9.jpg",
        "close": "./assets/images/creations/schools-education/sc9.jpg"
      }
    }
  ],
  "hospitals": [
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Calming botanical mural in a local clinic reception at Trichy.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc1.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc1.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc1.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc1.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc1.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Soothing natural landscape mural for a children's ward in Salem.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc10.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc10.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc10.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc10.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc10.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Serene lotus pond mural for a maternity hospital waiting area in Madurai.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc2.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc2.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc2.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc2.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Bright floral wall painting for a dental clinic in Guindy, Chennai.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc3.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc3.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc3.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc3.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc3.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Gentle ocean breeze mural for a healing ward in Coimbatore.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc4.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc4.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc4.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc4.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc4.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Biophilic green canopy mural for a medical center lounge in Chennai.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc5.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc5.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc5.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc5.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc5.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Calming botanical mural in a local clinic reception at Trichy.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc6.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc6.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc6.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc6.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc6.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Soothing natural landscape mural for a children's ward in Salem.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc7.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc7.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc7.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc7.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc7.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Serene lotus pond mural for a maternity hospital waiting area in Madurai.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc8.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc8.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc8.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc8.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc8.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Bright floral wall painting for a dental clinic in Guindy, Chennai.",
      "images": {
        "front": "./assets/images/creations/hospital-clinic/hc9.jpg",
        "left": "./assets/images/creations/hospital-clinic/hc9.jpg",
        "right": "./assets/images/creations/hospital-clinic/hc9.jpg",
        "wide": "./assets/images/creations/hospital-clinic/hc9.jpg",
        "close": "./assets/images/creations/hospital-clinic/hc9.jpg"
      }
    }
  ],
  "hotels": [
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Lobby accent wall depicting local culture at a heritage resort in Mahabalipuram.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr1.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr1.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr1.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr1.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr1.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Modern minimalist abstract mural for a boutique hotel in Ooty.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr10.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr10.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr10.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr10.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr10.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Traditional Tamil heritage mural for a guest house in Karaikudi.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr2.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr2.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr2.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr2.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Tropical theme restaurant mural for a luxury hotel in Chennai.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr3.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr3.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr3.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr3.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr3.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Scenic landscape mural painted for a resort lounge in Kodaikanal.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr4.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr4.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr4.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr4.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr4.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Elegant geometric mural for a business hotel lobby in Coimbatore.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr5.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr5.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr5.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr5.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr5.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Lobby accent wall depicting local culture at a heritage resort in Mahabalipuram.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr6.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr6.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr6.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr6.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr6.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Modern minimalist abstract mural for a boutique hotel in Ooty.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr7.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr7.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr7.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr7.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr7.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Traditional Tamil heritage mural for a guest house in Karaikudi.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr8.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr8.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr8.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr8.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr8.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Tropical theme restaurant mural for a luxury hotel in Chennai.",
      "images": {
        "front": "./assets/images/creations/hotels-resorts/handr9.jpg",
        "left": "./assets/images/creations/hotels-resorts/handr9.jpg",
        "right": "./assets/images/creations/hotels-resorts/handr9.jpg",
        "wide": "./assets/images/creations/hotels-resorts/handr9.jpg",
        "close": "./assets/images/creations/hotels-resorts/handr9.jpg"
      }
    }
  ],
  "residential": [
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Biophilic wall painting in a contemporary living room in Guindy, Chennai.",
      "images": {
        "front": "./assets/images/creations/residential-interior/residency-banana-leaf-1.jpg",
        "left": "./assets/images/creations/residential-interior/residency-banana-leaf-1.jpg",
        "right": "./assets/images/creations/residential-interior/residency-banana-leaf-1.jpg",
        "wide": "./assets/images/creations/residential-interior/residency-banana-leaf-1.jpg",
        "close": "./assets/images/creations/residential-interior/residency-banana-leaf-1.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Traditional kolam-themed entryway painting in Mylapore, Chennai.",
      "images": {
        "front": "./assets/images/creations/residential-interior/residency-kolam-doorstep.jpg",
        "left": "./assets/images/creations/residential-interior/residency-kolam-doorstep.jpg",
        "right": "./assets/images/creations/residential-interior/residency-kolam-doorstep.jpg",
        "wide": "./assets/images/creations/residential-interior/residency-kolam-doorstep.jpg",
        "close": "./assets/images/creations/residential-interior/residency-kolam-doorstep.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Custom heritage mural for a private residential villa in Karaikudi.",
      "images": {
        "front": "./assets/images/creations/residential-interior/residency-krishna-hill.jpg",
        "left": "./assets/images/creations/residential-interior/residency-krishna-hill.jpg",
        "right": "./assets/images/creations/residential-interior/residency-krishna-hill.jpg",
        "wide": "./assets/images/creations/residential-interior/residency-krishna-hill.jpg",
        "close": "./assets/images/creations/residential-interior/residency-krishna-hill.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Tropical foliage mural painted for a balcony in Besant Nagar, Chennai.",
      "images": {
        "front": "./assets/images/creations/residential-interior/residency-krishna-with-viewer.jpg",
        "left": "./assets/images/creations/residential-interior/residency-krishna-with-viewer.jpg",
        "right": "./assets/images/creations/residential-interior/residency-krishna-with-viewer.jpg",
        "wide": "./assets/images/creations/residential-interior/residency-krishna-with-viewer.jpg",
        "close": "./assets/images/creations/residential-interior/residency-krishna-with-viewer.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Minimalist abstract landscape mural for a bedroom in Coimbatore.",
      "images": {
        "front": "./assets/images/creations/residential-interior/residency-peacock-anklets-lamp.jpg",
        "left": "./assets/images/creations/residential-interior/residency-peacock-anklets-lamp.jpg",
        "right": "./assets/images/creations/residential-interior/residency-peacock-anklets-lamp.jpg",
        "wide": "./assets/images/creations/residential-interior/residency-peacock-anklets-lamp.jpg",
        "close": "./assets/images/creations/residential-interior/residency-peacock-anklets-lamp.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Custom kids room illustration mural in Madurai.",
      "images": {
        "front": "./assets/images/creations/residential-interior/residency-peacock-entrance.jpg",
        "left": "./assets/images/creations/residential-interior/residency-peacock-entrance.jpg",
        "right": "./assets/images/creations/residential-interior/residency-peacock-entrance.jpg",
        "wide": "./assets/images/creations/residential-interior/residency-peacock-entrance.jpg",
        "close": "./assets/images/creations/residential-interior/residency-peacock-entrance.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Geometric color-block accent wall for a townhouse in Trichy.",
      "images": {
        "front": "./assets/images/creations/residential-interior/residency-peacock-kalash-doorway.jpg",
        "left": "./assets/images/creations/residential-interior/residency-peacock-kalash-doorway.jpg",
        "right": "./assets/images/creations/residential-interior/residency-peacock-kalash-doorway.jpg",
        "wide": "./assets/images/creations/residential-interior/residency-peacock-kalash-doorway.jpg",
        "close": "./assets/images/creations/residential-interior/residency-peacock-kalash-doorway.jpg"
      }
    }
  ],
  "retail": [
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Aesthetic branding mural painted at a local specialty coffee shop in Besant Nagar, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg",
        "left": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg",
        "right": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg",
        "close": "./assets/images/creations/cafe-restaurants/cafe-chai-illamal.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Traditional hand-painted artwork for a local family restaurant in Mylapore, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg",
        "left": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg",
        "right": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg",
        "close": "./assets/images/creations/cafe-restaurants/cafe-henna-hand-chai.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Modern wall mural for an organic cafe in Cross Cut Road, Coimbatore.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg",
        "left": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg",
        "right": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg",
        "close": "./assets/images/creations/cafe-restaurants/cafe-old-school-van-2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Vibrant botanical mural inside a dessert parlour in K.K. Nagar, Madurai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr1.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr1.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr1.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr1.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr1.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Quirky cartoon wall art for a college hangout cafe in Trichy.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr2.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr2.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr2.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr2.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Contemporary mural for a tea lounge in Salem.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr3.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr3.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr3.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr3.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr3.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Rustic theme mural painted for a traditional eatery in Karaikudi.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr4.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr4.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr4.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr4.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr4.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Geometric mural for an ice cream parlor in Adyar, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr5.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr5.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr5.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr5.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr5.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Aesthetic branding mural painted at a local specialty coffee shop in Besant Nagar, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr6.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr6.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr6.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr6.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr6.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Traditional hand-painted artwork for a local family restaurant in Mylapore, Chennai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr7.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr7.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr7.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr7.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr7.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Modern wall mural for an organic cafe in Cross Cut Road, Coimbatore.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/candr8.jpg",
        "left": "./assets/images/creations/cafe-restaurants/candr8.jpg",
        "right": "./assets/images/creations/cafe-restaurants/candr8.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/candr8.jpg",
        "close": "./assets/images/creations/cafe-restaurants/candr8.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Vibrant botanical mural inside a dessert parlour in K.K. Nagar, Madurai.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg",
        "left": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg",
        "right": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg",
        "close": "./assets/images/creations/cafe-restaurants/restaurant-abstract-botanical.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Quirky cartoon wall art for a college hangout cafe in Trichy.",
      "images": {
        "front": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg",
        "left": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg",
        "right": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg",
        "wide": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg",
        "close": "./assets/images/creations/cafe-restaurants/restaurant-floral-poppy.jpg"
      }
    }
  ],
  "outdoor": [
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Community street art mural painted near Besant Nagar beach, Chennai.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img1.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img1.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img1.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img1.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img1.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Public park beautification project mural in Salem.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img10.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img10.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img10.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img10.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img10.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Vibrant cultural mural on a building facade in Madurai.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img2.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img2.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img2.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img2.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img2.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Luxury Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Beautification wall painting near a public park in Trichy.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img3.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img3.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img3.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img3.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img3.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Metallics",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Social awareness street art mural in Coimbatore.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img4.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img4.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img4.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img4.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img4.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Ultima",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Traditional folk art public wall painting in Tanjore.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img5.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img5.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img5.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img5.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img5.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Glitz",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Community street art mural painted near Besant Nagar beach, Chennai.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img6.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img6.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img6.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img6.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img6.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apex Duracast",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Public park beautification project mural in Salem.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img7.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img7.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img7.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img7.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img7.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Apcolite Premium Emulsion",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Vibrant cultural mural on a building facade in Madurai.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img8.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img8.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img8.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img8.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img8.jpg"
      }
    },
    {
      "title": "",
      "artist": "",
      "medium": "Asian Paints Royale Play Stucco",
      "year": "2024",
      "dims": "Custom Size",
      "desc": "Beautification wall painting near a public park in Trichy.",
      "images": {
        "front": "./assets/images/creations/outdoor-public-art/img9.jpg",
        "left": "./assets/images/creations/outdoor-public-art/img9.jpg",
        "right": "./assets/images/creations/outdoor-public-art/img9.jpg",
        "wide": "./assets/images/creations/outdoor-public-art/img9.jpg",
        "close": "./assets/images/creations/outdoor-public-art/img9.jpg"
      }
    }
  ]
};

function getGalleryCategoryKey(rawCategory) {
  if (!rawCategory) return null;
  const normalized = String(rawCategory).trim().toLowerCase();
  const map = {
    corporate: 'corporate',
    'corporate offices': 'corporate',
    cafes: 'cafes',
    'cafés & restaurants': 'cafes',
    'cafes & restaurants': 'cafes',
    schools: 'schools',
    'schools & education': 'schools',
    hospitals: 'hospitals',
    'hospitals & clinics': 'hospitals',
    hotels: 'hotels',
    'hotels & resorts': 'hotels',
    residential: 'residential',
    'residential interiors': 'residential',
    retail: 'retail',
    'retail & showrooms': 'retail',
    outdoor: 'outdoor',
    'outdoor & public art': 'outdoor',
  };
  return map[normalized] || null;
}

async function loadPortfolioIntoGallery() {
  if (window.__portfolioGalleryMerged) return;

  let items = [];
  try {
    if (typeof window.shouldBypassRemoteData === 'function' && window.shouldBypassRemoteData()) {
      items = (window.getFallbackPortfolioItems ? window.getFallbackPortfolioItems() : []).filter(i => !i.is_hidden);
    } else if (window.db) {
      const { data, error } = await window.db
        .from('portfolio')
        .select('*')
        .eq('is_hidden', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      items = data || [];
    }
  } catch (err) {
    console.warn('[Gallery] Could not load portfolio items from Supabase, using fallback:', err);
  }

  // Fallback to local items if remote query failed or returned no results
  if ((!items || items.length === 0) && typeof window.getFallbackPortfolioItems === 'function') {
    items = window.getFallbackPortfolioItems().filter(i => !i.is_hidden);
  }

  if (items && items.length > 0) {
    // Insert oldest first; unshift then leaves the newest admin item first.
    [...items].reverse().forEach((item) => {
      const categoryKey = getGalleryCategoryKey(item.category);
      if (!categoryKey) return;

      const galleryItem = {
        title: item.title || 'Untitled project',
        artist: item.artist_name || 'Ashmija S.R',
        medium: item.art_type || item.artType || 'Custom Wall Art',
        year: item.year || '',
        dims: item.area || item.dims || '',
        desc: item.description || item.desc || '',
        // Admin uploads contain one source image. Expose it for every view so
        // the 3D lightbox keeps its Front/Angle/Wide/Close-up controls.
        images: (() => {
          const imageUrl = item.image_url || item.imageUrl || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80';
          return { front: imageUrl, left: imageUrl, right: imageUrl, wide: imageUrl, close: imageUrl };
        })(),
      };

      if (!GALLERY_DATA[categoryKey]) {
        GALLERY_DATA[categoryKey] = [];
      }

      const existsIndex = GALLERY_DATA[categoryKey].findIndex(existing => existing.title === galleryItem.title && existing.artist === galleryItem.artist);
      if (existsIndex === -1) {
        GALLERY_DATA[categoryKey].unshift(galleryItem);
      } else {
        GALLERY_DATA[categoryKey].splice(existsIndex, 1);
        GALLERY_DATA[categoryKey].unshift(galleryItem);
      }
    });
  }

  window.__portfolioGalleryMerged = true;
}

async function init3DGallery() {
  const section = document.getElementById('portfolio-section');
  if (!section) return;

  await loadPortfolioIntoGallery();

  let activeCategory = 'schools';
  let activeArtworkIndex = 0;

  let tiltX = 0;
  let tiltY = 0;

  const frameEl = document.getElementById('interactive-3d-frame');
  const imgEl = document.getElementById('featured-artwork-img');
  
  // Elements for card details
  const tagEl = document.getElementById('artwork-tag');
  const titleEl = document.getElementById('artwork-title');
  const artistEl = document.getElementById('artwork-artist');
  const mediumEl = document.getElementById('artwork-medium');
  const yearEl = document.getElementById('artwork-year');
  const dimsEl = document.getElementById('artwork-dims');
  const descEl = document.getElementById('artwork-desc');
  
  // Lightbox elements
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const lightboxFrame = document.getElementById('lightbox-3d-frame');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-artwork-title');
  const lightboxArtist = document.getElementById('lightbox-artwork-artist');
  let lightboxScale = 1;
  let lightboxRotY = 0;
  let lightboxRotX = 0;

  // Load selected category into UI
  function renderCategory() {
    const list = GALLERY_DATA[activeCategory];
    if (!list || !list.length) return;

    // Render Coverflow Carousel
    const track = document.getElementById('carousel-track');
    if (track) {
      track.innerHTML = list.map((art, index) => `
        <div class="carousel-item" data-index="${index}">
          <img src="${art.images.front}" alt="${art.title} mural art" loading="lazy" decoding="async">
        </div>
      `).join('');

      // Add click listeners to items
      track.querySelectorAll('.carousel-item').forEach(item => {
        item.addEventListener('click', () => {
          const index = parseInt(item.getAttribute('data-index'), 10);
          selectArtwork(index);
        });
      });
    }

    selectArtwork(0);
  }

  // Select specific artwork
  function selectArtwork(index) {
    activeArtworkIndex = index;
    
    const art = GALLERY_DATA[activeCategory][activeArtworkIndex];
    if (!art) return;

    // Update metadata with fade animation
    if (tagEl) {
      tagEl.textContent = activeCategory.replace('_', ' ');
      tagEl.style.textTransform = 'uppercase';
    }

    if (titleEl) titleEl.textContent = art.title;
    if (artistEl) artistEl.textContent = art.artist;
    if (mediumEl) mediumEl.textContent = art.medium;
    if (yearEl) yearEl.textContent = art.year;
    if (dimsEl) dimsEl.textContent = art.dims;
    if (descEl) descEl.textContent = art.desc;

    const isMobile = window.innerWidth <= 768;

    if (imgEl) {
      const applyImage = () => {
        imgEl.src = art.images.front;
        imgEl.alt = art.title;
        imgEl.style.opacity = '1';
      };

      imgEl.style.opacity = '0.7';
      const nextImage = new Image();
      nextImage.onload = () => applyImage();
      nextImage.onerror = () => applyImage();
      nextImage.src = art.images.front;
      if (nextImage.complete) {
        applyImage();
      }
    }

    if (frameEl && typeof gsap !== 'undefined' && !isMobile) {
      gsap.fromTo(frameEl,
        { scale: 0.9, opacity: 0, rotationY: -15 },
        { scale: 1, opacity: 1, rotationY: 0, duration: 0.7, ease: 'power3.out' }
      );
    } else if (frameEl) {
      frameEl.style.opacity = '1';
      frameEl.style.transform = 'none';
      frameEl.style.scale = '1';
    }

    updateCoverflow();
  }

  // Update Coverflow position & 3D styling
  function updateCoverflow() {
    const isMobile = window.innerWidth <= 768;
    const items = document.querySelectorAll('.carousel-item');
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === activeArtworkIndex);

      const offset = idx - activeArtworkIndex;
      let transformStr = '';
      let opacityVal = 0.5;
      let filterStr = 'brightness(0.65) blur(1.5px)';
      let zIndexVal = 5 - Math.abs(offset);

      if (offset === 0) {
        transformStr = isMobile ? 'translate3d(0, 0, 0) rotateY(0deg)' : 'translate3d(0, 0, 80px) rotateY(0deg)';
        opacityVal = 1;
        filterStr = isMobile ? 'none' : 'brightness(1) blur(0)';
        zIndexVal = 10;
      } else if (offset < 0) {
        transformStr = isMobile
          ? `translate3d(${offset * 95 - 26}px, 0, 0) rotateY(16deg)`
          : `translate3d(${offset * 110 - 40}px, 0, 10px) rotateY(25deg)`;
      } else {
        transformStr = isMobile
          ? `translate3d(${offset * 95 + 26}px, 0, 0) rotateY(-16deg)`
          : `translate3d(${offset * 110 + 40}px, 0, 10px) rotateY(-25deg)`;
      }

      item.style.transform = transformStr;
      item.style.opacity = opacityVal;
      item.style.filter = isMobile ? 'none' : filterStr;
      item.style.zIndex = zIndexVal;
    });
  }

  // Mouse tilt handlers
  const wrapper = section.querySelector('.artwork-3d-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Max 6 degrees tilt (well below ±8° maximum requested)
      tiltY = (x / (rect.width / 2)) * 6;
      tiltX = -(y / (rect.height / 2)) * 6;

      if (frameEl) {
        frameEl.style.transform = `rotateY(${tiltY}deg) rotateX(${tiltX}deg)`;
      }
    });

    wrapper.addEventListener('mouseleave', () => {
      tiltX = 0;
      tiltY = 0;
      if (frameEl && typeof gsap !== 'undefined') {
        gsap.to(frameEl, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    });
  }

  // Bind Category Buttons
  section.querySelectorAll('.gallery-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      section.querySelectorAll('.gallery-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      renderCategory();
    });
  });

  // Lightbox Handlers
  if (frameEl) {
    frameEl.addEventListener('click', () => {
      const art = GALLERY_DATA[activeCategory][activeArtworkIndex];
      if (!art || !lightbox) return;

      lightboxScale = 1; // Reset active scale to 1 on open
      lightboxRotY = 0;   // Reset Y rotation on open
      lightboxRotX = 0;   // Reset X rotation on open

      if (lightboxImg) {
        lightboxImg.src = art.images.front;
        lightboxImg.style.opacity = 1;
      }
      if (lightboxTitle) lightboxTitle.textContent = art.title;
      if (lightboxArtist) lightboxArtist.textContent = art.artist;

      // Handle multi-angle selector menu visibility
      const anglesNav = document.getElementById('lightbox-angles-nav');
      if (anglesNav) {
        const availableAngles = Object.keys(art.images);
        if (availableAngles.length > 1) {
          anglesNav.style.display = 'flex';
          // Update individual button visibility based on available keys
          anglesNav.querySelectorAll('.angle-btn').forEach(btn => {
            const angle = btn.getAttribute('data-angle');
            if (art.images[angle]) {
              btn.style.display = 'inline-flex';
            } else {
              btn.style.display = 'none';
            }
            // Reset active state to 'front'
            btn.classList.toggle('active', angle === 'front');
          });
        } else {
          anglesNav.style.display = 'none';
        }
      }

      lightbox.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      if (lightboxFrame && typeof gsap !== 'undefined' && window.innerWidth > 768) {
        gsap.fromTo(lightboxFrame,
          { scale: 0.85, opacity: 0, rotationY: 0, rotationX: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );
      }
    });
  }

  // Bind angle buttons clicks inside the lightbox
  const angleBtns = document.querySelectorAll('#lightbox-angles-nav .angle-btn');
  angleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const art = GALLERY_DATA[activeCategory][activeArtworkIndex];
      if (!art) return;

      const angle = btn.getAttribute('data-angle');
      const imgUrl = art.images[angle];
      if (!imgUrl) return;

      // Toggle active states
      angleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // 3D perspective shift on frame rotate during angle switch
      let targetRotY = 0;
      let targetRotX = 0;
      let targetScale = 1;

      if (angle === 'left') targetRotY = -25;
      else if (angle === 'right') targetRotY = 25;
      else if (angle === 'wide') targetScale = 0.9;
      else if (angle === 'close') {
        targetRotX = -12;
        targetScale = 1.08;
      }

      lightboxScale = targetScale; // Save the selected scale
      lightboxRotY = targetRotY;   // Save the selected Y rotation
      lightboxRotX = targetRotX;   // Save the selected X rotation

      if (lightboxFrame && typeof gsap !== 'undefined' && window.innerWidth > 768) {
        // Set image source directly to avoid blank/blink screen state during transition
        if (lightboxImg) {
          lightboxImg.src = imgUrl;
        }

        // Animate the frame smoothly to the target angle and scale
        gsap.to(lightboxFrame, {
          rotationY: targetRotY,
          rotationX: targetRotX,
          scale: targetScale,
          duration: 0.5,
          ease: 'power2.out'
        });
      } else {
        // Fallback
        if (lightboxImg) lightboxImg.src = imgUrl;
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      lightbox.setAttribute('hidden', '');
      document.body.style.overflow = '';
    });
  }

  // Lightbox Mouse Tilt
  if (lightbox) {
    lightbox.addEventListener('mousemove', (e) => {
      if (!lightboxFrame) return;
      const rect = lightbox.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltYLight = (x / (rect.width / 2)) * 5;
      const tiltXLight = -(y / (rect.height / 2)) * 5;
      
      // Preserve the current lightboxScale and base rotation during mouse hover
      lightboxFrame.style.transform = `rotateY(${lightboxRotY + tiltYLight}deg) rotateX(${lightboxRotX + tiltXLight}deg) scale(${lightboxScale})`;
    });
    
    lightbox.addEventListener('mouseleave', () => {
      if (lightboxFrame && typeof gsap !== 'undefined' && window.innerWidth > 768) {
        // Reset tilt but retain the active angle's base rotation and scale
        gsap.to(lightboxFrame, { rotateY: lightboxRotY, rotateX: lightboxRotX, scale: lightboxScale, duration: 0.5 });
      }
    });
  }

  // Keyboard navigation for Carousel
  document.addEventListener('keydown', (e) => {
    const list = GALLERY_DATA[activeCategory];
    if (!list) return;

    if (e.key === 'ArrowRight') {
      const nextIdx = (activeArtworkIndex + 1) % list.length;
      selectArtwork(nextIdx);
    } else if (e.key === 'ArrowLeft') {
      const prevIdx = (activeArtworkIndex - 1 + list.length) % list.length;
      selectArtwork(prevIdx);
    }
  });

  // Simple drag gesture for Coverflow Carousel
  const container = document.getElementById('coverflow-carousel');
  if (container) {
    let startX = 0;
    let isDragging = false;

    container.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      isDragging = true;
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const diffX = e.clientX - startX;
      if (Math.abs(diffX) > 60) {
        const list = GALLERY_DATA[activeCategory];
        if (diffX > 0) {
          const prevIdx = (activeArtworkIndex - 1 + list.length) % list.length;
          selectArtwork(prevIdx);
        } else {
          const nextIdx = (activeArtworkIndex + 1) % list.length;
          selectArtwork(nextIdx);
        }
        isDragging = false;
      }
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch swipe support
    container.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    container.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const diffX = e.touches[0].clientX - startX;
      if (Math.abs(diffX) > 50) {
        const list = GALLERY_DATA[activeCategory];
        if (diffX > 0) {
          const prevIdx = (activeArtworkIndex - 1 + list.length) % list.length;
          selectArtwork(prevIdx);
        } else {
          const nextIdx = (activeArtworkIndex + 1) % list.length;
          selectArtwork(nextIdx);
        }
        isDragging = false;
      }
    });

    container.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Initialize
  renderCategory();
}

window.init3DGallery = init3DGallery;
window.initCreationsShowcase = init3DGallery; // Compatibility fallback for Admin Panel

function initDynamicBackground() {
  // Discarded per user request to use a single white texture on the body background
}

window.initDynamicBackground = initDynamicBackground;

const FALLBACK_TESTIMONIALS = [
  {
    id: 0,
    name: "Kavitha",
    role: "Director, Google Chennai",
    quote: "ashmija in color transformed our empty lobby into an immersive botanical gallery. Our visitors are consistently wowed at first glance. Truly professional management from sketch to paint.",
    image: "./assets/images/creations/corporate-offices/co1.jpg",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 1,
    name: "Vikram",
    role: "Curator, Taj Group",
    quote: "We wanted our restaurant wall to reflect the rich heritage of South India in a modern way. The geometric murals Priya designed did exactly that. Absolute masterpiece.",
    image: "./assets/images/creations/cafe-restaurants/candr1.jpg",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 2,
    name: "Ananya",
    role: "Architect, Nair Villas",
    quote: "Every detail of the custom installation inside our luxury courtyard was handled flawlessly. The weather-resistant paints are holding up beautifully under direct sun. Highly recommended.",
    image: "./assets/images/creations/residential-interior/residency-banana-leaf-1.jpg",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 3,
    name: "Rahul",
    role: "COO, Freshworks",
    quote: "The team transformed our entire 4th floor into a vibrant storytelling space. Employees now look forward to walking through those corridors every morning. Incredible attention to detail.",
    image: "./assets/images/creations/corporate-offices/co2.jpg",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 4,
    name: "Priyanka",
    role: "GM, Park Hyatt Chennai",
    quote: "Our lobby mural has become the most photographed spot in the hotel. Guests constantly ask about the artist. ashmija in color delivered well ahead of schedule with zero disruption to our operations.",
    image: "./assets/images/creations/hotels-resorts/handr1.jpg",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 5,
    name: "Dr. Suresh",
    role: "Principal, Sishya School",
    quote: "The children's library mural is absolutely magical. It sparked a whole new interest in art among our students. The team was wonderful with the kids, even involving them in a small painting corner.",
    image: "./assets/images/creations/schools-education/sc1.jpg",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 6,
    name: "Arun",
    role: "Founder, The Rustic Table",
    quote: "Our farm-to-table concept came alive through the mural they painted. It perfectly captures the spirit of fresh, local ingredients. Our social media engagement went up 60% after the mural reveal!",
    image: "./assets/images/creations/cafe-restaurants/candr2.jpg",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150"
  },
  {
    id: 7,
    name: "Maya",
    role: "Owner, FitVerse Studio",
    quote: "The high-energy workout mural they designed completely transformed our studio's atmosphere. Members love taking photos in front of it. Best investment we've made for our brand identity.",
    image: "./assets/images/creations/outdoor-public-art/img1.jpg",
    avatar: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=150&h=150"
  }
];

const DEFAULT_TESTIMONIAL_IMAGE = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80';

/**
 * Fetches approved reviews from Supabase (pinned first), mapped into the
 * shape the carousel/renderer already expects. Falls back to the static
 * list if the table is empty, missing, or unreachable — so this is safe
 * to call before the `reviews` table has any rows.
 */
async function loadTestimonials() {
  try {
    if (typeof window.shouldBypassRemoteData === 'function' && window.shouldBypassRemoteData()) {
      return FALLBACK_TESTIMONIALS;
    }
    if (!window.db) return FALLBACK_TESTIMONIALS;

    const { data, error } = await window.db
      .from('reviews')
      .select('*')
      .eq('is_approved', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return FALLBACK_TESTIMONIALS;

    return data.map((item, index) => {
      const rawText = String(item.review_text || '');
      let cleanText = rawText;
      let location = '';
      let workImage = '';

      const locMarker = '||location:';
      const locIndex = rawText.indexOf(locMarker);
      if (locIndex >= 0) {
        cleanText = rawText.slice(0, locIndex);
        const remainder = rawText.slice(locIndex + locMarker.length);
        const nextMarkerIndex = remainder.indexOf('||');
        location = nextMarkerIndex >= 0 ? remainder.slice(0, nextMarkerIndex) : remainder;
      }

      const imgMarker = '||work_image:';
      const imgIndex = rawText.indexOf(imgMarker);
      if (imgIndex >= 0) {
        if (locIndex < 0 || imgIndex < locIndex) {
          cleanText = rawText.slice(0, imgIndex);
        }
        workImage = rawText.slice(imgIndex + imgMarker.length);
      }

      if (cleanText.includes('||')) {
        cleanText = cleanText.split('||')[0];
      }

      const roleText = [item.company, location || item.location].filter(Boolean).join(', ');

      return {
        id: item.id ?? index,
        name: item.name || 'Happy Client',
        role: roleText || 'Client',
        quote: cleanText || '',
        image: workImage || DEFAULT_TESTIMONIAL_IMAGE,
        avatar: item.avatar_url || DEFAULT_TESTIMONIAL_IMAGE,
      };
    });
  } catch (err) {
    console.warn('[Testimonials] Could not load reviews from Supabase, using fallback:', err);
    return FALLBACK_TESTIMONIALS;
  }
}

async function init3DTestimonialCarousel() {
  const testimonials = await loadTestimonials();

  let activeIndex = 0;
  let autoplayTimer = null;
  const track = document.getElementById('testimonials-3d-track');
  const dotsContainer = document.getElementById('testimonials-3d-dots');
  const prevBtn = document.getElementById('testimonial-prev-btn');
  const nextBtn = document.getElementById('testimonial-next-btn');

  if (!track) return;

  // Render cards
  track.innerHTML = testimonials.map((item, index) => `
    <div class="testimonial-3d-card" data-index="${index}">
      <div class="t3d-shine"></div>
      <div class="t3d-artwork-container">
        <img src="${item.image}" alt="${item.name}'s artwork" class="t3d-artwork-img">
      </div>
      <div class="t3d-avatar-container">
        <img src="${item.avatar}" alt="${item.name}" class="t3d-avatar-img">
      </div>
      <div class="t3d-content">
        <p class="testimonial-quote">“${item.quote}”</p>
        <h4 class="testimonial-name">${item.name}</h4>
        <span class="testimonial-company">${item.role}</span>
      </div>
    </div>
  `).join('');

  const cards = Array.from(track.querySelectorAll('.testimonial-3d-card'));

  // Render dots
  if (dotsContainer) {
    dotsContainer.innerHTML = testimonials.map((_, index) => `
      <button class="t3d-dot" data-index="${index}" aria-label="Go to testimonial ${index + 1}"></button>
    `).join('');

    dotsContainer.querySelectorAll('.t3d-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(targetIndex);
      });
    });
  }

  // Click handler for cards (clicking side cards transitions to center)
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const index = parseInt(card.getAttribute('data-index'), 10);
      if (index !== activeIndex) {
        e.preventDefault();
        goToSlide(index);
      }
    });

    // Subtle cursor interactive tilt for active card
    card.addEventListener('mousemove', (e) => {
      if (parseInt(card.getAttribute('data-index'), 10) !== activeIndex) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * 4;
      const rotateY = ((x - centerX) / centerX) * -4;

      gsap.to(card, {
        duration: 0.3,
        rotationX: rotateX,
        rotationY: rotateY,
        y: -4,
        ease: "power2.out"
      });

      // Shine effect positioning
      const shine = card.querySelector('.t3d-shine');
      if (shine) {
        const shineX = (x / rect.width) * 100;
        const shineY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.2) 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (parseInt(card.getAttribute('data-index'), 10) !== activeIndex) return;
      if (window.innerWidth > 768) {
        gsap.to(card, {
          duration: 0.5,
          rotationX: 0,
          rotationY: 0,
          y: 0,
          ease: 'power2.out'
        });
      }
      const shine = card.querySelector('.t3d-shine');
      if (shine) {
        shine.style.background = 'none';
      }
    });
  });

  function updateCarousel() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    const total = testimonials.length;

    cards.forEach((card, index) => {
      let diff = index - activeIndex;

      if (diff < -total / 2) diff += total;
      if (diff > total / 2) diff -= total;

      const absDiff = Math.abs(diff);

      let xOffset = 0;
      let zOffset = 0;
      let rotation = 0;
      let opacity = 0;
      let zIndex = 1;
      let scale = 1;
      let blur = 0;
      let yOffset = 0;

      if (diff === 0) {
        xOffset = 0;
        zOffset = 0;
        rotation = 0;
        opacity = 1;
        zIndex = 10;
        scale = 1;
        yOffset = 0;
        blur = 0;
        card.classList.add('is-active');
      } else if (diff === -1) {
        xOffset = isMobile ? -320 : (isTablet ? -220 : -340);
        zOffset = -150;
        rotation = 35;
        opacity = isMobile ? 0 : 0.75;
        zIndex = 5;
        scale = 0.82;
        yOffset = isMobile ? 0 : 15;
        blur = 1.5;
        card.classList.remove('is-active');
      } else if (diff === 1) {
        xOffset = isMobile ? 320 : (isTablet ? 220 : 340);
        zOffset = -150;
        rotation = -35;
        opacity = isMobile ? 0 : 0.75;
        zIndex = 5;
        scale = 0.82;
        yOffset = isMobile ? 0 : 15;
        blur = 1.5;
        card.classList.remove('is-active');
      } else {
        xOffset = diff < 0 ? -600 : 600;
        zOffset = -300;
        rotation = diff < 0 ? 45 : -45;
        opacity = 0;
        zIndex = 1;
        scale = 0.7;
        yOffset = 30;
        blur = 4;
        card.classList.remove('is-active');
      }

      if (isMobile) {
        card.style.transition = 'transform 0.25s ease, opacity 0.25s ease, filter 0.25s ease';
        card.style.transform = `translate3d(${xOffset}px, ${yOffset}px, ${zOffset}px) rotateY(${rotation}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.zIndex = zIndex;
        card.style.filter = 'none';
      } else {
        gsap.to(card, {
          duration: 0.8,
          ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
          x: xOffset,
          z: zOffset,
          rotationY: rotation,
          y: yOffset,
          scale: scale,
          opacity: opacity,
          zIndex: zIndex,
          filter: blur > 0 ? `blur(${blur}px)` : 'none',
          overwrite: 'auto'
        });
      }

      const img = card.querySelector('.t3d-artwork-img');
      if (img) {
        const imgX = isMobile ? 0 : -diff * 20;
        if (isMobile) {
          img.style.transform = 'translate3d(0, 0, 0)';
        } else {
          gsap.to(img, {
            duration: 0.8,
            ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
            x: imgX,
            overwrite: 'auto'
          });
        }
      }
    });

    // Update dots
    const dots = document.querySelectorAll('.t3d-dot');
    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function goToSlide(index) {
    activeIndex = (index + testimonials.length) % testimonials.length;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(activeIndex + 1);
  }

  function prevSlide() {
    goToSlide(activeIndex - 1);
  }

  // Bind Buttons
  prevBtn?.addEventListener('click', prevSlide);
  nextBtn?.addEventListener('click', nextSlide);

  // Drag and Swipe Support
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  const trackContainer = document.getElementById('testimonials-3d-viewport');
  if (trackContainer) {
    const handleStart = (e) => {
      isDragging = true;
      startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      stopAutoplay();
    };

    const handleMove = (e) => {
      if (!isDragging) return;
      currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    };

    const handleEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      const diffX = currentX - startX;
      if (Math.abs(diffX) > 50 && currentX !== 0) {
        if (diffX > 0) {
          prevSlide();
        } else {
          nextSlide();
        }
      }
      currentX = 0;
      startAutoplay();
    };

    trackContainer.addEventListener('mousedown', handleStart);
    trackContainer.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);

    trackContainer.addEventListener('touchstart', handleStart, { passive: true });
    trackContainer.addEventListener('touchmove', handleMove, { passive: true });
    trackContainer.addEventListener('touchend', handleEnd);

    // Pause on hover
    trackContainer.addEventListener('mouseenter', stopAutoplay);
    trackContainer.addEventListener('mouseleave', startAutoplay);
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const rect = track.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    }
  });

  // Autoplay
  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // Resize handler
  let resizeFrame = null;
  window.addEventListener('resize', () => {
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(updateCarousel);
  });

  // Initialize
  updateCarousel();
  startAutoplay();
}

window.init3DTestimonialCarousel = init3DTestimonialCarousel;

// 3D Gallery initialization is bound to the window object.

// =========================================
// PREMIUM CREATOR MODALS
// =========================================

const modalBackdrop = document.getElementById('modal-backdrop');
const creatorModal = document.getElementById('creator-modal');
const teamModal = document.getElementById('team-modal');

// Close all active modals
function closeAllModals() {
  document.querySelectorAll('.creator-modal-container').forEach(modal => {
    modal.classList.remove('active');
  });
  if (modalBackdrop) {
    modalBackdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
}

// Attach close event to close buttons and backdrop
document.querySelectorAll('.modal-close-btn').forEach(btn => {
  btn.addEventListener('click', closeAllModals);
});

if (modalBackdrop) {
  modalBackdrop.addEventListener('click', closeAllModals);
}

// Close modals on Escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAllModals();
  }
});

// 1. Creator card click handler to open dynamic bio modal
document.querySelectorAll('.creator-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.getAttribute('data-name');
    const role = card.getAttribute('data-role');
    const bio = card.getAttribute('data-bio');
    const quote = card.getAttribute('data-quote');
    const image = card.getAttribute('data-image');
    const statsAttr = card.getAttribute('data-stats') || '';
    
    // Populate modal fields
    const modalImg = document.getElementById('modal-img');
    const modalName = document.getElementById('modal-name');
    const modalRole = document.getElementById('modal-role');
    const modalBio = document.getElementById('modal-bio');
    const modalQuote = document.getElementById('modal-quote');
    const modalStatsContainer = document.getElementById('modal-stats');
    
    if (modalImg) {
      modalImg.src = image;
      modalImg.alt = name;
    }
    if (modalName) modalName.textContent = name;
    if (modalRole) modalRole.textContent = role;
    if (modalBio) modalBio.textContent = bio;
    
    if (modalQuote) {
      if (quote) {
        modalQuote.textContent = `"${quote}"`;
        modalQuote.style.display = 'block';
      } else {
        modalQuote.style.display = 'none';
      }
    }
    
    // Populate stats badges
    if (modalStatsContainer) {
      modalStatsContainer.innerHTML = '';
      if (statsAttr) {
        const stats = statsAttr.split(',');
        stats.forEach(stat => {
          const badge = document.createElement('span');
          badge.className = 'creator-stat-badge';
          badge.textContent = stat.trim();
          modalStatsContainer.appendChild(badge);
        });
      }
    }
    
    // Show modal and backdrop
    if (creatorModal && modalBackdrop) {
      creatorModal.classList.add('active');
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

// 2. Read More button click handler to open team overview modal
const btnCreatorsMore = document.getElementById('btn-creators-more');
if (btnCreatorsMore) {
  btnCreatorsMore.addEventListener('click', () => {
    if (teamModal && modalBackdrop) {
      teamModal.classList.add('active');
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      return;
    }

    const section = document.getElementById('artists-section');
    if (section) {
      section.scrollIntoView({ block: 'start' });
    }
  });
}

function initRatingModal() {
  const STATIC_REVIEWS = [
    {
      name: 'Kavitha',
      company: 'Director, Google Chennai',
      quote: 'ashmija in color transformed our empty lobby into an immersive botanical gallery. Our visitors are consistently wowed at first glance. Truly professional management from sketch to paint.',
      image: "./assets/images/creations/corporate-offices/co1.jpg",
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150',
      date: 'May 18, 2024',
      place: 'Chennai',
    },
    {
      name: 'Vikram',
      company: 'Curator, Taj Group',
      quote: 'We wanted our restaurant wall to reflect the rich heritage of South India in a modern way. The geometric murals Priya designed did exactly that. Absolute masterpiece.',
      image: "./assets/images/creations/cafe-restaurants/candr1.jpg",
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150',
      date: 'April 7, 2024',
      place: 'Chennai',
    },
    {
      name: 'Ananya',
      company: 'Architect, Nair Villas',
      quote: 'Every detail of the custom installation inside our luxury courtyard was handled flawlessly. The weather-resistant paints are holding up beautifully under direct sun. Highly recommended.',
      image: "./assets/images/creations/residential-interior/residency-banana-leaf-1.jpg",
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150',
      date: 'March 22, 2024',
      place: 'Bengaluru',
    },
  ];

  async function renderStaticReviewsList() {
    const allReviewsList = document.getElementById('all-reviews-list');
    if (!allReviewsList) return;

    let reviews = STATIC_REVIEWS;
    try {
      const items = await loadTestimonials();
      if (items && items.length && items !== FALLBACK_TESTIMONIALS) {
        reviews = items.map((item, index) => ({
          name: item.name,
          company: item.role,
          quote: item.quote,
          image: item.image,
          avatar: item.avatar,
          date: '',
          place: '',
        }));
      }
    } catch (err) {
      console.warn('[Testimonials] all-reviews modal falling back to static list:', err);
    }

    allReviewsList.innerHTML = reviews.map((review) => `
      <article class="testimonial-card glass-card" style="margin-bottom:1rem;">
        <div class="testimonial-work-img">
          <img src="${review.image}" alt="${review.name} project work">
        </div>
        <div class="testimonial-content">
          <div class="testimonial-avatar">
            <img src="${review.avatar}" alt="${review.name}">
          </div>
          <h4 class="testimonial-name">${review.name}</h4>
          <span class="testimonial-company">${review.company}</span>
          <div class="testimonial-stars" aria-label="5 out of 5 stars">
            <i class="ti ti-star-filled" aria-hidden="true"></i>
            <i class="ti ti-star-filled" aria-hidden="true"></i>
            <i class="ti ti-star-filled" aria-hidden="true"></i>
            <i class="ti ti-star-filled" aria-hidden="true"></i>
            <i class="ti ti-star-filled" aria-hidden="true"></i>
          </div>
          <p class="testimonial-quote">${review.quote}</p>
          <time class="testimonial-date">${review.date}</time>
          <div class="creator-stats-wrap" style="margin-top:.8rem;">
            <span class="creator-stat-badge">${review.place}</span>
          </div>
        </div>
      </article>
    `).join('');
  }

  const rateUsBtn = document.getElementById('rate-us-btn');
  const ratingModal = document.getElementById('rating-modal');
  const reviewForm = document.getElementById('review-form');
  const testimonialsGrid = document.querySelector('.testimonials-grid');
  function createMLReplyContainer() {
    let el = document.getElementById('review-ml-reply-card');
    if (!el) {
      el = document.createElement('div');
      el.id = 'review-ml-reply-card';
      el.className = 'review-ml-reply-card glass-card';
      el.style.display = 'none';
      const heading = document.createElement('div');
      heading.className = 'reply-card-heading';
      heading.textContent = 'AI-generated reply';
      const body = document.createElement('div');
      body.className = 'reply-card-body';
      body.textContent = 'Your custom reply will appear here after review submission.';
      el.append(heading, body);
      const target = document.getElementById('testimonials-section');
      if (target && target.parentNode) {
        target.parentNode.insertBefore(el, target.nextSibling);
      } else {
        document.body.appendChild(el);
      }
    }
    return el;
  }

  function updateAvatarSelection(selectedInput) {
    document.querySelectorAll('.rating-avatar').forEach((label) => {
      label.classList.toggle('selected', label.querySelector('input') === selectedInput);
    });
  }

  document.querySelectorAll('input[name="review-avatar"]').forEach((input) => {
    input.addEventListener('change', () => {
      updateAvatarSelection(input);
    });
  });
  if (rateUsBtn) {
    rateUsBtn.addEventListener('click', () => {
      if (ratingModal && modalBackdrop) {
        ratingModal.classList.add('active');
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  const viewAllBtn = document.getElementById('view-all-reviews-btn');
  const allReviewsModal = document.getElementById('all-reviews-modal');
  if (viewAllBtn && allReviewsModal && modalBackdrop) {
    viewAllBtn.addEventListener('click', async () => {
      allReviewsModal.classList.add('active');
      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      await renderStaticReviewsList();
    });
  }

  if (testimonialsGrid) {
    testimonialsGrid.addEventListener('click', (event) => {
      const card = event.target.closest('.testimonial-card');
      const workImgContainer = event.target.closest('.testimonial-work-img');
      if (card && workImgContainer) {
        const img = workImgContainer.querySelector('img');
        const imgSrc = img ? img.src : '';
        if (!imgSrc) return;
        
        const nameEl = card.querySelector('.testimonial-name');
        
        const clientName = nameEl ? nameEl.textContent.trim() : 'Client';
        
        const imgModal = document.getElementById('testimonial-image-modal');
        const modalImg = document.getElementById('testimonial-modal-img');
        const modalClient = document.getElementById('testimonial-modal-client');
        const backdrop = document.getElementById('modal-backdrop');
        
        if (imgModal && modalImg && backdrop) {
          modalImg.src = imgSrc;
          modalImg.alt = `${clientName} project work`;
          if (modalClient) modalClient.textContent = clientName;
          
          imgModal.classList.add('active');
          backdrop.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    });
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const maxDim = 800;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = () => reject(new Error('Image load error'));
        img.src = event.target.result;
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  }
  const mlReplyEl = reviewForm ? createMLReplyContainer() : null;
  function buildReviewTextPayload(reviewText, location, workImage) {
    const parts = [reviewText];
    if (location) parts.push(`location:${location}`);
    if (workImage) parts.push(`work_image:${workImage}`);
    return parts.join('||');
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      if (mlReplyEl) {
        mlReplyEl.style.display = 'none';
        const body = mlReplyEl.querySelector('.reply-card-body');
        if (body) {
          body.textContent = '';
        }
      }

      const formData = new FormData(reviewForm);
      const name = formData.get('reviewerName').trim();
      const company = formData.get('reviewerCompany').trim();
      const locationField = formData.get('reviewerLocation');
      const location = typeof locationField === 'string' ? locationField.trim() : '';
      const rating = formData.get('reviewRating');
      const reviewText = formData.get('reviewText').trim();

      if (!name || !company || !reviewText) {
        const msg = 'Please complete the required fields before submitting your review.';
        if (window.showToast) window.showToast(msg, 'warning');
        else alert(msg);
        return;
      }

      const submitBtn = document.getElementById('submit-review-btn') || reviewForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit Review';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
      }

      try {
        if (!window.db) {
          throw new Error('Database client is not available.');
        }

        if (mlReplyEl) {
          mlReplyEl.style.display = 'none';
          const body = mlReplyEl.querySelector('.reply-card-body');
          if (body) {
            body.textContent = '';
          }
        }

        let workImage = '';
        const workImageFile = document.getElementById('review-work-image')?.files[0];
        if (workImageFile) {
          try {
            workImage = await compressImage(workImageFile);
          } catch (compressErr) {
            
          }
        }

        const avatar = document.querySelector('input[name="review-avatar"]:checked')?.value || '';
        let avatarUrl = avatar;
        const avatarFile = document.getElementById('review-avatar-file')?.files[0];
        if (avatarFile) {
          try {
            avatarUrl = await compressImage(avatarFile);
          } catch (avatarCompressErr) {
            
          }
        }

        let mlReplyText = null;
        let mlReplyEmoji = null;
        let mlReplySticker = null;
        
        try {
          const mlApiUrl = window.appConfig.ML_REPLY_FUNCTION_URL;
          const mlResponse = await fetch(mlApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${window.appConfig.SUPABASE_ANON_KEY}`,
              'apikey': window.appConfig.SUPABASE_ANON_KEY
            },
            body: JSON.stringify({
              review: reviewText,
              customer_name: name
            })
          });

          if (mlResponse.ok) {
            const mlData = await mlResponse.json();
            
            mlReplyText = mlData.reply || null;
            mlReplyEmoji = mlData.emoji || null;
            mlReplySticker = mlData.sticker || null;
          } else {
            
          }
        } catch (mlErr) {
          
        }

        // Fallback custom reply when ML API is not available
        if (!mlReplyText) {
          const ratingVal = parseInt(rating, 10);
          const ratingWord = ratingVal === 5 ? 'amazing' : ratingVal === 4 ? 'wonderful' : 'great';
          const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
          mlReplyText = `Dear ${formattedName},\n\nThank you so much for your ${ratingWord} review! We're truly honored that you took the time to share your experience with ashmija in color.\n\nYour words inspire us to continue creating beautiful, meaningful art that transforms spaces and touches hearts. We look forward to bringing more color and joy to your world!\n\nWith gratitude,\nThe ashmija in color Team`;
          mlReplyEmoji = '😊';
          mlReplySticker = '😊 🎨';
        }

        // For negative replies from ML, ensure it's short and clean
        if (mlReplyText && mlReplyText.length > 200 && mlReplyText.includes('sincerely apologize')) {
          const nameMatch = mlReplyText.match(/Dear ([^,]+),/);
          const topicMatch = mlReplyText.match(/feedback on ([^—]+)/);
          const customerName = nameMatch ? nameMatch[1] : 'valued customer';
          const topicText = topicMatch ? topicMatch[1].trim() : 'this area';
          
          mlReplyText = `Dear ${customerName},\n\nThank you for your feedback on ${topicText} — we sincerely apologize and are taking immediate action to improve.\n\nWith sincere apologies,\nThe ashmija in color Team`;
        }

        const payload = {
          name,
          company,
          rating: parseInt(rating, 10),
          review_text: workImage ? `${reviewText}||work_image:${workImage}` : reviewText,
          avatar_url: avatarUrl,
          is_approved: false, // requires admin approval
          is_pinned: false,
          created_at: new Date().toISOString()
        };

        try { 
          const { error } = await window.db.from('reviews').insert(payload);
          if (error) {}
        } catch(e) {
          
        }

        const displayText = mlReplyText;

        // Close any open modals (like the rating modal) before showing the reply modal
        closeAllModals();

        const mlReplyModal = document.getElementById('ml-reply-modal');
        const mlReplyModalText = document.getElementById('ml-reply-modal-text');
        const mlReplyModalEmoji = document.getElementById('ml-reply-modal-emoji');
        if (mlReplyModal && mlReplyModalText) {
          mlReplyModalText.textContent = displayText;
          if (mlReplyModalEmoji) {
            mlReplyModalEmoji.textContent = mlReplyEmoji || '';
            mlReplyModalEmoji.style.display = mlReplyEmoji ? 'block' : 'none';
            // Apply consistent animation based on emoji
            const emojiAnimations = {
              '😊': 'emojiPopIn',
              '😁': 'emojiBounce',
              '😄': 'emojiWiggle',
              '🤗': 'emojiFloat',
              '😃': 'emojiSpin',
              '🥰': 'emojiPopIn',
              '😍': 'emojiBounce',
              '🤩': 'emojiWiggle',
              '😌': 'emojiFloat',
              '🙂': 'emojiSpin',
              '😋': 'emojiPopIn',
              '🤠': 'emojiBounce',
              '😎': 'emojiWiggle',
              '🥳': 'emojiFloat',
              '😇': 'emojiSpin',
              '☺️': 'emojiPopIn',
              '😉': 'emojiBounce'
            };
            const animName = emojiAnimations[mlReplyEmoji] || 'emojiPopIn';
            mlReplyModalEmoji.style.animation = `${animName} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both`;
            // After entrance animation, add continuous idle animation
            setTimeout(() => {
              mlReplyModalEmoji.style.animation = 'emojiIdle 2s ease-in-out infinite';
            }, 600);
          }
          mlReplyModal.classList.add('active');
          if (modalBackdrop) {
            modalBackdrop.classList.add('active');
          }
          document.body.style.overflow = 'hidden';
        }

        if (mlReplyEl) {
          mlReplyEl.style.display = 'none';
          const body = mlReplyEl.querySelector('.reply-card-body');
          if (body) {
            body.textContent = '';
          }
        }

        
        reviewForm.reset();
        updateAvatarSelection(document.querySelector('input[name="review-avatar"]'));
      } catch (err) {
        
        const msg = err?.message ? `Could not process the review form: ${err.message}` : 'Could not process the review form.';
        if (window.showToast) window.showToast(msg, 'error');
        else alert(msg);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
}
  // ML Reply Modal close handlers
  const mlReplyModalClose = document.getElementById('ml-reply-modal-close');
  const mlReplyModalOkBtn = document.getElementById('ml-reply-modal-ok-btn');
  if (mlReplyModalClose) {
    mlReplyModalClose.addEventListener('click', () => {
      const modal = document.getElementById('ml-reply-modal');
      if (modal) modal.classList.remove('active');
      if (modalBackdrop) modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  if (mlReplyModalOkBtn) {
    mlReplyModalOkBtn.addEventListener('click', () => {
      const modal = document.getElementById('ml-reply-modal');
      if (modal) modal.classList.remove('active');
      if (modalBackdrop) modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

 document.addEventListener("DOMContentLoaded", () => {
    initContactForm();
    initRatingModal();
    init3DGallery();
    initDynamicBackground();
    observeGalleryGrid();
    initRealtimeGallery();
});
function initContactForm() {
  const contactForm = document.getElementById('contact-section-form');
  // This page also loads shared/admin scripts that can attach a contact handler.
  // Keep one handler only, so a successful submit reliably shows the thank-you state.
  if (!contactForm || contactForm.dataset.contactHandlerBound === 'true') return;
  contactForm.dataset.contactHandlerBound = 'true';

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const submitBtn = document.getElementById('btn-contact-submit');
    const originalText = submitBtn ? submitBtn.textContent : 'Send Message';
    const payload = {
      firstName: document.getElementById('contact-first-name')?.value.trim() || '',
      lastName: document.getElementById('contact-last-name')?.value.trim() || '',
      email: document.getElementById('contact-email')?.value.trim() || '',
      phone: document.getElementById('contact-phone')?.value.trim() || '',
      projectType: document.getElementById('contact-project-type')?.value || '',
      message: document.getElementById('contact-message')?.value.trim() || ''
    };

    if (!payload.firstName || !payload.lastName || !payload.email) {
      const msg = 'Please complete your name and email before sending.';
      if (window.showToast) window.showToast(msg, 'warning');
      else alert(msg);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    try {
      if (!window.db) {
        throw new Error('Database client is not available.');
      }

      const name = `${payload.firstName} ${payload.lastName}`.trim();
      const messageText = `Project type: ${payload.projectType}\n\n${payload.message}`;

      const { error } = await window.db.from('inquiries').insert({
        name: name,
        email: payload.email,
        phone: payload.phone,
        message: messageText,
        status: 'new'
      });

      if (error) throw error;

      contactForm.reset();

      const formContainer = document.getElementById('contact-form-container');
      const successState = document.getElementById('contact-success-state');
      if (formContainer && successState) {
        formContainer.style.display = 'none';
        successState.style.display = 'flex';
      } else {
        const msg = 'Thank you! Your details have been sent.';
        if (window.showToast) window.showToast(msg, 'success');
        else alert(msg);
      }
    } catch (err) {
      console.error('[contact-form] submit error:', err);
      const msg = 'Failed to send your message. Please try again.';
      if (window.showToast) window.showToast(msg, 'error');
      else alert(msg);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Failsafe: Ensure scroll lock is released on initial load
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';

  initContactForm();
  initRatingModal();
  init3DGallery();
  initDynamicBackground();
  initRealtimeGallery();
  init3DTestimonialCarousel();
  initFaqAccordion();
  initScrollNavigation();
  initMagneticButtons();
  initHeroParallax();
  initMobileNavigation();
  initStatsCounter();
});

/* ================================================================
   DYNAMIC RESPONSIVE MASONRY ENGINE
   ================================================================ */

/**
 * window.layoutMasonry()
 * Responsive Pinterest-style masonry arrangement layout.
 * Absolutely positions items in the shortest column with transitions.
 */
window.layoutMasonry = function () {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;
  if (galleryGrid.closest('.creations-split')) {
    galleryGrid.classList.remove('masonry-active');
    galleryGrid.style.height = '';
    galleryGrid.querySelectorAll('.gallery-item').forEach((item) => {
      item.style.position = '';
      item.style.width = '';
      item.style.left = '';
      item.style.top = '';
    });
    return;
  }

  const items = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
  if (items.length === 0) return;

  // Mark grid active for our custom CSS absolute positioning and transitions
  galleryGrid.classList.add('masonry-active');

  // Determine width and columns
  const gridWidth = galleryGrid.getBoundingClientRect().width;
  let columns = 3;
  let gap = 16;

  if (gridWidth < 576) {
    columns = 1;
    gap = 12;
  } else if (gridWidth < 992) {
    columns = 2;
    gap = 12;
  }

  const colWidth = (gridWidth - (columns - 1) * gap) / columns;
  const colHeights = Array(columns).fill(0);

  // Position items
  items.forEach((item) => {
    // 1. Scaled height based on image's actual aspect ratio
    const img = item.querySelector('.gal-inner img');
    let ar = 1.35; // standard museum showcase aspect ratio fallback

    if (img && img.naturalWidth && img.naturalHeight) {
      ar = img.naturalWidth / img.naturalHeight;
    } else if (img) {
      img.addEventListener('load', () => {
        window.layoutMasonry();
      }, { once: true });
    }

    const innerHeight = colWidth / ar;
    const galInner = item.querySelector('.gal-inner');
    if (galInner) {
      galInner.style.height = `${innerHeight}px`;
      galInner.style.transition = 'height 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
    }

    // 2. Identify the shortest column
    let minCol = 0;
    let minVal = colHeights[0];
    for (let i = 1; i < columns; i++) {
      if (colHeights[i] < minVal) {
        minVal = colHeights[i];
        minCol = i;
      }
    }

    // 3. Absolute positioning (composites cleanly with hover tilt and scroll parallax)
    const leftPos = minCol * (colWidth + gap);
    const topPos = colHeights[minCol];

    item.style.position = 'absolute';
    item.style.width = `${colWidth}px`;
    item.style.left = `${leftPos}px`;
    item.style.top = `${topPos}px`;

    // 4. Update the column height
    colHeights[minCol] += innerHeight + gap;
  });

  // Calculate maximum height to prevent layout collapses
  const maxHeight = Math.max(...colHeights);
  galleryGrid.style.height = `${maxHeight - gap}px`;
};

// Bind layout to window actions
window.addEventListener('resize', () => {
  window.layoutMasonry();
});

window.addEventListener('load', () => {
  setTimeout(() => {
    window.layoutMasonry();
    window.startLivingGallery();
  }, 150);
});


/* ================================================================
   LIVING GALLERY EXPERIENCE (SHUFFLER)
   ================================================================ */

let livingGalleryInterval = null;

/**
 * window.startLivingGallery()
 * Periodically shuffles artwork positions with smooth visual scale transitions.
 */
window.startLivingGallery = function () {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;
  if (galleryGrid.closest('.creations-split')) return;

  if (livingGalleryInterval) {
    clearInterval(livingGalleryInterval);
  }

  // Shuffle every 10 seconds
  livingGalleryInterval = setInterval(() => {
    // Only run when section is in viewport to optimize active rendering
    const rect = galleryGrid.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;

    const items = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
    if (items.length <= 1) return;

    // Apply premium scaling shuffle transition state
    items.forEach(item => item.classList.add('shuffling'));

    setTimeout(() => {
      // Fisher-Yates array shuffler
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }

      // Re-append items in standard order (browser transitions slide them seamlessly)
      items.forEach(item => {
        item.classList.remove('shuffling');
        galleryGrid.appendChild(item);
      });

      // Update positions
      window.layoutMasonry();
    }, 400); // 400ms visual slide transition delay
  }, 10000);
};


/* ================================================================
   DATABASE REAL-TIME SYNC
   ================================================================ */

/**
 * window.initRealtimeGallery()
 * Dynamic updates subscription for uploads, edits, and deletions.
 */
window.initRealtimeGallery = function () {
  // Static site version does not subscribe to backend updates.
  return;
};


/* ================================================================
   MUTATIONOBSERVER - BULLETPROOF RENDER TRIGGER
   ================================================================ */

/**
 * observeGalleryGrid()
 * Automatically recalculates layout when rendering code injects items.
 */
function observeGalleryGrid() {
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  const observer = new MutationObserver(() => {
    if (galleryGrid.closest('.museum-gallery-section')) {
      window.init3DGallery?.();
      return;
    }
    window.layoutMasonry();
  });

  observer.observe(galleryGrid, { childList: true });
}

/* ================================================================
   FAQ ACCORDION — Premium Interaction Logic
   ================================================================ */
function initFaqAccordion() {
  const accordion = document.getElementById('faq-accordion');
  if (!accordion) return;

  // Event delegation for clicks on accordion buttons
  accordion.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-question');
    if (!btn) return;

    const item = btn.closest('.faq-item');
    if (!item) return;

    const answer = item.querySelector('.faq-answer');
    if (!answer) return;

    const isOpen = item.classList.contains('is-open');
    const items = accordion.querySelectorAll('.faq-item');

    // Close all other items first
    items.forEach(other => {
      if (other !== item && other.classList.contains('is-open')) {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.faq-question');
        const otherAnswer = other.querySelector('.faq-answer');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherAnswer) otherAnswer.style.maxHeight = '0';
      }
    });

    // Toggle current item
    if (isOpen) {
      item.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      answer.style.maxHeight = '0';
    } else {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });

  // Subtle parallax on mouse move for FAQ items
  const section = document.getElementById('faq-section');
  if (section && window.innerWidth > 960) {
    section.addEventListener('mousemove', (e) => {
      const items = accordion.querySelectorAll('.faq-item');
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      items.forEach((item, i) => {
        const factor = (i % 2 === 0) ? 0.8 : -0.6;
        const tx = x * factor * 2;
        const ty = y * factor * 1.5;
        if (!item.classList.contains('is-open')) {
          item.style.transform = `translateY(0) translate(${tx}px, ${ty}px)`;
        }
      });
    });

    section.addEventListener('mouseleave', () => {
      const items = accordion.querySelectorAll('.faq-item');
      items.forEach(item => {
        if (!item.classList.contains('is-open')) {
          item.style.transform = '';
        }
      });
    });
  }
}

/* ================================================================
   LUXURY EDITORIAL HERO REDESIGN — Scroll Navigation
   ================================================================ */
function initScrollNavigation() {
  const header = document.querySelector('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ================================================================
   LUXURY EDITORIAL HERO REDESIGN — Magnetic Buttons
   ================================================================ */
function initMagneticButtons() {
  if (window.innerWidth <= 768) return;

  const buttons = document.querySelectorAll('#btn-hero-explore, #btn-hero-artists, .btn-primary, .btn-outline');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ================================================================
   LUXURY EDITORIAL HERO REDESIGN — Scroll Parallax Mural
   ================================================================ */
function initHeroParallax() {
  if (window.innerWidth <= 768) return;

  const mural = document.querySelector('.hero-mural');
  if (!mural) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    mural.style.transform = `translateY(${scrollY * 0.15}px)`;
  }, { passive: true });
}

/* ================================================================
   MOBILE NAVIGATION CONTROLLER — Hamburger & Slide-out
   ================================================================ */
function initMobileNavigation() {
  const hamburger = document.getElementById('nav-hamburger-toggle');
  const overlay = document.getElementById('mobile-menu-overlay');
  const closeBtn = document.getElementById('mobile-menu-close-btn');

  if (!hamburger || !overlay) return;

  const setMenuState = (shouldOpen) => {
    hamburger.classList.toggle('active', shouldOpen);
    overlay.classList.toggle('active', shouldOpen);
    hamburger.setAttribute('aria-expanded', String(shouldOpen));
    overlay.setAttribute('aria-hidden', String(!shouldOpen));

    document.documentElement.classList.toggle('menu-open', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
    document.documentElement.style.overflow = shouldOpen ? 'hidden' : '';
  };

  const setActiveLink = (hash) => {
    const links = overlay.querySelectorAll('.mobile-nav-link');
    const target = hash && hash.startsWith('#') ? hash : '#portfolio-section';
    links.forEach((link) => {
      const matches = link.getAttribute('href') === target;
      link.classList.toggle('is-active', matches);
    });
  };

  const openMenu = () => {
    setMenuState(true);
    const currentHash = window.location.hash || '#portfolio-section';
    setActiveLink(currentHash);
  };

  const closeMenu = () => {
    setMenuState(false);
  };

  hamburger.addEventListener('click', () => {
    const isActive = hamburger.classList.contains('active');
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeMenu();
    }
  });

  const links = overlay.querySelectorAll('.mobile-nav-link');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      setActiveLink(link.getAttribute('href'));
      closeMenu();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });

  setActiveLink(window.location.hash || '#portfolio-section');
}

/* ================================================================
   LUXURY EDITORIAL HERO REDESIGN — Stats Counter Animation
   ================================================================ */
function initStatsCounter() {
  const stats = document.querySelectorAll('.hero-stats .hero-stat-num');
  if (!stats.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    const useComma = el.getAttribute('data-comma') === 'true';
    const duration = 2000;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * target);
      
      let formatted = current;
      if (useComma) {
        formatted = current.toLocaleString();
      }
      
      el.textContent = formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        let finalFormatted = target;
        if (useComma) {
          finalFormatted = target.toLocaleString();
        }
        el.textContent = finalFormatted + suffix;
      }
    };

    requestAnimationFrame(update);
  };

  window.animateStatCounter = animateCounter;

  // Run immediately for all stats since they are in the hero section above the fold
  stats.forEach(stat => animateCounter(stat));
}


/* ================================================================
   MEET THE TEAM — Premium CSS/GSAP Animation Logic
   ================================================================ */
function initTeamMouseParallax() {
  if (window.innerWidth <= 992) return; // Disable tilt on mobile for performance

  document.querySelectorAll('.artists-bg .creator-card').forEach(card => {
    const frame = card.querySelector('.layered-frame');
    
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 3;
      const rotateX = -((y - centerY) / centerY) * 3;
      
      const moveX = ((x - centerX) / centerX) * 5;
      const moveY = ((y - centerY) / centerY) * 5;
      
      // Dynamic tilt on hover
      card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      card.style.boxShadow = `0 30px 65px rgba(28, 26, 23, 0.14), 0 12px 36px rgba(184, 147, 58, 0.08)`;
      
      if (frame) {
        // Floating frame parallax
        frame.style.transform = `translate3d(${moveX}px, ${moveY}px, 30px)`;
      }
      
      // Update variables for background parallax
      card.style.setProperty('--mx', `${moveX * -0.6}px`);
      card.style.setProperty('--my', `${moveY * -0.6}px`);
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
      if (frame) {
        frame.style.transform = '';
      }
    });
  });
}

function initTeamAnimations() {
  const section = document.getElementById('artists-section');
  if (!section) return;

  // Split title characters for reveal effect
  const mainTitle = section.querySelector('.sec-title-main');
  if (mainTitle && !mainTitle.querySelector('.char-reveal')) {
    const text = mainTitle.textContent.trim();
    mainTitle.innerHTML = text.split('').map(char => 
      char === ' ' 
        ? '&nbsp;' 
        : `<span class="char-reveal" style="display:inline-block; opacity:0; transform:translateY(15px); transition: transform 0.4s ease, opacity 0.4s ease;">${char}</span>`
    ).join('');
  }

  // Scroll reveal trigger
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Heading character reveal
        if (typeof gsap !== 'undefined') {
          // Only animate char-reveal spans if any exist
          const charEls = section.querySelectorAll('.char-reveal');
          if (charEls.length > 0) {
            gsap.to(charEls, {
              opacity: 1,
              y: 0,
              stagger: 0.03,
              duration: 0.6,
              ease: 'power2.out'
            });
          }

          // Only animate subtitle if it exists
          const subTitle = section.querySelector('.sec-title-sub');
          if (subTitle) {
            gsap.fromTo(subTitle,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
            );
          }

          // Card reveal — only if cards exist
          const cards = section.querySelectorAll('.creator-card');
          if (cards.length > 0) {
            gsap.fromTo(cards,
              { opacity: 0, y: 50, scale: 0.96 },
              { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.18, delay: 0.15, ease: 'power3.out' }
            );
          }

          // Social icons — only if they exist
          const socialIcons = section.querySelectorAll('.creator-card-social .social-icon');
          if (socialIcons.length > 0) {
            gsap.fromTo(socialIcons,
              { opacity: 0, scale: 0.7 },
              { opacity: 1, scale: 1, duration: 0.45, stagger: 0.06, delay: 0.6, ease: 'back.out(1.6)' }
            );
          }
        } else {
          // Fallback if GSAP is not loaded
          section.querySelectorAll('.char-reveal').forEach(el => el.style.opacity = 1);
          section.querySelectorAll('.creator-card').forEach(el => el.style.opacity = 1);
        }
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(section);
}

// Call on load
window.addEventListener('load', () => {
  initTeamMouseParallax();
  initTeamAnimations();
});
