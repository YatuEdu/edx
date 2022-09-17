package com.company;

public class Main {

    public static void main(String[] args) {
	// write your code here
        //Input: s = "4( 2 (3) (1) ) (6(5))"

    }

    public static class Tree {
        Treenode root;

        public void BuildTree(String nodes) {
            Pair pair = getTreeExpression( nodes);
            this.root = new Treenode(pair.getValue());
            BuildSubTree(this.root, pair.getStr());
        }

        public void BuildSubTree(Treenode root, String nodes) {
            root.left = 

        }

        private Pair<int, String> getTreeExpression(String nodes) {
            int v = nodes.charAt(0);
            String tree = nodes.substring(1, nodes.lastIndexOf(")"));
            return new Pair(v. tree);
        }

    }

    public static class Pair {
        int value;
        String str
        public Pair(int v, String str) {
            this.value = v;
            this.str = str;
        }

        public int getValue() {
            return value;
        }

        public String getStr() {
            return this.str;
        }
    }
    public static class Treenode {
        Treenode left;
        Treenode right;
        int value;

        public Treenode( int v) {

            this.value = v;
        }

        public Treenode(Treenode l, Treenode r, int v) {
            this.left = l;
            this.right = r;
            this.value = v;
        }

        public Treenode getLeft() {
            return this.left;
        }

        public void setLeft(Treenode node) {
            this.left = node;
        }

        public Treenode getRight() {
            return this.right;
        }

        public void setRight(Treenode node) {
            this.right = node;
        }
    }
}
