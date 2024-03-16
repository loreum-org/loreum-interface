import { useReadContract } from "wagmi"
import { chamberAbi as abi} from "../abi/chamberAbi"
import { sepolia } from "viem/chains"
import Moralis  from "moralis"
import { create } from "zustand"
import { useParams } from "react-router-dom"

// type State = {
//   nftAddress: string[];
// }

// type Action = {
//   addNftAddress: (nftAddress: string) => void;
// }

// const useStore = create<State & Action>((set)=>({
//   nftAddress: [],
//   addNftAddress: (nftAddress: string)=>{
//     set((state)=>({
//       nftAddress:[
//         ...state.nftAddress,
//         nftAddress
//       ]
//     }))
//   }
// }))

// const getTokenDetail = async ({tokenID}:Props2) => {
//   await Moralis.start({
//     apiKey: "",
//   })
//   const address = "";
//   const chain = sepolia.id;
//   const tokenId = tokenID;
//   const response = await Moralis.EvmApi.nft.getNFTTokenIdOwners({
//     address,
//     chain,
//     tokenId,
//   });
//   return response.result[0].ownerOf;
// }

function TopLeader() {
  const {address} = useParams()
  const {data, isLoading} = useReadContract({
    abi,
    address: `0x${address?.slice(2.42)}`,
    functionName:'getLeaderboard',
    chainId: sepolia.id,
  })
  if(isLoading){
    return(
    <>
    Loding...
    </>)
  }
  return (
    <div>
      {data?.[0].toLocaleString()}
      {data?.[1].toLocaleString()}
    </div>
  )
}

export default TopLeader


// {leaders.map(leader => (
//   <LeaderRowData address={leader.address?leader.address:''} isize={20} delegation={leader.delegation} tokenSymbol='LORE' ensName={leader.ensName} />
// ))}