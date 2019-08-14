
class Util{
    static timeFormatter(time){
        return time.split(".")[0].replace("T", " ");
    }

    static humanize(str) {
        return str
            .replace(/^[\s_]+|[\s_]+$/g, '')
            .replace(/[_\s]+/g, ' ')
            .replace(/([a-z])([A-Z])/, function(m) { return m[0] + " " + m[1]; })
            .replace(/^[a-z]/, function(m) { return m.toUpperCase(); });
    }
}

export default Util;