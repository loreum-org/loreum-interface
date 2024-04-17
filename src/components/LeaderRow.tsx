import { Flex, Grid, Text, useColorModeValue } from "@chakra-ui/react"

interface Props {
    nftTokenID: string;
    delegation: number;
    govTokenSymbol: string;
}

function LeaderRow({nftTokenID, delegation, govTokenSymbol}:Props) {
    const hoverBg = useColorModeValue('gray.300','gray.600')
    return (
        <>
        <Grid p={1} px={'0.4rem'} rounded={'lg'} alignItems={'start'} templateColumns={'repeat(2, 1fr)'} fontSize={['sm','md']} w={'full'} _hover={{bg:hoverBg}}>
            <Flex justifySelf={'start'}>{nftTokenID}</Flex>
            <Flex justifySelf={'end'} gap={1}>
                <Text>
                    {delegation>1000? delegation/1000+'K':delegation}
                </Text>
                {govTokenSymbol}
            </Flex>
        </Grid>
        </>
  )
}

export default LeaderRow