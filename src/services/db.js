import { openDB } from 'idb';

// Database name and version
const DB_NAME = 'vehicle-violations-db';
const DB_VERSION = 1;

// Store names
const VIOLATIONS_STORE = 'violations';
const SYNC_STORE = 'sync-store';

// Initialize the database
export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create violations store if it doesn't exist
      if (!db.objectStoreNames.contains(VIOLATIONS_STORE)) {
        const violationsStore = db.createObjectStore(VIOLATIONS_STORE, { keyPath: 'id' });
        // Create indexes for querying
        violationsStore.createIndex('timestamp', 'timestamp');
        violationsStore.createIndex('plateNumber', 'plateNumber');
      }
      
      // Create sync store for offline data that needs to be synced
      if (!db.objectStoreNames.contains(SYNC_STORE)) {
        db.createObjectStore(SYNC_STORE, { keyPath: 'id' });
      }
    },
  });
}

// Add a new violation
export async function addViolation(violation) {
  const db = await initDB();
  
  // Generate unique ID if not provided
  if (!violation.id) {
    violation.id = Date.now().toString();
  }
  
  // Ensure timestamp exists
  if (!violation.timestamp) {
    violation.timestamp = new Date().toISOString();
  }
  
  // Add to violations store
  await db.add(VIOLATIONS_STORE, violation);
  
  // If offline, also add to sync store for later syncing
  if (!navigator.onLine) {
    await db.add(SYNC_STORE, {
      ...violation,
      syncAction: 'add'
    });
    
    // Register for background sync if supported
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      try {
        await registration.sync.register('sync-violations');
      } catch (err) {
        console.log('Background sync could not be registered:', err);
      }
    }
  }
  
  return violation;
}

// Get all violations
export async function getViolations() {
  const db = await initDB();
  return db.getAll(VIOLATIONS_STORE);
}

// Get a specific violation by ID
export async function getViolation(id) {
  const db = await initDB();
  return db.get(VIOLATIONS_STORE, id);
}

// Update a violation
export async function updateViolation(violation) {
  const db = await initDB();
  
  // If offline, add to sync store
  if (!navigator.onLine) {
    await db.put(SYNC_STORE, {
      ...violation,
      syncAction: 'update'
    });
    
    // Register for background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-violations');
    }
  }
  
  return db.put(VIOLATIONS_STORE, violation);
}

// Delete a violation
export async function deleteViolation(id) {
  const db = await initDB();
  
  // If offline, add to sync store
  if (!navigator.onLine) {
    await db.put(SYNC_STORE, {
      id,
      syncAction: 'delete',
      timestamp: new Date().toISOString()
    });
    
    // Register for background sync
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register('sync-violations');
    }
  }
  
  return db.delete(VIOLATIONS_STORE, id);
}

// Query violations by plate number
export async function searchViolationsByPlate(plateNumber) {
  const db = await initDB();
  const tx = db.transaction(VIOLATIONS_STORE, 'readonly');
  const index = tx.store.index('plateNumber');
  
  // Get all violations and filter by plate number (case insensitive)
  const violations = await db.getAll(VIOLATIONS_STORE);
  return violations.filter(v => 
    v.plateNumber.toLowerCase().includes(plateNumber.toLowerCase())
  );
}

// Get pending sync items
export async function getPendingSyncItems() {
  const db = await initDB();
  return db.getAll(SYNC_STORE);
}

// Clear sync store after successful sync
export async function clearSyncStore() {
  const db = await initDB();
  return db.clear(SYNC_STORE);
}