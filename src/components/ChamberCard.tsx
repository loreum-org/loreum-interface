
import { Card, Image, Center, Flex, Tooltip, Button, useColorModeValue } from "@chakra-ui/react"
import { MdOutlineImageNotSupported } from "react-icons/md";

interface Props {
  address: string,
  imageURL: string,
  title: string,
  activeProposal: number,
  status: string,
}

function ChamberCard({address ,imageURL ,title ,activeProposal ,status}:Props) {
  const bg = useColorModeValue("gray.200", "gray.700");
    return (
        <>
        <Card fontFamily={"Cairo"} rounded={'2xl'} p={'10px'} pl={'10px'} w={'300px'} bg={bg}>
            <Center pt={1}>
              {
                imageURL ? (
                  <Image rounded={'2xl'} objectFit={'cover'} w={'274px'}  height={'151px'} src={imageURL}/>
                ) : (
                  <Center rounded={'2xl'} objectFit={'cover'} w={'274px'} height={'151px'}><MdOutlineImageNotSupported size={30}/> </Center>
                )
              }
            </Center>
            <Flex pt={'7px'} fontSize={'xl'} justifyContent={'space-between'}>
            {title.toUpperCase()}
            </Flex>
            <Flex gap={2} pt={1} >
              <Tooltip hasArrow label={address} rounded={'md'} w={'fit-content'}>
                <Button fontSize={'xs'} h={'30px'}>
                  {address.slice(0,4)}....{address.slice(38,42)}
                </Button>
              </Tooltip>
              <Button fontSize={'xs'} h={'30px'}>
                {activeProposal} proposal
              </Button>
              <Button fontSize={'xs'} h={'30px'} flexGrow={1}>
                {status.toUpperCase()}
              </Button>
            </Flex>
          </Card>
        </>
    )
}

export default ChamberCard