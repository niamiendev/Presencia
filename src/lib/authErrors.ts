export const getAuthErrorMessage = (code?: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Adresse e-mail invalide.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou mot de passe incorrect.'
    case 'auth/email-already-in-use':
      return 'Cette adresse e-mail est déjà utilisée.'
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible (6 caractères minimum).'
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard.'
    case 'auth/network-request-failed':
      return 'Problème de connexion réseau.'
    default:
      return 'Une erreur est survenue. Veuillez réessayer.'
  }
}