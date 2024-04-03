import { ArrowBackIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, ButtonGroup, Card, CardBody, Container, Divider, Flex, FormLabel, Grid, HStack, Heading, IconButton, Input, Text, useColorModeValue } from "@chakra-ui/react"
import { useState } from "react";
import { useSimulateContract, useWriteContract } from "wagmi";
import { registryAbi } from "../abi/registryAbi";
import { Link } from "react-router-dom";
import { MdDone } from "react-icons/md";
import { BiError } from "react-icons/bi";

function CreateChamber() {
  const bg = useColorModeValue("gray.100", "gray.700");
  const [govToken, setGovToken] = useState('');
  const [memberToken, setMemberToken] = useState('');
  const simulateDeployChamber = useSimulateContract({
    abi: registryAbi,
    address: '0x46A49D4391F2F220D3661b2a2BFe4b306EE18845',
    functionName: 'deploy',
    args: [memberToken, govToken],
  })
  const writeDeployChamber = useWriteContract()
  return (
    <Container maxWidth={"container.xl"}>
        <Grid h={'80vh'}  justifyContent={'center'} p={3}>
          <Flex gap={4}>
        <Card w={['full','30rem']} rounded={'xl'} bg={bg} h={'min-content'}>
          <CardBody>
            <HStack>
              <IconButton as={Link} to={'/'} aria-label="back" icon={<ArrowBackIcon/>} h={'inherit'} variant={'transparent'} ></IconButton>
              <Heading size={'md'}>Create Chamber</Heading>
            </HStack>
          </CardBody>
          <Divider/>
          <CardBody>
            <Flex flexFlow={'column'} gap={3}>
            <Flex gap={1} flexFlow={'column'}>
              <FormLabel>Governance Token</FormLabel>
              <Input value={govToken} onChange={(e)=>setGovToken(e.target.value)} placeholder="Governance Token Address"></Input>
            </Flex>
            <Flex gap={1} flexFlow={'column'}>
              <FormLabel>Membership Token</FormLabel>
              <Input value={memberToken} onChange={(e)=>setMemberToken(e.target.value)} placeholder="Membership Token Address"></Input>
            </Flex>
            <Flex justifyContent={'end'}>
              <ButtonGroup>
              <IconButton aria-label="state" icon={simulateDeployChamber.isError?<BiError/>:<MdDone/>} isLoading={simulateDeployChamber.isFetching} ></IconButton>
              <Button colorScheme="blue" isDisabled={!Boolean(simulateDeployChamber.data?.request)} onClick={()=> writeDeployChamber.writeContract(simulateDeployChamber.data!.request)}>Create</Button>
              </ButtonGroup>
            </Flex>
            </Flex>
          </CardBody>
          <Divider/>
          <CardBody>
            <Flex alignItems={'end'} gap={3}>
              <Text fontWeight={'bold'}>
                Transaction Hash
              </Text>
              <Text>
                {writeDeployChamber.isSuccess?(
                <>
                  <a href={`https://sepolia.etherscan.io/tx/${writeDeployChamber.data}`} target="_blank" rel="noopener noreferrer">
                  <Flex gap={2} _hover={{color: 'blue.500'}}>
                  {writeDeployChamber.data?.slice(0,5)}..{writeDeployChamber.data?.slice(63)} <ExternalLinkIcon alignSelf={'center'}/>
                  </Flex>
                  </a>
                  </>)
                  :'0x000..000'}
              </Text>
            </Flex>
            <Alert status="info" mt={3} rounded={'lg'}>
              <AlertIcon/>
              <AlertTitle>Notice</AlertTitle>
              <AlertDescription>At least one token of each type needed.</AlertDescription>
            </Alert>
          </CardBody>
        </Card>
        </Flex>
        </Grid>
    </Container>
  )
}

export default CreateChamber