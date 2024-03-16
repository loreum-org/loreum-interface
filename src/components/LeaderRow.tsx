import { Flex, Grid, Text, Tooltip } from "@chakra-ui/react"
import Identicon from "./identicon"

interface Props {
    isize: number;
    address: string;
    nftTokenID: string;
    delegation: number;
    govTokenSymbol: string;
    ensName: string;
    ensAvater: string;
    nftImgUrl: string;
}

function LeaderRow({isize, address, nftTokenID, delegation, govTokenSymbol, ensName, ensAvater, nftImgUrl}:Props) {
  return (
    <>
    <Grid templateColumns={'repeat(3, 1fr)'} fontSize={['sm','md']} w={'full'}>
        <Flex w={'150%'} gap={3} overflow={'hidden'}>
            <Identicon address={address} isize={isize}/>
            <Tooltip label={'Address '+address} rounded={'md'}>
            <Text alignItems={'center'}>{ensName ? ensName :  address.slice(0,6)+'...'+address.slice(38,42)}</Text>
            </Tooltip>
        </Flex>
        <Flex justifySelf={'end'}>{nftTokenID}</Flex>
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