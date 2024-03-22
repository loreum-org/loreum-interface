import { CheckIcon, SearchIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { Box, Card, CardBody, Divider, Flex, Heading, IconButton, Input, InputGroup, InputRightElement, Stack, Textarea, Tooltip, useColorModeValue, Select, FormLabel } from '@chakra-ui/react'
import { GrPowerReset } from "react-icons/gr";
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { isAddress } from 'viem'
import { FaCode } from "react-icons/fa6";

interface AbiData{
  "status": string,
  "message": string,
  "result": string,
}

interface AbiFragment {
  type: string;
  name: string;
  inputs: { type: string }[];
}

function isJSON(str:string) {
  try {
      return JSON.parse(str) && !!str;
  } catch (e) {
      return false;
  }
}

function BuilderCard() {
  const bg = useColorModeValue("gray.100", "gray.700");
  const [abiTextArea, setAbiTextArea] = useState('');
  const [abi, setAbi] = useState<AbiFragment[]>();
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
    refetchOnWindowFocus:false,
  }
  );
  useEffect(() => {
    if (isAddressValid) {
      refetch();
    }
    if (abiData && abiData?.result) {
      setAbiTextArea(abiData.result.toString())
      setAbi(JSON.parse(abiData.result));
    }
  }, [contractAddress, refetch, isAddressValid, abiData]);

  if (isError){
    return (
      <>
        Something went wrong!
      </>
    )
  }
  const handleAbiChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setAbiTextArea(value);

    if (isJSON(value)) {
      setAbi(JSON.parse(value));
    }
  };
  return (
    <Box p={5}>
        <Flex justifyContent={'center'}>
          <Card w={['full','30rem']} rounded={'xl'} bg={bg}>
            <CardBody>
            <Stack spacing={'3'}>
              <Heading size={'md'}>Transaction Builder</Heading>
            </Stack>
            </CardBody>
            <Divider/>
            <CardBody >
              <FormLabel fontWeight={'bold'}>Address</FormLabel>
              <InputGroup pb={5}>
                <Input fontSize={'sm'} value={contractAddress} onChange={(e) => setContractAddress(e.currentTarget.value)} placeholder='Enter Address'></Input>
                <InputRightElement>
                {
                  isAddressValid?(
                    <Tooltip label="Valid Address">
                      <IconButton aria-label='Loading' icon={<CheckIcon/>} variant={'transparent'} isLoading={isLoading?true:false}/> 
                    </Tooltip>
                    ):(
                      <Tooltip label={contractAddress.length===0?"Enter Address":"Invalid Address"}>
                        <IconButton aria-label='Loading' icon={<SearchIcon/>} variant={'transparent'} isLoading={isLoading?true:false}/> 
                      </Tooltip>
                  )
                }
                </InputRightElement>
              </InputGroup>
              <Flex alignItems={'center'} pb={2} fontWeight={'bold'} justifyContent={'space-between'}>
                <Tooltip label={'Application Binary Interface'} fontWeight={'bold'}>
                  ABI 
                </Tooltip>
                <Flex>
                <Tooltip label={'Reset'}>
                  <IconButton isDisabled={abiTextArea.length>0?false:true} h={'1.5rem'}variant={'ghost'}  onClick={()=>setAbiTextArea('')} aria-label='Reset' icon={<GrPowerReset/>}/>
                </Tooltip>
                <Tooltip label={'Format'}>
                  <IconButton isDisabled={abiTextArea.length>0?false:true} h={'1.5rem'}variant={'ghost'}  onClick={()=>setAbiTextArea(JSON.stringify(JSON.parse(abiTextArea),null,4))} aria-label='Format ABI' icon={<FaCode/>}/>
                </Tooltip>
                </Flex>
              </Flex>
              <Textarea  colorScheme='red' overflowX={'hidden'} h={'12rem'} fontSize={'sm'} placeholder='Address ABI' value={abiTextArea} onChange={handleAbiChange} isInvalid={isJSON(abiTextArea) || abiTextArea.length == 0 ?false:true}>
              </Textarea>
              <Flex pt={3} justifyContent={'end'}>
              {isJSON(abiTextArea) || abiTextArea.length == 0 ?"":(<Flex gap={2} alignItems={'center'} pt={2} color={'red.500'} fontSize={'sm'}><WarningTwoIcon color={'red.500'}/> Invalid JSON</Flex>)}
              </Flex>
            </CardBody>
            <Divider/>
            <CardBody>
              <Stack spacing={'3'} pb={'20px'}>
                <Heading size={'md'}>Transaction Details</Heading>
              </Stack>
              <Select placeholder='Select function' isDisabled={abi?.length?false:true}>
                {abi?.map((abiFuntion)=>(
                  <>
                  {abiFuntion.type ==="function"?
                    <option value={abiFuntion.name}>{abiFuntion.name}</option>
                    :(<></>)
                  }
                  </>
                ))}
              </Select>
            </CardBody>
          </Card>
        </Flex>
    </Box>
  )
}

export default BuilderCard