export function sortItems(items, sortKey, desc) {

    return items.sort((item1, item2) =>
        item1[sortedKey] < item2[sortedKey]
            ? (desc ? -1 : 1)
            : item1[sortedKey] > item2[sortedKey]
                ? (desc ? 1 : -1)
                : 0
    )
}
