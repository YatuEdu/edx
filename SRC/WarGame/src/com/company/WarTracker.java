package com.company;

import java.util.ArrayList;
import java.util.List;

public class WarTracker {
    private final List<Player> players;

    public WarTracker() {
        this.players = new ArrayList<>();
    }

    public void add(Player player) {
        int pos = -1;
        for (int i = 0; i < players.size(); i++) {
            if (player.getWar() < players.get(i).getWar()) {
                continue;
            }

            if (player.getWar() == players.get(i).getWar()) {
                for (int j = i; j < players.size(); j++) {
                    if (player.getWar() > players.get(j).getWar()) {
                        pos = j;
                        break;
                    }
                }
            } else {
                pos = i;
                break;
            }
            if (pos != -1) {
                break;
            }
        }

        if (pos == -1) {
            this.players.add(player);
        } else {
            splice(this.players, pos, player)
        }
    }

    private void splice(List<Player> list, int pos, Player inserted) {

    }

    public Player get(int pos) {

    }
}
