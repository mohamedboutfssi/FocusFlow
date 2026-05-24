🎯 FocusFlow — Guide de Démarrage Complet
Application de productivité avec timer Pomodoro, gestion de tâches et sessions de focus.

✅ Status : Le projet fonctionne 100% ! Backend et Frontend testés et opérationnels.


📋 Prérequis
Avant de commencer, assure-toi que tu as :

Node.js version 18+ (télécharge depuis nodejs.org)
npm (inclus avec Node.js)

Vérifier tes versions
bashnode --version    # doit afficher v18.x.x ou plus
npm --version     # doit afficher 9.x.x ou plus

🚀 Démarrage Rapide (2 étapes)
Étape 1️⃣ — Extraire et préparer
bash# 1. Extraire focusflow-fullstack.zip
# (Sur Windows : clic droit → Extraire tout)
# (Sur Mac/Linux : unzip focusflow-fullstack.zip)

# 2. Ouvrir le dossier du projet
cd project

Étape 2️⃣ — Installer et lancer
Tu auras besoin de 2 terminaux ouverts en même temps !
Terminal 1 — Démarrer le BACKEND
bash# Naviguer dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Lancer le serveur
npm start
Résultat attendu :
🚀 FocusFlow backend running at http://localhost:3001
   → GET  /api/quotes/random
   → GET  /api/quotes
   → POST /api/sessions
   → GET  /api/sessions/:userId
✅ Le backend tourne maintenant sur http://localhost:3001

Terminal 2 — Démarrer le FRONTEND
bash# Depuis le dossier racine du projet
cd frontend

# Installer les dépendances
npm install

# Lancer l'application
npm run dev
Résultat attendu :
VITE v5.4.21  ready in xxx ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.0.101:5173/
✅ L'app tourne maintenant sur http://localhost:5173

📱 Utiliser l'application

Ouvre ton navigateur sur : http://localhost:5173
Crée un compte (register)
Connecte-toi (login)
Crée des tâches et lance des sessions Pomodoro 🎯


🆘 Problèmes Courants
❌ Erreur : npm: command not found
Solution : Node.js n'est pas installé. Télécharge-le depuis nodejs.org

❌ Erreur : ERESOLVE unable to resolve dependency tree
Solution : Sur Windows avec PowerShell, essaie :
bashnpm install --legacy-peer-deps

❌ Erreur : date-fns not found
Solution : Cette dépendance manquait. Elle est maintenant dans le package.json. Fais juste :
bashnpm install date-fns

❌ Le port 5173 ou 3001 est déjà occupé
Solution : Un autre processus utilise le port. Tue-le ou redémarre :
bash# Sur Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Sur Mac/Linux
lsof -ti:5173 | xargs kill

❌ vite' n'est pas reconnu en tant que commande
Solution : Les dépendances ne sont pas installées. Fais :
bashnpm install
npm run dev

❌ Backend ne démarre pas
Solution : Vérifie que le port 3001 est libre :
bash# Windows
netstat -ano | findstr :3001

# Mac/Linux
lsof -i :3001

📂 Structure du Projet
project/
│
├── backend/                    ← Serveur Express.js
│   ├── server.js              (routes API)
│   ├── package.json
│   └── .gitignore
│
├── frontend/                   ← Application React
│   ├── src/
│   │   ├── App.jsx            (routing)
│   │   ├── main.jsx           (point d'entrée)
│   │   ├── index.css          (styles globaux)
│   │   ├── components/        (composants)
│   │   ├── pages/             (pages)
│   │   ├── context/           (React Context)
│   │   ├── utils/             (helpers)
│   │   └── data/              (données statiques)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .gitignore
│
└── README.md

🔗 Fonctionnalités Backend
GET /api/quotes/random
Retourne une citation motivationnelle aléatoire
bashcurl http://localhost:3001/api/quotes/random
Réponse :
json{
  "text": "Small progress is still progress.",
  "author": "Anonymous"
}

POST /api/sessions
Enregistre une session Pomodoro complétée
bashcurl -X POST http://localhost:3001/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "sessionId": "session-456",
    "energyLevel": "high",
    "totalMinutes": 50,
    "taskCount": 3
  }'

GET /api/sessions/:userId
Récupère toutes les sessions d'un utilisateur
bashcurl http://localhost:3001/api/sessions/user-123

💾 Où sont stockées les données ?
Frontend (localStorage du navigateur)
localStorage:
├── ff_user_[id]       → Compte utilisateur
├── ff_tasks_[id]      → Tâches
├── ff_sessions_[id]   → Sessions Pomodoro
└── ff_theme           → Thème (clair/sombre)
Backend (mémoire du serveur)
Serveur Express.js:
├── QUOTES array       → Citations motivationnelles
└── completedSessions  → Sessions enregistrées

Note : Les données du backend sont en mémoire (pas de base de données). Elles disparaissent quand le serveur redémarre. Pour une vrai app, utilise une base de données comme MongoDB ou PostgreSQL.


🎮 Utilisation de l'App
1. Inscription
Email : toi@example.com
Mot de passe : n'importe quoi
Nom : Ahmed
2. Créer une tâche

Va sur Tasks → clique Add Task
Titre, description, priorité, deadline

3. Lancer une session Pomodoro

Va sur Timer → sélectionne ton niveau d'énergie (Low/Medium/High)
La durée s'ajuste automatiquement
Lance et focus ! ⏱️

4. Voir tes stats

Va sur Dashboard → tableau de bord complet avec graphiques


🔄 Mode Développement
Frontend (avec rechargement automatique)
bashcd frontend
npm run dev
Chaque modification du code recharge automatiquement le navigateur.

Backend (avec nodemon)
bashcd backend
npm run dev
Chaque modification recharge le serveur automatiquement.

📦 Production
Construire le frontend
bashcd frontend
npm run build
Crée un dossier dist/ prêt pour production.

🛠️ Commandes Principales
CommandeOù ?Que fait-elle ?npm installBackend/FrontendInstalle les dépendancesnpm startBackendLance le serveur (production)npm run devBackend/FrontendLance en développement (avec hot reload)npm run buildFrontendConstruit pour la productionnpm run previewFrontendPrévisualise la version production

✨ Points Forts du Projet
✅ Fonctionne offline — Données sauvegardées dans le localStorage
✅ Backend optionnel — Citations et sessions bonus si démarré
✅ Responsive — Fonctionne sur desktop, tablet, mobile
✅ Thème clair/sombre — Toggle dans Settings
✅ Authentification locale — Pas de serveur externe requis
✅ Animations fluides — Framer Motion + Tailwind CSS
✅ Graphiques — Statistiques de productivité avec Recharts

🎓 Résumé des Étapes
1. Extraire focusflow-fullstack.zip
2. cd project

TERMINAL 1:
3. cd backend
4. npm install
5. npm start
   ✅ Backend sur http://localhost:3001

TERMINAL 2:
6. cd frontend
7. npm install
8. npm run dev
   ✅ Frontend sur http://localhost:5173

9. Ouvrir navigateur sur http://localhost:5173
10. Créer compte et commencer ! 🎯

📞 Support
Si quelque chose ne marche pas :

Vérifie que Node.js est installé : node --version
Efface node_modules et réinstalle : npm install
Vérifie les ports : 3001 (backend) et 5173 (frontend)
Regarde la console pour les messages d'erreur


📝 Technologies Utilisées
Frontend

React 18
Vite (build tool)
Tailwind CSS (styles)
Framer Motion (animations)
Recharts (graphiques)
React Router (navigation)

Backend

Node.js
Express.js
CORS (gestion des domaines)


Bon coding ! 🚀