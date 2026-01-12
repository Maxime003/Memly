/**
 * Gestion des notifications navigateur via Web Notifications API
 */

export type NotificationPermission = 'default' | 'granted' | 'denied'

/**
 * Demande la permission pour afficher des notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Ce navigateur ne supporte pas les notifications')
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    return 'denied'
  }

  // Permission est 'default', on demande
  const permission = await Notification.requestPermission()
  return permission as NotificationPermission
}

/**
 * Vérifie si les notifications sont supportées et autorisées
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window
}

/**
 * Vérifie si la permission est accordée
 */
export function hasNotificationPermission(): boolean {
  if (!isNotificationSupported()) {
    return false
  }
  return Notification.permission === 'granted'
}

/**
 * Affiche une notification immédiate
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  console.log('[Notifications] showNotification called', { title, options })
  
  // Vérifier le support
  if (!isNotificationSupported()) {
    console.error('[Notifications] Notifications not supported in this browser')
    return null
  }

  // Vérifier la permission
  const permission = window.Notification.permission
  console.log('[Notifications] Current permission:', permission)
  
  if (permission !== 'granted') {
    console.warn('[Notifications] Permission not granted:', permission)
    return null
  }

  // Vérifier le contexte de sécurité
  const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost'
  if (!isSecureContext) {
    console.error('[Notifications] Not in secure context (HTTPS or localhost required)')
    return null
  }

  try {
    // Options de notification
    // requireInteraction est défini par les options si fourni, sinon false pour les notifications normales
    const notificationOptions: NotificationOptions = {
      body: options?.body || '',
      tag: options?.tag || 'default',
      requireInteraction: options?.requireInteraction ?? false, // Par défaut false pour les notifications normales
      silent: options?.silent ?? false,
      ...options,
    }

    // Ne pas inclure l'icône si elle n'existe pas, ça peut causer des problèmes
    if (options?.icon) {
      notificationOptions.icon = options.icon
    }
    if (options?.badge) {
      notificationOptions.badge = options.badge
    }

    const notification = new Notification(title, notificationOptions)

    // Gérer les événements de la notification
    notification.onclick = () => {
      window.focus()
      // Fermer après un court délai pour permettre à l'utilisateur de voir qu'elle a été cliquée
      setTimeout(() => {
        notification.close()
      }, 500)
    }

    notification.onerror = (error) => {
      console.error('[Notifications] Notification error:', error)
    }

    // Fermer automatiquement après 5 secondes pour les notifications normales
    // Si requireInteraction est true, la notification restera jusqu'à interaction utilisateur
    if (!notificationOptions.requireInteraction) {
      setTimeout(() => {
        notification.close()
      }, 5000)
    } else {
      // Pour les notifications avec requireInteraction, timeout de sécurité après 30 secondes
      setTimeout(() => {
        notification.close()
      }, 30000)
    }

    return notification
  } catch (error) {
    console.error('[Notifications] Error creating notification:', error)
    console.error('[Notifications] Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return null
  }
}

/**
 * Calcule le temps jusqu'à la prochaine notification programmée
 * @param time Heure au format HH:mm (ex: "09:00")
 * @returns Nombre de millisecondes jusqu'à la prochaine occurrence de cette heure
 */
export function getTimeUntilNotification(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  const now = new Date()
  const targetTime = new Date()
  
  targetTime.setHours(hours, minutes, 0, 0)
  
  // Si l'heure est déjà passée aujourd'hui, programmer pour demain
  if (targetTime <= now) {
    targetTime.setDate(targetTime.getDate() + 1)
  }
  
  return targetTime.getTime() - now.getTime()
}

/**
 * Programme une notification pour une heure spécifique
 * Note: Les notifications programmées nécessitent un Service Worker
 * Pour l'instant, on utilise setInterval comme solution simple
 */
export function scheduleNotification(
  time: string,
  title: string = 'Rappel de révision',
  message: string = 'Il est temps de réviser vos sujets !'
): () => void {
  if (!hasNotificationPermission()) {
    console.warn('Permission de notification non accordée')
    return () => {}
  }

  const timeUntil = getTimeUntilNotification(time)
  
  // Programmer la première notification
  const timeoutId = setTimeout(() => {
    showNotification(title, {
      body: message,
      tag: 'review-reminder',
      requireInteraction: false,
    })
    
    // Programmer les notifications suivantes (tous les jours à la même heure)
    const dailyInterval = 24 * 60 * 60 * 1000 // 24 heures en millisecondes
    const intervalId = setInterval(() => {
      showNotification(title, {
        body: message,
        tag: 'review-reminder',
        requireInteraction: false,
      })
    }, dailyInterval)
    
    // Stocker l'intervalId pour pouvoir l'annuler
    // Note: Dans une vraie app, vous devriez utiliser un Service Worker
    // et l'API Notification Scheduling pour une meilleure gestion
    ;(window as any).__notificationIntervalId = intervalId
  }, timeUntil)

  // Retourner une fonction pour annuler la notification
  return () => {
    clearTimeout(timeoutId)
    if ((window as any).__notificationIntervalId) {
      clearInterval((window as any).__notificationIntervalId)
      delete (window as any).__notificationIntervalId
    }
  }
}

/**
 * Annule toutes les notifications programmées
 */
export function cancelScheduledNotifications(): void {
  if ((window as any).__notificationIntervalId) {
    clearInterval((window as any).__notificationIntervalId)
    delete (window as any).__notificationIntervalId
  }
}

/**
 * Teste les notifications en affichant une notification immédiate
 * Utile pour vérifier que les notifications fonctionnent
 * IMPORTANT: Doit être appelée directement depuis un gestionnaire d'événement utilisateur
 */
export function testNotification(): Promise<boolean> {
  return new Promise((resolve) => {
    // Vérifications
    if (!isNotificationSupported()) {
      console.error('[Notifications] Browser does not support notifications')
      resolve(false)
      return
    }

    const permission = window.Notification.permission
    if (permission !== 'granted') {
      console.warn('[Notifications] Permission not granted. Current status:', permission)
      resolve(false)
      return
    }

    // Vérifier le contexte de sécurité
    const isSecureContext = window.isSecureContext || location.protocol === 'https:' || location.hostname === 'localhost'
    if (!isSecureContext) {
      console.error('[Notifications] Not in secure context. HTTPS or localhost required.')
      resolve(false)
      return
    }

    const notification = showNotification('Test de notification', {
      body: 'Si vous voyez cette notification, les notifications fonctionnent correctement ! 🎉',
      tag: 'test-notification',
      requireInteraction: true, // Forcer l'interaction pour être sûr qu'elle reste visible
      silent: false, // Jouer un son
      // Ne pas inclure l'icône si elle peut causer des problèmes
    })

    if (notification) {
      // Résoudre après que la notification soit affichée
      setTimeout(() => {
        resolve(true)
      }, 100)
    } else {
      console.error('[Notifications] Failed to create test notification')
      resolve(false)
    }
  })
}

/**
 * Programme une notification de test dans X secondes
 * Utile pour tester la programmation des notifications
 * @param seconds Nombre de secondes avant d'afficher la notification
 */
export function scheduleTestNotification(seconds: number = 5): () => void {
  if (!hasNotificationPermission()) {
    console.warn('[Notifications] Permission not granted for scheduled test')
    return () => {}
  }

  const timeoutId = setTimeout(() => {
    showNotification('Test de notification programmée', {
      body: `Notification programmée il y a ${seconds} secondes. Les notifications programmées fonctionnent ! ✅`,
      tag: 'test-scheduled-notification',
      requireInteraction: true, // Forcer l'interaction pour les tests
      silent: false,
    })
  }, seconds * 1000)

  return () => {
    clearTimeout(timeoutId)
  }
}
