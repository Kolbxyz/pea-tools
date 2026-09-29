# PEA Hub

Outils d'analyse, simulateur d'investissement programmé (DCA) et comparateur d'ETF pour le Plan d'Épargne en Actions (PEA).

## Fonctionnalités

### Simulateur DCA
* Calcul actuariel mensuel avec déduction des frais de gestion ETF (TER) et frais de courtage.
* Gestion des plafonds légaux : PEA Jeune (20 000 €) avec transition automatique vers le PEA Classique (150 000 €) à 25 ans.
* Calcul fiscal à la sortie : exonération d'IR après 5 ans (17,2 % de prélèvements sociaux sur les gains) ou PFU de 30 % avant 5 ans.
* Ajustement optionnel pour l'inflation.

### Comparateur ETF
* Données des principaux ETF indiciels capitalisants éligibles (WPEA, CW8, ESE, PE500, PAEEM, SX5E, ETZ).
* Tickers, codes ISIN (copie en 1 clic), frais annuels, type de réplication (synthétique swap ou physique) et prix indicatif de part.

### Cadre Juridique
* Références réglementaires : Code monétaire et financier (Art. L. 221-30), Code général des impôts (Art. 150-0 A), Décret n° 2020-89 (Loi Pacte).
* Conditions de déblocage et cas réels d'exonération avant 5 ans.

## Installation et Développement

```bash
# Installation des dépendances
npm install

# Lancement local (http://localhost:5173)
npm run dev

# Compilation de production
npm run build
```

## Stack

* React 19 + TypeScript
* Vite
* Tailwind CSS v4
* Lucide React
