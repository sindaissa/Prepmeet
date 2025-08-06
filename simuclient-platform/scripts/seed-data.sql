-- Insérer des utilisateurs de test
INSERT INTO users (id, email, password_hash, name, role, department, position) VALUES
(uuid_generate_v4(), 'admin@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Administrateur Système', 'admin', 'IT', 'Administrateur'),
(uuid_generate_v4(), 'manager.commercial@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Marie Dubois', 'manager', 'Conseil en Management', 'Manager Commercial'),
(uuid_generate_v4(), 'consultant1@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Pierre Martin', 'user', 'Conseil en Management', 'Consultant Senior'),
(uuid_generate_v4(), 'consultant2@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Sophie Laurent', 'user', 'Transformation Digitale', 'Consultante'),
(uuid_generate_v4(), 'consultant3@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Thomas Rousseau', 'user', 'Data & Analytics', 'Consultant Data'),
(uuid_generate_v4(), 'manager.conseil@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Marie Dubois', 'manager', 'Conseil en Management', 'Manager'),
(uuid_generate_v4(), 'consultant.digital@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Pierre Martin', 'user', 'Transformation Digitale', 'Consultant Senior'),
(uuid_generate_v4(), 'consultant.data@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Sophie Laurent', 'user', 'Data & Analytics', 'Consultante'),
(uuid_generate_v4(), 'manager.cyber@talan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 'Thomas Rousseau', 'manager', 'Cybersécurité', 'Manager Cybersécurité')
ON CONFLICT (email) DO NOTHING;

-- Insérer des clients réels de Talan
INSERT INTO clients (id, name, company, sector, position, personality_type, communication_style, decision_making_style, pain_points, goals, background, avatar_url) VALUES
(uuid_generate_v4(), 'BNP Paribas', 'BNP Paribas', 'Banque & Finance', 'Grande entreprise', 'Leader européen des services bancaires et financiers, BNP Paribas accompagne ses clients particuliers, entreprises et institutionnels dans leurs projets en France et à l''international.', 'Institutionnel', 'Collaboratif', '["Digitalisation du système éducatif", "Gestion des données élèves", "Sécurité des systèmes"]', '["Moderniser l''éducation", "Améliorer les performances", "Réduire les inégalités"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Société Générale', 'Société Générale', 'Banque & Finance', 'Grande entreprise', 'Groupe bancaire français de dimension internationale, Société Générale accompagne 31 millions de clients dans le monde avec des équipes de 133 000 collaborateurs.', 'Direct', 'Méthodique', '["Transformation digitale", "Conformité réglementaire", "Expérience client digitale"]', '["Accélérer la digitalisation", "Améliorer l''efficacité opérationnelle", "Renforcer la sécurité"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Orange', 'Orange', 'Télécommunications', 'Grande entreprise', 'Acteur majeur des télécommunications en France et en Europe, Orange propose des services de téléphonie, internet et télévision aux particuliers et entreprises.', 'Inspirant', 'Décisif', '["Transformation cloud", "5G deployment", "Cybersécurité des réseaux"]', '["Moderniser l''infrastructure", "Accélérer la 5G", "Renforcer la sécurité"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'SNCF Connect', 'SNCF Connect', 'Transport', 'Grande entreprise', 'Service de réservation et d''information voyageurs de la SNCF, SNCF Connect facilite les déplacements en train partout en France et en Europe.', 'International', 'Collaboratif', '["Industrie 4.0", "IoT industriel", "Supply chain digitale"]', '["Digitaliser la production", "Optimiser la supply chain", "Innover en R&D"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Carrefour', 'Carrefour', 'Grande distribution', 'Grande entreprise', 'Leader de la grande distribution en France, Carrefour propose une offre complète de produits alimentaires et non-alimentaires dans ses magasins et en ligne.', 'Charismatique', 'Rapide', '["Expansion internationale", "Innovation produit", "Transformation digitale"]', '["Croître à l''international", "Innover constamment", "Optimiser l''efficacité"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Renault Group', 'Renault Group', 'Automobile', 'Grande entreprise', 'Constructeur automobile français, Renault Group conçoit, fabrique et commercialise des véhicules particuliers et utilitaires sous les marques Renault, Dacia et Alpine.', 'Technique', 'Méthodique', '["Modernisation SI", "Cloud hybride", "Sécurité des données"]', '["Optimiser les coûts IT", "Améliorer la performance", "Assurer la conformité"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Thales', 'Thales', 'Défense & Aéronautique', 'Grande entreprise', 'Groupe international de haute technologie, Thales investit dans les innovations du numérique et de la "deep tech" pour connecter et sécuriser nos mondes.', 'International', 'Collaboratif', '["5G et innovation", "Transformation digitale", "Expansion africaine"]', '["Leader sur la 5G", "Croître en Afrique", "Innover en services"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Airbus', 'Airbus', 'Aéronautique', 'Grande entreprise', 'Leader mondial de l''aéronautique, de l''espace et des services connexes, Airbus conçoit, fabrique et livre des produits, services et solutions aéronautiques.', 'Médiatique', 'Collaboratif', '["Transition énergétique", "Smart grids", "Développement durable"]', '["Accélérer la transition", "Innover en énergie verte", "Optimiser les réseaux"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Veolia', 'Veolia', 'Environnement', 'Grande entreprise', 'Leader mondial des services à l''environnement, Veolia conçoit et déploie des solutions pour la gestion de l''eau, des déchets et de l''énergie.', 'Institutionnel', 'Décisif', '["Transformation numérique", "Contenus digitaux", "Audience jeune"]', '["Moderniser l''audiovisuel", "Conquérir le digital", "Innover en contenu"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Capgemini', 'Capgemini', 'Conseil & Services IT', 'Grande entreprise', 'Leader mondial du conseil, des services informatiques et de la transformation numérique, Capgemini accompagne ses clients dans leur évolution digitale.', 'Analytique', 'Précis', '["Fintech integration", "Regulatory compliance", "Digital banking"]', '["Optimiser les performances", "Innover en finance", "Maîtriser les risques"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Schneider Electric', 'Schneider Electric', 'Industrie & Énergie', 'Grande entreprise', 'Spécialiste mondial de la gestion de l''énergie et des automatismes, Schneider Electric développe des solutions connectées pour l''efficacité énergétique.', 'Entrepreneur', 'Stratégique', '["Expansion internationale", "Innovation produit", "Transformation digitale"]', '["Croître à l''international", "Innover constamment", "Optimiser l''efficacité"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'L''Oréal', 'L''Oréal', 'Cosmétiques', 'Grande entreprise', 'Leader mondial de la beauté, L''Oréal développe, fabrique et commercialise des produits cosmétiques, capillaires et dermatologiques de haute qualité.', 'Créative', 'Collaboratif', '["5G et innovation", "Transformation digitale", "Expansion africaine"]', '["Leader sur la 5G", "Croître en Afrique", "Innover en services"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Danone', 'Danone', 'Agroalimentaire', 'Grande entreprise', 'Entreprise alimentaire mondiale, Danone développe des produits laitiers, des eaux, de la nutrition infantile et médicale dans le monde entier.', 'Institutionnel', 'Décisif', '["Transition énergétique", "Smart grids", "Développement durable"]', '["Accélérer la transition", "Innover en énergie verte", "Optimiser les réseaux"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Crédit Agricole', 'Crédit Agricole', 'Banque & Finance', 'Grande entreprise', 'Premier financeur de l''économie française, Crédit Agricole est une banque universelle coopérative et mutualiste au service de 52 millions de clients.', 'Analytique', 'Précis', '["Fintech integration", "Regulatory compliance", "Digital banking"]', '["Optimiser les performances", "Innover en finance", "Maîtriser les risques"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'EDF', 'EDF', 'Énergie', 'Grande entreprise', 'Premier électricien mondial, EDF produit, transporte, distribue et commercialise l''électricité en France et dans le monde, avec un mix énergétique bas carbone.', 'Entrepreneur', 'Stratégique', '["Expansion internationale", "Innovation produit", "Transformation digitale"]', '["Croître à l''international", "Innover constamment", "Optimiser l''efficacité"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'LVMH', 'LVMH', 'Luxe', 'Grande entreprise', 'Leader mondial du luxe, LVMH rassemble 75 Maisons d''exception dans les secteurs des vins et spiritueux, mode et maroquinerie, parfums et cosmétiques, montres et joaillerie.', 'Institutionnel', 'Décisif', '["5G et innovation", "Transformation digitale", "Expansion africaine"]', '["Leader sur la 5G", "Croître en Afrique", "Innover en services"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Total Energies', 'Total Energies', 'Énergie', 'Grande entreprise', 'Compagnie multi-énergies mondiale, TotalEnergies produit et commercialise des énergies : pétrole et biocarburants, gaz naturel et gaz verts, renouvelables et électricité.', 'Charismatique', 'Rapide', '["Expansion internationale", "Innovation produit", "Transformation digitale"]', '["Croître à l''international", "Innover constamment", "Optimiser l''efficacité"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Bouygues', 'Bouygues', 'BTP & Télécoms', 'Grande entreprise', 'Groupe industriel diversifié, Bouygues opère dans la construction, les télécoms et médias, avec des positions de leader sur ses marchés.', 'Technique', 'Méthodique', '["Modernisation SI", "Cloud hybride", "Sécurité des données"]', '["Optimiser les coûts IT", "Améliorer la performance", "Assurer la conformité"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Peugeot', 'Peugeot', 'Automobile', 'Grande entreprise', 'Marque automobile française du groupe Stellantis, Peugeot conçoit et commercialise des véhicules particuliers et utilitaires innovants et durables.', 'Institutionnel', 'Décisif', '["5G et innovation", "Transformation digitale", "Expansion africaine"]', '["Leader sur la 5G", "Croître en Afrique", "Innover en services"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Michelin', 'Michelin', 'Pneumatiques', 'Grande entreprise', 'Leader mondial de la mobilité durable, Michelin conçoit, fabrique et commercialise des pneumatiques pour tous types de véhicules et applications.', 'Médiatique', 'Collaboratif', '["Transition énergétique", "Smart grids", "Développement durable"]', '["Accélérer la transition", "Innover en énergie verte", "Optimiser les réseaux"]', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Jean-Michel Blanquer', 'Ministère de l\'Éducation Nationale', 'Public', 'Ministre', 'Visionnaire', 'Institutionnel', 'Collaboratif', '["Digitalisation du système éducatif", "Gestion des données élèves", "Sécurité des systèmes"]', '["Moderniser l\'éducation", "Améliorer les performances", "Réduire les inégalités"]', 'Ancien ministre de l\'Éducation nationale, expert en politiques éducatives et transformation digitale du secteur public.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Catherine MacLeod', 'BNP Paribas', 'Banque', 'Chief Digital Officer', 'Analytique', 'Direct', 'Méthodique', '["Transformation digitale", "Conformité réglementaire", "Expérience client digitale"]', '["Accélérer la digitalisation", "Améliorer l\'efficacité opérationnelle", "Renforcer la sécurité"]', 'Responsable de la transformation digitale chez BNP Paribas, experte en innovation financière et technologies bancaires.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Olivier Letac', 'Société Générale', 'Banque', 'Directeur Innovation', 'Innovateur', 'Collaboratif', 'Agile', '["Innovation technologique", "Time-to-market", "Intégration des fintechs"]', '["Développer de nouveaux services", "Améliorer l\'agilité", "Créer de la valeur"]', 'Directeur Innovation à la Société Générale, spécialisé dans les nouvelles technologies financières et l\'écosystème fintech.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Marie-Hélène Habert-Ozer', 'Orange', 'Télécommunications', 'Directrice Exécutive', 'Stratégique', 'Inspirant', 'Décisif', '["Transformation cloud", "5G deployment", "Cybersécurité des réseaux"]', '["Moderniser l\'infrastructure", "Accélérer la 5G", "Renforcer la sécurité"]', 'Directrice exécutive chez Orange, experte en télécommunications et transformation des infrastructures réseau.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Philippe Ensarguet', 'Crédit Agricole', 'Banque', 'DSI Groupe', 'Pragmatique', 'Technique', 'Méthodique', '["Modernisation SI", "Cloud hybride", "Sécurité des données"]', '["Optimiser les coûts IT", "Améliorer la performance", "Assurer la conformité"]', 'DSI du Groupe Crédit Agricole, expert en systèmes d\'information bancaires et architecture IT complexe.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Nathalie Wright', 'Airbus', 'Aéronautique', 'VP Digital Transformation', 'Visionnaire', 'International', 'Collaboratif', '["Industrie 4.0", "IoT industriel", "Supply chain digitale"]', '["Digitaliser la production", "Optimiser la supply chain", "Innover en R&D"]', 'Vice-Présidente Transformation Digitale chez Airbus, spécialisée dans l\'industrie 4.0 et l\'innovation aéronautique.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Bertrand Dumazy', 'Edenred', 'Services', 'CEO', 'Entrepreneur', 'Charismatique', 'Rapide', '["Expansion internationale", "Innovation produit", "Transformation digitale"]', '["Croître à l\'international", "Innover constamment", "Optimiser l\'efficacité"]', 'CEO d\'Edenred, leader dans les solutions de paiement dématérialisées et services aux entreprises.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Isabelle Kocher', 'Engie', 'Énergie', 'Directrice Générale', 'Transformatrice', 'Inspirant', 'Stratégique', '["Transition énergétique", "Smart grids", "Développement durable"]', '["Accélérer la transition", "Innover en énergie verte", "Optimiser les réseaux"]', 'Ancienne DG d\'Engie, experte en transition énergétique et transformation des services énergétiques.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Stéphane Richard', 'Orange', 'Télécommunications', 'Président-Directeur Général', 'Leader', 'Institutionnel', 'Décisif', '["5G et innovation", "Transformation digitale", "Expansion africaine"]', '["Leader sur la 5G", "Croître en Afrique", "Innover en services"]', 'Ancien PDG d\'Orange, expert en télécommunications et stratégie de croissance internationale.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Henri de Castries', 'AXA', 'Assurance', 'Président du Conseil', 'Stratégique', 'Institutionnel', 'Réfléchi', '["Transformation digitale", "Gestion des risques", "Innovation en assurance"]', '["Moderniser l\'assurance", "Gérer les nouveaux risques", "Croître durablement"]', 'Ancien PDG d\'AXA, expert en assurance, gestion des risques et transformation du secteur financier.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'Delphine Ernotte', 'France Télévisions', 'Médias', 'Présidente', 'Créative', 'Médiatique', 'Collaboratif', '["Transformation numérique", "Contenus digitaux", "Audience jeune"]', '["Moderniser l\'audiovisuel", "Conquérir le digital", "Innover en contenu"]', 'Présidente de France Télévisions, experte en médias, transformation digitale de l\'audiovisuel public.', '/placeholder.svg?height=100&width=100'),
(uuid_generate_v4(), 'François Riahi', 'Natixis', 'Banque d\'investissement', 'Directeur Général', 'Financier', 'Analytique', 'Précis', '["Fintech integration", "Regulatory compliance", "Digital banking"]', '["Optimiser les performances", "Innover en finance", "Maîtriser les risques"]', 'DG de Natixis, expert en banque d\'investissement et innovation financière.', '/placeholder.svg?height=100&width=100')
ON CONFLICT (id) DO NOTHING;

-- Insérer quelques simulations d'exemple
INSERT INTO simulations (user_id, client_id, meeting_type, status, started_at, completed_at, duration_minutes, confidence_score, feedback) 
SELECT 
    u.id,
    c.id,
    'Découverte',
    'completed',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '45 minutes',
    45,
    0.78,
    'Excellente simulation, le client était très réceptif aux arguments présentés.'
FROM users u, clients c 
WHERE u.email = 'consultant1@talan.com' AND c.name = 'BNP Paribas'
LIMIT 1;

INSERT INTO simulations (user_id, client_id, meeting_type, status, started_at, completed_at, duration_minutes, confidence_score, feedback) 
SELECT 
    u.id,
    c.id,
    'Présentation solution',
    'completed',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day' + INTERVAL '60 minutes',
    60,
    0.85,
    'Très bonne présentation technique, quelques objections bien gérées.'
FROM users u, clients c 
WHERE u.email = 'consultant2@talan.com' AND c.name = 'Orange'
LIMIT 1;

INSERT INTO simulations (user_id, client_id, meeting_type, status, started_at) 
SELECT 
    u.id,
    c.id,
    'Négociation',
    'active',
    NOW() - INTERVAL '30 minutes'
FROM users u, clients c 
WHERE u.email = 'consultant3@talan.com' AND c.name = 'Carrefour'
LIMIT 1;

-- Insérer quelques messages d'exemple
INSERT INTO simulation_messages (simulation_id, sender, content, message_type, confidence_score, processing_time_ms)
SELECT 
    s.id,
    'user',
    'Bonjour, je souhaiterais vous présenter nos solutions de transformation digitale.',
    'text',
    NULL,
    NULL
FROM simulations s
JOIN users u ON s.user_id = u.id
JOIN clients c ON s.client_id = c.id
WHERE u.email = 'consultant1@talan.com' AND c.name = 'BNP Paribas'
LIMIT 1;

INSERT INTO simulation_messages (simulation_id, sender, content, message_type, confidence_score, processing_time_ms)
SELECT 
    s.id,
    'ai',
    'Bonjour, c''est intéressant. Pouvez-vous me dire quels sont nos principaux défis actuels que votre solution pourrait adresser ?',
    'response',
    0.82,
    1250
FROM simulations s
JOIN users u ON s.user_id = u.id
JOIN clients c ON s.client_id = c.id
WHERE u.email = 'consultant1@talan.com' AND c.name = 'BNP Paribas'
LIMIT 1;
