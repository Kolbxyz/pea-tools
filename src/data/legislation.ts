import type { LegalArticle } from '../types/finance';

export const PEA_LEGISLATION: LegalArticle[] = [
  {
    title: 'Plafonds de Versement Légaux',
    reference: 'Article L. 221-30 du Code monétaire et financier (CMF)',
    summary: 'Le PEA bancaire classique est plafonné à 150 000 € de versements en numéraire. Le PEA Jeune est plafonné à 20 000 €.',
    impactPratique: 'Ce plafond ne s\'applique qu\'aux dépôts effectifs d\'argent frais (dépôts par virement ou chèque). Les gains en capital, plus-values et dividendes réinvestis ne sont jamais comptabilisés dans le plafond : votre PEA peut donc atteindre 500 000 € ou 1 000 000 € sans problème.',
    specialCases: [
      'PEA Jeune (18-25 ans rattaché au foyer fiscal des parents) : Plafond à 20 000 €. Dès que le jeune quitte le foyer fiscal de ses parents, le plafond passe automatiquement à 150 000 € sans clôture ni démarche complexe.',
      'Cumul PEA + PEA-PME : Le plafond combiné des deux plans ne peut pas dépasser 225 000 € au total par contribuable.',
      'Unicité : Il est strictement interdit par la loi de posséder plusieurs PEA par personne physique majeure (sanction fiscale en cas de doublon).'
    ]
  },
  {
    title: 'Fiscalité des Retraits et Règle des 5 Ans',
    reference: 'Article 150-0 A et 200 A du Code général des impôts (CGI)',
    summary: 'Après 5 ans de détention (date d\'ouverture faisant foi), les gains retirés sont totalement exonérés d\'impôt sur le revenu. Seuls les prélèvements sociaux de 17,2 % s\'appliquent.',
    impactPratique: 'La règle des 5 ans commence le jour du tout premier versement (même 10 € suffisent pour "prendre date"). Tout retrait après 5 ans n\'entraîne plus la clôture du plan (modification issue de la Loi Pacte 2019) et permet de continuer à effectuer des versements.',
    specialCases: [
      'Retrait AVANT 5 ans : Par principe, entraîne la clôture obligatoire du PEA et la taxation des gains au PFU (30 % = 12,8 % IR + 17,2 % PS) ou barème IR.',
      'Exceptions légales de retrait avant 5 ans SANS clôture ni pénalité IR : 1) Création ou reprise d\'entreprise dans les 3 mois. 2) Licenciement, invalidité (2e ou 3e catégorie), ou départ en retraite anticipée du titulaire ou de son conjoint. 3) Retrait de titres de sociétés en liquidation judiciaire.'
    ]
  },
  {
    title: 'Plafonnement Légal des Frais de Courtage',
    reference: 'Décret n° 2020-89 du 5 février 2020 (Loi Pacte)',
    summary: 'Les banques et courtiers ont l\'interdiction légale de facturer plus de 0,50 % de frais pour un ordre de bourse exécuté en ligne sur un PEA.',
    impactPratique: 'Sur un achat de 100 € d\'ETF, les frais ne peuvent légalement pas dépasser 0,50 €. De nombreuses banques en ligne (BoursoBank, Fortuneo) proposent même 0 € de courtage sur les ETF partenaires (ex: partenariats iShares / Amundi).',
    specialCases: [
      'Frais d\'ouverture : Plafonnés à 10 € maximum (0 € chez les banques en ligne).',
      'Frais de tenue de compte et droits de garde : Plafonnés à 0,40 % par an (+ 5 € par ligne) chez les banques traditionnelles, et 0 € chez les courtiers en ligne.',
      'Frais de transfert : Si vous transférez votre PEA vers un courtier moins cher, les frais bancaires de transfert sont plafonnés à 15 € par ligne de titres, dans la limite d\'un plafond global de 150 €.'
    ]
  },
  {
    title: 'Mécanisme des ETF Synthétiques (Swap) sur PEA',
    reference: 'Article L. 221-31 du CMF & Directive européenne UCITS',
    summary: 'Permet d\'investir en toute légalité sur des actions américaines ou mondiales au sein d\'un PEA qui impose normalement 75 % d\'actions de l\'Union Européenne.',
    impactPratique: 'L\'émetteur (BlackRock, Amundi, etc.) achète un panier d\'actions européennes éligibles (ex: BNP, Sanofi, Siemens) et souscrit un contrat d\'échange de performance ("Swap") auprès d\'une grande banque d\'investissement pour échanger la performance des actions européennes contre celle de l\'indice cible (S&P 500 ou MSCI World).',
    specialCases: [
      'Risque de contrepartie : Encadré très strictement par la réglementation UCITS européenne. Le risque de contrepartie sur le swap ne peut jamais dépasser 10 % des actifs du fonds (en pratique, il est souvent proche de 0 % grâce à des collatéraux quotidiens).',
      'Fiscalité des dividendes US : Les ETF synthétiques européens capitalisants évitent souvent la retenue à la source américaine de 15 % ou 30 % sur les dividendes grâce au swap synthétique (traitement fiscal favorable de la réplication de dérivés aux USA - Section 871(m)).'
    ]
  }
];
