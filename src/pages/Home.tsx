import {
  Box,
  Button,
  Container,
  Flex
} from "@chakra-ui/react";

import { Link } from "react-router-dom";
import Search  from "../components/Search";

import ChamberCard  from "../components/ChamberCard"
import ChamberCardSkeleton from "../components/ChamberCardSkeleton";

import {request } from 'graphql-request'
import { useQuery } from '@tanstack/react-query'

import { chambersState, useChambersState, useQueryStore } from "../hooks/store";
import { getChamberDeployedsQuery } from "../gql/graphql";
import Error from "./Error";

function Home() {
  const chambers = useChambersState((state)=> state.chamberDeployeds)
  const setChambers = useChambersState((state)=>state.setChambers)
  const query = useQueryStore((state)=>state.query)
  const getChamberDeployeds = getChamberDeployedsQuery
  const { data, isLoading, isError} = useQuery<chambersState>({
    queryKey: ['chamberDeployeds'],
    queryFn: async () => request(
      import.meta.env.VITE_SUBGRAPH_URL,
      getChamberDeployeds
    ),
    staleTime: Infinity,
  })
  if (isLoading === false){
    setChambers(data?data.chamberDeployeds:[])
  }

  if (isError){
    return (
      <>
        <Error/>
      </>
    )
  }

  return(
    <>
    <Container maxWidth={"container.xl"}>
      <Box px={[5, 20]} >
        <Search/>
        <Flex rowGap={8} p={'20px'} flexWrap={'wrap'} justifyContent={'space-evenly'}  h={'min-content'} >
          {chambers.length?chambers.filter((chamber) =>
            (chamber.chamber.toLowerCase().includes(query.toLowerCase())) ||
            (chamber.govToken.includes(query.toLowerCase())) ||
            (chamber.memberToken.includes(query.toLowerCase()))
          ).map( (chamber) =>(
            <Link key={chamber.serial} to={`/chamber/${chamber.chamber}`}>
                  <ChamberCard 
                  title={''} // ens name
                  imageURL={''} // ens avater
                  chamber={chamber.chamber}
                  serial={chamber.serial}
                  />
            </Link>
          )):(Array.from({ length: 9 }).map((_, index) => <ChamberCardSkeleton key={index} />)
          )}
        </Flex>
      </Box>
      <Box px={['1rem', '9rem']} pt={['1rem']} pb={['2rem']}>
        <Button variant={'outline'} w={'full'} rounded={'full'} isDisabled={chambers.length<9? false: true}>
          Load more
        </Button>
      </Box>
    </Container>
    </>
  );
}

export default Home;
