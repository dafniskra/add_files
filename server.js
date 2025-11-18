const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Créer les répertoires s'ils n'existent pas
const uploadDir = '/var/data/uploads';
if (!fs.existsSync(uploadDir)) {           
    fs.mkdirSync(uploadDir, { recursive: true });
}   
const projectsDir = path.join(uploadDir, 'projets');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
}

// Configuration de multer pour les uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, projectsDir);
    },
    filename: (req, file, cb) => {
        // Créer un nom unique pour chaque fichier
        const timestamp = Date.now();
        const nom = req.body.nom.replace(/\s+/g, '_');
        const newFilename = `${timestamp}_${nom}_${file.originalname}`;
        cb(null, newFilename);
    }
});

// Filtrer les fichiers (accepter uniquement les ZIP)
const fileFilter = (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() === '.zip') {
        cb(null, true);
    } else {
        cb(new Error('Seuls les fichiers ZIP sont acceptés'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50 MB
    }
});

// Middleware
app.use(cors());
app.use(express.static(__dirname));
app.use(express.json());

// Route pour servir le fichier HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'depot_projets.html'));
});

// Route pour l'upload
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        const { nom, email, matiere, timestamp } = req.body;

        if (!nom || !email || !matiere || !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Tous les champs sont obligatoires'
            });
        }

        // Créer un enregistrement du dépôt
        const deposData = {
            nom: nom,
            email: email,
            matiere: matiere,
            fichier: req.file.filename,
            taille: req.file.size,
            dateDepot: new Date().toLocaleString('fr-FR'),
            timestamp: timestamp
        };

        // Sauvegarder dans un fichier JSON
        const registreFile = path.join(uploadDir, 'registre_depots.json');
        let depots = [];

        if (fs.existsSync(registreFile)) {
            const data = fs.readFileSync(registreFile, 'utf8');
            depots = JSON.parse(data);
        }

        depots.push(deposData);
        fs.writeFileSync(registreFile, JSON.stringify(depots, null, 2), 'utf8');

        // Envoyer un email (optionnel - vous devez configurer un service d'email)
        // sendEmailNotification(nom, email, matiere);

        res.json({
            success: true,
            message: 'Projet déposé avec succès',
            data: deposData
        });

    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'upload: ' + error.message
        });
    }
});

// Route pour voir le registre des dépôts (administration)
app.get('/api/admin/depots', (req, res) => {
    try {
        const registreFile = path.join(uploadDir, 'registre_depots.json');
        
        if (!fs.existsSync(registreFile)) {
            return res.json([]);
        }

        const data = fs.readFileSync(registreFile, 'utf8');
        const depots = JSON.parse(data);
        res.json(depots);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur: ' + error.message
        });
    }
});

// Route pour télécharger un projet (administration)
app.get('/api/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filepath = path.join(projectsDir, filename);

        // Vérifier que le fichier existe
        if (!fs.existsSync(filepath)) {
            return res.status(404).json({
                success: false,
                message: 'Fichier non trouvé'
            });
        }

        res.download(filepath);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur: ' + error.message
        });
    }
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Le fichier dépasse la taille maximale de 50 MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Erreur lors de l\'upload: ' + err.message
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || 'Erreur lors de l\'upload'
        });
    }

    next();
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`Les projets sont sauvegardés dans: ${projectsDir}`);
});
