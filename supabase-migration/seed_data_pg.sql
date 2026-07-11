-- ============================================================
-- ashmijaincolor — Supabase (PostgreSQL) Seed Data
-- Run this AFTER supabase_schema.sql in the Supabase SQL Editor.
--
-- Source of truth: the actual fallback/display content baked into
-- frontend/index.html + frontend/js/public/*.js (artists-public.js,
-- portfolio-public.js, faqs-public.js, script.js). This replaces the
-- older generic seed_data_pg.sql (3 reviews / 5 old FAQs) with the
-- real content currently shown on the live site.
--
-- NOTE on `inquiries`: this table only ever gets real rows from the
-- public contact form — there's no "existing" inquiry content on the
-- site to extract. The 3 rows below are just demo/sample data so the
-- admin dashboard's Inquiries CRUD has something to test with. Delete
-- them any time from the admin panel.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Portfolio (4 items — matches getFallbackPortfolio() exactly)
-- ------------------------------------------------------------
INSERT INTO portfolio (title, artist_name, year, client, art_type, location, area, image_url, category, is_featured, is_hidden, display_order) VALUES
('Botanical Bloom', 'Priya Natarajan', 2024, 'Google India - Chennai Campus', 'Botanical Mural · Hand-Painted', 'Chennai, Tamil Nadu', '2,400 sq. ft.', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&h=900&q=80', 'corporate', true, false, 0),
('Urban Grid', 'Arun K.', 2024, 'WeWork - Bangalore Hub', 'Geometric Street Art', 'Bangalore, Karnataka', '850 sq. ft.', 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=600&h=400&q=80', 'corporate', false, false, 1),
('Golden Axis', 'Ravi S.', 2024, 'ITC Grand Chola', 'Gold Leaf Abstract', 'Guindy, Chennai', '680 sq. ft.', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=600&h=400&q=80', 'hotels', false, false, 2),
('Nebula', 'Divya M.', 2024, 'Zoho Corporation', 'Cosmic Mural · Spray Art', 'Tenkasi, Tamil Nadu', '1,500 sq. ft.', 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=600&h=400&q=80', 'corporate', false, false, 3);

-- ------------------------------------------------------------
-- 2. Artists (3 items — matches getFallbackArtists() exactly)
-- ------------------------------------------------------------
INSERT INTO artists (name, role, city, bio, quote, stats, image_url, fb_url, tw_url, ln_url, is_available, display_order) VALUES
('Vikram', 'Lead Artist, Urban & Abstract', 'Chennai', 'Specializing in geometric abstraction and large-scale urban realism, Vikram has spent the last 12 years collaborating with corporate campuses, hospitality interiors, and public districts to transform blank walls into local landmarks.', 'Art should not be confined behind closed doors. Corporate corridors and public walls are the spaces where street realism and daily life truly merge.', 'Featured in Elle Decor,80+ Projects', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=500', '#', '#', '#', true, 0),
('Ashmija S.R', 'Lead Artist, Muralist', 'Bengaluru', 'Merging intricate botanical illustrations with architectural backdrops, Ashmija''s nature-inspired murals and large-scale floral art pieces bring organic life and a sense of calm to high-end interiors across South Asia.', 'My work bridges the gap between concrete rooms and the wild serenity of nature. I paint to give blank walls a voice and spaces a heartbeat.', '120+ Murals,National Art Award', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=500', '#', '#', '#', true, 1),
('Meera S.', 'Fine Art & Botanical Specialist', 'Mumbai', 'With a background in classical fine art, Meera translates traditional oil and watercolor textures onto large indoor surfaces with detailed foliage patterns and calm, layered color stories.', 'A mural is a dialogue with the room, its light, and the people who move through it every day.', '90+ Paintings,Gold Medalist in Fine Arts', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500', '#', '#', '#', true, 2);

-- ------------------------------------------------------------
-- 3. Reviews / Testimonials (8 items — matches the 3D testimonial
--    carousel in script.js's init3DTestimonialCarousel() exactly.
--    `location` filled in where the site's "all reviews" modal
--    (STATIC_REVIEWS) gives one, NULL otherwise.)
-- ------------------------------------------------------------
INSERT INTO reviews (name, company, location, avatar_url, rating, review_text, is_approved, is_pinned) VALUES
('Kavitha', 'Director, Google Chennai', 'Chennai', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150', 5, 'ashmija in color transformed our empty lobby into an immersive botanical gallery. Our visitors are consistently wowed at first glance. Truly professional management from sketch to paint.', true, true),
('Vikram', 'Curator, Taj Group', 'Chennai', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150', 5, 'We wanted our restaurant wall to reflect the rich heritage of South India in a modern way. The geometric murals Priya designed did exactly that. Absolute masterpiece.', true, true),
('Ananya', 'Architect, Nair Villas', 'Bengaluru', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150', 5, 'Every detail of the custom installation inside our luxury courtyard was handled flawlessly. The weather-resistant paints are holding up beautifully under direct sun. Highly recommended.', true, true),
('Rahul', 'COO, Freshworks', NULL, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150', 5, 'The team transformed our entire 4th floor into a vibrant storytelling space. Employees now look forward to walking through those corridors every morning. Incredible attention to detail.', true, true),
('Priyanka', 'GM, Park Hyatt Chennai', NULL, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150', 5, 'Our lobby mural has become the most photographed spot in the hotel. Guests constantly ask about the artist. ashmija in color delivered well ahead of schedule with zero disruption to our operations.', true, true),
('Dr. Suresh', 'Principal, Sishya School', NULL, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150', 5, 'The children''s library mural is absolutely magical. It sparked a whole new interest in art among our students. The team was wonderful with the kids, even involving them in a small painting corner.', true, true),
('Arun', 'Founder, The Rustic Table', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150', 5, 'Our farm-to-table concept came alive through the mural they painted. It perfectly captures the spirit of fresh, local ingredients. Our social media engagement went up 60% after the mural reveal!', true, true),
('Maya', 'Owner, FitVerse Studio', NULL, 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=150&h=150', 5, 'The high-energy workout mural they designed completely transformed our studio''s atmosphere. Members love taking photos in front of it. Best investment we''ve made for our brand identity.', true, true);

-- ------------------------------------------------------------
-- 4. FAQs (8 items — matches FALLBACK_PUBLIC_FAQS in
--    faqs-public.js exactly)
-- ------------------------------------------------------------
INSERT INTO faqs (question, answer, category, is_visible, display_order) VALUES
('How does the mural creation process work?', 'Our process begins with a detailed consultation where we understand your space, vision, and brand story. We then provide curated artist recommendations, mood boards, and digital mockups for your approval. Once the design is finalised, our team handles everything from surface preparation and scaffolding to the final UV-resistant clear coat.', 'General', true, 0),
('What is the typical timeline for a mural project?', 'Timelines vary depending on the scale and complexity of the artwork. A small indoor accent wall typically takes 3-5 days, while a large exterior mural can take 2-4 weeks. The design and approval phase usually takes an additional 1-2 weeks.', 'General', true, 1),
('What types of paints and materials do you use?', 'We use premium, eco-certified paints that are UV-resistant, weatherproof, and non-toxic. For outdoor murals, we apply specialised anti-graffiti and UV-protective clear coats that help the artwork retain its vibrancy for years.', 'General', true, 2),
('How is pricing determined for mural projects?', 'Pricing depends on wall size, design complexity, surface condition, location, and artist specialisation. We provide transparent, itemised quotes after the initial site assessment and work within your budget to find the best creative solution.', 'General', true, 3),
('Can I choose or request a specific artist?', 'Absolutely. During consultation, we present artist portfolios that best match your project aesthetic, and you have full creative control over the final artist selection.', 'General', true, 4),
('Do you work on both commercial and residential projects?', 'Yes. We work across all scales, from intimate bedroom accent walls to corporate offices, hotel lobbies, restaurants, schools, and public art installations.', 'General', true, 5),
('What happens if I am not satisfied with the design?', 'We include revision rounds during the digital mockup stage before paint touches the wall. The project moves forward only after you are aligned with the concept, colour palette, and composition.', 'General', true, 6),
('Do you provide maintenance after the mural is completed?', 'Yes. We share simple care instructions after handover and can schedule periodic touch-ups or protective coat refreshes for high-traffic and outdoor murals. Our team will recommend the right maintenance plan based on the wall surface, location, and exposure.', 'General', true, 7);

-- ------------------------------------------------------------
-- 5. Inquiries — DEMO DATA ONLY (see note at top). Not sourced
--    from the frontend, just enough to exercise the admin CRUD.
-- ------------------------------------------------------------
INSERT INTO inquiries (name, email, phone, message, status) VALUES
('Sundar Raj', 'sundar.raj@example.com', '+91 9840012345', 'Hi, we are looking for a geometric mural for our new co-working space in Coimbatore, roughly 1000 sq. ft. Could you share a quote?', 'new'),
('Divya Menon', 'divya.menon@example.com', '+91 9884456123', 'We loved the Botanical Bloom project at Google India. Would love something similar for our office lobby in Kochi.', 'in_progress'),
('Hotel Serene Bay', 'events@serenebay.example.com', '+91 9600078234', 'Looking for a large abstract mural for our new hotel lobby (approx 1800 sq ft). Timeline is flexible, budget is premium.', 'resolved');
