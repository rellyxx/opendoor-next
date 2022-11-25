import "@rainbow-me/rainbowkit/styles.css";
import { useAccount } from "wagmi";
import dynamic from 'next/dynamic'

const MyComponentNoSSR = dynamic(() => import('./home'), {
    ssr: false,
})
export default function IndexPage(props:any) {
  const { address } = useAccount()
  console.log(address);
  return (
          <div>
            <MyComponentNoSSR address={address}/>
          </div>
  );
}
