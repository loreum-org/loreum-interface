
import { Card,Box, Image, Center, Flex, Tooltip, Button, useColorModeValue, Grid } from "@chakra-ui/react"

import Identicon from "./identicon"

interface Props {
  imageURL: string,
  title: string,
  chamber: string,
  govToken: string
  memberToken: string
  deployer: string
  serial: string
}

function ChamberCard({chamber ,imageURL ,title, serial}:Props) { 
  const bg = useColorModeValue("gray.200", "gray.700");
  const bg1 = useColorModeValue("gray.100", "gray.600");
    return (
        <>
        <Card rounded={'2xl'} p={'10px'} pl={'10px'} w={'300px'} bg={bg}>
            <Center pt={1}>
              {
                imageURL ? (
                  <Box backgroundImage={imageURL} backgroundSize={'cover'} rounded={'2xl'} w={'274px'}  height={'151px'}  >
                    <Box rounded={'2xl'} backdropFilter='auto' backdropBlur={'100px'} w={'274px'}  height={'151px'} color={'white'}>
                      <Grid w={'274px'}  height={'151px'} justifyContent={'center'} alignItems={'center'}>
                      <Image height={'100px'} width={'100px'} rounded={'full'} objectFit={'cover'}  src={imageURL}></Image>
                      </Grid>
                    </Box>
                  </Box>
                ) : (
                  <Box bg={bg1} rounded={'2xl'} w={'274px'}  height={'151px'}  >
                      <Grid w={'274px'}  height={'151px'} justifyContent={'center'} alignItems={'center'}>
                        <Identicon  address={chamber}/>
                      </Grid>
                  </Box>
                )
              }
            </Center>
            <Flex pt={'7px'} fontSize={'xl'} justifyContent={'space-between'}>
            {title.toUpperCase()} CHAMBER
            </Flex>
            <Flex gap={2} pt={1} >
              <Tooltip hasArrow label={'Chamber Address ' +chamber} rounded={'md'} w={'fit-content'} >
                <Button fontSize={'xs'} h={'30px'} >
                  {chamber.slice(0,4)}....{chamber.slice(38,42)}
                </Button>
              </Tooltip>
              <Tooltip hasArrow label={ 'Chamebr ID is the serial number' } rounded={'md'} w={'fit-content'} >
                <Button fontSize={'xs'} h={'30px'} flex={2}>
                  Chamber {serial}
                </Button>
              </Tooltip>
                <Button fontSize={'xs'} h={'30px'} flex={1}>
                  OPEN
                </Button>
            </Flex>
          </Card>
        </>
    )
}

export default ChamberCard