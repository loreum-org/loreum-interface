import { useEffect, useRef } from "react";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";

interface Props {
  address: string,
  isize: number
}

const StyledIdenticon = styled.div`
  height: 100rm;
  width: 100rm;
`;

export default function Identicon({address, isize}:Props) {
  const ref = useRef<HTMLDivElement>();
  const account = address
  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon((isize ? isize : 100), parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return <StyledIdenticon ref={ref as any} />;
}
