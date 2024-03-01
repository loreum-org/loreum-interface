import {
  Box,
  Container,
  Flex,
} from "@chakra-ui/react";

import Data from "../data.json";
import { Link } from "react-router-dom";
import Search  from "../components/Search";

import ChamberCard  from "../components/ChamberCard"

function Home() {
  const data = Data.HomeChambers;
  return (
    <>
    <Container maxWidth={"container.xl"}>
    <Box px={[5, 20]} >
    <Search/>
    <Flex rowGap={8} p={'20px'} flexWrap={'wrap'} justifyContent={'space-evenly'}  h={'min-content'} >
      {data.map( chamber =>(
        <Link key={chamber.address} to={`/chamber/${chamber.address}`}>
          <ChamberCard 
          title={chamber.title}
          address={chamber.address}
          imageURL={chamber.imageURL}
          activeProposal={chamber.activeProposal}
          status={chamber.status}
          />
        </Link>
      ))}
    </Flex>
    </Box>
    </Container>
    </>
  );
}

export default Home;
