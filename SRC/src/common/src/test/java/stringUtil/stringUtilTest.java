package stringUtil;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class StringUtilTest {
    @Test
    void testEmpty() {
        String str = "";
        assertTrue (StringUtil.isNullOrEmpty(str));
        str = null;
        assertTrue (StringUtil.isNullOrEmpty(str));
        str = " ";
        assertFalse(StringUtil.isNullOrEmpty(str));
        assertTrue(StringUtil.isNullOrEmptyOrSpaceOnly(str));
        str = "  * ";
        assertFalse(StringUtil.isNullOrEmpty(str));
        assertFalse(StringUtil.isNullOrEmptyOrSpaceOnly(str));
        str = "abc";
        assertFalse(StringUtil.isNullOrEmpty(str));
        assertFalse(StringUtil.isNullOrEmptyOrSpaceOnly(str));
    }

}