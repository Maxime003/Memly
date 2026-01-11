# Guide de diagnostic Vercel - Problème de déploiement

## Problème
Les modifications du code ne semblent pas être déployées sur Vercel (l'indicateur de version n'apparaît pas).

## Étapes de diagnostic

### 1. Vérifier que le code est bien dans Git

```bash
# Vérifier les derniers commits
git log --oneline -5

# Vérifier que le code est bien dans le dernier commit
git show HEAD:src/pages/LibraryScreen.tsx | grep "DEBUG VERSION CHECK"
```

**Résultat attendu** : Vous devriez voir le texte "DEBUG VERSION CHECK" dans le fichier.

### 2. Vérifier le dashboard Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Vérifiez l'onglet **"Deployments"**
4. Vérifiez que le dernier déploiement :
   - A le bon commit hash (comparez avec `git log`)
   - A réussi (status "Ready")
   - A été créé après votre dernier push

### 3. Vérifier les logs de build Vercel

Dans le dashboard Vercel :
1. Cliquez sur le dernier déploiement
2. Allez dans l'onglet **"Build Logs"**
3. Vérifiez qu'il n'y a pas d'erreurs
4. Vérifiez que le build a bien compilé les fichiers TypeScript

### 4. Vérifier les variables d'environnement

Dans le dashboard Vercel :
1. Allez dans **Settings** → **Environment Variables**
2. Vérifiez que ces variables sont configurées :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Vérifiez qu'elles sont disponibles pour **Production**, **Preview**, et **Development**

### 5. Forcer un nouveau déploiement

Dans le dashboard Vercel :
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Sélectionnez **"Redeploy"**
4. Cochez **"Use existing Build Cache"** = **OFF** (pour forcer un rebuild complet)
5. Cliquez sur **"Redeploy"**

### 6. Vider le cache du navigateur

1. Ouvrez l'application Vercel dans un **navigateur en mode navigation privée**
2. Ou videz le cache :
   - Chrome/Edge : Ctrl+Shift+Delete (Windows) ou Cmd+Shift+Delete (Mac)
   - Cochez "Images et fichiers en cache"
   - Cliquez sur "Effacer les données"

### 7. Vérifier l'URL de déploiement

Assurez-vous d'aller sur la **bonne URL** :
- URL de production (si vous avez configuré un domaine)
- URL Vercel (ex: `votre-projet.vercel.app`)

### 8. Vérifier le code source dans Vercel

Dans le dashboard Vercel :
1. Allez dans **Settings** → **Git**
2. Vérifiez que le bon repository est connecté
3. Vérifiez que la bonne branche est configurée (généralement `main` ou `master`)

## Solution rapide : Forcer un rebuild complet

Si rien ne fonctionne, essayez ceci :

```bash
# Créer un commit vide pour forcer un nouveau déploiement
git commit --allow-empty -m "Force Vercel rebuild"
git push
```

## Vérification finale

Après avoir suivi ces étapes, vous devriez voir sur la page Bibliothèque :

Un **encadré rouge** avec :
- 🔴 [DEBUG VERSION CHECK] 🔴
- Version: 2025-01-15-v2
- Hostname: votre-domaine.vercel.app
- Et les informations sur les sujets

Si vous ne voyez **PAS** cet encadré rouge, le code n'est pas déployé.

## Prochaines étapes si le problème persiste

1. Vérifiez les logs de build Vercel pour des erreurs
2. Vérifiez que le script de build dans `package.json` est correct : `"build": "tsc -b && vite build"`
3. Contactez le support Vercel avec les logs de build
