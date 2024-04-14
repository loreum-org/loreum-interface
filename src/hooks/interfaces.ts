export interface ERC20 {
    token_address: string,
    symbol: string,
    name: string,
    logo: string,
    thumbnail: number,
    decimals: string,
    balance: string,
    possible_spam: boolean,
    verified_collection: boolean,
    total_supply: string,
    total_supply_formatted: string,
    percentage_relative_to_total_supply: number
}