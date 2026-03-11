import { create } from 'zustand'

const useAuthenticate = create((set) => ({
  isAuthenticated: false,
  adminUsername: ["@adarshhtaman:matrix.org"],
  logedInUser: null,
  authenticate: (user) => 
    set({ isAuthenticated: true, logedInUser: user }),

  unAuthenticate: () => 
    set({ isAuthenticated: false }),
}))

export { useAuthenticate }
