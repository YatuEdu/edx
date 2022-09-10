import java.util.Locale;

public class test  {
    static void main(String [] args) {
        String w = test.findLongestWord("This is my Imagine Learning word count exercise solution that isn't buggy.");
        System.out.println(w);

    }

    static public String findLongestWord(String sentence) {
        String [] words = sentence.split(" ");
        int maxLength = 0;
        String longestWord = "";
        for (String w: words ) {
            int currLen = countWordLength(w);
            if ( currLen > maxLength) {
                maxLength = currLen;
                longestWord = w.trim();
            }
        }

        return longestWord.toLowerCase();
    }

    static int countWordLength(String word) {
        String normalizedWord = word.trim();
        int len = 0;
        for(int i = 0; i < normalizedWord.length(); i++) {
            if (Character.isAlphabetic(normalizedWord.charAt(i))) {
                ++len;
            }
        }
        return len;
    }
}
