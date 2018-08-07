export function sortItems(items, sortKey, desc) {

    if (items && sortKey) {
        return items.sort((item1, item2) =>
            item1[sortKey] < item2[sortKey]
                ? (!!desc ? -1 : 1)
                : item1[sortKey] > item2[sortKey]
                    ? (!!desc ? 1 : -1)
                    : 0
        )
    }

    return items;
}
