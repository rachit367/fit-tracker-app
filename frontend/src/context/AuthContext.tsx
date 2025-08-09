import React, { createContext, useContext, useState, useEffect } from 'react';
import { User,Achievement } from '../types/fitness';
import { ACHIEVEMENTS, calculateLevel } from '../data/achievements';
import axios from 'axios';
const URL=import.meta.env.VITE_BACKEND_URL;

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, age: number, password: string, weight: number, fitnessGoal: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (name: string, email: string, age: number, weight: number, fitnessGoal: string) => Promise<void>;
  addXp: (amount: number) => Promise<void>;
  checkAchievements: () => Promise<Achievement[]>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const saveduser=async()=>{
    return axios.get(`${URL}/user`,{withCredentials: true})
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async ()=>{
      try {
    const savedUser = await saveduser();
    setUser(savedUser.data);
  } catch (err) {
    console.warn("User not logged in");
    setUser(null);
  } finally {
    setIsLoading(false);
  }
  }
  fetchUser();
  }, []);

  const login = async (email: string, password: string)=> {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await axios.post(`${URL}/user/login`,{email,password}, { withCredentials: true });
      
      if (response.data && response.data.success) {
        setIsLoading(false);
        setUser(response.data);
        return true;
      } else {
        setIsLoading(false);
        setUser(null);
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      setUser(null);
      return false;
    }
  };

  const register = async (name:string,email:string,age:number,password:string,weight:number,fitnessGoal:string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await axios.post(`${URL}/user/register`,{ name, email, age:Number(age), password, weight:Number(weight), fitnessGoal },
      { withCredentials: true });
      
      if (response.data && response.data.success) {
        setUser(response.data);
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
    setIsLoading(true);
    await axios.post(`${URL}/user/logout`, {}, {
      withCredentials: true,
    });
    setUser(null);
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setIsLoading(false);
  }
  };

  const updateProfile = async (name:string,email:string,age:number,weight:number,fitnessGoal:string) => {
    if (user) {
      const update={name:name,email:email,age:age,weight:weight,fitnessGoal:fitnessGoal,_id:user._id};
      const updatedUser=await axios.put(`${URL}/user/edit`,update,{ withCredentials: true });
      setUser(updatedUser.data);
    }
  };

  const addXp = async (amount: number) => {
    if (user) {
      const tentativeXp = user.xp + amount;
      const newXp = Math.max(0, tentativeXp);
      const newLevel = calculateLevel(newXp);
      let level = user.level;
      if (newLevel !== level) {
        level = newLevel;
        if (newLevel > user.level) {
          console.log(`Level up! You're now level ${level}!`);
        }
      }

      const updatedUser = await axios.put(`${URL}/dashboard/xp`, { id: user._id, xp: newXp, level: level }, { withCredentials: true });
      setUser(updatedUser.data);
    }
  };

  const checkAchievements = async(): Promise<Achievement[]> => {
    if (!user) return [];
    
    const newAchievements: Achievement[] = [];
    const userAchievementIds = user.achievements?.map(a => a.id) || [];
    
    ACHIEVEMENTS.forEach(achievement => {
      if (userAchievementIds.includes(achievement.id)) return;
      
      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'streak-3':
          shouldUnlock = user.streak >= 3;
          break;
        case 'streak-7':
          shouldUnlock = user.streak >= 7;
          break;
        case 'streak-30':
          shouldUnlock = user.streak >= 30;
          break;
        case 'workouts-10':
          shouldUnlock = user.totalWorkouts >= 10;
          break;
        case 'workouts-50':
          shouldUnlock = user.totalWorkouts >= 50;
          break;
        case 'workouts-100':
          shouldUnlock = user.totalWorkouts >= 100;
          break;
      }

        if (shouldUnlock) {
        const newAchievement={
          ...achievement,
          unlockedAt:new Date()
        };
        newAchievements.push(newAchievement);
      }
      }
    );
    
    if (newAchievements.length > 0) {
      let updatedUser=await axios.put(`${URL}/dashboard/add-achievement`,{achievements:newAchievements,id:user._id},{ withCredentials: true });
      setUser(updatedUser.data);
    }
    
    return newAchievements;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        addXp,
        checkAchievements,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
