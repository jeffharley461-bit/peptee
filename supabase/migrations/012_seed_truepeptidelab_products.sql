-- Migration 012: Seed product catalog (mirrors truepeptidelab.com product listing)
-- Product names, specifications and availability are factual catalog data.
-- Prices converted from GBP to USD at an approximate rate of 1.30.
-- All products are supplied strictly for laboratory and research purposes.

INSERT INTO categories (name, description) VALUES
  ('Peptides',               'Research-grade peptides, 99%+ purity with COA'),
  ('Research Bundles',       'Curated multi-peptide kits for lab efficiency'),
  ('Laboratory Accessories', 'Reconstitution, storage and handling essentials')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (category_id, name, description, price_usd, molecular_weight, stock_status) VALUES
  -- ── Peptides ──────────────────────────────────────────────────────────────
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'BPC-157',
   'BPC-157 is a synthetic pentadecapeptide derived from a protein fragment originally found in gastric juice. It is studied in research settings for its potential effects on tissue healing and vascular pathways.',
   45.49, 1419.00, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'TB-500',
   'TB-500 (Thymosin Beta-4) is based on the actin-binding protein thymosin beta-4. It is investigated in research for its role in cell migration, angiogenesis, and tissue repair signalling pathways.',
   71.49, 2232.50, 'out_of_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'GHK-Cu',
   'GHK-Cu is a copper complex of the naturally occurring tripeptide glycyl-histidyl-lysine (GHK). It is widely studied in research for its effects on connective tissue remodelling and regenerative signalling.',
   32.49, 403.40, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'NAD+',
   'NAD+ (nicotinamide adenine dinucleotide) is a critical coenzyme involved in cellular energy metabolism, sirtuin activation, and redox balance. It is a focus of current longevity and metabolic research.',
   97.49, 663.43, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'MOTS-c',
   'MOTS-c is a mitochondrial-derived peptide encoded in mitochondrial DNA. It is studied in research for its influence on metabolic regulation, insulin sensitivity, and exercise-related signalling.',
   38.99, 2196.08, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'CJC-1295',
   'CJC-1295 is a synthetic analogue of growth hormone-releasing hormone (GHRH), designed for a prolonged half-life. It is researched for its effects on growth hormone signalling pathways.',
   45.49, NULL, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'Selank 10mg',
   'Selank is a synthetic heptapeptide based on the tuftsin sequence. It is studied in research for its potential anxiolytic-like effects and modulation of the serotonergic system.',
   39.00, 992.10, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'Semax 10mg',
   'Semax is a synthetic analogue of a fragment of adrenocorticotropic hormone (ACTH 4-10). It is investigated in neurocognitive research for its potential influence on learning, memory, and neuroprotection.',
   39.00, 984.10, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'SLU-PP-332',
   'SLU-PP-332 is a research compound that acts as an agonist of oestrogen-related receptors (ERRs). It is studied for its role in metabolic signalling and energy homeostasis.',
   77.99, NULL, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'Glutathione',
   'Glutathione is a tripeptide composed of glutamine, cysteine, and glycine. It plays a central role in cellular antioxidant defence and redox regulation and is a common subject of research.',
   77.99, 307.32, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Peptides'),
   'IGF-1 LR3',
   'IGF-1 LR3 is a synthetic long-acting analogue of insulin-like growth factor 1 (IGF-1). It is engineered with a longer half-life for studies into growth, anabolic, and metabolic pathways.',
   58.49, NULL, 'in_stock'),

  -- ── Research Bundles ──────────────────────────────────────────────────────
  ((SELECT id FROM categories WHERE name = 'Research Bundles'),
   'Comprehensive Research Bundle',
   'A curated multi-peptide research kit designed to support broad exploration across multiple biological pathways in a single laboratory study.',
   103.99, NULL, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Research Bundles'),
   'Foundation Research Bundle',
   'A foundational research stack of high-purity peptides intended as a baseline combination for routine laboratory study protocols.',
   155.99, NULL, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Research Bundles'),
   'Mitochondrial Pathway Research Bundle',
   'A research bundle focused on mitochondrial biology, cellular energy production, and metabolic pathway studies.',
   129.99, NULL, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Research Bundles'),
   'Tissue Pathway Research Bundle',
   'A structured research combination developed for the study of tissue-related repair and regenerative signalling pathways.',
   136.49, NULL, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Research Bundles'),
   'Cellular Oxidative Stress Research Bundle',
   'A research bundle centred on cellular oxidative stress, redox status, and antioxidant defence mechanisms.',
   194.99, NULL, 'in_stock'),
  ((SELECT id FROM categories WHERE name = 'Research Bundles'),
   'Cellular Ageing Research Bundle',
   'A research kit aimed at cellular ageing, senescence, and longevity-related biological pathway studies.',
   311.99, NULL, 'in_stock'),

  -- ── Laboratory Accessories ────────────────────────────────────────────────
  ((SELECT id FROM categories WHERE name = 'Laboratory Accessories'),
   'Peptide Storage Case',
   'A laboratory storage case designed to keep lyophilised peptide vials organised, labelled, and protected during storage.',
   32.49, NULL, 'out_of_stock'),
  ((SELECT id FROM categories WHERE name = 'Laboratory Accessories'),
   'Portable Cooling Case',
   'A portable cooling case for maintaining temperature-sensitive research samples during transport and laboratory handling.',
   77.99, NULL, 'out_of_stock'),
  ((SELECT id FROM categories WHERE name = 'Laboratory Accessories'),
   'Bacteriostatic Water',
   'Bacteriostatic water for laboratory use in reconstituting and diluting research-grade lyophilised peptides.',
   3.89, NULL, 'out_of_stock');

-- Remove the unused placeholder categories seeded in migration 001
-- (kept only if they still have no associated products).
DELETE FROM categories
WHERE name IN ('Research Peptides','Cosmetic Peptides','Performance Peptides','Therapeutic Peptides','Custom Peptides')
  AND NOT EXISTS (SELECT 1 FROM products WHERE products.category_id = categories.id);