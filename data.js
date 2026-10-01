/* ---------- Données ---------- */
const PORTS = {
  marseille:{name:'Marseille',coord:[43.3447,5.3299]},
  savone:{name:'Savone',coord:[44.3075,8.4845]},
  naples:{name:'Naples',coord:[40.8380,14.2560]},
  palerme:{name:'Palerme',coord:[38.1280,13.3700]},
  goulette:{name:'La Goulette (Tunis)',coord:[36.8130,10.3075]},
  mer:{name:'En mer',coord:[38.82,7.33]},
  barcelone:{name:'Barcelone',coord:[41.3540,2.1750]}
};

/* Trajet maritime approximatif : leg[i] mène au jour i+2 */
const LEGS = [
  // J1 -> J2 Marseille -> Savone
  [[43.3447,5.3299],[43.335,5.32],[43.30,5.22],[43.15,5.30],[43.05,5.60],[42.90,6.30],[43.40,7.60],[44.20,8.55],[44.3075,8.4845]],
  // J2 -> J3 Savone -> Naples
  [[44.3075,8.4845],[44.15,8.70],[43.50,9.60],[42.00,10.60],[40.62,14.05],[40.80,14.22],[40.8380,14.2560]],
  // J3 -> J4 Naples -> Palerme
  [[40.8380,14.2560],[40.70,14.20],[40.52,14.05],[38.25,13.42],[38.1280,13.3700]],
  // J4 -> J5 Palerme -> La Goulette
  [[38.1280,13.3700],[38.20,13.45],[38.35,13.00],[38.30,12.60],[38.10,11.90],[37.30,11.10],[37.25,10.65],[36.95,10.45],[36.8130,10.3075]],
  // J5 -> J6 La Goulette -> en mer
  [[36.8130,10.3075],[36.95,10.40],[37.30,10.50],[37.60,9.80],[38.82,7.33]],
  // J6 -> J7 en mer -> Barcelone
  [[38.82,7.33],[40.30,4.30],[41.25,2.30],[41.33,2.19],[41.3540,2.1750]],
  // J7 -> J8 Barcelone -> Marseille
  [[41.3540,2.1750],[41.30,2.25],[41.60,2.90],[42.30,3.50],[43.15,5.00],[43.30,5.22],[43.335,5.32],[43.3447,5.3299]]
];

const DAYS = [
  {n:1,date:'2026-12-19',label:'Samedi 19 décembre',port:'marseille',country:'France 🇫🇷',arr:'—',dep:'17:00',ashore:'Embarquement',temp:'12° / 4°',sunset:'≈ 16:58',
   badge:'Embarquement',
   intro:"Embarquement au terminal croisière de Marseille. Le départ est prévu à 17 h, au coucher du soleil, avec Notre-Dame-de-la-Garde, le Château d'If et les îles du Frioul en toile de fond.",
   sections:[
     {t:'🧳 Embarquement',items:[
       "<b>Terminal</b> : Marseille Provence Cruise Terminal (MPCT), quartier Cap Janet / Mourepiane, dans les bassins nord du port.",
       "Accès en taxi ou VTC depuis la gare Saint-Charles (environ 15 à 20 min). Parking payant à proximité du terminal.",
       "Créneau d'embarquement : celui indiqué sur la carte d'embarquement MyCosta (en général en fin de matinée ou en début d'après-midi).",
       "Gardez un bagage à main avec papiers, médicaments et maillot de bain : les valises arrivent en cabine plus tard dans l'après-midi.",
       "L'exercice de sécurité (muster drill) est obligatoire avant ou peu après le départ."]},
     {t:'🎄 Marseille en décembre',items:[
       "<b>Foire aux santons</b> (tradition provençale), en centre-ville jusqu'à fin décembre.",
       "Si vous arrivez la veille : Vieux-Port, Panier, MuCEM et fort Saint-Jean, Notre-Dame-de-la-Garde."]},
   ],
   tip:"Le départ se fait de jour : montez sur le pont supérieur arrière pour voir défiler la rade, le Frioul et les calanques."},

  {n:2,date:'2026-12-20',label:'Dimanche 20 décembre',port:'savone',country:'Italie 🇮🇹 · Ligurie',arr:'07:00',dep:'16:00',ashore:'9 h',temp:'12° / 6°',sunset:'≈ 16:46',
   intro:"Savone est le port d'attache historique de Costa, qui y possède son propre terminal (Palacrociere). Celui-ci est à quelques minutes à pied du centre historique.",
   sections:[
     {t:'📍 À voir à pied',items:[
       "<b>Forteresse du Priamar</b> (XVI<sup>e</sup> s.), qui domine le port. Vue et musées.",
       "<b>Cathédrale Notre-Dame-de-l'Assomption</b> et la <b>Chapelle Sixtine de Savone</b>, commandée par le pape Sixte IV, originaire de la ville.",
       "<b>Torre del Brandale</b> et <b>Torre Leon Pancaldo</b>, symboles de la vieille ville.",
       "<b>Via Paleocapa</b> et ses arcades, rues médiévales autour de la Via Pia."]},
     {t:'🚆 Excursions possibles',items:[
       "<b>Gênes</b> en train régional (environ 30 à 50 min) : Via Garibaldi (UNESCO), vieille ville, port antique et aquarium.",
       "<b>Noli</b> et <b>Finale Ligure</b> : villages médiévaux en bord de mer, sur la Riviera di Ponente.",
       "<b>Portofino</b> : faisable en excursion organisée, mais le trajet est long (environ 2 h)."]},
     {t:'🍴 Spécialités',items:[
       "<b>Farinata</b> (galette de pois chiches), <b>focaccia</b> ligure, <b>pesto</b> génois.",
       "Le <b>chinotto</b> de Savone, un petit agrume amer (sirop, confit, soda)."]}
   ],
   tip:"C'est un dimanche : certains commerces sont fermés, mais beaucoup ouvrent pendant la période de Noël. Les églises sont ouvertes, sauf pendant les offices."},

  {n:3,date:'2026-12-21',label:'Lundi 21 décembre',port:'naples',country:'Italie 🇮🇹 · Campanie',arr:'14:00',dep:'21:00',ashore:'7 h',temp:'14° / 7°',sunset:'≈ 16:40',
   badge:'Escale d\'après-midi',
   intro:"Le navire accoste à la Stazione Marittima (Molo Angioino), au pied du Castel Nuovo. Tout le centre se fait à pied. Décembre est le mois des crèches à Naples, un temps fort de la croisière.",
   sections:[
     {t:'🎄 Incontournable en décembre',items:[
       "<b>Via San Gregorio Armeno</b>, la rue des santonniers napolitains, à son apogée juste avant Noël (environ 25 min à pied).",
       "<b>Spaccanapoli</b> et le centre historique (UNESCO) : Duomo de San Gennaro, Santa Chiara et son cloître de majoliques."]},
     {t:'📍 À voir',items:[
       "<b>Cappella Sansevero</b> et son « Christ voilé » (réservation fortement conseillée).",
       "<b>Galleria Umberto I</b>, <b>Teatro San Carlo</b> et <b>Piazza del Plebiscito</b>, à 5 min du port.",
       "<b>Lungomare</b> et <b>Castel dell'Ovo</b> au coucher du soleil.",
       "<b>Musée archéologique national</b> (trésors de Pompéi). Vérifier l'horaire de fermeture."]},
     {t:'🍴 Spécialités',items:[
       "La <b>pizza napolitaine</b>, dans la rue des Tribunali.",
       "<b>Sfogliatella</b>, <b>babà</b>, et à Noël les <b>struffoli</b> (boulettes au miel)."]}
   ],
   tip:"<b>Pompéi ou Herculanum ?</b> En hiver, les sites ferment vers 17 h (dernière entrée vers 15 h 30). Avec une arrivée à 14 h, c'est très serré : préférez une excursion Costa ou consacrez l'escale au centre-ville. Attention aux pickpockets dans la foule.",
   warn:true},

  {n:4,date:'2026-12-22',label:'Mardi 22 décembre',port:'palerme',country:'Italie 🇮🇹 · Sicile',arr:'09:00',dep:'17:00',ashore:'8 h',temp:'16° / 10°',sunset:'≈ 16:47',
   intro:"Le port est en bordure du centre historique : comptez environ 15 min à pied jusqu'à la Via Cavour et au Teatro Massimo. Palerme mêle architecture arabo-normande, baroque et marchés de rue.",
   sections:[
     {t:'📍 À voir',items:[
       "<b>Palazzo dei Normanni</b> et <b>Chapelle Palatine</b> (mosaïques dorées, UNESCO).",
       "<b>Cathédrale</b> et vue depuis ses toits.",
       "<b>Quattro Canti</b>, <b>Fontana Pretoria</b>, <b>La Martorana</b> et San Cataldo.",
       "<b>Teatro Massimo</b>, le plus grand opéra d'Italie.",
       "Marchés <b>Ballarò</b>, <b>Vucciria</b> et <b>Il Capo</b>."]},
     {t:'🚌 Excursions possibles',items:[
       "<b>Monreale</b> : cathédrale aux mosaïques byzantines exceptionnelles (environ 30 min).",
       "<b>Cefalù</b> : cathédrale normande et plage (environ 1 h)."]},
     {t:'🍴 Spécialités',items:[
       "Street food : <b>arancine</b>, <b>panelle</b>, <b>sfincione</b>.",
       "<b>Cannoli</b>, <b>cassata</b>, et à Noël le <b>buccellato</b> (gâteau aux figues sèches)."]}
   ],
   tip:"Le street food tour du marché de Ballarò est une excellente façon de découvrir la ville en quelques heures."},

  {n:5,date:'2026-12-23',label:'Mercredi 23 décembre',port:'goulette',country:'Tunisie 🇹🇳',arr:'08:00',dep:'18:00',ashore:'10 h',temp:'17° / 8°',sunset:'≈ 17:00',
   badge:'Hors UE · passeport',
   intro:"C'est la plus longue escale de la croisière. La Goulette est le port de Tunis, à une dizaine de kilomètres de la médina. Le train léger TGM la relie à Tunis-Marine ainsi qu'à Carthage, Sidi Bou Saïd et La Marsa.",
   sections:[
     {t:'📍 À voir',items:[
       "<b>Médina de Tunis</b> (UNESCO) : souks, mosquée Zitouna (accès limité pour les non-musulmans), Dar Ben Abdallah.",
       "<b>Carthage</b> (UNESCO) : colline de Byrsa, thermes d'Antonin, ports puniques, tophet.",
       "<b>Sidi Bou Saïd</b> : village blanc et bleu sur la falaise, Café des Délices, Café des Nattes.",
       "<b>Musée du Bardo</b> : une des plus grandes collections de mosaïques romaines au monde (vérifier l'ouverture et les horaires)."]},
     {t:'💡 Pratique',items:[
       "<b>Monnaie</b> : dinar tunisien, non convertible. L'euro est souvent accepté dans les souks ; on négocie.",
       "<b>Papiers</b> : passeport recommandé. Vérifier les exigences de Costa pour cette escale.",
       "Pas de décalage horaire avec la France. Le français est largement parlé."]},
     {t:'🍴 Spécialités',items:[
       "<b>Brick à l'œuf</b>, <b>couscous</b>, <b>makroudh</b>.",
       "<b>Thé à la menthe aux pignons</b> et <b>bambalouni</b> (beignet) à Sidi Bou Saïd."]}
   ],
   tip:"Un combiné Carthage + Sidi Bou Saïd + médina tient dans la journée. Tous ces sites sont accessibles en excursion Costa ou en taxi négocié à l'avance."},

  {n:6,date:'2026-12-24',label:'Jeudi 24 décembre',port:'mer',country:'Méditerranée occidentale',arr:'—',dep:'—',ashore:'Journée en mer',temp:'—',sunset:'—',
   badge:'🎄 Réveillon à bord',xmas:true,
   intro:"Journée de navigation entre la Tunisie et l'Espagne, au large de la Sardaigne, puis des Baléares. C'est le soir du réveillon de Noël : l'animation à bord est au maximum.",
   sections:[
     {t:'🎄 Réveillon',items:[
       "Dîner de fête et animations spéciales Noël. Consultez le programme du jour (« Today ») pour le détail.",
       "Le dress code de la soirée est en général « élégant » : prévoir une tenue habillée."]},
     {t:'🛳️ Profiter du navire',items:[
       "Spa, piscines, toboggan, salle de sport.",
       "Spectacles au théâtre, musique live dans les bars (c'est le thème du Costa Pacifica).",
       "Restaurants de spécialités : Archipelago, Sushino @ Costa (sur réservation, payants).",
       "Club enfants et ados."]}
   ],
   tip:"Réservez dès l'embarquement le spa ou les restaurants de spécialités pour ce jour-là : c'est la journée la plus demandée."},

  {n:7,date:'2026-12-25',label:'Vendredi 25 décembre',port:'barcelone',country:'Espagne 🇪🇸 · Catalogne',arr:'08:00',dep:'17:00',ashore:'9 h',temp:'14° / 6°',sunset:'≈ 17:25',
   badge:'🎄 Jour de Noël',xmas:true,
   intro:"Noël à Barcelone. Les paquebots accostent au Moll Adossat, à 2 ou 3 km du monument à Colomb (navette payante). Le 25 décembre est férié : prévoyez une journée de balade en extérieur plutôt que de musées et de shopping.",
   sections:[
     {t:'📍 Ouvert / à faire à Noël',items:[
       "<b>Sagrada Família</b> : ouverte le 25 décembre de <b>9 h à 14 h</b> (horaires réduits), messe de Noël à 9 h. Billet à réserver à l'avance.",
       "<b>Barri Gòtic</b> et <b>cathédrale</b>, El Born, la Rambla, le port Vell.",
       "<b>Passeig de Gràcia</b> : façades de Gaudí (Casa Batlló, La Pedrera).",
       "<b>Montjuïc</b> (vue sur le port), <b>Barceloneta</b> et le front de mer.",
       "<b>Park Güell</b> : vérifier l'ouverture et réserver."]},
     {t:'🍴 Traditions catalanes',items:[
       "<b>Escudella i carn d'olla</b> (pot-au-feu de Noël), <b>turrón</b>.",
       "Le <b>caganer</b> et le <b>tió de Nadal</b>, figures typiques des crèches et des fêtes catalanes."]}
   ],
   tip:"Le 25 décembre (et souvent le 26, Sant Esteve), presque tous les commerces et beaucoup de musées sont fermés. Les restaurants ouverts sont pris d'assaut : réservez ou déjeunez à bord.",
   warn:true},

  {n:8,date:'2026-12-26',label:'Samedi 26 décembre',port:'marseille',country:'France 🇫🇷',arr:'08:00',dep:'—',ashore:'Débarquement',temp:'12° / 4°',sunset:'—',
   badge:'Débarquement',
   intro:"Arrivée à Marseille au petit matin. Le débarquement se fait par groupes dans la matinée, selon l'étiquette bagage remise à bord.",
   sections:[
     {t:'🧳 Débarquement',items:[
       "La veille au soir, déposez vos valises étiquetées devant la cabine, en général avant minuit.",
       "Gardez un sac avec vos papiers, médicaments et une tenue pour le matin.",
       "Vérifiez votre compte de bord (forfait de séjour, boissons, excursions) avant le départ.",
       "Petit-déjeuner servi à bord jusqu'au débarquement."]}
   ],
   tip:"Pour un train ou un vol, prévoyez de la marge : les premiers groupes quittent le navire vers 8 h 30, les derniers en fin de matinée."}
];

/* Transports, liens et retours de voyageurs par jour */
const EXTRA = {
 1:{
  transport:[
   "<b>Depuis la gare Saint-Charles</b> : métro <b>M2</b> direction Capitaine Gèze jusqu'à <b>Joliette</b>, puis bus <b>35T</b> jusqu'à l'arrêt « Terminal Croisières » (porte 4). Le 35T ne circule que les jours d'escale.",
   "<b>Navette gratuite</b> les jours de croisière entre la place de la Joliette (9 quai du Lazaret, entre les Terrasses du Port et la gare maritime) et la porte 4. Ensuite, suivre le marquage vert au sol.",
   "Prévoir <b>600 m à 2,5 km</b> entre l'arrêt de bus et le quai d'embarquement, selon le poste où est amarré le navire.",
   "<b>Depuis l'aéroport</b> : le taxi est le plus rapide. En transport en commun, navette jusqu'à Saint-Charles (25 à 50 min), puis métro et bus.",
   "<b>En voiture</b> : A55, sortie 5 (Grand Port Maritime) ou 4 (Joliette). <b>Parking MPCT</b> : 15 € les 24 h, sécurisé 24h/24 (CB ou espèces).",
   "Un service de dépôt de bagages au terminal, avec récupération à la gare Saint-Charles, est proposé."],
  links:[["Accès au port de croisière (Office de tourisme)","https://www.marseille-tourisme.com/organisez-votre-sejour/acces-et-infos-pratiques/arriver-a-marseille/acceder-au-port-de-croisiere-marseille/"],
         ["Terminal croisières MPCT","https://www.marseille-tourisme.com/offres/terminal-croisieres-mpct-marseille-16eme-fr-3381873/"],
         ["RTM – métro et bus de Marseille","https://www.rtm.fr"],
         ["Foire aux santons (14 nov. → 3 janv.)","https://www.jds.fr/marseille/manifestations-et-animations/noel/foire-aux-santons-marseille-170813_A"],
         ["Costa Croisières – espace client","https://www.costacroisieres.fr"]],
  voices:[["Le personnel de bord est très bien et attentionné.","Stéphane, octobre 2025 (Logitravel)","https://www.logitravel.fr/croisieres/compagnies-maritimes/costa-croisieres/bateaux/costa-pacifica/avis-des-clients/"],
          ["Literie et aménagement des cabines remarquables, même pour les moins chères.","Sandra B., juillet 2026 (WebCroisières)","https://www.webcroisieres.com/bt-415-costa-pacifica/avis"]]
 },
 2:{
  transport:[
   "Le terminal <b>Palacrociere</b> est au bord de la vieille ville : la forteresse du Priamar et le centre se font à pied.",
   "<b>Gare de Savona</b> : environ 20 à 25 min à pied, ou navette <b>TPL Linea</b> depuis le terminal (vers la gare ou le centre Le Officine). Ticket en vente à bord, mis en place selon la demande de Costa.",
   "Bus urbain TPL : 1,50 € le ticket (2,50 € s'il est acheté à bord).",
   "<b>Train pour Gênes</b> (Genova Piazza Principe ou Brignole) : environ 30 à 50 min, trains régionaux fréquents. Billet Trenitalia, à composter ou valider avant de monter.",
   "<b>Finale Ligure</b>, <b>Noli</b> et <b>Spotorno</b> : accessibles par le train côtier ou le bus TPL vers l'ouest."],
  links:[["TPL Linea – navettes croisière","https://welcome.tpllinea.it/en/cruise-shuttles/"],
         ["Trenitalia – horaires et billets","https://www.trenitalia.com"],
         ["Acquario di Genova","https://www.acquariodigenova.it"],
         ["Guide du Routard – Savone","https://www.routard.com/guide_voyage_lieu/15149-savona.htm"]],
  voices:[["Les visites à pied proposées à Savone passent par la Chapelle Sixtine, le Priamar et la Torre del Brandale, avec dégustation de focaccia, farinata, chinotto et amaretti.","Seatrade Cruise (parcours conçu par Costa et la région Ligurie)","https://www.seatrade-cruise.com/ship-operations/costa-and-ligurian-region-create-walking-tour-to-showcase-savona-s-culture-and-history"]]
 },
 3:{
  transport:[
   "Le navire accoste à la <b>Stazione Marittima</b> (Molo Angioino), à 10 ou 15 min à pied de la Piazza del Plebiscito et de la Via Toledo.",
   "<b>Métro ligne 1, station Municipio</b> : juste en face du port, à moins de 10 min à pied. Elle dessert Toledo, Dante et Museo (musée archéologique) ; la gare centrale (Garibaldi) est à environ 10 min.",
   "<b>Pompéi et Herculanum</b> : train <b>Circumvesuviana</b> (EAV) depuis le niveau inférieur de Napoli Garibaldi, environ 30 à 40 min jusqu'à Pompei Scavi. Le train est souvent bondé.",
   "<b>Horaires d'hiver de Pompéi</b> : 9 h–17 h, <b>dernière entrée 15 h 30</b>, billet 18 €. Le site est fermé le 25 décembre. Avec une arrivée à 14 h, c'est quasiment impossible en autonomie.",
   "Les ferries pour Capri et Sorrente partent du Molo Beverello voisin, mais l'escale l'après-midi en hiver est trop courte pour ces excursions."],
  links:[["ANM – métro de Naples","https://www.anm.it"],
         ["EAV – Circumvesuviana","https://www.eavsrl.it"],
         ["Parc archéologique de Pompéi","https://pompeiisites.org"],
         ["Cappella Sansevero (réservation)","https://www.museosansevero.it"],
         ["Musée archéologique national (MANN)","https://www.museoarcheologiconapoli.it"],
         ["Guide de l'escale à Naples (Adventour Begins, en anglais)","https://adventourbegins.com/naples-cruise-port-guide/"]],
  voices:[["Des chaussures confortables sont indispensables, car les rues sont pavées et inégales. Surveillez vos affaires dans les transports bondés.","Adventour Begins, guide croisière","https://adventourbegins.com/naples-cruise-port-guide/"]]
 },
 4:{
  transport:[
   "<b>À pied</b> : environ 15 à 20 min (≈ 1,3 km) jusqu'aux <b>Quattro Canti</b>, par la Via Cavour puis la Via Maqueda (piétonne), ou par la Via Roma. Le Teatro Massimo est à environ 1,7 km et le Palazzo dei Normanni à environ 3 km du navire.",
   "<b>Bus AMAT</b> : arrêt près du terminal. La ligne <b>107</b> rejoint la gare centrale (environ 15 min) ; la <b>104</b> dessert la cathédrale et le Palazzo dei Normanni (environ 30 min). Ticket ≈ 1,40 à 1,80 €, à acheter avant de monter (bureau de tabac).",
   "<b>Monreale</b> : bus <b>389</b> depuis la Piazza Indipendenza (au pied du Palazzo dei Normanni), environ 40 min, toutes les 75 min environ. Vérifiez l'horaire du retour.",
   "<b>Taxi</b> port ↔ centre : ≈ 8 à 15 €. Mettez-vous d'accord sur le prix avant de partir.",
   "<b>Chapelle Palatine</b> : du lundi au samedi, 8 h 30–17 h (fermée le 25 décembre). Réservation conseillée, car les groupes des croisières la saturent."],
  links:[["AMAT Palermo – bus","https://www.amat.pa.it"],
         ["Fondation Federico II – Palazzo dei Normanni et Chapelle Palatine","https://www.federicosecondo.org"],
         ["Palermo en une journée de croisière (Italy Planner)","https://italyplanner.com/palermo-cruise-port-one-day.html"],
         ["Bus pour Monreale, mode d'emploi (Fearless Female Travels)","https://fearlessfemaletravels.com/palermo-monreale-bus/"]],
  voices:[["Le marché de Ballarò ouvre vers 9 h et ferme vers 14 h : panelle, crocchè et sfincione pour quelques euros.","Italy Planner","https://italyplanner.com/palermo-cruise-port-one-day.html"]]
 },
 5:{
  transport:[
   "<b>Train TGM</b> (Tunis–Goulette–Marsa) : la gare est à quelques minutes à pied du terminal. Billet <b>en dinars uniquement</b>, autour d'1 dinar au plus.",
   "<b>Vers Tunis</b> : 2 arrêts jusqu'à <b>Tunis Marine</b>, puis environ 20 min à pied par l'avenue Bourguiba jusqu'à Bab el Bhar, l'entrée de la médina.",
   "<b>Vers le nord</b>, sur la même ligne : Le Kram, Salammbô, <b>Carthage</b> (plusieurs arrêts), <b>Sidi Bou Saïd</b>, La Marsa. Comptez 25 à 30 min pour toute la ligne.",
   "<b>Taxis</b> à la sortie du port : euros acceptés, prix à négocier avant de partir. Il est souvent difficile d'en retrouver un pour le retour : convenez avec le chauffeur qu'il vous attende ou revienne vous chercher.",
   "Le <b>Goulette Village Harbour</b>, petite médina reconstituée dans le port avec souks et artisanat, permet une sortie sans quitter le port."],
  links:[["Transtu – transports de Tunis (TGM)","https://www.transtu.tn"],
         ["Se déplacer à Tunis : métro, TGM, taxis (Le Mag Voyage)","https://www.lemagvoyage.fr/tunisie/se-deplacer-tunis-metro-tgm-bus-taxis-tarifs-plans-astuces/"],
         ["Forum Routard – escale à La Goulette","https://www.routard.com/forums/t/escale-a-tunis-port-de-la-goulette/5383"],
         ["Fiche du port de La Goulette (CruiseMapper)","https://www.cruisemapper.com/ports/la-goulette-tunis-port-93"]],
  voices:[["Le TGM est très bon marché, mais il faut des dinars : l'euro n'est pas accepté au guichet. Un bureau de poste près de la gare fait le change.","Forum Routard (témoignage de 2010, à reconfirmer)","https://www.routard.com/forums/t/escale-a-tunis-port-de-la-goulette/5383"],
          ["Couvrez épaules et genoux. Dans certains cafés, on vous apporte des pâtisseries non commandées avant de les facturer : refusez poliment si vous n'en voulez pas.","Conseils escale, CruiseMapper / Cruise Critic","https://www.cruisemapper.com/ports/la-goulette-tunis-port-93"]]
 },
 6:{
  transport:[],
  links:[["Avis sur le Costa Pacifica (WebCroisières)","https://www.webcroisieres.com/bt-415-costa-pacifica/avis"],
         ["Avis sur le Costa Pacifica (Logitravel)","https://www.logitravel.fr/croisieres/compagnies-maritimes/costa-croisieres/bateaux/costa-pacifica/avis-des-clients/"],
         ["Retour d'expérience de Planète Croisière","https://blog.planete-croisiere.com/costa-pacifica-avis-julien-planete-croisiere/"]],
  voices:[["Des repas d'un délice sublime, un personnel au top.","Jacques, novembre 2025 (Logitravel)","https://www.logitravel.fr/croisieres/compagnies-maritimes/costa-croisieres/bateaux/costa-pacifica/avis-des-clients/"],
          ["Peu de cours de danse sur 8 jours et un Grand Bar vide le soir. L'animation était moindre que lors de croisières Costa précédentes.","Sandrine V., juillet 2026 (WebCroisières)","https://www.webcroisieres.com/bt-415-costa-pacifica/avis"],
          ["Un service très personnalisé, avec beaucoup d'attention portée aux passagers.","Julien Dao, Planète Croisière","https://blog.planete-croisiere.com/costa-pacifica-avis-julien-planete-croisiere/"]]
 },
 7:{
  transport:[
   "<b>Navette Cruise Bus / Portbus (T3)</b> : du Moll Adossat au World Trade Center, près du monument à Colomb et de la Rambla, en environ 10 min. <b>3 € l'aller, 4,50 € l'aller-retour</b>, en espèces ou en ligne. Les tickets TMB ne sont <b>pas valables</b> sur cette navette.",
   "<b>À pied</b> : 25 min (terminal A) à 45 min (terminal D), par le pont Porta d'Europa. Le trajet est sans ombre.",
   "<b>Métro</b> : station <b>Drassanes</b> (L3), à côté du monument à Colomb. Pour la Sagrada Família, prendre la L3 jusqu'à Passeig de Gràcia, puis la L2 jusqu'à Sagrada Família. Le 25 décembre, le réseau fonctionne en horaire de jour férié.",
   "<b>Taxi</b> : ≈ 15 € jusqu'au centre, plus un supplément au départ du port. Une longue file de taxis attend généralement à l'arrivée des navires.",
   "<b>Sagrada Família</b> le 25 décembre : 9 h–14 h, messe à 9 h. Réservation en ligne indispensable."],
  links:[["Sagrada Família – billets","https://sagradafamilia.org"],
         ["Park Güell","https://parkguell.barcelona"],
         ["Casa Batlló","https://www.casabatllo.es"],
         ["TMB – métro et bus de Barcelone","https://www.tmb.cat"],
         ["Port de Barcelone – croisières","https://www.portdebarcelona.cat"],
         ["Du terminal au centre-ville (Barcelona Lowdown)","https://barcelonalowdown.com/cruise-ship-city-centre/"]],
  voices:[["Barcelone a été l'escale coup de cœur : le centre est proche et facile à visiter en autonomie pendant une escale courte.","Julien Dao, Planète Croisière","https://blog.planete-croisiere.com/costa-pacifica-avis-julien-planete-croisiere/"]]
 },
 8:{
  transport:[
   "<b>Vers la gare Saint-Charles</b> : bus <b>35T</b> ou navette gratuite jusqu'à la place de la Joliette, puis métro <b>M2</b>. En taxi, comptez 15 à 20 min.",
   "Pour reprendre votre voiture, le parking MPCT est à proximité immédiate des terminaux.",
   "Pour un train ou un avion le jour même, gardez une large marge : l'heure de débarquement dépend de votre groupe."],
  links:[["Accès au port de croisière (Office de tourisme)","https://www.marseille-tourisme.com/organisez-votre-sejour/acces-et-infos-pratiques/arriver-a-marseille/acceder-au-port-de-croisiere-marseille/"],
         ["RTM – métro et bus de Marseille","https://www.rtm.fr"]],
  voices:[]
 }
};

/* Plans de ville : coordonnées OpenStreetMap (Nominatim / Overpass) */
const CITY = {"marseille":{"pois":[{"name":"Gare Saint-Charles (TGV)","cat":"transport","ll":[43.303263,5.381193],"note":"Accès métro M1/M2 dans la gare"},{"name":"Métro Jules Guesde (M2)","cat":"transport","ll":[43.302308,5.375451],"note":"Station intermédiaire"},{"name":"Métro Joliette (M2)","cat":"transport","ll":[43.30455,5.367297],"note":"Sortie place de la Joliette"},{"name":"Arrêt bus 35T « Joliette »","cat":"transport","ll":[43.30508,5.366606],"note":"Départ vers le terminal croisières"},{"name":"Navette gratuite (9 quai du Lazaret)","cat":"transport","ll":[43.306744,5.363622],"note":"Devant les Terrasses du Port, jours d'escale"},{"name":"Arrêt 35T « Terminal Croisières » – Porte 4","cat":"transport","ll":[43.34035,5.346726],"note":"Rond-point du Cap Janet, entrée du port"},{"name":"Terminal MPCT (gare maritime croisières)","cat":"port","ll":[43.34466,5.32985],"note":"Terminal principal des grands navires"},{"name":"Terminal Cap Janet","cat":"port","ll":[43.337173,5.345837],"note":"Autre terminal possible selon le quai"},{"name":"Cathédrale de la Major","cat":"visite","ll":[43.29979,5.364938],"note":""},{"name":"Mucem & Fort Saint-Jean","cat":"visite","ll":[43.296729,5.361026],"note":""},{"name":"Le Panier & Vieille Charité","cat":"visite","ll":[43.300567,5.368268],"note":""},{"name":"Vieux-Port – Foire aux santons","cat":"noel","ll":[43.296362,5.372774],"note":"Quai du Port, jusqu'au 3 janvier"},{"name":"Notre-Dame de la Garde","cat":"visite","ll":[43.283946,5.371242],"note":""},{"name":"Château d'If","cat":"visite","ll":[43.279856,5.325284],"note":"Visible au départ du navire"}],"lines":[{"ll":[[43.301579,5.380105],[43.302308,5.375451],[43.30455,5.367297]],"kind":"metro","label":"Métro M2 (souterrain) : Saint-Charles → Jules Guesde → Joliette"},{"ll":[[43.30455,5.367297],[43.30508,5.366606]],"kind":"walk","label":"À pied : sortie métro → arrêt 35T (≈ 80 m)"},{"ll":[[43.30508,5.36661],[43.30517,5.36606],[43.30524,5.36564],[43.30524,5.36558],[43.30539,5.36549],[43.30607,5.3657],[43.30665,5.36587],[43.30675,5.36593],[43.30689,5.36605],[43.30698,5.3661],[43.30847,5.36652],[43.30864,5.36651],[43.3089,5.36659],[43.30907,5.36664],[43.30947,5.36676],[43.30966,5.36693],[43.31024,5.36713],[43.31055,5.36723],[43.31101,5.36735],[43.31113,5.36737],[43.31139,5.36737],[43.31166,5.36733],[43.31193,5.36724],[43.31248,5.36686],[43.31282,5.36656],[43.31312,5.36634],[43.31327,5.36624],[43.31356,5.36605],[43.31368,5.36599],[43.31446,5.3656],[43.31495,5.3654],[43.31542,5.36513],[43.3156,5.365],[43.31632,5.36444],[43.31672,5.36409],[43.31721,5.36368],[43.31794,5.36309],[43.31839,5.36283],[43.31876,5.36273],[43.31916,5.36272],[43.31997,5.36282],[43.3205,5.36289],[43.3207,5.36292],[43.32088,5.36292],[43.32146,5.36275],[43.32194,5.36243],[43.32485,5.36002],[43.32553,5.35939],[43.326,5.35901],[43.32643,5.3587],[43.32657,5.35858],[43.32673,5.35845],[43.32706,5.3581],[43.32715,5.35771],[43.32715,5.35738],[43.32698,5.35677],[43.32693,5.35635],[43.32696,5.35604],[43.32702,5.35584],[43.32715,5.35557],[43.32732,5.35534],[43.32767,5.35504],[43.32805,5.35492],[43.32838,5.35491],[43.32929,5.35517],[43.32979,5.35529],[43.33002,5.35529],[43.33021,5.35524],[43.33062,5.35515],[43.33093,5.35498],[43.33123,5.35489],[43.33162,5.35496],[43.33188,5.35493],[43.33232,5.35475],[43.33266,5.35464],[43.33302,5.35455],[43.33358,5.35477],[43.33395,5.35486],[43.33564,5.3545],[43.33584,5.35435],[43.33588,5.35431],[43.33602,5.35415],[43.33617,5.35387],[43.33628,5.35353],[43.33648,5.35199],[43.3365,5.35168],[43.33642,5.351],[43.33639,5.35059],[43.33639,5.35053],[43.3364,5.35046],[43.33642,5.35033],[43.33651,5.35008],[43.33666,5.34986],[43.33678,5.3497],[43.33726,5.34908],[43.33766,5.34868],[43.33811,5.34846],[43.33862,5.34823],[43.33875,5.34806],[43.33873,5.34797],[43.33873,5.34781],[43.33887,5.34774],[43.33937,5.34773],[43.33982,5.3477],[43.34008,5.3477],[43.34019,5.34771],[43.34064,5.34772],[43.34089,5.34766],[43.341,5.34749],[43.34093,5.34737],[43.34058,5.34713],[43.34044,5.34694],[43.34035,5.34673]],"kind":"bus","label":"Bus 35T Joliette → Terminal Croisières (tracé réel, ≈ 15 min)"},{"ll":[[43.34011,5.34616],[43.34,5.34597],[43.34,5.34588],[43.34002,5.34579],[43.34001,5.34569],[43.33995,5.34562],[43.33987,5.3456],[43.3398,5.34565],[43.33976,5.34575],[43.33978,5.34587],[43.33984,5.34595],[43.33989,5.34604],[43.33991,5.34612],[43.33996,5.34639],[43.34013,5.34687],[43.34016,5.34703],[43.34013,5.34718],[43.34,5.34744],[43.33981,5.34757],[43.33937,5.34767],[43.33887,5.34774],[43.33873,5.34781],[43.33873,5.34797],[43.33875,5.34806],[43.33862,5.34823],[43.33811,5.34846],[43.33766,5.34868],[43.33723,5.34901],[43.3369,5.34942],[43.33678,5.34959],[43.33671,5.34969],[43.33652,5.35],[43.33642,5.35022],[43.33642,5.35033],[43.3364,5.35046],[43.33639,5.35053],[43.33639,5.35059],[43.33642,5.351],[43.3365,5.35168],[43.33648,5.35199],[43.33628,5.35353],[43.33617,5.35387],[43.33602,5.35415],[43.33588,5.35431],[43.33584,5.35435],[43.33564,5.3545],[43.33395,5.35486],[43.33358,5.35477],[43.33302,5.35455],[43.33266,5.35464],[43.33232,5.35475],[43.33188,5.35493],[43.33162,5.35496],[43.33123,5.35489],[43.3309,5.35487],[43.33054,5.35496],[43.33031,5.355],[43.33007,5.35507],[43.32985,5.3551],[43.32955,5.35507],[43.32885,5.35489],[43.32853,5.3548],[43.3282,5.35472],[43.32795,5.35477],[43.32764,5.3549],[43.32736,5.35512],[43.32712,5.35542],[43.32699,5.35566],[43.32688,5.35597],[43.32684,5.35621],[43.32684,5.3565],[43.32687,5.35672],[43.327,5.35715],[43.32703,5.35774],[43.32694,5.358],[43.32667,5.35836],[43.32653,5.35849],[43.326,5.35901],[43.32553,5.35939],[43.32485,5.36002],[43.32194,5.36243],[43.32146,5.36275],[43.32096,5.36283],[43.32053,5.36278],[43.3201,5.36273],[43.31933,5.36263],[43.31891,5.36261],[43.31848,5.36269],[43.3182,5.3628],[43.31763,5.36321],[43.3156,5.36485],[43.31547,5.36494],[43.31491,5.36527],[43.31461,5.3654],[43.31372,5.36582],[43.31332,5.36606],[43.31323,5.36612],[43.31309,5.36622],[43.31244,5.36673],[43.31207,5.36702],[43.31191,5.36712],[43.31168,5.36717],[43.31156,5.36722],[43.31136,5.36724],[43.31114,5.36723],[43.31078,5.36715],[43.31062,5.36707],[43.31034,5.367],[43.30973,5.36681],[43.30955,5.3666],[43.30932,5.36652],[43.3091,5.36645],[43.30883,5.36636],[43.30836,5.36621],[43.30709,5.36583],[43.30676,5.36575],[43.30619,5.36558],[43.30572,5.36544],[43.30558,5.36542],[43.30541,5.36539],[43.3052,5.36533],[43.30483,5.36532],[43.30476,5.36576],[43.30471,5.3661]],"kind":"bus2","label":"Bus 35T Terminal Croisières → Joliette (retour)"},{"ll":[[43.34035,5.346726],[43.3399,5.3459],[43.3412,5.3405],[43.34466,5.32985]],"kind":"shuttle","label":"Navette interne du port vers le terminal (tracé indicatif)"}]},"savone":{"pois":[{"name":"Terminal Palacrociere (Costa)","cat":"port","ll":[44.309994,8.487677],"note":""},{"name":"Torre Leon Pancaldo","cat":"visite","ll":[44.309749,8.485049],"note":"Sur le port, à 3 min"},{"name":"Torre del Brandale","cat":"visite","ll":[44.307194,8.484057],"note":""},{"name":"Cathédrale & Chapelle Sixtine","cat":"visite","ll":[44.307509,8.48225],"note":""},{"name":"Forteresse du Priamar","cat":"visite","ll":[44.304542,8.483753],"note":"Entrée libre, vue sur le port"},{"name":"Via Paleocapa (arcades, boutiques)","cat":"food","ll":[44.30843,8.478334],"note":""},{"name":"Gare de Savona (trains pour Gênes)","cat":"transport","ll":[44.306981,8.471087],"note":"≈ 1,4 km du terminal"}],"lines":[{"ll":[[44.309994,8.487677],[44.3092,8.4842],[44.3084,8.4783],[44.3075,8.474],[44.306981,8.471087]],"kind":"walk","label":"À pied vers la gare par la Via Paleocapa (tracé indicatif, ≈ 20–25 min)"}]},"naples":{"pois":[{"name":"Stazione Marittima (navire)","cat":"port","ll":[40.838125,14.258578],"note":""},{"name":"Molo Beverello (ferries)","cat":"transport","ll":[40.837352,14.25475],"note":""},{"name":"Métro L1 Municipio","cat":"transport","ll":[40.8401,14.2525],"note":"Position approchée, sur la Piazza Municipio"},{"name":"Castel Nuovo","cat":"visite","ll":[40.838317,14.253731],"note":""},{"name":"Galleria Umberto I","cat":"visite","ll":[40.838514,14.24924],"note":""},{"name":"Teatro San Carlo","cat":"visite","ll":[40.837374,14.249813],"note":""},{"name":"Piazza del Plebiscito","cat":"visite","ll":[40.835856,14.248565],"note":""},{"name":"Via Toledo (shopping)","cat":"food","ll":[40.841677,14.248754],"note":""},{"name":"Santa Chiara","cat":"visite","ll":[40.846823,14.25291],"note":""},{"name":"Cappella Sansevero (Christ voilé)","cat":"visite","ll":[40.849299,14.254933],"note":"Réservation conseillée"},{"name":"Via San Gregorio Armeno (crèches)","cat":"noel","ll":[40.849777,14.257981],"note":"Incontournable en décembre"},{"name":"Via dei Tribunali (pizzerias)","cat":"food","ll":[40.850696,14.256426],"note":""},{"name":"Duomo (San Gennaro)","cat":"visite","ll":[40.852653,14.25987],"note":""},{"name":"Musée archéologique (MANN)","cat":"visite","ll":[40.853606,14.25115],"note":""},{"name":"Castel dell'Ovo (coucher de soleil)","cat":"visite","ll":[40.827742,14.248029],"note":""},{"name":"Napoli Centrale / Garibaldi (Circumvesuviana → Pompéi)","cat":"transport","ll":[40.853024,14.27314],"note":""}],"lines":[]},"palerme":{"pois":[{"name":"Stazione Marittima (navire)","cat":"port","ll":[38.127013,13.366293],"note":""},{"name":"Teatro Massimo","cat":"visite","ll":[38.120171,13.357154],"note":""},{"name":"Marché de la Vucciria","cat":"food","ll":[38.118192,13.365224],"note":""},{"name":"Antica Focacceria San Francesco","cat":"food","ll":[38.116333,13.366144],"note":""},{"name":"Quattro Canti","cat":"visite","ll":[38.115682,13.361459],"note":""},{"name":"Fontana Pretoria","cat":"visite","ll":[38.11549,13.36208],"note":""},{"name":"La Martorana","cat":"visite","ll":[38.11474,13.362893],"note":""},{"name":"Cathédrale","cat":"visite","ll":[38.114348,13.356013],"note":""},{"name":"Palazzo dei Normanni & Chapelle Palatine","cat":"visite","ll":[38.111206,13.35325],"note":"Réservation conseillée"},{"name":"Piazza Indipendenza (bus 389 → Monreale)","cat":"transport","ll":[38.110692,13.350965],"note":""},{"name":"Marché de Ballarò","cat":"food","ll":[38.111356,13.361578],"note":"≈ 9 h – 14 h"},{"name":"Gare Palermo Centrale (trains pour Cefalù)","cat":"transport","ll":[38.109257,13.36748],"note":""}],"lines":[]},"goulette":{"pois":[{"name":"Terminal croisière La Goulette","cat":"port","ll":[36.8125,10.305],"note":"Position approchée"},{"name":"TGM « La Goulette Vieille »","cat":"transport","ll":[36.818033,10.301965],"note":"≈ 10 min à pied du terminal"},{"name":"TGM « La Goulette Neuve »","cat":"transport","ll":[36.819937,10.305636],"note":""},{"name":"TGM « Tunis Marine »","cat":"transport","ll":[36.800689,10.192076],"note":"Terminus côté Tunis"},{"name":"Avenue Bourguiba & cathédrale","cat":"visite","ll":[36.799958,10.178952],"note":""},{"name":"Bab el Bhar (Porte de France)","cat":"visite","ll":[36.799204,10.175622],"note":"Entrée de la médina"},{"name":"Mosquée Zitouna & souks","cat":"visite","ll":[36.797359,10.171515],"note":""},{"name":"Dar Ben Abdallah","cat":"visite","ll":[36.793996,10.173726],"note":""},{"name":"Ports puniques (TGM Salammbô)","cat":"visite","ll":[36.84565,10.324804],"note":""},{"name":"Colline de Byrsa & musée de Carthage","cat":"visite","ll":[36.85357,10.324298],"note":""},{"name":"Thermes d'Antonin (TGM Hannibal)","cat":"visite","ll":[36.854488,10.333778],"note":""},{"name":"TGM « Sidi Bou Saïd »","cat":"transport","ll":[36.870615,10.342087],"note":""},{"name":"Sidi Bou Saïd – cafés sur la falaise","cat":"food","ll":[36.870098,10.351249],"note":""},{"name":"Musée du Bardo","cat":"visite","ll":[36.809346,10.134248],"note":"Vérifier l'ouverture"}],"lines":[{"ll":[[36.800689,10.192076],[36.8105,10.25],[36.818033,10.301965],[36.819937,10.305636],[36.824239,10.308713],[36.828935,10.311603],[36.8348,10.3155],[36.841695,10.31914],[36.846231,10.32184],[36.853547,10.328997],[36.8605,10.3345],[36.870615,10.342087]],"kind":"train","label":"Ligne TGM (tracé approximatif par les gares)"}]},"barcelone":{"pois":[{"name":"Terminal D – Moll Adossat","cat":"port","ll":[41.35424,2.176194],"note":"Terminal exact selon l'affectation du jour"},{"name":"Terminal A – Moll Adossat","cat":"port","ll":[41.362328,2.1815],"note":""},{"name":"World Trade Center (arrivée Portbus)","cat":"transport","ll":[41.3713,2.182243],"note":""},{"name":"Monument à Colomb","cat":"visite","ll":[41.375802,2.177774],"note":""},{"name":"Métro Drassanes (L3)","cat":"transport","ll":[41.376748,2.175659],"note":""},{"name":"La Rambla","cat":"visite","ll":[41.385062,2.170557],"note":""},{"name":"Marché de la Boqueria","cat":"food","ll":[41.381736,2.171552],"note":"Probablement fermé le 25/12"},{"name":"Cathédrale & Barri Gòtic","cat":"visite","ll":[41.38393,2.176554],"note":""},{"name":"Barceloneta (front de mer)","cat":"visite","ll":[41.38207,2.185422],"note":""},{"name":"Casa Batlló","cat":"visite","ll":[41.391545,2.164696],"note":""},{"name":"La Pedrera (Casa Milà)","cat":"visite","ll":[41.3954,2.161762],"note":""},{"name":"Sagrada Família","cat":"noel","ll":[41.403505,2.174428],"note":"25/12 : 9 h–14 h, messe à 9 h"},{"name":"Park Güell","cat":"visite","ll":[41.414235,2.152458],"note":""},{"name":"Château de Montjuïc","cat":"visite","ll":[41.363376,2.166144],"note":""}],"lines":[{"ll":[[41.35424,2.176194],[41.362328,2.1815],[41.3685,2.1838],[41.3713,2.182243]],"kind":"shuttle","label":"Portbus T3 (tracé indicatif)"}]}};

/* Itinéraire précis gare Saint-Charles <-> terminal croisières */
const MRS_STEPS = {
 aller: {title:"🚆 Gare Saint-Charles → navire (samedi 19 décembre)", steps:[
  ["Gare Saint-Charles","Dans le hall, suivez « Métro ». Les escaliers mécaniques descendent directement à la station Saint-Charles. Achetez un ticket RTM au distributeur (ou par carte bancaire sans contact aux valideurs). Il est valable métro + bus avec correspondance : vérifiez les conditions sur rtm.fr."],
  ["Métro M2","Prenez la <b>ligne 2 (rouge)</b> direction <b>Gèze</b> (Capitaine Gèze). Descendez <b>2 stations plus loin</b>, à <b>Joliette</b> (Jules Guesde, puis Joliette), soit environ 4 min."],
  ["Joliette","Sortez côté <b>place de la Joliette</b>. L'arrêt du bus <b>35T « Joliette »</b> est à environ 80 m, sur la place."],
  ["Bus 35T","Le samedi, il part <b>de 9 h 35 à 16 h 30</b>, <b>toutes les 20 min environ</b>, et seulement les jours d'escale. Trajet d'environ 15 min, 3 arrêts : Joliette → Terminal Maghreb → <b>Terminal Croisières</b> (terminus)."],
  ["Plan B : navette gratuite","Depuis la Joliette, marchez environ 5 min jusqu'au <b>9 quai du Lazaret</b> (entre les Terrasses du Port et la gare maritime). Une navette gratuite part toutes les 20 min environ, de 9 h 20 à 17 h 20, les jours d'escale."],
  ["Porte 4 – Cap Janet","À la descente, suivez le <b>marquage vert au sol</b> jusqu'à la navette interne du port, qui mène au terminal où est amarré le Costa Pacifica. Le quai est à <b>600 m – 2,5 km</b> selon le poste : ne le faites pas à pied avec les valises."],
  ["Temps total","Comptez environ <b>45 min à 1 h</b> en incluant l'attente du bus. En <b>taxi</b>, c'est 15 à 20 min depuis la gare. <b>Bag Mobile</b> (consigne à la gare Saint-Charles) peut transporter les valises jusqu'au terminal."]
 ]},
 retour: {title:"🚆 Navire → gare Saint-Charles (samedi 26 décembre)", steps:[
  ["Débarquement","Débarquement par groupes à partir d'environ 8 h 30. Navette interne du port jusqu'à la <b>porte 4</b>, rond-point du Cap Janet."],
  ["Bus 35T","L'arrêt <b>« Terminal Croisières »</b> direction <b>Joliette</b> est en face de celui de l'aller. Le samedi, le bus circule <b>de 9 h 15 à 16 h 05</b>, toutes les 20 min environ ; le trajet dure environ 15 min. <b>Avant 9 h 15, il n'y a pas de bus</b> : prenez la navette gratuite si elle circule, ou un taxi."],
  ["Joliette","Descendez au terminus <b>Joliette</b>. L'entrée du métro est sur la place, à environ 80 m."],
  ["Métro M2","Ligne 2 direction <b>Sainte-Marguerite Dromel</b>. Descendez <b>2 stations plus loin</b>, à <b>Gare Saint-Charles</b> (Jules Guesde, puis Saint-Charles). La sortie mène directement aux quais SNCF."],
  ["Marge à prévoir","Entre le débarquement de votre groupe, la navette, l'attente du bus et le métro, comptez <b>1 h à 1 h 30</b> avant l'heure de votre TGV. En taxi, comptez 15 à 20 min sans attente."]
 ]}
};

