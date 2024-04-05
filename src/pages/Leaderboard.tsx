import { Box, Flex, Card , useColorModeValue, CardBody, Stack,Text, Heading, Divider, Center, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, InputGroup, InputLeftElement, Button, Input, IconButton, HStack} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query";
import { useAccount, useReadContract, useSimulateContract } from "wagmi";
import { chamberAbi } from "../abi/chamberAbi";
import { Form, Link, useParams } from "react-router-dom";
import { sepolia } from "viem/chains";
import LeaderRow from "../components/LeaderRow";
import { Search2Icon, WarningTwoIcon } from "@chakra-ui/icons";
import Error from "./Error";
import { erc20Abi } from "viem";
import { chambersState } from "../hooks/store";
import request from "graphql-request";
import { getChamberByAddressQuery } from "../gql/graphql";
import { useState } from "react";
import { useWriteContract } from 'wagmi'
import { GrPowerReset } from "react-icons/gr";
import { dataSource } from "../data";

const Leaderboard = () => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const { address } = useParams();
  const getChamberByAddress = getChamberByAddressQuery
  const chamberDetails = useQuery<chambersState>({
    queryKey: ['chamberData'],
    queryFn: async () => request(
      dataSource.subgraphUrl,
      getChamberByAddress,
      {chamberAddress: address}
    ),
    staleTime: Infinity,
  })
  const {data, isLoading, isError, refetch, isRefetching} = useReadContract({
    abi: chamberAbi,
    address: `0x${address?.slice(2,42)}`,
    functionName:'getLeaderboard',
    chainId: sepolia.id,
  })
  const govTokenSymbol = useReadContract({
    abi: erc20Abi,
    address: `0x${(chamberDetails.data?.chamberDeployeds[0].govToken)?.slice(2.42)}`,
    functionName:'symbol',
    chainId: sepolia.id,
  })
  if (isError){
    return (
      <>
      <Error></Error>
      </>
    )
  }
  const [pnftID, setPNftID] = useState(0)
  const [pdelegation, setPDelegation] = useState(0)
  const [dnftID, setDNftID] = useState(0)
  const [ddelegation, setDDelegation] = useState(0)
  const account = useAccount()
  const Balance = useReadContract({
    abi: erc20Abi,
    address: `0x${chamberDetails.data?.chamberDeployeds[0].govToken?.slice(2)}`,
    functionName: 'balanceOf',
    args: [account.address!],
  })

  const approveSimulate = useSimulateContract({
    abi: erc20Abi,
    address: `0x${chamberDetails.data?.chamberDeployeds[0].govToken?.slice(2)}`,
    functionName:'approve',
    args: [`0x${address?.slice(2)}`,BigInt(pdelegation)]
  })

  const promoteSimulate = useSimulateContract({
    abi: chamberAbi,
    address: `0x${address?.slice(2)}`,
    functionName:'promote',
    args: [BigInt(pdelegation), BigInt(pnftID)]
  })

  const demoteSimulate = useSimulateContract({
    abi: chamberAbi,
    address: `0x${address?.slice(2)}`,
    functionName:'demote',
    args: [BigInt(ddelegation),BigInt(dnftID)]
  })

  const approveWrite = useWriteContract()
  const promoteWrite = useWriteContract()
  const demoteWrite = useWriteContract()

  return (
    <>
    <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={3} >
        <Breadcrumb fontWeight={'semibold'}>
        <BreadcrumbItem>
            <BreadcrumbLink>{address ? address.slice(0,4): ''}...{address ? address.slice(38,42) : ''}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
            <BreadcrumbLink as={Link} isCurrentPage>Leaderboard</BreadcrumbLink>
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
    <Box p={5} >
        <Flex justifyContent={'center'} gap={4} flexWrap={'wrap'}>
          <Card w={['full','30rem']} rounded={'xl'} bg={bg} h={'min-content'}>
            <CardBody>
              <HStack justifyContent={'space-between'} alignItems={'center'}>
                <Heading size={'md'}>Leaderboard</Heading>
                <IconButton h={'inherit'} variant={'transparent'}  onClick={()=>refetch()} aria-label="Reset" icon={<GrPowerReset/>}/>
              </HStack>
            </CardBody>
            <Divider/>
            <CardBody>
              <Flex justifyContent={'space-between'}>
                <Heading size={'xs'}>NFT ID</Heading>
                <Heading size={'xs'}>Delegation</Heading>
              </Flex>
            </CardBody>
            <Divider/>
            <CardBody>
              {
                isLoading || govTokenSymbol.isLoading || isRefetching?(<>Loading...</>):(
                  <>
                  {data && (data[0].length > 0)? Array.from({length: data[0].length}).map((_,index)=>{
                  return (
                    <>
                      <LeaderRow 
                      key={index}
                      nftTokenID={data[0]?.at(index)?.toString() || '0'}
                      delegation={parseInt((data[1]?.at(index))?.toString() || '0', 10)}
                      govTokenSymbol={govTokenSymbol.data?.toString() || ''}
                      />
                    </>
                      )
                    }):(
                      <>
                      <Center gap={3}>
                        <WarningTwoIcon/> No Leaders
                      </Center>
                      </>
                    )}
                  </>
                )
              }
            </CardBody>
          </Card>
          <Card w={['full','30rem']} rounded={'xl'} bg={bg} h={'min-content'}>
            <CardBody>
              <Stack>
                <Heading size={'md'}>Promote</Heading>
              </Stack>
            </CardBody>
            <Divider/>
            <CardBody>
              <Form >
                <FormControl isRequired>
                  <Flex gap={3} pb={5}>
                  <Input type="number" onChange={(e)=>{if(e.target.value !== ''){
                    setPNftID(parseInt(e.target.value))
                  }}} placeholder="Enter NFT ID"></Input>
                  <Input type="number" onChange={(e)=>{if(e.target.value !== ''){
                    setPDelegation(parseInt(e.target.value))
                  }}} placeholder="Enter Delegation"></Input>
                  </Flex>
                  <Flex justifyContent={'end'} gap={2}>
                    <Button colorScheme="blue" size={'sm'} 
                    isLoading={approveSimulate.isLoading || approveWrite.isPending} 
                    isDisabled={!Boolean(approveSimulate.data?.request)} 
                    onClick={()=> {
                      approveWrite.writeContract(approveSimulate.data!.request)
                      }} variant={'outline'}>Approve</Button>
                    <Button colorScheme="blue" size={'sm'} isLoading={promoteSimulate.isLoading || promoteWrite.isPending} isDisabled={!Boolean(promoteSimulate.data?.request)} onClick={()=> promoteWrite.writeContract(promoteSimulate.data!.request)}>Promote</Button>
                  </Flex>
                </FormControl>
              </Form>
            </CardBody>
            <Divider/>
            <CardBody>
              <Stack pb={5}>
                <Heading size={'md'}>Demote</Heading>
              </Stack>
              <Flex gap={3} pb={5}>
              <Input type="number" onChange={(e)=> {if(e.target.value !== ''){
                setDNftID(parseInt(e.target.value))
              }}} placeholder="Enter NFT ID"></Input>
              <Input type="number" onChange={(e)=>{if(e.target.value !== ''){
                setDDelegation(parseInt(e.target.value))}}} placeholder="Enter Delegation"></Input>
              </Flex>
              <Flex justifyContent={'end'} gap={2}>
              <Button colorScheme="red" size={'sm'} isLoading={demoteSimulate.isLoading || demoteWrite.isPending} isDisabled={!Boolean(demoteSimulate.data?.request)} onClick={()=> demoteWrite.writeContract(demoteSimulate.data!.request)} variant={'outline'}>Demote</Button>
              </Flex>
            </CardBody>
            <Divider/>
            <CardBody>
              <HStack>
                <Heading size={'md'}>Balance:</Heading>
                <Text >
                {account.isConnected && Balance.isFetched?Balance.data?.toString() + " ":'0 '} 
                {govTokenSymbol.data?.toString()}
                </Text>
              </HStack>
            </CardBody>
          </Card>
        </Flex>
    </Box>
    </>
  )
}

export default Leaderboard