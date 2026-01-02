# Instructions de Publication

## Prérequis

1. **Se connecter à npm** (si pas déjà connecté) :
   ```bash
   npm login
   ```
   Vous devrez entrer :
   - Username: votre nom d'utilisateur npm
   - Password: votre mot de passe npm
   - Email: votre email npm

2. **Vérifier que vous êtes connecté** :
   ```bash
   npm whoami
   ```
   Doit afficher : `buba_71`

## Vérifications avant publication

1. **Tout compile** :
   ```bash
   npm run build
   ```

2. **Tous les tests passent** :
   ```bash
   npm test
   ```

3. **Version correcte** :
   Vérifier que `package.json` contient `"version": "0.8.2"`

4. **Fichiers inclus** :
   Le package inclut :
   - `dist/` (code compilé)
   - `templates/` (tous les templates)
   - `SOCIAL_CONTRACT.md`
   - `README.md`

## Publication

### Option 1: Publication normale
```bash
npm publish
```

### Option 2: Publication avec vérification
```bash
# Vérifier ce qui sera publié
npm pack --dry-run

# Si tout est correct, publier
npm publish
```

### Option 3: Publication avec tag (recommandé pour versions 0.x)
```bash
npm publish --tag latest
```

## Après publication

1. **Vérifier sur npm** :
   Visiter : https://www.npmjs.com/package/@buba_71/levit

2. **Tester l'installation** :
   ```bash
   npx @buba_71/levit@0.8.2 --version
   ```

3. **Créer un tag Git** (optionnel) :
   ```bash
   git tag v0.8.2
   git push origin v0.8.2
   ```

## Notes importantes

- Le package est publié sous le scope `@buba_71/levit`
- L'accès est public (`"access": "public"` dans package.json)
- Le script `prepublishOnly` compile automatiquement avant publication
- La version actuelle est **0.8.2**

## En cas d'erreur

Si vous obtenez une erreur 401 (Unauthorized) :
- Vérifiez que vous êtes connecté : `npm whoami`
- Réessayez : `npm login`
- Vérifiez les permissions sur le package `@buba_71/levit`

Si vous obtenez une erreur 403 (Forbidden) :
- Vérifiez que vous avez les droits de publication sur le scope `@buba_71`
- Contactez npm support si nécessaire

