-- Migration: Website CMS Initial Data
-- Created: 2026-03-27

-- 1. Seed Website Pages
INSERT INTO public.website_pages (page_key, title, slug, body_json)
VALUES 
('home', 'Home', 'index', '{
  "hero_title": "Rethinking fashion patterns",
  "hero_subtitle": "Studio Macnas creates custom bags, explores compostable materials, and provides workshops on sustainable making.",
  "hero_image": "/images/website/home-hero.jpg",
  "intro_text": "Transforming the fashion industry by creating, innovating, and inspiring. Imagine a world where we only made products from materials so friendly to the earth that you could simply bury them after use.",
  "sections": [
    {
      "title": "Create",
      "text": "Custom design bags, made with care in our Utrecht studio.",
      "link": "/bags",
      "image": "/images/website/home-process.jpg"
    },
    {
      "title": "Innovate",
      "text": "Exploring undiscovered materials like cactus, apple, and mango leather.",
      "link": "/materials",
      "image": "/images/website/home-sustainable.png"
    },
    {
      "title": "Inspire",
      "text": "Events to inspire and educate on sustainable entrepreneurship.",
      "link": "/events",
      "image": "/images/website/home-studio.jpg"
    }
  ]
}'),
('bags', 'Bags', 'bags', '{
  "hero_title": "Custom bag designs",
  "description": "Unique handcrafted bags that tell a story. Crafted from leather and innovative, biodegradable materials.",
  "hero_image": "/images/website/bags-hero.jpg",
  "process_steps": [
    {"title": "Connect", "text": "Every design begins with a human connection."},
    {"title": "Design", "text": "Unique tailored designs."},
    {"title": "Prototype", "text": "Tested for form and functionality."},
    {"title": "Materials", "text": "Conscientiously chosen sustainable materials."},
    {"title": "Final", "text": "Meticulously handcrafted in Utrecht."}
  ],
  "pricing_range": "€300 to €800",
  "testimonials": [
    {"name": "Evelyn", "quote": "Sparkling, creative, artisanal. The result is fantastic."}
  ]
}'),
('materials', 'Materials', 'materials', '{
  "hero_title": "Finding the perfect material",
  "description": "Macnas focuses on making accessories without a footprint by using biodegradable materials.",
  "hero_image": "/images/website/materials-hero.jpg",
  "materials": [
    {"name": "Cactus Leather", "text": "Plant-based, durable, recycled polyester/cotton mix.", "image": "/images/website/material-cactus.jpg"},
    {"name": "Malai", "text": "Bacterial cellulose from coconut water waste. Compostable.", "image": "/images/website/material-malai.jpg"},
    {"name": "LOVR", "text": "Hemp-based compostable material designed to age and soften.", "image": "/images/website/material-lovr.jpg"},
    {"name": "Terralite", "text": "Soft, flexible, 50% lyocell and 50% viscose.", "image": "/images/website/material-terralite.jpg"},
    {"name": "Mycelium", "text": "Grown with hemp, natural look, compostable.", "image": "/images/website/material-mycelium.jpg"},
    {"name": "Apple", "text": "Made from apple waste of juice production.", "image": "/images/website/material-apple.jpg"}
  ]
}'),
('events', 'Events', 'events', '{
  "title": "Spread the love (and knowledge)",
  "hero_image": "/images/website/event-explorer.jpg",
  "upcoming_events": [
    {"date": "11-12 Oct", "title": "Atelier Route", "description": "Upcycle and repair event.", "image": "/images/website/event-atelier.jpg"},
    {"date": "8 Nov", "title": "U-Questionmark", "description": "Expo at the Kiemkamer.", "image": "/images/website/event-course.png"}
  ]
}'),
('contact', 'Contact', 'contact', '{
  "title": "Let’s Collaborate!",
  "description": "Together, we can change the patterns of the fashion world.",
  "email": "belinda@studiomacnas.com",
  "phone": "+31 6 45 43 65 15",
  "address": "Kanaalweg 30, 3526 KM Utrecht",
  "instagram": "studiomacnas"
}')
ON CONFLICT (page_key) DO UPDATE SET 
  body_json = EXCLUDED.body_json,
  title = EXCLUDED.title,
  slug = EXCLUDED.slug;
