/* ---------- Navire, lexique, urgences, rappels ---------- */

const SHIP = {
  decks: [
    ['3 – 4', 'Restaurants principaux <b>My Way</b> (avant) et <b>New York New York</b> (arrière) · restaurant bien-être Samsara (pont 3)'],
    ['5', 'Casino Flamingo · Teppanyaki'],
    ['6 – 10', '<b>Cabines balcon</b> (notre catégorie)'],
    ['9', 'Piscines, buffet <b>La Paloma</b>, grills Ipanema et Lido Calypso (piscine sous verrière)'],
    ['11', 'Espace bien-être et spa · steakhouse Club Blue Moon'],
    ['12', 'Installations sportives · Bar Scuderia Costa (simulateur de F1)']
  ],
  included: [
    ['My Way', 'ponts 3–4, avant', "Petit-déjeuner et déjeuner en service libre. Dîner à table attribuée, en 2 services (18 h 30 ou 21 h)."],
    ['New York New York', 'ponts 3–4, arrière', 'Restaurant principal sur deux niveaux. Dîner à table attribuée.'],
    ['Buffet La Paloma', 'pont 9', 'Grand buffet avec stands français, italiens, mexicains et asiatiques.'],
    ['Ipanema Grill / Lido Calypso', 'pont 9', 'Grillades et snacks au bord des piscines.']
  ],
  paying: [
    ['Archipelago', 'Menus gastronomiques de chefs étoilés'],
    ['Club Blue Moon', 'Steakhouse, pont 11'],
    ['Sushino @ Costa', 'Sushis à volonté'],
    ['Teppanyaki', 'Cuisine japonaise préparée devant vous, pont 5'],
    ['Pizzeria Pummid\'oro', 'Pizzas'],
    ['Samsara', 'Cuisine bien-être, pont 3']
  ],
  bars: [
    ['Grand Bar Rhapsody', 'Le bar principal : piste de danse et spectacles'],
    ['Caffetteria Rondò', 'Cafés et chocolats, propre au Pacifica'],
    ['Piano Bar Rick\'s', 'Piano en live. <b>Boissons premium uniquement</b> : a priori hors My Drinks'],
    ['Bar Sport Route 66', 'Sport sur grands écrans'],
    ['Wien Wien', 'Musique classique'],
    ['Atrio Welcome', 'Bar de l\'atrium, piano'],
    ['Bar Scuderia Costa', 'Ambiance F1, simulateur payant (pont 12)'],
    ['Lido Calypso / Ipanema', 'Bars des piscines (pont 9)']
  ],
  drinks_in: ['Cocktails classiques (Mojito, Spritz, Gin tonic…) et mocktails', 'Bière pression et certaines bières en bouteille', 'Vin au verre (rouge, blanc, rosé), y compris aux repas', 'Spiritueux et digestifs standards', 'Espresso, cappuccino, thés, chocolat chaud', 'Sodas, jus de fruits, eau au verre', '1 petite bouteille d\'eau par personne et par jour'],
  drinks_out: ['Boissons et bouteilles premium (ex. Piano Bar Rick\'s)', 'Restaurants payants : leurs boissons peuvent être facturées à part, à vérifier', 'Wi-Fi, spa, simulateur, casino']
};

/* Lexique : [français, langue locale, prononciation] */
const LEXIQUE = {
  it: {title: '🇮🇹 Italien', lang: 'it-IT', days: [2, 3, 4], rows: [
    ['Bonjour', 'Buongiorno', 'bouone-djorno'],
    ['Bonsoir', 'Buonasera', 'bouona-séra'],
    ['Merci (beaucoup)', 'Grazie (mille)', 'gratsié (milé)'],
    ['S\'il vous plaît', 'Per favore', 'pèr favoré'],
    ['Excusez-moi', 'Mi scusi', 'mi skouzi'],
    ['Combien ça coûte ?', 'Quanto costa?', 'kouannto kosta'],
    ['L\'addition, s\'il vous plaît', 'Il conto, per favore', 'il konnto pèr favoré'],
    ['Un café (expresso)', 'Un caffè', 'oun kaffè'],
    ['De l\'eau plate / gazeuse', 'Acqua naturale / frizzante', 'akoua natouralé / fridzannté'],
    ['Où sont les toilettes ?', 'Dov\'è il bagno?', 'dovè il bagno'],
    ['Un billet pour Gênes', 'Un biglietto per Genova', 'oun bilyétto pèr djénova'],
    ['Aller-retour', 'Andata e ritorno', 'anndata é ritorno'],
    ['Quel quai ?', 'Quale binario?', 'koualé binario'],
    ['Je ne comprends pas', 'Non capisco', 'nonn kapisko'],
    ['Joyeux Noël !', 'Buon Natale!', 'bouonn natalé']
  ]},
  tn: {title: '🇹🇳 Arabe tunisien', lang: 'ar', days: [5], note: 'Le français est très largement compris à Tunis. Ces quelques mots font toujours plaisir.', rows: [
    ['Bonjour', 'أسلامة', 'aslèma'],
    ['Bonjour (formel)', 'السلام عليكم', 'salam alikoum'],
    ['Merci', 'يعيشك', 'yaïchek'],
    ['S\'il te plaît', 'بربي', 'brabbi'],
    ['Oui / Non', 'إي / لا', 'é / lé'],
    ['Non merci', 'لا، يعيشك', 'lé, yaïchek'],
    ['Combien ?', 'قدّاش؟', 'qaddèch'],
    ['C\'est trop cher', 'غالي برشا', 'ghali barcha'],
    ['D\'accord', 'باهي', 'bèhi'],
    ['Ça va ?', 'لاباس؟', 'lèbès'],
    ['Je ne comprends pas', 'ما فهمتش', 'ma fhemtech'],
    ['Au revoir', 'بالسلامة', 'bislèma']
  ]},
  es: {title: '🇪🇸 Catalan / espagnol', lang: 'ca-ES', lang2: 'es-ES', days: [7], note: 'À Barcelone, on parle catalan et espagnol. Les deux sont compris partout.', rows: [
    ['Bonjour', 'Bon dia', 'Buenos días'],
    ['Merci', 'Gràcies', 'Gracias'],
    ['S\'il vous plaît', 'Si us plau', 'Por favor'],
    ['Excusez-moi', 'Perdoni', 'Perdone'],
    ['Combien ça coûte ?', 'Quant costa?', '¿Cuánto cuesta?'],
    ['L\'addition, s\'il vous plaît', 'El compte, si us plau', 'La cuenta, por favor'],
    ['Où est le métro ?', 'On és el metro?', '¿Dónde está el metro?'],
    ['Un billet', 'Un bitllet', 'Un billete'],
    ['Ouvert / fermé', 'Obert / tancat', 'Abierto / cerrado'],
    ['De l\'eau', 'Aigua', 'Agua'],
    ['Je ne comprends pas', 'No ho entenc', 'No entiendo'],
    ['Joyeux Noël !', 'Bon Nadal!', '¡Feliz Navidad!'],
    ['Au revoir', 'Adéu', 'Adiós']
  ]}
};

/* Urgences : [libellé, numéro affiché, numéro composé, précision] */
const SOS = [
  {title: '🚨 Urgences locales', items: [
    ['Urgence (France, Italie, Espagne)', '112', '112', 'Numéro européen, gratuit, même sans crédit'],
    ['Tunisie – Police', '197', '197', ''],
    ['Tunisie – SAMU', '190', '190', ''],
    ['Tunisie – Protection civile (pompiers)', '198', '198', ''],
    ['À bord', 'Réception / centre médical', '', 'Appelez la réception depuis le téléphone de la cabine. Le centre médical du bord est payant : gardez vos justificatifs pour l\'assurance.']
  ]},
  {title: '🇫🇷 Représentations françaises', items: [
    ['Consulat de France à Naples (Campanie et Sicile, dont Palerme)', '+39 081 080 8012', '+390810808012', 'Via Francesco Crispi 86, Naples · sur rendez-vous en semaine'],
    ['Consulat de France à Milan (Ligurie, dont Savone)', '+39 02 655 9141', '+39026559141', 'Via Mangili 1, Milan'],
    ['Ambassade et consulat de France à Tunis', '+216 31 315 000', '+21631315000', 'Place de l\'Indépendance, avenue Bourguiba (face à la cathédrale) · le même numéro renvoie vers la permanence d\'urgence en dehors des heures d\'ouverture'],
    ['Consulat de France à Barcelone', '+34 93 028 99 20', '+34930289920', 'Ronda Universitat 22B, 4e étage · métro Catalunya · permanence téléphonique hors horaires']
  ]},
  {title: '💳 Cartes et assistance', items: [
    ['Opposition carte bancaire (depuis l\'étranger)', '+33 4 42 60 53 03', '+33442605303', 'Serveur interbancaire, qui oriente vers votre banque. Notez aussi le numéro au dos de votre carte.'],
    ['Assistance de votre assurance voyage', 'À compléter', '', 'Numéro indiqué sur votre contrat ou celui de votre carte bancaire'],
    ['Costa Croisières', 'Voir documents de voyage', '', 'Le numéro d\'assistance figure sur vos documents de voyage et dans MyCosta']
  ]}
];
const SOS_LINKS = [
  ['Fil d\'Ariane : signaler son voyage au ministère', 'https://pastel.diplomatie.gouv.fr/fildariane/'],
  ['Conseils aux voyageurs – Tunisie', 'https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/conseils-par-pays-destination/tunisie/'],
  ['Consulat de France à Naples', 'https://it.diplomatie.gouv.fr/fr/consulat-general-de-france-naples'],
  ['Consulat de France à Barcelone', 'https://es.diplomatie.gouv.fr/fr/consulat-general-de-france-barcelone'],
  ['Ambassade de France en Tunisie – urgences', 'https://tn.diplomatie.gouv.fr/fr/urgence']
];

/* Rappels avant le départ : [id, date (AAAA-MM-JJ), titre, détail] */
const REMINDERS = [
  ['passeports', '2026-10-15', 'Vérifier les passeports de tous', 'Validité pour tout le voyage, enfant compris. La Tunisie est hors UE. Le document indiqué au check-in doit être celui présenté à l\'embarquement.'],
  ['tgv', '2026-10-15', 'Réserver les TGV aller (19/12) et retour (26/12)', 'Le 26, visez un train en début d\'après-midi : débarquement par groupes, puis navette et bus 35T, qui ne circule pas avant 9 h 15.'],
  ['assurance', '2026-11-01', 'CEAM et assurance voyage', 'La carte européenne d\'assurance maladie (sur ameli.fr) couvre l\'Italie et l\'Espagne, mais pas la Tunisie : vérifiez votre assurance voyage ou celle de votre carte bancaire.'],
  ['sagrada', '2026-11-01', 'Réserver la Sagrada Família pour le 25/12', 'Ouverte de 9 h à 14 h le jour de Noël. Billets uniquement en ligne sur sagradafamilia.org, partent vite en période de fêtes.'],
  ['excursions', '2026-11-15', 'Choisir les excursions Costa (MyCosta)', 'Surtout si vous voulez Pompéi le 21/12 : en autonomie, c\'est quasi impossible avec une arrivée à 14 h.'],
  ['sansevero', '2026-12-01', 'Réserver la Cappella Sansevero (Naples, 21/12 après-midi)', 'Sur museosansevero.it.'],
  ['palatine', '2026-12-01', 'Réserver la Chapelle Palatine (Palerme, 22/12)', 'Sur federicosecondo.org. Le mardi, ouverte de 8 h 30 à 17 h.'],
  ['ariane', '2026-12-01', 'S\'inscrire sur Fil d\'Ariane', 'Pour être prévenu en cas de problème dans un pays visité (Tunisie notamment).'],
  ['checkin', '2026-12-05', 'Enregistrement en ligne MyCosta', 'Possible dès le paiement complet et jusqu\'à la veille, pour tous les occupants de la cabine. Téléchargez ensuite cartes d\'embarquement et étiquettes bagages.'],
  ['offline', '2026-12-14', 'Préparer le mode hors ligne de ce site', 'En Wi-Fi : ajoutez la page à l\'écran d\'accueil, ouvrez-la depuis l\'icône, puis lancez la préparation dans cet onglet.'],
  ['gmaps', '2026-12-14', 'Télécharger les cartes Google Maps hors ligne', 'En complément : zones de Savone, Naples, Palerme, Tunis et Barcelone dans Google Maps (Profil → Cartes hors connexion).'],
  ['especes', '2026-12-15', 'Prévoir des petites coupures en euros', 'Pour la Tunisie (taxis, souks). Le dinar ne s\'achète que sur place et ne peut pas être exporté. Le TGM se paie uniquement en dinars.'],
  ['bagages', '2026-12-18', 'Préparer les bagages', 'Tenue habillée pour le réveillon du 24/12, coupe-vent, chaussures de marche, maillot de bain (piscine couverte), médicaments dans le bagage à main.'],
  ['bord', '2026-12-19', 'À bord dès l\'embarquement : réserver pour le 24/12', 'Restaurant de spécialités ou spa pour le réveillon : c\'est la journée la plus demandée.']
];
