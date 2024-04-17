import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Grid,
    GridItem,
    Flex,
    Text,
    Tooltip,
  } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { useStore } from './Token';
import { CustomConnectButton2 } from '../components/Connect2';

function Sign() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isConnected } = useAccount()
    const amount = useStore((state)=>state.amount)
    const walletAddress = useStore((state)=>state.walletAddress)
    const proposalId = useStore((state)=>state.proposlId)
    return (
        <>
        {isConnected?(
            <>
            <Button onClick={onOpen} fontSize={'sm'} w={'30%'} colorScheme='blue' fontStyle={'sm'}  >Sign</Button>
            </>
        ): (
            <>
            <CustomConnectButton2 />
            </>
        )}

        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Create Proposal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Grid gap={2} px={1}>
                <GridItem>
                    <Flex justifyContent={'space-between'}>
                        <Text>
                            Proposal Id
                        </Text>
                        <Text>
                            # {proposalId}
                        </Text>
                    </Flex>
                </GridItem>
                <GridItem>
                    <Flex justifyContent={'space-between'}>
                        <Text>
                            Funtion
                        </Text>
                        <Text>
                            transfer
                        </Text>
                    </Flex>
                </GridItem>
                <GridItem>
                    <Flex justifyContent={'space-between'}>
                        <Text>
                            to(address)
                        </Text>
                        <Tooltip label={walletAddress}>
                            {walletAddress?walletAddress.slice(0,6)+'...'+walletAddress.slice(36,42):'0x0000...00000'}
                        </Tooltip>
                    </Flex>
                </GridItem>
                <GridItem>
                    <Flex justifyContent={'space-between'}>
                        <Text>
                            amount
                        </Text>
                        <Text>
                            {amount}
                        </Text>
                    </Flex>
                </GridItem>
            </Grid>
            </ModalBody>

            <ModalFooter gap={2}>
            <Button variant='outline'>Cancel</Button>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Confirm
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
        </>
  )
}

export default Sign