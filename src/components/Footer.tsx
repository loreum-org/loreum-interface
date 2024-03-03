import { Box, Text,Show, Flex, Image,Button, Grid, GridItem, Center,useColorMode, useColorModeValue, InputGroup, Input, InputRightElement, Link } from "@chakra-ui/react";
import LoreumLogoWhite from "../assets/LoreumLogoWhite.svg"
import LoreumLogoBlack from "../assets/LoreumLogoBlack.svg"
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { ArrowForwardIcon } from "@chakra-ui/icons";
function Footer(){
    const bg = useColorModeValue("gray.200", "gray.700");
    const colorMode = useColorMode().colorMode;
    return (
        <>
        <Show above="sm" >
            <Grid justifyItems={'center'} borderTop={'1px'} borderColor={bg}>
                <Grid  p={'2rem'} maxWidth={'1280px'} w={'100%'}>
                    <Grid maxW='auto' marginX={'6rem'}>
                        <Box paddingTop={'6rm'} >
                            <Flex justifyContent={'space-between'} alignItems={'center'}>
                                <Flex alignItems={'center'}>
                                    {
                                        (colorMode === "light") ? (
                                            <Image h={"65px"} objectFit={"fill"} alt="Loruem Logo" src={LoreumLogoBlack}/>
                                        ) : (
                                            <Image h={"65px"} objectFit={"fill"} alt="Loruem Logo" src={LoreumLogoWhite}/>
                                        )
                                    }
                                    <Text fontFamily={'Cairo'} fontWeight={'bold'}>LOREUM</Text>
                                </Flex>
                                <Grid templateColumns={'repeat(4, 1fr)'} gap={'1rem'}>
                                    <GridItem>
                                        <Button>
                                            <FaDiscord/>
                                        </Button>
                                    </GridItem>
                                    <GridItem>
                                        <Button>
                                            <FaXTwitter/>
                                        </Button>
                                    </GridItem>
                                    <GridItem>
                                        <Button>
                                            <FaTelegramPlane/>
                                        </Button>
                                    </GridItem>
                                    <GridItem>
                                        <Button>
                                            <HiOutlineMail/>
                                        </Button>
                                    </GridItem>
                                </Grid>
                            </Flex>
                        </Box>
                    </Grid>
                    <Grid maxW='auto' marginX={'6rem'} templateColumns={{base:'repeat(1, 1fr)', lg:'repeat(2, 1fr)'}} >
                        <GridItem>
                            <Grid gap={3} p={'2rem'} pl={'1rem'}>
                                <Box>
                                    <Text fontWeight={'bold'} fontSize={"xs"} color={"#00D1FF"}>
                                        STAY UP TO DATE
                                    </Text>
                                    <Text fontSize={"2xl"}>Get our newsletter</Text>
                                </Box>
                                <InputGroup w={'20rem'}>
                                    <Input rounded={"lg"} placeholder="Enter your email" />
                                    <InputRightElement width="3rem">
                                        <ArrowForwardIcon />
                                    </InputRightElement>
                                </InputGroup>
                            </Grid>
                        </GridItem>
                        <GridItem>
                            <Grid p={'2rem'} templateColumns={'repeat(3, 1fr)'} justifyItems={'end'}>
                                <Flex rowGap={'1rem'} flexFlow={'column'}>
                                    <h2>
                                        <Text fontWeight={'bold'}>
                                            Developer
                                        </Text>
                                    </h2>
                                    <Link href="#" isExternal>
                                        Tech Docs
                                    </Link>
                                    <Link href="#" isExternal>
                                        Github
                                    </Link>
                                    <Link href="#" isExternal>
                                        Guides
                                    </Link>
                                </Flex>
                                <Flex rowGap={'1rem'} flexFlow={'column'}>
                                    <h2>
                                        <Text fontWeight={'bold'}>
                                            Company
                                        </Text>
                                    </h2>
                                    <Link href="#" isExternal>
                                        Blog
                                    </Link>
                                    <Link href="#" isExternal>
                                        About
                                    </Link>
                                    <Link href="#" isExternal>
                                        Mission
                                    </Link>
                                    <Link href="#" isExternal>
                                        Contact us
                                    </Link>
                                </Flex>
                                <Flex rowGap={'1rem'} flexFlow={'column'}>
                                    <h2>
                                        <Text fontWeight={'bold'}>
                                            Legal
                                        </Text>
                                    </h2>
                                    <Link href="#" isExternal>
                                        Licenses
                                    </Link>
                                    <Link href="#" isExternal>
                                        Terms of us
                                    </Link>
                                    <Link href="#" isExternal>
                                        Privacy Policy
                                    </Link>
                                    <Link href="#" isExternal>
                                        Cookie Policy
                                    </Link>
                                </Flex>
                            </Grid>
                        </GridItem>
                    </Grid>
                </Grid>
            </Grid>
        </Show>
        <Center h={['50px', '50px']} borderTop={'1px'} borderColor={bg}>
            <Text fontSize={'sm'} fontWeight={'medium'} opacity={'50%'} >© 2024 Loreum Labs Ltd. | All rights reserved</Text>
        </Center>
        </>
    )
}

export default Footer;