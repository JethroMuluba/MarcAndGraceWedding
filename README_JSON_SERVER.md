# Configuration JSON Server

Ce projet utilise JSON Server pour gérer les données des invités de manière dynamique.

## Installation

1. Installer les dépendances :
```bash
npm install
```

## Démarrage

Pour utiliser les fonctionnalités d'édition et de suppression, vous devez démarrer JSON Server dans un terminal séparé :

```bash
npm run json-server
```

Cela démarre JSON Server sur le port 3001 et surveille le fichier `db.json`.

## Utilisation

1. Dans un premier terminal, démarrez JSON Server :
```bash
npm run json-server
```

2. Dans un second terminal, démarrez l'application Next.js :
```bash
npm run dev
```

3. Accédez à l'application sur http://localhost:3000

## Fonctionnalités

- **Voir l'invitation** : Cliquez sur l'icône 👁️ (Eye) pour voir l'invitation de l'invité
- **Éditer** : Cliquez sur l'icône ✏️ (Pencil) pour modifier les informations d'un invité
- **Supprimer** : Cliquez sur l'icône 🗑️ (Trash) pour supprimer un invité

Les modifications sont sauvegardées dans le fichier `db.json` en temps réel.

## Structure des données

Les données sont stockées dans `db.json` avec la structure suivante :

```json
{
  "guests": [
    {
      "id": "0",
      "guestName": "Nom de l'invité",
      "guestTable": "Nom de la table"
    }
  ]
}
```

## Note

Si JSON Server n'est pas démarré, l'application utilisera les données statiques du fichier `src/data/data.json` comme fallback.
