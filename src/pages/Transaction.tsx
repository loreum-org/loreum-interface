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
import { ByteArray, encodeAbiParameters } from 'viem'
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
import { chamberAbi } from '../abi/chamberAbi';
import Identicon from '../components/identicon';
import { dataSource } from '../data';

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
  const [nftId, setNftId] = useState<string>('');
  const [proposalId, setProposalId] = useState<string>('');
  const [nftId1, setNftId1] = useState<string>('');
  const [proposalId1, setProposalId1] = useState<string>('');
  const [cancelProposal, setCancelProposal] = useState('');
  const [cancelProposalID, setCancelProposalID] = useState('');

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
    args: [BigInt(proposalId1), BigInt(nftId1)],
  });

  const constructMessageHash1: UseReadContractReturnType = useReadContract({
    abi: chamberAbi,
    address: `0x${address?.slice(2)}`,
    functionName: 'constructMessageHash',
    args: [BigInt(proposalId), BigInt(nftId)],
  });

  const {data, isLoading, isError} = useSimulateContract({
    address: `0x${address?.slice(2)}`,
    abi: chamberAbi,
    functionName: 'approve',
    args: [BigInt(proposalId1), BigInt(nftId1), signMessageData?(signMessageData):'0x'],
  })

  const executeSimulate = useSimulateContract({
    address: `0x${address?.slice(2)}`,
    abi: chamberAbi,
    functionName: 'execute',
    args: [BigInt(proposalId), BigInt(nftId), signExecute.data?(signExecute.data):'0x'],
  })

  const cancelSimulate = useSimulateContract({
    address: `0x${address?.slice(2)}`,
    abi: chamberAbi,
    functionName: 'create',
    args: [[`0x${address?.slice(2)}`],[BigInt(0)],[`0x${cancelProposal?.slice(2)}`]]
  })

  const [proposalReadID, setProposalReadID] = useState('');
  const proposalRead = useReadContract({
    address:`0x${address?.slice(2)}`,
    abi:chamberAbi,
    functionName: 'proposal',
    args: [BigInt(proposalReadID)],
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
      backdropFilter='blur(5px) '
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelModal = useDisclosure();
  const proposalModal = useDisclosure();
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
                {Proposals.data?.createdProposals?.length===0?
                (<Center h={'10rem'}><Text>There is no transaction</Text></Center>):(
                  <>
                {Proposals.data?.createdProposals?.map((proposal, index)=>( 
                  <Accordion allowToggle key={index}>
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
                              <GridItem>
                                <Flex gap={3} alignItems={'center'}>
                                <Identicon address={proposal.target[index].toString()} isize={20}/>
                                <Text>
                                {proposal.target[index]}
                                </Text>
                                </Flex>
                              </GridItem>
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
                        <Flex justifyContent={'space-between'} py={2}>
                        <Flex gap={3} flexFlow={'row'} py={1}>
                        Voters: 
                        {proposal.voters.map((voter, index)=>(
                          <Text key={index}>{voter}</Text>
                        ))}
                        </Flex>
                        <Flex gap={3}>
                        <Button onClick={()=>{
                          setProposalReadID(proposal.proposalId);
                          proposalModal.onOpen()
                        }}>
                          Proposal State
                        </Button>
                        <Button onClick={()=>{
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
                  <Button isDisabled={!Boolean(data?.request)} onClick={()=> approveWriteContract.writeContract(data!.request)}>Approve</Button>
                </Flex>
                </Flex>
                <Flex py={3}>
                  {approveWriteContract.isSuccess?(
                    <Grid templateColumns={'repeat(3, 1fr)'}>
                      <Text>Tnx Hash:</Text>
                      <GridItem colSpan={2}>
                        <a href={`http://sepolia.etherscan.io/tx/${approveWriteContract.data}`} target="_blank" rel="noopener noreferrer">
                          <Text overflow={'auto'} > 
                            {approveWriteContract.data}
                          </Text>
                        </a>
                      </GridItem>
                    </Grid>
                  ):(<></>)}
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
                  <Button isDisabled={!Boolean(executeSimulate.data?.request)} onClick={()=> executeWriteContract.writeContract(executeSimulate.data!.request)}>Execute</Button>
                </Flex>
                </Flex>
                <Flex py={3}>
                  {executeWriteContract.isSuccess?(
                    <Grid templateColumns={'repeat(3, 1fr)'}>
                      <Text>Tnx Hash:</Text>
                      <GridItem colSpan={2}>
                        <a href={`http://sepolia.etherscan.io/tx/${executeWriteContract.data}`} target="_blank" rel="noopener noreferrer">
                          <Text overflow={'auto'} > 
                            {executeWriteContract.data}
                          </Text>
                        </a>
                      </GridItem>
                    </Grid>
                  ):(<></>)}
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
      <Modal onClose={proposalModal.onClose} isOpen={proposalModal.isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {proposalRead.isLoading?(
              <>
              Loading...
              </>
            ):(
              <>
              <Flex flexFlow={'column'} w={'full'}>
                <Grid templateColumns={'repeat(2, 1fr)'}>
                  <GridItem>Total Approval</GridItem>
                  <GridItem>{proposalRead.data?.[0].toString()}</GridItem>
                </Grid>
                <Grid templateColumns={'repeat(2, 1fr)'}>
                  <GridItem>Proposal State</GridItem>
                  <GridItem>
                    {proposalState(proposalRead.data?.[1].toString())}
                  </GridItem>
                </Grid>
              </Flex>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={proposalModal.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Transaction