
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

    static MEDIA_TYPE_MAP = {
        // Code
        'py':   'code',
        'js':   'code',
        'css':  'code',
        'json': 'code',
        'md':   'code',
        'c':    'code',
        'cpp':  'code',
        'h':    'code',
        'java': 'code',
        'txt':  'code',

        // Image
        'png':  'img',
        'jpg':  'img',
        'jpeg': 'img',
        'gif':  'img',
        'svg':  'img',
    };
}

export default Util;