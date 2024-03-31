import { CheckCircleIcon, QuestionIcon, Search2Icon } from '@chakra-ui/icons';
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
  Center,
  Tooltip,
  Card,
  CardBody,
  Box,
  Stack,
  Heading,
  FormLabel,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { ByteArray } from 'viem'
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
import { useState } from 'react';
import { create } from "zustand"
import { useParams, Params } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import request from 'graphql-request';
import { getProposals } from '../gql/graphql';
import { UseReadContractReturnType, useAccount, useReadContract, useSignMessage, useWriteContract } from 'wagmi';
import { sepolia } from 'viem/chains';
import { chamberAbi } from '../abi/chamberAbi';

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

function Transaction(){
  const [nftId, setNftId] = useState<string>('');
  const [proposalId, setProposalId] = useState<string>('');
  const [nftId1, setNftId1] = useState<string>('');
  const [proposalId1, setProposalId1] = useState<string>('');

  const {address} = useParams<AddressParams>();
  const {chainId} = useAccount();
  const query = useQueryStore((state)=> state.query);
  const setQuery = useQueryStore((state)=> state.setQuery);

  const { data: signMessageData, isPending , signMessage } = useSignMessage()
  const signExecute = useSignMessage();

  const constructMessageHash: UseReadContractReturnType = useReadContract({
    abi: chamberAbi,
    address: `0x${address?.slice(2)}`,
    functionName: 'constructMessageHash',
    chainId: sepolia.id,
    args: [BigInt(proposalId1), BigInt(nftId1)],
  });

  const constructMessageHash1: UseReadContractReturnType = useReadContract({
    abi: chamberAbi,
    address: `0x${address?.slice(2)}`,
    functionName: 'constructMessageHash',
    chainId: sepolia.id,
    args: [BigInt(proposalId), BigInt(nftId)],
  });

  const {data, isLoading, isError} = useSimulateContract({
    address: `0x${address?.slice(2)}`,
    abi: chamberAbi,
    functionName: 'approve',
    args: [BigInt(proposalId1), BigInt(nftId1), signMessageData?(signMessageData):'0x'],
    chainId: sepolia.id,
  })

  const executeSimulate = useSimulateContract({
    address: `0x${address?.slice(2)}`,
    abi: chamberAbi,
    functionName: 'execute',
    args: [BigInt(proposalId), BigInt(nftId), signExecute.data?(signExecute.data):'0x'],
    chainId: sepolia.id,
  })

  const {writeContract} = useWriteContract()
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
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >Transactions</Tab>
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >Functions</Tab>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel >
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
                          <GridItem justifySelf={'end'}>
                            <Tooltip label="Unknown">
                            <QuestionIcon/>
                            </Tooltip>
                          </GridItem>
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
                              <GridItem>
                                <Box width={'25rem'}>
                                  <Text>
                                {proposal.data[index]}
                                  </Text>
                                </Box>
                              </GridItem>
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
                    <Input w={'auto'} value={nftId1} onChange={(e)=>{setNftId1(e.target.value)}}   placeholder='Enter Your NFT ID'></Input>
                  </Flex>
                  <Flex flexFlow={'column'}>
                    <FormLabel>Proposal ID</FormLabel>
                    <Input w={'auto'} value={proposalId1} onChange={(e)=>{setProposalId1(e.target.value)}} placeholder='Enter Proposal ID'></Input>
                  </Flex>
                </Flex>
                  <Flex flexFlow={'column'}>
                    <FormLabel>Message Hash</FormLabel>
                    <InputGroup>
                    <Input w={'full'} isDisabled value={constructMessageHash.data as string}></Input>
                    <InputRightElement><IconButton variant={'transparent'} aria-label='Loading Complete' isLoading={constructMessageHash.isLoading} icon={<CheckCircleIcon/>}/></InputRightElement>
                    </InputGroup>
                  </Flex>
                  <Flex flexFlow={'column'}>
                    <FormLabel>Signature</FormLabel>
                    <InputGroup>
                    <Input value={signMessageData} isDisabled placeholder='Enter signature'></Input>
                    <InputRightElement><IconButton variant={'transparent'} aria-label='Loading Complete' isLoading={isPending} icon={<CheckCircleIcon/>}/></InputRightElement>
                    </InputGroup>
                  </Flex>
                <Flex pt={3} justifyContent={'end'} gap={3}>
                  <Button isLoading={isPending} onClick={()=>{
                    signMessage({message: {raw: constructMessageHash.data as ByteArray}})
                  }}>Sign</Button>
                  <Button isDisabled={!Boolean(data?.request)} onClick={()=> writeContract(data!.request)}>Approve</Button>
                </Flex>
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
                        <Alert status='info' rounded={'lg'}>
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
                  <Flex flexFlow={'column'}>
                    <FormLabel>NFT ID</FormLabel>
                    <Input w={'auto'} value={nftId} onChange={(e)=>{setNftId(e.target.value)}}   placeholder='Enter Your NFT ID'></Input>
                  </Flex>
                  <Flex flexFlow={'column'}>
                    <FormLabel>Proposal ID</FormLabel>
                    <Input w={'auto'} value={proposalId} onChange={(e)=>{setProposalId(e.target.value)}} placeholder='Enter Proposal ID'></Input>
                  </Flex>
                </Flex>
                  <Flex flexFlow={'column'}>
                    <FormLabel>Message Hash</FormLabel>
                    <InputGroup>
                    <Input w={'full'} isDisabled value={constructMessageHash1.data as string}></Input>
                    <InputRightElement><IconButton variant={'transparent'} aria-label='Loading Complete' isLoading={constructMessageHash1.isLoading} icon={<CheckCircleIcon/>}/></InputRightElement>
                    </InputGroup>
                  </Flex>
                  <Flex flexFlow={'column'}>
                    <FormLabel>Signature</FormLabel>
                    <InputGroup>
                    <Input value={signExecute.data} isDisabled placeholder='Enter signature'></Input>
                    <InputRightElement><IconButton variant={'transparent'} aria-label='Loading Complete' isLoading={signExecute.isPending} icon={<CheckCircleIcon/>}/></InputRightElement>
                    </InputGroup>
                  </Flex>
                <Flex pt={3} justifyContent={'end'} gap={3}>
                  <Button isLoading={signExecute.isPending} onClick={()=>{
                    signExecute.signMessage({message: {raw: constructMessageHash1.data as ByteArray}})
                  }}>Sign</Button>
                  <Button isDisabled={!Boolean(executeSimulate.data?.request)} onClick={()=> writeContract(executeSimulate.data!.request)}>Approve</Button>
                </Flex>
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
                        <Alert status='info' rounded={'lg'}>
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
    </>
  )
}

export default Transaction