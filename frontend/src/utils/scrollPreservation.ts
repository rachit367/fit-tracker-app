// Scroll position preservation utility for development
let savedScrollPosition = 0;

export const saveScrollPosition = () => {
  savedScrollPosition = window.scrollY;
  sessionStorage.setItem('scrollPosition', savedScrollPosition.toString());
};

export const restoreScrollPosition = () => {
  const saved = sessionStorage.getItem('scrollPosition');
  if (saved) {
    const position = parseInt(saved);
    setTimeout(() => {
      window.scrollTo(0, position);
      sessionStorage.removeItem('scrollPosition');
    }, 50);
  }
};

// Auto-save scroll position on scroll
export const initScrollPreservation = () => {
  let scrollTimeout: NodeJS.Timeout;
  
  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      saveScrollPosition();
    }, 100);
  };

  window.addEventListener('scroll', handleScroll);
  
  // Restore position on page load
  restoreScrollPosition();
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(scrollTimeout);
  };
}; 