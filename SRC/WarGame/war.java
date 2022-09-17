package com.wartracker;

public class WarRunner {

    public static void main(String[] args) {
        WarTracker warTracker = new WarTracker();
        setupWarTracker(warTracker);

        int numberOfPlayers = 50;
        for(int i = 0; i < numberOfPlayers; i++){
            Player player = warTracker.get(i);
            System.out.println(player.getName() + " has a WAR of " + player.getWar());
        }
    }

    private static void setupWarTracker(WarTracker warTracker) {
        warTracker.add(new Player("Aaron Judge", 6.9));
        warTracker.add(new Player("Aaron Nola", 4.4));
        warTracker.add(new Player("Alejandro Kirk", 3.6));
        warTracker.add(new Player("Andres Gimenez", 4.1));
        warTracker.add(new Player("Austin Riley", 4.8));
        warTracker.add(new Player("Brendan Rodgers", 3.3));
        warTracker.add(new Player("Byron Buxton", 3.5));
        warTracker.add(new Player("Carlos Rodon", 3.9));
        warTracker.add(new Player("Christian Walker", 3.4));
        warTracker.add(new Player("Corbin Burnes", 3.9));
        System.out.println("Lowest Player after 10th loaded " + warTracker.get(9).getName());
        warTracker.add(new Player("Corey Seager", 3.5));
        warTracker.add(new Player("Dansby Swanson", 4.2));
        warTracker.add(new Player("DJ LeMahieu", 4.6));
        warTracker.add(new Player("Dylan Cease", 4.4));
        warTracker.add(new Player("Francisco Lindor", 4.6));
        warTracker.add(new Player("Freddie Freeman", 4.5));
        warTracker.add(new Player("J.T. Realmuto", 3.6));
        warTracker.add(new Player("Jake Cronenworth", 3.5));
        warTracker.add(new Player("Jeremy Pena", 3.4));
        warTracker.add(new Player("Jose Altuve", 3.4));
        System.out.println("Lowest Player after 20th loaded " + warTracker.get(19).getName());
        warTracker.add(new Player("Jose Ramirez", 4.1));
        warTracker.add(new Player("Josh Bell", 3.4));
        warTracker.add(new Player("Juan Soto", 4.2));
        warTracker.add(new Player("Julio Rodriguez", 4.0));
        warTracker.add(new Player("Justin Verlander", 4.2));
        warTracker.add(new Player("Kyle Tucker", 3.7));
        warTracker.add(new Player("Logan Webb", 3.8));
        warTracker.add(new Player("Luis Arraez", 3.7));
        warTracker.add(new Player("Luis Castillo", 3.9));
        warTracker.add(new Player("Manny Machado", 4.3));
        System.out.println("Lowest Player after 30th loaded " + warTracker.get(29).getName());
        warTracker.add(new Player("Martin Perez", 3.3));
        warTracker.add(new Player("Max Fried", 4.6));
        warTracker.add(new Player("Max Scherzer", 3.9));
        warTracker.add(new Player("Mike Trout", 3.9));
        warTracker.add(new Player("Mookie Betts", 4.4));
        warTracker.add(new Player("Nico Hoerner", 3.7));
        warTracker.add(new Player("Nolan Arenado", 6.0));
        warTracker.add(new Player("Paul Goldschmidt", 5.9));
        warTracker.add(new Player("Rafael Devers", 4.0));
        warTracker.add(new Player("Sandy Alcantara", 6.2));
        System.out.println("Lowest Player after 40th loaded " + warTracker.get(39).getName());
        warTracker.add(new Player("Shane McClanahan", 3.4));
        warTracker.add(new Player("Shohei Ohtani", 5.7));
        warTracker.add(new Player("Steven Kwan", 3.4));
        warTracker.add(new Player("Tommy Edman", 4.4));
        warTracker.add(new Player("Tony Gonsolin", 3.5));
        warTracker.add(new Player("Trea Turner", 3.8));
        warTracker.add(new Player("Vladimir Guerrero Jr.", 3.7));
        warTracker.add(new Player("Xander Bogaerts", 3.9));
        warTracker.add(new Player("Yordan Alvarez", 4.8));
        warTracker.add(new Player("Zack Wheeler", 4.4));
        System.out.println("Lowest Player after 50th loaded " + warTracker.get(49).getName());


    }
}
