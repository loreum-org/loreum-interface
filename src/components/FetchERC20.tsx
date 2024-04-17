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
      },
    });
};
interface balance{
    balance:string
}
export const useFetchNativeBalance = (chamberAddress: string) => {
    return useQuery<balance>({
        queryKey:['NativeBalance'], 
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
        },
    });
};

interface NftData {
  status: string,
  page: string,
  page_size: string,
  cursor: string,
  result:{
    amount : string,
    token_id : string,
    token_address : string,
    contract_type : string,
    owner_of : string,
    last_metadata_sync : string,
    last_token_uri_sync : string,
    metadata : string,
    block_number : string,
    block_number_minted : string,
    name : string,
    symbol : string,
    token_hash : string,
    token_uri : string,
    minter_address : string,
    verified_collection : boolean,
    possible_spam : boolean,
    media : {
      status : string,
      updatedAt : string,
      mimetype : string,
      parent_hash : string,
      media_collection : {
        low : {
          width : number,
          height : number,
          url : string,
        },
        medium : {
          width : number,
          height : number,
          url : string,
        },
        high : {
          width : number,
          height : number,
          url : string,
        },
      },
      original_media_url: string,
    },
    collection_logo: string,
    collection_banner_image: string}[]
}

export const useFetchNfts = (chamberAddress: string) => {
  return useQuery<NftData>({
    queryKey:['NftData'],
    queryFn: async ():Promise<NftData> => {
      const response = await fetch(
        `https://deep-index.moralis.io/api/v2.2/${chamberAddress}/nft?chain=sepolia&format=decimal&media_items=true`,
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
    },
  });
}