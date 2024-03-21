import { useQuery } from '@tanstack/react-query';
import { ERC20 } from '../hooks/interfaces';

export const useFetchTokens = (chamberAddress: string) => {
    return useQuery<ERC20[]>({
        queryKey:['tokenData'], 
        queryFn: async ():Promise<ERC20[]> => {
            const response = await fetch(
              `https://deep-index.moralis.io/api/v2.2/${chamberAddress}/erc20?chain=sepolia`,
              {
                headers: {
                  'accept': 'application/json',
                  'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
                }
              }
            );
          
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
          
            return response.json();
          }
    });
};
interface balance{
    balance:string
}
export const useFetchNativeBalance = (chamberAddress: string) => {
    return useQuery<balance>({
        queryKey:['tokenData'], 
        queryFn: async ():Promise<balance> => {
            const response = await fetch(
              `https://deep-index.moralis.io/api/v2.2/${chamberAddress}/balance?chain=sepolia`,
              {
                headers: {
                  'accept': 'application/json',
                  'X-API-Key': import.meta.env.VITE_MORALIS_API_KEY
                }
              }
            );
          
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
          
            return response.json();
          }
    });
};