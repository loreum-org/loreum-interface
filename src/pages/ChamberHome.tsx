import { useQuery } from "@tanstack/react-query"
import { chambersState } from "../hooks/store"
import request from "graphql-request"
import { getChamberByAddressQuery } from "../gql/graphql"
import { useParams } from "react-router-dom"
import NotFoundPage from "./NotFoundPage"
import { dataSource } from "../data"

const ChamberHome = () => {
  const {address} = useParams()
  const chamberDetails = useQuery<chambersState>({
    queryKey: ['chamberData'],
    queryFn: async () => request(
      dataSource.subgraphUrl,
      getChamberByAddressQuery,
      {chamberAddress: address}
    ),
  })
  if(chamberDetails.isRefetching){
    return(
      <>
      Loading...
      </>
    )
  }
  if(chamberDetails.isError){
    return(
      <>
      Error
      </>
    )
  }
  if(chamberDetails.data?.chamberDeployeds.length === 0){
    return(
      <NotFoundPage/>
    )
  }
  return (
    <div>
      EC20  Token : {chamberDetails.data?.chamberDeployeds[0].govToken}<br/>
      EC721 Token : {chamberDetails.data?.chamberDeployeds[0].memberToken}
    </div>
  )
}

export default ChamberHome