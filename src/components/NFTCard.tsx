import { Card, CardBody, Image, Stack, Heading, Center } from '@chakra-ui/react'
import { BiImage } from 'react-icons/bi'

interface Propos{
  name: string,
  tokenID: string,
  image: string,
}

function NFTCard(propos:Propos) {
  return (
    <Card rounded={'xl'}>
    <CardBody>
        {propos.image?(<Image src={propos.image} rounded={'lg'} objectFit={'contain'} h={'280px'} w={'280px'}></Image>):(
        <Center h={'280px'} w={'280px'}>
          <BiImage size={'8rem'}/>
        </Center>)}
        <Stack pt={3} w={'280px'}>
            <Heading size={'xs'} isTruncated>
                {propos.name} #{propos.tokenID}
            </Heading>
        </Stack>
    </CardBody>
    </Card>
  )
}

export default NFTCard