package stringUtil;

public class StringUtil {
    private StringUtil() {}

    public static String EMPTY_STRING = "";
    public static String WHITE_SPACE = " ";

    /**
     *  Useful util functions for String manipulation
     */

    public static boolean isNullOrEmpty (String str) {
        return str == null || str.length() == 0;
    }

    public static boolean isNullOrEmptyOrSpaceOnly (String str) {
        int len;
        if (str == null || (len = str.length() ) == 0) {
            return true;
        }

        for (int i = 0; i < len; i++ ) {
            if (!Character.isWhitespace(str.charAt(i))) {
                return false;
            }
        }

        return true;
    }

}
