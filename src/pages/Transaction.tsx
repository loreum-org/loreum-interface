import { Search2Icon } from '@chakra-ui/icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Grid,
  FormControl,
  InputGroup,
  Input,
  InputLeftElement,
  Button,
  Flex,
  Hide,
  GridItem,
  Divider,
  useDisclosure,
  Text
} from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { MdCallMade } from "react-icons/md";
import { MdCallReceived } from "react-icons/md";
import { useState } from 'react';
import { create } from "zustand"
import { useParams, Params } from 'react-router-dom';
import { Link } from 'react-router-dom';

type State = {
    query: string
}
type Action = {
    setQuery: (query: State['query']) => void
}

const useQueryStore = create<State & Action>((set) => ({
    query: '',
    setQuery: (query) => set(()=> ({query: query }))
}))

interface AddressParams extends Params {
  address: string;
}

const Transaction = () => {
  const {address} = useParams<AddressParams>();
  const query = useQueryStore((state)=> state.query)
  const setQuery = useQueryStore((state)=> state.setQuery)
  const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(5px) '
    />
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = useState(<OverlayOne />)
  return (
    <>
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>Receive</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{address}</Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Done</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={3}>
        <Breadcrumb fontWeight={'semibold'}>
          <BreadcrumbItem>
            <BreadcrumbLink>
            {address ? address.slice(0,4): ''}...{address ? address.slice(38,42) : ''}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction`}>Transaction</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <FormControl>
              <InputGroup size='md'>
                  <InputLeftElement  justifyContent={'start'}>
                          <Button type={'submit'} borderRightRadius={0} rounded={'xl'} size='sm' variant={'transparent'}>
                              <Search2Icon/>
                          </Button>
                  </InputLeftElement>
                  <Input onChange={(e) => setQuery(e.currentTarget.value)} value={query} placeholder="Search Transaction" variant={'filled'} overflow={'hidden'} rounded={'xl'}/>
              </InputGroup>
        </FormControl>
      </Grid>
      <Tabs variant={'soft-rounded'} >
        <TabList alignItems={'center'} justifyContent={['center','end']} pb={'1rem'} gap={2}>
        <Link to={`/chamber/${address}/transaction/send`}>
          <Button fontSize={['xs','sm']} rounded={'lg'} h={'2rem'} size={'sm'} leftIcon={<MdCallMade/> }>
            Send
          </Button>
          </Link>
          <Button fontSize={['xs','sm']} rounded={'lg'} h={'2rem'} size={'sm'} leftIcon={<MdCallReceived/> }
          onClick={() => {
            setOverlay(<OverlayOne />)
            onOpen()
          }}>
            Receive
          </Button>
          <Flex border={'1px'} p={'3px'} rounded={'xl'} borderColor={'gray.500'}>
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >Queue</Tab>
            <Tab rounded={'lg'} fontSize={['xs','sm']} h={'2rem'} >History</Tab>
          </Flex>
        </TabList>
        <Hide below='sm'>
        <Grid templateColumns={'repeat(8, 1fr)'} justifyItems={'center'} pb={'0.5rem'} fontSize={'xs'} color={'gray.500'} fontWeight={'semibold'}>
          <GridItem>Transaction</GridItem>
          <GridItem>Txn Hash</GridItem>
          <GridItem>Amount</GridItem>
          <GridItem>Chamber</GridItem>
          <GridItem>Proposal ID</GridItem>
          <GridItem>Network</GridItem>
          <GridItem>Time</GridItem>
          <GridItem>Status</GridItem>
        </Grid>
        </Hide>
        <Divider/>
        <TabPanels>
          <TabPanel >
            <Flex flexFlow={'column'}>
             <Grid templateRows={'repeat(8, 1fr)'} gap={3}>
              <GridItem as={Button}></GridItem>
              <GridItem as={Button}></GridItem>
              <GridItem as={Button}></GridItem>
              <GridItem as={Button}></GridItem>
             </Grid>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex flexFlow={'column'} rowGap={3}>
              <Button w={'full'} rounded={'lg'}></Button>
              <Button w={'full'} rounded={'lg'}></Button>
              <Button w={'full'} rounded={'lg'}></Button>
              <Button w={'full'} rounded={'lg'}></Button>
              <Button w={'full'} rounded={'lg'}></Button>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

export default Transaction