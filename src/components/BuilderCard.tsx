import { CheckIcon, NotAllowedIcon } from '@chakra-ui/icons'
import { Box, Card, CardBody, Divider, Flex, Heading, IconButton, Input, InputGroup, InputRightAddon, Stack, Textarea, Tooltip, useColorModeValue } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react'
import { isAddress } from 'viem'

interface AbiData{
  "status": string,
  "message": string,
  "result": string[],
}

function BuilderCard() {
  const bg = useColorModeValue("gray.100", "gray.700");
  const [textareaValue, setTextareaValue] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const isAddressValid = isAddress(contractAddress);
  const { data:abiData, refetch, isError, isLoading } = useQuery<AbiData>({
    queryKey:['abiData', contractAddress],
    queryFn: async (): Promise<AbiData> => {
      const response = await fetch(
        `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      return response.json();
    },
    enabled: isAddressValid,
  }
  );
  useEffect(() => {
    if (isAddressValid) {
      refetch();
    }
    if (abiData && abiData?.result) {
      setTextareaValue(abiData.result.toString());
    }
  }, [contractAddress, refetch, isAddressValid, abiData]);

  if (isError){
    return (
      <>
        Something went wrong!
      </>
    )
  }
  return (
    <Box p={5}>
        <Flex justifyContent={'center'}>
          <Card minW={'sm'} rounded={'xl'} bg={bg}>
            <CardBody>
            <Stack spacing={'3'}>
              <Heading size={'md'}>Transaction Builder</Heading>
            </Stack>
            </CardBody>
            <Divider/>
            <CardBody>
              <InputGroup pb={5}>
                <Input fontSize={'sm'} isRequired={true} value={contractAddress} onChange={(e) => setContractAddress(e.currentTarget.value)} placeholder='Enter Address'></Input>
                <InputRightAddon>
                {
                  isAddressValid?(
                    <Tooltip label="Valid Address">
                      <IconButton aria-label='Loading' icon={<CheckIcon/>} variant={'transparent'} isLoading={isLoading?true:false}/> 
                    </Tooltip>
                    ):(
                      <Tooltip label={contractAddress.length===0?"Enter Address":"Not a Valid Address"}>
                        <IconButton aria-label='Loading' icon={<NotAllowedIcon/>} variant={'transparent'} isLoading={isLoading?true:false}/> 
                      </Tooltip>
                  )
                }
                </InputRightAddon>
              </InputGroup>
              <Textarea h={'xs'} fontSize={'sm'} placeholder='Address ABI' value={textareaValue} onChange={(e) => setTextareaValue(e.target.value)}></Textarea>
            </CardBody>
            <Divider/>
            <CardBody>
            </CardBody>
          </Card>
        </Flex>
    </Box>
  )
}

export default BuilderCard