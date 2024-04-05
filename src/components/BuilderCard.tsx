import { CheckIcon, DeleteIcon, DownloadIcon, ExternalLinkIcon, SearchIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { useDisclosure, Text, Box, Card, CardBody, Divider, Flex, Heading, IconButton, Input, 
  InputGroup, InputRightElement, Stack, Textarea, Tooltip, useColorModeValue, Select, FormLabel, 
  Button, HStack, CardFooter, Grid, GridItem, useToast, Alert, AlertIcon, AlertTitle, AlertDescription, 
  Link } from '@chakra-ui/react'
import { GrPowerReset } from "react-icons/gr";
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { AbiParameter, isAddress, parseEther, toFunctionSelector } from 'viem'
import { FaCode } from "react-icons/fa6";
import { Switch } from '@chakra-ui/react'
import { create } from 'zustand';
import { Abi, AbiFunction } from 'abitype'
import {
  FormControl,
} from '@chakra-ui/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
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
import { Form, useParams } from 'react-router-dom';
import Identicon from './identicon';
import { encodeAbiParameters } from 'viem'
import { chamberAbi } from '../abi/chamberAbi';
import { writeContract } from '@wagmi/core'
import { config } from '../config';

interface TransactionBatch {
  version: string;
  chainId: string;
  createdAt: number;
  meta: {
    name: string;
    description: string;
    txBuilderVersion: string;
    createdFromChamberAddress: string;
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
  functionAbi: AbiFunction | null;
}

interface ContractMethod {
  inputs: readonly AbiParameter[];
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

function isJSON(str:string) {
  try {
      return JSON.parse(str) && !!str;
  } catch (e) {
      return false;
  }
}

interface BuilderState{
  abiTextArea: string,
  abi: AbiFunction[],
  contractAddress: string,
  transactionBatch: TransactionBatch,
  setAbiTextArea: (abiTextArea: BuilderState['abiTextArea'])=>void,
  setAbi: (abi: BuilderState['abi'])=>void,
  setContractAddress: (contractAddress: BuilderState['contractAddress'])=>void,
  setTransactionBatch: (transactionBatch: BuilderState['transactionBatch'])=>void
  pushTransaction: (transaction: TransactionBatch['transactions'][0])=>void
  setTransactionToEmpty: ()=>void
}
const useBuilderState = create<BuilderState>((set)=>({
  abiTextArea:'',
  abi: [],
  contractAddress: '',
  transactionBatch: {
    version: '1',
    chainId: '',
    createdAt: 0,
    meta: {
      name: '',
      description: '',
      txBuilderVersion: '1.0.0',
      createdFromChamberAddress: '',
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
    set((state)=>({
      transactionBatch:{
        ...state.transactionBatch, 
        transactions:[...state.transactionBatch.transactions, _transaction]
      }})
    )
  },
  setTransactionToEmpty: () => {
    set((state)=>({
      transactionBatch:{
        ...state.transactionBatch, 
        transactions:[]
      }
    }))
  }
}))

function isValidABI(jsonABI: string): boolean {
  try {
    const abi: Abi = JSON.parse(jsonABI);
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
  const [selectedFunction, setSelectedFucntion] = useState<AbiFunction | null>(null);
  const [to, setTo] = useState('');
  const [value, setValue] = useState(0.0);
  const [TnxHash, setTnxHash] = useState('');
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
      value: value.toString(),
      data: null,
      contractMethod: {
        inputs: selectedFunction?.inputs || [],
        name: selectedFunction?.name || '',
        payable: false,
      },
      contractInputsValues: {} as Record<string, string>, // Initialize contractInputsValues as an empty object
      functionAbi: selectedFunction,
    };
    if (selectedFunction && selectedFunction.inputs) {
      selectedFunction.inputs.forEach((input, index) => {
        const inputValue = (event.currentTarget as HTMLFormElement)[`input-${index}`]?.value || '';
        transaction.contractInputsValues[input.name? input.name : ''] = inputValue;
      });
    }
    const functionSelector = toFunctionSelector(selectedFunction || '');
    const encodedData = encodeAbiParameters(
      selectedFunction?.inputs || [],
      Object.values(transaction.contractInputsValues),
    );
    transaction.data = functionSelector + encodedData.toString().slice(2)
    pushTransaction(transaction);
  }

  const setTransactionToEmpty = useBuilderState((state)=>state.setTransactionToEmpty);

  const deleteTransaction = () => {
    setTransactionToEmpty()
  }

  // const res = useReadContract({
  //   abi: abi,
  //   address: to as `0x${string}`,
  //   functionName: selectedFunction?.name || '',
  // })

  const downloadJSON = () => {
    const fileDataString = JSON.stringify(transactionBatch, null, 2); // Convert JSON to string with indentation
    const blob = new Blob([fileDataString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.download = `${'Transaction'}.json`;
    link.href = url;
    link.style.display = 'none'; // Make it invisible

    document.body.appendChild(link);
    link.click(); // Trigger the download

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  const [readMode, setReadMode] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { address } = useParams<{ address: string }>();
  const toast = useToast()
  const [sendTnxIsLoading, setSendTnxIsLoading] = useState(false);
  const callSendTransaction = async () => {
    setSendTnxIsLoading(true);
    if (!address) {
      return;
    }

    try {
      const datas: `0x${string}`[] = transactionBatch.transactions.map((transaction) => {
        return (transaction.data ? `0x${transaction.data.slice(2)}` : `0x`) as `0x${string}`;
      });
    
      const addresses: `0x${string}`[] = transactionBatch.transactions.map((transaction) => {
        return (transaction.to ? `0x${transaction.to.slice(2)}` : `0x`) as `0x${string}`;
      });
    
      const values: readonly bigint[] = transactionBatch.transactions.map((transaction) => {
        return transaction.value ? parseEther(transaction.value, "wei") : BigInt(0);
      });

      const result = await writeContract(config,{
        abi: chamberAbi,
        address: `0x${address.slice(2)}`,
        functionName: 'create',
        args: [addresses, values, datas],
      });
      setTnxHash(result.toString());
      setSelectedFucntion(null);
      setSendTnxIsLoading(false);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description:("Faild to send transaction.") ,
        status: 'error',
        duration: 5000,
        isClosable: true,
        variant: 'subtle',
      });
      setSendTnxIsLoading(false);
    }
  }
  return (
    <>
    <Box p={5} >
        <Flex justifyContent={'center'} gap={4} flexWrap={'wrap'}>
          <Card w={['full','30rem']} rounded={'xl'} bg={bg}>
            <CardBody>
            <HStack spacing={'3'} justifyContent={'space-between'}>
              <Heading size={'md'}>Transaction Builder</Heading>
              <Switch isDisabled onChange={() => (
                setReadMode(!readMode),
                readMode?(
                  toast({
                    title: 'Write Mode',
                    description:("Can write contract.") ,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    variant: 'subtle',
                  })
                ):(
                  toast({
                    title: 'Read Mode',
                    description:("Only can read contract.") ,
                    status: 'info',
                    duration: 5000,
                    isClosable: true,
                    variant: 'subtle',
                  })
                )
              )}/>
            </HStack>
            </CardBody>
            <Divider/>
            <CardBody >
              <FormLabel fontWeight={'bold'}>Address</FormLabel>
              <InputGroup  pb={5}>
                <Input fontSize={['xs','sm']} value={contractAddress} onChange={(e) => setContractAddress(e.currentTarget.value)}  placeholder='Enter Address'></Input>
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
               {abi?.filter((abiFuntion) => readMode?(abiFuntion.type === "function" && abiFuntion.stateMutability === ('view'|| 'pure')):(abiFuntion.type === "function" && abiFuntion.stateMutability !== ('view'|| 'pure')) ).map((abiFuntion, index)=>(
                  <option key={`${abiFuntion.name}-${index}`} value={abiFuntion.name}>{abiFuntion.name}</option>
                ))}
              </Select>
              {selectedFunction && (
                <Form onSubmit={handleTransactionSubmit}>
                <FormControl isRequired >
                  <FormLabel>To</FormLabel>
                  <Input mb={'20px'} placeholder='To' value={to} onChange={(e)=>setTo(e.target.value)}></Input>
                  <FormLabel>Value</FormLabel>
                  <Input mb={'20px'} placeholder='Value' value={value} type={'number'} onChange={(e)=>setValue(parseFloat(e.target.value))}></Input>
                  <Flex flexFlow={'column'} gap={3}>
                    {selectedFunction.inputs.map((input, index) => (
                      <Flex key={index}flexFlow={'column'}>
                        <FormLabel>{input.name}</FormLabel>
                        <Input id={`input-${index}`} name={`input-${index}`} placeholder={input.type } />
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
          {
            readMode?(
              <Card w={['full','30rem']} h={'min-content'} rounded={'xl'} bg={bg}>
                <CardBody>
                  <HStack>
                    <Heading size={'md'}>Read Contract</Heading>
                  </HStack>
                </CardBody>
                <Divider/>
                <CardBody>
                  {/* {res.data} */}
                </CardBody>
              </Card>
            ):(
          <Card w={['full','30rem']} h={'min-content'} rounded={'xl'} bg={bg}>
            <CardBody>
              <HStack spacing={'3'} justifyContent={'space-between'}>
                <Heading size={'md'}>Transactions Batch</Heading>
                <HStack>
                  <Tooltip label={'Download'}>
                    <IconButton icon={<DownloadIcon/>} onClick={downloadJSON} aria-label='Download' variant={'transparent'}   h={'inherit'}/>
                  </Tooltip>
                  <Tooltip label={'Delete'}>
                    <IconButton icon={<DeleteIcon/>} onClick={deleteTransaction} aria-label='Delete' variant={'transparent'} h={'inherit'}/>
                  </Tooltip>
                </HStack>
              </HStack>
            </CardBody>
            <Divider/>
              <Accordion allowToggle>
                {transactionBatch.transactions.map((transaction, index)=>(
                  <AccordionItem key={index}>
                  <AccordionButton px={6} py={3}>
                    <Flex justifyContent={'space-between'} w={'full'} >
                      <Tooltip label={transaction.to}>
                      {transaction.to.slice(0,6)+"..."+transaction.to.slice(38)}
                      </Tooltip>
                      <Tooltip label={"method: "+transaction.contractMethod.name}>
                      {transaction.contractMethod.name}
                      </Tooltip>
                      <AccordionIcon/>
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel px={6} bg={bg}>
                    <Flex flexFlow={'column'} gap={3}>
                        <Text>Interact with:</Text>
                        <Flex gap={2}>
                          <Identicon address={transaction.to} isize={20} /> 
                          <Text>
                            {transaction.to}
                          </Text>
                        </Flex>
                        <Flex justifyContent={'space-between'}>
                          <Text>to(address)</Text>
                          <Tooltip label={transaction.to}>{transaction.to.slice(0,6)+"..."+transaction.to.slice(38)}</Tooltip>
                        </Flex>
                        <Flex justifyContent={'space-between'}>
                          <Text>value:</Text>
                          <Text>{transaction.value} ETH</Text>
                        </Flex>
                        <Grid templateColumns={'repeat(3, 1fr)'} justifyContent={'space-between'}>
                          <Text>data:</Text>
                          <GridItem colSpan={2}>
                          <Text  overflowWrap={'anywhere'}>{transaction.data}</Text>
                          </GridItem>
                        </Grid>
                        <Divider/>
                        {Object.entries(transaction.contractInputsValues).map(([key,value]:[string, string])=>(
                          <Flex justifyContent={'space-between'} flexWrap={'wrap'} key={key}>
                            <Text>{key+":"}</Text>
                            <Text>{value}</Text>
                          </Flex>
                        ))}
                    </Flex>
                  </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            <CardFooter justifyContent={'end'}>
              <Button colorScheme='blue' isDisabled={transactionBatch.transactions.length>0?false:true} onClick={onOpen}>
                {
                  readMode?"Read Batch":"Send Batch"
                }
              </Button>
            </CardFooter>
            <Divider/>
            <CardBody>
              <Flex flexFlow={'column'} gap={3}>
              <Alert status='warning' rounded={'lg'}>
                <AlertIcon />
                <AlertTitle fontSize={'sm'}>Notice</AlertTitle>
                <AlertDescription fontSize={'xs'}>
                  Make sure there are atleast 5 leaders.
                </AlertDescription>
              </Alert>
              <Alert status='info' rounded={'lg'}>
                <AlertIcon />
                <AlertTitle fontSize={'sm'}>Notice</AlertTitle>
                <AlertDescription fontSize={'xs'}>
                  Make sure you have altleast one MemberShip Token.
                </AlertDescription>
              </Alert>
              </Flex>
            </CardBody>
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Confirm Transaction</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody >
                      Transaction Hash: {TnxHash.length ? (
                        <Link color={'skyblue'} href={`https://sepolia.etherscan.io/tx/${TnxHash}`} isExternal variant={'link'}>
                          {TnxHash.slice(0,5)}..{TnxHash.slice(63)} <ExternalLinkIcon/>
                        </Link>
                      ):(
                        <>
                        0x000..000
                        </>
                      )}
                  </ModalBody>
                  <ModalFooter>
                    <Button colorScheme='blue' variant='outline' mr={3} onClick={onClose}>
                      Close
                    </Button>
                    <Button onClick={callSendTransaction} isLoading={sendTnxIsLoading} colorScheme='blue'>Confirm</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
          </Card>
        )}
        </Flex>
    </Box>
   </>
  )
}

export default BuilderCard