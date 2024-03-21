import { Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, Progress, InputGroup, InputLeftElement, Button, Input } from "@chakra-ui/react"
import { Search2Icon } from "@chakra-ui/icons"
import { Link, useParams } from "react-router-dom"
import BuilderCard from "../components/BuilderCard"

function Builder() {
  const {address} = useParams()
  return (
    <div>
      <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={3} >
        <Breadcrumb fontWeight={'semibold'}>
        <BreadcrumbItem>
            <BreadcrumbLink>{address ? address.slice(0,4): ''}...{address ? address.slice(38,42) : ''}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction/`}>Transaction</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction/send`}>Send</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink isCurrentPage>Build</BreadcrumbLink>
        </BreadcrumbItem>
        </Breadcrumb>
        <FormControl>
            <InputGroup size='md'>
                <InputLeftElement  justifyContent={'start'}>
                        <Button type={'submit'} borderRightRadius={0} rounded={'xl'} size='sm' variant={'transparent'}>
                            <Search2Icon/>
                        </Button>
                </InputLeftElement>
                <Input isDisabled placeholder="Search Transaction" variant={'filled'} overflow={'hidden'} rounded={'xl'}/>
            </InputGroup>
        </FormControl>
      </Grid>
      <Progress value={40} size='xs' colorScheme='blue'/>
      <BuilderCard/>
    </div>
  )
}

export default Builder