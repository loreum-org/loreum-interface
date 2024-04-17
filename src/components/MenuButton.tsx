import { Box } from '@chakra-ui/react'

interface Props {
    title: string,
}

const MenuButton = ({title}:Props) => {
  return (
      <Box
      as='button'
      width='full'
      height='2rem'
      lineHeight='1.2'
      transition='all 0.2s cubic-bezier(.08,.52,.52,1)'
      px='8px'
      textAlign='left'
      fontSize='14px'
      fontWeight='semibold'
      _active={{
        transform: 'scale(0.98)',
      }}
      >
          {title}
      </Box>
    )
}

export default MenuButton