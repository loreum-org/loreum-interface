import { Search2Icon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  FormControl,
  InputGroup,
  Input,
  InputLeftElement,
  Button,
  Flex,
  Hide,
  GridItem,
  Divider,
  useDisclosure,
  Text,
  Skeleton,
  Center
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { MdCallMade } from "react-icons/md";
import { MdCallReceived } from "react-icons/md";
import { useState } from 'react';
import { create } from "zustand"
import { useParams, Params } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { getProposals } from '../gql/graphql';
import { useAccount } from 'wagmi';

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

interface AddressParams extends Params {
  address: string;
}

interface proposalCreated{
  transactionHash: string,
  proposalId: string,
  blockTimestamp: string,
  target: string[],
  value: string[],
  data: string[],
  voters: string[],
}
interface proposalCreateds{
  proposalCreateds: proposalCreated[]
}

const Transaction = () => {
  const {address} = useParams<AddressParams>();
  const {chainId} = useAccount();
  const query = useQueryStore((state)=> state.query)
  const setQuery = useQueryStore((state)=> state.setQuery)


  const Proposals = useQuery<proposalCreateds>({
    queryKey: ['proposalCreateds'],
    queryFn: async () => request(
      import.meta.env.VITE_SUBGRAPH_URL,
      getProposals,
      {chamberAddress: address}
    ),
  })


  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(5px) '
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = useState(<OverlayOne />)
  return (
    <>
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Receive</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{address}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Done</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={3}>
        <Breadcrumb fontWeight={'semibold'}>
          <BreadcrumbItem>
            <BreadcrumbLink>
            {address ? address.slice(0,4): ''}...{address ? address.slice(38,42) : ''}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction`}>Transaction</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <FormControl>
              <InputGroup size='md'>
                  <InputLeftElement  justifyContent={'start'}>
                          <Button type={'submit'} borderRightRadius={0} rounded={'xl'} size='sm' variant={'transparent'}>
                              <Search2Icon/>
                          </Button>
                  </InputLeftElement>
                  <Input onChange={(e) => setQuery(e.currentTarget.value)} value={query} placeholder="Search Transaction" variant={'filled'} overflow={'hidden'} rounded={'xl'}/>
              </InputGroup>
        </FormControl>
      </Grid>
      <Tabs variant={'soft-rounded'} >
        <TabList alignItems={'center'} justifyContent={['center','end']} pb={'1rem'} gap={2}>
        <Link to={`/chamber/${address}/transaction/send`}>
          <Button fontSize={['xs','sm']} rounded={'lg'} h={'2rem'} size={'sm'} leftIcon={<MdCallMade/> }>
            Send
          </Button>
          </Link>
          <Button fontSize={['xs','sm']} rounded={'lg'} h={'2rem'} size={'sm'} leftIcon={<MdCallReceived/> }
          onClick={() => {
            setOverlay(<OverlayOne />)
            onOpen()
          }}>
            Receive
          </Button>
          <Flex border={'1px'} p={'3px'} rounded={'xl'} borderColor={'gray.500'}>
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >Queue</Tab>
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >History</Tab>
          </Flex>
        </TabList>
        <Hide below='sm'>
        <Grid templateColumns={'repeat(8, 1fr)'} justifyItems={'center'} pb={'0.5rem'} fontSize={'xs'} color={'gray.500'} fontWeight={'semibold'}>
          <GridItem>Transaction</GridItem>
          <GridItem>Txn Hash</GridItem>
          <GridItem>Amount</GridItem>
          <GridItem>Chamber</GridItem>
          <GridItem>Proposal ID</GridItem>
          <GridItem>Network</GridItem>
          <GridItem>Time</GridItem>
          <GridItem>Status</GridItem>
        </Grid>
        </Hide>
        <TabPanels>
          <TabPanel >
              {Proposals.isLoading || Proposals.isRefetching?(
                <Flex flexFlow={'column'} rowGap={3}>
                <Skeleton rounded={'lg'} height='40px'/>
                <Skeleton rounded={'lg'} height='40px'/>
                <Skeleton rounded={'lg'} height='40px'/>
                <Skeleton rounded={'lg'} height='40px'/>
                </Flex>
              ):(
                <>
                {Proposals.data?.proposalCreateds?.length===0?
                (<Center h={'10rem'}><Text>There is no transaction</Text></Center>):(
                  <>
                {Proposals.data?.proposalCreateds?.map((proposal, index)=>( 
                  <Accordion allowToggle>
                    <AccordionItem>
                      <AccordionButton rounded={'lg'}>
                        <Grid w={'full'} templateColumns={'repeat(8, 1fr)'} gap={3} justifyItems={'center'} key={index}>
                          <GridItem justifySelf={'start'}>
                            <Flex gap={3} alignItems={'center'}>
                            <MdCallMade/>
                            {"Create"}
                            </Flex>
                          </GridItem>
                          <GridItem _hover={{color: 'blue.400'}}>
                            <a href={`http://sepolia.etherscan.io/tx/${proposal.transactionHash}`} target="_blank" rel="noopener noreferrer">
                              {proposal.transactionHash.slice(0,6)}...{proposal.transactionHash.slice(62)}
                            </a>
                          </GridItem>
                          <GridItem>0</GridItem>
                          <GridItem _hover={{color: 'blue.400'}}>
                            <a href={`http://sepolia.etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                              {address?.slice(0,6)}...{address?.slice(38)}
                            </a>
                            </GridItem>
                          <GridItem>{proposal.proposalId}</GridItem>
                          <GridItem>{chainId===1?"Ethereum":"Sepolia"}</GridItem>
                          <GridItem>{new Date(parseInt(proposal.blockTimestamp) * 1000).toLocaleDateString()}</GridItem>
                          <GridItem justifySelf={'end'}>Unknown</GridItem>
                        </Grid>
                        <AccordionIcon/>
                      </AccordionButton>
                      <AccordionPanel my={3}>
                        <Grid gap={2}>
                          <Divider/>
                          <GridItem>
                            <Grid templateColumns={'repeat(3, 1fr)'} justifyItems={'center'}>
                              <GridItem>Target</GridItem>
                              <GridItem>Value</GridItem>
                              <GridItem>Data</GridItem>
                            </Grid>
                          </GridItem>
                          <Divider/>
                          {proposal.target.map((_, index)=>(
                            <GridItem key={index} py={1}>
                            <Grid templateColumns={'repeat(3, 1fr)'} justifyItems={'center'}>
                              <GridItem>{proposal.target[index]}</GridItem>
                              <GridItem>{proposal.value[index]}</GridItem>
                              <GridItem>{proposal.data[index].slice(0,10)}...</GridItem>
                            </Grid>
                            </GridItem>
                          ))}
                        </Grid>
                        <Divider/>
                        <Flex gap={3} flexFlow={'row'} py={1}>
                        Voters: 
                        {proposal.voters.map((voter, index)=>(
                          <Text key={index}>{voter}</Text>
                          ))}
                          </Flex>
                        <Divider/>
                        <Flex justifyContent={'end'} gap={3} pt={3}>
                          <Button colorScheme='blue' variant={'outline'}>Approve</Button>
                          <Button colorScheme='blue'>Execute</Button>
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                ))}
                </>)}
                </>
              )}
          </TabPanel>
          <TabPanel>
            <Flex flexFlow={'column'} rowGap={3}>
              <Button w={'full'} rounded={'lg'}></Button>
              <Button w={'full'} rounded={'lg'}></Button>
              <Button w={'full'} rounded={'lg'}></Button>
              <Button w={'full'} rounded={'lg'}></Button>
              <Button w={'full'} rounded={'lg'}></Button>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

export default Transaction