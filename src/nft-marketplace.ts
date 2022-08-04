import { BigInt, Address } from "@graphprotocol/graph-ts"
import {
    ItemBought as ItemBoughtEvent,
    ItemCancelled as ItemCancelledEvent,
    ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemBought, ItemCancelled, ItemListed, ActiveItem } from "../generated/schema"

const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000"
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD"

export function handleItemListed(event: ItemListedEvent): void {
    // Save that event in our graph
    // Update Active

    // get or create an ItemListed object
    // each item needs a unique id

    // ItemListedEvent: Just the raw event
    // ItemListed: What we save

    let itemId = getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
    let itemListed = ItemListed.load(itemId)
    let activeItem = ActiveItem.load(itemId)

    if (!itemListed) {
        itemListed = new ItemListed(itemId)
    }
    if (!activeItem) {
        activeItem = new ActiveItem(itemId)
    }

    itemListed.seller = event.params.seller
    activeItem.seller = event.params.seller

    itemListed.tokenId = event.params.tokenId
    activeItem.tokenId = event.params.tokenId

    itemListed.price = event.params.price
    activeItem.price = event.params.price

    activeItem.buyer = Address.fromString(EMPTY_ADDRESS)

    itemListed.save()
    activeItem.save()
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
    let itemId = getIdFromEventParams(event.params.nftAddress, event.params.tokenId)
    let itemCancelled = ItemCancelled.load(itemId)
    let activeItem = ActiveItem.load(itemId)
    if (!itemCancelled) {
        itemCancelled = new ItemCancelled(itemId)
    }
    itemCancelled.seller = event.params.seller
    itemCancelled.tokenId = event.params.tokenId

    activeItem!.buyer = Address.fromString(DEAD_ADDRESS)

    itemCancelled.save()
    activeItem!.save()
}

export function handleItemBought(event: ItemBoughtEvent): void {
    let itemId = getIdFromEventParams(event.params.nftAddress, event.params.tokenId)

    let itemBought = ItemBought.load(itemId)
    let activeItem = ActiveItem.load(itemId)

    if (!itemBought) {
        itemBought = new ItemBought(itemId)
    }
    itemBought.buyer = event.params.buyer
    itemBought.tokenId = event.params.tokenId

    activeItem!.buyer = event.params.buyer

    itemBought.save()
    activeItem!.save()
}

function getIdFromEventParams(nftAddress: Address, tokenId: BigInt): string {
    return tokenId.toHexString() + ":" + nftAddress.toHexString()
}
