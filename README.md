# Plateforme de Dépôt de Projets ZIP

Une plateforme web complète permettant aux étudiants de déposer leurs projets en format ZIP.

## 🚀 Installation

### Prérequis
- Node.js (version 14 ou supérieure)
- npm (installé avec Node.js)

### Étapes d'installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Démarrer le serveur**
```bash
npm start
```

Le serveur démarrera sur `http://localhost:3000`

### Mode développement (avec rechargement automatique)
```bash
npm run dev
```

## 📋 Fonctionnalités

✅ Interface élégante et responsive
✅ Drag & drop pour les fichiers
✅ Validation des fichiers (format ZIP uniquement)
✅ Limite de taille (50 MB)
✅ Formulaire complet (nom, email, matière)
✅ Registre JSON des dépôts
✅ Gestion des erreurs
✅ Messages de confirmation
✅ Interface d'administration pour consulter les dépôts

## 📁 Structure des répertoires

```
.
├── depot_projets.html      # Page principale (frontend)
├── server.js               # Serveur Express (backend)
├── package.json            # Dépendances Node.js
├── README.md              # Ce fichier
└── uploads/               # Répertoire créé automatiquement
    ├── projets/           # Fichiers ZIP déposés
    └── registre_depots.json # Enregistrement JSON des dépôts
```

## 🎯 Utilisation

### Pour les étudiants

1. Ouvrir l'application dans le navigateur
2. Remplir les champs :
   - Nom et Prénom
   - Email
   - Matière/Cours
3. Glisser-déposer le fichier ZIP ou cliquer pour parcourir
4. Cliquer sur "Déposer le Projet"
5. Recevoir une confirmation

### Pour l'administrateur

**Consulter les dépôts (API)**
```
GET http://localhost:3000/api/admin/depots
```
Retourne une liste JSON de tous les dépôts.

**Télécharger un projet**
```
GET http://localhost:3000/api/download/FILENAME
```
Remplacer FILENAME par le nom du fichier.

## 📄 Formats acceptés

- **Format** : `.zip` uniquement
- **Taille maximale** : 50 MB
- **Tous les champs** : Obligatoires

## 🔧 Configuration

### Changer le port
Modifier la variable `PORT` dans `server.js` :
```javascript
const PORT = 3000; // Changer ici
```

### Changer la limite de taille
Modifier dans `server.js` :
```javascript
limits: {
    fileSize: 50 * 1024 * 1024 // Changer ici (en bytes)
}
```

### Ajouter des matières
Modifier dans `depot_projets.html` :
```html
<select id="matiere" name="matiere" required>
    <option value="">-- Sélectionnez une matière --</option>
    <option value="Programmation">Programmation</option>
    <!-- Ajouter vos matières ici -->
</select>
```

## 📧 Envoyer des notifications par email (optionnel)

Pour envoyer un email de confirmation, vous pouvez utiliser un service comme Nodemailer.

Installer :
```bash
npm install nodemailer
```

Exemple dans `server.js` :
```javascript
const nodemailer = require('nodemailer');

async function sendEmailNotification(nom, email, matiere) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'votre_email@gmail.com',
            pass: 'votre_mot_de_passe'
        }
    });

    const mailOptions = {
        from: 'votre_email@gmail.com',
        to: email,
        subject: 'Dépôt de projet reçu',
        html: `<h2>Bonjour ${nom}</h2><p>Votre projet pour ${matiere} a été reçu avec succès.</p>`
    };

    return transporter.sendMail(mailOptions);
}
```

## 🔐 Sécurité

⚠️ Recommandations pour la production :

1. **Authentification** : Ajouter une authentification des utilisateurs
2. **Validation** : Renforcer la validation côté serveur
3. **HTTPS** : Utiliser HTTPS en production
4. **Répertoire uploads** : Placer en dehors de la racine web
5. **Virus scan** : Ajouter une analyse antivirus des fichiers
6. **Rate limiting** : Limiter le nombre de requêtes par IP/utilisateur

## 📱 Responsive

L'application est entièrement responsive et fonctionne sur :
- 📱 Téléphones
- 📱 Tablettes
- 💻 Ordinateurs de bureau

## 🐛 Troubleshooting

**Le serveur ne démarre pas**
```bash
# Vérifier que le port 3000 est libre
# Ou changer le port dans server.js
```

**Erreur "Seuls les fichiers ZIP sont acceptés"**
- Vérifier que le fichier a bien l'extension `.zip`

**Erreur "Le fichier dépasse 50 MB"**
- Compresser davantage le fichier ZIP
- Ou augmenter la limite dans server.js

## 📝 Fichier registre_depots.json

Structure d'exemple :
```json
[
  {
    "nom": "Jean Dupont",
    "email": "jean.dupont@email.com",
    "matiere": "Programmation",
    "fichier": "1234567890_Jean_Dupont_projet.zip",
    "taille": 5242880,
    "dateDepot": "18/11/2025 15:30:45",
    "timestamp": "2025-11-18T15:30:45.123Z"
  }
]
```

## 📄 Licence

MIT - Libre d'utilisation

## 👨‍💻 Support

Pour toute question ou problème, consultez la documentation ou créez une issue.
