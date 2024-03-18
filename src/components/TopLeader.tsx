import { useReadContract } from "wagmi"
import { chamberAbi } from "../abi/chamberAbi"
import { useQuery } from '@tanstack/react-query'
import { useParams } from "react-router-dom"
import { getChamberByAddressQuery } from "../gql/graphql"
import request from "graphql-request"
import { sepolia } from "viem/chains"
import { erc20Abi } from "viem"
import LeaderRow from "./LeaderRow"
import { Center, Skeleton } from "@chakra-ui/react"
import { WarningTwoIcon } from "@chakra-ui/icons"
import { chambersState } from "../hooks/store"

function TopLeader() {
  const { address } = useParams();
  const getChamberByAddress = getChamberByAddressQuery
  const chamberDetails = useQuery<chambersState>({
    queryKey: ['chamberData'],
      queryFn: async () => request(
      'https://api.studio.thegraph.com/proxy/67520/loreum-registry-sepolia/v0.0.1',
      getChamberByAddress,
      {chamberAddress: address}
    ),
    staleTime: Infinity,
  })

  const leaderboard = useReadContract({
    abi: chamberAbi,
    address: `0x${address?.slice(2,42)}`,
    functionName:'getLeaderboard',
    chainId: sepolia.id,
  })
  const govTokenSymbol = useReadContract({
    abi: erc20Abi,
    address: `0x${(chamberDetails.data?.chamberDeployeds[0].govToken)?.slice(2.42)}`,
    functionName:'symbol',
    chainId: sepolia.id,
  })
  if ( 
    leaderboard.isLoading ||
    govTokenSymbol.isLoading ||
    chamberDetails.isLoading
  ){
    return(
      <>
        <Skeleton rounded={'lg'} p={'10px'} pl={'10px'} w={'full'} h={30} />
      </>
    )
  }
  if (leaderboard.isError ||
    govTokenSymbol.isError ||
    chamberDetails.isError){
      return (
        <>
          Some thing went wrong please refresh
        </>
      )
    }
  return (
    <div>
      {leaderboard.data && (leaderboard.data[0].length > 0)? Array.from({length: leaderboard.data[0].length}).map((_,index)=>{
        return (
          <>
            <LeaderRow 
            key={index}
            nftTokenID={leaderboard.data[0]?.at(index)?.toString() || '0'}
            delegation={parseInt((leaderboard.data[1]?.at(index))?.toString() || '0', 10)}
            govTokenSymbol={govTokenSymbol.data?.toString() || ''}
            />
          </>
        )
      }):(
        <>
        <Center gap={3}>
          <WarningTwoIcon/> No Leaders
        </Center>
        </>
      )}
    </div>
  )
}

export default TopLeader