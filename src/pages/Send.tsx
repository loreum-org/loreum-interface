import { Progress, Flex, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, InputGroup, InputLeftElement, Button, Input, Card, useColorModeValue, Center,Box} from '@chakra-ui/react'
import {Search2Icon} from '@chakra-ui/icons'
import { Link, useParams } from 'react-router-dom'
import { RiCoinsLine } from "react-icons/ri";
import { FiHexagon } from "react-icons/fi";

import { AddIcon } from '@chakra-ui/icons';

function Send() {
    const {address} = useParams();
    const bg = useColorModeValue("gray.200", "gray.700");
  return (
    <div>
        <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={3}>
        <Breadcrumb fontWeight={'semibold'}>
          <BreadcrumbItem>
            <BreadcrumbLink>
            {address ? address.slice(0,4): ''}...{address ? address.slice(38,42) : ''}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem >
            <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction`}>Transaction</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink >Send</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <FormControl>
              <InputGroup size='md'>
                  <InputLeftElement  justifyContent={'start'}>
                          <Button type={'submit'} borderRightRadius={0} rounded={'xl'} size='sm' variant={'transparent'}>
                              <Search2Icon/>
                          </Button>
                  </InputLeftElement>
                  <Input placeholder="Search Transaction" variant={'filled'} overflow={'hidden'} rounded={'xl'} isDisabled/>
              </InputGroup>
        </FormControl>
        </Grid>
        <Progress value={20} size='xs' colorScheme='blue'/>
        <Flex rowGap={8} p={'20px'} flexWrap={'wrap'} justifyContent={'space-evenly'}  h={'min-content'} >
        <Card rounded={'2xl'} p={'10px'} pl={'10px'} w={'300px'} bg={bg}>
            <Flex justifyContent={'center'} py={'1rem'} fontWeight={'bold'}>
                TOKEN
            </Flex>
            <Center pt={1}>
                  <Box bg={bg} rounded={'2xl'} w={'274px'}  height={'100px'}  >
                      <Grid w={'274px'}  height={'100px'} justifyContent={'center'} alignItems={'center'}>
                       <RiCoinsLine size={'5rem'} opacity={'70%'}/>
                      </Grid>
                  </Box>
            </Center>
            <Flex justifyContent={'center'} alignItems={'center'} py={'1rem'} fontWeight={'bold'} flexFlow={'column'} gap={2}>
                <Button w={'60%'} as={Link} to={`/chamber/${address}/transaction/send/token`}>
                    Send Token
                </Button>
                <Flex fontSize={'10px'} fontWeight={'medium'} justifyContent={'center'}>
                Send ERC-20 or Native currency to the same network
                </Flex>
            </Flex>
        </Card>
        <Card rounded={'2xl'} p={'10px'} pl={'10px'} w={'300px'} bg={bg}>
            <Flex justifyContent={'center'} py={'1rem'} fontWeight={'bold'}>
                NFT
            </Flex>
            <Center pt={1}>
                  <Box bg={bg} rounded={'2xl'} w={'274px'}  height={'100px'}  >
                      <Grid w={'274px'}  height={'100px'} justifyContent={'center'} alignItems={'center'}>
                       <FiHexagon size={'5rem'} opacity={'70%'}/>
                      </Grid>
                  </Box>
            </Center>
            <Flex justifyContent={'center'} alignItems={'center'} py={'1rem'} fontWeight={'bold'} flexFlow={'column'} gap={2}>
                <Button  w={'60%'}>Send NFT</Button>
                <Flex fontSize={'10px'} fontWeight={'medium'} justifyContent={'center'}>
                Send ERC-721 or ERC-1155 to the same network
                </Flex>
            </Flex>
        </Card>
        <Card rounded={'2xl'} p={'10px'} pl={'10px'} w={'300px'} bg={bg}>
            <Flex justifyContent={'center'} py={'1rem'} fontWeight={'bold'}>
                BUILDER
            </Flex>
            <Center pt={1}>
                  <Box bg={bg} rounded={'2xl'} w={'274px'}  height={'100px'}  >
                      <Grid w={'274px'}  height={'100px'} justifyContent={'center'} alignItems={'center'}>
                       <AddIcon boxSize={'4rem'} opacity={'70%'}/>
                      </Grid>
                  </Box>
            </Center>
            <Flex justifyContent={'center'} alignItems={'center'} py={'1rem'} fontWeight={'bold'} flexFlow={'column'} gap={2}>
                <Button w={'60%'} fontStyle={'sm'} as={Link} to={`/chamber/${address}/transaction/send/builder`}>Transaction Builder</Button>
                <Flex fontSize={'10px'} fontWeight={'medium'} justifyContent={'center'}>
                Batch multiple transactions or contract interactions
                </Flex>
            </Flex>
        </Card>
        </Flex>
    </div>
  )
}

export default Send