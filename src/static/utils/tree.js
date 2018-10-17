/*
    Tree structure support. It assumes that tree has the following structure
    { id: ..., parent: ..., children: [...] }
 */

function _addChildren(item, tree) {

    const childrenIds = [];
    tree.forEach((a, idx) => a.parent === item.id && childrenIds.push(idx));

    if (childrenIds.length > 0) {
        if (!item.children) item.children = [];
        childrenIds.forEach(idx => item.children.push(tree[idx]));
        childrenIds.forEach(idx => tree.splice(idx, 1));
    }
}

function _insert(item, tree) {

    if (!tree) return false;

    const parent = tree.find(a => a.id === item.parent);
    if (parent) {
        parent.children
            ? parent.children.push(item)
            : parent.children = [item];
        return true;
    }

    return !!tree.find(a => _insert(item, a.children))
}

export function insert(item, tree) {

    _addChildren(item, tree);

    // Search for parent and insert
    if (item.parent) {
        const inserted = _insert(item, tree);
        if (inserted) return;
    }

    // No parents found, then insert to the top level
    tree.push(item)
}

export function createTree(items) {
    const tree = [];
    items.forEach(item => insert(item, tree));
    return tree;
}