import {
  Flex,
  Box,
  Heading,
  ButtonGroup,
  Button,
  Image,
  useColorMode,
  useColorModeValue,
  Hide,
  Grid,
  Input,
  Text,
  InputRightElement,
  InputGroup
} from "@chakra-ui/react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react'
import { SunIcon, ChevronLeftIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { FaDiscord , FaXTwitter, } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { LuMoon } from "react-icons/lu";
import { LuBell } from "react-icons/lu";

import { CustomConnectButton } from '../components/Connect';

import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure
} from '@chakra-ui/react'


function Nav() {
    const { colorMode, toggleColorMode } = useColorMode()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const bg = useColorModeValue("gray.200", "gray.700");
  return (
    <>
    <Flex px={'10px'} h={"70px"} minWidth={'100%'} justifyContent={'center'} borderBottom={"1px"} borderColor={bg}>
      <Flex  alignItems="center" width={[ '640px','768px', '1024px', '1280px' ]}  justifyContent={['space-between','space-between']}>
      <a href='/'>
            <Flex alignItems="center">
            {colorMode === 'light' ?(
                <div style={{filter: 'invert(1)'}}>
                    <Image h={"65px"}  objectFit={"fill"} alt="Loruem Logo" src="https://cdn.loreum.org/logos/white.svg"></Image>
                </div>
                ) : (
                    <Image h={"65px"}  objectFit={"fill"} alt="Loruem Logo" src="https://cdn.loreum.org/logos/white.svg"></Image>
                )
            }
            <Box p="2">
              <Hide breakpoint="(max-width: 430px)">
                  <Heading size={['xs',"sm"]} fontWeight={'medium'} fontFamily={"Cairo"}>
                      LOREUM 
                  </Heading>
              </Hide>
            </Box>
            </Flex>
        </a>
        <ButtonGroup  size={"xs"} alignItems={"center"} >
        <Hide breakpoint="(max-width: 430px)">
        <Popover placement='top-start'>
          <PopoverTrigger>
            <Button variant={'ghost'}>
            <LuBell size={15}/>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader fontWeight='semibold'>Notification</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore et dolore.
            </PopoverBody>
          </PopoverContent>
        </Popover>
          <Button onClick={toggleColorMode} mr={'8px'} bg={'ghost'}>
            {colorMode === 'light' ? (
                <LuMoon size={15}/>
            ) : (
                <SunIcon boxSize={4}/>
            )}
        </Button>
        </Hide>
        <Hide breakpoint="(min-width: 430px)">
          <Button onClick={onOpen} variant={'ghost'}>
            <ChevronLeftIcon boxSize={6}/>
          </Button>
        <Drawer placement={'right'} size={'xs'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader fontFamily={'Cairo'}  borderBottomWidth='1px'>LOREUM<DrawerCloseButton/></DrawerHeader>
          <DrawerBody >
            <Grid gap={3}>
              <Button h={'2.5rem'}>CREATE CHAMBER</Button>
              <Button variant={'ghost'} borderBottom={'1px'} rounded={'none'} borderColor={bg}  h={'2.5rem'}>Docs</Button>
              <Button variant={'ghost'} borderBottom={'1px'} rounded={'none'} borderColor={bg}  h={'2.5rem'}>Bolg</Button>
              <Button variant={'ghost'} borderBottom={'1px'} rounded={'none'} borderColor={bg}  h={'2.5rem'}>About</Button>
            </Grid>
          </DrawerBody>
          <DrawerFooter>
            <Grid gap={3}>
            <Box>
              <Text fontSize={'xs'} color={'#00D1FF'}>STAY UP TO DATE</Text>
              <Text fontSize={'lg'}>Get our newsletter</Text>
            </Box>
            <InputGroup>
              <Input rounded={'lg'} placeholder='Enter your email' />
              <InputRightElement width='3rem'>
                <ArrowForwardIcon/>
              </InputRightElement>
            </InputGroup>
            <Flex gap={2}>
              <Button variant={'solid'} size={'md'}><FaDiscord /></Button>
              <Button variant={'solid'} size={'md'}><FaXTwitter /></Button>
              <Button variant={'solid'} size={'md'}><FaTelegramPlane/></Button>
              <Button variant={'solid'} size={'md'}><HiOutlineMail/></Button>
              <Button variant={'solid'} size={'md'} onClick={toggleColorMode}>
                {colorMode === 'light' ? (
                    <LuMoon size={15}/>
                ) : (
                    <SunIcon boxSize={4}/>
                )}
              </Button>
            </Flex>
            </Grid>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {/* <Popover placement='top-start'>
          <PopoverTrigger>
            <Button variant={'ghost'}>
              <LuBell size={15}/>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader fontWeight='semibold'>Notification</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore et dolore.
            </PopoverBody>
          </PopoverContent>
        </Popover> */}
        </Hide>
          <CustomConnectButton/>
        </ButtonGroup>
      </Flex>
    </Flex>
    </>
  );
}

export default Nav;
