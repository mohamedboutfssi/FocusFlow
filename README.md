# 🎯 FocusFlow — Guide de Démarrage

Application de productivité développée avec React et Express.js.
Le projet permet de gérer des tâches, utiliser un timer Pomodoro et suivre les sessions de travail.

## 👨‍💻 Réalisé par

* Mohamed Boutfssi
* Zakaria Ariki
* Abdelaziz Irgui

---

# 📋 Prérequis

Avant de commencer, il faut installer :

* Node.js version 18 ou plus
* npm (installé automatiquement avec Node.js)

Vérifier les versions :

```bash id="jlwmm1"
node --version
npm --version
```

---

# 🚀 Démarrage du Projet

Le projet contient :

* un backend avec Express.js
* un frontend avec React + Vite

Il faut ouvrir deux terminaux.

---

# 1️⃣ Lancer le Backend

Aller dans le dossier backend :

```bash id="jlwmm2"
cd backend
```

Installer les dépendances :

```bash id="jlwmm3"
npm install
```

Lancer le serveur :

```bash id="jlwmm4"
npm start
```

Résultat attendu :

```text id="jlwmm5"
🚀 FocusFlow backend running at http://localhost:3001
```

Le backend fonctionne maintenant sur :

```text id="jlwmm6"
http://localhost:3001
```

---

# 2️⃣ Lancer le Frontend

Ouvrir un deuxième terminal :

```bash id="jlwmm7"
cd frontend
```

Installer les dépendances :

```bash id="jlwmm8"
npm install
```

Démarrer l’application :

```bash id="jlwmm9"
npm run dev
```

Résultat attendu :

```text id="jlwmm10"
VITE ready
Local: http://localhost:5173
```

Le frontend fonctionne maintenant sur :

```text id="jlwmm11"
http://localhost:5173
```

---

# 📱 Utilisation

1. Créer un compte
2. Se connecter
3. Ajouter des tâches
4. Lancer une session Pomodoro
5. Voir les statistiques dans le dashboard

---

# 📂 Structure du Projet

```text id="jlwmm12"
project/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── data/
│   │
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .gitignore
│
└── README.md
```

---

# 🔗 Fonctionnalités Backend

## Citation aléatoire

```bash id="jlwmm13"
GET /api/quotes/random
```

Exemple de réponse :

```json id="jlwmm14"
{
  "text": "Small progress is still progress.",
  "author": "Anonymous"
}
```

---

## Ajouter une session

```bash id="jlwmm15"
POST /api/sessions
```

---

## Récupérer les sessions

```bash id="jlwmm16"
GET /api/sessions/:userId
```

---

# 💾 Stockage des Données

## Frontend

Les données sont enregistrées dans le `localStorage` :

```text id="jlwmm17"
ff_user_[id]
ff_tasks_[id]
ff_sessions_[id]
ff_theme
```

## Backend

Le backend stocke :

* les citations
* les sessions terminées

Les données sont gardées en mémoire uniquement.
Elles disparaissent après le redémarrage du serveur.

---

# ⚠️ Problèmes Fréquents

## Erreur : `date-fns not found`

Installer le package :

```bash id="jlwmm18"
npm install date-fns
```

---

## Erreur : `vite is not recognized`

Réinstaller les dépendances :

```bash id="’winim19"
npm install
npm run dev
```

---

## Port déjà utilisé

Windows :

```powershell id="’winim20"
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

Linux / Mac :

```bash id="’winim21"
lsof -ti:5173 | xargs kill
```

---

# 🔄 Mode Développement

## Frontend

```bash id="’winim22"
cd frontend
npm run dev
```

Chaque modification recharge automatiquement la page.

## Backend

```bash id="’winim23"
cd backend
npm run dev
```

Le serveur redémarre automatiquement après chaque modification.

---

# 📦 Build Production

Construire le frontend :

```bash id="’winim24"
cd frontend
npm run build
```

Un dossier `dist/` sera généré pour la production.

---

# 🛠️ Technologies Utilisées

## Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion
* Recharts
* React Router

## Backend

* Node.js
* Express.js

---

# ✅ Résumé Rapide

```text id="’winim25"
Terminal 1:
cd backend
npm install
npm start

Terminal 2:
cd frontend
npm install
npm run dev
```

Puis ouvrir :

```text id="’winim26"
http://localhost:5173
```

---

# 🎓 Remarque

Ce projet a été réalisé dans un objectif d’apprentissage du développement fullstack avec React et Express.js.
Le frontend fonctionne avec le localStorage, donc l’application peut fonctionner sans base de données.

---

Bon coding 🚀
