import { CopyIcon, ExternalLinkIcon, Search2Icon } from '@chakra-ui/icons';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Grid, FormControl, InputGroup, Input, InputLeftElement,
  Button, Flex, Hide, GridItem, Divider, useDisclosure, Text, Skeleton, Center, Card, CardBody, Stack, Heading,
  FormLabel, IconButton, Alert, AlertIcon, useToast, useColorModeValue
} from '@chakra-ui/react';
import { encodeAbiParameters } from 'viem'
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
import { useSimulateContract} from 'wagmi'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { MdCallMade } from "react-icons/md";
import { MdCallReceived } from "react-icons/md";
import { useEffect, useState } from 'react';
import { create } from "zustand"
import { useParams, Params } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { getProposals } from '../gql/graphql';
import { useWriteContract } from 'wagmi';
import { chamberAbi } from '../abi/chamberAbi';
import Identicon from '../components/identicon';
import { dataSource } from '../data';
import { formatEther } from 'viem'
import { readContract } from '@wagmi/core';
import { config } from '../config';

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

interface createdProposal{
  transactionHash: string,
  proposalId: string,
  blockTimestamp: string,
  target: string[],
  value: string[],
  data: string[],
  voters: string[],
}
interface createdProposals{
  createdProposals: createdProposal[]
}

function Transaction(){
  const [nftId, setNftId] = useState<number | undefined>();
  const [proposalId, setProposalId] = useState<number | undefined>();
  const [nftId1, setNftId1] = useState<number | undefined>();
  const [proposalId1, setProposalId1] = useState<number | undefined>();
  const [cancelProposal, setCancelProposal] = useState('');
  const [cancelProposalID, setCancelProposalID] = useState('');

  const {address} = useParams<AddressParams>();
  const query = useQueryStore((state)=> state.query);
  const setQuery = useQueryStore((state)=> state.setQuery);

  const {data, isLoading, isError} = useSimulateContract({
    address: `0x${address?.slice(2)}`,
    abi: chamberAbi,
    functionName: 'approve',
    args: [BigInt(proposalId1?proposalId1:"0"), BigInt(nftId1?nftId1:"0")],
  })

  const executeSimulate = useSimulateContract({
    address: `0x${address?.slice(2)}`,
    abi: chamberAbi,
    functionName: 'execute',
    args: [BigInt(proposalId?proposalId:"0"), BigInt(nftId?nftId:"0")]
  })

  const cancelSimulate = useSimulateContract({
    address: `0x${address?.slice(2)}`,
    abi: chamberAbi,
    functionName: 'create',
    args: [[`0x${address?.slice(2)}`],[BigInt(0)],[`0x${cancelProposal?.slice(2)}`]]
  })

  const approveWriteContract = useWriteContract()
  const executeWriteContract = useWriteContract()
  const cancelWriteContract = useWriteContract()
  
  const Proposals = useQuery<createdProposals>({
    queryKey: ['proposalCreateds'],
    queryFn: async () => request(
      dataSource.subgraphUrl,
      getProposals,
      {chamberAddress: address}
    ),
    refetchOnMount: true,
    staleTime: 60000
  })

  function getData(params:string) {
    const encodedData = encodeAbiParameters(
      [{name: "proposalId", type: "uint256"}],
      [BigInt(params)]
    )
    const encodedDataWithFunctionSelector = "0x40e58ee5" + encodedData.slice(2)
    setCancelProposal(encodedDataWithFunctionSelector);
  }

  function proposalState(params:string | undefined){
    switch(params){
      case '0':
        return 'Null';
        break;
      case '1':
        return 'Initialized';
        break;
      case '2':
        return 'Executed';
        break;
      case '3':
        return 'Canceled';
        break;
      default:
        return 'Unknown';
    }
  }

  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(5px)'
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelModal = useDisclosure();
  const [overlay, setOverlay] = useState(<OverlayOne />)
  const toast = useToast()
  const [proposalStates, setProposalStates] = useState<ProposalState[]>([])
  const [pslo, sepslo] = useState(false);
  const expandBg = useColorModeValue('gray.200', 'gray.700')
  interface ProposalState {
    proposalID: string,
    approvals: string,
    state: string,
  }
  useEffect(() => {
    const fetchProposalStates = async () => {
      try {
        sepslo(true)
        if (Proposals.isFetched) {
          const newProposalStates: ProposalState[] = await Promise.all(
            Proposals.data?.createdProposals.map(async (proposal) => {
              const data = await readContract(config,{
                address: `0x${address?.slice(2)}`,
                abi: chamberAbi,
                functionName: 'proposal',
                args: [BigInt(proposal.proposalId)],
              });
              return {
                proposalID: proposal.proposalId,
                approvals: data?.[0]?.toString() || '',
                state: data?.[1]?.toString() || '',
              };
            }) || []
          );
          setProposalStates(newProposalStates);
          sepslo(false)
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProposalStates();
  }, [Proposals.data, Proposals.isFetched]);
  return (
    <>
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Receive</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex gap={2} alignItems={'center'} alignContent={'center'}>
              <Identicon address={address!} isize={20}/>
              <Text fontSize={'md'}>{address}</Text>
            </Flex>
          </ModalBody>
          <ModalFooter gap={3}>
          <IconButton aria-label='copy' size={'sm'} variant={'outline'} icon={<CopyIcon/>} onClick={()=>{
              navigator.clipboard.writeText(address!),
              toast({ title: 'Address Copied', status: 'success', duration: 3000})
            }}/>
            <Button size={'sm'} variant={'outline'} onClick={onClose}>Done</Button>
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
                  <Input isDisabled onChange={(e) => setQuery(e.currentTarget.value)} value={query} placeholder="Search Transaction" variant={'filled'} overflow={'hidden'} rounded={'xl'}/>
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
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >Transactions</Tab>
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >Functions</Tab>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel >
          <Hide below='sm'>
        <Grid templateColumns={'repeat(6, 1fr)'} justifyItems={'center'} pb={'0.5rem'} fontSize={'xs'} color={'gray.500'} fontWeight={'semibold'}>
          <GridItem >Tx Hash</GridItem>
          <GridItem >Proposal ID</GridItem>
          <GridItem >Approvals</GridItem>
          <GridItem >State</GridItem>
          <GridItem >Date</GridItem>
        </Grid>
        </Hide>
              {Proposals.isLoading || Proposals.isRefetching || pslo || (Proposals.data?.createdProposals.length!==proposalStates.length)?(
                <Flex flexFlow={'column'} rowGap={3}>
                <Skeleton rounded={'lg'} height='40px'/>
                <Skeleton rounded={'lg'} height='40px'/>
                <Skeleton rounded={'lg'} height='40px'/>
                <Skeleton rounded={'lg'} height='40px'/>
                </Flex>
              ):(
                <>
                {Proposals.data?.createdProposals?.length===0?
                (<Center h={'10rem'}><Text>There is no transaction</Text></Center>):(
                  <>
                {Proposals.data?.createdProposals?.map((proposal, index)=>( 
                  <Accordion allowToggle key={index}>
                    <AccordionItem>
                      <AccordionButton _expanded={{ bg: expandBg }}>
                        <Grid w={'full'} templateColumns={'repeat(6, 1fr)'} gap={3} justifyItems={'center'} key={index}>
                          <GridItem _hover={{color:'blue.500'}}>
                            <a href={`http://sepolia.etherscan.io/tx/${proposal.transactionHash}`} target="_blank" rel="noopener noreferrer">
                              {proposal.transactionHash.slice(0, 5)}...{proposal.transactionHash.slice(63)}
                              <ExternalLinkIcon ml={3} h={3}/>
                            </a>
                          </GridItem>
                          <GridItem>{proposal.proposalId}</GridItem>
                          <GridItem>{proposalStates[index].approvals}</GridItem>
                          <GridItem>{proposalState(proposalStates[index].state)}</GridItem>
                          <GridItem>{new Date(parseInt(proposal.blockTimestamp) * 1000).toLocaleDateString()}</GridItem>
                          <GridItem>
                            <Flex>
                            <AccordionIcon/>
                            </Flex>
                          </GridItem>
                        </Grid>
                      </AccordionButton>
                      <AccordionPanel >
                        <Grid gap={2}>
                          <Divider/>
                          <GridItem>
                            <Grid templateColumns={'repeat(3, 1fr)'}  fontWeight={'bold'}>
                              <GridItem>Target</GridItem>
                              <GridItem>Value</GridItem>
                              <GridItem>Data</GridItem>
                            </Grid>
                          </GridItem>
                          <Divider/>
                          {proposal.target.map((_, index)=>(
                            <GridItem key={index} py={1}>
                            <Grid templateColumns={'repeat(3, 1fr)'}>
                              <GridItem >
                                <a href={`http://sepolia.etherscan.io/address/${proposal.target[index]}`} target="_blank" rel="noopener noreferrer">    
                                <Flex gap={2} alignItems={'center'} _hover={{color:'blue.500'}}>
                                  <Identicon address={proposal.target[index].toString()} isize={20}/>
                                  {proposal.target[index].slice(0,5)}...{proposal.target[index].slice(-3)}
                                  <IconButton aria-label="Copy" variant={'ghost'} icon={<ExternalLinkIcon/>} size="xs" />
                                </Flex>
                                </a>
                              </GridItem>
                              <GridItem>
                                {formatEther(BigInt(proposal.value[index]))} ETH
                              </GridItem>
                              <GridItem>
                                <Flex gap={2}>
                                  <Text>
                                    {proposal.data[index].slice(0,10)}...{proposal.data[index].slice(-10)}
                                  </Text>
                                  <IconButton aria-label='copy' size={'xs'} icon={<CopyIcon/>} onClick={()=>{
                                    navigator.clipboard.writeText(proposal.data[index]),
                                    toast({title:'Data Copied', status:'success', duration:3000})
                                  }} />
                                </Flex>
                              </GridItem>
                            </Grid>
                            </GridItem>
                          ))}
                        </Grid>
                        <Divider/>
                        <Flex justifyContent={'space-between'} py={2}>
                        <Flex gap={3} flexFlow={'row'} py={1} alignItems={'center'}>
                          <Heading size={'sm'}>
                          Voters:
                          </Heading>
                        {proposal.voters.map((voter, index)=>(
                          <Button size={'sm'} key={index}>{voter}</Button>
                        ))}
                        </Flex>
                        <Flex gap={3}>
                        <Button colorScheme='red' isDisabled={proposalStates[index].state!=='1'} variant={'outline'} size={'sm'} onClick={()=>{
                          setCancelProposalID(proposal.proposalId)
                          getData(proposal.proposalId),
                          cancelModal.onOpen()
                        }}>Cancel</Button>
                        </Flex>
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
          <Flex justifyContent={'center'} gap={4} flexWrap={'wrap'}>
            <Card w={['full','30rem']} rounded={'xl'}  h={'min-content'}>
              <CardBody>
                <Stack>
                  <Heading size={'md'}>Approve</Heading>
                </Stack>
              </CardBody>
              <Divider/>
              <CardBody>
                <Flex flexFlow={'column'} gap={4}>
                <Flex justifyContent={'end'} flexFlow={'row'} gap={5} >
                  <Flex flexFlow={'column'}>
                    <FormLabel>NFT ID</FormLabel>
                    <Input w={'auto'} value={nftId1} type='number' onChange={(e)=>{{setNftId1(parseInt(e.target.value))}}}  placeholder='Enter Your NFT ID'></Input>
                  </Flex>
                  <Flex flexFlow={'column'}>
                    <FormLabel>Proposal ID</FormLabel>
                    <Input w={'auto'} value={proposalId1} type='number' onChange={(e)=>{{setProposalId1(parseInt(e.target.value))}}} placeholder='Enter Proposal ID'></Input>
                  </Flex>
                </Flex>
                <Flex pt={3} justifyContent={'end'} gap={3}>
                  <Button isDisabled={!Boolean(data?.request)} onClick={()=>{
                    approveWriteContract.writeContract(data!.request)
                    }}>Approve</Button>
                </Flex>
                </Flex>
                <Flex py={3}>
                  {approveWriteContract.isSuccess?(
                    <Grid templateColumns={'repeat(3, 1fr)'}>
                      <Text>Transaction Hash:</Text>
                      <GridItem colSpan={2}>
                        <a href={`http://sepolia.etherscan.io/tx/${approveWriteContract.data}`} target="_blank" rel="noopener noreferrer">
                          <Text overflow={'auto'}  color={'blue.500'} pl={3} fontWeight={'semibold'}> 
                            {approveWriteContract.isSuccess?(
                              <>
                              {approveWriteContract.data?.slice(0,5)}...{approveWriteContract.data?.slice(-3)}
                              <ExternalLinkIcon/>
                              </>
                            ):(
                              <>
                              0x000.000
                              </>
                            )}
                          </Text>
                        </a>
                      </GridItem>
                    </Grid>
                  ):(<Flex gap={3}>
                  <Text>Transaction Hash:</Text>
                  0x0000..000
                  </Flex>)}
                </Flex>
                <Flex pt={3}>
                  {isError?(
                    <Alert status='error' rounded={'lg'}>
                      <AlertIcon/>
                      Can't approve this proposal.
                    </Alert>
                  ):(
                    <>
                    {
                      isLoading?(
                        <Alert status='loading' rounded={'lg'}>
                          <AlertIcon/>
                          Checking...
                        </Alert>
                      ):(
                        <Alert status='success' rounded={'lg'}>
                          <AlertIcon/>
                          can approved this proposal.
                        </Alert>
                      )
                    }
                    </>
                  )}
                </Flex>
              </CardBody>
            </Card>
            <Card w={['full','30rem']} rounded={'xl'}  h={'min-content'}>
              <CardBody>
                <Stack>
                  <Heading size={'md'}>Execute</Heading>
                </Stack>
              </CardBody>
              <Divider/>
              <CardBody>
              <Flex flexFlow={'column'} gap={4}>
                <Flex justifyContent={'end'} flexFlow={'row'} gap={5} >
                  <Flex flexFlow={'column'} gap={3}>
                    <Heading size={'sm'}>NFT ID</Heading>
                    <Input w={'auto'} value={nftId} type='number' onChange={(e)=>{setNftId(parseInt(e.target.value))}}   placeholder='Enter Your NFT ID'></Input>
                  </Flex>
                  <Flex flexFlow={'column'} gap={3}>
                    <Heading size={'sm'}>Proposal ID</Heading>
                    <Input w={'auto'} value={proposalId}  type='number' onChange={(e)=>{setProposalId(parseInt(e.target.value))}} placeholder='Enter Proposal ID'></Input>
                  </Flex>
                </Flex>
                <Flex pt={3} justifyContent={'end'} gap={3}>
                  <Button isDisabled={!Boolean(executeSimulate.data?.request)} onClick={()=> executeWriteContract.writeContract(executeSimulate.data!.request)}>Execute</Button>
                </Flex>
                </Flex>
                <Flex py={3}>
                  {executeWriteContract.isSuccess?(
                    <Grid templateColumns={'repeat(3, 1fr)'}>
                      <Text>Transaction Hash:</Text>
                      <GridItem colSpan={2}>
                        <a href={`http://sepolia.etherscan.io/tx/${executeWriteContract.data}`} target="_blank" rel="noopener noreferrer">
                          <Text overflow={'auto'} color={'blue.500'} pl={3} fontWeight={'semibold'}> 
                            {executeWriteContract.isSuccess?(
                               <>
                               {executeWriteContract.data?.slice(0,5)}...{executeWriteContract.data?.slice(-3)}
                               <ExternalLinkIcon/>
                               </>
                            ):(
                              <>
                              0x000.000
                              </>
                            )}
                          </Text>
                        </a>
                      </GridItem>
                    </Grid>
                  ):(<Flex gap={3}>
                    <Text>Transaction Hash:</Text>
                    0x0000..000
                    </Flex>)}
                </Flex>
                <Flex pt={3}>
                  {executeSimulate.isError?(
                    <Alert status='error' rounded={'lg'}>
                      <AlertIcon/>
                      Can't execute this proposal.
                    </Alert>
                  ):(
                    <>
                    {
                      executeSimulate.isLoading?(
                        <Alert status='loading' rounded={'lg'}>
                          <AlertIcon/>
                          Checking...
                        </Alert>
                      ):(
                        <Alert status='success' rounded={'lg'}>
                          <AlertIcon/>
                          can execute this proposal.
                        </Alert>
                      )
                    }
                    </>
                  )}
                </Flex>
              </CardBody>
            </Card>
          </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal isOpen={cancelModal.isOpen} onClose={cancelModal.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cancel Proposal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to cancel proposalID {cancelProposalID}
          </ModalBody>
          <ModalFooter>
            <Button onClick={cancelModal.onClose} variant='ghost'>Close</Button>
            <Button colorScheme='blue' mr={3} isLoading={cancelWriteContract.isPending} isDisabled={!Boolean(cancelSimulate.data?.request)}  onClick={()=> cancelWriteContract.writeContract(cancelSimulate.data!.request)}>
              Confirm
            </Button>
          </ModalFooter>
          <Divider/>
          <ModalBody>
            {cancelSimulate.isError?(
              <Alert status='error' rounded={'lg'}>
                <AlertIcon/>
                Can't cancel this proposal.
              </Alert>
            ):(
              <>
              {
                cancelSimulate.isLoading?(
                  <Alert status='loading' rounded={'lg'}>
                    <AlertIcon/>
                    Checking...
                  </Alert>
                ):(
                  <Alert status='success' rounded={'lg'}>
                    <AlertIcon/>
                    Can cancel this proposal.
                  </Alert>
                )
              }
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Transaction