package com.company;


public class Player {
    final String name;
    final double war;

    public Player(String name, double war) {
        this.name = name;
        this.war = war;
    }

    public String getName() {
        return this.name;
    }

    public double getWar() {
        return this.war;
    }
}
