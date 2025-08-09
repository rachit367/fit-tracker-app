export function cleanupTemporaryStorage(): void {
  try {
    // Remove scroll preservation markers
    sessionStorage.removeItem('workoutBuilderScroll');
    sessionStorage.removeItem('scrollPosition');

    // Remove any transient feature flags or temp caches if we add them later
    const transientPrefixes = ['tmp:', 'transient:', 'cache:'];
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i);
      if (!key) continue;
      if (transientPrefixes.some((p) => key.startsWith(p))) {
        sessionStorage.removeItem(key);
      }
    }
  } catch (e) {
    // ignore storage errors (private mode etc.)
  }
}

export function cleanupAfterApiCall(): void {
  cleanupTemporaryStorage();
}