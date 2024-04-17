import { Center , Button, Text, Flex} from "@chakra-ui/react";

function Error() {
  return (
    <>
    <Center gap={2} h={'100vh'} >
        <Flex flexFlow={'column'} gap={3}>
            <Text>
                Something Went Wrong
            </Text>
              <a href="/" rel="noopener noreferrer">
                <Flex justifyContent={'center'}>
                <Button size={'sm'}>
                Reload
                </Button>
                </Flex>
              </a>
        </Flex>
    </Center>
    </>
  )
}

export default Error