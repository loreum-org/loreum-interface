import { Link } from "react-router-dom";
import { Center , Button} from "@chakra-ui/react";

function NotFoundPage(){
    return(
        <>
        <Center gap={2} h={'100vh'} >
            404 Page not found
            <Link to="/">
                <Button size={'sm'}>
                    Go to home 
                </Button>
            </Link>
        </Center>
        </>
    )
}

export default NotFoundPage;