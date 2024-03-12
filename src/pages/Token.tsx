import { Progress,Grid, Breadcrumb, BreadcrumbItem, BreadcrumbLink, FormControl, InputGroup, InputLeftElement, Button, Input } from '@chakra-ui/react'
import { Search2Icon } from '@chakra-ui/icons'
import { Link, useParams } from 'react-router-dom'

function Token() {
const {address}= useParams()
  return (
    <div>
        <Grid pb={'1rem'} fontSize={['xs','sm']} justifyContent={'space-between'} alignItems={'center'} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={3}>
        <Breadcrumb fontWeight={'semibold'}>
        <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={`/chamber/${address}`}>{address ? address.slice(0,4): ''}...{address ? address.slice(38,42) : ''}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction/`}>Transaction</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
            <BreadcrumbLink as={Link} to={`/chamber/${address}/transaction/send`}>Send</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink isCurrentPage>Token</BreadcrumbLink>
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
    </div>
  )
}

export default Token