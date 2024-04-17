import { Grid, useColorModeValue, Flex, Box } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useParams, NavLink, Outlet } from "react-router-dom";
import { RiCoinsLine } from "react-icons/ri";
import { MdOutlineLeaderboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { GoHome } from "react-icons/go";
import MenuButton from "../components/MenuButton";

function Chamber() {
  const { address } = useParams();
  const bg = useColorModeValue("#E2E8F0", "#2D3748");
  return (
    <Grid justifyItems={'center'} borderTop={'1px'} borderColor={bg} minH={'90vh'} >
        <Flex maxWidth={'1280px'} w={'100%'} flexFlow={['column','row']}>
            <Grid borderRight={'1px'} borderBottom={['1px','0px']} borderColor={bg} width={[null,'163px']}>
                <Flex width={['auto','10.3rem']} gap={3} p={3} flexFlow={['row','column']} overflowX={['scroll','auto']}>
                    <NavLink end to={`/`}>
                        <Flex alignItems={'center'} gap={1} _hover={{bg: bg}} rounded={'md'} pl={'6px'}>
                            <ArrowBackIcon/>
                            <MenuButton title="Back"/>
                        </Flex>
                    </NavLink>
                    <NavLink end to={`/chamber/${address}`} 
                    style={({isActive}) => {
                        return {
                            borderRadius: "0.375rem",
                            backgroundColor: isActive ? (bg) : "",
                        }
                    }}>
                        <Flex alignItems={'center'} gap={1} _hover={{bg: bg}} rounded={'md'} pl={'6px'}>
                            <GoHome/> 
                            <MenuButton title="Home"/>
                        </Flex>
                    </NavLink>
                    {/* <NavLink end to={`/chamber/${address}/proposal`}
                     style={({isActive}) => {
                        return {
                            borderRadius: "0.375rem",
                            backgroundColor: isActive ? (bg) : "",
                        }
                    }}>
                        <Flex alignItems={'center'} gap={1} _hover={{bg: bg}} rounded={'md'} pl={'6px'}>
                            <GoFile/> 
                            <MenuButton title="Proposal"/>
                        </Flex>
                    </NavLink> */}
                    <NavLink end to={`/chamber/${address}/assest`}
                    style={({isActive}) => {
                        return {
                            borderRadius: "0.375rem",
                            backgroundColor: isActive ? (bg) : "",
                        }
                    }}>
                        <Flex alignItems={'center'} gap={1} _hover={{bg: bg}} rounded={'md'} pl={'6px'}>
                            <RiCoinsLine/> 
                            <MenuButton title="Assest"/>
                        </Flex>
                    </NavLink>
                    <NavLink to={`/chamber/${address}/transaction`}
                    style={({isActive}) => {
                        return {
                            borderRadius: "0.375rem",
                            backgroundColor: isActive ? (bg) : "",
                        }
                    }}>
                        <Flex alignItems={'center'} gap={1} _hover={{bg: bg}} rounded={'md'} pl={'6px'}>
                            <GrTransaction /> 
                            <MenuButton title="Transaction"/>
                        </Flex>
                    </NavLink>
                    <NavLink end to={`/chamber/${address}/leaderboard`}
                    style={({isActive}) => {
                        return {
                            borderRadius: "0.375rem",
                            backgroundColor: isActive ? (bg) : "",
                        }
                    }}>
                        <Flex alignItems={'center'} gap={1} _hover={{bg: bg}} rounded={'md'} pl={'6px'}>
                            <MdOutlineLeaderboard/> 
                            <MenuButton title="Leaderboard"/>
                        </Flex>
                    </NavLink>
                    {/* <NavLink end to={`/chamber/${address}/forum`}
                    style={({isActive}) => {
                        return {
                            borderRadius: "0.375rem",
                            backgroundColor: isActive ? (bg) : "",
                        }
                    }}>
                        <Flex alignItems={'center'} gap={1} _hover={{bg: bg}} rounded={'md'} pl={'6px'}>
                            <BiMessageSquareDetail/> 
                            <MenuButton title="Forum"/>
                        </Flex>
                    </NavLink> */}
                    {/* <NavLink end to={`/chamber/${address}/setting`}
                    style={({isActive}) => {
                        return {
                            borderRadius: "0.375rem",
                            backgroundColor: isActive ? (bg) : "",
                        }
                    }}>
                        <Flex alignItems={'center'} gap={1} _hover={{bg: bg}} rounded={'md'} pl={'6px'}>
                            <LuSettings/> 
                            <MenuButton title="Setting"/>
                        </Flex>
                    </NavLink> */}
                </Flex>
            </Grid>
            <Box p={'1rem'} w={'full'} h={'full'}>
                <Outlet/>
            </Box>
        </Flex>
    </Grid>
  );
}

export default Chamber;
