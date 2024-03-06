import {
  Box,
  Button,
  Container,
  Flex
} from "@chakra-ui/react";

import Data from "../data.json";
import { Link } from "react-router-dom";
import Search  from "../components/Search";

import ChamberCard  from "../components/ChamberCard"
import ChamberCardSkeleton from "../components/ChamberCardSkeleton";

function Home() {
  const data = Data.HomeChambers;
  return (
    <>
    <Container maxWidth={"container.xl"}>
      <Box px={[5, 20]} >
        <Search/>
        <Flex rowGap={8} p={'20px'} flexWrap={'wrap'} justifyContent={'space-evenly'}  h={'min-content'} >
          {data.map( chamber =>(
            <Link key={chamber.serial} to={`/chamber/${chamber.chamber}`}>
              {
                data ? (
                  <ChamberCard 
                  title={chamber.title} // ens name
                  imageURL={chamber.imageURL} // ens avater
                  chamber={chamber.chamber}
                  serial={chamber.serial}
                  />
                ) : (
                  <ChamberCardSkeleton/>
                )
              }
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
