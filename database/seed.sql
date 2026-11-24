-- ═══════════════════════════════════════════════════════════════
--  MIRAAYA JEWELS — Seed Data
--  Run AFTER schema.sql:
--    mysql -u root -p miraaya_jewels < database/seed.sql
-- ═══════════════════════════════════════════════════════════════

USE miraaya_jewels;

-- ── Admin user (password: Admin@123) ──────────────────────────
-- Hash generated with bcrypt rounds=12. Change password in production!
INSERT IGNORE INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@miraayajewels.com',
        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RlHzqJWO6', 'admin');

-- ── Products ───────────────────────────────────────────────────
INSERT IGNORE INTO products (name, slug, description, price, mrp, category, image_url, specs, is_featured)
VALUES

-- Featured Products
('Rani Kundan Floral Bangle Pair',
 'rani-kundan-floral-bangle-pair',
 'A regal pair of Kundan bangles featuring an intricate floral pattern. Set with vivid green kundan stones and pearl accents, these bangles are a timeless choice for weddings, festivals, and special occasions.',
 2650, 3050, 'Bangles', '/images/products/bangle-pair.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Kundan & Pearl"],["Weight","~95g (pair)"],["Size","2.4\\\" / 2.6\\\" / 2.8\\\""],["Occasion","Bridal, Wedding, Festive"]]',
 1),

('Green Stone Kundan Jhumka Earrings',
 'green-stone-kundan-jhumka-earrings',
 'Elegantly crafted Kundan jhumka earrings with vivid green stone centres. The cascading bell design and intricate gold-tone work makes these perfect for both festive and casual wear.',
 1800, 2200, 'Earrings', '/images/products/jhumka-earrings.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Kundan"],["Closure","Push back"],["Length","~5.5 cm"],["Occasion","Festive, Casual, Party"]]',
 1),

('Triple Layer Kundan Necklace Set',
 'triple-layer-kundan-necklace-set',
 'A stunning triple-layer Kundan necklace set that exudes royalty. Features three tiers of intricate Kundan work with green stone drops and freshwater pearl beading, complete with matching earrings.',
 3200, 3800, 'Necklaces', '/images/products/necklace-set.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Kundan & Pearl"],["Length","14–18 inch"],["Includes","Necklace + Earrings"],["Occasion","Bridal, Wedding"]]',
 1),

('Green Stone Cocktail Ring',
 'green-stone-cocktail-ring',
 'A bold statement cocktail ring featuring a large emerald-green stone in a detailed gold-tone filigree setting. Adjustable band fits most sizes.',
 1250, 1600, 'Rings', '/images/products/cocktail-ring.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Green semi-precious"],["Band","Adjustable"],["Weight","~15g"],["Occasion","Party, Festive"]]',
 1),

-- New Arrivals
('Kundan Pearl Passa Hair Ornament',
 'kundan-pearl-passa-hair-ornament',
 'A traditional bridal side-tikka (passa) crafted with intricate Kundan work and cascading freshwater pearls. Worn to the left side of the head, this ornament elevates any bridal look.',
 2400, 2800, 'Hair Accessories', '/images/products/passa-ornament.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Kundan & Pearl"],["Chain length","~18 inch"],["Occasion","Bridal, Wedding"]]',
 0),

('Ruby Heart Dial Cuff Watch',
 'ruby-heart-dial-cuff-watch',
 'A unique fusion of fashion jewellery and timepiece — the Ruby Heart Dial Cuff Watch features a heart-shaped ruby-red dial seamlessly integrated into an engraved gold-tone cuff bracelet.',
 2900, 3400, 'Watches', '/images/products/cuff-watch.jpg',
 '[["Movement","Quartz"],["Metal","Gold-toned alloy"],["Dial","Heart-shape, ruby red"],["Water resistance","Splash resistant"],["Battery","Included"]]',
 0),

('Pearl Layer Peacock Necklace Set',
 'pearl-layer-peacock-necklace-set',
 'Inspired by the grandeur of the Indian peacock, this multi-layer necklace set features a central peacock motif with enamel detailing and three layers of freshwater pearls.',
 3500, 4100, 'Necklaces', '/images/products/peacock-necklace.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Enamel & Pearl"],["Length","12–18 inch"],["Includes","Necklace + Earrings"],["Occasion","Bridal, Festive"]]',
 0),

('Peacock Arch Pearl Jhumka Earrings',
 'peacock-arch-pearl-jhumka-earrings',
 'Beautifully crafted jhumka earrings with an arched peacock stud top and a hanging pearl jhumka bell. The peacock enamel work in blue and green makes these a unique statement piece.',
 1950, 2400, 'Earrings', '/images/products/peacock-earrings.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Enamel & Pearl"],["Length","~5 cm"],["Closure","Push back"],["Occasion","Festive, Bridal"]]',
 0),

-- Additional Products
('Sparkle Stone Bangle Pair',
 'sparkle-stone-bangle-pair',
 'A pair of gold-tone bangles encrusted with sparkling white crystal stones in an intricate openwork floral pattern.',
 1750, 2275, 'Bangles', '/images/products/sparkle-bangle.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","White crystal"],["Weight","~70g (pair)"],["Occasion","Festive, Party"]]',
 0),

('Pearl Fringe Meenakari Bangles',
 'pearl-fringe-meenakari-bangles',
 'Traditional Meenakari enamel bangles with vibrant floral motifs and hanging pearl fringe along the rim.',
 2750, 3175, 'Bangles', '/images/products/meenakari-bangles.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Enamel & Pearl"],["Occasion","Bridal, Festive"]]',
 0),

('Royal Enamel Kada Pair',
 'royal-enamel-kada-pair',
 'Elegant kadas with royal blue enamel inlay and kundan accents. A timeless pair for weddings and ceremonies.',
 2550, 2950, 'Bangles', '/images/products/bangle-pair.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Enamel & Kundan"],["Occasion","Bridal, Wedding"]]',
 0),

('Rajwadi Blossom Kada Pair',
 'rajwadi-blossom-kada-pair',
 'Intricate kadas with blossom motifs and pearl detailing. Inspired by Rajasthani royal jewellery traditions.',
 2700, 3050, 'Bangles', '/images/products/meenakari-bangles.jpg',
 '[["Metal","Gold-toned alloy"],["Stone","Pearl & Kundan"],["Occasion","Bridal, Festive"]]',
 0);

SELECT CONCAT('Products inserted: ', COUNT(*)) AS result FROM products;
SELECT 'Seed data loaded successfully!' AS status;
