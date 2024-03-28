import { Box, Flex, Card , useColorModeValue, CardBody, Stack, Heading, Divider, Center, Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, InputGroup, InputLeftElement, Button, Input, IconButton, HStack} from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query";
import { useReadContract } from "wagmi";
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

const Leaderboard = () => {
  const bg = useColorModeValue("gray.100", "gray.700");
  const { address } = useParams();
  const getChamberByAddress = getChamberByAddressQuery
  const chamberDetails = useQuery<chambersState>({
    queryKey: ['chamberData'],
    queryFn: async () => request(
      import.meta.env.VITE_SUBGRAPH_URL,
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
  const [BOA,setBOA] = useState('')
  const {writeContract} = useWriteContract()
  const [isLoading1, setisLoading1] = useState(false)

  const Balance = useReadContract({
    abi: erc20Abi,
    address: `0x${chamberDetails.data?.chamberDeployeds[0].govToken?.slice(2)}`,
    functionName:'balanceOf',
    args: [`0x${BOA?.slice(2)}`],
    chainId: sepolia.id,
  })

  const Sign = async() => {
    try {
      setisLoading1(true);
      const sign = await writeContract({
        abi: erc20Abi,
        address: `0x${chamberDetails.data?.chamberDeployeds[0].govToken?.slice(2)}`,
        functionName:'approve',
        args: [`0x${address?.slice(2)}`,BigInt(pdelegation)]
      })
      console.log('sign Reuslt', sign)
    }catch(error){
      console.log("Error ", error);
    }finally{
      setisLoading1(false)
    }
  }
  const promote = async() => {
    try {
      setisLoading1(true);
      const promote = await writeContract({
        abi: chamberAbi,
        address: `0x${address?.slice(2)}`,
        functionName:'promote',
        args: [BigInt(pdelegation), BigInt(pnftID)]
      })
      console.log('sign Reuslt', promote)
    }catch(error){
      console.log("Error ", error);
    }finally{
      setisLoading1(false)
    }
  }

  const demote = async() => {
    setisLoading1(true)
    try {
      const demote =await writeContract({
        abi: chamberAbi,
        address: `0x${address?.slice(2)}`,
        functionName:'demote',
        args: [BigInt(ddelegation),BigInt(dnftID)]
      })
      refetch
      console.log('sign Reuslt', demote)
    }catch(error){
      console.log("Error ", error);
    }finally{
      setisLoading1(false)
    }
  }

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
                  <Input type="number" onChange={(e)=>setPNftID(parseInt(e.target.value))} placeholder="Enter NFT ID"></Input>
                  <Input type="number" onChange={(e)=>setPDelegation(parseInt(e.target.value))} placeholder="Enter Delegation"></Input>
                  </Flex>
                  <Flex justifyContent={'end'} gap={2}>
                  <Button colorScheme="blue" size={'sm'} onClick={Sign} isLoading={isLoading1} variant={'outline'}>Approve</Button>
                  <Button colorScheme="blue" size={'sm'} onClick={promote} isLoading={isLoading1}>Promote</Button>
                  </Flex>
                </FormControl>
              </Form>
            </CardBody>
            <Divider/>
            <CardBody>
              <Stack pb={5}>
                <Heading size={'md'}>Demote</Heading>
              </Stack>
              <Form onSubmit={demote}>
                <FormControl isRequired>
                  <Flex gap={3} pb={5}>
                  <Input type="number" onChange={(e)=>setDNftID(parseInt(e.target.value))} placeholder="Enter NFT ID"></Input>
                  <Input type="number" onChange={(e)=>setDDelegation(parseInt(e.target.value))} placeholder="Enter Delegation"></Input>
                  </Flex>
                  <Flex justifyContent={'end'} gap={2}>
                  <Button colorScheme="red" size={'sm'} type={'submit'} isLoading={isLoading1}  variant={'outline'}>Demote</Button>
                  </Flex>
                </FormControl>
              </Form>
            </CardBody>
            <Divider/>
            <CardBody>
              <Stack pb={5}>
                <Heading size={'md'}>BalanceOf</Heading>
              </Stack>
              <HStack pb={5}>
              <Input type="text" onChange={(e)=>setBOA(e.target.value)} placeholder="Enter Address"></Input>
              </HStack>
              Balance: {Balance.data?.toString()} {govTokenSymbol.data?.toString()}
            </CardBody>
          </Card>
        </Flex>
    </Box>
    </>
  )
}

export default Leaderboard