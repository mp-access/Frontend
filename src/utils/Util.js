
class Util{
    static timeFormatter(time){
        var t = new Date(time);
        return t.getDate() + "." + (t.getMonth() + 1) + "." + t.getFullYear() + " " + this.paddZero(t.getHours()) + ":" + this.paddZero(t.getMinutes());
        //return ret.setSeconds(0,0).toLocaleString().replace(",", "");
    }

    static paddZero(n){
        if(n <= 9){
          return "0" + n;
        }
        return n
      }

    static humanize(str) {
        return str
            .replace(/^[\s_]+|[\s_]+$/g, '')
            .replace(/[_\s]+/g, ' ')
            .replace(/([a-z])([A-Z])/, function(m) { return m[0] + " " + m[1]; })
            .replace(/^[a-z]/, function(m) { return m.toUpperCase(); });
    }

    static getIsDarkFromLocalStorage() {
        let isDark = localStorage.getItem('isDarkMode') || false;
        if (!!isDark) {
            isDark = isDark === 'true';
        } else {
            localStorage.setItem('isDarkMode', isDark + '');
        }
        return isDark;
    };

    static toggleAndThenGetIsDark() {
        const isDark = Util.getIsDarkFromLocalStorage();
        localStorage.setItem('isDarkMode', !isDark + '');
        return !isDark;
    };
}

export default Util;