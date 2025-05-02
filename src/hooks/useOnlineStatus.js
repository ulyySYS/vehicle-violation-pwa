import { useState, useEffect } from 'react';

// Custom hook to track online/offline status
function useOnlineStatus() {
  // Default to the browser's current online status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Event handler for when the browser goes online
    const handleOnline = () => {
      setIsOnline(true);
    };

    // Event handler for when the browser goes offline
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Register the event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up by removing the listeners on component unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export default useOnlineStatus;