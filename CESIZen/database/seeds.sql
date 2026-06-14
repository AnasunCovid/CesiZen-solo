-- =============================================================
-- CESIZen – Données de démarrage (seeds)
-- Exécuter APRÈS schema.sql
-- Mot de passe admin : Admin@cesizen1
-- Mot de passe user  : User@cesizen1
-- (hashes pré-générés avec bcrypt rounds=10)
-- =============================================================

USE cesizen;

-- Exercices de respiration (données officielles)
INSERT INTO breathing_exercises
  (name, label, inhale_duration, hold_duration, exhale_duration, description)
VALUES
  (
    '7-4-8',
    '7-4-8',
    7, 4, 8,
    'Technique de relaxation profonde développée par le Dr Andrew Weil. '
    'Inspirez 7 secondes, retenez 4 secondes, expirez 8 secondes. '
    'Idéale pour réduire l''anxiété et favoriser l''endormissement.'
  ),
  (
    'Cohérence cardiaque 5-5',
    '5-5',
    5, 0, 5,
    'La respiration en cohérence cardiaque la plus pratiquée : '
    '5 secondes d''inspiration, 5 secondes d''expiration. '
    'Pratiquée 5 minutes par jour, 3 fois par jour (méthode 365).'
  ),
  (
    'Respiration relaxante 4-6',
    '4-6',
    4, 0, 6,
    'Technique apaisante avec une expiration plus longue que l''inspiration, '
    'activant le système nerveux parasympathique. '
    'Inspirez 4 secondes, expirez 6 secondes.'
  );

-- Pages d'information (contenu initial)
INSERT INTO pages
  (title, slug, content, excerpt, is_published, position)
VALUES
  (
    'Accueil',
    'accueil',
    '<h2>Bienvenue sur CESIZen</h2>
<p>CESIZen est votre application de santé mentale dédiée à la gestion du stress et au bien-être quotidien. Découvrez nos ressources, exercices et outils conçus pour vous accompagner vers un meilleur équilibre émotionnel.</p>
<h3>Nos services</h3>
<ul>
  <li>Informations sur la santé mentale et sa prévention</li>
  <li>Exercices de respiration guidés (cohérence cardiaque)</li>
  <li>Outils de diagnostic et d''auto-diagnostic</li>
</ul>
<p>L''application est accessible à tous, gratuitement, sans inscription obligatoire pour la consultation des informations.</p>',
    'Votre compagnon de santé mentale au quotidien',
    1, 0
  ),
  (
    'Santé mentale',
    'sante-mentale',
    '<h2>La santé mentale, qu''est-ce que c''est ?</h2>
<p>Selon l''Organisation Mondiale de la Santé (OMS), la santé mentale est un état de bien-être dans lequel une personne peut se réaliser, surmonter les tensions normales de la vie, accomplir un travail productif et contribuer à la vie de sa communauté.</p>
<h3>Les chiffres en France</h3>
<p>1 personne sur 4 sera touchée par un problème de santé mentale au cours de sa vie. La dépression est la première cause de handicap dans le monde selon l''OMS.</p>
<h3>Les composantes de la santé mentale</h3>
<ul>
  <li>Bien-être émotionnel : capacité à ressentir et exprimer ses émotions</li>
  <li>Bien-être psychologique : sens de la vie, relations positives</li>
  <li>Bien-être social : sentiment d''appartenance, contribution à la société</li>
</ul>
<h3>Prendre soin de sa santé mentale</h3>
<p>Il existe de nombreuses façons d''agir : exercice physique régulier, alimentation équilibrée, sommeil de qualité, activités sociales, et techniques de relaxation comme la cohérence cardiaque.</p>',
    'Comprendre et préserver sa santé mentale',
    1, 1
  ),
  (
    'Gestion du stress',
    'gestion-du-stress',
    '<h2>Comprendre et gérer le stress</h2>
<p>Le stress est une réponse naturelle de l''organisme face à des situations perçues comme menaçantes. Bien que nécessaire à court terme (réponse fight-or-flight), le stress chronique peut avoir des effets négatifs importants sur la santé physique et mentale.</p>
<h3>Les signes du stress</h3>
<ul>
  <li>Physiques : tensions musculaires, maux de tête, fatigue, troubles du sommeil</li>
  <li>Émotionnels : irritabilité, anxiété, sentiment de débordement</li>
  <li>Cognitifs : difficultés de concentration, pensées négatives répétitives</li>
  <li>Comportementaux : isolement, modifications des habitudes alimentaires</li>
</ul>
<h3>Techniques efficaces</h3>
<p>La <strong>cohérence cardiaque</strong> est une technique scientifiquement validée qui synchronise la respiration avec le rythme cardiaque pour réduire le cortisol (hormone du stress). Découvrez nos exercices de respiration guidés.</p>
<p>D''autres techniques incluent la pleine conscience (mindfulness), la méditation, l''activité physique et la gestion du temps.</p>',
    'Apprenez à reconnaître et gérer votre stress efficacement',
    1, 2
  ),
  (
    'Prévention',
    'prevention',
    '<h2>Prévention en santé mentale</h2>
<p>La prévention vise à réduire les facteurs de risque et à renforcer les facteurs protecteurs pour maintenir et améliorer le bien-être psychologique.</p>
<h3>Facteurs protecteurs</h3>
<ul>
  <li>Estime de soi positive et image corporelle saine</li>
  <li>Réseau social solide et relations de qualité</li>
  <li>Capacité à demander de l''aide sans honte</li>
  <li>Activité physique régulière (30 min/jour recommandés)</li>
  <li>Pratiques de pleine conscience et de relaxation</li>
  <li>Équilibre vie professionnelle / vie personnelle</li>
</ul>
<h3>Quand consulter un professionnel ?</h3>
<p>N''hésitez pas à consulter si vous ressentez une détresse persistante, des changements d''humeur importants, ou si votre qualité de vie est affectée pendant plus de deux semaines.</p>
<h3>Ressources d''urgence</h3>
<ul>
  <li><strong>Numéro national prévention suicide :</strong> 3114 (24h/24)</li>
  <li><strong>SOS Amitié :</strong> 09 72 39 40 50</li>
  <li><strong>SAMU :</strong> 15</li>
</ul>',
    'Prévenez les troubles et renforcez votre bien-être mental',
    1, 3
  ),
  (
    'À propos',
    'a-propos',
    '<h2>À propos de CESIZen</h2>
<p>CESIZen est une initiative du Ministère de la Santé et de la Prévention visant à démocratiser l''accès aux outils de gestion du stress et aux informations sur la santé mentale pour le grand public.</p>
<h3>Notre mission</h3>
<p>Proposer une plateforme accessible à tous pour accompagner chacun dans sa compréhension des enjeux de santé mentale et lui fournir des outils concrets pour agir sur son bien-être quotidien.</p>
<h3>Nos engagements</h3>
<ul>
  <li>Accessibilité : interface adaptée à tous les publics et tous les écrans</li>
  <li>Fiabilité : contenus basés sur des sources scientifiques validées</li>
  <li>Confidentialité : respect strict du RGPD, données hébergées en France</li>
  <li>Gratuité : accès libre aux informations et exercices de base</li>
</ul>
<h3>Sources et références</h3>
<ul>
  <li>Ministère de la Santé et de la Prévention : www.sante.gouv.fr</li>
  <li>Organisation Mondiale de la Santé (OMS)</li>
  <li>Institut National de la Santé et de la Recherche Médicale (INSERM)</li>
</ul>',
    'Découvrez notre mission, nos engagements et nos références',
    1, 4
  );

-- Note : les comptes admin/user sont créés via le script Node.js
-- backend/src/scripts/seed.js (génère les hashes bcrypt automatiquement)
