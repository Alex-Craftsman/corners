import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useSession = create<{
  sessionId: string;
}>()(
  persist(
    () => {
      if (typeof window !== 'undefined') {
        const storedSessionId = sessionStorage?.getItem('user-session') ?? null;

        if (storedSessionId) {
          try {
            const session = JSON.parse(storedSessionId);

            const sessionId = session?.state.sessionId;

            if (sessionId) {
              return {
                sessionId,
              };
            }
          } catch {
            // ignore
          }
        }
      }

      return {
        sessionId: uuidv4(),
      };
    },
    {
      name: 'user-session', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
