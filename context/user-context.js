"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getLoggedInUserProfile } from "@/lib/appwrite/server/appwrite";

const UserContext = createContext(null);
const UserUpdateContext = createContext(null);

export function UserProvider({ children }) {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   const updateUser = async () => {
      try {
         const userData = await getLoggedInUserProfile();
         setUser(userData);
         return userData;
      } catch (error) {
         console.log("Error updating user:", error);
         return null;
      }
   };

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const userData = await getLoggedInUserProfile();
            setUser(userData);
         } catch (error) {
            console.log("Error fetching user:", error);
            setUser(null);
         } finally {
            setLoading(false);
         }
      };

      fetchUser();
   }, []);

   if (loading) {
      return null;
   }

   return (
      <UserContext.Provider value={user}>
         <UserUpdateContext.Provider value={updateUser}>
            {children}
         </UserUpdateContext.Provider>
      </UserContext.Provider>
   );
}

export function useUser() {
   const context = useContext(UserContext);
   if (context === undefined) {
      throw new Error("useUser must be used within a UserProvider");
   }
   return context;
}

export function useUpdateUser() {
   const context = useContext(UserUpdateContext);
   if (context === undefined) {
      throw new Error("useUpdateUser must be used within a UserProvider");
   }
   return context;
}
