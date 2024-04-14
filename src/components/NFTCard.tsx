import { Card, CardBody, Image, Stack, Heading, Center } from '@chakra-ui/react'

interface Propos{
  name: string,
  tokenID: string,
  image: string,
}

function NFTCard(propos:Propos) {
  return (
    <Card rounded={'xl'}>
    <CardBody>
        <Center boxSize={'150px'}>
            {/* <BiImage size={'2rem'}/> */}
            <Image src='ipfs.tech/ipfs://QmfPWZ6VuFyLqTY92RRCCGRQxUKAhBAHs4vJb7wCT15hZr/61'/>
        </Center>
        <Stack>
            <Heading size={'sm'}>
                {propos.name} #{propos.tokenID}
            </Heading>
        </Stack>
    </CardBody>
    </Card>
  )
}

export default NFTCard