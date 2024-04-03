import {
  Flex, Box, Heading, InputGroup,
  Button, Image, useColorMode, useColorModeValue,
  Hide, Grid, Input, Text, InputRightElement,
  Popover, PopoverTrigger, PopoverContent,
  PopoverHeader, PopoverBody, PopoverArrow,
  PopoverCloseButton,Drawer,DrawerBody, Link as Clink,
  DrawerFooter, DrawerHeader, DrawerOverlay,
  DrawerContent, DrawerCloseButton, useDisclosure,
  Tooltip, Center, Accordion, AccordionItem,
  AccordionButton, AccordionPanel, AccordionIcon
} from "@chakra-ui/react";

import { SunIcon, ChevronLeftIcon, ArrowForwardIcon, AddIcon } from "@chakra-ui/icons";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { LuMoon, LuBell } from "react-icons/lu";

import { CustomConnectButton } from "../components/Connect";

import LoreumLogoWhite from "../assets/LoreumLogoWhite.svg"
import LoreumLogoBlack from "../assets/LoreumLogoBlack.svg"
import { links } from "../data";

function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue("gray.200", "gray.700");
  return (
      <Flex px={"10px"} h={"70px"} minWidth={"100%"} justifyContent={"center"} borderBottom={"1px"} borderColor={bg} >
        <Flex alignItems="center"width={["640px ", "768px", "1024px", "1280px"]}justifyContent={"space-between"}>
          <a href="/">
            <Flex alignItems="center">
              {colorMode === "light" ? (
                  <Image h={"65px"} objectFit={"fill"} alt="Loruem Logo" src={LoreumLogoBlack}/>
              ) : (
                <Image
                  h={"65px"}
                  objectFit={"fill"}
                  alt="Loruem Logo"
                  src={LoreumLogoWhite}
                />
              )}
              <Box p="2">
                <Hide breakpoint="(max-width: 430px)">
                  <Heading
                    size={"sm"}
                    fontWeight={"bold"}
                    fontFamily={"Cairo"}
                  >
                    LOREUM
                  </Heading>
                </Hide>
              </Box>
            </Flex>
          </a>
          <Flex alignItems={"center"}>
            <Hide breakpoint="(max-width: 430px)">
              <Tooltip hasArrow label={'Create Chamber'} rounded={'md'} w={'fit-content'} >
                <a href="/create/">
                <Button variant={'ghost'} fontSize={'xs'} h={'30px'}>
                    <AddIcon/>
                </Button>
                </a>
              </Tooltip>
              <Popover placement="top-start">
                <PopoverTrigger>
                  <Button variant={"ghost"}>
                    <LuBell size={15} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontWeight="semibold">
                    Notification
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>
                    <Center h={'xs'}>
                      No Notification
                    </Center>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Button onClick={toggleColorMode} mr={"8px"} bg={"ghost"}>
                {colorMode === "light" ? (
                  <LuMoon size={15} />
                ) : (
                  <SunIcon boxSize={4} />
                )}
              </Button>
            </Hide>
            <Hide breakpoint="(min-width: 430px)">
              <Button onClick={onOpen} variant={"ghost"}>
                <ChevronLeftIcon boxSize={6} />
              </Button>
            </Hide>
            <CustomConnectButton />
          </Flex>
          <Hide breakpoint="(min-width: 430px)">
              <Drawer
                placement={"right"}
                size={"xs"}
                onClose={onClose}
                isOpen={isOpen}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerHeader fontFamily={"Cairo"} borderBottomWidth="1px">
                    LOREUM
                    <DrawerCloseButton />
                  </DrawerHeader>
                  <DrawerBody>
                    <Grid gap={3}>
                      <Button h={"2.5rem"}>Create Chamber</Button>
                      <Accordion allowToggle>
                        <AccordionItem>
                            <AccordionButton>
                              <Button h={"1.5rem"} variant={'transparent'} flex='1' >
                                Developer
                              </Button>
                              <AccordionIcon />
                            </AccordionButton>
                          <AccordionPanel pb={4}>
                            <Flex flexFlow={'column'}>
                              <Button variant={"ghost"} h={"2.5rem"}>
                                Tech Docs
                              </Button>
                              <Button variant={"ghost"} h={"2.5rem"}>
                                Github
                              </Button>
                              <Button variant={"ghost"} h={"2.5rem"}>
                                Guides
                              </Button>
                            </Flex>
                          </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionButton>
                            <Button h={"1.5rem"} variant={'transparent'} flex='1' >
                                Company
                              </Button>
                              <AccordionIcon />
                            </AccordionButton>
                          <AccordionPanel pb={4}>
                            <Flex flexFlow={'column'}>
                              <Button variant={"ghost"}  h={"2.5rem"}>
                                Blog
                              </Button>
                              <Button variant={"ghost"}  h={"2.5rem"}>
                                About
                              </Button>
                              <Button variant={"ghost"}  h={"2.5rem"}>
                                Mission
                              </Button>
                              <Button variant={"ghost"}  h={"2.5rem"}>
                                Contact us
                              </Button>
                            </Flex>
                          </AccordionPanel>
                        </AccordionItem>
                        <AccordionItem>
                            <AccordionButton>
                            <Button h={"1.5rem"} variant={'transparent'} flex='1' >
                                Legal
                              </Button>
                              <AccordionIcon />
                            </AccordionButton>
                          <AccordionPanel pb={4}>
                            <Flex flexFlow={'column'}>
                              <Button variant={"ghost"}  h={"2.5rem"}>
                                Licenses
                              </Button>
                              <Button variant={"ghost"}  h={"2.5rem"}>
                                Terms of us
                              </Button>
                              <Button variant={"ghost"}  h={"2.5rem"}>
                                Privacy Policy
                              </Button>
                              <Button variant={"ghost"}  h={"2.5rem"}>
                                Cookie Policy
                              </Button>
                            </Flex>
                          </AccordionPanel>
                        </AccordionItem>
                      </Accordion>
                    </Grid>
                  </DrawerBody>
                  <DrawerFooter>
                    <Grid gap={3}>
                      <Box>
                        <Text fontSize={"xs"} color={"#00D1FF"}>
                          STAY UP TO DATE
                        </Text>
                        <Text fontSize={"lg"}>Get our newsletter</Text>
                      </Box>
                      <InputGroup>
                        <Input rounded={"lg"} placeholder="Enter your email" />
                        <InputRightElement width="3rem">
                          <ArrowForwardIcon />
                        </InputRightElement>
                      </InputGroup>
                      <Flex gap={2}>
                        <Button variant={"solid"} size={"md"}>
                          <FaDiscord />
                        </Button>
                        <Clink href={links.twitter} isExternal>
                          <Button variant={"solid"} size={"md"}>
                            <FaXTwitter />
                          </Button>
                        </Clink>
                        <Clink href={links.telegram} isExternal>
                          <Button variant={"solid"} size={"md"}>
                            <FaTelegramPlane />
                          </Button>
                        </Clink>
                        <Clink href="mailto:invest@loreum.org" isExternal>
                          <Button variant={"solid"} size={"md"}>
                            <HiOutlineMail />
                          </Button>
                        </Clink>
                        <Button
                          variant={"solid"}
                          size={"md"}
                          onClick={toggleColorMode}
                        >
                          {colorMode === "light" ? (
                            <LuMoon size={15} />
                          ) : (
                            <SunIcon boxSize={4} />
                          )}
                        </Button>
                      </Flex>
                    </Grid>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Hide>
        </Flex>
      </Flex>
  );
}

export default Nav;
