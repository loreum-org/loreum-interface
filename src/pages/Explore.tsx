import { Link } from "react-router-dom";
import { Flex, Button } from "@chakra-ui/react";
function Explore() {
    const profiles = [1, 2, 3 ];
  return (
    <Flex color={'white'} h={'100vh'} >
        {profiles.map((profile)=>(
            <Link key={profile} to={`/profiles/${profile}`} >
                <Button m={'10px'}>
                    Profile {profile}
                </Button>
            </Link>
        ))}
    </Flex>
  )
}

export default Explore;
