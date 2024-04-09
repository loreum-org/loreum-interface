import { useQuery } from "@tanstack/react-query"
import { chambersState } from "../hooks/store"
import request from "graphql-request"
import { getChamberByAddressQuery } from "../gql/graphql"
import { useParams } from "react-router-dom"
import NotFoundPage from "./NotFoundPage"
import { dataSource } from "../data"
import { Box, Card, CardBody, Divider, Flex, Grid, HStack, Heading, IconButton, Skeleton, Text, useColorModeValue, useToast } from "@chakra-ui/react"
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons"

const ChamberHome = () => {
  const {address} = useParams()
  const chamberDetails = useQuery<chambersState>({
    queryKey: ['chamberData'],
    queryFn: async () => request(
      dataSource.subgraphUrl,
      getChamberByAddressQuery,
      {chamberAddress: address}
    ),
  })
  if(chamberDetails.data?.chamberDeployeds.length === 0){
    return(
      <NotFoundPage/>
    )
  }else if(chamberDetails.isError){
    return(
      <>
      Error
      </>
    )
  }
  const bg = useColorModeValue("gray.100", "gray.700");
  const toast = useToast();
  return (
    <>
    {
      (chamberDetails.isRefetching || chamberDetails.isFetching || chamberDetails.isLoading) && (chamberDetails.data?.chamberDeployeds.length !== 0)?(
        <>
        <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={'repeat(1, 1fr)'} gap={3} >
    <Flex justifyContent={'center'} gap={4} flexWrap={'wrap'}>
    <Skeleton w={['full','30rem']} rounded={'xl'}  h={'8rem'}></Skeleton>
    <Skeleton w={['full','30rem']} rounded={'xl'}  h={'8rem'}></Skeleton>
      </Flex>
      </Grid>
        </>
      ):(<>
    <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={'repeat(1, 1fr)'} gap={3} >
    <Flex justifyContent={'center'} gap={4} flexWrap={'wrap'}>
          <Card w={['full','30rem']} rounded={'xl'} bg={bg} h={'min-content'}>
            <CardBody>
              <HStack alignItems={'end'}>
                <Heading size={'sm'}>
                  Governance Token
                </Heading>
                <Text fontSize={'xs'}>
                  ERC20
                </Text>
              </HStack>
            </CardBody>
            <Divider/>
            <CardBody>
            <Flex alignItems={'center'} gap={3}>
              <Box>
                <a href={`http://sepolia.etherscan.io/address/${chamberDetails.data?.chamberDeployeds[0].memberToken}`} target="_blank" rel="noopener noreferrer">
                  {chamberDetails.data?.chamberDeployeds[0].govToken}
                  <IconButton size={'xs'} ml={3} aria-label="link" icon={<ExternalLinkIcon/>} />
                </a>
              </Box>
              <IconButton size={'xs'}  aria-label="copy" icon={<CopyIcon/>} onClick={() => {
                navigator.clipboard.writeText(chamberDetails.data?.chamberDeployeds[0].govToken!),
                toast({
                  title: 'Copied to clipboard.',
                  status: 'success',
                  duration: 3000,
                })
              }}></IconButton>
              </Flex>
            </CardBody>
          </Card>
          <Card w={['full','30rem']} rounded={'xl'} bg={bg} h={'min-content'}>
          <CardBody>
              <HStack alignItems={'end'}>
                <Heading size={'sm'}>
                  Membership Token
                </Heading>
                <Text fontSize={'xs'}>
                  ERC721
                </Text>
              </HStack>
            </CardBody>
            <Divider/>
            <CardBody>
              <Flex alignItems={'center'} gap={3}>
                <Box _hover={{color:'blue.500'}}>
                  <a href={`http://sepolia.etherscan.io/address/${chamberDetails.data?.chamberDeployeds[0].memberToken}`} target="_blank" rel="noopener noreferrer">
                    {chamberDetails.data?.chamberDeployeds[0].memberToken}
                    <IconButton size={'xs'} ml={3} aria-label="link" icon={<ExternalLinkIcon/>} />
                  </a>
                </Box>
              <IconButton size={'xs'} aria-label="copy" icon={<CopyIcon/>} onClick={() => {
                  navigator.clipboard.writeText(chamberDetails.data?.chamberDeployeds[0].memberToken!),
                  toast({
                    title: 'Copied to clipboard.',
                    status: 'success',
                    duration: 3000,
                  })
                }}></IconButton>
              </Flex>
            </CardBody>
          </Card>
    </Flex>
    </Grid>
    </>)
    }
    </>
  )
}

export default ChamberHome