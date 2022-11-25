import { Col, Row, Card, Divider, message, Space, Button } from 'antd';
import React, { memo, useEffect,useState } from 'react';
import styles from './landing.module.scss'
import Image from 'next/image'
import { abi, NFT_CONTRACT_ADDRESS } from "../../ABI/nft.js";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { ConnectButton, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {
    useAccount,
    useContractRead,
    useContractWrite,
    usePrepareContractWrite,
    useNetwork,
    useSwitchNetwork,
    useContractEvent
} from 'wagmi';

import { chain as chainObj, createClient, configureChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { subgraphQueryNFT } from './../../utils/querySubgraph'
import Link from 'next/link';


const { chains, provider } = configureChains(
    [chainObj.mainnet, chainObj.goerli, chainObj.arbitrum, chainObj.arbitrumGoerli],
    [alchemyProvider({ apiKey: 'v54XKO_i8u4kDLFXG8PNQH32fJFQK6QH' }), publicProvider()]
);

const { connectors } = getDefaultWallets({
    appName: "gloop",
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});


const Home = (props:any) => {
    const { chain, chains } = useNetwork()

    const { switchNetwork } = useSwitchNetwork()

    useEffect(() => {
        if (chain?.id !== 5) {
            switchNetwork?.(chainObj.goerli.id)
        }
    }, [chain])

    const { address } = useAccount()

    const price = useContractRead({
        address: NFT_CONTRACT_ADDRESS,
        abi,
        functionName: '_price',
    })


    const symbol = useContractRead({
        address: NFT_CONTRACT_ADDRESS,
        abi,
        functionName: 'symbol',
    })

    const tokenIds = useContractRead({
        address: NFT_CONTRACT_ADDRESS,
        abi,
        functionName: 'tokenIds',
        watch: true,
    })

    console.log('tokenIds', tokenIds);

    const maxTokenIds = useContractRead({
        address: NFT_CONTRACT_ADDRESS,
        abi,
        functionName: 'maxTokenIds',
    })

    console.log('maxTokenIds', maxTokenIds);



    const presaleStarted = useContractRead({
        address: NFT_CONTRACT_ADDRESS,
        abi,
        functionName: 'presaleStarted',
    })

    console.log('presaleStarted', presaleStarted);


    const presaleEnded = useContractRead({
        address: NFT_CONTRACT_ADDRESS,
        abi,
        functionName: 'presaleEnded',
    })

    const owner = useContractRead({
        address: NFT_CONTRACT_ADDRESS,
        abi,
        functionName: 'owner',
    })

    console.log('owner', owner);


    const { config } = usePrepareContractWrite({
        address: NFT_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'mint',
        overrides: {
            value: utils.parseEther("0.01")
        }
    })

    const { write: mint, data, isLoading: isLoadingOfmint, isSuccess, } = useContractWrite(config as any)


    const { config: presaleMintConfig } = usePrepareContractWrite({
        address: NFT_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'presaleMint',
        overrides: {
            value: utils.parseEther("0.01")
        }
    })
    const { write: presaleMint } = useContractWrite(presaleMintConfig as any)


    const { config: startPresaleConfig } = usePrepareContractWrite({
        address: NFT_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'startPresale',
    })

    const { write: startPresale } = useContractWrite(startPresaleConfig as any)


    console.log(isSuccess);

    useContractEvent({
        address: NFT_CONTRACT_ADDRESS,
        abi: abi,
        eventName: 'Transfer',
        listener(from, to, tokenId) {
            message.success('success mint');
            getMinted()

        },
    })

    const [mintedArr,setMintedArr] = useState([]);

    useEffect(()=>{
        getMinted()
    },[])

    const tokenURI = useContractRead({
        address: NFT_CONTRACT_ADDRESS,
        abi,
        functionName: 'tokenURI',
        args:[1]
    })
    console.log('tokenURI',tokenURI);

    const getMinted = ()=>{
        let query = `
            query MyQuery {
                transfers {
                    tokenId
                    from
                    to
                }
            }`
        subgraphQueryNFT(query).then((res)=>{
            setMintedArr(res?.transfers)
        })
    }
    console.log(mintedArr,'mintedArr');
    
    return (
        <div className={styles.landing}>
            <div className={styles.bg}>
                 <Row align='middle'>
                    <Col span={6}>
                        <Space style={{ alignItems: 'center', fontSize: 20 }}> <Image width={100} height={100} alt={''} className={styles.logo} src={'/images/open_door.svg'}  /><span>OpenDoor</span></Space>

                    </Col>
                    <Col span={18}>
                        <Row className={styles.menus} align='middle' justify='end'>
                            <Space size={80}>
                                <Link href='/explore'>
                                    <div style={{ background: '#19FB80' }} className={styles.btn}>Exchange</div>
                                </Link>
                                <Image width={50} height={50} onClick={() => window.open('https://twitter.com/')} className={styles.menu} src={'/images/twitter.svg'} alt="twitter" />
                                <Image width={50} height={50} onClick={() => window.open('https://discord.com/')} className={styles.menu} src={'/images/discord.svg'} alt="discord" />
                                <ConnectButton />
                            </Space>


                        </Row>
                    </Col>
                </Row>
                <div className={styles.content}>
                    <Row className={styles.contentRow}>
                        <div>
                            <h1>Welcome to Crypto Devs!{props.address}</h1>
                            <br />
                            Its an NFT collection for developers in Crypto.
                        </div>
                    </Row>
                    {/* <Row align='middle' className={styles.startEarning}>
                        <Col span={8}>
                            {

                                !presaleStarted.data && address === owner.data ?
                                    <div onClick={() => startPresale?.()} className={styles.btn}> Presale Start </div>
                                    :
                                    new Date().getTime() > parseInt(presaleEnded.data as string) * 1000
                                        ?
                                        <div onClick={() => {
                                            if (!address) {
                                                message.info("Please connect wallet！")
                                                return
                                            }
                                            if (chain?.id !== 5) {
                                                message.info("Please select goerli")
                                                return

                                            }
                                            mint?.()
                                        }} className={styles.btn}>{isLoadingOfmint && !isSuccess ? 'Minting' : "Public Mint"}</div>
                                        :
                                        <div onClick={() => {
                                            console.log(address);

                                            if (!address) {
                                                message.info("Please connect wallet！")
                                                return
                                            }

                                            if (chain?.id !== 5) {
                                                message.info("Please select goerli！")
                                                return
                                            }
                                            presaleMint?.()

                                        }} className={styles.btn}>Presale Mint</div>
                            }

                        </Col>
                    </Row>
                    <Row className={styles.statistics}>
                        <Col className={styles.item} span={6}>
                            <div>
                                <h1>{address && chain?.id === 5 && ethers.utils.formatEther(BigNumber.from(price.data || 0)) + 'eth'}  </h1>
                                <div className={styles.imgName}>
                                    <img src={'/images/TVL.svg'} alt="TVL" />
                                    <span>Price</span>
                                </div>
                            </div>
                        </Col>
                        <Col className={styles.item} span={6}>
                            <div>
                                <h1>{tokenIds.data?.toString()}</h1>
                                <div className={styles.imgName}>
                                    <img src={'/images/totalDebt.svg'} alt="totalDebt" />
                                    <span>tokenIds</span>
                                </div>
                            </div>
                        </Col>
                        <Col className={styles.item} span={6}>
                            <div>
                                <h1>{maxTokenIds.data?.toString()}</h1>
                                <div className={styles.imgName}>
                                    <img src={'/images/totaluser.svg'} alt="totaluser" />
                                    <span>Total Supply</span>
                                </div>

                            </div>
                        </Col>
                        <Col className={styles.item} style={{ borderRight: 0 }} span={6}>
                            <div>
                                <h1>{symbol?.data as string}</h1>
                                <div className={styles.imgName}>
                                    <img src={'/images/availablevaults.svg'} alt="availablevaults" /><span>Symbol</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className={styles.loremipsum} justify='center' align='middle'>
                        <div> Have <span>Minted</span> </div>
                    </Row>
                    <Row className='animate__animated  animate__bounceInLeft' gutter={[40, 20]} >
                        {
                            mintedArr?.map((item:any, index) => {
                                return <Col key={item.tokenId} span={6} className={styles.loremipsumItem}>
                                    <div className={styles.strongbox}>
                                        <Image width={150} height={150} className='hvr-buzz' src={`https://ikzttp.mypinata.cloud/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/${item.tokenId}.png`} alt={''} />
                                    </div>
                                </Col>

                            })
                        }
                    </Row>  */}
                </div>
            </div>
        </div>
    );
};

export default memo(Home) ;
