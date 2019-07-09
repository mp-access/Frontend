
class Util{
    static timeFormatter(time){
        return time.split(".")[0].replace("T", " ");
    }
}

export default Util;