-- Migration: Historic Project Migration
-- Created: 2026-03-27

-- 1. Ensure Historic Client exists
INSERT INTO public.clients (id, full_name, notes)
VALUES ('00000000-0000-0000-0000-000000000000', 'Studio Macnas (Historic)', 'Container for all projects migrated from the legacy website.')
ON CONFLICT (id) DO NOTHING;

-- 2. Migrate Projects
INSERT INTO public.projects (id, client_id, title, slug, public_title, public_description, status, publish_enabled, hero_image_path)
VALUES 
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Wither Bag', 'wither', 'Wither: The beauty of impermanence', 'Wither embraces ephemerality — the natural yet fleeting beauty of things that are not meant to last forever.', 'completed', true, '/images/website/project-wither-hero.jpg'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Felt Good Bag', 'felt-good', 'Felt Good: Compostable Softness', 'Material: Terralite by Cosm, a biobased material that’s 50% lyocell and 50% viscose.', 'completed', true, '/images/website/project-felt-good.jpg'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Hand in Hand', 'hand-in-hand', 'Hand in Hand: Malai Innovation', 'Material: Malai—a revolutionary fabric made from agricultural waste from the coconut industry.', 'completed', true, '/images/website/bags-co-creation.jpg'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Holster Design', 'holster', 'Custom Holster: Modern Craft', 'A pine green leather holster, finished with a rainbow stitch — built for movement.', 'completed', true, '/images/website/project-holster.png'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Basketball Backpack', 'basketball-bag', 'Basketball: Upcycled Sportsgear', 'Using old basketballs and basketball banners for durable backpacks.', 'completed', true, '/images/website/project-basket.jpg'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Mono Echo', 'mono-echo', 'Mono Echo: One life, one bag', 'Carrying markers of moments, echoes of life and use.', 'completed', true, '/images/website/project-mono.jpg'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'NM Utrecht Glasses Cases', 'nm-utrecht-cases', 'Upcycled Banners: NM Utrecht', 'Old NMU Roll-Up Banners transformed into colorful durable glasses cases.', 'completed', true, '/images/website/logo.png'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Wheelchair Bags', 'wheelchair-bags', 'Practical Beauty: Wheelchair bags', 'Developed for and with Aleidis, creating wheelchair bags that are beautiful and thoughtful.', 'completed', true, '/images/website/bags-collection.jpg'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Pojagi Statement', 'pojagi', 'Pojagi: The SDG-huis toolkit', 'Statement piece created for HU employees using 100% upcycled materials including tents and chutes.', 'completed', true, '/images/website/material-mycelium.jpg'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000000', 'Living Mycelium Bag', 'living-bag', 'Living Mycelium: A growing bag', 'Grown from mycelium, filled with soil for fresh plants to grow. The bag is truly living.', 'completed', true, '/images/website/project-wither-hero.jpg');
-- Note: Added 10 main projects. Remaining 9 are event/service based or variants.
