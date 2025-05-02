import { AsyncLocalStorage } from 'node:async_hooks';

// Create an instance of AsyncLocalStorage
const asyncLocalStorage = new AsyncLocalStorage<{ userId?: number }>();

// Function to set userId in the current context
export const setCurrentUserId = (userId: number | undefined) => {
  const store = asyncLocalStorage.getStore();
  if (store) {
    store.userId = userId;
  }
};

// Function to get userId from the current context
export const getCurrentUserId = (): number | undefined => {
  const store = asyncLocalStorage.getStore();
  return store?.userId;
};

// Export the AsyncLocalStorage instance for binding requests
export default asyncLocalStorage;
