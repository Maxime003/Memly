import type { Subject, MindMapNode } from '../types'

// Mind Map de démonstration pour le sujet test
const demoMindMap: MindMapNode = {
  id: 'root',
  text: 'Introduction à React Hooks',
  description: 'Les fondamentaux des React Hooks pour la gestion d\'état et les effets de bord',
  children: [
    {
      id: 'useState',
      text: 'useState',
      description: 'Hook pour gérer l\'état local d\'un composant',
      children: [
        {
          id: 'useState-basic',
          text: 'Syntaxe de base',
          description: 'const [state, setState] = useState(initialValue)',
        },
        {
          id: 'useState-update',
          text: 'Mise à jour',
          description: 'setState(newValue) ou setState(prev => prev + 1)',
        },
      ],
    },
    {
      id: 'useEffect',
      text: 'useEffect',
      description: 'Hook pour gérer les effets de bord (side effects)',
      children: [
        {
          id: 'useEffect-basic',
          text: 'Syntaxe',
          description: 'useEffect(() => { effect }, [dependencies])',
        },
        {
          id: 'useEffect-cleanup',
          text: 'Nettoyage',
          description: 'Return une fonction de cleanup pour éviter les fuites mémoire',
        },
      ],
    },
    {
      id: 'useContext',
      text: 'useContext',
      description: 'Hook pour accéder au contexte React',
      children: [
        {
          id: 'useContext-basic',
          text: 'Création du contexte',
          description: 'const MyContext = createContext(defaultValue)',
        },
        {
          id: 'useContext-usage',
          text: 'Utilisation',
          description: 'const value = useContext(MyContext)',
        },
      ],
    },
    {
      id: 'custom-hooks',
      text: 'Hooks personnalisés',
      description: 'Créer ses propres hooks pour réutiliser la logique',
      children: [
        {
          id: 'custom-hooks-pattern',
          text: 'Pattern',
          description: 'Fonction qui commence par "use" et peut appeler d\'autres hooks',
        },
        {
          id: 'custom-hooks-example',
          text: 'Exemple',
          description: 'useLocalStorage, useFetch, useDebounce, etc.',
        },
      ],
    },
  ],
}

// Sujet de test complet
export const demoSubject: Subject = {
  id: 'demo-subject-1',
  title: 'Introduction à React Hooks',
  context: 'course',
  rawNotes: `React Hooks sont des fonctions qui permettent d'utiliser l'état et d'autres fonctionnalités React dans les composants fonctionnels.

useState permet de gérer l'état local. On l'utilise comme ceci : const [count, setCount] = useState(0).

useEffect sert à gérer les effets de bord comme les appels API, les abonnements, etc. Il prend une fonction et un tableau de dépendances.

useContext permet d'accéder au contexte React sans avoir besoin de composants intermédiaires.

On peut aussi créer des hooks personnalisés pour réutiliser la logique entre composants.`,
  mindMap: demoMindMap,
  difficultyFactor: 2.5,
  reviewCount: 0,
  lastInterval: 0,
  createdAt: new Date('2024-01-15'),
  nextReviewAt: new Date(), // À réviser aujourd'hui
}

// Liste de sujets de test (pour la bibliothèque)
export const mockSubjects: Subject[] = [
  demoSubject,
  {
    id: 'demo-subject-2',
    title: 'Les bases de TypeScript',
    context: 'course',
    rawNotes: 'TypeScript est un sur-ensemble de JavaScript qui ajoute le typage statique.',
    mindMap: {
      id: 'root-2',
      text: 'Les bases de TypeScript',
      children: [
        {
          id: 'types',
          text: 'Types de base',
          children: [
            { id: 'string', text: 'string' },
            { id: 'number', text: 'number' },
            { id: 'boolean', text: 'boolean' },
          ],
        },
        {
          id: 'interfaces',
          text: 'Interfaces',
          description: 'Définir la structure des objets',
        },
      ],
    },
    difficultyFactor: 2.5,
    reviewCount: 1,
    lastInterval: 1,
    createdAt: new Date('2024-01-10'),
    nextReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
  },
  {
    id: 'demo-subject-3',
    title: 'Clean Code - Robert C. Martin',
    context: 'book',
    rawNotes: 'Les principes du code propre : nommage, fonctions courtes, commentaires utiles.',
    mindMap: {
      id: 'root-3',
      text: 'Clean Code',
      children: [
        {
          id: 'naming',
          text: 'Nommage',
          description: 'Noms explicites et intentionnels',
        },
        {
          id: 'functions',
          text: 'Fonctions',
          description: 'Fonctions courtes et avec une seule responsabilité',
        },
      ],
    },
    difficultyFactor: 2.3,
    reviewCount: 2,
    lastInterval: 3,
    createdAt: new Date('2024-01-05'),
    nextReviewAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
  },
]
