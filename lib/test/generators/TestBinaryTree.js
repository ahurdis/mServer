class BinaryTree {
    constructor(value, left=null, right=null) {
        this.value = value;
        this.left = left;
        this.right = right;
    }

    /** Prefix iteration */
    * [Symbol.iterator]() {
        if (this.left) {
            yield* this.left;
            // Short for: yield* this.left[Symbol.iterator]()
        }
        yield this.value;
        if (this.right) {
            yield* this.right;
        }
    }
}

const tree = new BinaryTree('a',
    new BinaryTree('b',
        new BinaryTree('c'),
        new BinaryTree('d')),
    new BinaryTree('e'));

for (const x of tree) {
    console.log(x);
}