import { Input, Button, Hide, Grid, Box, InputGroup, InputRightElement,FormControl } from "@chakra-ui/react";
import {
    Flex,
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
    MenuDivider,
  } from '@chakra-ui/react'

  import { MdOutlineSort } from "react-icons/md";

import { Link } from "react-router-dom";
import { useQueryStore, useChambersStore } from "../hooks/store";

function Search() {
  const query = useQueryStore((state)=> state.query)
  const setQuery = useQueryStore((state)=> state.setQuery)
  const totalChambers = useChambersStore((state)=> state.chamberDeployeds.length)
  return (
    <>
      <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} pt={4} rowGap={2} alignItems={'center'}>
            <Hide breakpoint="(max-width: 430px)">
                <Box pl={'5px'}>
                    {totalChambers} Chamber(s)
                </Box>
            </Hide>
        <Flex  gap={2}>
            <FormControl>
            <InputGroup size='md'>
                <Input isRequired onChange={(e) => setQuery(e.currentTarget.value)} placeholder="Enter Chamber" value={query} pr='4.5rem' variant={'filled'} overflow={'hidden'} rounded={'xl'}/>
                <InputRightElement width='5rem' justifyContent={'end'}>
                    <Button as={Link} to={`/chamber/${query}`} h='2.5rem' type={'submit'} borderLeftRadius={0} rounded={'xl'} size='sm' variant={'solid'}>
                        Search
                    </Button>
                </InputRightElement>
            </InputGroup>
            </FormControl>
            <Menu closeOnSelect={false}>
            <MenuButton as={Button} rounded={'xl'} >
                <Box>
                    <MdOutlineSort/>
                </Box>
            </MenuButton>
            <MenuList minWidth='240px' rounded={'xl'} >
                <MenuOptionGroup defaultValue='chamber' title='Sort by' type='radio'>
                <MenuDivider/>
                <MenuItemOption value='chamber'>Chamber</MenuItemOption>
                <MenuItemOption value='gov'>Gov Token</MenuItemOption>
                <MenuItemOption value='member'>Member Token</MenuItemOption>
                </MenuOptionGroup>
            </MenuList>
            </Menu>
        </Flex>
      </Grid>
    </>
  );
}

export default Search;
