import { Progress,Grid,Text, Breadcrumb, BreadcrumbItem, BreadcrumbLink, InputGroup, Button, Input , Flex,Card,useColorModeValue, Box, Divider, InputRightElement, GridItem} from '@chakra-ui/react'
import {
    Tooltip,
    FormControl,
    InputLeftElement,

  } from '@chakra-ui/react'
  import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
  } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { RiCoinsLine } from "react-icons/ri";
import { MdOutlineLeaderboard } from "react-icons/md";
import { create } from 'zustand'
import { useChainId, useReadContract } from 'wagmi'
import TopLeader from '../components/TopLeader'
import { sepolia } from 'viem/chains'
import Sign from './Sign'
import { chamberAbi } from '../abi/chamberAbi'
import { Search2Icon } from '@chakra-ui/icons';

type State = {
    amount: number;
    walletAddress: string;
    proposlId: string;
}
type Action = {
    setAmount: (amount: State['amount']) => void;
    setWalletAddress: (walletAddress: State['walletAddress']) => void;
    setProposlId: (proposlId: State['proposlId'])=>void;
}

export const useStore = create<State & Action>((set)=>({
    amount: 0,
    setAmount: (amount)=> set(()=>({amount: amount})),

    walletAddress: '0x0000000000000000000000000000000000000000',
    setWalletAddress: (walletAddress)=> set(()=>({walletAddress: walletAddress})),

    proposlId: '1',
    setProposlId: (proposlId)=> set(()=>({proposlId:proposlId})),
}))

function Token() {
    const chainId = useChainId()
    const amount = useStore((state)=>state.amount)
    const setAmount = useStore((state)=>state.setAmount)
    const walletAddress = useStore((state)=>state.walletAddress)
    const setWalletAddress = useStore((state)=>state.setWalletAddress)
    const setProposlId = useStore((state)=>state.setProposlId)
    const {address}= useParams()
    const bg = useColorModeValue("gray.200", "gray.700");
    const {data, isLoading} = useReadContract({
        abi: chamberAbi,
        address: `0x${address?.slice(2,42)}`,
        functionName:'nonce',
        chainId: sepolia.id,
    })
    setProposlId((parseInt(data?data.toString():'0')+1).toString())
    function cancel(){
        setWalletAddress('');
        setAmount(0);
        return (
            <Button as={Link} to={`/chamber/${address}/`}>h</Button>
        )
    }
    return (
        <div>
            <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={3} >
            <Breadcrumb fontWeight={'semibold'}>
            <BreadcrumbItem>
                <BreadcrumbLink>{address ? address.slice(0,4): ''}...{address ? address.slice(38,42) : ''}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction/`}>Transaction</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
                <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction/send`}>Send</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink isCurrentPage>Token</BreadcrumbLink>
            </BreadcrumbItem>
            </Breadcrumb>
            <FormControl>
            <InputGroup size='md'>
                <InputLeftElement  justifyContent={'start'}>
                        <Button type={'submit'} borderRightRadius={0} rounded={'xl'} size='sm' variant={'transparent'}>
                            <Search2Icon/>
                        </Button>
                </InputLeftElement>
                <Input isDisabled placeholder="Search Transaction" variant={'filled'} overflow={'hidden'} rounded={'xl'}/>
            </InputGroup>
        </FormControl>
            </Grid>
            {/* {formatEther(result.data?.value?result.data.value:BigInt(0), "wei")}
            {result.data?.symbol.toString()} */}
            <Progress value={40} size='xs' colorScheme='blue'/>
            <Flex gap={8} p={'20px'} flexWrap={'wrap'} justifyContent={'center'}  h={'full'} overflowX={'hidden'}>
                <Card rounded={'2xl'}  flexGrow={'grow'} bg={bg} >
                    <Flex justifyContent={'space-between'} alignItems={'center'} py={'1rem'} px={'1.5rem'}  fontWeight={'bold'} fontSize={'md'} gap={3} >
                        <Flex gap={3}>
                        <RiCoinsLine size={'20px'}/> Token Transfer
                        </Flex>
                            <Tooltip label='Proposal ID'>
                                <Button h={'inherit'} fontSize={'md'} variant={'transparant'} isLoading={isLoading?true:false}>
                                    # {(parseInt(data?data.toString():'0')+1).toString()}
                                </Button>
                            </Tooltip>
                    </Flex>
                    <Divider color={'gray.500'}/>
                    <Grid p={'20px'} flexFlow={'column'} gap={3}>
                        <Flex gap={2} flexFlow={'column'} >
                            <Text fontWeight={'semibold'} fontSize={'sm'}>Amount</Text>
                            <Flex gap={2} alignItems={'center'} position={'relative'} zIndex={2} >
                                <InputGroup>
                                    <Input onChange={(e) => setAmount(parseFloat(e.currentTarget.value)*1000000000000000000)} type={'number'} pr={'4.5rem'} placeholder="0.00" variant={'filled'} overflow={'hidden'}  rounded={'lg'}/>
                                    <InputRightElement w={'min-content'}>
                                        {/* <TokenList/> // TODO: fetch and render the available ERC20 Token*/} 
                                    </InputRightElement>
                                </InputGroup>
                                <Button rounded={'lg'} fontSize={'xs'}>$0.00</Button>
                            </Flex>
                        </Flex>
                        <Flex gap={2} flexFlow={'column'} >
                            <Text fontWeight={'semibold'} fontSize={'sm'}>Address</Text>
                            <Flex gap={2} alignItems={'center'} position="relative" zIndex={1}>
                                <InputGroup>
                                    <Input onChange={(e) => setWalletAddress(e.currentTarget.value)} placeholder="Enter address" variant={'filled'} overflow={'hidden'}  rounded={'lg'} />
                                </InputGroup>
                            </Flex>
                        </Flex>
                    </Grid>
                    <Accordion  allowToggle >
                        <AccordionItem >
                            <h2>
                            <AccordionButton px={'20px'}>
                                <Box as="span" flex='1' fontSize={'sm'} fontWeight={'semibold'} textAlign='left'>
                                    Transaction Detail
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            </h2>
                            <AccordionPanel pb={4}>
                            <Grid templateColumns={'repeat(1, 1fr)'} px={'6px'} gap={2}>
                                <GridItem>
                                    <Flex justifyContent={'space-between'}>
                                        <Text>Function</Text>
                                        <Text>transfer</Text>
                                    </Flex>
                                </GridItem>
                                <GridItem>
                                    <Flex justifyContent={'space-between'}>
                                        <Text>ChainId</Text>
                                        <Text>{chainId}</Text>
                                    </Flex>
                                </GridItem>
                                <GridItem>
                                    <Flex justifyContent={'space-between'}>
                                        <Text>to(address)</Text>
                                        <Text>{walletAddress ? (walletAddress.length > 11 ? walletAddress.slice(0,8)+'...' : walletAddress): '0x00...0000'}</Text>
                                    </Flex>
                                </GridItem>
                                <GridItem>
                                    <Flex justifyContent={'space-between'}>
                                        <Text>value(uint256)</Text>
                                        <Text>{amount?amount:0}</Text>
                                    </Flex>
                                </GridItem>
                            </Grid>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    <Flex justifyContent={'end'} alignItems={'center'} p={'1rem'} fontWeight={'bold'} flexFlow={'row'} gap={2}>
                        <Button as={Link} to={`/chamber/${address}`} fontSize={'sm'} w={'30%'} borderColor={'gray.500'} variant={'outline'} fontStyle={'sm'} onClick={cancel}>
                            Cancel
                        </Button>
                        <Sign/>
                    </Flex>
                </Card>
                <Card rounded={'2xl'} width={['full','full','200.77px']} h={'max-content'} flexGrow={'grow'} bg={bg}>
                    <Flex justifyContent={'space-between'} alignItems={'center'} py={'1rem'} px={'1.5rem'}  fontWeight={'bold'} fontSize={'md'} gap={3} >
                        <Flex gap={3}>
                            <MdOutlineLeaderboard size={'20px'}/> Top Leaders
                        </Flex>
                    </Flex>
                    <Divider color={'gray.500'}/>
                    <Grid p={'20px'} flexFlow={'column'} gap={3}>
                    <Flex justifyContent={'space-between'} fontSize={'xs'} color={'gray.500'}>
                        <Text>NFT ID</Text>
                        <Text>Delegation</Text>
                    </Flex>
                    <Divider color={'gray.500'}/>
                        <TopLeader/>
                    </Grid>
                </Card>
            </Flex>
        </div>
    )
}

export default Token