//深拷贝
export const deepCopy = obj => {
    return JSON.parse(JSON.stringify(obj));
};

//storage方法封装
export const storage = {
    get(key) {
        if (!key) {
            return null;
        }
        try {
            return (
                JSON.parse(window.localStorage.getItem(key)) ||
                window.localStorage.getItem(key)
            );
        } catch (e) {
            return window.localStorage.getItem(key);
        }
    },
    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        window.localStorage.removeItem(key);
    },
    clear() {
        window.localStorage.clear();
    }
};

//工具类
export const underscore = {
    throttle: (func, wait, options) => {
        /* options的默认值
         *  表示首次调用返回值方法时，会马上调用func；否则仅会记录当前时刻，当第二次调用的时间间隔超过wait时，才调用func。
         *  options.leading = true;
         * 表示当调用方法时，未到达wait指定的时间间隔，则启动计时器延迟调用func函数，若后续在既未达到wait指定的时间间隔和func函数又未被调用的情况下调用返回值方法，则被调用请求将被丢弃。
         *  options.trailing = true;
         * 注意：当options.trailing = false时，效果与上面的简单实现效果相同
         */
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            // 计算剩余时间
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            // 当到达wait指定的时间间隔，则调用func函数
            // 精彩之处：按理来说remaining <= 0已经足够证明已经到达wait的时间间隔，但这里还考虑到假如客户端修改了系统时间则马上执行func函数。
            if (remaining <= 0 || remaining > wait) {
                // 由于setTimeout存在最小时间精度问题，因此会存在到达wait的时间间隔，但之前设置的setTimeout操作还没被执行，因此为保险起见，这里先清理setTimeout操作
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                // options.trailing=true时，延时执行func函数
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    }
};

//格式化时间
export const dateFormat = (timestamp, fmt) => {
    try {
        if (!timestamp) {
            return "";
        }
        timestamp = parseInt(timestamp);
        timestamp =
            timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
        var date = new Date(timestamp);
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            S: date.getMilliseconds() //毫秒
        };

        o["M+"] = o["M+"] + "";
        o["d+"] = o["d+"] + "";
        o["h+"] = o["h+"] + "";
        o["m+"] = o["m+"] + "";
        o["s+"] = o["s+"] + "";
        if (o["M+"].length < 2) o["M+"] = "0" + o["M+"];
        if (o["d+"].length < 2) o["d+"] = "0" + o["d+"];
        if (o["h+"].length < 2) o["h+"] = "0" + o["h+"];
        if (o["m+"].length < 2) o["m+"] = "0" + o["m+"];
        if (o["s+"].length < 2) o["s+"] = "0" + o["s+"];

        if (/(y+)/.test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                (date.getFullYear() + "").substr(4 - RegExp.$1.length)
            );
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1
                        ? o[k]
                        : ("00" + o[k]).substr(("" + o[k]).length)
                );
        return fmt;
    } catch (error) {
        return timestamp;
    }
};

//获取url参数
export const getQueryVariable = (url, variable) => {
    var query = url.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return "";
};
