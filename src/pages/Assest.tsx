import { ExternalLinkIcon, Search2Icon } from "@chakra-ui/icons"
import { Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, InputGroup, InputLeftElement, Button, Input, Flex, GridItem, Divider, Skeleton, Box } from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { Link, useParams } from "react-router-dom"
import { useFetchNativeBalance, useFetchNfts, useFetchTokens } from "../components/FetchERC20";
import { formatEther } from "viem";
import NFTCard from "../components/NFTCard";

function Assests(){
  const {address} = useParams();
  const data = useFetchTokens(address!);
  const data1 = useFetchNativeBalance(address!);
  const nft = useFetchNfts(address!)
  return (
    <>
    <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={3} >
        <Breadcrumb fontWeight={'semibold'}>
        <BreadcrumbItem>
            <BreadcrumbLink>{address ? address.slice(0,4): ''}...{address ? address.slice(38,42) : ''}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
            <BreadcrumbLink as={Link} isCurrentPage>Assest</BreadcrumbLink>
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
      <Tabs variant='soft-rounded'>
        <TabList justifyContent={'end'}>
          <Flex border={'1px'} p={'3px'} rounded={'xl'} borderColor={'gray.500'}>
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >Tokens</Tab>
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >NFTs</Tab>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel>
            {/* Token Pannel */}
            <Grid templateColumns={'repeat(4, 1fr)'} gap={3} fontSize={'xs'} fontWeight={'bold'} pb={3} color={'gray.500'}>
              <GridItem>Token Name</GridItem>
              <GridItem>Token Address</GridItem>
              <GridItem>Token Balance</GridItem>
              <GridItem>Verified Collection</GridItem>
            </Grid>
            <Divider/>
            <Box h={4}></Box>
            {data1.isLoading || data1.isFetching || data1.isRefetching?(<>
              <Flex gap={2} flexFlow={'column'} pb={2}>
                <Skeleton h={"2rem"} rounded={'lg'}></Skeleton>
              </Flex>
            </>):(
              <>
              <Grid templateColumns={'repeat(4, 1fr)'} gap={3} pb={3}>
              <GridItem>{"Sepolia"}</GridItem>
              <GridItem>{"None"}</GridItem>
              <GridItem>{formatEther((data1.data?BigInt(data1.data.balance):BigInt(0)),"wei").toString()} ETH</GridItem>
              <GridItem>{"Verified"}</GridItem>
              </Grid>
              </>
            )}

            {data.isLoading || data.isFetching || data.isRefetching?(
              <Flex gap={2} flexFlow={'column'}>
                <Skeleton h={"2rem"} rounded={'lg'}></Skeleton>
                <Skeleton h={"2rem"} rounded={'lg'}></Skeleton>
                <Skeleton h={"2rem"} rounded={'lg'}></Skeleton>
              </Flex>
            ):data.data?.map((token)=>(
              <Grid templateColumns={'repeat(4, 1fr)'} gap={3}>
                <GridItem>{token.name}</GridItem>
                <GridItem _hover={{color:"skyblue"}}>
                  <a href={`http://sepolia.etherscan.io/address/${token.token_address}`} target="_blank" rel="noopener noreferrer">
                    <Flex gap={3} alignItems={'center'}>
                    {token.token_address.slice(0,5)}...{token.token_address.slice(-3)} 
                    <ExternalLinkIcon bgSize={"1.5rem"}/>
                    </Flex>
                  </a>
                </GridItem>
                <GridItem>{token.balance} {token.symbol}</GridItem>
                <GridItem>{token.verified_collection?"Verified":"Not Verified"}</GridItem>
              </Grid>
            ))}

          </TabPanel>
          <TabPanel>
              <Flex gap={4} flexWrap={'wrap'}> 
                {nft.isSuccess?nft.data.result?.map((nft)=>(
                  <>
                  <NFTCard name={nft.name} tokenID={nft.token_id} image={''}/>
                  </>
                )):(<>Loading...</>)}
              </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

export default Assests