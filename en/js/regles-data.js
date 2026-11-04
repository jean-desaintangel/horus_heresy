/* ============================================================
   regles-data.js — Données des règles spéciales
   Auteur : Jean · Créé : 2026-07-15
   Rôle   : encode les règles spéciales en JS ({ nom, texte }), sans
   aucune logique de rendu ni de recherche. Partagé par :
   - js/regles.js  (page regles.html : cartes de référence)
   - js/armes.js   (page armes.html : info-bulles sur les tables d'armes)
   Dépend : aucun (vanilla JS). Doit être chargé avant les scripts
   ci-dessus.
   ============================================================

   MODÈLE DE DONNÉES (pour les étudiants) :

   Une règle = { nom: "Brèche (X)", texte: "…" }
   · `nom`   sert à la fois d'étiquette affichée ET de CLÉ de
     rapprochement : js/armes.js cherche dans ce tableau le nom lu
     dans la colonne « Règles spéciales » d'une arme pour en tirer
     l'info-bulle (voir trouverDefinitionRegle, js/main.js).
   · `texte` est reproduit du livre, sans mise en forme : aucune
     balise HTML ici. Le rendu injecte le texte via `textContent`
     (jamais `innerHTML`) — réflexe anti-XSS du projet. Si une balise
     se glissait dans ces données, elle s'afficherait littéralement
     au lieu d'être interprétée : c'est exactement l'effet recherché.

   POURQUOI DEUX TABLEAUX plutôt qu'un seul, ou qu'un objet
   { nom: texte } ?
   · Deux tableaux, parce que les deux familles n'ont pas le même
     usage : REGLES_ARMES alimente les info-bulles de la page Arsenal,
     REGLES_DIVERSES les cartes de la page Glossaire. La page regles.html
     les affiche à la suite, mais la séparation garde la source lisible.
   · Un tableau (et non un objet), parce que l'ORDRE compte : il est
     celui du livre, et la recherche parcourt la liste pour trouver la
     correspondance la plus longue (« Brèche (5+) » avant « Brèche »).
     Un objet ne garantit pas cet ordre de manière évidente et
     interdirait deux entrées de même nom.

   Le suffixe « (X) » d'un nom est un paramètre variable du jeu
   (« Brèche (5+) », « Brèche (4+) »…) : les données ne stockent que
   la forme générique, la valeur réelle vient de la ligne d'arme.
   ============================================================ */

/* ----------------------------------------------------------
   RÈGLES SPÉCIFIQUES AUX ARMES
   Portées par une arme (colonne « Règles spéciales » de l'Arsenal) :
   elles modifient une attaque, jamais la figurine elle-même.
   Ordre du livre de règles conservé.
   ---------------------------------------------------------- */
const REGLES_ARMES = [
  {
    nom: "Stun (X)",
    texte:
      "If the weapon scores a Hit, the target must take a Cool Check with a penalty of X.",
  },
  {
    nom: "Suppressive (X)",
    texte:
      "If the weapon scores a Hit, the target must take a Cool Check with a penalty of X. If failed, it becomes Suppressed.",
  },
  {
    nom: "Pinning (X)",
    texte:
      "If the weapon inflicts a Wound (whether or not any Damage is inflicted), the target must take a Cool Check with a penalty of X.",
  },
  {
    nom: "Panic (X)",
    texte:
      "If the weapon inflicts a Wound (whether or not Damage is inflicted), the target must take a Leadership Check with a penalty of X.",
  },
  {
    nom: "Breaching (X)",
    texte:
      "If the Wound Test result is equal to or greater than X, the Armour Penetration (AP) of the attack becomes 2.",
  },
  {
    nom: "Poisoned (X)",
    texte:
      "The Wound Test always succeeds on X, regardless of the target's Toughness.",
  },
  {
    nom: "Armourbane",
    texte:
      "Against a Vehicle, a Glancing Hit becomes a Penetrating Hit.",
  },
  {
    nom: "Melta (X)",
    texte:
      "If the target is within X, Damage is doubled and the weapon gains Armourbane.",
  },
  {
    nom: "Impact (X)",
    texte: "When charging, the model gains +1 to its X Characteristic.",
  },
  {
    nom: "Rending (X)",
    texte:
      "If the Wound Test result is equal to or greater than X: +1 Damage (except on an Armour Penetration Test).",
  },
  {
    nom: "Heavy (X)",
    texte: "If the firer remained Stationary: +1 to its X Characteristic.",
  },
  {
    nom: "Precision (X)",
    texte:
      "If the Hit Test result is equal to or greater than X, the attacker chooses which model suffers the Wound.",
  },
  {
    nom: "Critical Hit (X)",
    texte:
      "A high Hit Test result (X or more, before modifiers) becomes a Critical Hit: it wounds automatically, with no Wound Test, and inflicts 1 additional Damage.",
  },
  {
    nom: "Wounding (X)",
    texte:
      "A high Hit Test result (X or more, before modifiers) becomes a Rending Hit: it wounds automatically, with no Wound Test, keeping the weapon's AP and Damage.",
  },
  {
    nom: "Skyfire",
    texte:
      "Against a Flyer, the weapon hits normally using the firer's BS instead of making Snap Shots — including during a Reaction. No effect if the firing unit has a Tactical Status.",
  },
  {
    nom: "Ordnance (X)",
    texte:
      "Doubles the value of the X Characteristic if the firer remained Stationary in the previous turn (an AP becomes AP2 instead of being doubled).",
  },
  {
    nom: "Duellist's Edge (X)",
    texte: "Grants a bonus of X to the Focus Roll during a Challenge.",
  },
  {
    nom: "Barrage (X)",
    texte:
      "Allows the weapon to fire at a target without Line of Sight (indirect fire). Combined with Blast, a Scatter roll determines where the shot lands if it misses.",
  },
  {
    nom: "Shock (X)",
    texte:
      "Weapons with this Special Rule have a chance to inflict Statuses on Vehicles even without penetrating their armour. When making a Hit Test for a Weapon with this Special Rule against a Target Unit that includes any Model with the Vehicle or Walker Type, note the result of the Hit Test before any modifiers. If the result is a \"5\" or \"6\" before any modifiers, all Models with the Vehicle or Walker Type in the Target Unit gain a Status (based on the value of X) at the end of Step 11 of the Shooting Attack process or Step 10 of the Initiative Step process; if the Model already has that Status, or the attack would apply it more than once, there is no further effect. This Special Rule never causes the loss of Wounds or Hull Points, and the Hits inflicted do not cause a Wound Test or an Armour Penetration Test.",
  },
  {
    nom: "Combi",
    texte:
      "A Weapon with this Special Rule can fire with several profiles simultaneously. Each time a Model makes a Shooting Attack with a Weapon Profile that has this Special Rule, the Controlling Player may choose another Profile of the same Weapon that has this Special Rule and make attacks with it as part of the same Shooting Attack. If that Profile also has the Limited (X) Special Rule, this does not allow it to be chosen to make more attacks than the value of X attached to that rule.",
  },
  {
    nom: "Deflagrate (X)",
    texte:
      "Each unsaved Wound can trigger additional Hits on the same target.",
  },
  {
    nom: "Detonation",
    texte:
      "Can only attack Vehicles, models with a Movement Characteristic of 0, or terrain/buildings.",
  },
  {
    nom: "Aflame (X)",
    texte:
      "If the attack wounds the target, its unit is \"aflame\": it suffers an additional penalty of X to its Leadership for Checks related to this Combat.",
  },
  {
    nom: "Blast (X)",
    texte:
      "Before making Hit Tests, the attacking Player places a Blast Marker (size X) so that its central hole is entirely over the Base of a Model in the Target Unit, then makes a single Hit Test for the whole Marker. If it succeeds, each Model covered at least partially suffers a Hit, including in another Unit (friendly or enemy) — that Unit then forms a separate Fire Group, resolved after the current attack. If it fails, no Hits are inflicted but the Marker scatters (Scatter Dice): each Unit then covered still suffers one Hit per Model affected. Not to be confused with Explodes (X), which describes a model that explodes.",
  },
  {
    nom: "Force (X)",
    texte:
      "A Psyker may attempt a Willpower Check to double the weapon's X Characteristic, at the risk of suffering Perils of the Warp on a double.",
  },
  {
    nom: "Limited (X)",
    texte:
      "The weapon can only be used to attack X times in total over the whole battle.",
  },
  {
    nom: "Phage (X)",
    texte:
      "Each unsaved Wound permanently reduces one of the target's Characteristics by 1 for the rest of the battle.",
  },
  {
    nom: "Pistol",
    texte: "A model can attack with two Pistol weapons at the same time.",
  },
  {
    nom: "Swift Pursuit",
    texte:
      "Improves the Intercept Reaction: the weapon can be used even if it is not a Defensive weapon.",
  },
  {
    nom: "Shot Selector",
    texte:
      "At the start of a Shooting Attack, the weapon may gain Panic (1), Breaching (5+) or Suppressive (2) until the end of the attack.",
  },
  {
    nom: "Template",
    texte:
      "Uses a Template (the standard Flame Template, unless another template is specified in brackets — see Other Templates) instead of a Hit Test: it is placed with its narrow end touching the Base of the attacking Model and its wide end towards the target, and it never Scatters. The attacking Player freely chooses its orientation as long as it touches at least one Model in the Target Unit — this may also hit friendly Models. Every Model covered at least partially suffers an automatic Hit.",
  },
  {
    nom: "Overload (X)",
    texte:
      "A Hit Test result that is too low (X or less, before modifiers) inflicts a Hit on the firing model.",
  },
  /* --- Arsenal des Maisonnées de Chevaliers et des Legios
     Titaniques. --- */
  {
    nom: "Armour-breaker (X)",
    texte:
      "If the Armour Penetration Test result is equal to or greater than X, the Penetrating Hit inflicts 1 additional point of Damage.",
  },
  {
    // Journal Tactica : Battle of Tallarn (mortier taupe, Section de
    // Rapier des Solar Auxilia).
    nom: "Subterranean",
    texte:
      "Burrowing warheads care little for cover. No Cover Saves or Shrouded Damage Mitigation Rolls can be made against a Wound or Penetrating Hit inflicted by a Weapon with this Special Rule (Armour Saves and Invulnerable Saves can still be made). Against a Vehicle, its Hits always target the Side Armour Facing. It can never target a Model with the Flyer Sub-type. Against a Unit whose Models are in an area of terrain with several levels, its Hits can only be allocated to Models on the lowest level.",
  },
  {
    nom: "Shieldbane (X)",
    texte:
      "An attack that brings down a Void Shield brings down X at a time instead of one.",
  },
  {
    nom: "Macro-auspex",
    texte:
      "Against a target that is not a Titan, a Knight, a Super-heavy or a model with at least 10 Base Wounds, the weapon must make Snap Shots.",
  },
  /* --- Arsenal des Conclaves Skitarii. --- */
  {
    nom: "Icon of Authority",
    texte:
      "When, in the Declare Weapons and Set Initiative Steps step of the Fight Sub-Phase, a Weapon with this Special Rule is chosen to make Attacks, all Models with the [Skitarii] Trait that belong to the same Unit as the Model with a Weapon with this Special Rule are immediately relieved of the Pinned, Suppressed and Stunned Tactical Statuses.",
  },
  /* --- Arsenal des Forces de l'Empereur (Legio Custodes). --- */
  {
    nom: "Cascading Annihilation (X)",
    texte:
      "Penetrating Hits inflicted by attacks with this Special Rule can cause additional Hits. At the end of Step 9 of the Shooting Attack process, or at Step 8 of the Resolve an Initiative Step process, for a Fire Group or Strike Group that includes Weapons with this Special Rule and that has inflicted at least one Penetrating Hit, a new Fire Group or Strike Group (respectively) is created, resolved in the following Step. This new Group consists of a number of Hits equal to the number of Hull Points lost by the Target Model because of the triggering Group; these Hits all have a Strength equal to the value of X, an AP of \"-\", a Damage of 1 and no Special Rules.",
  },
  /* --- Arsenal de la Divisio Assassinorum (Assassin Vindicare). --- */
  {
    nom: "Murderous (X)",
    texte:
      "When making a Wound Test for an Attack with this Special Rule, if the result is equal to or greater than the value of X attached to this variant of the Special Rule (ignoring modifiers), the Wounds inflicted ignore the Target Model's Eternal Warrior (X) Special Rule.",
  },
];

/* ----------------------------------------------------------
   RÈGLES DIVERSES (règles spéciales de figurine et d'unité)
   Portées par une figurine, une unité ou un détachement — pas par une
   arme. C'est le contenu principal de la page regles.html, où une
   barre de recherche insensible aux accents les filtre en direct
   (voir normaliserTexte dans js/main.js).
   Ordre du livre de règles conservé.
   ---------------------------------------------------------- */
const REGLES_DIVERSES = [
  {
    nom: "Implacable Advance",
    texte:
      "All of the model's weapons count as Assault (except Heavy and Artillery).",
  },
  {
    nom: "Vanguard (X)",
    texte:
      "A Unit that includes Models with this Special Rule can score Victory Points by destroying enemy Units. The Player controlling a Unit in which the majority of Models have the Vanguard (X) Special Rule scores a number of Victory Points equal to the value of X when: (1) an enemy Unit that is within 3\" of an Objective Marker, or was at the start of the Player Turn, has its last model Removed as a Casualty by an attack made by this Unit; (2) an enemy Unit that is within 3\" of an Objective Marker, or was at the start of the Player Turn, gains the Routed Tactical Status while in Combat with this Unit. If a Unit includes Models with different values of X for this Special Rule, the Controlling Player may choose which one is used. A Unit in which the majority of Models have the Vanguard (X) Special Rule can never score more than 1 Victory Point for Controlling an Objective, regardless of that Objective's value or any other bonus.",
  },
  {
    nom: "Jump Packs",
    texte:
      "Gains the Antigrav Sub-type, a Movement value of 12\", and the \"Bulky (2)\" and \"Deep Strike\" Special Rules, for an additional Points cost (usually +20).",
  },
  {
    nom: "Shield",
    texte:
      "A Trait that increases the Cool Characteristic of a Model that has it by 1, and grants access to the Legiones Astartes Advanced Reaction \"Shield Wall\" (cost: 1 Reaction Allotment), which can be declared at the start of Step 3 of a Shooting Attack or Step 4 (Volley Attacks) of a Charge made by the opponent: if the majority of Models in the targeted Unit have this Trait, the Unit gains +1 Toughness for the duration of the Phase.",
  },
  {
    nom: "Disordered charge",
    texte:
      "The unit benefits from neither the Set-up Move nor the bonus melee attack when charging.",
  },
  {
    nom: "Smokescreen (reaction)",
    texte:
      "Grants a Shrouded Damage Mitigation Roll against shooting. The Reactive Player may declare this Advanced Reaction in the Shooting Phase, at the start of Step 3 of a Shooting Attack made by the Active Player, for a Model that has the Smokescreen Trait (cost: 1 Reaction Allotment). For the duration of that Shooting Attack, all Models in the targeted Unit, the majority of which have this Trait, gain a 5+ Shrouded Damage Mitigation Roll against Wounds, Penetrating Hits or Glancing Hits inflicted.",
  },
  {
    nom: "Explodes (X)",
    texte:
      "When the model explodes, every unit within 6\" suffers a number of Hit Tests equal to the Base Wounds of the exploding model (Strength 8, Damage 1).",
  },
  {
    nom: "Deep Strike",
    texte:
      "Arrives in turns 2, 3 or 4, maximum 1 unit per turn. Placed more than 1\" from everything, with the unit grouped within 6\" of the first model. It can then neither move nor charge that turn.",
  },
  {
    nom: "Fury of the Legion",
    texte:
      "When a Model in this Unit makes a Shooting Attack with a bolter, the bolter gains the Heavy (FP) Special Rule until the Shooting Attack has been fully resolved.",
  },
  {
    nom: "Hatred (X)",
    texte: "+1 to Wound Tests in combat against X-type targets.",
  },
  {
    nom: "Infiltrate (X)",
    texte:
      "Deploys anywhere except in the enemy deployment zone and more than X\" from the enemy. Cannot charge in the first turn.",
  },
  {
    nom: "Light",
    texte:
      "A Unit composed entirely of Models with the Light Sub-type gains +2 to its Initiative when determining how far it can Rush (cumulative with other bonuses), and can make Shooting Attacks after Rushing, but only as Snap Shots.",
  },
  {
    nom: "Slow and Purposeful",
    texte: "Cannot pursue a fleeing enemy.",
  },
  {
    nom: "Heavy",
    texte:
      "A Unit composed entirely of Models with the Heavy Sub-type gains +1 Cool on Checks to avoid a Tactical Status. A Unit that includes any Model with the Heavy Sub-type cannot Rush, and uses only its Movement Characteristic — without adding its Initiative — for a Set-up Move.",
  },
  {
    nom: "Walker",
    texte:
      "Ignores the Poisoned (X) Special Rule except on an unmodified Wound Test of 6, whatever the value of X. Can attack with all of its Weapons in each Shooting Attack, including in a Reaction (without allowing Weapons lacking the Assault Trait to attack in Volley Attacks). Counts as its Base Wounds value for Combat resolution.",
  },
  {
    nom: "Bulky (X)",
    texte: "Counts as X models in a vehicle (Transport Capacity).",
  },
  {
    nom: "Move Through Cover",
    texte: "Ignores movement penalties caused by cover.",
  },
  {
    nom: "Never Back Down",
    texte:
      "Champions embody the honour of their Legion, and cross blades with the greatest warriors the enemy can set against them. A Model with this Special Rule must take part in a Challenge if able. In the Challenge Sub-Phase, if a Model with this Special Rule is eligible, it must accept a Challenge. If several Models with this Special Rule are eligible to be the Challenger or to accept a Challenge, the Controlling Player chooses which is declared the Challenger or accepts the Challenge.",
  },
  {
    nom: "Fear (X)",
    texte:
      "Enemy units within 12\" suffer a penalty of X to their Leadership, Cool, Willpower and Intelligence Characteristics.",
  },
  {
    nom: "Support Unit (X)",
    texte: "Only scores X Victory Points when holding an objective.",
  },
  {
    nom: "Bitter Duty",
    texte:
      "A model with this rule can only join units that also have it, and vice versa.",
  },
  {
    nom: "Flank Attack",
    texte:
      "A unit composed entirely of models with this rule can enter play from Reserves anywhere along the table edge (outside the enemy deployment zone and more than 7\" from the enemy).",
  },
  {
    nom: "Auto-repair (X)",
    texte:
      "Bonus to a Vehicle's Repair Tests: they succeed on X or more, instead of the usual 6.",
  },
  {
    // Journal Tactica : Battle of Tallarn (Char de Commandement Spartan
    // Prometheus, voir js/unites-data.js).
    nom: "Tank Commander (X)",
    texte:
      "Throughout the many military forces of the Imperium there existed cadres of specialist officers trained specifically to command and organise armoured forces. A Model with this Special Rule allows an Army to include a number of tank detachments equal to the value of X. If a Model with this Special Rule is selected to fill a High Command or Command Slot in any Detachment, the Controlling Player may select a number of Auxiliary Detachments equal to the value of X of the specific version of this Special Rule instead of only one — however, Detachments selected in this way can only include Armour Slots. If the Model with this Special Rule has the Solar Auxilia Trait, these Auxiliary Detachments may then include Armoured Tercio Auxiliary Detachments.",
  },
  {
    // Journal Tactica : Battle of Tallarn (Chars de Commandement
    // Spartan Prometheus et Dracosan).
    nom: "Command Transport",
    texte:
      "Only Models from Units that include at least one Model with the Command Sub-type can embark on a Model with this Special Rule. This does not allow Models that could not normally embark on a Model with the Transport Type to do so.",
  },
  {
    nom: "Command Vehicle (X)",
    texte:
      "Once per Turn, while a Model with this Special Rule is on the Battlefield and the Controlling Player must make a Cool or Leadership Check for another of their Units that includes at least one Model equipped with a nuncio-vox, a command vox or a vox interlink, the value of X may be used to resolve that Check.",
  },
  {
    nom: "Void Shields (X)",
    texte:
      "A model with X void shields ignores Penetrating Hits (Damage reduced to 0) as long as it has any left; each Penetrating Hit uses one up.",
  },
  {
    nom: "Shrouded (X)",
    texte:
      "An additional Damage Mitigation Roll, on top of a Save, successful on X or more.",
  },
  {
    // Cohorte Éoclaste (Blood Angels).
    nom: "Set the Sky Ablaze",
    texte:
      "A Unit with this Special Rule cannot be intercepted from afar as it arrives on the Battlefield. When a Unit that includes at least one Model with this Special Rule, deployed by Deep Strike, is targeted by a Shooting Attack made as part of the Intercept Advanced Reaction, no enemy Model more than 12\" away from every Model in the Unit can make Shooting Attacks as part of that Intercept Advanced Reaction.",
  },
  {
    nom: "Reaping Blow (X)",
    texte:
      "If the model is outnumbered in Combat, it gains a bonus of X Attacks.",
  },
  {
    nom: "Eternal Warrior (X)",
    texte:
      "Reduces the Damage of each unsaved Wound by X (minimum 1).",
  },
  {
    nom: "Battlesmith (X)",
    texte:
      "In the Movement Phase, may attempt to repair or restore a friendly Vehicle/Automata model within 6\".",
  },
  {
    nom: "Feel No Pain (X)",
    texte:
      "A Feel No Pain Damage Mitigation Test can be made for a Model with the Feel No Pain (X) Special Rule to discard Wounds allocated to the Model, after and in addition to a Saving Throw. The Target Number of a Feel No Pain Damage Mitigation Test is the value of X attached to the specific variant of the Special Rule.",
  },
  {
    nom: "Line (X)",
    texte:
      "The unit is better at controlling objectives: a bonus of X Victory Points when it controls one, and it counts for more towards Tactical Strength.",
  },
  {
    nom: "Master of the Legion",
    texte: "Grants an additional Reaction.",
  },
  {
    // Arsenal de la Death Guard (XIVe Légion) : diffuseurs alchimiques
    // empoisonnés de certaines armures (voir js/unites-data.js).
    nom: "Nephos",
    texte:
      "This Special Rule inflicts Hits on an enemy Unit Locked in Combat with Models that have it. At the start of the Fight Sub-Phase, the Nephos affects each enemy Unit Locked in Combat with at least one Unit that includes Models with this Special Rule. Each Unit affected by the Nephos suffers a number of Hits equal to the number of Models with this Special Rule in the Units it is Locked in Combat with. These Hits have a Strength of 1, the Poisoned (3+) Special Rule, an AP of 5 and a Damage Characteristic of 1. No Cover Saves or Shrouded Damage Mitigation Rolls can be made to discard Wounds resulting from these Hits, but other Saves and Damage Mitigation Rolls can be made as normal.",
  },
  {
    // Mortarion, Primarque de la Death Guard (XIVe Légion) : voir
    // js/unites-data.js. Partie règles remplacée par un erratum.
    nom: "Shadow of the Reaper",
    texte:
      "Terrifying and near-spectral, Mortarion can, despite his stature, move unseen and strike where he is least expected. Each time a Model with this Special Rule Rushes, its Movement Characteristic is considered to be 10. In addition, add 2\" to the distance of any Set-up Move made by a Model with this Special Rule.",
  },
  {
    // Mortarion, Primarque de la Death Guard (XIVe Légion) : voir
    // js/unites-data.js.
    nom: "Supernatural Resistance",
    texte:
      "Mortarion's endurance is legendary, and it is said that among his Primarch brothers none could rival him in resistance to pain, and none had endured as much suffering as he had before the Emperor found him. Mortarion limits the Target Number of the Critical Hit (X) Special Rule: when a Model with this Special Rule is Engaged in a Challenge, the value of X of attacks made against it that have the Critical Hit (X) Special Rule is replaced by \"6+\".",
  },
  {
    // Mortarion, Primarque de la Death Guard (XIVe Légion) : voir
    // js/unites-data.js. Condition de la Case Principale câblée dans
    // REGLES_SIRE_TROUPES, js/organigramme.js ; le bonus Fixation (0)
    // sur les Groupes de Tirs à forte Puissance de Feu, jusqu'à la fin
    // du premier Tour de Bataille, effet de pur combat sans incidence
    // sur la construction de liste, n'est pas modélisé.
    nom: "Sire of the Death Guard",
    texte:
      "Mortarion was renowned for the inexorable advance of his Legion, a slow and steady progression that could not be halted or diverted, whether by impassable terrain or by force of arms. The foe had no choice but to cower in bunkers until the Death Guard arrived, or else charge to die under the guns of Mortarion's troops. If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Tactical Squad Units, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, the following Special Rules are granted to all Models with the Death Guard Trait in the same Army: until the end of the first Battle Turn, each time the Controlling Player makes a Shooting Attack for a Unit composed only of Models with the Death Guard Trait, if a Fire Group has a total Firepower Characteristic of 11 or more, the attacks made by that Fire Group have the Pinning (0) Special Rule.",
  },
  {
    // Escouade Iron Havocs (IVe Légion, Iron Warriors) : viseurs
    // spécialisés recoupant flux de données, conditions atmosphériques
    // et mouvements prédictifs des cibles (voir js/unites-data.js).
    nom: "Ferrum Occularis",
    texte:
      "Wounds inflicted by a Model with this Special Rule can ignore Cover Saves. Cover Saves cannot be used against unsaved wounds inflicted by a Shooting Attack made by a Model with this Special Rule, if that Model was part of a Unit that remained Stationary in its Controlling Player's previous Movement Phase.",
  },
  {
    // 0-1 Cohorte de Dominators (IVe Légion, Iron Warriors) : anciens
    // gardes du corps de Perturabo, supplantés par les automates du
    // Cercle de Fer (voir js/unites-data.js).
    nom: "Those Once Honoured",
    texte:
      "The Dominator Cohorts exist in purgatory, stripped of the honours once granted by their Primarch and condemned to serve in the front line of the most gruelling assaults. Once the bodyguard of Perturabo himself and held in high esteem by their Primarch and their Legion, their failure at the Battle of Phall reduced them to the wretched state in which they found themselves during the Horus Heresy. The automata of the Iron Circle, which had replaced them as Perturabo's bodyguard, were a constant reminder of their failures in the first battles of the Horus Heresy and became the target of malicious disdain. A Unit that includes Models with this Special Rule can never be joined by a Perturabo Model.",
  },
  {
    // Le Tourmenteur (IVe Légion, Iron Warriors) : Shadowsword converti
    // en centre de commandement mobile de Perturabo (voir
    // js/unites-data.js).
    nom: "Lair of the Iron Tyrant",
    texte:
      "Perturabo was known to use The Tormentor as a mobile command centre, his automata bodyguard housed in specially modified transport compartments within its hull while he directed his forces. Only Perturabo or Domitar-Ferrum Models can Embark on a Model with this Special Rule.",
  },
  {
    // Perturabo, Primarque des Iron Warriors (voir js/unites-data.js) :
    // Réaction propre au Défi.
    nom: "The Breaker",
    texte:
      "Perturabo rarely concerned himself with notions of honour on the battlefield, devoting himself instead to the grim mathematics of slaughter. Even when an enemy champion sought to goad him into a duel, Perturabo would often prefer to order his troops to riddle the upstart with bolts rather than lower himself to strike them down personally. This Reaction allows a friendly Unit to make a Shooting Attack targeting a Model in a Challenge with Perturabo. While a Model with this Special Rule is in a Challenge, its Controlling Player may choose this Gambit: The Breaker — this Gambit can only be chosen in the first Face-Off Step of a Challenge. If it adopts this Gambit, this Model does not make attacks in the following Strike Step; instead, the Controlling Player of this Model may choose a single friendly Unit composed of Models with the Iron Warriors Trait, within 12\" of the enemy Model involved in this Challenge and not Locked in Combat, and make a Shooting Attack with that Unit. The attacks are resolved as Snap Shots, cannot use Weapons with the Blast (X) Special Rule or the Template Range Characteristic, and Wounds from this Shooting Attack can only be allocated to the opposing Model in the Challenge.",
  },
  {
    // Perturabo, Primarque des Iron Warriors (voir js/unites-data.js) :
    // Règle Spéciale d'Armée.
    nom: "Sire of the Iron Warriors",
    texte:
      "On his adopted world, Perturabo was a peerless warlord and strategist, and he was considered one of the finest artificers among the Primarchs. In battle, however, it was his implacable sense of discipline that most influenced his Legion, for those who fought at his side knew all too well the price of failure or cowardice in the eyes of the Lord of Iron. If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Tactical Squad and/or Breacher Squad Units, all of the Troops Battlefield Role Force Organisation Slots in this Army's Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, the following Special Rule is granted to all Models in the same Army that have the Infantry Trait and the Iron Warriors Trait: until the end of the first Battle Turn, all Models with the Infantry Type in this Army that have the Iron Warriors Trait have the Expendable (1) Special Rule; if they already have the Expendable (X) Special Rule, the value of X is increased by 1.",
  },
  {
    // Cassian Dracos Ressuscité (XVIIIe Légion, Salamanders) : voir
    // js/unites-data.js.
    nom: "Drakenscale Armour",
    texte:
      "Vulkan personally forged the plates of Cassian Dracos' armour, granting it a resilience far greater than that of more ordinary Dreadnoughts. Its intricate surface could withstand heat and radiation far better than any other armour. Wounds with the Flame, Plasma, Melta or Volkite Trait allocated to a Model with this Special Rule have their Damage Characteristic reduced to 1.",
  },
  {
    // Cassian Dracos Ressuscité (XVIIIe Légion, Salamanders) : voir
    // js/unites-data.js.
    nom: "Whispers of Isstvan",
    texte:
      "Buried beneath the surface of Isstvan V for almost a year, Cassian Dracos was tormented by solitude and the knowledge of his own failures. When he emerged, he was transformed, gifted with a new power over the animus of machines and of weak wills. Cassian Dracos Reborn has the Cybertheurgist Trait and can only use the Scrapcode Infection Cybertheurgic Rite (see Liber Mechanicum, page 65). When this Cybertheurgic Rite is invoked for Cassian Dracos, he is considered to have the Heterodox Trait even if he does not have the Traitor Trait.",
  },
  {
    // Escouade des Adhérents (XVIIIe Légion, Salamanders) : voir
    // js/unites-data.js.
    nom: "Creed of Flame",
    texte:
      "The ritual significance of the purifying flame was central to the many sub-sects of the Promethean Cult that emerged in the wake of the Dropsite Massacre, employed to dreadful effect on the battlefields of the Horus Heresy. Models with this Special Rule can make Volley Attacks with Weapons that have the Flame Trait. Any weapon with the Flame Trait carried by a Model with this Special Rule also gains the Assault Trait, and ignores the effects of the Limited (X) Special Rule when making Volley Attacks.",
  },
  {
    // Ætos Dios (VIIe Légion, Imperial Fists) : voir js/unites-data.js.
    nom: "Ætos Praetoria",
    texte:
      "The Ætos Dios can only be included in an Army that also includes Rogal Dorn. If the Ætos Dios is included in an Army in this way, Rogal Dorn must begin the battle Embarked on it.",
  },
  {
    // Atramentar Écorchés (VIIIe Légion, Night Lords) : voir
    // js/unites-data.js.
    nom: "Cloaked in Murder",
    texte:
      "For the warriors of the Atramentar, no act is beneath them, and any semblance of honourable combat has long since been abandoned. Seeking only to finish their foe in the most painful and ignominious manner possible, they use trickery and guile to deliver treacherous and underhanded attacks, never facing their opponent in a fair fight, even going so far as to push their own brothers in front of a killing blow to create an opening for a counter-attack. When the Controlling Player selects an enemy Unit that is already Locked in Combat as the Target of a Charge made by a Unit composed entirely of Models with this Special Rule, the Models with this Special Rule modify their Set-up Move Distance by +1\", to a maximum of 6\", until that Charge Move has been resolved.",
  },
  {
    // Atramentar Écorchés (VIIIe Légion, Night Lords) : voir
    // js/unites-data.js.
    nom: "Sworn Loyalty",
    texte:
      "The Atramentar had sworn fealty neither to their Legion nor to their Primarch, but to Sevatar alone. In battle, they followed his orders without question, without remorse or hesitation. It was a rare example of loyalty within a Legion renowned for its treachery and lack of honour. When included in an Army in which a Sevatar Model has been selected in the Primary Detachment and is on the battlefield, the Controlling Player of a Atramentar Flay-clade Unit may always use Sevatar's Base Leadership Characteristic instead of the Unit's for any Leadership Check made for this Unit.",
  },
  {
    // Konrad Curze, Primarque des Night Lords (VIIIe Légion) : voir
    // js/unites-data.js.
    nom: "A Death Long Foretold",
    texte:
      "Konrad Curze had, to his misfortune, inherited some of his father's psychic abilities, and so received fleeting visions of the future, but his control over these premonitions was tenuous at best. When the Controlling Player chooses a Gambit for a Model with this Special Rule, they may roll a dice: on a 5+, the A Death Long Foretold Gambit becomes available to this Model and may be chosen instead of any other Gambit otherwise available to it. An empire in flames, a throne in a nightmare palace and a shadowed figure wreathed in righteous wrath: it all ends in horror and ignominy, at the hand of a lowly pawn — the terrors of the battlefields of the present are nothing beside the futility of the future. When this Gambit is chosen, the Controlling Player may make a Willpower Check for each of the following benefits; if the Willpower Check is passed, the corresponding effect applies until the start of the next Face-Off Step: this Model gains the Feel No Pain (5+) Special Rule; the value of this Model's Attacks Characteristic is modified by +1; the Initiative Modifier Characteristic of Mercy and Forgiveness becomes \"+2\".",
  },
  {
    // Konrad Curze, Primarque des Night Lords (VIIIe Légion) : voir
    // js/unites-data.js. Condition de la Case Principale câblée dans
    // REGLES_SIRE_TROUPES, js/organigramme.js ; le bonus Infiltration
    // (I2) aux Escouades Terreur, effet de pur combat sans incidence
    // sur la construction de liste, n'est pas modélisé.
    nom: "Sire of the Night Lords",
    texte:
      "Bitter and tormented, obsessed with death and judgement, and convinced of the need to inspire fear in order to control an irredeemably fallible Humanity, Konrad Curze and his Legion were shaped by the terror and darkness of Nostramo as much as by the Emperor's gene-craft. Lurking in the shadows, they wait for the right moment to strike. If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Terror Squad and/or Assault Squad Units, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, the following Special Rule is granted to all Models in Terror Squad Units in the same Army: all Models in Terror Squad Units in this Army gain the Infiltrate (I2) Special Rule.",
  },
  {
    // Autilon Skorr (XXe Légion, Alpha Legion) : voir js/unites-data.js.
    nom: "Consul-Delegatus",
    texte:
      "The demands of the Great Crusade sometimes required that junior officers within the Legions be granted extraordinary levels of authority to accomplish their objectives. Usually entrusted with jurisdiction over larger forces, even forces that would normally fall under the control of the highest echelons of command or even the Primarchs themselves, such warriors proved themselves time and time again. An Army can never include more than one Model with this Special Rule. If a Model with this Special Rule fills a High Command or Command Slot in a Detachment from the Crusade Force Organisation Chart, the Controlling Player may choose an Apex Detachment instead of the Auxiliary Detachment usually unlocked by that Slot. In addition, a Model with this Special Rule counts as a High Command Choice for any version of the Slay the Warlord (X) Secondary Objective.",
  },
  {
    // Alpharius, Primarque de l'Alpha Legion (XXe Légion) : voir
    // js/unites-data.js.
    nom: "Everywhere and Nowhere",
    texte:
      "No Primarch was more unpredictable than Alpharius, for he would appear unexpectedly anywhere, by any means. Those who have studied his methods have failed to find the patterns that would allow his actions to be predicted, let alone define his preferences in any way whatsoever. Alpharius can be redeployed at the start of the Battle. If the Mission being played includes a Deploy Armies step, at the end of that step the Controlling Player of a Model with this Special Rule may redeploy that Model. When they do so, this Model may leave any Unit it joined before being Deployed, and may join a different Unit by being Deployed in Unit Coherency with that Unit if it is on the Battlefield, or Embarked on that Unit if it is on board a Model with the Transport Sub-type that has sufficient Transport Capacity to do so and is capable of Transporting Models with the Bulky (X) Special Rule. This Special Rule cannot be used to deploy a Model outside the Controlling Player's Deployment Zone, or to Embark it on a Model with the Transport Sub-type that is on the Battlefield but outside the Controlling Player's Deployment Zone.",
  },
  {
    // Alpharius, Primarque de l'Alpha Legion (XXe Légion) : voir
    // js/unites-data.js. Condition de la Case Principale câblée dans
    // REGLES_SIRE_TROUPES, js/organigramme.js ; le bonus de Jet de
    // Réserves (Attaque de Flanc sur 5+), effet de pur combat sans
    // incidence sur la construction de liste, n'est pas modélisé.
    nom: "Sire of the Alpha Legion",
    texte:
      "Alpharius is the master of the harrowing, the Alpha Legion's favoured strategy, and he leads his troops into battle with an ease born of long practice. In his presence, every element of his forces acts in concert, encircling the foe and isolating each element to be eliminated. If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Tactical Squad and/or Assault Squad Units, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, the following Special Rule is granted to all Models in the same Army that have the Alpha Legion Trait: when the Controlling Player of a Model with this Special Rule makes a Reserves Roll for a Unit composed only of Models with the Alpha Legion Trait, on a Reserves Roll of 5+, that Unit may enter play as if it had the Flank Attack Special Rule.",
  },
  {
    // Cadre de Perturbation Effrit (XXe Légion, Alpha Legion) : voir
    // js/unites-data.js.
    nom: "Hydra's Wail",
    texte:
      "Projected from disruption arrays entrusted to elite advanced infiltration teams, the Hydra's Howl is a suite of targeted waves and disruptive signals across a multitude of frequencies. Using systems believed to be derived from proscribed Abominable Intelligences dating back to the Age of Darkness, these emissions can overwhelm enemy communications, auspex and coordination networks, which, unless specifically countered, renders entire swathes of the Legion's standard equipment useless. For any Cool or Intelligence Check made by a Unit that has at least one Model within 12\" of at least one enemy Model with this Special Rule, the Controlling Player must roll an additional Dice and discard the lowest result.",
  },
  {
    // Escouade d'Assaut Locutarus (XIIIe Légion, Ultramarines) : voir
    // js/unites-data.js.
    nom: "The Blade of Wisdom",
    texte:
      "The Blade of Wisdom is an advanced assault strategy first devised during the Great Crusade. The Locutarus launch a perfectly synchronised Charge against enemies pinned in place by the deadly accurate fire of mutually supporting Ultramarines units, and swiftly annihilate their opponents in a storm of expert sword strokes. Models with this Special Rule gain a bonus when Locked in Combat with Units that have Tactical Statuses: when Locked in Combat with a Unit that includes at least one Model with any Tactical Status, the Models with this Special Rule in that Combat gain an additional modifier of +1 to their Attacks Characteristic until the end of the Phase.",
  },
  {
    // Cenobium de Chevaliers du Cercle Intérieur — Ordre des Griffes
    // Brisées (Ire Légion, Dark Angels) : voir js/unites-data.js.
    nom: "Order of the Broken Claws",
    texte:
      "Of all the warriors of the Ist Legion, the Order of the Broken Claws was the most experienced in the fight against the monstrous biological forms of the Rangda, hardened to their indescribable horror. Although these knights had seen their numbers dwindle by the outbreak of the Horus Heresy, their hard-won experience of fighting the inhuman would prove invaluable. While a Model with this Special Rule is part of a Unit Locked in Combat with an enemy Unit that includes one or more Models with the Walker Type, the Automata Type or the Malefic Sub-type: this Model has its Toughness Characteristic modified by +1; and for any Characteristic Check using this Model's Leadership, Cool, Willpower or Intelligence Characteristics, the Controlling Player may ignore negative modifiers to that Characteristic.",
  },
  {
    // Excindio (Ire Légion, Dark Angels) : voir js/unites-data.js.
    nom: "Vengeful Rage",
    texte:
      "Although each Excindio is usually kept under technological restraint, in battle these restrictions must be loosened to unleash its full power. If it is sufficiently damaged, however, even the strict safeguards imposed by its controllers can be overridden by its complex adaptive systems. The resulting fury is as dangerous to its allies as to its enemy, until it can be brought back under control. While a Model with this Special Rule has a Current Wounds Characteristic of 4 or less, in each of its Controlling Player's Shooting Phases it must make a Shooting Attack targeting the closest friendly or enemy Unit that has Line of Sight to the Model. Such a Shooting Attack must use all Weapons that are in range of at least one Model in the Target Unit.",
  },
  {
    // Excindio (Ire Légion, Dark Angels) : Type de Figurine, voir
    // js/unites-data.js.
    nom: "Artificia",
    texte:
      "These creatures outwardly resemble the automata of the Mechanicum, but beneath their metal skin they have nothing in common with them. The Artificia are not crude metal servitors, but a living mind forged in steel and conditioned to hate every other form of life. Models with the Artificia Type cannot gain any Cybertheurgic Status, but can gain Tactical Statuses or other types of Status effects. When targeting a Unit that includes Models with the Artificia Type, the Poisoned (X) Special Rule is only triggered on a Wound Test result of \"6\" before modifiers are applied, regardless of the value of X of that variant of the Special Rule.",
  },
  {
    // Cabale Enigmatus de la Firewing (Ire Légion, Dark Angels) : voir
    // js/unites-data.js.
    nom: "Marked for Death (X)",
    texte:
      "Some cohorts of warriors take to the battlefield with a specific target marked for destruction. Such actions may be driven by a desire for vengeance, to settle a dispute, or simply result from the express orders of their superiors in the interest of a wider strategy. At the end of the Mission's Declare Reserves Step, the Controlling Player of any Unit with this Special Rule may choose a Unit in the Opposing Player's Army: that Unit becomes the \"Marked\" Unit. Once per Battle, the Controlling Player scores additional Victory Points equal to the value of X if a friendly Unit with this Special Rule scores Victory Points through the Vanguard (X) Special Rule when the enemy Unit that fulfils the conditions of the Vanguard (X) Special Rule is the Marked Unit.",
  },
  {
    // Horus Lupercal, Primarque des Sons of Horus (XVIe Légion) : voir
    // js/unites-data.js.
    nom: "Master of War",
    texte:
      "Horus blends a strategic intellect bordering on genius with the savagery of a street fighter, talents he honed over centuries of ceaseless war, and many rightly consider him the greatest of all the Primarchs. Horus grants a bonus Reaction Allotment to the Army he is part of: the Controlling Player of an Army that includes a Model with this Special Rule has +1 to their Reaction Allotment each Turn, unless that Model has been Removed as a Casualty.",
  },
  {
    // Horus Lupercal, Primarque des Sons of Horus (XVIe Légion) : voir
    // js/unites-data.js. Condition de la Case Principale câblée dans
    // REGLES_SIRE_TROUPES, js/organigramme.js ; le bonus de Caractéris-
    // tique de Mouvement, jusqu'à la fin du premier Tour de Bataille,
    // effet de pur combat sans incidence sur la construction de liste,
    // n'est pas modélisé.
    nom: "Sire of the Sons of Horus",
    texte:
      "Horus expected his subordinates to surpass themselves. When he walked the battlefield in person, his warriors vied with one another in deeds of valour in the hope of earning a place in the Warmaster's inner circle of advisors. If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Tactical Squad and/or Purge Squad Units, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of the Army, the following Special Rules are granted to all Models in the same Army that have the Sons of Horus Trait: until the end of the first Battle Turn, the Controlling Player of a Model with this Special Rule may add +1 to the Movement Characteristic of Models in their Army that have the Sons of Horus Trait (excluding Models with the Vehicle Type).",
  },
  {
    // Horus Exalté (XVIe Légion, Sons of Horus) : voir js/unites-data.js.
    // Exclusion mutuelle avec Horus Lupercal déjà modélisée via
    // excluAvec sur les deux Unités.
    nom: "Corruption Spreads",
    texte:
      "The shadow of the powers of the Warp that had seized Horus' soul also spread over the warriors who had taken up arms for the Warmaster. Corruption spread through the ranks of his armies, corrupting the hordes of hate he had recruited and stoking the black fervour of the Empire they had helped to build. Horus can join Units with the Malefic Sub-type: a Model with this Special Rule can join Units with the Malefic Sub-type as if it had that Sub-type, and while it is part of such a Unit, it is treated as if it had that Sub-type.",
  },
  {
    // Horus Exalté (XVIe Légion, Sons of Horus) : voir js/unites-data.js.
    nom: "The Exalted Warmaster",
    texte:
      "As Chaos tightened its grip on Horus, the iron of the warrior who had presided over the triumphs of the Imperium's armies vanished, consumed by ambition and hatred. Horus Ascended cannot be included in the same Army as Horus Lupercal.",
  },
  {
    // Escouade des Chefs de Guerre (XVIe Légion, Sons of Horus) : voir
    // js/unites-data.js.
    nom: "Honour Above All",
    texte:
      "The Sons of Horus War Leaders had earned their rank through loyalty, honour and merciless violence, their devotion and quality tested against countless foes and never found wanting. Their duty was to ensure that none interfered when their lord sought to prove his supremacy in single combat, cutting down any who sought to strike a dishonourable blow against the one they protected. When a Model that has joined a Unit that includes Models with this Special Rule takes part in a Challenge, all Models in that Unit with this Special Rule gain a bonus of +1 to all Wound Tests made during the following Strike Sub-Phase of that Assault Phase.",
  },
  {
    // Escouade Terminator Morlock (Xe Légion, Iron Hands) : voir
    // js/unites-data.js.
    nom: "Fate of the Gorgon",
    texte:
      "If the death of Ferrus Manus awoke a cold fury in the heart of every Iron Hand, those of his Avernii retinue felt it more keenly still, seeking out the members of the IIIrd Legion to wreak their vengeance upon them. When part of an Army that does not include Ferrus Manus, a Model with this Special Rule has the Hatred (Emperor's Children) Special Rule.",
  },
  {
    // Cabale de Numérologistes (XVe Légion, Thousand Sons) : voir
    // js/unites-data.js.
    nom: "Numerologist Order",
    texte:
      "The Numerologists of the Thousand Sons were members of the Order of Ruin, which filled a role similar to that of the Techmarines in other Legions. They were also renowned for their tactical acuity, devising strategies and influencing the course of battle. Much of their success could be attributed to the psychic abilities of the Numerologists, who employed both divination and telepathy to predict enemy movements and relay these changes to their allies. A Model with this Special Rule has the following Psychic Powers, but a Unit that includes a Model with this Special Rule cannot be assigned a Prosperine Arcana as normal. In addition, it has the Telepath and Diviner Traits: Blessing of Prescience (Divination Discipline), Mind-Burst (Telepathy Discipline).",
  },
  {
    // Cabale de Numérologistes (XVe Légion, Thousand Sons) : voir
    // js/unites-data.js.
    nom: "Life Wards",
    texte:
      "Usually deployed with the rear echelons of the XVth Legion during the Great Crusade, the Numerologists saw far more frequent front-line service during the Horus Heresy. To minimise the risks, they went into battle accompanied by a cadre of specialised Life Wards charged with protecting them as they went about their tasks. While a Numerologist Model is part of a Unit that includes Models with this Special Rule, Wounds caused as part of a Shooting Attack made by a Weapon or Model with the Precision (X) Special Rule cannot be allocated to that Numerologist Model.",
  },
  {
    // Rylanor l'Inébranlable (IIIe Légion, Emperor's Children) : voir
    // js/unites-data.js.
    nom: "Vengeful Hate",
    texte:
      "For his loyalty to the Emperor, the IIIrd Legion marked Rylanor for destruction, but he refused to die on Isstvan. Instead, his hatred was distilled, and his gene-sire came to embody the betrayal he had suffered. Rylanor can take part in a Challenge when Fulgrim is the Challenger. If a Model with this Special Rule is Locked in Combat with an enemy Unit that includes Fulgrim or Fulgrim Transfigured, the Model with this Special Rule is considered eligible to take part in a Challenge. In such a Challenge, if Fulgrim or Fulgrim Transfigured is the Challenger, Rylanor must be the Challenged model.",
  },
  {
    // Escouade Tueurs de Soleils (IIIe Légion, Emperor's Children) :
    // voir js/unites-data.js.
    nom: "Designated Quarry",
    texte:
      "Sun Killer squads never took to the battlefield without defined targets and, whatever the outcome of the battle, they considered it a failure not to bring down those specific foes. On rare occasions, several Sun Killer squads operated in the same sector, vying with one another to hunt down and eliminate the greatest foe. Once per Battle, before making a Shooting Attack in its Controlling Player's Shooting Phase, the Controlling Player of a Unit with this Special Rule that did not Move in the previous Movement Phase may choose an enemy Unit with the Vehicle Type as that Unit's Designated Quarry. When the Unit with this Special Rule makes a Shooting Attack that targets an enemy Unit selected as its Designated Quarry, the Ballistic Skill Characteristic of all Models with this Special Rule in the Unit making the Shooting Attack is modified by +1 for the duration of the current Phase.",
  },
  {
    // Meute de Chasseurs Jorlund (VIe Légion, Space Wolves) : voir
    // js/unites-data.js.
    nom: "Scouring Tempest",
    texte:
      "Guided by unshakeable faith in the auguries of the rune priests, the Jorlund Hunter Packs accompany the vanguard forces of the VIth Legion and range ahead of the battle line to incinerate their enemies with purifying flame. When a Unit that includes Models with this Special Rule is selected to make a Shooting Attack, if five or more Models make attacks with hand flamers, those hand flamers gain the Panic (1) Special Rule until that Shooting Attack has been resolved.",
  },
  {
    nom: "Medic (X)",
    texte:
      "Sets the difficulty of Recovery Tests (the number to reach) for this unit, without granting any by itself.",
  },
  {
    nom: "Negligence",
    texte: "The unit can never control or contest an Objective.",
  },
  {
    nom: "Officer of the Line (X)",
    texte:
      "Allows a number of Auxiliary Detachments equal to X to be selected for the relevant Command Slot, instead of only one.",
  },
  {
    nom: "Firestorm",
    texte:
      "A Model with this Special Rule is not required to make its Volley Attacks as Snap Shots: it fires normally. In addition, after making Volley Attacks in Step 4 of the Charge Procedure, a Unit that includes any Model with this Special Rule is not required to make a Charge Roll in Step 5. If the Controlling Player chooses not to make a Charge Roll in that Step, the Charge ends immediately.",
  },
  {
    nom: "Opens on Impact",
    texte:
      "The vehicle's doors are open from the moment it is deployed; any embarked unit must disembark immediately, and no one can embark afterwards.",
  },
  {
    nom: "Firing Protocols (X)",
    texte:
      "The model can attack with X different ranged weapons instead of only one.",
  },
  {
    nom: "Expendable (X)",
    texte:
      "Reduces the Victory Points scored by the opponent when this unit is destroyed by X (minimum 1).",
  },
  {
    nom: "Light Transport",
    texte: "Cannot transport models with the Bulky (X) rule.",
  },
  {
    nom: "Assault Vehicle",
    texte:
      "A unit that disembarks from this vehicle can charge this turn without the charge being Disordered.",
  },
  {
    nom: "Orbital Assault Vehicle",
    texte: "Must deploy by Deep Strike.",
  },
  {
    nom: "Fleet (X)",
    texte:
      "A unit composed entirely of models with this rule gains a bonus of X\" when Rushing, and of X to its Charge Roll.",
  },
  {
    nom: "Boarding Shield",
    texte:
      "Grants a 5+ Invulnerable Save, the Shield Trait and the Heavy Sub-type.",
  },
  {
    nom: "Combat Shield",
    texte:
      "Grants a 5+ Invulnerable Save against melee attacks, and a bonus of +1 to the Focus Roll in a Challenge.",
  },
  {
    nom: "Thermal Diffraction Field",
    texte:
      "Reduces by 1 the Strength of any Hit inflicted by a weapon with the Las, Plasma, Melta or Flame trait.",
  },
  {
    nom: "Cognis-signum",
    texte:
      "Instead of shooting, the model may attempt an Intelligence Check to designate a visible enemy unit: the next shooting attack in the phase using a Barrage (X) weapon against that target hits normally, even without Line of Sight.",
  },
  {
    nom: "Cortex Controller",
    texte:
      "Allows models with the Automata Type in the unit to declare Reactions, which they are normally forbidden from doing.",
  },
  {
    nom: "Cyber-familiar",
    texte: "A −2 bonus to the result of the model's Intelligence Checks.",
  },

  /* --- Arsenal de la Raven Guard (XIXe Légion) : Corvus Corax, Kaedes
     Nex, Escouade de Mor Deythan, Escouade de Furies Noires (voir
     js/unites-data.js, unités réservées à cette Légion). --- */
  {
    nom: "Fatal Strike",
    texte:
      "Once per Battle, if a Unit with this Special Rule remained Stationary in the previous Movement Phase, the Controlling Player may have it perform a Fatal Strike in the Shooting Phase: add +2 to the Ballistic Skill of all Models in the Unit with this Special Rule, for the duration of the current Phase.",
  },
  {
    nom: "The Bloodied Crow",
    texte:
      "Kaedes Nex always uses his full Ballistic Skill: his Shooting Attacks are never reduced to Snap Shots, and his Ballistic Skill can never be reduced below 6 (except against a target with the Flyer Sub-type). Shrouded Damage Mitigation Rolls made against Wounds he inflicts by shooting only succeed on a 6+, regardless of the Target Model's version of Shrouded (X).",
  },
  {
    nom: "The Shadowed Lord",
    texte:
      "A Gambit available to Corvus Corax while he is Engaged in a Challenge: he fights as if he had lost no Wounds (negative modifiers to the Focus Roll due to a Wounds Characteristic lower than his Base Value are ignored), provided he chooses Talionis at the start of the Focus Step. If he inflicts at least one successful Hit with Talionis in the Strike Step as the Active Player, he may move to the Glory Step as soon as Step 4 is resolved, even without Challenge Advantage.",
  },
  {
    nom: "Sire of the Raven Guard",
    texte:
      "While a Model with this Special Rule is part of the Army: if at least four Troops Battlefield Role Slots in the Primary Detachment are filled by Tactical and/or Assault Squads, all Troops Slots in that Detachment are considered to be Prime Slots; and until the end of the first Battle Turn, every Model with the Infantry Type in the Army that has the Raven Guard Trait gains the Move Through Cover Special Rule.",
  },
  {
    nom: "Spectres",
    texte:
      "After Rushing, a successful Willpower Check makes any Charge targeting the Unit in the following Player Turn Disordered; if failed, the Unit gains the Stunned Tactical Status instead.",
  },
  {
    nom: "Cameleoline",
    texte:
      "If a Unit that includes at least one Model equipped with Cameleoline is targeted by a Shooting Attack from at least 12\" away from the Attacking Unit, its Models gain the Shrouded (5+) Special Rule, or improve by +1 (up to a maximum of Shrouded (4+)) any version of Shrouded (X) they already have.",
  },
  {
    nom: "Corvid Pattern Jump Pack",
    texte:
      "Sets the equipped Model's Movement Characteristic to 14, and replaces any Bulky (X) Special Rule with Bulky (3). Any Dangerous Terrain Tests it must make are automatically passed.",
  },

  /* --- Arsenal des White Scars (Ve Légion) : Jaghatai Khan, Qin Xa,
     Hibou Khan, Devin de l'Orage, Keshig d'Or, Speeder d'Assaut
     Kyzagan, Keshig d'Ébène (voir js/unites-data.js, unités réservées
     à cette Légion). --- */
  {
    nom: "Seeker of Atonement",
    texte:
      "A Gambit available to Hibou Khan while he is Engaged in a Challenge: if this Gambit is chosen and he is reduced to 0 Wounds in Step 4 of the Strike Step, his Controlling Player rolls a dice — on a 4+, he is not Removed as a Casualty and remains Engaged in the Challenge with a Wounds Characteristic of 1, and his Controlling Player gains Challenge Advantage.",
  },
  {
    nom: "Chosen of the Khagan",
    texte:
      "Guarantees the arrival of a Unit held in Reserves: once per Battle, at the start of the Reserves Sub-Phase of the Movement Phase, the Controlling Player of this Model may choose a single Unit in Reserves composed only of Models with the White Scars Trait — Reserves Rolls made for that Unit in that Sub-Phase are automatically successful.",
  },
  {
    nom: "Death by a Thousand Cuts",
    texte:
      "A Gambit available while a Model with this Special Rule is Engaged in a Challenge: in the Strike Step, the Strength of attacks made by the enemy Model is modified by -1 if the Current Value of its Wounds Characteristic is lower than its Base Value (never reducing the Strength of an attack to a value lower than 1).",
  },
  {
    nom: "Sire of the White Scars",
    texte:
      "While a Model with this Special Rule is part of the Army: if at least four Troops Battlefield Role Slots in the Primary Detachment are filled, its Transport Battlefield Role Slots may be exchanged for Recon Battlefield Role Slots filled by Land Raider Explorator Units; and until the end of the first Battle Turn, every Model with the Infantry or Paragon Type in the Army that has the White Scars Trait gains the Fleet (2) Special Rule.",
  },
  {
    nom: "Call of the Storm",
    texte:
      "White Scars Psychic Discipline: a Model that has it gains the Move Through Cover Special Rule, the Unseen Lightning Psychic Weapon, the Call of the Wind Psychic Power, and the \"Stormseer\" Trait.",
  },
  {
    nom: "Call of the Wind",
    texte:
      "Psychic Power (Blessing), manifested in the Movement Phase: the Focus is a Model with the Stormseer Trait in the Unit that is about to Move; the Target is a friendly Unit composed entirely of Models with the White Scars Trait, within 12\" and in Line of Sight of the Focus. If successful, the Target Unit cannot Rush this turn, but the Movement Characteristic of each of its Models is modified by a value equal to its own Initiative Characteristic for its normal Move this Phase.",
  },
  {
    nom: "The Sagyar Mazan",
    texte:
      "A Prime Advantage reserved for a Unit composed entirely of Models with the White Scars Trait and the Infantry or Cavalry Type filling a Prime Slot: its Models gain the Expendable (2) Special Rule.",
  },
  {
    nom: "Cyber-falcon",
    texte:
      "Wargear (+10 Points per Model) reserved for a Model with the Command Sub-type that has the White Scars Trait: all Models in a Unit that includes at least one cyber-falcon gain the Move Through Cover Special Rule.",
  },

  /* --- Arsenal des Blood Angels (IXe Légion) : Sanguinius, Raldoron,
     Dominion Zephon, Aster Crohne, Paladins Écarlates, Dreadnought
     Contemptor-Incaendius, Les Larmes de l'Ange (voir js/unites-data.js,
     unités réservées à cette Légion). --- */
  {
    nom: "Incaendius Propulsor",
    texte:
      "When it Rushes, a Model with this Special Rule gains the Antigrav Sub-type for the duration of that Movement Phase.",
  },
  {
    nom: "The Blood Endures",
    texte:
      "While the Unit that a Model with this Special Rule is part of is Locked in Combat with one or more enemy Units that together have more Models than it, a Model with this Special Rule gains the Feel No Pain (5+) Special Rule. If the enemy outnumbers it by more than two to one, the Models instead gain Feel No Pain (4+). A Model that has joined the Unit does not gain this Rule and does not count when determining whether the Unit is outnumbered.",
  },
  {
    nom: "Coriolis Pattern Power Shield",
    texte:
      "When a Wound is allocated to a Model equipped with a Coriolis pattern power shield, the Damage Characteristic of the Unsaved Wound is modified by -1 (to a minimum of 1). In addition, a Model equipped with a Coriolis pattern power shield gains the Shield Trait.",
  },
  {
    nom: "The Ghost of Saiph",
    texte:
      "The first time during a Battle that a Model with this Special Rule is reduced to 0 Wounds, before Removing that Model as a Casualty, the Controlling Player rolls a dice. On a result of 4+, that Model is not Removed as a Casualty and its Current Wounds Characteristic is set to 1.",
  },
  {
    nom: "Archein of Wisdom",
    texte:
      "A Gambit available while a Model with this Special Rule is Engaged in a Challenge: if it is chosen, the Controlling Player of this Model gains a positive modifier to their Focus Roll equal to the number of Hit Tests their opponent passed in the previous Strike Step of the current Challenge (no effect if no Strike Step has yet been resolved).",
  },
  {
    nom: "Angelic Descent",
    texte:
      "A Gambit available while a Model with this Special Rule is Engaged in a Challenge, only before the first Focus Roll of a Challenge and only if the Model made a successful Charge in the same Assault Phase: in the following Focus Step, the Controlling Player gains a positive modifier to the Focus Roll equal to the variant of Bulky (X) that the enemy Model Engaged in the Challenge with it has.",
  },
  {
    nom: "Sire of the Blood Angels",
    texte:
      "While a Model with this Special Rule is part of the Army: if at least four Troops Battlefield Role Slots in the Primary Detachment are filled by Assault Squads, all Troops Battlefield Role Force Organisation Slots in that Detachment are considered to be Prime Slots. In addition, all Models in the same Army that have the Blood Angels Trait and the Deep Strike Special Rule gain: once per Turn, when the Controlling Player of a Model with the Blood Angels Trait and the Deep Strike Special Rule makes a Reserves Roll for a Unit composed only of Models with the Blood Angels Trait, that Player may modify that Roll by +1. If they apply this modifier, they must deploy that Unit using the Deep Strike Special Rule before making the Reserves Roll.",
  },
  {
    nom: "Revenants",
    texte:
      "A Prime Advantage reserved for a Unit composed entirely of Models with the Blood Angels Trait filling a Prime Slot: its Models gain the Fear (1) Special Rule.",
  },

  /* --- Arsenal des World Eaters (XIIe Légion) : Angron, Angron
     Transfiguré, Khârn le Sanglant, Lotara Sarrin, Escouade Saccageuse
     (voir js/unites-data.js, unités réservées à cette Légion). --- */
  {
    nom: "Lord of the Red Sands",
    texte:
      "Angron can fight several successive Challenges in a single Turn. At the start of the Glory Step of a Challenge in which the Challenger is a Model with this Special Rule, before resolving that Glory Step, the Controlling Player of the Model with this Special Rule may immediately return to the Declare Challenge Step in order to declare another Challenge. Enemy Models that have already fought in a Challenge in this Sub-Phase are not eligible to take part in this additional Challenge. When the Glory Step is resolved in this Challenge Sub-Phase, the players gain Combat Resolution Points for all Challenges resolved during this Sub-Phase.",
  },
  {
    nom: "Sire of the World Eaters",
    texte:
      "The Controlling Player may apply the following additional Special Rules to all World Eaters Primary, Auxiliary and Apex Detachments in their Army, while a Model with this Special Rule is part of it: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Assault Squad and/or Purge Squad Units, they are considered to be Prime Slots. Until the end of the first Battle Turn, all Models with the Infantry or Paragon Type that have the World Eaters Trait have the Fleet (2) Special Rule.",
  },
  {
    nom: "Calm and Collected",
    texte:
      "A Unit joined by Lotara Sarrin can use her Characteristics to remove Tactical Statuses. If a Unit includes a Model with this Special Rule, in the Start Phase of its Turn as the Active Player, the Controlling Player may make a Check to remove a single Status from all Models in the Unit that includes the Model with this Special Rule. This Check is made using the appropriate Characteristic of the Model with this Special Rule (namely Cool, except to remove Routed, in which case it is Leadership).",
  },
  {
    nom: "The Shadow of the Conqueror",
    texte:
      "If a Model with this Special Rule is part of this Army's Primary Detachment and is on the Battlefield, in the Effects Sub-Phase of the Start Phase, the Controlling Player of the Model with this Special Rule may make an Intelligence Check for that Model. If the Check is passed, the Controlling Player may choose one of the following options: Coordinate — once this Turn, before making a Reserves Roll for a Unit in Aerial Reserves, the Controlling Player may modify the result of that Reserves Roll by +1. Annihilate — once in the next enemy Movement Phase, the Controlling Player may perform the Guns of the Conqueror Advanced Reaction: the Reactive Player may declare it in Step 2 of the Move Sub-Phase if an enemy Unit ends a Move within 24\" and in Line of Sight of a Model in a Unit under their control that includes a Model with this Special Rule (Cost: 3 Reaction Points; Target: the Unit whose Move triggers the Reaction). The Reactive Player then makes a Shooting Attack against the Target Unit with the Guns of the Conqueror profile (24, 1, 10, 3, 3 — Barrage (2), Blast (7\"), Breaching (5+), Assault), whose Hit Test automatically fails; once this Attack has been fully resolved, including removing Casualties, the Active Player finishes resolving the Target Unit's Move if applicable.",
  },

  /* --- Arsenal des Salamanders (XVIIIe Légion) : Vulkan, Escouade
     Pyroclaste, Escouade Terminator Pyrodracs (voir js/unites-data.js,
     unités réservées à cette Légion). --- */
  {
    nom: "Drakenscale",
    texte:
      "Wargear (+10 Points per Model) reserved for a Model with the Command or Champion Sub-type that has the Salamanders Trait: the Damage Characteristic of Wounds with the Flame, Plasma, Melta or Volkite Trait allocated to a Model equipped with Drakenscale is set to 1.",
  },
  {
    nom: "Duty Before Death",
    texte:
      "A Prime Advantage reserved for a Unit composed entirely of Models with the Salamanders Trait and the Troops Battlefield Role filling a Prime Slot: its Models gain the Feel No Pain (6+) Special Rule.",
  },
  {
    nom: "The Unquenchable Fire",
    texte:
      "A Gambit available while a Model with this Special Rule is Engaged in a Challenge: the Controlling Player of this Model cannot apply any positive modifiers to the Focus Roll in Step 4 of the Strike Step. However, if this Model is not reduced to 0 Wounds before the players return to Step 2 of the Challenge procedure or move on to the Glory Step, it increases the value of its Current Wounds Characteristic by +D3, up to its Base Wounds Characteristic. Any Wounds regained through this Special Rule do not affect the number of Wounds the Opponent has inflicted for Combat Resolution.",
  },
  {
    nom: "Sire of the Salamanders",
    texte:
      "If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as that Model: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled and at least one Model in each of the Units filling those Slots has been upgraded with a Forged Weapon, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, until the end of the first Battle Turn, the Controlling Player may ignore all negative modifiers to the Leadership, Willpower, Cool and Intelligence Characteristics of all Models in the same Army that have the Salamanders Trait.",
  },

  {
    // Fulgrim, Primarque des Emperor's Children (IIIe Légion) : voir
    // js/unites-data.js.
    nom: "Sublime Bladesman",
    texte:
      "Fulgrim's swordsmanship was enhanced by his phenomenal speed and agility, so much so that his opponents seemed like lumbering oafs around whom he danced, drawing blood with every stroke. In a Challenge, Fulgrim's Attacks Characteristic is modified if his Initiative Characteristic is higher than his opponent's: while a Model with this Special Rule is in a Challenge, if its Controlling Player has Challenge Advantage, the Attacks Characteristic of the Model with this Special Rule is modified by +1 for each point by which its Base Initiative Characteristic exceeds its opponent's Base Initiative Characteristic.",
  },
  {
    // Fulgrim, Primarque des Emperor's Children (IIIe Légion) : voir
    // js/unites-data.js. Condition de la Case Principale câblée dans
    // REGLES_SIRE_TROUPES, js/organigramme.js ; le bonus de Point de
    // Résolution de Combat, effet de pur combat sans incidence sur la
    // construction de liste, n'est pas modélisé.
    nom: "Sire of the Emperor's Children",
    texte:
      "Fulgrim believed it was always important to maintain momentum, and he always fought from a position of strength. His sons invariably strove to engage the foe before it had the chance to prepare its defences. If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Tactical Squad and/or Assault Squad Units, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, the following Special Rule is granted to all Models in the same Army that have the Emperor's Children Trait: a Unit composed only of Models with the Emperor's Children Trait gains +1 bonus Combat Resolution Point if all Models in that Unit are outside the Controlling Player's Deployment Zone in the Resolution Sub-Phase. If the Mission being played does not define Deployment Zones, the Controlling Player gains this bonus when their Models are more than 12\" from their Battlefield Edge or, if no Battlefield Edge is specified, from a Battlefield Edge chosen before the First Turn.",
  },
  {
    // Fulgrim Transfiguré (IIIe Légion, Emperor's Children) : voir
    // js/unites-data.js. Exclusion mutuelle avec Fulgrim déjà modélisée
    // via excluAvec sur les deux Unités.
    nom: "Scion of Corruption",
    texte:
      "By the time of Fulgrim's apotheosis, the perversion of his Legion was already notorious among allies and enemies alike. Fulgrim Transfigured cannot be included in the same Army as Fulgrim.",
  },
  {
    // Fulgrim Transfiguré (IIIe Légion, Emperor's Children) : voir
    // js/unites-data.js.
    nom: "Avatar of Perfection",
    texte:
      "Ever more favoured by his god, Fulgrim came to disdain his Legion and devote himself to his quest for personal glory, seeking to humiliate anyone who might approach his level of martial prowess. A Challenge must be declared for Fulgrim Transfigured, and he can perform a Heroic Intervention Reaction without spending a Reaction Point. In the Controlling Player's Challenge Sub-Phase, if a Model with this Special Rule is eligible to have a Challenge declared for it, that Controlling Player must do so. In addition, if the Controlling Player of a Model with this Special Rule declares a Heroic Intervention Advanced Reaction and chooses such a Model for it, they do not need to spend any point of their Reaction Allotment to do so.",
  },
  /* --- Arsenal des Emperor's Children (IIIe Légion) : Seigneur
     Commandant Eidolon, Capitaine Lucius, Escouade Terminator Phénix
     (voir js/unites-data.js, unités réservées à cette Légion). --- */
  {
    nom: "Sonic shriekers",
    texte:
      "Wargear reserved for Models with the Emperor's Children and Traitor Traits: when a Unit that includes any Model equipped with sonic shriekers makes a Charge Move, the Target Unit of that Charge cannot make Reactions until the Charge Procedure is complete.",
  },
  {
    nom: "The Exemplary Blade",
    texte:
      "Lucius benefits more from the Paragon of Excellence Gambit: if a Model with this Special Rule adopts this Gambit, a Modifier of +4 is added to the Focus Roll instead of +2.",
  },
  {
    nom: "Unmatched Skill",
    texte:
      "When Locked in Combat, a Unit that includes at least one Model with this Special Rule may apply an additional Special Rule until the end of the Phase: at the end of the Charge Sub-Phase, if it is Locked in Combat with one or more enemy Units, its Controlling Player may choose one of the following effects — The Perfect Strike: until the end of this Phase, the Weapon Skill Characteristic of each Model in the Unit with this Special Rule is considered to be one point higher than normal when determining the result it needs to Hit in the Strike Step of the Challenge Sub-Phase or in the Make Hit Tests Step of the Resolve an Initiative Step Step (no effect on Hit Tests made against it). The Perfect Guard: until the end of this Phase, the Weapon Skill Characteristic of each Model in the Unit with this Special Rule is considered to be one point higher than normal when determining the result an opposing Model needs to Hit it in the Strike Step of the Challenge Sub-Phase or in the Make Hit Tests Step of the Resolve an Initiative Step Step (no effect on Hit Tests made for its own attacks).",
  },

  /* --- Arsenal des Imperial Fists (VIIe Légion) : Rogal Dorn,
     Sigismund, Fafnir Rann, Evander Garrius, Camba Diaz, Alexis Polux,
     Frères Templiers, Escouade de Gardiens du Phalanx (voir
     js/unites-data.js, unités réservées à cette Légion). --- */
  {
    nom: "Sire of the Imperial Fists",
    texte:
      "If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Tactical Squads and/or Breacher Squads, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, all Models with the Infantry Type that have the Imperial Fists Trait gain the Prepared Defences Special Rule: until the end of the first Battle Turn, all Models with the Infantry Type in this Army that have the Imperial Fists Trait have a 5+ Cover Save while they are within their Controlling Player's Deployment Zone.",
  },
  {
    nom: "Bulwark of the Imperium",
    texte:
      "A Gambit that allows Rogal Dorn to fight defensively. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: Bulwark of the Imperium — while this Gambit is chosen, Wound Tests made against the Model adopting this Gambit with an unmodified result of 1, 2, 3 or 4 always fail, regardless of the Strength Characteristic of a Hit and regardless of any Special Rules that set the Target Number for Wound Tests.",
  },
  {
    nom: "Kingslayer",
    texte:
      "Sigismund's Controlling Player must issue a Challenge if possible, and chooses which opponent accepts it. In the Controlling Player's Challenge Sub-Phase, if Sigismund is eligible, he must be declared the Challenger. If a Combat contains more than one Model under the Active Player's control that must be the Challenger, that player must choose Sigismund as the Challenger. In addition, when the Controlling Player issues a Challenge for Sigismund (including during the Heroic Intervention Advanced Reaction), they may choose the Challenged model from among any of the Opponent's eligible Models. If, for any reason, the chosen enemy Model cannot be the Challenged model, Sigismund's Controlling Player gains a number of Combat Resolution Points equal to the Base Wounds Characteristic of the chosen enemy Model that did not become the Challenged model, and Sigismund's Controlling Player may then choose another eligible Model to accept the Challenge.",
  },
  {
    nom: "Death Champion",
    texte:
      "Sigismund delivers deadlier attacks when this Gambit is chosen. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: Death Champion — if this Gambit is chosen, attacks made by this Model in the following Strike Step have the Critical Hit (5+) Special Rule.",
  },
  {
    nom: "Master of the Shield",
    texte:
      "Rann is renowned for his singular talent for combining the use of his axes and a shield. Fafnir Rann suffers no penalty in a Challenge for carrying a shield. The Controlling Player of a Model with this Special Rule does not suffer the -1 penalty to Focus Rolls for that Model having the Heavy Sub-type.",
  },
  {
    nom: "The Executioner's Tithe",
    texte:
      "As irresistible in attack as he is unyielding in defence, Rann is exceptionally aggressive for a member of the VIIth Legion: even on the defensive, the enemy is not safe from the vengeful wrath of his assault. Fafnir Rann can suffer a negative modifier to the Focus Roll in exchange for improved attacks. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: The Executioner's Tithe — when this Gambit is chosen, the Controlling Player must roll one additional Dice in the Focus Step and discard the highest result. Its Attacks made in the following Strike Step gain the Critical Hit (6+) Special Rule.",
  },
  {
    nom: "The Tyrant's Raiment",
    texte:
      "Wargear reserved for Evander Garrius: the Cataphractii Terminator armour known as the Tyrant's Raiment offers some of the finest protection available to a Legiones Astartes lord, its internal systems injecting painkillers directly into the wearer's bloodstream to dull the suffering caused by his old wounds. Evander Garrius gains a Damage Mitigation Roll when Engaged in a Challenge. A Model with this Special Rule benefits from the Feel No Pain (5+) Special Rule against Wounds suffered while it is Engaged in a Challenge.",
  },
  {
    nom: "The Unbroken Line",
    texte:
      "Camba Diaz was such a master of defensive warfare that it was said that once he had drawn a line on the ground, no enemy could cross it. Camba Diaz gains additional attacks when he fights last in a Challenge. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: The Unbroken Line — when this Gambit is chosen and this Model does not have Challenge Advantage, the value of Camba Diaz's Attacks Characteristic is modified by +2.",
  },
  {
    nom: "Hammerblow",
    texte:
      "Polux's stature and strength of will were such that he could deliver a single crushing blow with his power fist as easily and deftly as his Legionary brothers struck with a sword. Alexis Polux can make an alternative attack in a Challenge. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: Hammerblow — while this Gambit is chosen, this Model gains the Hammerblow Weapon Profile and cannot choose to make attacks with any other Weapon in the Strike Step.",
  },
  {
    nom: "Void Commander",
    texte:
      "Polux showed a natural aptitude for void combat, and led specialised boarding formations during the Horus Heresy. If a Model with this Special Rule joins a Breacher Squad Unit in Reserves, the Models in that Unit gain the Deep Strike Special Rule while that Model is part of the Unit. In addition, when a Model with this Special Rule is deployed as part of a Deep Strike, that Model and all other Models in the same Unit gain the Feel No Pain (5+) Special Rule until the Controlling Player's next Effects Sub-Phase.",
  },
  {
    nom: "Phalanx Formation",
    texte:
      "However skilled and aggressive those who filled their ranks, it was with rigid discipline and unbending determination that the Phalanx Wardens carried out their duty. A Unit that includes at least one Model with this Special Rule can perform the Shield Wall! Advanced Reaction without spending a Reaction Allotment point of its Controlling Player, in exchange for which it suffers limitations: if no Reaction Allotment point is spent, the Reacting Unit gains the Pinned Status once the Reaction is resolved.",
  },
  {
    nom: "Templar Assault",
    texte:
      "When the Legion's Templars of the Oaths go to war, nothing can stop them: the Templars strike with the lashing force of a tidal wave of power armour, a tactic hardly subtle but whose irresistible method has proved its effectiveness time and again. Templar Brethren launch their assault more effectively when they charge after Disembarking. In the Assault Phase of any Player Turn in which they Disembarked from an Assault Vehicle, Models with this Special Rule may add +2\" to their Set-up Move. This modifier does not apply if the Unit was forced to make an Emergency Disembarkation in the same Turn.",
  },

  /* --- Arsenal des Ultramarines (XIIIe Légion) : Roboute Guilliman,
     Remus Ventanus, Escouade de Suzerains Invictarus, Escouade de
     Brécheurs Prétoriens (voir js/unites-data.js, unités réservées à
     cette Légion). --- */
  {
    nom: "Argyrum Pattern Boarding Shield",
    texte:
      "Grants a 5+ Invulnerable Save, which becomes a 4+ Invulnerable Save against Wounds inflicted by Melee Weapons. Also grants the Shield Trait and the Heavy Sub-type.",
  },
  {
    nom: "Icon of Calth",
    texte:
      "Wargear of Remus Ventanus: the Tactical Strength of Models with the Ultramarines Trait in a Unit that includes at least one Model equipped with an Icon of Calth is modified by +1.",
  },
  {
    nom: "Vox Interlink",
    texte:
      "Wargear of Remus Ventanus that improves the Controlling Player's Reserves Rolls. While a Model equipped with a vox interlink is on the Battlefield, the Controlling Player may add +1 to the result of their Reserves Rolls, including for Aerial Reserves.",
  },
  {
    nom: "Calculating Swordsman",
    texte:
      "Though not the most renowned swordsman of the Imperium, Roboute Guilliman relies neither on brute strength nor on speed of execution, but on the intelligence gathered to study his opponent and exploit their weaknesses. Guilliman gains a bonus to the Focus Roll based on the number of the current Battle Turn. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: Calculating Swordsman — if this Gambit is chosen, the Controlling Player of this Model gains a positive modifier to the Focus Roll equal to the number of the current Battle Turn, up to a maximum of +4.",
  },
  {
    nom: "Sire of the Ultramarines",
    texte:
      "If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by at least two Assault Squad Units and at least two Tactical Squad Units, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, until the end of the first Battle Turn, all Models with the Infantry Type in this Army that have the Ultramarines Trait can Control and Contest Objectives even if they are subject to a Tactical Status.",
  },
  {
    nom: "Lords of Ultramar",
    texte:
      "Suzerains already enjoy unquestioned authority among the lower ranks of the Legion, not through force or the fear they inspire, but through respect and admiration. Friendly Models in range can use this Model's Characteristics to remove a Tactical Status from themselves. In the Statuses Sub-Phase, for any friendly Unit that includes no Models with the Vehicle Type and that has at least one Model within 12\" of a Model with this Special Rule that is not itself subject to a Tactical Status, the unmodified Characteristic of the Model with this Special Rule can be used for Checks to remove Tactical Statuses from that Unit.",
  },

  /* --- Arsenal des Dark Angels (Ire Légion) : Lion El'Jonson, Corswain,
     Marduk Sedras, Détachement de Compagnons de la Deathwing,
     Interemptors de la Dreadwing, Cenobium de Chevaliers du Cercle
     Intérieur (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    nom: "The Lion's Wrath",
    texte:
      "When the Lion went to war, few were the foes worthy of perishing by his hand, and only those who show a virulence equal to his hostility witness the true wrath of the First Primarch. The Lion gains a bonus to the Focus Roll when wounded. While a Model with this Special Rule is Engaged in a Challenge, if it has 2 Wounds or fewer remaining, its Controlling Player may choose this Gambit: The Lion's Wrath — if this Gambit is chosen, the Controlling Player of this Model adds a modifier of +2 to the Focus Roll, and does not suffer the -1 modifier per point of difference between this Model's Base Wounds Characteristic and its Current Wounds Characteristic.",
  },
  {
    nom: "Sire of the Dark Angels",
    texte:
      "If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by at least one Assault Squad Unit, one Tactical Squad Unit and one Breacher Squad Unit, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, all Bike Squadron Units and all Scimitar Jetbike Squadron Units in the same Army gain the following Special Rule: when the Controlling Player makes a Reserves Roll for a Unit that has the Dark Angels Trait, a Bike Squadron Unit or a Scimitar Jetbike Squadron Unit composed only of Models with the Dark Angels Trait, that Roll is modified by +1.",
  },
  {
    nom: "Stasis Grenades",
    texte:
      "Relics of Old Night, stasis grenades could not be reproduced by the Techmarines of the First Legion and were available only in small quantities, for the most desperate cases; the Lion, however, could deploy them without restriction. Stasis grenades reduce the Combat Initiative of enemies. Once per Battle, the first time a Charge succeeds against a Model equipped with stasis grenades and the Unit it has joined, the Combat Initiative of all Models in the Charging Unit is modified by -2 for the duration of the current Assault Phase. This modifier does not affect Models in the Charging Unit that are engaged in a Challenge.",
  },
  {
    nom: "Armour of the Forest",
    texte:
      "Artificer armour wrought from the steel of Terra in the heart of Caliban's forests by the hand of the Lion himself, the Armour of the Forest reduces the Damage of wounds suffered in a Challenge. When a Model with this Special Rule is Engaged in a Challenge, the Damage Characteristic of any Wound inflicted on this Model is reduced by 1, to a minimum of 1.",
  },
  {
    nom: "Ancient of War",
    texte:
      "Marduk Sedras has fought for his Legion for more than two centuries, one of the longest records of service among the Space Marines; he has fought in the presence of every Primarch and has observed the other Legions in a thousand and one war zones. While Marduk Sedras is part of a Unit composed only of Models with the Dark Angels Trait, all Models in that Unit gain the Hatred (Traitor) Special Rule.",
  },
  {
    nom: "Companions",
    texte:
      "Companion Detachments devote their lives to those they protect, and are ready to make the ultimate sacrifice to ensure their survival on the battlefield. While a Model that has the Dark Angels Trait and the Paragon Type or the Command Sub-type is part of a Unit that includes at least one Model with this Special Rule, Precision Wounds inflicted by a Shooting Attack cannot be allocated to that Model.",
  },
  {
    nom: "Cytheron Pattern Aegis",
    texte:
      "A creation of the lost city of Cytheron on Mercury, this device is derived from the force fields that once defied the fury of Sol itself. A Model equipped with a Cytheron pattern aegis has a 5+ Invulnerable Save and gains the Shield Trait. In addition, the Controlling Player of a Unit that includes Models equipped with a Cytheron pattern aegis may declare the Shield Wall! Advanced Reaction for that Unit — this is an exception to the normal Rules for that Advanced Reaction.",
  },
  {
    nom: "Paragons of the Order",
    texte:
      "Within the First Legion countless Orders coexist, each devoted to a distinct warrior creed. When a Unit that includes at least one Model with this Special Rule is selected in a Detachment during Army Selection, a single option from the Orders of the Hekatonystika must be selected for all Models in that Unit.",
  },
  {
    nom: "Auguries of Weakness",
    texte:
      "Order of the Hekatonystika: when making attacks targeting a Unit that includes a Model with the Vehicle Type, Models with the Paragons of the Order Special Rule gain the Armourbane Special Rule.",
  },
  {
    nom: "Icons of Resolve",
    texte:
      "Order of the Hekatonystika: when part of a Unit successfully Charged by an enemy Unit, Models with the Paragons of the Order Special Rule have their Leadership Characteristic set to 10 for the duration of the current Assault Phase.",
  },
  {
    nom: "Kingslayers",
    texte:
      "Order of the Hekatonystika: while part of a Unit Locked in Combat with an enemy Unit that includes at least one Model with a Weapon Skill Characteristic of 6 or more, the Attacks Characteristic of Models with the Paragons of the Order Special Rule may be set to 1. If this option is used, those Models' Terranic greatswords gain the Critical Hit (6+) Special Rule until the end of the Combat.",
  },
  {
    nom: "Beast Hunters",
    texte:
      "Order of the Hekatonystika: while part of a Unit Locked in Combat with an enemy Unit that includes at least one Model with a Toughness Characteristic of 6 or more, the Damage Characteristic of Wounds inflicted by Models with the Paragons of the Order Special Rule is modified by +1.",
  },
  {
    nom: "Reapers of Hosts",
    texte:
      "Order of the Hekatonystika: while part of a Unit Locked in Combat with one or more enemy Units that outnumber it, all Models in that Unit with the Paragons of the Order Special Rule modify their Attacks Characteristic by +1.",
  },
  {
    nom: "Sorcerer-breakers",
    texte:
      "Order of the Hekatonystika: while part of a Unit Locked in Combat with an enemy Unit that includes at least one Model with the Malefic Sub-type or the Psyker Trait, Hit Tests and Wound Tests made for Models with the Paragons of the Order Special Rule involved in that Combat are modified by +1.",
  },

  /* --- Arsenal des Space Wolves (VIe Légion) : Leman Russ, Hvarl
     Lamerouge, Geigor Main Terrible, Frères Loups de Russ, Meute de
     Tueurs Gris, Meute de Mort-jurés, Escouade Terminator de Gardes
     Loups Varagyr (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    nom: "Ymira-class Stasis Bombs",
    texte:
      "Relics of a genocidal campaign so terrible that only the Wolf King and his inner circle of priests are permitted to remember it as anything other than a nightmare, these weapons degrade the flow of time when they detonate. Ymira-class stasis bombs force the Opposing Player to keep the lowest result when making a Charge Roll. When the Target Unit of an enemy Charge Move is not already Locked in Combat and includes at least one Model equipped with Ymira-class stasis bombs, any Charge Roll is made by rolling 2D6 and discarding the highest result, instead of discarding the lowest result.",
  },
  {
    nom: "The Dreams of the Doom Wolf",
    texte:
      "The only emotions the Deathsworn can still feel are those of slaughter and of the death that awaits them. The Deathsworn make one last attack before being Removed as Casualties. At Initiative Step 1 of any Combat that involves at least one Model with this Special Rule, the Controlling Player may make a bonus attack for each Model with this Special Rule that was Removed as a Casualty at any previous Initiative Step of the current Combat. These attacks can target any Unit involved in that Combat, and are made using the Agony strike profile.",
  },
  {
    nom: "Bane of Lords",
    texte:
      "The Varagyr love to prove their superiority over enemy champions, and seek to glorify their lord by bringing him grisly trophies, in the hope that the skalds will sing their saga. The Varagyr gain a bonus to their Combat Result if the Thegn survives a Challenge. In the Glory Step of a Challenge that involves a Thegn Model with this Special Rule, if that Model was not Removed as a Casualty during that Challenge, for that Combat the Controlling Player gains, in the following Resolution Sub-Phase, a number of Combat Resolution Points equal to the number of Varagyr Models in the same Unit, up to a maximum of +4.",
  },
  {
    nom: "Wolf Brothers of Russ",
    texte:
      "In battle, Leman Russ is sometimes accompanied by the Primarch's two huge wolves, which legend says are his litter-brothers: they were already at his side when, still a feral creature, he roamed the wastes of Fenris. No Model other than Leman Russ can join a Unit that includes Models with this Special Rule.",
  },
  {
    nom: "Headtaker",
    texte:
      "Hvarl loved only one thing in battle, the death of the enemy; he cared nothing for strategy, for the subtleties of deployment or manoeuvre, and preferred to close with his enemies as fast as possible. This Gambit prevents the Opponent from gaining an Outside Support bonus to the Focus Roll. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: Headtaker — if this Gambit is chosen, the Opponent is not entitled to an Outside Support bonus in the Focus Step.",
  },
  {
    nom: "Howl of the Doom Wolf",
    texte:
      "In battle, Russ was not merely a warrior, but a veritable catalyst of fury, rage and violence, invested with the power of the Doom Wolf, quick to unleash an all-out assault on anyone who dared stand against him. Once per Battle, while a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: Howl of the Doom Wolf — once this Gambit is chosen and until it ceases to have effect, no other Gambit can be chosen for this Model. When this Gambit is chosen, the Controlling Player of this Model gains a bonus of +5 to the next Focus Roll and to consecutive Focus Rolls during the Challenge, until this Model fails to inflict an Unsaved Wound in the Strike Step. From then on, the effects of this Gambit end, and the Controlling Player can no longer choose it for the rest of the current Challenge.",
  },
  {
    nom: "Sire of the Space Wolves",
    texte:
      "If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Grey Slayer Pack Units, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, until the end of the first Battle Turn, all Models with the Infantry Type in this Army that have the Space Wolves Trait gain the Move Through Cover Special Rule.",
  },

  /* --- Arsenal des Iron Hands (Xe Légion) : Ferrus Manus, Shadrak
     Meduson, Révérend de Fer, Escouade Terminator Gorgone, Escouade
     d'Immortels de Medusa (voir js/unites-data.js, unités réservées à
     cette Légion). --- */
  {
    nom: "Gorgon Pattern Terminator Armour",
    texte:
      "Successful Armour Saves and Invulnerable Saves can inflict Tactical Statuses on enemy Models. At the end of Step 4 of the Assault Phase, if any Model in Gorgon pattern Terminator Armour has passed at least one Armour Save or Invulnerable Save against Wounds caused by Shooting or Melee Attacks in the same Assault Phase, the Unit that inflicted those Wounds must take a Cool Check. If this Check is failed, the Unit gains the Suppressed Status.",
  },
  {
    nom: "Lord of Automata",
    texte:
      "Many Iron Fathers were initiated into the secrets of the Legio Cybernetica, and even accompanied the battle-automata honoured by the Legion onto the battlefield, which then acted as an extension of their will. This Special Rule allows an Iron Father to be accompanied by a Battle-automata Unit: when a Model with this Special Rule is included in a Detachment, an additional Force Organisation Slot is added to that Detachment, which can only be filled by a Castellax Battle-automata Maniple Unit; that Unit then replaces its Cybernetica Trait with Bonded Automata and can join the Detachment even though it does not have the same Faction Trait as its other Units. In addition, a Model with this Special Rule can join a friendly Unit with the Automata Type without reducing the value of its Leadership and Cool Characteristics.",
  },
  {
    // Liber Hereticus, p. 37 (Praevius). Case additionnelle modélisée
    // dans js/organigramme.js (REGLES_CASE_ADDITIONNELLE).
    nom: "Master of Automata",
    texte:
      "The Praevius goes to war escorted by imposing automata that make formidable bodyguards. On the battlefield the Praevius can exert more direct control over their actions, and direct their fearsome firepower with a single gesture. This Special Rule allows a Praevius to be accompanied by a Battle-automata Unit. When a Model with this Special Rule is included in a Detachment, an additional Force Organisation Slot is added to that Detachment. This Slot can only be filled by a Castellax Battle Maniple or Castellax Destructor Maniple Unit selected from the Liber Mechanicum. When such a Unit is included in this way, its Cybernetica Trait is replaced by \"Bonded Automata\", and the Unit can be included even though it does not have the same Faction Trait as the other Units in the Detachment. In addition, a Model with this Special Rule can join a friendly Unit that includes Models with the Automata Type. If a Model with this Special Rule joins a Unit with the Automata Type, the Leadership and Cool Characteristics of the Models in that Unit are not reduced because of this, but other Rules can modify them as normal.",
  },
  {
    nom: "Tempered by War",
    texte:
      "War is the crucible in which the Gorgon was forged, for nothing else could engender the strength and resilience that Ferrus Manus demanded of his warriors. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: Tempered by War — when this Gambit is chosen, this Model's Toughness Characteristic is set to 8 for the duration of the following Strike Step.",
  },
  {
    nom: "Sire of the Iron Hands",
    texte:
      "If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in this Army's Primary Detachment are filled by Tactical Squads and/or Breacher Squads, all of the Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, until the end of the first Battle Turn, all Models with the Infantry Type in this Army that have the Iron Hands Trait have the Feel No Pain (6+) Special Rule.",
  },

  /* --- Arsenal des Raven Guard (XIXe Légion) : Escouade de Mor
     Deythan, Escouade de Furies Noires, Escouade de Terminator
     Deliverers (voir js/unites-data.js, unités réservées à cette
     Légion). --- */
  {
    nom: "Corax's Shame",
    texte:
      "As a symbol of the cruel and brutal legacy Corax inherited when he took control of the Raven Guard, the Deliverers have long been exiled from any position of honour within their own Legion. Models with this Special Rule suffer restrictions in an Army that includes Corvus Corax: a Unit that includes at least one Model with this Special Rule cannot be joined by a Corvus Corax Model. In addition, Reserves Rolls made for a Unit that includes at least one Model with this Special Rule are modified by -1 in any Reserves Sub-Phase in which a friendly Corvus Corax Model was also in Reserves at the start of that Sub-Phase.",
  },

  /* --- ÉQUIPEMENT GÉNÉRIQUE (p. 313-315) : objets de wargear qui
     confèrent une Règle Spéciale plutôt qu'un profil d'Arme (voir
     js/armes-data.js pour les armes proprement dites). Transcrit
     depuis le glossaire d'Équipement du livre de règles ; utilisé par
     de nombreuses unités à travers tout js/unites-data.js. La ligne
     "Équipement" de la fiche récap (construireFiche, js/unites.js)
     habille chaque entrée reconnue d'une info-bulle reprenant sa
     définition, exactement comme "Règles spéciales" et "Traits". --- */
  {
    nom: "Company Standard",
    texte:
      "Grants a bonus to Combat Resolution. When resolving a Combat in the Resolution Sub-Phase of the Assault Phase, 1 Combat Resolution Point is scored for each Unit involved in that Combat that has at least one Model carrying a Company standard. In addition, a Model with a Company standard counts as 5 additional Models for the purposes of Outside Support in a Challenge.",
  },
  {
    nom: "Legion Standard",
    texte:
      "Grants a bonus to Combat Resolution. When resolving a Combat in the Resolution Sub-Phase of the Assault Phase, 2 Combat Resolution Points are scored for each Unit involved in that Combat that has at least one Model carrying a Legion standard. In addition, a Model with a Legion standard counts as 6 additional Models for the purposes of Outside Support in a Challenge.",
  },
  {
    nom: "Vexillum",
    texte:
      "Grants a bonus to Combat Resolution. When resolving a Combat in the Resolution Sub-Phase of the Assault Phase, 1 Combat Resolution Point is scored for each Unit involved in that Combat that has at least one Model carrying a vexillum.",
  },
  {
    nom: "Dozer Blade",
    texte:
      "Allows Models to ignore the Movement penalty for Difficult Terrain. If the Controlling Player moves a Model equipped with a dozer blade into any area of Difficult Terrain, that Unit does not have to apply a modifier to its movement in that Phase.",
  },
  {
    nom: "Narthecium",
    texte:
      "Allows Recovery Tests to be made in the Morale Sub-Phase. If a Unit that includes any Model equipped with a narthecium is not Locked in Combat, before the Controlling Player makes a Characteristic Check for that Unit in the Morale Sub-Phase, they may make a Recovery Test for the Unit. If this Recovery Test is passed, the Player may subtract 2 from the result of the Characteristic Check. Only one Recovery Test can be made in this way per Unit in each Morale Sub-Phase.",
  },
  {
    nom: "Nuncio-vox",
    texte:
      "Allows Units to remove Tactical Statuses in the Start Phase. If a Unit includes at least one Model equipped with a nuncio-vox, and there is at least one Model with the Command Sub-type on the Battlefield, the Controlling Player may activate the nuncio-vox in the Start Phase of their Turn as the Active Player. When the nuncio-vox is activated, the Controlling Player may make a Check to remove a single Tactical Status from all Models in the Unit equipped with the nuncio-vox. This Check is made using the Cool Characteristic (except when attempting to remove the Routed Status, in which case Leadership is used) of any friendly Model with the Command Sub-type on the Battlefield, chosen by the Controlling Player. A nuncio-vox can only be activated once per Turn, and each friendly Model with the Command Sub-type can only be used for this Special Rule once per Start Phase.",
  },
  {
    nom: "Searchlights",
    texte:
      "Allow attacks to ignore Shrouded Damage Mitigation Rolls. The Target Number of all Shrouded Damage Mitigation Rolls made against Wounds, Penetrating Hits or Glancing Hits inflicted by Shooting Attacks made by a Model equipped with searchlights that has Line of Sight to the Target Unit is increased by +1 (to a maximum of 6+). Conversely, a Model equipped with searchlights cannot attempt Shrouded Damage Mitigation Rolls to discard such Wounds, Penetrating Hits or Glancing Hits.",
  },
  {
    nom: "Augury scanner",
    texte:
      "Allow attacks to ignore Shrouded Damage Mitigation Rolls. When a Shooting Attack made by a Unit that includes any Model equipped with an augury scanner inflicts Hits (excluding Hits from Snap Shots), no Shrouded Damage Mitigation Rolls can be attempted against those Hits.",
  },
  {
    nom: "Servo-arm",
    texte:
      "Restores more Wounds or Hull Points when the Model uses the Battlesmith (X) Special Rule. Each time the Controlling Player of a Model equipped with a servo-arm chooses the Repair option when activating the Battlesmith (X) Special Rule for that Model, the number of Hull Points or Wounds gained by the Target Model is increased by +1.",
  },
  {
    // Arsenal des Taghmata du Mechanicum (Liber Mechanicum), non
    // transcrit ailleurs sur ce site.
    nom: "Machinator array",
    texte:
      "Allows the Battlesmith (X) Special Rule to be used twice in the same Turn. Each time the Controlling Player of a Model equipped with a machinator array chooses to use the Battlesmith (X) Special Rule, they may use it twice, on the same Target Unit or on two different Target Units, with possibly different effects (all targets must be valid).",
  },
  {
    nom: "Command Vox Relay",
    texte:
      "Grants a bonus to Reserves Rolls and can be used to grant other benefits. While a Model equipped with a command vox relay is on the Battlefield, before making a Reserves Roll for a Unit in Reserves, the Controlling Player may have the Model activate the command vox relay: if they do, they may modify the result of the Reserves Roll by +1 (only one command vox relay can be activated per Reserves Roll). In addition, in the Effects Sub-Phase of the Start Phase, the Controlling Player of a Model equipped with a command vox relay may make an Intelligence Check for that Model (Intelligence Characteristic of 8 if it has the Vehicle Type). If this Check is passed, they may choose a friendly Unit composed only of Models with the same Faction Trait as the Model equipped with the command vox relay, and give it, until the end of this Turn, either the Line (1) Special Rule (losing Vanguard (X) if it had it), or Vanguard (1) (losing Line (X) if it had it).",
  },
  {
    nom: "Boarding Shield",
    texte:
      "Grants a 5+ Invulnerable Save, the Shield Trait and the Heavy Sub-type. A Model with a Boarding shield gains a 5+ Invulnerable Save. In addition, it gains the Shield Trait and the Heavy Sub-type.",
  },
  {
    nom: "Combat Shield",
    texte:
      "Grants a 5+ Invulnerable Save and a bonus to Focus Rolls. A Model with a Combat shield has a 5+ Invulnerable Save against attacks made with Melee Weapons. In addition, a Model with a Combat shield gains a +1 modifier to Focus Rolls made for it.",
  },
  {
    nom: "Thermal Diffraction Field",
    texte:
      "Mitigates the Damage inflicted by Weapons with certain Traits. A Model equipped with a Thermal diffraction field reduces by 1 the Strength of all Hits inflicted on it by Weapons with the Las, Plasma, Melta or Flame Trait. In addition, when a Model equipped with a Thermal diffraction field generates a Mishap Group through the Overload (X) Special Rule, the Breaching (X) Special Rule of those Hits only takes effect on a Wound Test result of 6+, regardless of the value of X.",
  },
  {
    nom: "Cognis-signum",
    texte:
      "Allows more accurate attacks to be made with Barrage Weapons. Instead of making a Shooting Attack with a Model equipped with a cognis-signum, the Controlling Player may make an Intelligence Check. If the Check is passed, they may choose a single enemy Unit in Line of Sight of the Model equipped with the cognis-signum: the next time in the current Shooting Phase that the chosen enemy Unit is targeted by a Shooting Attack that includes at least one Weapon with the Barrage (X) Special Rule, the Controlling Player may make Hit Tests for those attacks as normal, ignoring the limitations of the Barrage (X) Special Rule if the Unit making the Shooting Attack does not have Line of Sight to the Target Unit. If the Check is failed, the cognis-signum has no effect this turn.",
  },
  {
    nom: "Cortex Controller",
    texte:
      "Allows Automata to make Reactions. A Unit that includes any Models with the Automata Type may ignore the restriction on Reactions that the Automata Type imposes, as long as it includes at least one Model with a cortex controller.",
  },
  {
    nom: "Cyber-familiar",
    texte:
      "Grants a bonus to Intelligence Checks. The Controlling Player of a Model with a cyber-familiar may modify the result of Intelligence Checks made for that Model by -2.",
  },

  /* --- Arsenal des Emperor's Children (IIIe Légion) : équipement et
     Règle Spéciale d'Unité (voir js/unites-data.js, unités réservées à
     cette Légion — Seigneur Commandant Eidolon, Capitaine Lucius,
     Escouade Terminator Phénix, Escouade de Lames Palatines, Escouade
     Kakophoni). --- */
  {
    nom: "Sonic Shriekers",
    texte:
      "Amplifying the screams and snarls of the wearer into dissonant blasts, these weapons stun enemy warriors with high-frequency waves, making them easy prey. When a Unit that includes any Models with sonic shriekers makes a Charge Move, the Target Unit of that Charge cannot make Reactions until the Charge Procedure is complete.",
  },
  {
    nom: "Unmatched Skill",
    texte:
      "While Locked in Combat, the Unit may apply one additional Special Rule until the end of the Phase. At the end of the Charge Sub-Phase, if the Unit is Locked in Combat with one or more enemy Units, its Controlling Player may choose one of the following effects, lasting until the end of the Phase: The Perfect Strike — the Weapon Skill of each Model in the Unit with this Special Rule is treated as one point higher than normal when determining the result it needs to Hit an opponent (in the Strike Step of the Challenge Sub-Phase or the Make Hit Tests Step of the Resolve Initiative Step Step), without modifying Hit Tests made by enemy Models against it. The Perfect Guard — conversely, the Weapon Skill of each Model in the Unit with this Special Rule is treated as one point higher than normal when determining the result an enemy Model needs to Hit it, without modifying Hit Tests made by the Unit for its own attacks.",
  },

  /* --- Types et Sous-types de Figurine (indiqués entre parenthèses
     après le Type sur chaque profil, ex. « Infanterie (Sergent,
     Lourd) ») : consultées comme des Règles Spéciales ordinaires par
     trouverDefinitionRegle (voir js/main.js), ce qui leur donne une
     info-bulle partout où un Type ou Sous-type de Figurine est cité —
     notamment la ligne « Type » de la fiche récap (js/unites.js) —
     sans nécessiter de page dédiée. Lourd, Léger et Marcheur déjà
     présents ci-dessus (Sous-types les plus fréquemment cités comme
     Règle Spéciale à part entière) ; les Types de Base (Infanterie,
     Cavalerie) et les autres Sous-types les complètent ici. --- */
  {
    nom: "Infantry",
    texte:
      "The most common Type: uses the Core Rules with no bonuses or penalties. A Model with the Infantry Type may Embark on and Disembark from a Model with the Transport Sub-type.",
  },
  {
    nom: "Cavalry",
    texte:
      "When making a Fall Back Move, a Model with the Cavalry Type moves a distance equal to its Initiative plus the total of two dice. It does not benefit from any Cover Saves granted by a Terrain Piece or Terrain Area.",
  },
  {
    nom: "Paragon",
    texte:
      "Allocates the Hits it inflicts itself, both when shooting and in melee. May join or leave a Unit with the Infantry Type (and vice versa), Embark on a Model with the Transport Sub-type, Declare and Accept Challenges, and lend its Characteristics to its Unit for any Characteristic Check. Counts as its Base Wounds Value for Combat resolution.",
  },
  {
    nom: "Automata",
    texte:
      "Can never gain a Tactical Status and automatically passes any Check made to avoid one — unless the Unit includes at least one Model that does not have the Automata Type. Ignores the Poisoned (X) Special Rule except on an unmodified Wound Test of 6. A Unit that includes any Models with the Automata Type cannot make Reactions.",
  },
  {
    nom: "Skirmish",
    texte:
      "A Unit composed entirely of Models with the Skirmish Sub-type has a Unit Coherency range of 3\" instead of 2\".",
  },
  {
    nom: "Antigrav",
    texte:
      "A Unit composed entirely of Models with the Antigrav Sub-type ignores the effects of Terrain it moves over and may move over Impassable Terrain (without starting or ending its move there, and testing for Dangerous Terrain as normal if it starts or ends its move in it). It ignores Models and Units when it Moves, but must end its move at least 1\" from any Model that is not part of the same Unit if it moves over a friendly Unit, or from any enemy Model if it moves over an enemy Unit.",
  },
  {
    nom: "Transport",
    texte:
      "Its Transport Capacity Characteristic sets the number of Models that may Embark on it (one Model per point, unless Bulky (X) states otherwise). Only Models with the Infantry or Paragon Type and the same Faction Trait may Embark or Disembark, one Unit at a time and in full — never partially. The Embarked Unit remains a separate Unit from the Transport in all respects.",
  },
  {
    nom: "Specialist",
    texte:
      "A Model with the Specialist Sub-type may join and leave Units.",
  },
  {
    nom: "Sergeant",
    texte:
      "The Controlling Player of a Unit that includes one or more Models with the Sergeant Sub-type may use the Characteristics of one of those Models to resolve any Characteristic Check made for the Unit.",
  },
  {
    nom: "Command",
    texte:
      "A Model with the Command Sub-type may join and leave Units, and may Declare and Accept Challenges. The Controlling Player of a Unit that includes one or more such Models may use its Characteristics to resolve any Characteristic Check made for the Unit.",
  },
  {
    nom: "Champion",
    texte:
      "A Model with the Champion Sub-type may Declare and Accept Challenges.",
  },
  {
    nom: "Unique",
    texte:
      "An army may only include one of any Model with this Sub-type. A Model with the Unique Sub-type, or a Unit composed entirely of such Models, may not have any options other than those selected for it in its Army List Profile.",
  },
  /* ============================================================
     Arsenal des Maisonnées de Chevaliers et des Legios Titaniques :
     Règles Spéciales et Équipement propres aux Chevaliers Questoris
     et aux Titans.
     ============================================================ */
  {
    nom: "Power Drain",
    texte:
      "When a Weapon with this Special Rule is used, all of the Model's other Weapons are reduced to Snap Shots for the rest of the Shooting Attack.",
  },
  {
    nom: "Shock Ram",
    texte:
      "A Vehicle with this Special Rule inflicts D6+3 Hits (instead of D6) when moving through an enemy Unit, and gains a 6+ Invulnerable Save against Death or Glory Reactions that target it.",
  },
  {
    nom: "Independent Fire",
    texte:
      "A Model with the Vehicle Type and this Special Rule may fire at multiple targets at its full Ballistic Skill without being reduced to Snap Shots.",
  },
  {
    nom: "Titanic Void Shields (X)",
    texte:
      "A Model with this Special Rule has X void shields (Armour Value 13), each of which absorbs one Hit before any further Hits reach its Titan Profile.",
  },
  {
    nom: "Ion Shield",
    texte:
      "5+ Invulnerable Save (Front Arc) or 6+ (Rear Arc) against Shooting Attacks, which also applies against Glancing Hits.",
  },
  {
    nom: "Ion Repulsor Shield",
    texte:
      "Combines the ion shield (5+/6+ Invulnerable Save against Shooting Attacks, including Glancing Hits) and the repulsor shield (cancels Armourbane against the Model).",
  },
  {
    nom: "Mag-inverter shield",
    texte:
      "Reduces by 1\" (to a minimum of 1\") the Charge distance of enemy Units charging a Unit in which the majority of Models are so equipped; that Unit also gains the Shield Trait.",
  },
  {
    nom: "Repulsor Shield",
    texte:
      "Shooting Attacks that hit the equipped Model do not benefit from the Armourbane Special Rule.",
  },
  {
    nom: "Legio Men-at-Arms",
    texte:
      "A Unit composed entirely of Models with this Special Rule ignores the penalties of Titanic Warhorn (X) and gains +1 Leadership while a friendly Titan is on the battlefield; it must take a Panic Check if a friendly Titan is destroyed.",
  },
  {
    nom: "Colossus",
    texte:
      "A Model with the Knight Sub-type and this Special Rule has no base: distances, Line of Sight and Front/Rear Arcs are determined from its Hull, as for a Vehicle.",
  },
  {
    nom: "Titanic Warhorn (X)",
    texte:
      "Once per Battle, reduces the Leadership, Willpower, Cool and Intelligence Characteristics of enemy Models within 24\" of the Model that activates it by X.",
  },
  {
    nom: "Reinforced Structure (X)",
    texte:
      "Reduces by X (to a minimum of 1) the Damage of Hits inflicted by Weapons without the Strategic Trait or the Ordnance (X) Special Rule.",
  },
  {
    nom: "Repairers (X)",
    texte:
      "A Titan can repair itself: in the Effects Sub-Phase of the Start Phase, it regains X Hull Points on one Profile, up to its Base Value.",
  },
  {
    nom: "Rad Furnace",
    texte:
      "Any Model Locked in the same Combat as a Model with a rad furnace reduces its Toughness by 1 for the duration of the Combat.",
  },
  {
    nom: "Frag Grenades",
    texte:
      "In the Volley Step of the Charge Procedure, a Model with Frag grenades may make a single attack (R6, FP1, RS3, AP6, D1, Blast (3\"), Assault) instead of a normal Shooting Attack.",
  },
  {
    nom: "Templates and Blast Markers",
    texte:
      "Two families of templates are used to measure certain Weapon effects instead of a tape measure. Blast Markers (circular, in several sizes) are placed at a distance from the attacking Model and then scatter to their final position (see Blast (X)). Template markers (teardrop-shaped) are placed with the narrow end touching the Base of the attacking Model and never scatter (see Template). In both cases, a Model is \"under\" the template if its Base (or Hull) is even partially covered, holding the template parallel to the Battlefield to judge this.",
  },
  {
    nom: "Other Templates",
    texte:
      "Some large Weapons use a different Template instead of the standard Flamer Template (for example the Hellstorm Template, given in brackets after \"Template\").",
  },
  {
    // Magnus le Rouge, Primarque des Thousand Sons (XVe Légion) : voir
    // js/unites-data.js.
    nom: "Supreme Sorcerer",
    texte:
      "Among the Primarchs, Magnus the Red was the undisputed master of the mystic arts. In psychic power he was second only to the Emperor, and some even believe that certain of his secrets were beyond his father's reach. Magnus is blessed with several Prosperine Arcana. A Model with this Special Rule is considered to know the Raptora, Pyrae, Pavoni, Corvidae and Athanaean Prosperine Arcana.",
  },
  {
    // Magnus le Rouge, Primarque des Thousand Sons (XVe Légion) : voir
    // js/unites-data.js.
    nom: "Battle of Wills",
    texte:
      "To face the Lord of the Thousand Sons was to face a Primarch not only on the physical plane but also on the mental one, a battlefield on which very few warriors were as well equipped as Magnus. This Gambit allows the Controlling Player to use Magnus' Willpower Characteristic to gain a positive modifier to their Focus Roll. While this Model is engaged in a Challenge, the Controlling Player gains a positive modifier to their Focus Roll equal to the Base Value of Magnus the Red's Willpower Characteristic, minus the Base Value of the Willpower Characteristic of the enemy Model in the Challenge.",
  },
  {
    // Magnus le Rouge, Primarque des Thousand Sons (XVe Légion) : voir
    // js/unites-data.js. Condition de la Case Principale câblée dans
    // REGLES_SIRE_TROUPES, js/organigramme.js (Unités « nanties d'un
    // Arcane de Prospero », fixe ou choisi via l'option ARCANE_DE_
    // PROSPERO) ; le bonus de Test de Manifestation (3 Dés, en garder
    // 2) jusqu'à la fin du premier Tour de Bataille, effet de pur
    // combat sans incidence sur la construction de liste, n'est pas
    // modélisé.
    nom: "Sire of the Thousand Sons",
    texte:
      "Magnus the Red was the archetypal philosopher-warrior and the embodiment of considered action. His presence was a constant reminder to his sons not to give in to impulsiveness, and to conduct their campaigns with the same care and the same absence of doubt as their psychic meditations. If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in that Army's Primary Detachment are filled by Units with a Prosperine Arcana, all Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, all Models in the same Army that have the Thousand Sons Trait gain the following Special Rule: until the end of the first Battle Turn, each time the Controlling Player of a Model with this Special Rule makes a Manifestation Check for a Unit composed only of Models that have the Thousand Sons Trait, they may roll three dice and choose two of them to determine the result.",
  },
  /* --- Arsenal des Thousand Sons (XVe Légion) : les cinq Arcanes de
     Prospero (Pavoni, Corvidae, Athanéen, Pyrae, Raptora), voir l'option
     "arcane-prospero" (ARCANE_DE_PROSPERO) dans js/unites-data.js et
     leurs Armes Psychiques dans js/armes-data.js. Chaque Arcane est une
     Discipline Psychique donnant à ses Figurines un Pouvoir/Réaction/
     Arme Psychique et un Trait propres — même principe que la
     Discipline « Appel de l'Orage » des White Scars ci-dessus. */
  {
    nom: "Prosperine Arcana",
    texte:
      "Each Unit that has the Thousand Sons Trait (except Units that include Models with the Vehicle or Automata Type, or the Unique Sub-type) may be given one of the following five Arcana for +10 Points per Unit (not per Model): Raptora, Pyrae, Pavoni, Corvidae or Athanaean. All Models in the Unit benefit from it, but not those that join it during Deployment or during the Battle (which may be given their own Arcana, the same or different, when the Army Roster is drawn up); a Unit may only have one Prosperine Arcana. A Unit that already has a Prosperine Arcana by virtue of its own Special Rules (for example the Khenetai Occult Cabal) may not be given another from this list. If a Model Manifesting a Psychic Power, Psychic Weapon or Psychic Reaction granted by a Prosperine Arcana suffers the effects of Perils of the Warp, do not roll on the Perils of the Warp table: instead, the Unit suffers D3 Wounds, each with an AP of 2 and a Damage of 1, which ignore Cover Saves and Damage Mitigation Rolls (Invulnerable Saves are allowed, and Wounds are allocated as if inflicted by a Shooting Attack). If the Unit has a Psychic Weapon granted by its Arcana, only one of its Models may use it each time the Unit is selected to make attacks during a Shooting Attack or a Combat.",
  },
  {
    nom: "Pavoni",
    texte:
      "Thousand Sons Psychic Discipline (Prosperine Arcana): a Model that has it gains the Body of Stone Psychic Reaction, the Blood Boil Psychic Weapon, and the \"Pavoni\" Trait.",
  },
  {
    nom: "Body of Stone",
    texte:
      "Psychic Reaction (Blessing) that increases the Toughness Characteristic of the Reacting Unit. The Reactive Player may declare it at the start of Step 3 of a Shooting Attack made by the Active Player that targets a Unit including at least one Model with the Pavoni Trait (Cost: 1 Reaction Allotment, paid only if the Willpower Check is passed). The Focus must be a Model with the Pavoni Trait in the targeted Unit; the Target is that same Unit, composed entirely of Models with the Thousand Sons Trait. If successful, its effects last until the end of the Sub-Phase: all Models in the Target Unit gain a +2 bonus to their Toughness Characteristic.",
  },
  {
    nom: "Corvidae",
    texte:
      "Thousand Sons Psychic Discipline (Prosperine Arcana): a Model that has it gains the Fateful Shots and Paths of Consequence Psychic Powers, and the \"Corvidae\" Trait.",
  },
  {
    nom: "Fateful Shots",
    texte:
      "Psychic Power (Blessing) that makes the Unit's Shooting Attacks more effective. The Active Player may Manifest it in the Shooting Phase, at the start of Step 4 of a Shooting Attack made by a Unit including at least one Model with the Corvidae Trait. The Focus must be a Model with the Corvidae Trait in the shooting Unit; the Target is that same Unit, composed entirely of Models with the Thousand Sons Trait. If successful, its effects last until the end of the current Shooting Attack: all Ranged Weapons the Models in the Target Unit are equipped with, except those with the Blast (X) Special Rule, gain the Wounding (5+) Special Rule.",
  },
  {
    nom: "Paths of Consequence",
    texte:
      "Psychic Power (Curse) that reduces the Target's Movement and forces it to make Dangerous Terrain Tests. The Active Player may Manifest it in the Effects Sub-Phase of the Start Phase. The Focus must be a Model with the Corvidae Trait controlled by the Active Player; the Target is an enemy Unit with at least one Model within 18\" of and in Line of Sight of the Focus. If successful, its effects last until the start of the Active Player's next Turn: all Models in the Target Unit suffer a -2 penalty to their Movement Characteristic (to a minimum of 0), and the first time a Model in the Target Unit Moves in a given Phase, it must make a Dangerous Terrain Test.",
  },
  {
    nom: "Athanaean",
    texte:
      "Thousand Sons Psychic Discipline (Prosperine Arcana): a Model that has it gains the Manifestation of Dread Psychic Weapon, the Clarity Psychic Power, and the \"Athanaean\" Trait.",
  },
  {
    nom: "Clarity",
    texte:
      "Psychic Power (Blessing) that removes a Tactical Status from a friendly Unit. The Active Player may Manifest it in the Effects Sub-Phase of the Start Phase. The Focus must be a Model with the Athanaean Trait controlled by the Active Player; the Target is a friendly Unit, composed entirely of Models with the Thousand Sons Trait, with at least one Model within 18\" of and in Line of Sight of the Focus. If successful, its effects are resolved immediately: the Controlling Player chooses a single Tactical Status affecting a Model in the Target Unit, and it is immediately removed from all Models in the Target Unit.",
  },
  {
    nom: "Pyrae",
    texte:
      "Thousand Sons Psychic Discipline (Prosperine Arcana): a Model that has it gains the Incandescent Shield Psychic Power, the Burning Embrace Psychic Weapon, and the \"Pyrae\" Trait.",
  },
  {
    nom: "Incandescent Shield",
    texte:
      "Psychic Power (Blessing) that allows a Unit to inflict automatic Hits on any Unit that attacks it in melee. The Active Player may Manifest it at the end of the Declare Weapons and Set Initiative Steps Step of a Combat. The Focus must be a Model with the Pyrae Trait involved in that Combat; the Target is its Unit, composed entirely of Models with the Thousand Sons Trait. If successful, its effects last until the Combat is resolved: all Models in the Target Unit gain the Incandescent Shield Special Rule — at the end of each Initiative Step, any Unit that inflicted Hits on a Unit including at least one Model with this Special Rule suffers D6 Hits with a Strength of 4, an AP of - and a Damage of 1, allocated by the Controlling Player of the Unit suffering them.",
  },
  {
    nom: "Raptora",
    texte:
      "Thousand Sons Psychic Discipline (Prosperine Arcana): a Model that has it gains the Crushing Force Psychic Weapon, the Telekinetic Shield Psychic Reaction, and the \"Raptora\" Trait.",
  },
  {
    nom: "Telekinetic Shield",
    texte:
      "Psychic Reaction (Blessing) that gives a Unit a Shrouded Damage Mitigation Roll. The Reactive Player may declare it at the start of Step 3 of a Shooting Attack made by the Active Player that targets a Unit including at least one Model with the Raptora Trait (Cost: 1 Reaction Allotment, paid only if the Willpower Check is passed). The Focus must be a Model with the Raptora Trait in the targeted Unit; the Target is that same Unit, composed entirely of Models with the Thousand Sons Trait. If successful, its effects last until the end of the Sub-Phase: all Models in the Target Unit gain a 4+ Shrouded Damage Mitigation Roll against any Wound suffered.",
  },

  /* --- Décurion de Légion (livre d'armée, amélioration de Figurine de
     Type Véhicule sélectionnées : Predator, Sicaran, Char d'Assaut
     Kratos — voir optionsDecurionLegion dans js/unites-data.js et
     pages/construction-liste.html #decurion). Defensor et Locus sont ouverts à
     toute Légion ; Sagittar (Imperial Fists) et Lanius (Sons of
     Horus) sont réservés au Trait de Légion indiqué. --- */
  {
    nom: "Decurion Defensor",
    texte:
      "Legion Decurion upgrade (Predator, Sicaran, Kratos Heavy Assault Tank), available to any Legion: requires the Model to be equipped with a Pintle Weapon other than a Pintle Mounted Havoc launcher. A Model that has it gains the \"Point Defence\" Special Rule.",
  },
  {
    nom: "Decurion Locus",
    texte:
      "Legion Decurion upgrade (Predator, Sicaran, Kratos Heavy Assault Tank), available to any Legion. A Model that has it gains an augury scanner and the \"Localised Strike\" Special Rule.",
  },
  {
    nom: "Decurion Sagittar",
    texte:
      "Legion Decurion upgrade (Predator, Sicaran, Kratos Heavy Assault Tank), restricted to the Imperial Fists Legion Trait: requires the Model to have no Pintle Weapon. A Model that has it gains a Pintle Mounted Iliastus assault cannon (with Skyfire and Precision (6+)) and an augury scanner.",
  },
  {
    nom: "Decurion Lanius",
    texte:
      "Legion Decurion upgrade (Predator, Sicaran, Kratos Heavy Assault Tank), restricted to the Sons of Horus Legion Trait: requires the Model to have no Pintle Weapon. A Model that has it gains a Pintle Mounted Banestrike bolt cannon and the \"Brutal Subjugation\" Special Rule.",
  },
  /* Décurion Magna — Journal Tactica : Mailed Fist. Amélioration de
     Décurion pour les chars super-lourds Fellblade et Falchion (+60
     pts, option "decurion-magna" de leurs fiches, js/unites-data.js). */
  {
    nom: "Decurion Magna",
    texte:
      "Legion Decurion upgrade (Journal Tactica: Mailed Fist) for the Fellblade Super-heavy Battle Tank and the Falchion Super-heavy Tank Destroyer, available to any Legion. A Model that has it has an Incursor pattern command matrix.",
  },
  {
    nom: "Incursor pattern command matrix",
    texte:
      "Wargear (Journal Tactica: Mailed Fist). A Model with the Super-heavy Sub-type equipped with an Incursor pattern command matrix may make the Overwatch and Return Fire Reactions in response to the actions of any Unit, instead of only Units that include Models with the Paragon Type or the Super-heavy, Knight or Titan Sub-type. In addition, while a Model equipped with an Incursor pattern command matrix has the Suppressed or Stunned Tactical Status, it has the Auto-repair (4+) Special Rule.",
  },
  {
    nom: "Point Defence",
    texte:
      "When a Model with this Special Rule is the Target of a Charge, in Step 4 of the Charge Procedure, a Model with this Special Rule may make an additional Volley Attack. This additional Volley Attack is made as a separate Shooting Attack, after its first Volley Attack has been resolved, and the Controlling Player may only select a Pintle Weapon to make attacks during this second Volley Attack. If any Models are Removed as a Casualty as a result of this Model's Shooting Attacks during this Volley Attack, the Charging Unit subtracts 1 from the result of any Charge Roll made this Phase.",
  },
  {
    nom: "Localised Strike",
    texte:
      "When a Return Fire Reaction is made for a Model with this Special Rule, all of its Turret Mounted Weapons are treated as Defensive Weapons regardless of their Characteristics. If a Turret Mounted Weapon of a Model with this Special Rule is already a Defensive Weapon, the Model's Controlling Player may instead add +1 to Hit Tests made for that Weapon's Fire Group when making this Reaction.",
  },
  {
    nom: "Brutal Subjugation",
    texte:
      "A Model with this Special Rule may target a friendly Unit with a Shooting Attack, and the targeted Unit loses the Routed Tactical Status. At the start of the Move Sub-Phase, the Controlling Player of a Model with this Special Rule may choose a Unit in their Army with the Routed Tactical Status that is within 12\" of the Model with this Special Rule. If they do, the Model with this Special Rule immediately makes a Shooting Attack that targets only the chosen Unit, using only the Banestrike bolt cannon. This Shooting Attack does not cause any Leadership Checks. Once this Shooting Attack has been resolved, the Target Unit loses the Routed Tactical Status.",
  },

  /* --- Arsenal des Solar Auxilia (Liber Auxilia) : étendards de
     tercio et réseau vox, non transcrits ailleurs sur ce site (voir
     js/organigramme-data.js, Unités Solar Auxilia non transcrites).
     --- */
  {
    nom: "Auxilia Vexillum",
    texte:
      "An Auxilia vexillum raises the Casualty threshold that triggers a Panic Check for the Unit in the Shooting Phase from 25% to 50%.",
  },
  {
    nom: "Cohort Vexillum",
    texte:
      "A Cohort vexillum raises the Casualty threshold that triggers a Panic Check for the Unit in the Shooting Phase from 25% to 50%, and removes the Routed Tactical Status from Solar Auxilia Units that end a Fall Back Move within 12\".",
  },
  {
    nom: "Command Vox",
    texte:
      "Allows Statuses to be removed in the Start Phase. A command vox acts as a relay for friendly internodal voxes: each friendly Model on the Battlefield equipped with a command vox may only be used for this Special Rule once per Start Phase.",
  },
  {
    nom: "Internodal Vox",
    texte:
      "Allows Statuses to be removed in the Start Phase. If a friendly Model on the Battlefield is equipped with a command vox, the Controlling Player may activate an internodal vox once per Player Turn to remove a single Status from all Models in the Unit equipped with that internodal vox.",
  },
  {
    nom: "Rapier Battery",
    texte:
      "For Models with this Special Rule, Shooting or Melee Attacks are resolved against different Toughness Characteristics within their Unit. For a Fire Group targeting a Unit that includes at least one Rapier Carrier Model, the Rapier Carrier Toughness Characteristic is used if it is in the majority, and the Target Models chosen must be Rapier Carrier Models wherever possible. For a Strike Group targeting a Unit that includes at least one Rapier Gunner Model, the Toughness Characteristic of the majority Model is used, and the Target Models chosen must be Rapier Gunner Models wherever possible.",
  },
  {
    nom: "Precision Bombardment",
    texte:
      "Reduces the Deviation distance of Shooting Attacks made by nearby Models with the Artillery Tercio Trait, by subtracting the attacking Model's Ballistic Skill from the total of the dice rolled to determine the Deviation distance.",
  },
  {
    nom: "Armoured Combat",
    texte:
      "Models with this Special Rule grant the Auto-repair (4+) Special Rule to nearby Models that have the Armoured Tercio Trait.",
  },
  {
    nom: "Flare launchers",
    texte:
      "A Model equipped with decoy launchers gains a 5+ Invulnerable Save against any Hits inflicted during an Intercept Reaction.",
  },

  /* --- Arsenal des Solar Auxilia (Liber Auxilia) : Règles Spéciales
     d'Unité, transcrites depuis des scans à l'impression dense — texte
     condensé au mécanisme central plutôt que reproduit mot pour mot ;
     à revérifier contre le livre en cas de doute. --- */
  {
    nom: "Close Order",
    texte:
      "Models with this Special Rule increase the value of the Line (X) Special Rule of nearby friendly Models that have the Infantry Tercio Trait. If a Model with the Infantry Type that has the Infantry Tercio Trait can draw Line of Sight to at least one friendly Model with this Special Rule within 18\", a +1 modifier is applied to the value of X of the variant of the Line (X) Special Rule that the first Model and all other Models in the same Unit have.",
  },
  {
    nom: "Hold the Line",
    texte:
      "Models with this Special Rule grant a Feel No Pain Damage Mitigation Roll to nearby Models that have the Veletaris Tercio Trait, against Volley and Reaction Attacks. Any Model with the Infantry Type that has the Veletaris Tercio Trait and the Vanguard (X) Special Rule gains the Feel No Pain (5+) Special Rule against Wounds inflicted by Shooting Attacks made during a Reaction or a Volley Attack, as long as at least one Model in the same Unit is within 18\" of a friendly Model with this Special Rule.",
  },
  {
    nom: "Pre-emptive Strike",
    texte:
      "Models with this Special Rule grant the Firestorm Special Rule to nearby Models that have the Scout Tercio Trait. Any Model that has the Scout Tercio Trait gains the Firestorm Special Rule as long as at least one Model in the same Unit is within 18\" of a friendly Model with this Special Rule.",
  },
  {
    nom: "Hermes Grenade Launcher",
    texte:
      "In the Volley Step of the Charge Procedure, a Model equipped with a Hermes Grenade Launcher may make a single attack with that Weapon's Frag or Krak profile, instead of a normal Shooting Attack.",
  },
  {
    nom: "Supreme Cohort Command",
    texte:
      "If an Army's Primary Detachment is drawn from the Solar Auxilia Army List and includes at least one Model with this Trait, the Army gains one bonus Reaction Point.",
  },

  /* --- Réactions Avancées et Posture des Solar Auxilia (Liber
     Auxilia, p. 106-108), accessibles à toute Unité/Figurine qui a le
     Trait Solar Auxilia. Condensées au mécanisme central (Déclencheur/
     Coût/Cible/Processus fondus en un seul texte) plutôt que
     reproduites in extenso, comme les autres Réactions Avancées déjà
     présentes ci-dessus (Frappe Fatale, Chercheur d'Expiation…). --- */
  {
    nom: "Form Ranks!",
    texte:
      "Solar Auxilia Advanced Reaction that closes up a Unit's ranks to grant it a temporary Invulnerable Save. The Reactive Player may declare it in the Move Sub-Phase of the Movement Phase for a Unit under their control that includes any Model with the Solar Auxilia Trait (cost: 1 Reaction Allotment). Each Model in the Reacting Unit Moves so as to end in Base Contact with at least two other Models from the same Unit; the Unit then gains a 5+ Invulnerable Save against all Shooting Attacks for the rest of the Active Player's Turn.",
  },
  {
    // Étape 2 du Processus remplacée par la version corrigée
    // (sélection à 12" de l'Unité Réagissante, Ligne de Vue non requise,
    // Arme de Bataille et Pivot pour un Véhicule).
    nom: "Fire Support!",
    texte:
      "Advanced Reaction that moves a Unit out of danger while a friendly Barrage Weapon returns fire. The Reactive Player may declare it in Step 3 of a Shooting Attack made by the Active Player against a Unit under their control composed only of Infantry Models that have the Solar Auxilia Trait but not the Bulky (X) Special Rule (cost: 1 Reaction Allotment). The Target Unit of the Reaction is always the Unit whose Shooting Attack triggered it. 1. Models in the Reacting Unit Move a number of inches up to their Initiative, ending in Coherency and more than 1\" from any enemy Model; if none of them is then in Line of Sight and/or in Range of any Model in the Target Unit, the Active Player may not choose another target for that Unit during the current Shooting Phase. 2. Once the Reacting Player has resolved this move, they may select a single friendly Model with the Solar Auxilia Trait and a Weapon with the Barrage (X) Special Rule, within 12\" of at least one Model in the Reacting Unit. That Model immediately makes a Shooting Attack against the Target Unit with a single Weapon with the Barrage (X) Special Rule, which may be made without Line of Sight in accordance with that Special Rule. If that Model has the Vehicle Type, this may be a Battle Weapon and the Model may Pivot just before making the Shooting Attack. Note that this Model's Unit still counts as having made a Reaction this Battle Turn. 3. Once this Shooting Attack has been resolved, including Removing Casualties, finish resolving the original Shooting Attack that triggered the Reaction.",
  },
  {
    nom: "Fix Bayonets!",
    texte:
      "Advanced Reaction that allows a Solar Auxilia Unit to strike back with bayonets against a failed Charge. The Reactive Player may declare it at the end of Step 5 of a Charge whose Charge Roll failed, for the Unit that was its Target, composed only of Models that have the Solar Auxilia Trait (cost: 1 Reaction Allotment): each Model in the Reacting Unit equipped with a Weapon with the Bayonet Trait makes its melee attacks against the Charging Unit at the corresponding Initiative Step, with Models Removed as Casualties counting towards Combat Resolution.",
  },
  {
    nom: "Contemptuous Volley",
    texte:
      "Solar Auxilia Challenge Gambit that allows a Model to respond with a pistol rather than in close combat. A Model engaged in a Challenge that has the Solar Auxilia Trait may choose this Gambit to make a single Shooting Attack with a pistol against the enemy Model in the Challenge, whose Wounds may only be allocated to that Model. If this Shooting Attack Removes it as a Casualty, proceed directly to the Glory Step without a Focus Roll; otherwise, the opponent automatically gains the Challenge Advantage.",
  },

  /* --- Doctrines de Cohorte (Liber Auxilia, p. 11-16) : un unique
     choix optionnel par Armée Solar Auxilia (menu « Doctrine de
     Cohorte », js/organigramme.js). Tactica de Cohorte et Détachements
     Additionnels condensés en un seul texte par Doctrine. --- */
  {
    nom: "Cohort Ultima",
    texte:
      "Cohort Doctrine focused on massed infantry. Models with the Solar Auxilia Trait in an Army that adheres to this Doctrine follow the Coordinated Manoeuvres Special Rule: in each Movement, Shooting and Assault Phase, the first Reaction declared whose Reacting Unit is a Lasrifle Section has its Reaction Point cost modified by -1 (to a minimum of 0), and a Lasrifle Section may make one additional Reaction per Phase for one fewer Reaction Allotment. Unlocks, for each Infantry Tercio Auxiliary Detachment on the Army Roster, an additional Infantry Tercio Auxiliary Detachment without using a Command Slot.",
  },
  {
    nom: "Solar Cohort",
    texte:
      "Cohort Doctrine focused on mounted assault. Models with the Solar Auxilia Trait and the Vanguard (X) Special Rule in an Army that adheres to this Doctrine do not make a Charge declared for a Unit composed entirely of such Models Disordered in the Player Turn in which it Disembarks from a Dracosan. Unlocks, for each Veletaris Tercio Auxiliary Detachment on the Army Roster, an additional Veletaris Tercio Auxiliary Detachment without using a Command Slot.",
  },
  {
    nom: "Recon Cohort",
    texte:
      "Cohort Doctrine focused on Sentinel squadrons. Models with the Cavalry Type and the Solar Auxilia Trait in an Army that adheres to this Doctrine may Control or Contest Objectives, move further during an Evade Reaction, and have their Initiative Characteristic set to 5 for that Reaction. Unlocks, for each Scout Tercio Auxiliary Detachment on the Army Roster, an additional Scout Tercio Auxiliary Detachment without using a Command Slot.",
  },
  {
    nom: "Mechanised Cohort",
    texte:
      "Cohort Doctrine focused on armoured support. Models with the Vehicle Type (excluding the Flyer Sub-type) and the Solar Auxilia Trait in an Army that adheres to this Doctrine may Move while still benefiting from the Heavy (X) Special Rule; if they move no more than 4\" in the Movement Phase and do not Rush, they count as Stationary that Turn for any Heavy (X) variant on their Weapons. Unlocks, for each Armoured Tercio Auxiliary Detachment on the Army Roster, an additional Armoured Tercio Auxiliary Detachment without using a Command Slot.",
  },
  {
    nom: "Siege Cohort",
    texte:
      "Cohort Doctrine focused on heavy artillery. Models with the Solar Auxilia Trait in an Army that adheres to this Doctrine improve by +1 the value of X of the Pinning (X) Special Rule on their Weapons with the Barrage (X) Special Rule, and on any Weapon with both Barrage (X) and Pinning (X). Unlocks, for each Artillery Tercio Auxiliary Detachment on the Army Roster, an additional Artillery Tercio Auxiliary Detachment without using a Command Slot.",
  },
  {
    nom: "Iron Cohort",
    texte:
      "Cohort Doctrine that integrates Mechanicum automata into Lasrifle Sections. Each Model in a Lasrifle Section Unit in an Army that adheres to this Doctrine gains the Expendable (1) Special Rule. Unlocks the Iron Tercio Auxiliary Detachment, which allows Castellax Destructor Maniple, Tech-priest, Castellax Battle Maniple or Thallax Cohort Units to be selected (Liber Mechanicum, not transcribed on this site) — the Models selected there replace their [Mechanicum]/Cybernetica/Reductor Trait with the Iron Tercio Faction Trait.",
  },
  {
    // Journal Tactica : Prospero Burns.
    nom: "Cohort Oblitum",
    texte:
      "Cohort Doctrine restricted to Armies with the Loyalist Allegiance, focused on psycho-conditioning. Models with the Solar Auxilia Trait in an Army that adheres to this Doctrine follow two Special Rules. Psycho-conditioned: these Models ignore negative Leadership modifiers and can never suffer them on their Leadership Characteristic, but when a Unit composed entirely of such Models is chosen to score an Objective or declared as the Reacting Unit of a Reaction, it must first pass a Willpower Check before any Victory Points are scored or the Reaction Allotment is spent; if it fails, the Unit immediately gains the Stunned Status and does not score the Objective or continue the Reaction (other eligible Units belonging to the Player may still score that Objective). Imperial Mandate: these Models gain the Talons of the Emperor Trait, may be included in an Allied Detachment of a Legio Custodes Army, and the Army may never have a Legiones Auxilia Designation. Unlocks, for each Veletaris Tercio Auxiliary Detachment on the Army Roster, a Helot Tercio Auxiliary Detachment without using a Command Slot, linked to the Detachment that includes the Veletaris Command Section that unlocked that Veletaris Tercio — its Units are drawn from the Imperialis Militia Army List (not transcribed on this site).",
  },
  {
    // Journal Tactica : The Battle for the Signus Cluster.
    nom: "Sublime Cohort",
    texte:
      "Cohort Doctrine restricted to Armies with the Traitor Allegiance, devoted to the worship of Slaanesh. Models with the Solar Auxilia Trait in an Army that adheres to this Doctrine follow the Disciples of Pain Special Rule: they gain the Slaanesh Trait and the Fleet (1) Special Rule; such a Model with the Command Sub-type also gains the Psyker Trait and the Rapture (Enraptura) Psychic Discipline, and may not be given any other Psychic Discipline. Unlocks, for each Infantry Tercio Auxiliary Detachment on the Army Roster, an Antemasque Detachment without using a Command Slot, linked to the same Detachment as that Infantry Tercio — its Slots may only be filled by Units from the Daemons of Slaanesh Army List.",
  },

  /* --- Réactions Avancées « Legiones Auxilia » (livre Legiones
     Auxilia intégré au Liber Auxilia, p. 50-84) : accessibles quand une
     Armée Solar Auxilia adopte la Désignation de Legiones Auxilia
     correspondante (menu « Désignation de Legiones Auxilia » des
     paramètres de la partie, voir DESIGNATIONS_LEGIONES_AUXILIA,
     js/organigramme-data.js), réservée aux Détachements Principaux
     dont la moindre Figurine n'a pas d'autre Trait [Legiones Astartes]
     que celui de la Légion indiquée. Condensées ici en référence
     (texte de règle uniquement, fluff omis) plutôt que reproduites
     avec la structure Déclencheur/Coût/Cible/Processus intégrale du
     livre — une par Légion transcrite dans ce livre, dans l'ordre des
     Légions (voir la table des Légions, CLAUDE.md). --- */
  {
    nom: "Bring Him Down!",
    texte:
      "Advanced Reaction of the Calibanite Hunters Legiones Auxilia Designation (I Legion, Dark Angels). The Reactive Player may declare it at the end of Step 5 of a successful Charge by the Active Player whose Charging Unit includes a Model with the Walker/Automata Type or the Malefic Sub-type with Bulky (3) or higher, against a Target Unit composed only of Models that have the Solar Auxilia Trait (cost: 1 Reaction Allotment): each Model in the Reacting Unit equipped with a Weapon with the Detonation Special Rule immediately attacks the Charging Unit as if Engaged with it at that Initiative Step, with Casualties inflicted counting towards Combat Resolution.",
  },
  {
    nom: "Redouble",
    texte:
      "Advanced Reaction of the Archite Palatines Legiones Auxilia Designation (III Legion, Emperor's Children). The Reactive Player may declare it in the Morale Sub-Phase of the Shooting Phase, when a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait but not the Bulky (X) Special Rule passes a Cool or Leadership Check to avoid a Tactical Status (cost: 1 Reaction Allotment): that Unit makes a standard Move (without Rushing), then each friendly non-Vehicle Unit with the Solar Auxilia Trait within 12\" may in turn Move a number of inches equal to its Initiative Characteristic, this Move counting as a Reaction this Battle Turn.",
  },
  {
    nom: "Endure the Torment",
    texte:
      "Advanced Reaction of the Selucian Thorakites Legiones Auxilia Designation (IV Legion, Iron Warriors). The Reactive Player may declare it in the Morale Sub-Phase of the Shooting Phase, when a Unit under their control composed only of Models with the Infantry or Cavalry Type that have the Solar Auxilia Trait would gain the Pinned, Stunned or Suppressed Tactical Status after a failed Characteristic Check (cost: 1 Reaction Allotment): the Unit does not gain that Status, as if the Check had been passed.",
  },
  {
    nom: "Chosen Ground",
    texte:
      "Advanced Reaction of the Chogorian Limitanei Legiones Auxilia Designation (V Legion, White Scars). Once per Battle, the Reactive Player may declare it at no cost in the Resolution Sub-Phase of the Assault Phase, when a Panic Check is failed for a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait, with at least one Model within 3\" of an Objective: the Unit does not gain the Routed Status, and the Battle proceeds directly to the Aftermath Step, where the Reactive Player must declare the Hold option for that Unit.",
  },
  {
    nom: "Hunter's Strike",
    texte:
      "Advanced Reaction of the Fenrisian Kaerls Legiones Auxilia Designation (VI Legion, Space Wolves). Once per Battle, the Reactive Player may declare it at no cost when an enemy Unit finishes entering play from Reserves in Line of Sight of a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait but not the Bulky (X) Special Rule: that Unit Moves straight towards the enemy Unit (without being able to Rush) and then makes a Charge Roll against it, making a Charge Move and becoming Locked in Combat if successful.",
  },
  {
    nom: "Impregnable Bulwark",
    texte:
      "Advanced Reaction of the Inwit Phalangites Legiones Auxilia Designation (VII Legion, Imperial Fists). The Reactive Player may declare it at the start of Step 3 of a Shooting Attack by the Active Player against a Unit under their control composed only of Models that have the Solar Auxilia Trait but not the Bulky (X) Special Rule, the majority of which benefit from a Cover Save (cost: 1 Reaction Allotment): all Models in the Reacting Unit gain +1 Toughness (to a maximum of 4) for the duration of that Shooting Phase.",
  },
  {
    nom: "Fog of War",
    texte:
      "Advanced Reaction of the Nostraman Damnatii Legiones Auxilia Designation (VIII Legion, Night Lords). The Reactive Player may declare it in the Morale Sub-Phase of the Shooting Phase, when a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait would gain the Routed Status after a failed Leadership Check (cost: 1 Reaction Allotment): the Unit does not gain that Status, but immediately gains the Negligence and Impact (A) Special Rules for the rest of the Battle, and loses any version of Line (X) as well as any Infantry Tercio/Veteranis/Artillery Tercio Traits it has.",
  },
  {
    nom: "Counter-assault",
    texte:
      "Advanced Reaction of the Saiphan Elevatii Legiones Auxilia Designation (IX Legion, Blood Angels). The Reactive Player may declare it in Step 2 of the Move Sub-Phase, when an enemy Unit ends its Move within 6\" of and in Line of Sight of a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait but not the Bulky (X) Special Rule (cost: 1 Reaction Allotment): the Reacting Unit immediately makes a Charge Roll against that enemy Unit, with no Cool Check if it fails.",
  },
  {
    nom: "Cerebral Augmentations",
    texte:
      "Advanced Reaction of the Medusan Chain Shroud Legiones Auxilia Designation (X Legion, Iron Hands). The Reactive Player may declare it in the Morale Sub-Phase of the Shooting Phase, or in the Make Panic Checks Step of the Assault Phase, when a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait but not the Bulky (X) Special Rule would gain the Routed Status (cost: 1 Reaction Allotment): the Unit does not gain that Status, but immediately suffers D3 automatic wounds that ignore Armour and Cover Saves (Invulnerable Saves and Damage Mitigation Rolls are allowed).",
  },
  {
    nom: "The Butcher's Due",
    texte:
      "Advanced Reaction of the Nagrakal Thraexii Legiones Auxilia Designation (XII Legion, World Eaters). The Reactive Player may declare it in the Resolution Sub-Phase of the Assault Phase, when an enemy Unit moves as part of a Disengage or Fall Back Aftermath option and is in Line of Sight of a Unit under their control composed only of Models that have the Solar Auxilia Trait and are not Locked in Combat (cost: 1 Reaction Allotment): the Reacting Unit immediately makes a Shooting Attack against that enemy Unit only.",
  },
  {
    nom: "Combined Arms",
    texte:
      "Advanced Reaction of the High Guard of Ultramar Legiones Auxilia Designation (XIII Legion, Ultramarines). The Reactive Player may declare it at the start of Step 3 of a Shooting Attack by the Active Player against a Unit under their control composed only of Models that have the Solar Auxilia Trait (cost: 1 Reaction Allotment). The Reacting Unit immediately makes a Shooting Attack against the Charging Unit; if it causes that Unit to lose at least one Wound after Saves and Mitigation, the latter's Charge immediately becomes a Disordered Charge.",
  },
  {
    nom: "Endure",
    texte:
      "Advanced Reaction of the Ambaxtoi of Barbarus Legiones Auxilia Designation (XIV Legion, Death Guard). The Reactive Player may declare it in the Shooting Phase, at the end of Step 11 of a Shooting Attack by the Active Player that would cause a Panic Check for Casualties against a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait but not the Bulky (X) Special Rule (cost: 1 Reaction Allotment), to avoid that Check: the Reacting Unit then makes a Snap Shot Shooting Attack against an enemy Unit in Line of Sight of the Reactive Player's choice, then the avoided Panic Check is resolved as normal.",
  },
  {
    nom: "Psychic Shock",
    texte:
      "Advanced Reaction of the Prosperine Spireguard Legiones Auxilia Designation (XV Legion, Thousand Sons). The Reactive Player may declare it in the Shooting Phase, at the end of Step 11 of a Shooting Attack by the Active Player that would cause a Panic Check for Casualties against a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait but not the Bulky (X) Special Rule (cost: 1 Reaction Allotment): the Reacting Unit immediately suffers a result from the Perils of the Warp Table, then another result from the Perils of the Warp Table is immediately resolved against the Unit that made the Shooting Attack, before the Active Player's Shooting Phase continues as normal.",
  },
  {
    nom: "Warmaster's Harangue",
    texte:
      "Advanced Reaction of the Cthonian Headhunters Legiones Auxilia Designation (XVI Legion, Sons of Horus). The Reactive Player may declare it in the Rout Sub-Phase of the Movement Phase, when a Unit under their control composed only of Models that have the Solar Auxilia Trait makes its Fall Back Move (cost: 1 Reaction Allotment): that Unit makes a Move towards one or more nearby enemy Units instead of Rushing as normal, then each friendly Unit composed only of Models with the Solar Auxilia Trait within 12\" may in turn Move a number of inches equal to its Initiative Characteristic, in Coherency, this Move counting as a Reaction this Battle Turn.",
  },
  {
    nom: "Reposition",
    texte:
      "Advanced Reaction of the Velites of Therion Legiones Auxilia Designation (XIX Legion, Raven Guard). The Reactive Player may declare it at the start of Step 4 of the Charge process of any Charge declared by the Active Player that targets a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait but not the Bulky (X) Special Rule (cost: 1 Reaction Allotment): the Reacting Unit Moves up to its Initiative Characteristic in inches, in Coherency, then makes a Volley Attack against the Unit that declared the Charge, its Ranged Weapons gaining the Assault Trait for the occasion, before the Active Player proceeds to Step 4 of the Charge as normal.",
  },
  {
    nom: "Diversion",
    texte:
      "Advanced Reaction of the Sparatoi Vindictaires Legiones Auxilia Designation (XX Legion, Alpha Legion). The Reactive Player may declare it in Step 3 of a Shooting Attack by the Active Player against a Unit under their control composed only of Models with the Infantry Type that have the Solar Auxilia Trait but not the Bulky (X) Special Rule (cost: 1 Reaction Allotment), if another friendly Unit without Bulky (X) is within 12\" and within range of all Weapons declared by the Active Player: the Active Player must immediately make a Cool Check for the original Target Unit; if it fails, the Shooting Attack continues against that other Unit, which becomes the Target in its place.",
  },

  /* --- Arsenal des Taghmata du Mechanicum (Liber Mechanicum) : Règles
     Spéciales d'Unité citées par les profils du livre. --- */
  {
    nom: "Martial Meditation",
    texte:
      "A Model with this Special Rule may re-roll a failed Focus Roll in a Challenge, once per Challenge.",
  },
  {
    nom: "Rite of Pure Thought",
    texte:
      "A Model with this Special Rule ignores the effects of the Fear (X) Special Rule, and can never gain the Routed Tactical Status: if it would gain it, it is Removed as a Casualty instead.",
  },
  {
    nom: "Aegis of Suffering",
    texte:
      "A Model with this Special Rule ignores negative modifiers to its Characteristics caused by the loss of Wounds.",
  },
  {
    nom: "Phased Refractor Shields",
    texte:
      "A Model with this Special Rule gains a 5+ Invulnerable Save.",
  },
  {
    nom: "Compact",
    texte:
      "A Model with this Special Rule does not block Line of Sight, and cannot be chosen as the Target of a Shooting Attack while another non-Automata Model in its Unit is closer to the firer and in Line of Sight.",
  },
  {
    nom: "Limited Autonomy",
    texte:
      "A Unit composed entirely of Models with this Special Rule can never Control or Contest an Objective, and cannot be chosen as the Target of a Charge while another enemy Unit is a valid Target.",
  },
  {
    nom: "Repair Automata",
    texte:
      "Instead of making a Shooting or Melee Attack, a Model with this Special Rule may attempt to repair a friendly Model with the Vehicle or Automata Type within 3\", as per the Battlesmith (2) Special Rule.",
  },
  {
    nom: "Master of Machines",
    texte:
      "A Model with this Special Rule may re-roll a failed Invocation Test for a Cybertheurgic Rite it knows, once per Rite invoked.",
  },
  {
    nom: "Command Throne",
    texte:
      "A Model with this Special Rule grants a +1 bonus to Leadership Checks made by friendly Models within 12\" that have a Mechanicum Faction Trait.",
  },
  {
    // Arme de personnage (Archimagos Draykavac, Mechanicum).
    nom: "Legacy of Cunning",
    texte:
      "A Model with this Special Rule may be removed from play without giving any Victory Points to the opponent. In the Effects Sub-Phase of the End Phase of any Turn in which the Controlling Player is the Active Player, they may activate this Special Rule (not possible if the Model is Locked in Combat): make a Cool Check for it, with +1 per enemy Unit within 12\", +1 per Tactical Status (other than Routed) it is subject to, and -2 if it is subject to the Routed Tactical Status. If the Check is passed, the Model is immediately removed from play without counting as a Casualty; if it is failed, nothing happens and it may try again in a later Turn.",
  },
  {
    // Arme de personnage (Archimagos Draykavac, Mechanicum).
    nom: "Liquifractor Assault",
    texte:
      "Gambit available to a Model with this Special Rule while it is engaged in a Challenge. If it is chosen, the Controlling Player rolls an additional dice in the Focus Step and discards the highest result; then, in the Strike Step, the Model makes a Shooting Attack with its Liquifractor before the protagonist and antagonist make any attacks. This Shooting Attack must target the enemy Model in the Challenge and all Wounds inflicted must be allocated to it; it is treated as being at a range of 1\" and in Line of Sight.",
  },
  {
    nom: "Controller (X)",
    texte:
      "A Model with the Cybertheurgist Trait and this Special Rule may Invoke up to X Cybertheurgic Rites per Battle Turn, instead of only one.",
  },
  {
    // Option d'Arcane du Techno-arcane Archimandrite (Liber Mechanicum,
    // p. 45) : +10 Points, réservée à un Archimagos ou Archimagos sur
    // Abéant qui a le Trait Archimandrite ET occupe un Choix de Quartier
    // Général. Le nom exact du livre est « Theurgika Maximus » (et non
    // « Maxima », orthographe fautive d'une transcription antérieure sur
    // l'Archimagos Scoria, corrigée depuis).
    nom: "Theurgika Maximus",
    texte:
      "A Model with this Special Rule may use two Cybertheurgic Rites per Turn. Two Cybertheurgic Rites may be Invoked per Turn for a Unit that includes a Model with this Special Rule, but each Rite must be Invoked in a different Phase, and the Model with this Special Rule must be the Focus of both Rites. In addition, restrictions based on Faction Traits are ignored when selecting Cybertheurgic Rites for a Model with this Special Rule.",
  },

  /* --- Cybertheurgie (Liber Mechanicum, p. 53-65) : condensée au
     mécanisme central plutôt que reproduite in extenso — le livre
     reste la référence en cas de doute. --- */
  {
    nom: "Cybertheurgist",
    texte:
      "Only a Model that has this Trait may Invoke a Cybertheurgic Rite, and only a Rite it knows (listed on its Profile or taken as an Option). Once per Battle Turn, as the Active Player, it may Invoke a Cybertheurgic Rite it knows, before its own Move, before one of its Shooting Attacks, or before declaring a Charge for its Unit — via an Invocation Test (an Intelligence Check modified by the Rite's Difficulty and various Line of Sight/range/Trait factors), which applies the Rite's effects to the Target Unit if successful.",
  },
  {
    nom: "Cybertheurgic Feedback",
    texte:
      "Some Cybertheurgic Rites or Statuses inflict Cybertheurgic Feedback on a Unit: each Model suffers 1 Wound with an AP of \"-\" and a Damage of 1, with no Wound Test and no Cover/Invulnerable Save (Armour Saves are allowed). A Model with the Vehicle Type suffers only a single Glancing Hit per Cybertheurgic Feedback, with no Armour Penetration Test.",
  },
  {
    // Journal Tactica : Battle of Tallarn, Cohortes Vagus (Avantages
    // Principaux Vagus, voir js/organigramme-data.js).
    nom: "Cortex Corruption",
    texte:
      "Automata left unsupervised for too long often suffer severe logic degradation. A Unit that includes at least one Model with this Special Rule cannot be joined by any other Model, and no Model with this Special Rule can be the target of a Cybertheurgic Rite invoked for a friendly Model.",
  },
  {
    nom: "Vagus",
    texte:
      "Vagus Cohorts Trait (Journal Tactica: Battle of Tallarn): any Model in a Vagus Cohorts Detachment that has the Cybernetica Trait replaces it with this Trait. Vagus Prime Advantages may only be chosen for a Prime Slot filled by a Unit composed only of Models with this Trait.",
  },
  {
    nom: "Cybertheurgic Status: Accelerate",
    texte:
      "A Model subject to this Status gains +1 to its Movement and Initiative Characteristics (or +3 to its Movement Characteristic if it has a Base value of 0 or \"-\", with no effect if it has none).",
  },
  {
    nom: "Cybertheurgic Status: Fortify",
    texte:
      "A Model subject to this Status gains +1 to its Strength and Toughness Characteristics (or +1 to the Armour Value of a facing chosen by the Controlling Player if it has no Toughness Characteristic, to a maximum of 14).",
  },
  {
    nom: "Cybertheurgic Status: Guide",
    texte:
      "A Model subject to this Status gains +1 to its Ballistic Skill and Weapon Skill Characteristics.",
  },
  {
    nom: "Cybertheurgic Status: Negation",
    texte:
      "A Model subject to this Heterodox Cybertheurgic Status gains no bonus or penalty. When it applies to at least one Model in a Unit, all other Cybertheurgic Statuses are discarded from all Models in that Unit (immediate Cybertheurgic Feedback, whether or not there were any), and none of these Models can gain a new Cybertheurgic Status while at least one Model in the Unit remains subject to Negation.",
  },
  {
    nom: "Heterodox",
    texte:
      "A Model that has this Trait must have the Traitor Allegiance Trait, and may select Heterodox Cybertheurgic Rites/Statuses in addition to the Standard/Sub-faction Rites it already knows. A Model that has the Malagra Trait can never have the Heterodox Trait.",
  },
  {
    nom: "Malefic",
    texte:
      "A Unit composed entirely of Models with this Sub-type can never gain a Tactical Status, and can only be Rallied by a Model that can itself gain Tactical Statuses and become Routed; when it would gain a Tactical Status, it instead suffers D3 automatic Wounds (AP 2, Damage 1, no Saves allowed). Models with this Sub-type are not affected by Special Rules that negatively modify their Leadership, Willpower or Intelligence, and no Model that is not itself Malefic may join, or be joined by, such a Model.",
  },
  {
    // FAQ octobre 2026. Exception à « Maléfique » ci-dessus, pour les
    // Cybertheurges Hétérodoxes devenus Maléfiques.
    nom: "Heterodoxists",
    texte:
      "October 2026 FAQ. A Model with the Heterodox Trait and the Malefic Sub-type may have its Characteristics modified for the purpose of Invoking Cybertheurgic Rites. This change is a specific exception to the Rules that apply to Models with the Malefic Sub-type.",
  },
  {
    // Superviseur (État-major, Legiones Astartes) : voir
    // js/unites-data.js. Texte remplacé par la FAQ octobre 2026.
    nom: "Master of Auxilia",
    texte:
      "October 2026 FAQ. If a Model with this Special Rule joins a Unit with the Solar Auxilia or Imperialis Militia Trait, the Leadership and Cool Characteristics of the Models in that Unit are not reduced as a result, but may be modified as normal by other rules.",
  },

  /* --- Techno-arcanes Majeurs (Liber Mechanicum, p. 45-51) : chacun
     confère un Bénéfice d'Arcane passif et débloque un Détachement
     d'Apex thématique quand une Figurine de Rôle Tactique Quartier
     Général qui a ce Trait est incluse dans l'Armée (voir js/
     organigramme-data.js — non câblé en Détachement interactif ici,
     le débloqueur étant un Trait choisi en Option et non une Unité
     précise). Options d'Arcane (avantages/postures propres à chaque
     Techno-arcane) condensées dans le même paragraphe. --- */
  {
    nom: "Archimandrite",
    texte:
      "Major Techno-arcana: Arcana Benefit The Engram of Authority (+1 to Base Leadership and Cool Characteristics, and may join Units with a different Faction Trait without penalty). Arcana Option Theurgika Maximus (+10 Points, High Command only): the Model may Invoke two Cybertheurgic Rites per Turn, ignoring Faction Trait restrictions. Unlocks the The Heart of Power Apex Detachment (Retinues) if an Archimandrite Model fills a High Command Slot.",
  },
  {
    nom: "Cybernetica",
    texte:
      "Major Techno-arcana: Arcana Benefit The Deus Machina (a Unit that includes at least one Archmagos/Magos/Tech-priest and a Model with the Automata Type that have this Trait may Control or Contest an Objective). Mechanicum Prime Advantage Paragon of Metal (entirely Cybernetica Unit only): +4 Leadership/Intelligence/Willpower, +1 Initiative/Weapon Skill and the Sergeant Sub-type for one Model. Unlocks the Command Maniple Apex Detachment (Elites, Automata only) if a Cybernetica Model fills a High Command Slot.",
  },
  {
    nom: "Lacrymaerta",
    texte:
      "Major Techno-arcana: Arcana Benefit An Endless Servitude (uses Battlesmith (X) to restore Wounds to Models with the Infantry Type, as well as Hull/Vehicle/Walker/Automata; targeted Tech-thrall Covenant Models also gain a Reassemble option, adding Models to the Unit). Mechanicum Prime Advantage Choice Specimens (entirely Lacrymaerta Infantry Unit only): +2 Strength, +1 Base Wounds. Unlocks the The Panoply of Cruelty Apex Detachment (Heavy Assault, Ursarax Cohort Units only) if a Lacrymaerta Model fills a High Command Slot.",
  },
  {
    nom: "Myrmidax",
    texte:
      "Major Techno-arcana: Arcana Benefit The Strength of Ages (+1 Base Wounds, gains Martial Meditation and Implacable Advance, and Bulky (3) — or +3 to an existing Bulky (X) value — for the Champion Sub-type). Mechanicum Gambit The Path of the Myrmidon: a bonus Shooting Attack before the other attacks in a Challenge, with a single Weapon without Blast (X)/Template/Barrage. Unlocks the The Host of Destruction Apex Detachment (Elites, Units with the Myrmidax Trait only) if a Myrmidax Model fills a High Command Slot.",
  },
  {
    nom: "Malagra",
    texte:
      "Major Techno-arcana: Arcana Benefit Even Immortals Can Fear (-1 Weapon Skill/Ballistic Skill for enemy Models with the [Malefic] Sub-type within 12\" of a Unit that includes a Malagra Model, with no effect on entirely Malefic Units). Mechanicum Gambit Power of the Machine Spirit (distributes the bonus of the controlled Model's Battlesmith (X) variant between Weapon Skill/Strength/Attacks/Initiative, after an Intelligence Check). Unlocks the Torment of Judgement Apex Detachment (High Command, Arcuitor Magisterium Units only, not linked to Auxiliary Detachments) if a Malagra Model fills a High Command Slot.",
  },
  {
    nom: "Macrotek",
    texte:
      "Major Techno-arcana: Arcana Benefit Iron Protector (a friendly non-Super-heavy Model with the Vehicle Type within 3\" of a Macrotek Model gains a 6+ Invulnerable Save, not cumulative). Mechanicum Prime Advantage Prime Mover (Unit composed of a single non-Super-heavy Model with the Vehicle Type only): +1 Front/Side Armour (max 14), +2 Hull Points, and +2 Transport Capacity if it has the Transport Sub-type. Unlocks the Iron Phalanx Apex Detachment (Armour, Models with the Vehicle Type that have the Prime Mover Advantage only) if a Macrotek Model fills a High Command Slot.",
  },
  {
    nom: "Reductor",
    texte:
      "Major Techno-arcana: Arcana Benefit Wallbreaker (+1 to the Strength of all Hits inflicted by a Unit that includes a Reductor Model against a Building, a Fortification or a Stationary Vehicle; the Target Unit may not make the Shield Wall! Advanced Reaction). Mechanicum Prime Advantage Thallaxi Principle (Thallax Cohort Unit only): 5+ Base Invulnerable Save and +1 Base Leadership. Unlocks the Thallax Command Cohort Apex Detachment (High Command, Thallax Cohort Units only) if a Reductor Model fills a High Command Slot.",
  },

  /* --- Rites Cybertheurgiques nommés (Liber Mechanicum, p. 56-65) :
     chacun a une Difficulté et une Portée propres au Test d'Invocation
     (voir Cybertheurge ci-dessus), condensées ici avec l'Effet. --- */
  {
    nom: "Rite: Program Interruption",
    texte:
      "Standard Cybertheurgic Rite (Difficulty 4, Range 18\"): targets a friendly Unit not Locked in Combat, with the Automata/Vehicle Type or the Cybertheurgist Trait, with no Models with the Super-heavy or Knight Sub-type. Grants all of its Models the same Cybertheurgic Status of choice (Quicken, Fortify or Guide), removed in the next Start Phase (with Cybertheurgic Feedback if it was not used for a Reaction).",
  },
  {
    nom: "Rite: Cogitator Purge",
    texte:
      "Standard Cybertheurgic Rite (Difficulty 3, Range 12\"): targets an enemy Unit not Locked in Combat, with the Automata/Walker/Vehicle Type or the Cybertheurgist Trait. Immediately removes all Cybertheurgic Statuses from the Target Unit (Cybertheurgic Feedback on removal, inflicting 2 Wounds per Model instead of one).",
  },
  {
    nom: "Rite: Overcharged Reactors",
    texte:
      "Standard Cybertheurgic Rite (Difficulty 2, Range 12\"): same Target and effect as the Program Interruption Rite (Quicken, Fortify or Guide Status), but cannot target a Unit that includes a Model with the Super-heavy or Knight Sub-type; resolved immediately.",
  },
  {
    nom: "Rite: Omega Protocols",
    texte:
      "Lacrymaerta Cybertheurgic Rite (Difficulty 4, Range 12\"): targets a friendly Unit not Locked in Combat, composed entirely of Lacrymaerta Models. Removes all of its Cybertheurgic Statuses (Cybertheurgic Feedback on removal); if a Model in the Target Unit is Removed as a Casualty by this Feedback, all other Units within 6\" (friend and foe) each suffer two Hits at Strength 6, AP 5, Damage 1, which do not count towards Combat Resolution.",
  },
  {
    nom: "Rite: Protocols of the Flesh",
    texte:
      "Lacrymaerta Cybertheurgic Rite (Difficulty 2, Range 12\"): targets a friendly Unit not Locked in Combat, composed entirely of Lacrymaerta Models. Grants the Quicken or Fortify Cybertheurgic Status, removed in the next Start Phase (Cybertheurgic Feedback on removal).",
  },
  {
    nom: "Rite: Unbarred Portal",
    texte:
      "Reductor Cybertheurgic Rite (Difficulty 3, Range 6\"): targets a Building, a Fortification, or a Unit not Locked in Combat composed of a single Model with the Vehicle Type. Forces all Embarked Models in the Target Unit to make an Emergency Disembarkation immediately, then inflicts Cybertheurgic Feedback on the Target Unit; resolved immediately.",
  },
  {
    nom: "Rite: Analgesic Severance",
    texte:
      "Reductor Cybertheurgic Rite (Difficulty 3, Range 24\"): targets a friendly Unit not Locked in Combat, composed entirely of Reductor Models. Grants the same Cybertheurgic Status of choice (Quicken, Fortify or Guide), removed in the next Start Phase (Cybertheurgic Feedback on removal).",
  },
  {
    nom: "Rite: Fury of the Ages",
    texte:
      "Esoteric Cybertheurgic Rite, restricted to Myrmidax Cybertheurgists (Difficulty 2, Range 6\"): targets a friendly Unit composed only of Models that have the Myrmidax Trait, even if Locked in Combat. Grants the Fortify or Guide Cybertheurgic Status, removed in the next Start Phase (Cybertheurgic Feedback on removal).",
  },
  {
    nom: "Rite: Chastise the Machine Spirit",
    texte:
      "Esoteric Cybertheurgic Rite, available to Cybertheurgists of any Sub-faction (Difficulty 4, Range 18\"): targets an enemy Unit not Locked in Combat, with no Models with the Paragon Type or the Super-heavy Sub-type. Grants the same Tactical Status of choice (Stunned or Suppressed) to all Models in the Target Unit; if the Invocation fails, the Unit that includes the Focus suffers Cybertheurgic Feedback.",
  },
  {
    nom: "Rite: Aetheric Amplification",
    texte:
      "Heterodox Cybertheurgic Rite, +10 Points (Difficulty 2, Range 6\"): targets a friendly Unit composed entirely of Models with the Malefic Sub-type, even if Locked in Combat. Grants the same Cybertheurgic Status of choice (Quicken, Fortify or Guide), removed in the next Start Phase (Cybertheurgic Feedback on removal).",
  },
  {
    nom: "Rite: Anticode Infection",
    texte:
      "Heterodox Cybertheurgic Rite, +10 Points (Difficulty 3, Range 18\"): targets an enemy Unit not Locked in Combat that includes at least one Model subject to a Cybertheurgic Status other than Negation. Grants the Negation Cybertheurgic Status to all Models in the Target Unit.",
  },
  {
    nom: "Damned",
    texte:
      "Some cultists are so devoted to the Ruinous Powers that they regard even the most monstrously Warp-corrupted among their number as blessed paragons whom they must guide along the righteous path. A Model with this Special Rule may join Units with the Malefic Sub-type as if it had that Sub-type; while it is part of such a Unit, it is treated as having that Sub-type.",
  },
  {
    nom: "Diabolism Discipline",
    texte:
      "At the beginning of the Horus Heresy, the Word Bearers were like children exulting in a new toy, wielding the power of the Warp without restraint and with little awareness of the true price it would demand of them. A Model with the Diabolism Discipline gains the Fear (1) Special Rule, the Hellfire Psychic Weapon, the Dark Channeling Psychic Power, and the \"Diabolist\" Trait.",
  },
  {
    nom: "Dark Channeling",
    texte:
      "Psychic Power (Blessing): drawing upon the tormented depths of the Warp, the Diabolist bestows malefic blessings upon the Legionaries of the XVII, feeding them with dark energy while making them ever more monstrous in the eyes of their enemies. The Active Player may choose to Manifest it at the start of the Fight Sub-Phase of their Assault Phase; the Focus must be a Model with the Diabolist Trait under their control, and the Target Unit must be a Unit belonging to the Reactive Player with at least one Model within 12\" of and in Line of Sight of the Focus, composed entirely of Models with the Word Bearers Trait. If the Manifestation is successful, all Models in the Target Unit gain the Aflame (1) and Feel No Pain (6+) Special Rules until the end of the Assault Phase.",
  },
  /* --- Discipline Anathemata (Ésotériste, Lorgar, Erebus, option
     Tradition Ardente des Word Bearers — p. 35) : voir js/unites-data.js,
     et l'Arme Psychique Dards du Néant dans js/armes-data.js. --- */
  {
    nom: "Anathemata Discipline",
    texte:
      "Some Esoterists study the Warp for the sole purpose of discovering the weaknesses of the entities that lurk within it. Others see them as highly convenient tools for securing victory, devoid of loyalty or intentions of their own. A Model with the Anathemata Discipline gains the Fear (1) Special Rule, the Void Darts Psychic Weapon and the \"Anathemata\" Trait; if it has the Loyalist Trait, it may use the Seal the Veil Psychic Reaction, and if it has the Traitor Trait, the Tear the Veil Psychic Power.",
  },
  {
    nom: "Anathemata",
    texte:
      "Trait granted by the Anathemata Discipline: serves as the Focus for the Tear the Veil Psychic Power and the Seal the Veil Psychic Reaction.",
  },
  {
    nom: "Tear the Veil",
    texte:
      "Psychic Power (Blessing) of the Anathemata Discipline, restricted to Models with the Traitor Trait: bending the entities of the Warp to their will, the Esoterist tears the fabric of reality to draw their extra-dimensional allies onto the battlefield. The Active Player may Manifest it at the start of the Reserves Sub-Phase of their Movement Phase; the Focus must be a Model with the Anathemata Trait under their control, and this Power has no Target. Make a Manifestation Check: if it is successful, the Active Player may choose a Unit from a Daemonic Manifestation Detachment in the same Army as the Focus that is in Reserves — its Reserves Rolls are automatically successful until the end of that Reserves Sub-Phase.",
  },
  {
    nom: "Seal the Veil",
    texte:
      "Psychic Reaction (Curse) of the Anathemata Discipline, restricted to Models with the Loyalist Trait: many Esoterists have learned to seal the cracks in reality and drive back the foul creatures that pour forth from the Warp. The Reactive Player may declare it at the start of Step 3 of the Charge Procedure, during a Charge declared by the Active Player for a Unit that includes at least one Model with the Malefic Sub-type (Cost: 1 Reaction Allotment, paid on declaration). The Focus must be a Model with the Anathemata Trait, under the Reactive Player's control and part of the Unit targeted by the Charge; the Target is the Charging Unit. Make a Resistance Check: if it is successful, the Target Unit cannot make a Set-up Move of more than 1\", and when making its Charge Roll (Step 5 of the Charge Procedure), the dice with the highest result is discarded instead of the lowest. Effects are resolved immediately.",
  },
  {
    // Lorgar, Primarque des Word Bearers (XVIIe Légion) : voir
    // js/unites-data.js.
    nom: "The Power of the Word",
    texte:
      "Lorgar liked to surround himself with his most fervent sons, favouring those who had devoted themselves body and soul to the powers of the Warp. A Model with this Special Rule may join Units with the Malefic Sub-type as if it had that Sub-type, and while it is part of such a Unit, it is treated as having that Sub-type.",
  },
  {
    // Lorgar, Primarque des Word Bearers (XVIIe Légion) : voir
    // js/unites-data.js. Condition de la Case Principale câblée dans
    // REGLES_SIRE_TROUPES, js/organigramme.js ; le bonus de Test de
    // Commandement automatique jusqu'à la fin du premier Tour de
    // Bataille, effet de pur combat sans incidence sur la
    // construction de liste, n'est pas modélisé.
    nom: "Sire of the Word Bearers",
    texte:
      "Leading the prayer, Lorgar exhorts his sons to ever grander acts of devotion. Forgetting their mortal concerns, the bearers of the word march into the enemy's guns, convinced of the righteousness of their cause. If a Model with this Special Rule is part of an Army, the Controlling Player may apply the following additional Special Rules to all Primary, Auxiliary and Apex Detachments that have the same Faction Trait as the Model with this Special Rule: if at least four Troops Battlefield Role Slots in that Army's Primary Detachment are filled by Purge Squad and/or Tactical Squad Units, all Troops Battlefield Role Force Organisation Slots in the Primary Detachment are considered to be Prime Slots. In addition, if a Model with this Special Rule is part of an Army, all Models in the same Army that have the Word Bearers Trait gain the following Special Rule: until the end of the first Battle Turn, each time the Controlling Player of a Model with this Special Rule is called upon to make a Leadership Check for a Unit composed only of Models that have the Word Bearers Trait, that Leadership Check is automatically passed.",
  },
  {
    nom: "Auxiliary Transport Bays",
    texte:
      "Thunderhawk Transporters are fitted with flexible frames, able to rapidly deliver various Legiones Astartes vehicles to battle, while also assisting in their recovery and that of other heavy materiel. A Thunderhawk Transporter can carry certain Models with the Vehicle Type in addition to Infantry. In addition to any other Models Embarked on a Model with this Special Rule, it may also have one of the following Embarked on it: up to two Rhino Models, or one Land Raider Carrier or Land Raider Explorator Model.",
  },
  {
    nom: "Invocation of the Razing Tempest",
    texte:
      "The Karaoghlanlar were often accompanied into battle by a Stormseer, who ritually marked their armour before battle so that their spirits would not be sullied by the deeds they had to perform. This attunement also allowed Stormseers to reach them through thought, coming to their aid more easily even amid the tumult of battle. A Unit that includes a Model with this Special Rule may be selected as the Target of the Call of the Wind Psychic Power of the Call of the Storm Discipline as long as it has at least one Model within 24\" of the Focus instead of 12\", and even if none of its Models has Line of Sight to the Focus.",
  },
  {
    nom: "Shadows of Judgement",
    texte:
      "While the members of the Ofanim were accomplished swordsmen, it was in Challenges that their true talent was revealed. While a Model with this Special Rule is engaged in a Challenge, it gains the Duellist's Edge (1) and Feel No Pain (5+) Special Rules.",
  },
  {
    nom: "Bearers of the Blood Hand",
    texte:
      "Those who bore the mark of the bloody hand strove to embody the fury and bloodlust that had earned them this honour, until the moment they fell on the battlefield, surrounded by the mangled bodies of their foes. Grants a bonus to Combat Resolution: when resolving a Combat in the Resolution Sub-Phase of the Assault Phase, 1 Combat Resolution Point is scored for each Unit involved in that Combat that includes a Model with this Special Rule.",
  },
  {
    nom: "Flesh Harvester",
    texte:
      "The Procurators scoured the battlefield in search of organic components, harvested from the dead, to fuel profane rituals; organs won in single combat held a particular power, drawing the attention of the most powerful and aggressive creatures of the Warp. A Model with this Special Rule may gain Flesh Harvest Points: it gains 1 each time a Unit that includes it is selected to Consolidate, if enemy Models in that Combat had the Infantry or Cavalry Type (2 instead if a Model with the Paragon Type was Removed as a Casualty during that Combat). If a Model with Flesh Harvest Points is Removed as a Casualty, it loses all of its Flesh Harvest Points. During the Determine Victor Step, at the end of the Battle, the Controlling Player of any Models with this Special Rule scores a number of Victory Points equal to the number of Flesh Harvest Points held by one of those Models, chosen by them.",
  },

  /* --- Arsenal des Ordinatus et Automata du Mechanicum (Liber
     Mechanicum, Legacies) : Cohorte de Défense Servo-esclave, Manipule
     de Combat Arlatax, Batterie Tarantula, Macrocarid Explorator,
     Ordinatus Ulator/Sagittar/Aktaeus (voir js/unites-data.js). --- */
  {
    nom: "Tech-thralls",
    texte:
      "Although equipped with different armament, the thralls that make up Defence Cohorts share the same simple servo-automata bodies as the more common formations. A Unit that includes Models with this Special Rule is considered to be a Tech-thrall Cohort Unit for the purposes of the An Endless Servitude Arcana Benefit (see Liber Mechanicum, page 47).",
  },
  {
    nom: "Anbaric Claw",
    texte:
      "This defensive system is regarded as archaic and temperamental by most Tech-priests, but remains in use on older vehicles — such as the Macrocarid. It uses a bank of electrochemical capacitors to generate a powerful electromagnetic shock pulse across the vehicle's hull. A Vehicle with this Special Rule inflicts more Damage when it moves through enemy Units. When a Model with this Special Rule and the Vehicle Type moves through an enemy Unit, the number of Hits inflicted is increased from D6 to D3+3. These Hits have the Stun (1) Special Rule. In addition, if the Reactive Player declares a Death or Glory Reaction targeting a Model with this Special Rule, that Model gains a 6+ Invulnerable Save against all Hits inflicted by that Reaction.",
  },
  {
    nom: "Independent Sentries",
    texte:
      "Tarantula sentry guns are deployed at key points on the battlefield, chosen to cover crucial chokepoints and provide optimal firepower complementing other units. Tarantulas deploy and operate individually. Although included in an army as a Unit of several Models, each Model with this Special Rule is treated as a separate Unit for all purposes, including Deployment and the counting of Victory Points.",
  },
  {
    nom: "Automated Fire Protocols",
    texte:
      "Tarantula sentry guns provide area denial fire, engaging enemies that enter their detection perimeter with their powerful heavy armament. A Model with this Special Rule may only make Shooting Attacks as part of a Reaction. A Model with this Special Rule cannot be selected to make a Shooting Attack in the Controlling Player's Shooting Phase, and may only make the Return Fire Reaction and the Intercept and Automated Fire Advanced Reactions. When making a Shooting Attack as part of one of these Advanced Reactions, a Model with this Special Rule may attack with any of its Weapons, not only its Defensive Weapons. Automated Fire Advanced Reaction: the Reactive Player may declare it in Step 2 of the Move Sub-Phase if an enemy Unit ends a Move within 48\" of a Unit under their control composed entirely of Models with the Automated Fire Protocols Special Rule (Cost: none; Target: the Unit whose Move triggers the Reaction — the Reactive Player must choose as the Reacting Unit a Unit under their control, composed entirely of Models with the Automated Fire Protocols Special Rule, within 48\" of the Target Unit). Once this Advanced Reaction has been declared, the Reactive Player makes a Shooting Attack with the Reacting Unit, which must target the Target Unit of this Reaction. Once this Shooting Attack has been fully resolved, including removing Casualties, the Active Player finishes resolving the remaining elements of the Target Unit's Move.",
  },
  {
    nom: "Dispersal Field",
    texte:
      "A Model with this Special Rule may benefit from the Dispersion Advanced Reaction: the Reactive Player may declare it each time a Model with the Dispersal Field Special Rule is the Target of a Shooting Attack, the declaration being made after Step 3 of the Shooting Attack, once the Weapons to be used have been declared (Cost: 1 Reaction Allotment, paid on declaration; Target: the Reacting Unit is the Unit suffering the Shooting Attack, the Attacking Unit is the one making the Shooting Attack that triggered this Reaction). Once the Dispersion Reaction has been declared, the Active Player must resolve all remaining steps of the Shooting Attack Procedure as normal up to the start of Step 5. In that Step 5, the Controlling Player of the Reacting Unit may choose to reduce the Damage of all Hits in one Fire Group to 1. If they choose not to reduce the Damage of the Hits in the selected Fire Group, the Shooting Attack continues as normal, but the Reactive Player may make the same choice again for each subsequent Fire Group in that Shooting Attack. Once the Reactive Player has chosen to reduce the Damage of a single Fire Group, they cannot affect any subsequent Fire Group, and the Shooting Attack is resolved as normal.",
  },
  {
    nom: "Macro-drill Transport Bay",
    texte:
      "A Model with this Special Rule and the Transport Sub-type may have Models Embarked on it as per the normal Rules — however, Models of any Type other than Vehicle may Embark on it, and more than one Unit may be Embarked on it at the same time. Only 4 Models that have neither the Paragon Type nor the Infantry Type may be Embarked on it, and Models with a variant of the Bulky (X) Special Rule with a value of X greater than 6, or a Base Wounds Characteristic of 10 or more, cannot Embark on it at all. In addition, Models may only Embark on or Disembark from a Model with this Special Rule if it has not yet made an attack with its seismic macro-drill. Once an attack has been made with this Weapon, no more Models may Embark on or Disembark from this Model. If the seismic macro-drill of a Model with this Special Rule is destroyed or otherwise rendered inoperable, all Models Embarked on the Model suffer a Hit at Strength 8, AP3, Damage 4. Any Model not Removed as a Casualty must then make an Emergency Disembarkation.",
  },
  {
    nom: "Seismic Macro-drill",
    texte:
      "When a Weapon with this Special Rule makes a Shooting Attack, the attacking Player may choose to target any point on the battlefield within range, ignoring Line of Sight and without needing to target an enemy Model. The Hit Test is made as normal, but once the final position of the Template has been determined, the Attacking Player resolves no Hits, whether or not any Models are under the Template, and must instead choose one of the following two options: Emerge or Tunnel. If they choose to Tunnel, the Template remains in place, but no Hits are resolved and the Template has no effect on Line of Sight, Movement or any other aspect of the game — it simply marks the position of the macro-drill, buried deep underground. At the start of the Controlling Player's next Shooting Phase, they must again choose to Tunnel or Emerge. If they choose to Tunnel again, the Template may then be moved up to 36\" in any direction, and again remains in place until the Controlling Player's next Shooting Phase. Emerge may only be chosen if no part of the Template is touching Impassable Terrain. Once this choice has been made, all enemy Models wholly or partially covered by the Template suffer a wound with an AP of 2 and a Damage of 1, and all enemy Models not covered by the Template but within 2\" of any point on its edge suffer a Hit at Strength 6 with an AP of 4 and a Damage of 1. If a Unit suffers one or more Casualties as a result of either of these effects, a Cool Check must be made for that Unit; if it is failed, all Models in that Unit gain the Stunned Status. Once all Hits and wounds have been fully resolved, enemy Models wholly or partially covered by the Template are moved by their Controlling Player the shortest possible distance so that they are no longer covered by the Template. The Controlling Player of the seismic macro-drill may then choose to Disembark some or all of the Units Embarked on the seismic macro-drill, using any point of the Template as an Access Point. Models disembarked in this way may be placed on the Template. The Template then remains in place, and any Model still Embarked on the seismic macro-drill may Disembark from it in a later Movement Phase as usual, but may not Embark on it again. The Template remains in place until all Models have Disembarked from the seismic macro-drill; it does not block Line of Sight, does not impede Movement, and is not considered to be any type of Terrain. Although it is a Strategic Weapon, a Weapon with this Special Rule cannot be used to target Strategic Objectives.",
  },

  /* --- Arsenal des Solar Auxilia (Legacies, Liber Auxilia) : Surgeon-
     Primus Aevos Jovan, Expeditionary Navigator, Davinite Lodge
     Priest, Companion Section, Medicae Section, Cyclops Demolition
     Vehicle (voir js/unites-data.js). Médecin (X) est un Addenda aux
     Règles (Rules Addenda) du livre de base, pas propre aux Solar
     Auxilia : transcrit ici car aucune des Unités qui l'utilisaient
     jusqu'ici (le cas échéant) ne l'avait encore rendu nécessaire. --- */
  {
    nom: "Medic (X)",
    texte:
      "Some specialists train in battlefield medicine and carry dedicated equipment, from a simple satchel of dressings and painkillers to the complex devices borne by Legion Apothecaries. If they manage to reach a wounded warrior in time, such fighters can return them to the fight. This Special Rule sets the difficulty of any Recovery Test granted by another Special Rule, Reaction or Ability — it does not allow a Recovery Test by itself, it only sets the Target Number when another source (for example the Medic! Advanced Reaction) allows one. A Recovery Test is made when one or more Unsaved Wounds are allocated to a Model: roll a dice and compare it to the value of X; if successful, a single Unsaved Wound allocated to the Model has its Damage reduced by 1 (to a minimum of 0). Medic! Advanced Reaction: the Reactive Player may declare it in Step 9 of any Shooting Attack if the Target Unit of that Shooting Attack includes one or more Models with the Medic (X) Special Rule (Cost: 1 Reaction Allotment, paid on declaration; Target: the Target Unit of the Shooting Attack that triggers the Reaction). Once this Advanced Reaction has been declared, the Active Player continues to resolve that Shooting Attack as normal; in Step 11, the Reactive Player may make a Recovery Test for each Model in the Target Unit that is allocated an Unsaved Wound — no more than one Recovery Test per Model, and none for a Model that itself has the Medic (X) Special Rule.",
  },
  {
    nom: "Surgical Suite",
    texte:
      "Only Aevos Jovan truly understands the auto-gurney that accompanies him (or has the skill to use it): it is equipped with servo-scalpels and medical augury scanners that allow complex surgery to be performed on the battlefield by a small team. A Model with this Special Rule allows Recovery Tests to be made in the Morale Sub-Phase, but is automatically Removed as a Casualty if it becomes the only Model remaining in a Unit. If a Unit that includes a Model with the Surgical Suite Special Rule is not Locked in Combat, before its Controlling Player makes a Characteristic Check for that Unit in the Morale Sub-Phase, they may make a Recovery Test for that Unit. If that Recovery Test is successful, that Player may subtract 2 from the result of the Characteristic Check. Only one Recovery Test may be made in this way for each Unit in each Morale Sub-Phase. In addition, if a Model with this Special Rule becomes the only Model remaining in a Unit, it is immediately Removed as a Casualty.",
  },
  {
    nom: "Triage",
    texte:
      "While the medical orderlies who accompany Aevos Jovan do not share his peerless medical talent, they are trained to stabilise the wounded on the battlefield so that they may see future battles. Models with this Special Rule can grant a variant of the Expendable (X) Special Rule to Solar Auxilia Units. While a Unit composed entirely of Models with the Solar Auxilia Trait includes one or more Models with this Special Rule, each Model in that Unit has the Expendable (X) Special Rule, where X is equal to the number of Models with the Triage Special Rule in the Unit.",
  },
  {
    nom: "Compact",
    texte:
      "Some machines are designed to be easily carried aboard the various armoured carriers available to the Imperium — some are flexible enough to pass through hatches intended for smaller creatures, others are designed to fold into a compact transport mode, or are simply small in size. A Model with this Special Rule may Embark on or Disembark from a Transport even if its Type would normally prevent it. A Model with this Special Rule may Embark on and Disembark from a Model with the Transport Sub-type as if it had the Infantry Type. This does not replace its existing Type nor grant it any other benefit of the Infantry Type, and does not allow it to interact with other Rules or Special Rules that target or affect the Infantry Type.",
  },
  {
    nom: "Demolition Vehicle",
    texte:
      "These vehicles are not intended for front-line combat, but serve as demolition tools to bring down buildings or fortifications that would hinder the advance of friendly forces; in the most extreme situations they can be employed as weapons, but remain vulnerable to enemy fire. Vehicles with this Special Rule may make Charges and inflict automatic Hits on every Model in a Combat if successful. A Model with this Special Rule and the Vehicle Type may have a Charge declared for it in the Assault Phase. If a Charge Roll made for this Model fails, it is Removed as a Casualty, but immediately explodes as described by its Explodes (X) Special Rule. If the Charge Roll succeeds, then at the end of Step 2 of the Fight Sub-Phase, each Unit in that Combat suffers a number of automatic Hits equal to the number of Models in that Unit, each at Strength 8, AP \"-\", Damage 2, with the Armourbane Special Rule. Once these Hits have been fully resolved, the Model with this Special Rule is immediately Removed as a Casualty, and any variant of the Explodes (X) Special Rule it has is ignored.",
  },
  {
    nom: "Ætherlabe staff",
    texte:
      "The Ætherlabe mounted on the Navigator's staff helps them chart the currents of the Immaterium, detecting the aetheric shockwave of any Warp-born approach. Units cannot Deep Strike near a Model equipped with an Ætherlabe staff: no Model may be placed within 8\" of a Model equipped with an Ætherlabe staff as part of the Deep Strike Special Rule.",
  },
  {
    nom: "Navigator's Arts",
    texte:
      "The powers of a Navigator are among the mightiest of all the Psyker castes, though they are rarely overtly offensive in nature. When pushed to the brink, however, Navigators are capable of channelling the tides of the Empyrean and turning them against their enemies. A Model with this Special Rule has a specific Psychic Discipline: it has the Navis Astrologis Psychic Discipline, which grants it the Lidless Stare Psychic Weapon and the \"Navis Astrologian\" Trait.",
  },
  {
    nom: "Medicae Support",
    texte:
      "The Solar Auxilia maintain cadres of trained medicae, assigned to the Units that will stand closest to the fighting. Though lacking the advanced equipment of Legion Apothecaries, these healers are no less devoted to the protection of their brothers-in-arms, even in the deadliest exchanges of fire. Auxilia medicae deploy and operate individually. Although included in an Army as a Unit of several Models, each Model with this Special Rule is treated as a separate Unit for all purposes, including Deployment and the counting of Victory Points.",
  },
  {
    nom: "Ritual Healing",
    texte:
      "The sorcerous healing techniques of the Davinite lodges are held in deep suspicion, for it is whispered that they may have played a part in Horus' turn to treachery. A Model with this Special Rule has the Resurrection Psychic Reaction, from the Thaumaturgy Psychic Discipline.",
  },

  /* --- Arsenal des État-majors génériques Legiones Astartes (Legacies,
     toutes Légions) : Seigneur de Forge, Primus Medicae, Delegatus,
     Mortificator, Fauteur de Guerre (voir js/unites-data.js et le
     commentaire de iron-father-armure-artificer, qui documentait déjà
     leur absence). --- */
  {
    nom: "Legiones Thallaxes",
    texte:
      "The most senior of their kind, Forge Lords oversee the accords binding their Legion to the various factions of the Mechanicum, including the sinister magi of the Ordo Reductor. Many therefore go to war accompanied by a cohort of Thallax cyborgs bearing the Legion's heraldry, charged with overseeing these troops, whether they are the fruit of a simple exchange or a token of respect bequeathed at the end of a joint campaign. This Special Rule allows Thallax Units to be selected within a Detachment that includes a Forge Lord. When a Model with this Special Rule is included in a Detachment, two additional Force Organisation Slots are added to that Detachment. These Slots may only be filled by Thallax Cohort Units chosen from the Liber Mechanicum (not transcribed on this site). When such a Unit is included in this way, the Reductor Trait of all of its Models is replaced by \"Bound Reductor\", and the Aegis of Suffering Special Rule is removed from them. These Units may be included even if they do not have the same Faction Trait as the other Units in that Detachment.",
  },
  {
    nom: "Ætheric juncture splicer",
    texte:
      "These portable relics dating from the Age of Strife allow a small group of warriors to teleport without a full teleportarium or the targeting equipment and protective fields normally required for such a perilous manoeuvre. They are, however, notorious for their tendency to malfunction if the slightest error is made in their calibration: hence only the most reckless or vainglorious commanders sanction their use in battle. A Model equipped with an aetheric junction splicer has the Deep Strike Special Rule. While such a Model has joined, in Reserves, a Unit that includes only Models with the [Legiones Astartes] Trait, the Infantry Type and no variant of the Bulky (X) Special Rule where X is greater than 2, all Models in that Unit also gain the Deep Strike Special Rule. In addition, when a Unit that includes one or more Models equipped with an aetheric junction splicer suffers one or more Unsaved Wounds as a result of the Intercept Advanced Reaction, that Unit immediately gains the Suppressed Tactical Status.",
  },
  {
    nom: "Dreadnought Talon",
    texte:
      "When a Mortificator or Mortificator in Terminator Armour Unit is selected to fill a Command Force Organisation Slot, the Controlling Player may choose to add a Dreadnought Talon Auxiliary Detachment to the Army instead of the options normally available in the Crusade Force Organisation Chart. The War-engines Slots of this Detachment may only be used to select Contemptor Dreadnought Units.",
  },

  /* --- Arsenal des Conclaves Skitarii. --- */
  {
    nom: "Zealous Followers",
    texte:
      "Gleaners may make their Characteristic Checks using the Characteristics of nearby Skitarii Units. When making a Characteristic Check Roll for a Unit composed of Models with this Special Rule, it may be made using the Base Characteristic of any friendly Model that has the [Skitarii] Trait, is not subject to the Routed Tactical Status, and is part of a Unit with at least one Model within 6\" of and in Line of Sight of a Model in the Unit for which the Characteristic Check is being made. Note that Modifiers that apply to the Unit for which the Characteristic Check is being made, for example by virtue of the Pinning (X) Special Rule, apply to the Characteristic of the Skitarii Model being used for the Check.",
  },
  {
    nom: "Acquisitor",
    texte:
      "All Models that have the Acquisitor Trait (except Models with the Vehicle Type) gain the Line (1) Special Rule.",
  },
  {
    nom: "Expurgator",
    texte:
      "All Models that have the Expurgator Trait (except Models with the Vehicle Type) gain the Vanguard (3) Special Rule.",
  },
  {
    nom: "Vindicator",
    texte:
      "All Models that have the Vindicator Trait (except Models with the Vehicle Type) increase by +1 the value of any variant of the Deflagrate (X) Special Rule that they or their Weapons have. Restricted to Armies with the Loyalist Allegiance.",
  },
  {
    nom: "Flagellator",
    texte:
      "All Models that have the Flagellator Trait (except Models with the Vehicle Type) must add +1\" to their Set-up Moves, to a maximum of 6\". Restricted to Armies with the Traitor Allegiance.",
  },
  {
    nom: "Chosen Marshal",
    texte:
      "Skitarii Conclave Advanced Reaction that allows a fallen marshal to be replaced in an emergency. The Reactive Player, controlling Units composed only of Models that have the Skitarii Trait, may declare it once per Battle when a friendly Skitarii Combat Peregrine Marshal Model is reduced to 0 Wounds (cost: 1 Reaction Allotment, paid on declaration); the Target Unit is always a friendly Unit that has the [Skitarii] Trait and includes at least one Ordinator Model. In the End Phase of the Turn in which the Reaction was declared, the Reactive Player chooses an Ordinator Model in the Target Unit: it gains the Command Sub-type, increases its Base Weapon Skill, Attacks and Leadership Characteristics by +1, and the Controlling Player may choose one of its Melee Weapons to gain the Icon of Authority Special Rule.",
  },

  /* --- Legacies of the Age of Darkness : The Legiones Inductii (p.
     1-22, toutes Légions sauf II et XI) : Escouade Inductii, voir
     js/unites-data.js. « Prime Advantage »/« Prime Force Organisation
     Slot » (mécanique du livre de règles) n'ont pas de traduction déjà
     établie ici : rendues par « Avantage Principal »/« Case
     d'Organigramme de Force Suprême » (demande explicite du proprio de
     réutiliser « Avantage Principal », malgré l'homonymie avec les
     Avantages Principaux des Cases Principales déjà modélisés sur ce
     site — voir CLAUDE.md), purement informatif puisque non modélisé
     ici. --- */
  {
    nom: "Inductii",
    texte:
      "A Unit that includes at least one Model with this Special Rule can never be used to choose a Prime Advantage. When a Unit that includes at least one Model with this Special Rule is selected to fill a Supreme Force Organisation Slot, no corresponding Prime Advantage may be chosen.",
  },
  {
    // Escouade Inductii (World Eaters) : voir js/unites-data.js.
    nom: "Ravening Madmen",
    texte:
      "A Unit that includes Models with this Special Rule may only join, or be joined by, Models with this Special Rule.",
  },
  {
    nom: "Perfection Embodied",
    texte:
      "When making a Check to avoid gaining a Tactical Status for a Unit that includes at least one Model with this Special Rule, the Controlling Player must roll an additional dice, discarding the dice with the highest result if the Check is made in the Morale Sub-Phase, or the dice with the lowest result if the Check is made in the Resolution Sub-Phase.",
  },
  {
    nom: "Proof of Valour",
    texte:
      "For any Strike Group whose attacking Combatants have a current Weapon Skill Characteristic of 5, the Target Number of any Hit Test resulting from that Strike Group is always 4+ if the Target Unit of that Strike Group is composed entirely of Models with this Special Rule.",
  },
  {
    nom: "Headstrong",
    texte:
      "A Model with this Special Rule may have a Charge declared for it in the same Turn in which it made a Rush Move, but if the Charge Roll for that Charge fails, it immediately gains the Stunned and Pinned Tactical Statuses. A Unit composed entirely of Models with this Special Rule may have a Charge declared for it in the same Player Turn in which it made a Rush Move, but if the Charge Roll for that Charge fails, all Models in that Unit immediately gain the Stunned and Pinned Tactical Statuses.",
  },
  {
    nom: "Supporting Fire",
    texte:
      "In the Controlling Player's Shooting Phase, Shooting Attacks made by Models with this Special Rule that are part of a Unit that remained Stationary in the Controlling Player's previous Movement Phase gain the Pinning (0) Special Rule.",
  },
  {
    nom: "Unscrupulous Murderers",
    texte:
      "This Special Rule allows a unique Aftermath option to be chosen, giving each Model that has it a chance to inflict a Precision Hit. A Unit that includes at least one Model with this Special Rule may have The Art of Murder Aftermath option chosen for it in Step 4 of the Resolution Sub-Phase of the Assault Phase, for any Combat that Unit won or drew. The Art of Murder: the Controlling Player rolls a dice for each Model in that Unit with the Unscrupulous Murderers Special Rule. For each unmodified result of \"6\", the Controlling Player may allocate a single Wound, with an AP of \"–\" and a Damage of 1, resolved immediately, to an enemy Model of their choice from among those in the selected Combat whose Unit had the Hold, Disengage or Fall Back Aftermath option chosen.",
  },
  {
    nom: "Eaters of the Dead",
    texte:
      "A Unit that includes at least one Model with this Special Rule may have a unique Aftermath option chosen for it that forces any enemy Unit with at least one Model within 8\" to take a Panic Check. In Step 4 of the Resolution Sub-Phase, the Player who won the Combat must choose this Aftermath option for any Unit in that Combat composed entirely of Models with this Special Rule; a Unit only partially composed of such Models may instead make a Cool Check, choosing another Aftermath option if it is passed. The Thirst: a Leadership Check is immediately made for each enemy Unit that is not involved in the Combat and has at least one Model within 8\" of one or more Models in this Unit. If that Check is failed, all Models in that enemy Unit gain the Routed Tactical Status. This Aftermath option is resolved after all other Aftermath options in that Combat.",
  },
  {
    nom: "Forbidden Augmentations",
    texte:
      "The Medic! Advanced Reaction may be declared for a Unit composed entirely of Models with this Special Rule, even if none of them has the Medic (X) Special Rule: it is treated as having one for the purposes of the declaration. If a Unit composed entirely of Models with this Special Rule is the Target Unit of a Medic! Advanced Reaction, all Recovery Tests made as part of that Reaction have a Target Number of 5+.",
  },
  {
    nom: "Certainty and Resolve",
    texte:
      "A Model with this Special Rule is never Removed as a Casualty when it Falls Back to a Battlefield Edge, and is more likely to lose the Routed Tactical Status in the End Phase. When one or more Models in a Unit composed entirely of Models with this Special Rule come into contact with a Battlefield Edge of the Controlling Player's Deployment Zone as part of a Fall Back Move, that Unit immediately loses the Routed Tactical Status and gains the Suppressed Tactical Status. In addition, when a Leadership Check is made in the Statuses Sub-Phase of the End Phase to remove the Routed Tactical Status from a Unit composed entirely of Models with this Special Rule, the Controlling Player may roll an additional dice, discarding the dice with the highest result.",
  },
  {
    nom: "Barbaran Resilience",
    texte:
      "A Unit that includes at least one Model with this Special Rule never gains the Routed Tactical Status for suffering 25% or more Casualties in the Shooting Phase. A Unit that includes at least one Model with this Special Rule never has to make a Leadership Check in the Morale Sub-Phase to avoid gaining the Routed Tactical Status as a result of a number of Models from that Unit being Removed as Casualties by a single Shooting Attack.",
  },
  {
    nom: "Unattuned Practitioners",
    texte:
      "Thousand Sons Inductii Models have a fixed Prosperine Arcana. A Unit that includes Models with this Special Rule cannot have a Prosperine Arcana chosen for it: instead it has the Unattuned Prosperine Arcana, which follows all the rules for Prosperine Arcana. All Models in a Unit with the Unattuned Prosperine Arcana gain the Ætheric Guidance Psychic Power and the \"Unattuned\" Trait. Ætheric Guidance (Psychic Power, Blessing) improves the Unit's Shooting Attacks: the Active Player may Manifest it in the Shooting Phase, at the start of Step 4 of a Shooting Attack made by a Unit under their control including at least one Model with the Unattuned Trait. The Focus must be a Model with the Unattuned Trait in the shooting Unit; the Target is that same Unit, composed entirely of Models with the Thousand Sons Trait. If successful, its effects last until the end of the current Shooting Attack: all Ranged Weapons the Models in the Target Unit are equipped with, except those with the Blast (X) Special Rule, gain the Breaching (6+) Special Rule.",
  },
  {
    nom: "Creed of Brutality",
    texte:
      "If a Unit that includes at least one Model with this Special Rule passes a Leadership Check in the Start Phase, it gains the Impact (S) Special Rule until the end of the Battle Turn. In the Effects Sub-Phase of their Start Phase, the Controlling Player of a Unit that includes at least one Model with this Special Rule may make a Leadership Check for that Unit; if a Model in the Unit is within 6\" of a friendly Model with the Sons of Horus Trait and a Weapon Skill Characteristic of 5 or more, that friendly Model's Leadership may be used for this Check. If the Check is passed, all Models in the Unit gain the Impact (S) Special Rule until the end of that Battle Turn. If it is failed, all Models in the Unit immediately gain the Stunned Tactical Status.",
  },
  {
    nom: "Empty Vessels",
    texte:
      "A Unit that includes at least one Model with this Special Rule gains the Malefic Sub-type and the Feel No Pain (6+) Special Rule as soon as it scores Victory Points by virtue of the Vanguard (X) Special Rule, after suffering D3 Wounds. A Unit that includes Models with this Special Rule can never be joined by a Model that does not have it. In addition, the first time in a Battle that a Unit including Models with this Special Rule scores Victory Points by virtue of the Vanguard (X) Special Rule, that Unit immediately suffers D3 automatic Wounds with an AP of 2 and a Damage of 1, against which no Saves may be made. Once these Wounds have been resolved, all Models in that Unit immediately gain the Malefic Sub-type and the Feel No Pain (6+) Special Rule for the rest of the Battle.",
  },
  {
    nom: "Wargear of Heroes",
    texte:
      "Models with this Special Rule that inflict at least one Unsaved Wound grant a bonus to the Combat Result. When resolving a Combat in the Resolution Sub-Phase of the Assault Phase, the Controlling Player of any Model with this Special Rule that inflicted at least one Unsaved Wound in that Combat in the same Turn scores 1 additional Combat Resolution Point.",
  },
  {
    nom: "Unchained Conviction",
    texte:
      "A Model with this Special Rule that would gain the Pinned Tactical Status instead makes an immediate Fall Back Move. As soon as Models in a Unit composed entirely of Models with this Special Rule gain the Pinned Tactical Status, that Unit must immediately make a Fall Back Move. Once this Move has been resolved, all Models in that Unit lose the Pinned Tactical Status.",
  },
  {
    nom: "Treacherous Lure",
    texte:
      "A Unit composed entirely of Models with this Special Rule cannot be targeted by a Shooting Attack in the first Battle Turn. A Unit composed entirely of Models with this Special Rule cannot be chosen as the Target Unit of a Shooting Attack in the first Battle Turn. This Special Rule has no effect on Volley Attacks or on Shooting Attacks made as part of a Reaction.",
  },

  /* --- Legio Custodes (livre d'armée officiel, GW 2026) : Tactica de
     Legio, Postures de Défi et Réaction Avancée propres au Trait
     Legio Custodes, plus les deux boucliers Praesidium. Non injectées
     automatiquement dans les `regles` des Unités (aucun mécanisme de
     rattachement Trait → Règle Spéciale automatique n'existe pour ce
     Trait, à la différence de `reglesAppliquees` qui ne vise que les
     Avantages Principaux) : entrées de glossaire de référence
     uniquement, gap documenté dans CLAUDE.md. --- */
  {
    nom: "Only in Death",
    texte:
      "Legio Tactica: all Models that have the Legio Custodes Trait, except Models with the Vehicle Type, are subject to this Special Rule. In Combat, Units composed only of Models with this Special Rule are Stunned instead of Routed, and can neither Fall Back nor Disengage from a Combat. When a Model with this Special Rule would gain the Routed Tactical Status in the Make Panic Checks step of the Resolution Sub-Phase of the Assault Phase, it instead gains the Stunned Tactical Status, unless there is at least one Model without this Special Rule in the same Unit. In addition, a Unit composed only of Models with this Special Rule can never choose to Disengage or Fall Back from among the Aftermath options, unless it is also composed only of Models with the Antigrav Sub-type, in which case it still has the option to Disengage.",
  },
  {
    nom: "Master of the Golden Legion",
    texte:
      "If a Model with this Special Rule is part of an Army, all Models in the same Army that have the Legio Custodes Trait (except Models of the Vehicle Type) have the Fear (1) Special Rule until the end of the first Battle Turn. In addition, once per Turn, when the Controlling Player makes a Reserves Roll for a Unit composed only of Models that have the Legio Custodes Trait and the Deep Strike Special Rule, before making the Reserves Roll, that Player may modify it by +1. If they apply this modifier, they must deploy that Unit using the Deep Strike Special Rule.",
  },
  {
    nom: "The Blade Divides",
    texte:
      "Legio Custodes Advanced Reaction that splits a Reacting Unit into two separate Units. Once per Battle, the Reactive Player may declare it during Step 2 of the Move Sub-Phase process if an enemy Unit ends a move within 12\" and in Line of Sight of a Unit they control (cost: 1 Reaction Allotment). The Reacting Unit must be within 12\" and in Line of Sight of the Target Unit, be composed only of Models that have both the Legio Custodes AND The Sodality Traits, and include at least six Models. Once the Target Unit's move has been resolved, the Reactive Player must move at least three Models of the Reacting Unit a number of inches equal to each Model's Initiative Characteristic, so that they are no longer in Unit Coherency with the rest of the Reacting Unit but remain in Unit Coherency with each other; at least three Models of the Reacting Unit must remain that have not moved and that stay in Unit Coherency with each other. The moved Models then form a new Unit, separate from the rest of the Reacting Unit in all respects, including for scoring Victory Points (except for the Last Man Standing (X) Secondary Objective). All Models that were in the Reacting Unit when the Reaction was declared are considered to have made a Reaction this Player Turn.",
  },
  {
    nom: "Raptor's Momentum",
    texte:
      "Legio Custodes Gambit available while a Model with the Legio Custodes Trait is Engaged in a Challenge. This Gambit grants a Model additional attacks based on the number of enemy Models involved in the same Combat. If this Gambit is chosen, and the Opposing Player has a higher Outside Support bonus than the Controlling Player during the Focus Step, the Model that adopts it gains a bonus to its current Attacks Characteristic in the following Strike Step equal to the difference between the Players' Outside Support bonuses in that Challenge, up to a maximum of +3.",
  },
  {
    nom: "Strike from the Heavens",
    texte:
      "Legio Custodes Gambit that halves the Model's Attacks Characteristic, but replaces the Critical Hit (6+) Special Rule with Critical Hit (5+) on its Weapon. If this Gambit is chosen, as long as the Model that adopts it declared at the start of the Focus Step that it is using a Weapon with the Critical Hit (6+) Special Rule, that rule is replaced by the Critical Hit (5+) Special Rule, and the Model's base Attacks Characteristic is halved for the duration of the Strike Step.",
  },
  {
    nom: "Bane of the World Serpent",
    texte:
      "Legio Custodes Gambit that limits a Model to a single attack, but whose Damage Characteristic is set to the Model's remaining Wounds. If this Gambit is chosen, the Model that adopts it may only make a single attack in the following Strike Step, regardless of its Attacks Characteristic, but the Damage Characteristic of the Weapon used for that attack is modified to equal the Current Value of the Model's Wounds Characteristic while resolving that attack.",
  },
  {
    nom: "Aegis of Stone",
    texte:
      "Legio Custodes Gambit, restricted to a Model with the Shield Trait, that modifies a Model's Toughness by +1 but causes Wound Tests made for it to automatically fail on a natural roll of 1 or 2. If this Gambit is chosen, the Model that adopts it gains a +1 modifier to its Toughness Characteristic for the duration of the Strike Step, but all Wound Tests made for that Model in the same Strike Step automatically fail on a natural roll of 1 or 2.",
  },
  {
    nom: "Praesidium Shield",
    texte:
      "A Model equipped with a Praesidium Shield gains a 5+ Invulnerable Save and the Shield Trait.",
  },
  {
    nom: "Praesidium Gravis Shield",
    texte:
      "Combining layers of energy shielding with a veritable bulwark of plasteel and reinforced ceramite, the Praesidium Gravis is an impenetrable pavise whatever the attack. Its size and mass are such that no ordinary warrior could wield it; handling such a shield is the preserve of a Dreadnought's armoured chassis. A Model equipped with a Praesidium Gravis Shield gains a 4+ Invulnerable Save and the Shield Trait.",
  },
  {
    nom: "Tarsus Buckler",
    texte:
      "This small shield offers little protection on its own, but it projects complex energy fields that diffract and weaken the radiation and kinetic energy aimed at its bearer. These directional fields cover a relatively small area, which requires the buckler to be angled precisely, a difficult feat for any but the Legio Custodes. The Firepower of attacks made as part of a Volley Attack or an Overwatch Reaction is modified by -1 when resolving Wound Tests against a Unit that includes at least one Model equipped with a Tarsus Buckler.",
  },
  {
    nom: "Eclipse shield",
    texte:
      "The Eclipse shield grants a 5+ Shrouded Damage Mitigation Roll against Shooting Attacks when a Model suffers a Penetrating Hit. The first time in a Battle Turn that a Model equipped with an Eclipse shield suffers a Penetrating Hit, it gains a 5+ Shrouded Damage Mitigation Roll against all subsequent Shooting Attacks, until it returns to Aerial Reserves.",
  },
  {
    nom: "Smoke Launchers",
    texte: "A Model equipped with Smoke Launchers has the Smokescreen Trait.",
  },
  {
    nom: "Arae Shrieker",
    texte:
      "A Model equipped with an Arae Shrieker gains the Deep Strike Special Rule, and if it joins a Unit in Reserve composed only of Models that have the Legio Custodes Trait, all of those Models also gain the Deep Strike Special Rule. In addition, during the Effects Sub-Phase of the End Phase of their Player Turn, the Controlling Player of a Model equipped with an Arae Shrieker that is on the Battlefield may make an Intelligence Check for that Model; if it is passed, the opposing Player must apply a -1 modifier to the result of the first Reserves Roll they make in the Reserves Sub-Phase of the following Player Turn. No Reserves Roll may be modified in this way by more than one Arae Shrieker.",
  },
  {
    nom: "Magisterium vexilla",
    texte:
      "Units within 8\" of an enemy Model equipped with a Magisterium vexilla must pass a Leadership Check when they score an Objective, or score only a single Victory Point. In the Victory Sub-Phase of any End Phase, when a Unit with at least one Model within 8\" and in Line of Sight of an enemy Model equipped with a Magisterium vexilla would score Victory Points for Controlling or Contesting an Objective, it must first make a Leadership Check. If it is passed, there is no further effect; if it is failed, the Unit may only score a single Victory Point for Controlling or Contesting the Objective in that Victory Sub-Phase, regardless of other Special Rules such as Line (X) or Comptroller (X).",
  },
  {
    nom: "Misericordia",
    texte:
      "A Unit that includes at least one Model equipped with a Misericordia may choose a unique Aftermath option, during which it makes a special attack against an enemy Unit involved in the same Combat: \"The Blade of Mercy\", which may be chosen during Step 4 of the Resolution Sub-Phase of the Assault Phase for any Combat that ended in a victory or a draw for the Unit. The Controlling Player chooses a single Model equipped with a Misericordia in that Unit, with which they resolve Steps 4 to 10 of the Resolve an Initiative Step sequence, targeting an enemy Unit involved in the Combat for which the Fall Back Aftermath option was chosen. These attacks use the following profile: IM 1, AM 1, SM (normal Strength), AP 3, Precision (2+), Breaching (5+), Power Trait; the Damage Characteristic of this Melee Weapon is equal to the number of Models equipped with a Misericordia in the Unit for which this Aftermath option was chosen.",
  },
  {
    nom: "Lightning Blows",
    texte:
      "After a successful Charge, the Melee Weapons of a Model with the Lightning Blows Special Rule temporarily gain the Critical Hit (6+) Special Rule. If a Unit that includes at least one Model with this Special Rule makes a successful Charge, until the end of the Assault Phase, all Models in the Unit with this Special Rule gain the Critical Hit (6+) Special Rule for the Melee Weapons they are equipped with.",
  },
  /* Journal Tactica : The Battle for the Signus Cluster (Proconsul-
     Délégué Hykanatoi et Venatari-Proconsul Ephoroi, js/unites-data.js). */
  {
    nom: "Hykanatoi Excelsis",
    texte:
      "Under the direction of a Hykanatoi Proconsul-Delegate, the already formidable warriors of the Legio Custodes display terrifying coordination, rendering ordinary tactical considerations meaningless in the face of the \"Auric Mortalis\". Magisterium vexillas in the same Unit as a Model with this Special Rule have a range of 10\". While a Model with this Special Rule has joined a Custodian Guard Sodality or Sentinel Guard Sodality Unit, any Model in that Unit equipped with a Magisterium vexilla is considered to be 2\" closer to any enemy Model when determining whether that item of Wargear takes effect.",
  },
  {
    nom: "Ephoroi Excelsis",
    texte:
      "Veterans of countless infiltrations and decapitation strikes, Ephoroi Venatari-Proconsuls lead the Venatari Sodalities under their command with absolute precision, timing their incursions to sow the greatest possible chaos among the enemy. If a Model with this Special Rule has joined a Venatari Sodality Unit in Reserve, the Controlling Player may choose to automatically pass any Reserves Test they make for that Unit.",
  },
  {
    nom: "Ex Oblivio",
    texte:
      "At the end of a Combat, Models with this Special Rule automatically inflict Perils of the Warp on any Unit that includes Models of the Malefic Sub-type or that have the Psyker Trait. If, at the end of Step 5 of the Fight Sub-Phase of the Assault Phase, a Combat involves at least one Model with this Special Rule, all Units (friendly or enemy) in that Combat that include at least one Model of the Malefic Sub-type or with the Psyker Trait immediately suffer the Warp Rupture result on the Perils of the Warp Table. In addition, a Model with this Special Rule is considered to have the Psyker Trait for the purposes of being selected as the Focus of the Nullify Advanced Reaction, as long as at least one Model in the Target Unit is within 12\" of the Model with this Special Rule.",
  },

  /* Collision de nom relevée en transcrivant l'Arsenal des Forces de
     l'Empereur (Legio Custodes) : la page « Choc Psy » y définit une
     Règle Spéciale d'Arme (Missiles vratins lourds) sans aucun rapport
     avec la Réaction Avancée « Choc Psy » de la Désignation Gardespire
     Prosperienne déjà transcrite ci-dessus (js/regles-data.js) — même
     nom exact, deux mécaniques distinctes. `trouverDefinitionRegle`
     (js/main.js) indexe par nom normalisé dans une seule Map : une
     seconde entrée « Choc Psy » écraserait silencieusement l'une des
     deux définitions pour tous les usages du site (tables d'Armes ET
     Règles Spéciales d'Unité confondues), sans distinction de contexte
     possible. Volontairement NON ajoutée pour préserver l'entrée déjà
     établie : le tag "Choc Psy" sur Missiles vratins lourds reste donc
     sans info-bulle (repli documenté, comme une Règle Spéciale connue
     par son nom seul). À résoudre uniquement si un mécanisme de
     désambiguïsation par contexte est ajouté à trouverDefinitionRegle. */

  /* --- Anathema Psykana (livre d'armée officiel, la Sororité
     Silencieuse) : Tactica de Divisio, Posture de Défi de Jenetia
     Krole et Trait Investigatus-Militant. --- */
  {
    nom: "Anathema",
    texte:
      "Divisio Tactica: all Models that have the Anathema Psykana Trait, except Models of the Vehicle Type, are subject to this Special Rule. Models with this Special Rule ignore the effects of Psychic Powers and Psychic Weapons, and a Weapon with the Psychic or Immaterial Trait can only wound them on a 5+. A Unit that includes any Model with this Special Rule can never be chosen as the target of a Psychic Blessing or Curse, and Models with this Special Rule ignore all Damage inflicted by Psychic Powers, Psychic Weapons, Psychic Reactions or Perils of the Warp: if such a Model is chosen as the Target Model of an attack or wound inflicted in this way, the resulting Damage has no effect and no Wound Test, Armour Save or Damage Mitigation Roll is made. In addition, Wound Tests made for Weapons that have the Psychic or Immaterial Trait, that target a Unit composed only of Models with this Special Rule, and that roll an unmodified 1, 2, 3 or 4, are always failures, regardless of the Strength Characteristic of a Hit or any Special Rules that set the Target Number of Wound Tests. This Special Rule has no effect on Armour Penetration Tests.",
  },
  {
    nom: "The Soulless Queen",
    texte:
      "While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: Abyssal Strike — when this Gambit is chosen, the Controlling Player gains a positive modifier to their Focus Roll equal to the Base Value of Krole's Willpower Characteristic, minus the Current Willpower Characteristic of the opposing Model in the Challenge.",
  },
  {
    nom: "Investigatus-Militant",
    texte:
      "If an Army's Primary Detachment is drawn from the Anathema Psykana Army List and includes at least one Unit with this Trait, the Controlling Player gains a bonus Reaction Point for that Detachment.",
  },

  /* --- Divisio Assassinorum (livre d'armée officiel) : Tactica de
     Divisio, et Règles Spéciales/équipement de l'Assassin Adamus et de
     l'Assassin Callidus. --- */
  {
    nom: "Nemesis",
    texte:
      "Divisio Tactica: all Models that have the Divisio Assassinorum Trait, except Models of the Vehicle Type, are subject to this Special Rule. Shooting Attacks that target a Model with this Special Rule are always made as Snap Shots, unless it is the closest enemy Model. When a Unit composed only of Models with this Special Rule is the target of a Shooting Attack, all attacks made as part of that Shooting Attack must be made as Snap Shots, unless that Unit is the closest enemy Unit to the Unit making the Shooting Attack. This Special Rule has no effect on Volley Attacks or attacks made with the Precision (X) Special Rule.",
  },
  {
    nom: "Seeker of Atonement",
    texte:
      "Gambit of Hibou Khan (White Scars) that allows him to attempt to avoid being Removed as a Casualty. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player may choose this Gambit: if this Model is reduced to 0 Wounds during Step 4 of the Strike Step, its Controlling Player may roll a dice — on a 4+, this Model is not Removed as a Casualty, but remains Engaged in the Challenge with a Wounds Characteristic of 1, and its Controlling Player gains the Challenge Advantage.",
  },
  {
    nom: "Artisan of Death",
    texte:
      "This Gambit allows an Adamus Assassin in a Challenge to Hit on a fixed Target Number and to fight in a Strike Step in which it lost its last Wound. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player must adopt the Mirror Form Gambit; any Special Rule or Gambit that would prevent the Controlling Player from adopting this Gambit is ignored. Mirror Form: if this Gambit is chosen, Hit Tests made for this Model in the following Strike Step always succeed on a 4+, regardless of the opposing Model's Weapon Skill Characteristic. In addition, if the Controlling Player does not have the Challenge Advantage in the following Strike Step and this Model's Wounds Characteristic is reduced to 0 or less, the Controlling Player may still make attacks for this Model in that Strike Step, before it is Removed as a Casualty.",
  },
  {
    nom: "Nemesii Grenades",
    texte:
      "A Charge declared against a Unit that includes at least one Model equipped with Nemesii Grenades and that is not Locked in Combat is always a Disordered Charge, and if a Charge Move is made for such a Charge, all Models in the Charging Unit are considered to move through Dangerous Terrain.",
  },
  {
    nom: "Polymorphine",
    texte:
      "A Model with this Special Rule cannot be targeted by Shooting Attacks or Charges, unless it has already attacked during the Battle or an enemy Unit has passed an Intelligence Check to that end. A Unit composed only of Models with this Special Rule cannot be chosen as the Target of a Shooting Attack or a Charge. When an enemy Unit completes a move within 3\" of a Model with this Special Rule, the Controlling Player of the enemy Unit may make an Intelligence Check for that Unit; if it is passed, this Special Rule no longer has any effect on that Model for the rest of the Battle.",
  },
  {
    nom: "Confusion Reigns",
    texte:
      "The first Unit that a Model with this Special Rule Charges during the Battle becomes Stunned.",
  },
  {
    nom: "Phase Shift (X)",
    texte:
      "Attacks made with the Phase Shift (X) Special Rule sometimes ignore all Damage Mitigation Rolls and Saving Throws. When a Wound Test is made for an Attack with this Special Rule, and that Wound Test is equal to or greater than the value of X attached to this variant of the Special Rule, all Damage Mitigation Rolls and Saving Throws are ignored for the Wound inflicted. This Special Rule can only be triggered by a Wound Test and has no effect when making an Armour Penetration Test.",
  },
  {
    nom: "Etherium",
    texte:
      "When a Model with this Special Rule is allocated an Unsaved Wound from a Shooting Attack, the Damage of that Unsaved Wound is reduced by 1, to a minimum of 1.",
  },
  {
    nom: "Frenzon",
    texte:
      "Gambit that increases the Model's Attacks Characteristic and grants a bonus to the result of a Focus Roll made for it in a Challenge, at the cost of automatic Wounds. While a Model with this Special Rule is Engaged in a Challenge, its Controlling Player must adopt the Biological Overload Gambit; any Special Rule or Gambit that would prevent this is ignored. Biological Overload: if this Gambit is chosen, the Controlling Player gains a +3 modifier to their Focus Roll in the following Focus Step, and this Model's Attacks Characteristic is modified by +3 for the duration of the following Strike Step. However, for each roll of 1 on a Hit Test made for this Model's Attacks in that Strike Step, the Model suffers an Unsaved Wound with a Damage of 1, allocated at the end of the Strike Step.",
  },
  {
    nom: "Infocyte",
    texte:
      "A Model with this Special Rule gives its Controlling Player access to the Auspectre and Signum Shunt Advanced Reactions.",
  },
  {
    nom: "Autotomic Servo-limbs",
    texte:
      "In the Aftermath Step of the Resolution Sub-Phase of the Assault Phase, a Model with this Special Rule always chooses the Disengage Aftermath option, regardless of who won the Combat.",
  },
  {
    nom: "Auspectre",
    texte:
      "Vanus Clade (Divisio Assassinorum) Advanced Reaction that allows the Reactive Player to disrupt the placement of an enemy Flyer arriving from Aerial Reserves. Trigger: the Reactive Player may declare it during the Reserves Sub-Phase when the Active Player passes a Reserves Roll for a Unit arriving from Aerial Reserves. Cost: free. Target: the Unit in Aerial Reserves for which the Active Player has just passed that Reserves Roll. Process: (1) the Active Player must give the Target Unit a Combat Assignment; (2) before the Active Player places it on the Battlefield, the Reactive Player makes an Intelligence Check for the Reacting Unit; (3) if it is passed, the Reactive Player may, instead of the Active Player, place the Target Unit anywhere along a Battlefield Edge that is valid for its Combat Assignment — if it is failed, this Reaction has no effect; (4) in the following Movement Phase, the Active Player may immediately pivot the Target Unit before moving it normally, in accordance with its Combat Assignment.",
  },
  {
    nom: "Signum Shunt",
    texte:
      "Vanus Clade (Divisio Assassinorum) Advanced Reaction that allows the Reactive Player to attempt to Suppress or Pin a Unit arriving from Reserves. Trigger: the Reactive Player may declare it during the Movement Phase, when the Active Player deploys a Unit arriving from Reserves. Cost: free. Target: the Unit entering play from Reserves in this way, if it is within 12\" and in Line of Sight of the Reactive Player. Process: the Controlling Player makes an Intelligence Check for the Reacting Unit; if it is passed, the Target Unit gains the Suppressed or Pinned Tactical Status, at the Reactive Player's choice; if it is failed, this Reaction has no effect.",
  },
  {
    nom: "Unnatural Conditioning",
    texte:
      "The Phage (X) and Poisoned (X) Special Rules have no effect on a Model with this Special Rule: the effects of all variants of these two Special Rules are ignored when targeting a Model with this Special Rule.",
  },
  {
    nom: "The Venem",
    texte:
      "A Model wounded by a Weapon with this Special Rule must pass a Toughness Check at the end of each subsequent Battle Turn or suffer a further Wound. No Saving Throw or Damage Mitigation Roll may be attempted against a Wound suffered in this way. A Model whose Wounds Characteristic is reduced to 0 because of this Special Rule is Removed as a Casualty, even if it is Embarked on another Model or in Reserves.",
  },
  {
    nom: "Fatal Shot",
    texte:
      "Models with this Special Rule ignore Shrouded (X) Damage Mitigation Rolls against Wounds inflicted as part of a Shooting Attack. In addition, when a Shooting Attack is made for a Model with this Special Rule, at the start of Step 3 of the Shooting Attack procedure, the Controlling Player may apply one of the following Special Rules to all Weapons the Model is equipped with, for the duration of that Shooting Attack: Murderous (5+), Rending (5+), or Shock (Pinned, Suppressed).",
  },
  {
    // Journal Tactica : Zone Mortalis (Section Technicien de Combat
    // Auxilia). Le passage décrivant précisément « Contourner le
    // Cogitateur (X) »/le Test d'Interface était partiellement
    // recouvert par une autre colonne de texte sur la photo source :
    // gardé seulement le mécanisme clairement lisible.
    nom: "Combat decryptor",
    texte:
      "These devices are primed with low-grade djinn-data and other aggressive but ephemeral code-spirits. Once released into a system, they swarm its cogitator nodes, temporarily delaying the deployment of security protocols and allowing the operator to manipulate the host freely. Combat decryptors allow Models to interact with Zone Mortalis Special Rules and Advanced Reactions: a Unit that includes at least one Model equipped with a Combat decryptor may use the Bypass Cogitator (X) Special Rule as if that Model had the Battlesmith (X) Special Rule; in addition, during an Interface Check, a Model equipped with a Combat decryptor is considered to have a base Intelligence Characteristic of 9.",
  },
  {
    // Journal Tactica : The Forges of Saturn (Centurion en Armure
    // Terminator Saturnine, Escouade de Commandement Terminator
    // Saturnine, Conclave des Phraetus Oints).
    nom: "Saturnine teleport synchroniser",
    texte:
      "Built into the imposing breastplates that characterise Saturnine Terminator Armour, teleport synchronisers link with the teleportation transponders of senior officers, allowing massed teleport assaults by Saturnine-equipped warriors. A Model equipped with a Saturnine teleport synchroniser that is in Reserves gains the Deep Strike Special Rule if its Unit has been joined by a Model equipped with a Saturnine teleportation transponder.",
  },
  {
    // Journal Tactica : The Forges of Saturn (Conclave des Phraetus
    // Oints, Word Bearers). Le passage décrivant précisément le
    // déclenchement était réparti sur deux colonnes qui se recoupaient
    // sur la photo source : reconstruit en ne gardant que le mécanisme
    // clairement identifiable (Test d'Endurance des Unités proches en
    // fin de Sous-Phase d'Attaques, D3 Blessures automatiques en cas
    // d'échec).
    nom: "Warpfire Cloak",
    texte:
      "Chosen by ritual prognostication, the daemons bound to the Saturnine armour worn by the Phraetus Anointed exude a malefic miasma of shadow, draining the energy of enemy firepower and releasing it in geysers of seething Warpfire. Warpfire Cloaks give Models a chance to inflict Wounds on nearby Units when they are hit by Shooting Attacks. At the end of the Attack Sub-Phase of any Shooting Phase, if a Unit includes at least one Model equipped with a Warpfire Cloak and it has passed at least one Armour or Invulnerable Saving Throw against Wounds inflicted by Shooting Attacks during that Shooting Phase, every Unit with at least one Model within 8\" of at least one Model in that Unit must make a Toughness Check, unless it itself includes at least one Model equipped with a Warpfire Cloak. A Unit that fails this Check suffers D3 automatic Wounds with a Damage Characteristic of 1 and AP 2, with no Saves of any kind allowed, which may be allocated as if they had been inflicted by a Shooting Attack.",
  },
  {
    // Journal Tactica : Dropsite (Escouade de Commandement et de
    // Contrôle Augure).
    nom: "Battlefield Coordinators",
    texte:
      "Some warriors are specifically trained in the execution of broader strategies, trusted to coordinate their fellows under the direction of their commander. This Special Rule allows the Controlling Player to reduce the Reaction Point cost of a Reaction, once per Turn. Once per Turn, if a Unit that includes at least one Model with this Special Rule is within 18\" of a Unit making a Reaction, the Controlling Player may make an Intelligence Check for that Unit. If a Model in the Unit with this Special Rule has Line of Sight to a Model in the Reacting Unit, the Controlling Player may modify the result of that Check by -1. If the Check is passed, that Reaction costs one fewer Reaction Point (to a minimum of 0).",
  },
  {
    // Journal Tactica : Dropsite (Maître de la Descente).
    nom: "Master of Descent",
    texte:
      "Masters of the Descent plunge onto the battlefield ahead of the rest of their forces, often the first to set foot on the field of battle. A Model with this Special Rule may arrive by Deep Strike from the first Battle Turn. If a Model with this Special Rule is in Reserves, and that Model and all other Models in the same Unit have the Infantry Type and the Antigrav Sub-type, that Model's Unit may use the Deep Strike Special Rule to enter play from the first Battle Turn. Only one Unit in an Army may make use of this Special Rule in any single Battle Turn.",
  },
  {
    // Journal Tactica : Dropsite (Maître de la Descente) — débloque le
    // Détachement Auxiliaire Fer de Lance de Chute
    // (organigramme-data.js).
    nom: "Spearhead",
    texte:
      "As the spearhead of a Legiones Astartes airborne assault, Masters of the Descent surround themselves with the most capable warriors of their company, each an exemplar of their Legion, armed with the finest weapons and skills honed over countless battles. An Army whose Primary Detachment includes a Model with this Special Rule may select the Drop Spearhead Auxiliary Detachment once per Army, following all the normal Rules for selecting Auxiliary Detachments.",
  },
  {
    // Journal Tactica : Dropsite (Maître de la Descente).
    nom: "Strato-vox",
    texte:
      "Strato-voxes are high-gain command and control terminals, able to coordinate with the guidance systems of Drop Pods and other drop craft, and even teleportariums, automatically adjusting arrival coordinates in real time as the target approaches the battlefield, ensuring the precise deployment of supporting forces. While at least one Model equipped with a Strato-vox is on the battlefield, before making a Reserves Test for a Unit in Reserves that includes Models with the Deep Strike Special Rule, the Controlling Player may choose to activate that Strato-vox. If they do, that Reserves Test is automatically passed, but the Unit for which it was activated must make a Deep Strike instead of deploying normally.",
  },
  {
    // Journal Tactica : Dropsite, page « Additional Prime Advantage ».
    // Mécanique de Case d'Organigramme de Force Suprême/Avantage
    // Principal au sens du LIVRE ANGLAIS (« Prime Slot »), distincte des
    // Avantages Principaux de Cases Principales déjà modélisés sur ce
    // site (même homonymie déjà actée pour Avantage Principal/Case
    // d'Organigramme de Force Suprême, voir CLAUDE.md, Inductii) — non
    // modélisée mécaniquement, texte seul.
    nom: "Interdiction Cadres",
    texte:
      "If a Tactical Squad or Despoiler Squad Unit (not yet transcribed for the Legiones Astartes) from the Legiones Astartes Army List is selected to fill a Prime Force Organisation Chart Slot, the Controlling Player may select the following Prime Advantage: Interdiction Cadres — all Models in a Unit selected to fill a Prime Force Organisation Chart Slot with this Prime Advantage gain the Concealed Positions and Expendable (1) Special Rules.",
  },
  {
    nom: "Concealed Positions",
    texte:
      "Whether by optical concealment, hidden lairs or simply by slipping out of sight, many forces use subterfuge to ambush their enemy. This Special Rule allows Models to use an Advanced Reaction to arrive from Reserves in close proximity to an enemy Unit. The Controlling Player of a Unit that includes only Models with this Special Rule may use the Concealed Ambush Advanced Reaction.",
  },
  {
    nom: "Concealed Ambush",
    texte:
      "Advanced Reaction. Trigger: the Reactive Player may declare this Reaction during Step 2 of the Move Sub-Phase process, after an enemy Unit has completed a Move. Cost: the Reactive Player must spend 1 point of their Reaction Allotment to declare it, paid as soon as the declaration is made. Target: the Target Unit is always the Unit whose Move triggered the Reaction. The Reactive Player must select a Unit under their control that includes only Models with the Concealed Positions Special Rule and that is in Reserves; that Unit is the Reacting Unit. Process: (1) the Reactive Player selects a Model from the Reacting Unit and places it anywhere on the battlefield outside the enemy Deployment Zone, within 6\" of the Unit that triggered the Reaction and at least 5\" from any enemy Model, as well as 1\" from any Battlefield Edge or piece of Impassable Terrain; the remaining Models are then placed in Unit Coherency with at least one other Model from the same Unit and within 6\" of the first Model placed, under the same distance restrictions; any Model that cannot be placed in this way is immediately Removed as a Casualty; (2) once the Reacting Unit has been deployed, the Reactive Player may either make a Shooting Attack with it against the Unit that triggered the Reaction (as Snap Shots), or make a Disordered Charge with it, which must target that same Unit.",
  },

  /* --- Démons de la Tempête de la Ruine (« Legacies of the Age of
     Darkness : Daemons of the Ruinstorm », Faction complète — pas des
     ajouts Legacy sur un roster de Légion existant, voir CLAUDE.md).
     Les 8 Dominions Éthériques ci-dessous sont normalement choisis UNE
     FOIS pour toute l'Armée (menu « Dominion Éthérique »,
     js/organigramme.js) ; Ka'bandha/Cor'bax Utterblight/Samus ont
     chacun le leur fixé en dur (Trait non remplaçable). --- */
  {
    nom: "Desecrators",
    texte:
      "A Model with this Special Rule that passes a Willpower Check gains the Line (X) Special Rule. At the start of each Victory Sub-Phase, the Controlling Player of a Unit composed entirely of Models with this Special Rule may make a Willpower Check; if it is passed, all Models in the Unit gain the Line (X) Special Rule until the end of the current Victory Sub-Phase, the value of X being determined by the margin between the final result of the Check and the Willpower Characteristic used for that Check: 0-1 → Line (1); 2 → Line (2); 3 or more → Line (3). If the Willpower Check is failed, the Unit suffers Perils of the Warp.",
  },
  {
    nom: "Primal Terror",
    texte:
      "When a Unit that includes a Model with this Special Rule is declared as the Target Unit of a Charge, or the Target Unit of a Reaction or Advanced Reaction, the Controlling Player of the Unit for which the Charge or Reaction is declared must make a Leadership Check. If the Check is passed, the Charge or Reaction is resolved normally. If the Check is failed, the Unit for which the Charge or Reaction was declared immediately gains the Stunned Status and the Controlling Player cannot declare any other Charge or Reaction for that Unit during that Phase, but their remaining Reaction Allotment is not reduced.",
  },
  {
    nom: "Champion of the Dominion",
    texte:
      "During the Challenge Sub-Phase, if a Model with this Special Rule is eligible, it must be declared as the Challenger or to accept a Challenge; if several Models with this Special Rule are eligible, the Controlling Player chooses which. In addition, if a Model with this Special Rule would gain the Disgraced Status, it instead suffers automatic wounds as per the Malefic Sub-type, but these wounds must be allocated to the Model with this Special Rule, and cannot be allocated to Models in any Unit it has joined.",
  },
  {
    nom: "Herald of Unreality",
    texte:
      "During the Declare Reserves Step of the Mission, the Controlling Player may select another Unit from the Ruinstorm Daemons Army List that is part of the Army, for each Model with this Special Rule in the Army. Each Model in each of the selected Units gains the Deep Strike Special Rule and the Warp Rift Trait for the duration of the Battle. During one of their Reserves Sub-Phases, the Controlling Player of a Model with this Special Rule may select a friendly Model with this Special Rule that is not Locked in Combat to open a warp rift; if they do, they may then select a Unit from their Army that is in Reserves and that includes only Models with the Warp Rift Trait. Reserves Rolls made for that Unit during that Sub-Phase are automatically passed and the Unit makes a Deep Strike as normal, with two exceptions: the first Model of the Unit must be placed in Base Contact with the Model that opened the warp rift, and a Charge may be declared for the Unit during the Charge Sub-Phase of that same Player Turn.",
  },
  {
    // Objet de Wargear (page 23), pas une Règle Spéciale d'Arme — même
    // principe que le Bouclier tempête modèle Proteus déjà existant.
    nom: "Totem of Dominion",
    texte:
      "When a Unit composed entirely of Models of the Malefic Sub-type that includes at least one Model with this item of Wargear would gain any Tactical Status, that Unit instead suffers 1 automatic wound with a Damage Characteristic of 1, against which no Saves of any kind may be made, instead of the D3 wounds normally inflicted by the Malefic Sub-type.",
  },
  {
    // Trait porté par le Souverain Démoniaque, Ka'bandha, Cor'bax
    // Utterblight et Samus — lié au bonus de Réaction « Additional
    // Reaction Point » (p. 6), non simulé mécaniquement par cet outil
    // (même principe que État-major Suprême de Cohorte/Investigatus-
    // Militant).
    nom: "Champion of the Ruinstorm",
    texte:
      "If an Army's Primary Detachment is drawn from the Ruinstorm Daemons Army List and includes at least one Model with this Trait, or a Lord of War Detachment from the same Army List includes one, the Controlling Player gains a bonus Reaction Point.",
  },
  {
    nom: "Encroaching Ruin",
    texte:
      "Ætheric Dominion. A Model with this Trait gains the Deep Strike and Desecrators Special Rules. A Model with this Ætheric Dominion Trait and the Command or Champion Sub-type may be given the Psyker Trait and up to two of the following Psychic Disciplines: Pyromancy (+10 Points per Model), Telekinesis (+20 Points per Model), Divination (+20 Points per Model).",
  },
  {
    nom: "Heedless Slaughter",
    texte:
      "Ætheric Dominion. A Model with this Trait gains the Desecrators Special Rule. In addition, no Unit that includes at least one Model with this Trait can ever be the Target or Focus of a Psychic Blessing or Curse.",
  },
  {
    nom: "Putrid Corruption",
    texte:
      "Ætheric Dominion. Every Model with this Trait gains the Desecrators Special Rule, the Feel No Pain (6+) Special Rule and the Heavy Sub-type. In addition, each Model with this Trait that also has a variant of the Bulky (X) Special Rule also gains the Explodes (5+) Special Rule. A Model with this Ætheric Dominion Trait and the Command or Champion Sub-type may be given the Psyker Trait and the Biomancy Psychic Discipline for +20 Points per Model.",
  },
  {
    nom: "Rapturous Sensation",
    texte:
      "Ætheric Dominion. A Model with this Trait gains the Desecrators Special Rule. Every Model with this Trait that does not have the Heavy Sub-type gains the Light Sub-type. A Model with this Ætheric Dominion Trait and the Command or Champion Sub-type may be given the Psyker Trait and up to two of the following Psychic Disciplines: Telekinesis (+20 Points per Model), Telepathy (+10 Points per Model).",
  },
  {
    nom: "Formless Distortion",
    texte:
      "Ætheric Dominion. A Model with this Trait gains the Desecrators Special Rule. Each time a Unit that includes a Model with this Trait is declared as the Target Unit of a Charge, any Set-up Move made by the enemy Charging Unit is reduced by D3\", to a minimum of 1\". A Model with this Ætheric Dominion Trait and the Command or Champion Sub-type may be given the Psyker Trait and up to two of the following Psychic Disciplines: Divination (+20 Points per Model), Telepathy (+10 Points per Model).",
  },
  {
    nom: "Infernal Tempest",
    texte:
      "Ætheric Dominion. Every Model with this Trait gains the Desecrators Special Rule and the Aflame (1) Special Rule. A Model with this Ætheric Dominion Trait and the Command or Champion Sub-type may be given the Psyker Trait and the Pyromancy Psychic Discipline for +10 Points per Model.",
  },
  {
    nom: "Ravenous Dissolution",
    texte:
      "Ætheric Dominion. Every Model with this Trait gains the Desecrators Special Rule and the Hatred (Malefic, Psyker) Special Rule. A Model with this Ætheric Dominion Trait and the Command or Champion Sub-type may be given the Psyker Trait and up to two of the following Psychic Disciplines: Telekinesis (+20 Points per Model), Divination (+20 Points per Model), Telepathy (+10 Points per Model).",
  },
  {
    nom: "Malevolent Artifice",
    texte:
      "Ætheric Dominion. Every Model with this Trait gains the Desecrators Special Rule and the Armour-breaker (4+) Special Rule.",
  },

  /* --- Démons de Tzeentch (Journal Tactica : Prospero Burns,
     traduction maison) — sous-faction de la Faction Démons, voir
     js/unites-data.js. Terreur Primordiale, Totem de Dominion et
     Héraut de l'Irréalité sont communs avec la Tempête de la Ruine
     (définis plus haut). --- */
  {
    nom: "Tzeentch",
    texte:
      "Ætheric Dominion (Trait) of the Daemons of Tzeentch, borne in place of the [Ætheric Dominion] Trait and never replaceable. All Models with this Trait gain the Summoners Special Rule; those that also have the Psyker Trait have the Fate-weaver Psychic Discipline and cannot be given any other Psychic Discipline, unless otherwise stated. Alignment of the Ruinous Powers: if a Unit in a Detachment has this Trait, Units with the Infernal Tempest, Formless Distortion, Encroaching Ruin or Malevolent Artifice Traits may be selected in the same Army without restriction; however, if Models with another [Ætheric Dominion] Trait are included in the same Army as Models with this Trait, all Models of the Daemons Faction in the Army suffer a -2 modifier to their Leadership, Cool, Willpower and Intelligence (a specific exception to the rules of the Malefic Sub-type). Master of Fates Gambit: when selecting a Gambit, the Controlling Player of a Model with this Trait may choose Master of Fates instead of any other — they may then make the Hit Tests and Wound Tests of the Strike Step using the Weapon Skill, Strength and Weapon Profiles of the Lord of Change instead of those of the Model.",
  },
  {
    nom: "Master of Fates",
    texte:
      "Gambit for Models with the Tzeentch Trait, which may be selected instead of any other available Gambit. The Controlling Player may use the Characteristics of a Lord of Change to make their Attacks: while this Gambit is selected for a Model, they may make the Hit Tests and Wound Tests during the Strike Step using the Weapon Skill, Strength and Weapon Profiles of the Lord of Change, instead of the Characteristics and Weapons of the Model for which this Gambit is selected.",
  },
  {
    nom: "Summoners",
    texte:
      "Psykers may be selected as Conduits to modify the Line (X) value of friendly or enemy Units. At the start of each Victory Sub-Phase, the Controlling Player of at least one Model on the battlefield with this Special Rule may nominate a friendly or enemy Unit. They must then select a Conduit: a friendly Model with both the Psyker Trait and this Special Rule, that has not already been a Conduit during this Battle Turn, that is not Locked in Combat and is not subject to any Tactical Status, and make a Willpower Check using the Conduit's Willpower. If the Check is passed, all Models in the nominated Unit lose any variant of Vanguard (X) and gain the Line (1) Special Rule, or have any variant of Line (X) they already have modified by +1, to a maximum of Line (3), until the end of the current Victory Sub-Phase; the Controlling Player may then select a new Conduit and repeat this process. If the Check is failed, the Conduit suffers D3 Wounds, against which no Armour Saves or Damage Mitigation Rolls may be made (Invulnerable Saves are still allowed); in addition, all Models in the nominated Unit have the value of any variant of Line (X) they have modified by -1, to a minimum of 0, and cannot have any variant of Line (X) modified positively, until the end of the current Victory Sub-Phase.",
  },
  {
    nom: "Fate-weaver",
    texte:
      "Psychic Discipline for Models with the Tzeentch and Psyker Traits. A Model that has it gains the Weaver of Fate Trait, the Metamorphosis and Transphasing Psychic Powers, and the Warp Shield Psychic Reaction.",
  },
  {
    nom: "Weaver of Fate",
    texte:
      "Trait granted by the Fate-weaver Psychic Discipline. A Model with this Trait may be the Focus of the Metamorphosis and Transphasing Psychic Powers and of the Warp Shield Psychic Reaction.",
  },
  {
    nom: "Metamorphosis",
    texte:
      "Psychic Power (Curse) of the Fate-weaver Discipline: if successful, the Target gains a random Tactical Status. Trigger: the Active Player may Manifest it during the Shooting Phase. Focus: a Model with the Weaver of Fate Trait controlled by the Active Player. Target: a Unit with no Models of the Vehicle Type controlled by the Reactive Player, with at least one Model within 15\" of the Focus and in its Line of Sight. Duration: effects resolved immediately. Process: the Controlling Player of the Target Unit makes a Resistance Check, the result of which is modified by the difference between the Focus's Willpower and the Target's (e.g. Willpower 10 against 8 → +2; Willpower 7 against 9 → -2; a Model without Willpower is considered to have Willpower 12). If it is failed, they roll a D6 and the Target Unit gains the corresponding Tactical Status: 1 → Pinned; 2-3 → Stunned; 4-6 → Suppressed. If it is passed, there is no effect.",
  },
  {
    nom: "Transphasing",
    texte:
      "Psychic Power (Curse) of the Fate-weaver Discipline: if successful, the targeted Area Terrain does not block Line of Sight. Trigger: the Active Player may Manifest it during the Shooting Phase. Focus: a Model with the Weaver of Fate Trait controlled by the Active Player. Target: an area of Medium or Heavy Area Terrain no more than 10\" in any dimension; if there is none on the battlefield, a single point within an area of Medium or Heavy Terrain. Duration: until the end of the opposing Player's next Shooting Phase. Process: the Controlling Player of the Focus makes a Manifestation Check; if it is passed, the selected area (or any area of Area Terrain within 5\" of the selected point) does not block Line of Sight for the Duration of the Power; if it is failed, there is no effect.",
  },
  {
    nom: "Warp Shield",
    texte:
      "Psychic Reaction (Blessing) of the Fate-weaver Discipline: allows a Unit to gain a Shrouded Damage Mitigation Roll. Trigger: the Reactive Player may declare it at the start of Step 3 of a Shooting Attack by the Active Player that targets a Unit including at least one Model with the Weaver of Fate Trait. Cost: 1 point of Reaction Allotment, paid only if the Willpower Check is passed. Focus: a Model with the Weaver of Fate Trait controlled by the Reactive Player and part of the targeted Unit. Target: the Focus's Unit. Duration: until the end of the Sub-Phase in which it was declared. Process: the Controlling Player of the Focus makes a Manifestation Check; if it is passed, all Models in the Target Unit gain a Shrouded (5+) Damage Mitigation Roll against all wounds inflicted; if it is failed, there is no effect.",
  },
  {
    nom: "Champion of the Dark Gods",
    texte:
      "During the Challenge Sub-Phase, if a Model with this Special Rule is eligible, it must be declared as the Challenger or to accept a Challenge; if several Models with this Special Rule are eligible, the Controlling Player chooses which. In addition, if a Model with this Special Rule would gain the Disgraced Status, it is instead removed from the battlefield and placed in Reserves.",
  },
  {
    nom: "Infernal Mitosis",
    texte:
      "Horrors of Tzeentch Reaction. Trigger: the Reactive Player may declare it during Step 9 of any Shooting Attack whose Target Unit includes one or more Models with this Special Rule; it cannot be triggered by a Shooting Attack made only with Weapons that have the Disintegrator Trait. Cost: 1 point of Reaction Allotment. Target: the Reacting Unit is always the Unit targeted by the Shooting Attack that triggered the Reaction; a majority of its Models must have this Special Rule when it is declared. Process: in Step 11, once all Casualties from the Target Unit have been removed, two Blue Horrors are placed on the battlefield for each Pink Horror Removed as a Casualty, in Unit Coherency with a Model of the Unit that was not placed by this Reaction, and never within 1\" of an enemy Model. Models that cannot be placed because of these restrictions are considered Destroyed.",
  },
  {
    nom: "Tides of Change",
    texte:
      "The Base Reaction Allotment of a Player whose Army includes a Model with this Special Rule is determined by rolling a D3 at the start of each Player Turn in which they are the Reactive Player. The result of that roll, plus any bonus Reaction Points gained from the Battle Points Limit, gives their Reaction Allotment for that Turn.",
  },
  {
    // Règle Spéciale d'Arme (Bâton du Changement).
    nom: "Warp Bane",
    texte:
      "If a Model is reduced to 0 Wounds or 0 Hull Points by an attack made with a Weapon with this Special Rule, it automatically Explodes, as described by the Explodes (X) Special Rule, before being Removed as a Casualty.",
  },
  {
    // Règle Spéciale d'Arme (Regard funeste).
    nom: "Warpflame",
    texte:
      "A Model that suffers an Unsaved Wound inflicted by a Weapon with this Special Rule suffers D3 wounds instead of 1. The number of wounds suffered may be limited by Special Rules such as Eternal Warrior (X).",
  },

  /* --- Démons de Slaanesh (Journal Tactica : The Battle for the
     Signus Cluster, traduction maison) — sous-faction de la Faction
     Démons, voir js/unites-data.js. Terreur Primordiale, Totem de
     Dominion, Héraut de l'Irréalité et Champion des Dieux Sombres sont
     communs avec la Tempête de la Ruine/les Démons de Tzeentch
     (définis plus haut). --- */
  {
    nom: "Slaanesh",
    texte:
      "Ætheric Dominion (Trait) of the Daemons of Slaanesh, borne in place of the [Ætheric Dominion] Trait and never replaceable. All Models with this Trait gain the Hedonists and Soporific Musk Special Rules; those that also have the Psyker Trait have the Rapture Psychic Discipline and cannot be given any other Psychic Discipline, unless otherwise stated. Alignment of the Ruinous Powers: if a Unit in a Detachment has this Trait, Units with the Infernal Tempest, Rapturous Sensation, Encroaching Ruin or Malevolent Artifice Traits may be selected in the same Army without restriction; however, if Models with another [Ætheric Dominion] Trait are included in the same Army as Models with this Trait, all Models of the Daemons Faction in the Army suffer a -2 modifier to their Leadership, Cool, Willpower and Intelligence (a specific exception to the rules of the Malefic Sub-type). Blissful Pain Gambit and Thirst for Battle Advanced Reaction reserved for Models/Units with this Trait.",
  },
  {
    nom: "Blissful Pain",
    texte:
      "Gambit for Models with the Slaanesh Trait, which may be selected instead of any other available Gambit. The Controlling Player gains attacks during the Strike Step for each Wound inflicted on their Model, whether saved or not. This Gambit may only be selected once per Challenge. When it is selected, the opposing Player gains the Challenge Advantage without any Focus Roll being made. However, for each Wound Test passed by the opposing Player during the Strike Step, the Attacks Characteristic of the Model for which this Gambit was selected is modified by +2 for the duration of that Strike Step.",
  },
  {
    nom: "Thirst for Battle",
    texte:
      "Advanced Reaction available to the Controlling Player of any Unit that includes only Models with the Slaanesh Trait: allows the Reacting Unit to move when it is the target of an enemy Shooting Attack, and its surviving Models gain +1 Initiative. Trigger: once per Turn, the Reactive Player may declare it during the Shooting Phase, in Step 11 of any Shooting Attack made by the Active Player, after the Casualties caused by that Attack have been removed; it cannot be triggered by a Shooting Attack made only with Weapons that have the Disintegrator Trait. Cost: 1 point of Reaction Allotment. Target: the Unit whose Shooting Attack triggered the Reaction; the Reacting Unit is always the Target Unit of that Shooting Attack. Process: the Reactive Player rolls a dice; each Model in the Reacting Unit may be moved a distance in inches up to the result. Once the Unit has moved, all its Models gain an additional +1 modifier to their Initiative until the end of their Controlling Player's next Player Turn.",
  },
  {
    nom: "Hedonists",
    texte:
      "Models with this Special Rule gain or improve Line (X) when nearby enemy Units suffer Tactical Statuses. At the start of each of their Victory Sub-Phases as the Active Player, the Controlling Player may nominate a friendly Unit that includes only Models with this Special Rule. For each Tactical Status (Pinned, Stunned, Suppressed or Routed) applied to any enemy Unit within 18\" and in Line of Sight of the nominated friendly Unit that does not have the Vehicle Type, the nominated Unit loses any variant of Vanguard (X) and gains the Line (1) Special Rule for the duration of the Victory Sub-Phase, or modifies the value of any variant of Line (X) it has by +1, to a maximum of Line (3).",
  },
  {
    nom: "Soporific Musk",
    texte:
      "Enemy Units in Combat with a Unit with this Special Rule must pass a Willpower Check before an Aftermath option is selected for them. If a Combat includes Models with this Special Rule, their Controlling Player may choose to have the opposing Player make a Willpower Check for each of their Units in the selected Combat, before choosing an Aftermath option for that Unit. If the Check is passed, the Player may choose an Aftermath option normally; if it is failed, they must choose Hold. If a Unit includes Models with the Routed Status, a Willpower Check must still be made for it: if it is passed, the Unit must Fall Back; if it is failed, it must Hold, but its Models keep the Routed Status, whatever the result.",
  },
  {
    nom: "Exquisite Suffering",
    texte:
      "Daemonettes score additional Combat Resolution Points when their opponent fails Feel No Pain Damage Mitigation Rolls. When tallying the Combat Resolution Points scored by the Players in a Combat, the Controlling Player of any Model with this Special Rule gains +1 Combat Resolution Point for each Feel No Pain Damage Mitigation Roll made for an enemy Model, against a Wound from a Melee Attack made by a Model with this Special Rule, that results in a 1.",
  },
  {
    // Règle Spéciale d'Arme (Lance miroitante et bouclier).
    nom: "Deviation",
    texte:
      "When a Weapon with this Special Rule is selected for a Model during a Challenge, the Controlling Player may select a successful Hit Test made by the opposing Player with a result of 6, and set its result to 1.",
  },
  {
    nom: "Rapture",
    texte:
      "Psychic Discipline (Enraptura) for Models with the Slaanesh and Psyker Traits. A Model that has it gains the Whisperer Trait, the Bewitchment Psychic Power and the Malignancy Psychic Weapon.",
  },
  {
    nom: "Whisperer",
    texte:
      "Trait granted by the Rapture Psychic Discipline. A Model with this Trait may be the Focus of the Bewitchment Psychic Power.",
  },
  {
    nom: "Bewitchment",
    texte:
      "Psychic Power (Curse) of the Rapture Discipline: if successful, the Target cannot make Reactions triggered by a Unit with the Slaanesh Trait. Trigger: the Active Player may Manifest it in any Phase. Focus: a Model with the Whisperer Trait controlled by the Active Player. Target: a Unit controlled by the Reactive Player with at least one Model within 18\" of the Focus and in its Line of Sight. Duration: effects resolved immediately, for the duration of the current Player Turn. Process: the Controlling Player of the Target Unit makes a Resistance Check (a Model without Willpower is considered to have a base Willpower of 8). If it is failed, no Reaction may be declared for the Target Unit if the Unit triggering it includes Models with the Slaanesh Trait. If it is passed, there is no other effect — but if the Resistance Check is passed with a double, the Focus suffers Perils of the Warp.",
  },
  {
    nom: "Malignancy",
    texte:
      "Psychic Weapon of the Rapture Discipline (Range 12\", Psychic Trait): if a Willpower Check is passed, this attack uses the Characteristics of any weapon in the Target Unit. After selecting the Target Unit of an attack made with a Weapon with this Special Rule, but before any Hit Test, a Willpower Check is made for the attacking Model. If it is failed, the attack ends immediately, and if a double is rolled, the attacking Unit suffers Perils of the Warp. If it is passed, the attacker selects a single ranged weapon from those of any Model in the Target Unit; the rest of the attack is resolved using the FP, RS, AP, D and Special Rules of the selected weapon. If that weapon has the Blast (X) or Template Special Rule, the attack's FP is D6 instead of the weapon's, the attack does not use the Blast (X) or Template Special Rules and no marker or template is placed.",
  },
  {
    nom: "Insidious Corruption",
    texte:
      "Journal Tactica: The Battle for the Signus Cluster. The following Units selected in the Primary Detachment of a Traitor Allegiance Army may be given the Malefic Sub-type for +20 Points per Model: Praetor, Praetor with Jump Pack, Cataphractii Praetor, Tartaros Praetor, Saturnine Praetor.",
  },

  /* --- Légions Brisées (« Legacies of the Age of Darkness : The
     Shattered Legions », Third Edition, Version 1.0) — supplément qui
     réutilise entièrement la Liste d'Armée Legiones Astartes (Liber
     Astartes/Hereticus), pas une Faction avec ses propres Unités. Le
     Trait Légions Brisées remplace le Trait [Legiones Astartes] et les
     18 Traits de Légion qu'il est possible de choisir à sa place (voir
     FACTIONS/js/organigramme.js) ; les 18 entrées de Tactiques Mutables
     ci-dessous ne sont pas appliquées mécaniquement (bonus de combat
     conditionnels, comme les Mutable Tactics/Rites de Guerre déjà
     documentés ailleurs sur ce site), texte de référence seul. */
  {
    nom: "Shattered Legions",
    texte:
      "Faction Trait that replaces the [Legiones Astartes] Trait, in the same way as the 18 Legion Traits that may be chosen in its place. An Army that includes at least one Detachment with this Trait must choose 2 or 3 Legions from among the eighteen and note them on its Army Roster: this choice determines which Shattered Legions Rites of War may be selected and how they interact with the Army's Units.",
  },
  {
    // Prime Advantage (« Case d'Organigramme de Force Suprême » au sens
    // du livre anglais, « Prime Slot ») — mécanique non modélisée sur
    // ce site (même limite que Cadres d'Interdiction/Paladin de
    // l'Hekatonystika/Inductii), texte seul.
    nom: "Exemplars of the Legion",
    texte:
      "Prime Advantage reserved for a Unit with the Command Battlefield Role, composed entirely of Models with the Shattered Legions Trait, selected to fill a Prime Force Organisation Chart Slot. Adds an additional Force Organisation Chart Slot (any Battlefield Role except High Command, Command, Warlord or Lord of War) to the Detachment that includes this Unit. Each Unit chosen to fill this Slot must be drawn from the Legiones Astartes Army List, include no Models of the Unique Sub-type, and have a Faction Trait matching the Legion represented by the Model used to choose this Advantage. All Models in these Units then have their Faction Trait replaced with \"Shattered Legions\" and gain the Legion Specialists Special Rule.",
  },
  {
    nom: "Legion Specialists",
    texte:
      "If a Model with this Special Rule would benefit from the Mutable Tactics Special Rule, it may only benefit from the bonus for the single Legion whose Trait was replaced by the Exemplars of the Legion Prime Advantage.",
  },
  {
    nom: "Legion Armouries",
    texte:
      "A Model with the Shattered Legions Trait may be given Armoury options (but no Prime Advantage) drawn from the Legion Armoury pages of any of the Legions chosen for the Army, limited to a single Legion per Model; for the purposes of those options only, that Model is then considered to have that Legion's Trait.",
  },
  {
    nom: "Commanders of the Shattered Legions",
    texte:
      "Hibou Khan (White Scars), Alexis Polux (Imperial Fists), Shadrak Meduson (Iron Hands), Saul Tarvitz (Emperor's Children) and Garviel Loken (Sons of Horus) may join a Shattered Legions Detachment if their Legion is among those chosen for the Army; their Allegiance Trait is unchanged, but their Faction Trait is then replaced with \"Shattered Legions\".",
  },
  {
    nom: "Mutable Tactics",
    texte:
      "Legion Tactica of The Shattered Legions Rite of War. Every Model with the Shattered Legions Trait, except those of the Vehicle Type, gains a bonus for each of the Legions chosen for the Army's Shattered Legions Detachments (see each Legion's details in the Glossary). If only two Legions were chosen, these Models also gain the Bound in Blood Special Rule.",
  },
  {
    nom: "Bound in Blood",
    texte:
      "If only two Legions were chosen for the Army's Shattered Legions Detachments, every Model subject to the Mutable Tactics Special Rule modifies its Leadership and Cool Characteristics by +1 in the second and third Battle Turns, and by +2 from the fourth Battle Turn and every subsequent Battle Turn.",
  },
  {
    nom: "Children of Old Night",
    texte:
      "Dark Angels. If the Dark Angels were chosen for the Army's Shattered Legions Detachments, a Model subject to the Mutable Tactics Special Rule is only affected by a Fear (X) Special Rule if it is within 6\" (instead of 12\") of a Model with that Special Rule.",
  },
  {
    nom: "Unparalleled Skill",
    texte:
      "Emperor's Children. If the Emperor's Children were chosen for the Army's Shattered Legions Detachments, a result of 4+ on a Hit Test made for a Melee Attack by a Model subject to the Mutable Tactics Special Rule is always a success.",
  },
  {
    nom: "Accustomed to Devastation",
    texte:
      "Iron Warriors. If the Iron Warriors were chosen for the Army's Shattered Legions Detachments, a result of 9 or less on a Leadership Check made in the Morale Sub-Phase for a Unit subject to the Mutable Tactics Special Rule is always a success.",
  },
  {
    nom: "Swift of Action",
    texte:
      "White Scars. If the White Scars were chosen for the Army's Shattered Legions Detachments, a Unit composed entirely of Models subject to the Mutable Tactics Special Rule that makes a Set-up Move or is selected to Rush modifies its Models' Initiative by +1 until the end of the Sub-Phase.",
  },
  {
    nom: "Spirit of Fenris",
    texte:
      "Space Wolves. If the Space Wolves were chosen for the Army's Shattered Legions Detachments, for a Set-up Move made for a Model subject to the Mutable Tactics Special Rule, the Controlling Player may add +1\" to the distance of the Move, to a maximum of 6\".",
  },
  {
    nom: "Devastating Volleys",
    texte:
      "Imperial Fists. If the Imperial Fists were chosen for the Army's Shattered Legions Detachments, for a Volley Attack made for a Model subject to the Mutable Tactics Special Rule, that Model may make Volley Attacks with a bolter as if it had the Assault Trait.",
  },
  {
    nom: "Murderous Reputation",
    texte:
      "Night Lords. If the Night Lords were chosen for the Army's Shattered Legions Detachments, if a Unit that includes a Model subject to the Mutable Tactics Special Rule causes at least one enemy Model to be Removed as a Casualty, the Controlling Player scores 1 additional Combat Resolution Point when resolving that Combat during that Player Turn.",
  },
  {
    nom: "Vengeful Blows",
    texte:
      "Blood Angels. If the Blood Angels were chosen for the Army's Shattered Legions Detachments, for a Wound Test made for a Melee Attack by a Model subject to the Mutable Tactics Special Rule, add a +1 modifier to the result if a Model from the same Unit was Removed as a Casualty during that Phase.",
  },
  {
    nom: "Iron Resolve",
    texte:
      "Iron Hands. If the Iron Hands were chosen for the Army's Shattered Legions Detachments, when attacks made as part of a Volley Attack are allocated, if the Target Model is subject to the Mutable Tactics Special Rule, that Model gains the Feel No Pain (4+) Special Rule until that attack has been resolved.",
  },
  {
    nom: "Frenzied Pursuit",
    texte:
      "World Eaters. If the World Eaters were chosen for the Army's Shattered Legions Detachments, when a Unit that includes a Model subject to the Mutable Tactics Special Rule Pursues an enemy Unit, the Controlling Player may add +2\" to the distance of the Move.",
  },
  {
    nom: "Methodical Fighters",
    texte:
      "Ultramarines. If the Ultramarines were chosen for the Army's Shattered Legions Detachments, when an enemy Unit makes a Shooting Attack as part of a Reaction Targeting a Unit that includes a Model subject to the Mutable Tactics Special Rule, the attacks made as part of that Shooting Attack are made as Snap Shots.",
  },
  {
    nom: "Children of Barbarus",
    texte:
      "Death Guard. If the Death Guard were chosen for the Army's Shattered Legions Detachments, a Model subject to the Mutable Tactics Special Rule ignores the effects of Difficult Terrain and Dangerous Terrain; if it must make a Dangerous Terrain Test, it is considered to pass it automatically, without rolling a dice.",
  },
  {
    nom: "Conjured Illusions",
    texte:
      "Thousand Sons. If the Thousand Sons were chosen for the Army's Shattered Legions Detachments, an enemy Unit cannot have the Pursue option selected for it during the Aftermath if a Unit that chose to Fall Back includes a Model subject to the Mutable Tactics Special Rule.",
  },
  {
    nom: "Brutal Tradition",
    texte:
      "Sons of Horus. If the Sons of Horus were chosen for the Army's Shattered Legions Detachments, for a Hit Test made for a Model subject to the Mutable Tactics Special Rule, add a +1 modifier to the result if its Controlling Player controls the fewest Models in that Combat (a Model with the Bulky (X) Special Rule counts as a number of Models equal to X).",
  },
  {
    nom: "Zealous Devotion",
    texte:
      "Word Bearers. If the Word Bearers were chosen for the Army's Shattered Legions Detachments, for a Charge Roll made for a Unit that includes a Model subject to the Mutable Tactics Special Rule, the Controlling Player rolls an additional dice and discards the two lowest dice.",
  },
  {
    nom: "Scions of the Flame",
    texte:
      "Salamanders. If the Salamanders were chosen for the Army's Shattered Legions Detachments, a Unit that includes a Model subject to the Mutable Tactics Special Rule is not affected by the Panic (X) Special Rule on a Weapon with the Flame Trait.",
  },
  {
    nom: "Masters of Obfuscation",
    texte:
      "Raven Guard. If the Raven Guard were chosen for the Army's Shattered Legions Detachments, a Model subject to the Mutable Tactics Special Rule that does not remain Stationary in its Controlling Player's Movement Sub-Phase gains the Shrouded (6+) Special Rule until the start of its Controlling Player's next Turn — a Special Rule distinct from the Shrouded Damage Mitigation Roll already described on this site.",
  },
  {
    nom: "Assassination Tactics",
    texte:
      "Alpha Legion. If the Alpha Legion was chosen for the Army's Shattered Legions Detachments, Volley Attacks made for a Model subject to the Mutable Tactics Special Rule gain the Precision (6+) Special Rule.",
  },
  {
    nom: "Exact the Price",
    texte:
      "Advanced Reaction of The Shattered Legions Rite of War. Trigger: once per Battle, the Reactive Player of a Unit that includes only Models with the Shattered Legions Trait may declare it at the end of Step 5 of the Charge process, for any Charge declared by the Active Player that Targets that Unit. Cost: 1, 2 or 3 Reaction Allotments, paid upon declaration. Target: the Target Unit is always the Unit whose Charge triggered the Reaction; the Reacting Unit is always the Unit that was declared the Target of that Charge. Process: the Reactive Player declares how many Reaction Allotments they are spending. For 1 Point, the Models in the Reacting Unit gain a +1 modifier to their Toughness until the end of the Phase. For 2 Points, they also gain that same modifier, and Models attacking the Target Unit gain a +1 modifier to their Attacks until the end of the Phase. For 3 Points, Models attacking the Target Unit additionally gain a +1 modifier to their Strength, again until the end of the Phase.",
  },
  {
    nom: "Spiteful Strike",
    texte:
      "Gambit of The Shattered Legions Rite of War, which may be selected by the Controlling Player of a Model with the Shattered Legions Trait instead of any other Gambit available to that Model, only if its Wounds Characteristic has been reduced below its starting value. While this Gambit is selected, in the Focus Step, instead of making a Focus Roll, the Model makes a Melee Attack with a +1 modifier to its Hit Test and Wound Test. If the enemy Model is Removed as a Casualty as a result of this attack, the Challenge immediately proceeds to the Glory Step. If it is not, this Model is Removed as a Casualty instead, and the Challenge likewise immediately proceeds to the Glory Step.",
  },

  /* --- Blackshields (« Legacies of the Age of Darkness : Legiones
     Astartes Blackshields », Third Edition, Version 1.1) — comme les
     Légions Brisées ci-dessus, ce supplément réutilise entièrement la
     Liste d'Armée Legiones Astartes (faction: "blackshields", voir
     FACTIONS/js/organigramme.js) plutôt que d'introduire un roster
     propre. Les 15 Serments du Moment ci-dessous ne sont pas câblés
     comme mécanique sélectionnable par Détachement sur ce site (même
     principe que les Rites de Guerre/Tactica de Légion déjà en place
     ailleurs) : texte de référence seul, à appliquer manuellement en
     partie. --- */
  {
    nom: "Blackshields",
    texte:
      "Faction Trait that replaces the [Legiones Astartes] Trait on any Unit selected for a Detachment that bears this Trait. Only Units from the Legiones Astartes Army List that do not have a specific variant of the [Legiones Astartes] Trait (that is, no Unit specific to a single Legion) may be selected for such a Detachment, which cannot include any Model bearing another Legion Trait. Any Unit selected in this way keeps its [Allegiance] Trait, replaced by Loyalist or Traitor according to the choice made for the Army: Blackshields may be either Loyalist or Traitor.",
  },
  {
    nom: "Bastard Sons of Fate",
    texte:
      "Blackshields Tactica. Every Model with the Blackshields Trait, except those of the Vehicle Type, that is affected by the Pinned, Suppressed or Stunned Tactical Status gains a +1 bonus to its Toughness and Strength Characteristics; if it is affected by more than one of these Tactical Statuses at once, this bonus increases to +2.",
  },
  {
    nom: "Beholden to None",
    texte:
      "Gambit of the Blackshields Rite of War, which may be selected by the Controlling Player of a Model with the Blackshields Trait instead of any other Gambit available to that Model, only if the opposing Model engaged in the same Challenge has the Unique Trait or the Paragon Type. If this Model is Removed as a Casualty during the Strike Step while this Gambit was selected for it, the opposing Model automatically suffers D3 wounds at the end of the following Glory Step, with the Damage and Armour Penetration Characteristics of the Weapon it was wielding.",
  },
  {
    // Endryd Haar (p. 13-14) : Règle Spéciale fixe, voir js/unites-data.js.
    nom: "Fangs of the Emperor",
    texte:
      "If Endryd Haar is chosen as the only High Command Choice of a Primary Detachment, all Units in that Primary Detachment composed entirely of Models with the Blackshields Trait and the Infantry Type, and without any variant of the Bulky (X) Special Rule, gain the Infiltrate (12) Special Rule.",
  },
  {
    nom: "The Riven Hound",
    texte:
      "While a Model with this Special Rule is engaged in a Challenge, its Controlling Player may select the Gambit of the same name: the Model may then only make a single attack in the Strike Step, regardless of its Attacks Characteristic, but gains a +4 bonus to its Strength Characteristic and a +2 bonus to the Damage Characteristic of its selected Weapon for that single attack.",
  },
  {
    nom: "The Eternal Vendetta",
    texte:
      "Oath of Moment. If the opposing Army includes a Detachment with a variant of the [Legiones Astartes] Trait, all Models in a Detachment with this Oath gain the Hatred (Legiones Astartes) Special Rule; if the opposing Army includes a Primary Detachment with a variant of that Trait, the effects of this Special Rule extend to +1 to all Hit Tests made in Combat. However, any Unit in a Detachment with this Oath that starts the Assault Sub-Phase with a Model within 12\" of an enemy Model with the Legiones Astartes Trait must declare a Charge targeting the Unit that includes that enemy Model, even if it cannot reach it — except Units unable to charge (notably those of the Vehicle Type).",
  },
  {
    nom: "Panoply of Old",
    texte:
      "Oath of Moment. For each Detachment with this Oath, the Controlling Player chooses a single Legion Trait: all Units in that Detachment may then use the wargear options from that Legion's Armoury (excluding the Rules or options of its Rites of War and its Prime Advantages — only options that replace wargear). For this purpose only, all Models in the Detachment are considered to have the Faction Trait of the chosen Legion.",
  },
  {
    nom: "Only in Death does Duty End",
    texte:
      "Oath of Moment. In the End Phase of the Controlling Player's Turn, any Unit in a Detachment with this Oath that includes Models with the Routed Tactical Status may immediately have that Tactical Status removed; if so, that Unit then suffers 1D3+1 wounds with a Damage Characteristic of 1 and an Armour Penetration of -.",
  },
  {
    nom: "The Spoils of Victory",
    texte:
      "Oath of Moment. Every Model with the Blackshields Trait in a Detachment with this Oath loses any variant of the Line (X) or Vanguard (X) Special Rules it has, and cannot subsequently gain them from any source; a Unit that includes such a Model can no longer Control or Contest Objectives. Instead, these Models gain the Loot the Dead (X) Special Rule: the value of X is equal to the value of the lost Vanguard (X) variant divided by two, or to the value of the lost Line (X) variant as is. This Oath cannot be selected for a Detachment that already has the Reapers of Lives Oath.",
  },
  {
    nom: "Loot the Dead (X)",
    texte:
      "Grants a Unit that wins a Combat the Loot and Pillage option in the Aftermath: provided all enemy Units involved in that Combat have been destroyed, are Falling Back or have Disengaged, a single Unit per Combat, composed entirely of Models with this Special Rule, may choose this option rather than moving or attacking: it then scores a number of Victory Points equal to X, after which all its Models gain the Pinned Tactical Status.",
  },
  {
    nom: "An Eternity of War",
    texte:
      "Oath of Moment. When the Controlling Player of a Unit composed entirely of Models with the Blackshields Trait, part of a Detachment with this Oath, must make a Fall Back Move in the Movement Sub-Phase, that Move may be made in any direction, including into Base Contact with enemy Models; if a Model in the Unit ends up in contact in this way, all Models in the Unit lose the Routed Tactical Status if they had it. However, if in the Effects Sub-Phase of the End Phase of any Battle Turn after the first, such a Unit is not Locked in Combat, it must make a Cool Check; if it is failed, all its Models gain the Routed Tactical Status.",
  },
  {
    nom: "The Flesh is Weak",
    texte:
      "Oath of Moment. Every Model with the Blackshields Trait and the Infantry Type in a Detachment with this Oath of Moment must replace its Type with Automata, and replaces the Blackshields Tactica Special Rule (Bastard Sons of Fate) with the Linked Cogitator Units Special Rule. In addition, every Model of the Transport Sub-type selected in such a Detachment gains the Augmetic Transport Bay Special Rule.",
  },
  {
    nom: "Linked Cogitator Units",
    texte:
      "A Model with this Special Rule and the Automata Type may Control and Contest Objectives, but does not benefit from the Line (X) Special Rule: instead, it gains a bonus to the number of Victory Points scored for Controlling an Objective, based on the number of Models with this Special Rule in the Unit — one fewer Victory Point (minimum 0) if the Unit includes four or fewer, one additional Victory Point if it includes ten or more.",
  },
  {
    nom: "Augmetic Transport Bay",
    texte:
      "A Model with this Special Rule may only carry Models with the Automata Type and the Blackshields Trait, and has its Transport Capacity increased by 3.",
  },
  {
    nom: "The Legacy of Nikaea",
    texte:
      "Oath of Moment. Every Model with the Blackshields Trait and the Sergeant, Champion, Specialist or Command Sub-type in a Detachment with this Oath of Moment gains the Psyker Trait and the Malignant Psychic Discipline (in addition to any other Discipline already available, if it already had the Psyker Trait).",
  },
  {
    nom: "Malignant",
    texte:
      "Psychic Discipline. A Model that has it gains the Malignant Special Rule, the Warp Torrent Psychic Weapon and the \"Maleficent\" Trait. A Model with the Malignant Special Rule suffers Perils of the Warp more severely: when a Unit that includes such a Model suffers Perils of the Warp and gets the Warp Rupture result, the Willpower Characteristic of all Models with this Special Rule in the Unit is set to 5 for the resolution of that incident.",
  },
  {
    nom: "The Broken Helix",
    texte:
      "Oath of Moment. For each Unit that includes Models with this Oath of Moment, the Controlling Player must choose one of two options that replace existing Special Rules. A Model with the Blackshields Trait in a Detachment with this Oath loses any variant of the Fury of the Legion, Line (X) and Vanguard (X) Special Rules, and cannot subsequently gain them from any source. Instead, it gains one of the following two Special Rules, at the Controlling Player's choice — all Models in the same Detachment with this Oath must have the same Special Rule selected: Clone or Aberrant.",
  },
  {
    nom: "Clone",
    texte:
      "Every Model with this Special Rule that does not also have the Command, Champion, Specialist or Sergeant Sub-type must reduce its Leadership, Willpower, Intelligence and Cool Characteristics by 1. In addition, a Unit that includes such a Model cannot make Reactions or Advanced Reactions, but gains a 5+ Damage Mitigation Roll, known as the Cloned Resilience Damage Mitigation Roll.",
  },
  {
    nom: "Aberrant",
    texte:
      "Every Model with this Special Rule that does not also have the Command, Champion, Specialist or Sergeant Sub-type must reduce its Leadership, Willpower, Intelligence and Cool Characteristics by 1, but increases its Strength and Attacks Characteristics by 1. In addition, a Unit that includes such a Model and that starts the Assault Sub-Phase with a Model within 12\" of an enemy Model must declare a Charge targeting the Unit that includes that enemy Model, even if it cannot reach the Target Unit.",
  },
  {
    nom: "In Disgrace all are Equal",
    texte:
      "Oath of Moment. A Detachment with this Oath of Moment cannot include any Command or High Command Choices. All other Slots of all Detachments with this Oath become Prime Force Organisation Chart Slots, but the only Prime Advantage that may be selected for any of these Slots is Petty Warlord; a Unit that includes Models of the Vehicle Type cannot be given any Prime Advantage of this kind.",
  },
  {
    nom: "Petty Warlord",
    texte:
      "Prime Advantage reserved for the Supreme Force Organisation Slots of the In Disgrace all are Equal Oath of Moment. A Model of the Sergeant Sub-type in the Unit occupying the Slot gains +1 to its Attacks, Weapon Skill and Leadership Characteristics, as well as the Champion Sub-type (if it already has it, it gains an additional +1 Leadership instead). If this Advantage is chosen for a Unit in a Primary or Allied Detachment, an Auxiliary Detachment may be attached to it as if that Unit occupied a High Command Choice; all Slots in that Auxiliary Detachment then themselves become Supreme Force Organisation Slots, reserved for the same Petty Warlord Prime Advantage.",
  },
  {
    nom: "Pride is our Armour",
    texte:
      "Oath of Moment. A Primary or Allied Detachment with this Oath of Moment replaces all its Troops Slots with Elites Slots. In addition, a Detachment with this Oath cannot include any Troops Choices, including in any Auxiliary or Apex Detachment attached to it.",
  },
  {
    nom: "The Taint of the Xenos",
    texte:
      "Oath of Moment. For Models with the Blackshields Trait in a Detachment with this Oath, the Deathlock (+15 Points) and the Doomlock (+10 Points) are considered part of the Legion Special Weapons list, and the Halo blade (+15 Points) part of the Legion Officer Wargear list.",
  },
  {
    nom: "The Weapons of Desperation",
    texte:
      "Oath of Moment. Every Model with the Blackshields Trait in a Detachment with this Oath of Moment must exchange all of its bolters and bolt pistols for a weapon from the Weapons of Desperation list (scavenged Autogun, Autopistol, Lasgun, Laspistol, Shotgun or Heavy stubber, or Reclaimed melee weapon — the latter limited to one Model in three per Unit), and cannot exchange these bolters/bolt pistols for any weapon from another list. All these exchanges are free.",
  },
  {
    nom: "The Blade of the Just",
    texte:
      "Oath of Moment. Every Model with the Blackshields Trait in a Detachment with this Oath of Moment loses any variant of the Line (X) or Vanguard (X) Special Rules and cannot subsequently gain them from any source. These Models gain the Doomed Heroics (X) Special Rule, the value of X being equal to double that of the lost Special Rule; a Model that had neither Reckless nor any variant of Line (X)/Vanguard (X) gains Doomed Heroics (3) directly. This Oath cannot be selected for a Detachment that already has the Reapers of Lives or The Spoils of Victory Oath.",
  },
  {
    nom: "Doomed Heroics (X)",
    texte:
      "Each time at least one Unit with a majority of Models with this Special Rule wins a Combat in which at least one of the following conditions was true at the start of the Fight Sub-Phase, the Controlling Player scores a number of Victory Points equal to X (if there are several variants in the same Combat, only the highest value of X counts): the enemy side includes more than double the number of Models of the Blackshields side; the enemy side includes more Models of the Command Sub-type, or at least one Model of the Paragon Type; or the enemy side includes a majority of Models with a Weapon Skill higher than that of the majority of the Blackshields side.",
  },
  {
    nom: "Reapers of Lives",
    texte:
      "Oath of Moment. Every Model with the Blackshields Trait in a Detachment with this Oath of Moment loses any variant of the Line (X) or Vanguard (X) Special Rules and cannot subsequently gain them from any source; a Unit that includes such Models can no longer Control or Contest Objectives, nor score Victory Points from any other Primary or Secondary Objective. Instead, the Controlling Player of a Detachment with this Oath scores D3 Victory Points for each enemy Unit entirely Removed as a Casualty by a Shooting Attack made by a Unit that includes a majority of Models with this Oath, or during a Combat that includes such Models under their control — only 1 Victory Point if the Unit bearing this Oath is of the Vehicle Type, and this total is reduced by the value of X if the destroyed enemy Unit includes Models with the Expendable (X) Special Rule (minimum 0). This Oath cannot be selected for a Detachment that already has The Spoils of Victory or The Blade of the Just Oath.",
  },
  {
    nom: "Alone and Forgotten",
    texte:
      "Oath of Moment. A Detachment with this Oath of Moment may only include Command Choices. All Troops Slots of a Primary or Allied Detachment with this Oath, as well as of any Auxiliary Detachment attached to it, become Command Slots — but only Centurions or Centurions in Terminator Armour may fill them. Every Command Choice in a Detachment with this Oath gains +1 to its Base Wounds Characteristic and may add +1 to one of the following Characteristics, of its choice (each Model may choose a different Characteristic): Willpower, Cool or Intelligence. All Centurions and Centurions in Terminator Armour selected in this way gain the Reckless and To Fight and Die Alone Special Rules.",
  },
  {
    nom: "To Fight and Die Alone",
    texte:
      "A Model with this Special Rule cannot join any Unit, nor be joined by another Model. While it is engaged in a Combat in which it is the only Model under its Controlling Player's control: that Player gains a +1 bonus to their Combat Resolution Score for each Wound lost by this Model during the Combat Round; if it issues or accepts a Challenge, they score 1 Victory Point; and no Player may score Victory Points if this Model is Removed as a Casualty.",
  },
  {
    // PDF « Knight-Errant » (Nathaniel Garro, Tylos Rubio) — encart
    // « The Knights-Errant Trait ».
    nom: "Knights-Errant",
    texte:
      "The Knights-Errant Trait is considered a Faction Trait, in the same way as the [Legiones Astartes] Trait and the other Traits that may be substituted for it. Designer's Note: this does not override the rule that all Units in the same Detachment must share the same Faction Trait — a Unit that includes Models with the Knights-Errant Faction Trait can therefore only be included in a Detachment whose other Units have that same Trait.",
  },

  /* ---------- Bénéfices d'Arcane de Mechanicum (Liber Mechanicum,
     p. 45-49) : appliqués automatiquement quand le Détachement d'Apex
     correspondant est sélectionné. ---------- */
  {
    nom: "The Engram of Authority",
    texte:
      "Arcana Boon (Archimandrite). The Base Value of the Leadership and Cool Characteristics of a Model with this Arcana Boon is increased by +1. In addition, if this Model is able to requisition Units, it may reapply a Unit that has received The Engram of Authority, with no effect on Units composed of Models with a single variant of the Mechanicum Faction Trait different from that of other Units in the Detachment.",
  },
  {
    nom: "The Deus Machina",
    texte:
      "Arcana Boon (Cybernetica). A Unit that receives a choice from a Model with the Cybernetica Trait, and any Model of the Automata Type, may Control a Unit that has received the chosen Prime Advantage for the Model of that Unit. The Unit's Leadership, Intelligence and Willpower Characteristics are modified, and it gains the Sergeant Sub-type: the Model that gains this bonus is known as a Techno-priest that has the Cybernetica Trait with regard to the Arcana Influence The Deus Machina, its sole basis.",
  },
  {
    nom: "An Endless Servitude",
    texte:
      "Arcana Boon (Lacrymaerta). A Model with this Arcana Boon and the Battlesmith (X) Special Rule may use the latter to restore lost Wounds to Models of the Infrastructure type. Instead, an Acting Model gains access to the REAR Target to use this option. A Unit referred to here as a Cable Unit, to which the Model may apply, at the REAR Target, the variant of the Battlesmith (X) Special Rule it has, in sole contact with the Acting Model.",
  },
  {
    nom: "The Strength of Ages",
    texte:
      "Arcana Boon (Myrmidax). The Base Value of the Wounds Characteristic of a Model with this Arcana Boon is increased by +1, and it gains the Martial Meditation, Implacable Advance and Bulky (3) Special Rules, as well as the walking Sub-types of a previous variant of the Modifiers granted by the Command Sub-type (2) on the selected Models that have them.",
  },
  {
    nom: "Wallbreaker",
    texte:
      "Arcana Boon (Reductor). While part of this Arcana Boon is part of a Unit, in any Phase, any attack by a Unit that has been attempted against this Unit is deemed to have a Unit that has not received a Unit at the REAR, and gains a +1 modifier to the Strength of the Shooting Hits inflicted that must be allocated to it, for a superior figure of this Arcana Boon, and has no effect on units composed only of Models that have a single variant of the Mechanicum Faction Trait different from that of other Units in the Detachment.",
  },
  {
    nom: "Relentlessly Subtracted Army",
    texte:
      "Arcana Boon (Malagra). The modifier of the Weapon Skill, Strength or Ballistic Special Rule of this Unit, in any Phase, any attack against this Unit that has not been attempted against this Unit is deemed to have a Unit with an additional Fortification against an Attack from the REAR, and gains a +1 modifier to the Strength of the Shooting Hits inflicted that must be allocated to it, for a superior figure of this Arcana Boon, and has no effect on units composed only of Models that have a single variant of the Mechanicum Faction Trait different from that of other Units in the Detachment.",
  },
  {
    nom: "Iron Protector",
    texte:
      "Arcana Boon (Macrotek). While a Model with this Arcana Boon is within 3\" of a Model of the Vehicle Type that is not entirely Out of Action, a Unit composed of any variant of Models of which only one benefits from this Arcana Boon has no effect on Units composed of Models with a single variant of the Mechanicum Faction Trait different from that of other Units in the Detachment.",
  },

  /* ---------- Options d'Arcane de Mechanicum (Liber Mechanicum,
     p. 45-49) : choix global d'Armée, une par Techno-arcane. ---------- */
  {
    nom: "Theurgika Maximus",
    texte:
      "Arcana Option (Archimandrite). An Archmagos or Archmagos on Abeyant that selects this Arcana Option as a High Command Choice may be given the Theurgika Maximus Special Rule presented below for +10 Points. A Model with this Special Rule may use Cybertheurgic Rites per turn.",
  },
  {
    nom: "Paragon of Metal",
    texte:
      "Arcana Option (Cybernetica). A Unit of the Automata Type that selects this Arcana Option gains the Prime Advantage only for a Unit composed only of Models of the Automata Type. This Prime Advantage may only be selected for a Unit that includes a Model with Intelligence and Willpower, and it gains the Sergeant Sub-type: the Model that gains this bonus is known as a Techno-priest that has the Cybernetica Trait with regard to the Arcana Influence The Paragon of Metal, its sole basis.",
  },
  {
    nom: "Choice Specimens",
    texte:
      "Arcana Option (Lacrymaerta). This Gambit choice may only be selected for a Unit composed only of Models of the Infrastructure Type that have a single Sub-type variant. For all Models in such a Unit: +2 to the Base Value of their Strength Characteristic or a +1 modifier to the Base Value of their Wounds.",
  },
  {
    nom: "The Way of the Myrmidon",
    texte:
      "Arcana Option (Myrmidax). When choosing a Gambit, the Controlling Player of a Unit that has selected this Arcana Option may choose between the available Gambit and The Strength of Ages Gambit listed below. A Model under The Strength of Ages Gambit gains one of the following Special Rules, at the Controlling Player's choice: Martial Meditation, Implacable Advance or Bulky (3).",
  },
  {
    nom: "Thallakii Principle",
    texte:
      "Arcana Option (Reductor and Malagra). This Prime Advantage may only be selected for a Thallax Cohort Unit. For all Models in such a Unit: in any Phase, any attack attempted against this Unit receives a 5+ Invulnerable Save if it did not have a Damage Mitigation Roll. If the Unit already has a Damage Mitigation Roll, increase its value by +1.",
  },
  {
    nom: "Prime Mover",
    texte:
      "Arcana Option (Macrotek). A Vehicle that selects this Arcana Option gains a Transport Capacity increased by +2, but may only transport Models of the Transport Sub-type. If the Unit receives a Foot Choice, the Ascension is modified instead of designating the Gambit: it may add +2 in place of a named Model of this Arcana Boon, and has no effect on units composed only of Models that have a single variant of the Mechanicum Faction Trait different from that of other Units in the Detachment.",
  },
  {
    nom: "Legion Specialists",
    texte:
      "Special Rule granted to Models in Units added via the Exemplars of the Legion Prime Advantage (Shattered Legions). If the Models in this Unit could have benefited from the Mutable Tactics Legion Tactica, they only benefit from the bonus corresponding to the Legion whose Trait was replaced by Shattered Legions, and not from the bonuses of the other Legions in the Detachment.",
  },
];
