# CESIZen – Guide d'installation

## Prérequis

| Outil        | Version min | Vérification        |
|-------------|-------------|---------------------|
| Node.js     | 18.x        | `node -v`           |
| npm         | 9.x         | `npm -v`            |
| MySQL       | 8.x         | `mysql --version`   |

---

## 1. Base de données

### 1.1 Créer la base et les tables

```bash
mysql -u root -p < database/schema.sql
```

### 1.2 Insérer les données de démarrage (pages + exercices)

```bash
mysql -u root -p cesizen < database/seeds.sql
```

### 1.3 Créer les comptes admin et utilisateur test

```bash
cd backend
npm run seed
```

Comptes créés :
- **admin@cesizen.fr** / `Admin@cesizen1` (administrateur)
- **user@cesizen.fr**  / `User@cesizen1`  (utilisateur)

---

## 2. Backend (API Express)

### 2.1 Configuration

```bash
cd backend
cp .env.example .env
```

Éditez `.env` :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe_mysql
DB_NAME=cesizen
JWT_SECRET=une_cle_longue_et_secrete
```

### 2.2 Installer les dépendances

```bash
npm install
```

### 2.3 Démarrer le serveur

```bash
# Développement (rechargement automatique)
npm run dev

# Production
npm start
```

L'API est accessible sur **http://localhost:3001**

Vérification : `GET http://localhost:3001/api/health`

---

## 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

L'application est accessible sur **http://localhost:5173**

---

## 4. Tests automatisés

```bash
cd backend

# Tous les tests (nécessite MySQL avec DB_NAME_TEST configuré)
npm test

# Avec couverture de code
npm run test:coverage
```

> **Note :** Les tests créent et suppriment automatiquement la base `cesizen_test`.
> MySQL doit être accessible avec les credentials configurés dans `.env`.

---

## 5. Structure du projet

```
CESIZen/
├── database/
│   ├── schema.sql        ← MLD : création des tables
│   └── seeds.sql         ← Données initiales
├── backend/
│   ├── src/
│   │   ├── app.js        ← Application Express
│   │   ├── server.js     ← Point d'entrée
│   │   ├── config/       ← Connexion MySQL
│   │   ├── middleware/   ← JWT auth, isAdmin
│   │   ├── routes/       ← Routeurs Express
│   │   └── controllers/  ← Logique métier (SQL pur)
│   └── tests/            ← Tests Jest + Supertest
└── frontend/
    └── src/
        ├── context/      ← AuthContext (état global)
        ├── services/     ← API Axios
        ├── components/   ← Header, Footer, ProtectedRoute
        └── pages/        ← Toutes les pages React
```

---

## 6. Endpoints API principaux

| Méthode | Route                    | Accès       |
|---------|--------------------------|-------------|
| POST    | /api/auth/register       | Public      |
| POST    | /api/auth/login          | Public      |
| GET     | /api/auth/me             | Connecté    |
| GET     | /api/profile             | Connecté    |
| PUT     | /api/profile             | Connecté    |
| PUT     | /api/profile/password    | Connecté    |
| GET     | /api/pages               | Public      |
| GET     | /api/pages/slug/:slug    | Public      |
| POST    | /api/pages               | Admin       |
| PUT     | /api/pages/:id           | Admin       |
| DELETE  | /api/pages/:id           | Admin       |
| GET     | /api/breathing           | Public      |
| GET     | /api/breathing/:id       | Public      |
| POST    | /api/breathing           | Admin       |
| PUT     | /api/breathing/:id       | Admin       |
| DELETE  | /api/breathing/:id       | Admin       |
| GET     | /api/users               | Admin       |
| POST    | /api/users               | Admin       |
| PUT     | /api/users/:id           | Admin       |
| PATCH   | /api/users/:id/deactivate| Admin       |
| DELETE  | /api/users/:id           | Admin       |
