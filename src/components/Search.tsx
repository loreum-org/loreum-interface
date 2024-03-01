import { Input, Button, Hide, useColorModeValue, Grid, Box, InputGroup, InputRightElement, GridItem, FormControl } from "@chakra-ui/react";
import Data from "../data.json";

import { Link } from "react-router-dom";
import { create } from "zustand"

type State = {
    query: string
}
type Action = {
    setQuery: (query: State['query']) => void
}

const useQueryStore = create<State & Action>((set) => ({
    query: '',
    setQuery: (query) => set(()=> ({query: query }))
}))

function Search() {
  const bg = useColorModeValue("gray.200", "gray.700");
  const data = Data.HomeChambers;
  const query = useQueryStore((state)=> state.query)
  const setQuery = useQueryStore((state)=> state.setQuery)
  return (
    <>
      <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} pt={4} opacity={'70%'} fontFamily={'Cairo'} rowGap={2} alignItems={'center'}>
            <Hide breakpoint="(max-width: 430px)">
                <Box pl={'5px'}>
                    {data.length} Chamber(s)
                </Box>
            </Hide>
        <GridItem >
            <FormControl>
            <InputGroup size='md'>
                <Input 
                onChange={(e) => setQuery(e.currentTarget.value)}
                value={query}
                pr='4.5rem' variant={'filled'} placeholder='Enter Chamber Address' rounded={'full'}/>
                <InputRightElement width='5rem' borderLeft={'1px'}  borderColor={bg}>
                    <Link to={`/chamber/${query}`}>
                        <Button h='1.75rem' type={'submit'} rounded={'full'} size='sm' variant={'ghost'}>
                            Search
                        </Button>
                    </Link>
                </InputRightElement>
            </InputGroup>
            </FormControl>
        </GridItem>
      </Grid>
    </>
  );
}

export default Search;
