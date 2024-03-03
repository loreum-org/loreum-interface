import {
  Box,
  Button,
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
            <Link key={chamber.chamber} to={`/chamber/${chamber.chamber}`}>
              <ChamberCard 
              chamber={chamber.chamber}
              imageURL={chamber.imageURL}
              title={chamber.title}
              govToken={chamber.govToken}
              memberToken={chamber.memberToken}
              deployer={chamber.deployer}
              serial={chamber.serial}
              />
            </Link>
          ))}
        </Flex>
      </Box>
      <Box px={['1rem', '9rem']} pt={['1rem']} pb={['2rem']}>
        <Button variant={'outline'} w={'full'} rounded={'full'}>
          Load more
        </Button>
      </Box>
    </Container>
    </>
  );
}

export default Home;
