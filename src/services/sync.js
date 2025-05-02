import { getPendingSyncItems, clearSyncStore } from './db';

// API endpoint for syncing violations
const API_ENDPOINT = '/api/violations';

// Function to manually sync data with the server
export async function syncData() {
  // Don't attempt to sync if offline
  if (!navigator.onLine) {
    return { success: false, message: 'Cannot sync while offline' };
  }
  
  try {
    // Get all pending sync items
    const pendingItems = await getPendingSyncItems();
    
    if (pendingItems.length === 0) {
      return { success: true, message: 'No items to sync' };
    }
    
    // Process each sync item based on its action type
    const syncPromises = pendingItems.map(async (item) => {
      switch (item.syncAction) {
        case 'add':
          return fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          });
          
        case 'update':
          return fetch(`${API_ENDPOINT}/${item.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
          });
          
        case 'delete':
          return fetch(`${API_ENDPOINT}/${item.id}`, {
            method: 'DELETE',
          });
          
        default:
          console.warn(`Unknown sync action: ${item.syncAction}`);
          return null;
      }
    });
    
    // Wait for all sync operations to complete
    const results = await Promise.all(syncPromises);
    
    // Check for any failed requests
    const failedSyncs = results.filter(r => !r || !r.ok);
    
    if (failedSyncs.length > 0) {
      return { 
        success: false, 
        message: `Failed to sync ${failedSyncs.length} of ${results.length} items` 
      };
    }
    
    // Clear the sync store after successful sync
    await clearSyncStore();
    
    return { 
      success: true, 
      message: `Successfully synced ${results.length} items`,
      count: results.length
    };
    
  } catch (error) {
    console.error('Sync error:', error);
    return { 
      success: false, 
      message: `Sync failed: ${error.message}` 
    };
  }
}

// Set up event listeners for online/offline status
export function setupSyncListeners(callback) {
  // When coming back online, attempt to sync data
  window.addEventListener('online', async () => {
    const result = await syncData();
    if (callback && typeof callback === 'function') {
      callback(result);
    }
  });
  
  // Listen for messages from the service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        if (callback && typeof callback === 'function') {
          callback({
            success: true,
            message: `Background sync completed: ${event.data.payload.count} items synced`,
            count: event.data.payload.count
          });
        }
      }
    });
  }
}