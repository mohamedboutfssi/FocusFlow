# 🎯 FocusFlow — Explications Simples

## 1️⃣ COMMENT ÇA MARCHE ?

### Flux d'utilisation simple :

```
1. L'utilisateur arrive sur l'app
   ↓
2. Il se connecte (login) ou s'inscrit (register)
   ↓
3. Il voit le dashboard avec ses tâches et une citation motivationnelle
   ↓
4. Il peut créer des tâches, lancer une session Pomodoro
   ↓
5. Tout est sauvegardé automatiquement
   ↓
6. Il peut se déconnecter, revenir plus tard → tout est encore là
```

---

## 2️⃣ OÙ SONT STOCKÉES LES DONNÉES ?

### FRONTEND (Navigateur)

**localStorage** = mémoire du navigateur (comme une note sticky sur ton ordi)

Quand l'utilisateur se connecte ou crée une tâche :
```
Données sauvegardées dans le localStorage du navigateur :
├── ff_user_[id]              → Infos du compte (email, nom, id)
├── ff_tasks_[user_id]        → Liste des tâches
├── ff_sessions_[user_id]     → Sessions Pomodoro complétées
└── ff_theme                  → Thème (clair/sombre)
```

**C'est quoi le localStorage ?**
- Une petite base de données stockée **dans le navigateur** (pas sur un serveur)
- Les données restent même si tu fermes la page
- Chaque site web a son propre localStorage séparé
- Les données ne partent qu'en vidant le cache du navigateur

### BACKEND (Serveur) — OPTIONNEL

Si tu démarre le backend (`npm start` dans le dossier `backend`) :
- Les sessions complétées sont **aussi sauvegardées en mémoire du serveur**
- Les citations viennent du serveur au lieu du fichier local
- Mais c'est optionnel : l'app marche 100% sans lui

---

## 3️⃣ SCHÉMA COMPLET

```
UTILISATEUR
    │
    ├─→ Ouvre navigateur
    │    ├─→ localStorage (React Context)
    │    │   └─ Données utilisateur, tâches, sessions
    │    │
    │    └─→ Ouvre l'app
    │         ├─ DashboardPage : fetch quote du backend (fallback local)
    │         ├─ TasksPage : crée/modifie tâches → localStorage
    │         ├─ TimerPage : Pomodoro timer
    │         └─ SessionPage : après finish → save dans localStorage
    │              + envoie aussi au backend (optionnel)
    │
    └─→ BACKEND (optionnel)
         ├─→ POST /api/sessions (reçoit sessions complétées)
         ├─→ GET /api/quotes/random (retourne citation)
         └─→ Stockage en mémoire (pas de base de données)
```

---

## 4️⃣ CAS 1 : SANS BACKEND

```
1. Utilisateur se connecte
   email + mot de passe → vérifié en JavaScript
   (pas d'envoi au serveur)
   
2. Données sauvegardées dans localStorage
   → Les tâches, sessions, préférences sont locales
   
3. Les citations viennent d'un fichier local (quotes.js)
   
4. Si l'utilisateur ferme la page et revient
   → Tout est restauré depuis le localStorage
```

**Avantage :** Marche offline, pas besoin de serveur
**Désavantage :** Données pas synchronisées entre appareils


---

## 5️⃣ CAS 2 : AVEC BACKEND

```
1. Utilisateur se connecte
   email + mot de passe → localStorage (vérification locale)
   
2. App démarre
   └─→ Essaie de fetch /api/quotes/random du backend
       ├─ Si backend actif → citation du serveur
       └─ Si backend éteint → citation locale (fallback)
   
3. Tâches créées
   └─→ Sauvegardées dans localStorage (priorité)
   
4. Session Pomodoro terminée
   └─→ Sauvegardée dans localStorage
   └─→ ET envoyée au backend (POST /api/sessions)
       ├─ Si backend actif → enregistrée
       └─ Si backend offline → ignorée silencieusement
       
5. Utilisateur peut query ses sessions du serveur
   └─→ GET /api/sessions/:userId
```

**Avantage :** Données historiques sur le serveur
**Désavantage :** Si backend éteint, les nouvelles sessions ne sont pas envoyées


---

## 6️⃣ EMAIL ET DONNÉES D'ENREGISTREMENT

### Format du compte :

```javascript
{
  id: "uuid-12345",
  email: "utilisateur@example.com",
  name: "Utilisateur",
  password: "hashed-password",  // Hashé en JavaScript
  createdAt: "2025-01-15T10:30:00Z"
}
```

### Où ils sont stockés ?

**localStorage du navigateur :**
```
localStorage['ff_user_[user-id]'] = {
  id: "abc-123",
  email: "toi@gmail.com",
  name: "Ahmed",
  password: "***" (pas en clair!)
}
```

### Sécurité :

⚠️ **Important** :
- Les mots de passe sont hachés en JavaScript (AuthContext.jsx)
- Pas envoyés au serveur en clair
- Stockés en hachage dans le localStorage
- Chaque navigateur a sa propre copie isolée


---

## 7️⃣ FLUX DÉTAILLÉ : L'UTILISATEUR CRÉE UNE TÂCHE

```
1. Utilisateur tape le titre dans TasksPage.jsx
   ↓
2. Clique "Add Task"
   ↓
3. Component appelle useTasks().addTask({...})
   ↓
4. TaskContext.jsx ajoute la tâche
   ├─ Crée un ID unique
   ├─ Ajoute timestamp
   └─ Sauvegarde dans localStorage
   ↓
5. Page se refresh (React re-render)
   ↓
6. Tâche visible dans la liste
```

---

## 8️⃣ FLUX DÉTAILLÉ : SESSION POMODORO

```
1. Utilisateur va sur TimerPage.jsx
   ↓
2. Sélectionne son niveau d'énergie (low/medium/high)
   ↓
3. Clique "Start Session"
   ↓
4. SessionContext.jsx génère une session
   └─ Ex: 50 min focus (high) / 5 min break
   ↓
5. Timer compte à rebours
   ↓
6. Session terminée
   ├─ Marquée comme "completed"
   ├─ Sauvegardée dans localStorage
   └─ Envoyée au backend (si actif)
       POST /api/sessions
       {
         userId: "abc-123",
         totalMinutes: 50,
         energyLevel: "high",
         taskCount: 3
       }
   ↓
7. Stats updated on Dashboard
```

---

## 9️⃣ CITATIONS : FONCTIONNEMENT

### Sans backend :

```javascript
// frontend/src/data/quotes.js
const QUOTES = [
  { text: "...", author: "..." },
  { text: "...", author: "..." },
  ...
]

// DashboardPage.jsx
const quote = getRandomQuote()  // Choix aléatoire local
```

### Avec backend :

```javascript
// DashboardPage.jsx
useEffect(() => {
  fetchRandomQuote().then(serverQuote => {
    if (serverQuote) 
      setQuote(serverQuote)  // Utilise celle du serveur
    else 
      setQuote(getRandomQuote())  // Fallback local
  })
}, [])

// backend/server.js
GET /api/quotes/random
→ Retourne une citation du serveur
```

---

## 🔟 TABLEAU RÉSUMÉ

| Feature | Frontend | Backend | Stockage |
|---------|----------|---------|----------|
| **Connexion/Inscription** | ✅ | ❌ | localStorage |
| **Créer tâches** | ✅ | ❌ | localStorage |
| **Modifier tâches** | ✅ | ❌ | localStorage |
| **Timer Pomodoro** | ✅ | ❌ | localStorage |
| **Citations** | ✅ Locale | ✅ API | Backend (optionnel) |
| **Sauvegarde sessions** | ✅ localStorage | ✅ Optionnel | Navigateur + Serveur |
| **Thème clair/sombre** | ✅ | ❌ | localStorage |
| **Statistiques** | ✅ Calculées | ❌ | localStorage |

---

## ❓ CAS D'USAGE

### Scénario 1 : Pas de backend

```
1. utilisateur@gmail.com se connecte
2. Crée 5 tâches
3. Lance une session de 50 min
4. Ferme l'ordi
5. Revient demain

→ Tout est là (localStorage)
→ App fonctionne offline
```

### Scénario 2 : Avec backend actif

```
1. utilisateur@gmail.com se connecte
2. Crée 5 tâches (sauvegardées localement)
3. Lance une session de 50 min
4. Session terminée
   → Sauvegardée dans localStorage
   → ET envoyée à POST /api/sessions
5. Backend enregistre : "utilisateur a fait 50 min aujourd'hui"
6. Utilisateur peut voir son historique complet
```

---

## 📊 ARCHITECTURE VISUELLE

```
┌─────────────────────────────────────────┐
│         NAVIGATEUR (Frontend)            │
├─────────────────────────────────────────┤
│                                          │
│  React App (Vite)                       │
│  ├─ AuthContext (login/register)        │
│  ├─ TaskContext (créer/éditer tâches)   │
│  ├─ SessionContext (sessions Pomodoro)  │
│  └─ ThemeContext (clair/sombre)         │
│                                          │
│  localStorage (données persistantes)    │
│  ├─ ff_user_[id]                        │
│  ├─ ff_tasks_[id]                       │
│  ├─ ff_sessions_[id]                    │
│  └─ ff_theme                            │
│                                          │
└─────────────────────────────────────────┘
          │
          │ (optionnel)
          │
          ↓
┌─────────────────────────────────────────┐
│      SERVEUR (Backend - Express.js)     │
├─────────────────────────────────────────┤
│                                          │
│  Routes :                               │
│  ├─ GET /api/quotes/random              │
│  ├─ POST /api/sessions                  │
│  └─ GET /api/sessions/:userId           │
│                                          │
│  Stockage (en mémoire)                  │
│  ├─ QUOTES array                        │
│  └─ completedSessions array             │
│                                          │
└─────────────────────────────────────────┘
```

---

## 🎓 RÉSUMÉ EN 3 PHRASES

1. **Frontend** = React app dans le navigateur, tout sauvegardé dans localStorage
2. **Backend** = Serveur optional qui reçoit les sessions et sert les citations
3. **Données** = D'abord locales (navigateur), optionnellement en mémoire serveur

---

## ⚡ RAPIDE DÉMARRAGE

```bash
# Backend (optionnel)
cd backend && npm install && npm start

# Frontend (obligatoire)
cd frontend && npm install && npm run dev

# App fonctionne à http://localhost:5173
```

Sans backend → App 100% fonctionnelle offline ✅
Avec backend → Features bonus ✨
