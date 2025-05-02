import asyncLocalStorage, { setCurrentUserId, getCurrentUserId } from '../requestContext';

describe('AsyncLocalStorage for Request Context', () => {
  it('should initialize with no userId', () => {
    expect(getCurrentUserId()).toBeUndefined(); // No userId initially
  });

  it('should set and retrieve the userId in the current context', () => {
    asyncLocalStorage.run({}, () => {
      setCurrentUserId(123); // Set userId
      expect(getCurrentUserId()).toBe(123); // Retrieve userId
    });
  });

  it('should return undefined for userId outside of a context', () => {
    setCurrentUserId(123); // Attempt to set userId outside of a context
    expect(getCurrentUserId()).toBeUndefined(); // Should not persist outside context
  });

  it('should maintain userId separately in nested contexts', () => {
    asyncLocalStorage.run({}, () => {
      setCurrentUserId(123); // Set userId in outer context

      asyncLocalStorage.run({}, () => {
        setCurrentUserId(456); // Set userId in inner context
        expect(getCurrentUserId()).toBe(456); // Retrieve inner context userId
      });

      expect(getCurrentUserId()).toBe(123); // Retrieve outer context userId
    });
  });
});
