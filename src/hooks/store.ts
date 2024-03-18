import { create } from "zustand";

interface queryState{
    query: string;
    setQuery: (query: queryState['query'])=> void;
}

export const useQueryStore = create<queryState>((set)=>({
    query:'',
    setQuery:(query)=>{
        set(() => ({query:query}));
    }
}))

interface chamber {
    chamber: string;
    govToken: string;
    memberToken: string;
    deployer: string;
    serial: string;
}

export interface chambersState{
    chamberDeployeds: chamber[];
    setChambers: (data: chambersState['chamberDeployeds']) => Promise<void>;
}

export const useChambersStore = create<chambersState>((set)=>({
    chamberDeployeds: [],
    setChambers: async (data) => {
        set(()=>({chamberDeployeds: data}));
    }
}))

