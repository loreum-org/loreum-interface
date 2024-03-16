import { Link } from "react-router-dom";
import { Center , Button, Text, Flex} from "@chakra-ui/react";

function Error() {
  return (
    <>
    <Center gap={2} h={'100vh'} >
        <Flex flexFlow={'column'} gap={3}>
            <Text>
                Something Went Wrong
            </Text>
            <Button as={Link} to={'/'} size={'sm'}>
                Reload
            </Button>
        </Flex>
    </Center>
    </>
  )
}

export default Error