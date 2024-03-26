import { CheckIcon, DeleteIcon, DownloadIcon, EditIcon, SearchIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { useDisclosure, Text, Box, Card, CardBody, Divider, Flex, Heading, IconButton, Input, InputGroup, InputRightElement, Stack, Textarea, Tooltip, useColorModeValue, Select, FormLabel, Button, HStack, CardFooter } from '@chakra-ui/react'
import { GrPowerReset } from "react-icons/gr";
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { isAddress } from 'viem'
import { FaCode } from "react-icons/fa6";
import { create } from 'zustand';
import {
  FormControl,
} from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Form } from 'react-router-dom';

interface TransactionBatch {
  version: string;
  chainId: string;
  createdAt: number;
  meta: {
    name: string;
    description: string;
    txBuilderVersion: string;
    createdFromContractAddress: string;
    checksum: string;
  };
  transactions: Transaction[];
}

interface Transaction {
  to: string;
  value: string;
  data: null | string;
  contractMethod: ContractMethod;
  contractInputsValues: ContractInputsValues;
}

interface ContractMethod {
  inputs: InputsFragment[];
  name: string;
  payable: boolean;
}

interface ContractInputsValues {
  [key: string]: string;
}


interface AbiData{
  "status": string,
  "message": string,
  "result": string,
}

interface InputsFragment {
  internalType: string,
  name: string,
  type: string,
}

interface AbiFragment {
  type: string,
  name: string,
  inputs: InputsFragment[],
  outputs: InputsFragment[],
}

function isJSON(str:string) {
  try {
      return JSON.parse(str) && !!str;
  } catch (e) {
      return false;
  }
}

interface BuilderState{
  abiTextArea: string,
  abi: AbiFragment[],
  contractAddress: string,
  transactionBatch: TransactionBatch,
  setAbiTextArea: (abiTextArea: BuilderState['abiTextArea'])=>void,
  setAbi: (abi: BuilderState['abi'])=>void,
  setContractAddress: (contractAddress: BuilderState['contractAddress'])=>void,
  setTransactionBatch: (transactionBatch: BuilderState['transactionBatch'])=>void
  pushTransaction: (transaction: TransactionBatch['transactions'][0])=>void
}
const useBuilderState = create<BuilderState>((set)=>({
  abiTextArea:'',
  abi: [],
  contractAddress: '',
  transactionBatch: {
    version: '1',
    chainId: '1',
    createdAt: 0,
    meta: {
      name: '',
      description: '',
      txBuilderVersion: '',
      createdFromContractAddress: '',
      checksum: '',
    },
    transactions: [],
  },
  setAbiTextArea: (_abiTextArea)=>{
    set(()=>({abiTextArea:_abiTextArea}));
  },
  setAbi: (_abi)=>{
    set(()=>({abi:_abi}))
  },
  setContractAddress: (_contractAddress)=>{
    set(()=>({contractAddress:_contractAddress}));
  },
  setTransactionBatch: (_transactionBatch)=>{
    set(()=>({transactionBatch:_transactionBatch}));
  },
  pushTransaction: (_transaction)=>{
    set((state)=>({transactionBatch:{...state.transactionBatch, transactions:[...state.transactionBatch.transactions, _transaction]}}))
  }
}))

function isValidABI(jsonABI: string): boolean {
  try {
    const abi: AbiFragment[] = JSON.parse(jsonABI);
    if (!Array.isArray(abi)) {
      return false;
    }
    for (const entry of abi) {
      if (!entry.type && !entry.name && !entry.outputs && !Array.isArray(entry.inputs)) {
        console.log('Invalid ABI entry type:', entry.type);
        console.log('Invalid ABI entry inputs:', entry.inputs);
        return false;
      }
    }
    return true;
  } catch (error) {
    return false;
  }
}

function BuilderCard() {
  const bg = useColorModeValue("gray.100", "gray.700");
  const abiTextArea = useBuilderState((state)=>state.abiTextArea);
  const setAbiTextArea = useBuilderState((state)=>state.setAbiTextArea);
  const abi = useBuilderState((state)=>state.abi);
  const setAbi = useBuilderState((state)=>state.setAbi);
  const contractAddress = useBuilderState((state)=>state.contractAddress);
  const setContractAddress = useBuilderState((state)=>state.setContractAddress);
  const isAddressValid = isAddress(contractAddress);
  const [selectedFunction, setSelectedFucntion] = useState<AbiFragment | null>(null);
  const [to, setTo] = useState('');
  const handelFunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFunctionName = e.target.value;
    const selectedFunctionObj = abi.find((f) => f.name === selectedFunctionName);
    setSelectedFucntion(selectedFunctionObj || null);
  }
  const { data:abiData, refetch, isError, isLoading } = useQuery<AbiData>({
    queryKey:['abiData', contractAddress],
    queryFn: async (): Promise<AbiData> => {
      const response = await fetch(
        `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${import.meta.env.VITE_ETHERSCAN_API_KEY}`
      );
      return response.json();
    },
    enabled: isAddressValid,
    refetchOnWindowFocus:false,
  }
  );
  useEffect(() => {
    if (isAddressValid) {
      refetch();
      setTo(contractAddress)
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

    if (isJSON(value) && isValidABI(value)){
      setAbi(JSON.parse(value));
    }
  };

  const transactionBatch = useBuilderState((state)=>state.transactionBatch);
  const pushTransaction = useBuilderState((state)=>state.pushTransaction);
  
  const handleTransactionSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const transaction: Transaction = {
      to,
      value: '0',
      data: null,
      contractMethod: {
        inputs: selectedFunction?.inputs || [],
        name: selectedFunction?.name || '',
        payable: false,
      },
      contractInputsValues: {} as Record<string, string>, // Initialize contractInputsValues as an empty object
    };
    if (selectedFunction && selectedFunction.inputs) {
      selectedFunction.inputs.forEach((input, index) => {
        const inputValue = (event.currentTarget as HTMLFormElement)[`input-${index}`]?.value || '';
        transaction.contractInputsValues[input.name] = inputValue;
      });
    }
    pushTransaction(transaction);
  }


  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    <Box p={5} >
        <Flex justifyContent={'center'} gap={4} flexWrap={'wrap'}>
          <Card w={['full','30rem']} rounded={'xl'} bg={bg}>
            <CardBody>
            <Stack spacing={'3'}>
              <Heading size={'md'}>Transaction Builder</Heading>
            </Stack>
            </CardBody>
            <Divider/>
            <CardBody >
              <FormLabel fontWeight={'bold'}>Address</FormLabel>
              <InputGroup  pb={5}>
                <Input fontSize={['xs','sm']} value={contractAddress} onChange={(e) => setContractAddress(e.currentTarget.value)} placeholder='Enter Address'></Input>
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
              <Textarea fontSize={['xs','sm']} colorScheme='red' overflowX={'hidden'} h={'12rem'} placeholder='Address ABI' value={abiTextArea} onChange={handleAbiChange} isInvalid={isJSON(abiTextArea) || abiTextArea.length == 0 ?false:true}>
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
                <Select mb={'20px'} key={abi?.length} placeholder='Select function' onChange={handelFunctionChange} isDisabled={abi?.length?false:true}>
                 {abi?.filter((abiFuntion) => abiFuntion.type === "function").map((abiFuntion, index)=>(
                    <option key={`${abiFuntion.name}-${index}`} value={abiFuntion.name}>{abiFuntion.name}</option>
                  ))}
                </Select>
                {selectedFunction && (
                  <Form onSubmit={handleTransactionSubmit}>
                  <FormControl isRequired >
                    <FormLabel>To</FormLabel>
                    <Input mb={'20px'} placeholder='To' value={to} onChange={(e)=>setTo(e.target.value)}></Input>
                    <Flex flexFlow={'column'} gap={3}>
                      {selectedFunction.inputs.map((input, index) => (
                        <Flex key={index}flexFlow={'column'}>
                          <FormLabel>{input.name}</FormLabel>
                          <Input type="text" id={`input-${index}`} name={`input-${index}`} placeholder={input.type } />
                        </Flex>
                      ))}
                    </Flex>
                    <Flex justifyContent={'end'} pt={4}>
                      <Button type={'submit'} colorScheme='blue' w={'30%'}>Create</Button>
                    </Flex>
                  </FormControl>
                  </Form>
              )}
              </CardBody>
          </Card>
          <Card w={['full','30rem']} h={'min-content'} rounded={'xl'} bg={bg}>
            <CardBody>
              <HStack spacing={'3'} justifyContent={'space-between'}>
                <Heading size={'md'}>Transactions Batch</Heading>
                <HStack>
                  <Tooltip label={'Download'}>
                    <IconButton icon={<DownloadIcon/>} aria-label='Download' variant={'transparent'}   h={'inherit'}/>
                  </Tooltip>
                  <Tooltip label={'Delete'}>
                    <IconButton icon={<DeleteIcon/>} aria-label='Delete' variant={'transparent'} h={'inherit'}/>
                  </Tooltip>
                </HStack>
              </HStack>
            </CardBody>
            <Divider/>
            <CardBody>
              <Flex flexDirection={'column'} gap={3}>
                {transactionBatch.transactions.map((transaction, index)=>(
                  <>
                  <Flex key={index} justifyContent={'space-between'} w={'full'} >
                    <Text>
                    {transaction.to.slice(0,6)+"..."+transaction.to.slice(38)}
                    </Text>
                    <Text>
                    {transaction.contractMethod.name}
                    </Text>
                    <Box>
                    <IconButton aria-label='Edit' icon={<EditIcon/>} variant={'transparent'}  h={'inherit'}/>
                    <IconButton aria-label='Delete' icon={<DeleteIcon/>} variant={'transparent'}  h={'inherit'}/>
                    </Box>
                  </Flex>
                  <Divider/>
                  </>
                ))}
              </Flex>
            </CardBody>
            <CardFooter justifyContent={'end'}>
              <Button colorScheme='blue' isDisabled={transactionBatch.transactions.length>0?false:true} onClick={onOpen}>Create Batch</Button>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Modal Title</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    {(JSON.stringify(transactionBatch.transactions,null,4))}
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button variant='ghost'>Secondary Action</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </CardFooter>
          </Card>
        </Flex>
    </Box>
   </>
  )
}

export default BuilderCard