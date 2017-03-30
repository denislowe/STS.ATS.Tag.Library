(function(wnd) {
    if (typeof String.prototype.trim !== "function") String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "")
    };

    function contentLoaded(win, fn) {
        var done = false,
            top = true,
            doc = win.document,
            root = doc.documentElement,
            add = doc.addEventListener ? "addEventListener" : "attachEvent",
            rem = doc.addEventListener ? "removeEventListener" : "detachEvent",
            pre = doc.addEventListener ? "" : "on",
            init = function(e) {
                if (e.type == "readystatechange" && doc.readyState != "complete") return;
                (e.type == "load" ? win : doc)[rem](pre + e.type,
                    init, false);
                if (!done && (done = true)) fn.call(win, e.type || e)
            },
            poll = function() {
                try {
                    root.doScroll("left")
                } catch (e) {
                    setTimeout(poll, 50);
                    return
                }
                init("poll")
            };
        if (doc.readyState == "complete") fn.call(win, "lazy");
        else {
            if (doc.createEventObject && root.doScroll) {
                try {
                    top = !win.frameElement
                } catch (e) {}
                if (top) poll()
            }
            doc[add](pre + "DOMContentLoaded", init, false);
            doc[add](pre + "readystatechange", init, false);
            win[add](pre + "load", init, false)
        }
    }
    var Fingerprint = function(options) {
        var nativeForEach = Array.prototype.forEach;
        var nativeMap =
            Array.prototype.map;
        this.each = function(obj, iterator, context) {
            if (obj === null) return;
            if (nativeForEach && obj.forEach === nativeForEach) obj.forEach(iterator, context);
            else if (obj.length === +obj.length)
                for (var i = 0, l = obj.length; i < l; i++) {
                    if (iterator.call(context, obj[i], i, obj) === {}) return
                } else
                    for (var key in obj)
                        if (obj.hasOwnProperty(key))
                            if (iterator.call(context, obj[key], key, obj) === {}) return
        };
        this.map = function(obj, iterator, context) {
            var results = [];
            if (obj == null) return results;
            if (nativeMap && obj.map === nativeMap) return obj.map(iterator,
                context);
            this.each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list)
            });
            return results
        };
        if (typeof options == "object") {
            this.hasher = options.hasher;
            this.canvas = options.canvas
        } else if (typeof options == "function") this.hasher = options
    };
    Fingerprint.prototype = {
        get: function() {
            var keys = [];
            keys.push(navigator.userAgent);
            keys.push(navigator.language);
            keys.push(screen.colorDepth);
            keys.push((new Date).getTimezoneOffset());
            keys.push(!!window.sessionStorage);
            keys.push(this.hasLocalStorage());
            keys.push(!!window.indexedDB);
            keys.push(typeof document.body.addBehavior);
            keys.push(typeof window.openDatabase);
            keys.push(navigator.cpuClass);
            keys.push(navigator.platform);
            keys.push(navigator.doNotTrack);
            var pluginsString = this.map(navigator.plugins, function(p) {
                var mimeTypes = this.map(p, function(mt) {
                    return [mt.type, mt.suffixes].join("~")
                }).join(",");
                return [p.name, p.description, mimeTypes].join("::")
            }, this).join(";");
            keys.push(pluginsString);
            if (this.canvas && this.isCanvasSupported()) keys.push(this.getCanvasFingerprint());
            return this.murmurhash3_32_gc(keys.join("###"), 31)
        },
        murmurhash3_32_gc: function(key, seed) {
            var remainder, bytes, h1, h1b, c1, c2, k1, i;
            remainder = key.length & 3;
            bytes = key.length - remainder;
            h1 = seed;
            c1 = 3432918353;
            c2 = 461845907;
            i = 0;
            while (i < bytes) {
                k1 = key.charCodeAt(i) & 255 | (key.charCodeAt(++i) & 255) << 8 | (key.charCodeAt(++i) & 255) << 16 | (key.charCodeAt(++i) & 255) << 24;
                ++i;
                k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
                k1 = k1 << 15 | k1 >>> 17;
                k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
                h1 ^= k1;
                h1 = h1 << 13 | h1 >>> 19;
                h1b = (h1 & 65535) * 5 + (((h1 >>> 16) * 5 & 65535) << 16) & 4294967295;
                h1 = (h1b & 65535) + 27492 + (((h1b >>> 16) + 58964 & 65535) << 16)
            }
            k1 = 0;
            switch (remainder) {
                case 3:
                    k1 ^= (key.charCodeAt(i + 2) & 255) << 16;
                case 2:
                    k1 ^= (key.charCodeAt(i + 1) & 255) << 8;
                case 1:
                    k1 ^= key.charCodeAt(i) & 255;
                    k1 = (k1 & 65535) * c1 + (((k1 >>> 16) * c1 & 65535) << 16) & 4294967295;
                    k1 = k1 << 15 | k1 >>> 17;
                    k1 = (k1 & 65535) * c2 + (((k1 >>> 16) * c2 & 65535) << 16) & 4294967295;
                    h1 ^= k1
            }
            h1 ^= key.length;
            h1 ^= h1 >>> 16;
            h1 = (h1 & 65535) * 2246822507 + (((h1 >>> 16) * 2246822507 & 65535) << 16) & 4294967295;
            h1 ^= h1 >>> 13;
            h1 = (h1 & 65535) *
                3266489909 + (((h1 >>> 16) * 3266489909 & 65535) << 16) & 4294967295;
            h1 ^= h1 >>> 16;
            return h1 >>> 0
        },
        hasLocalStorage: function() {
            try {
                return !!window.localStorage
            } catch (e) {
                return true
            }
        },
        isCanvasSupported: function() {
            var elem = document.createElement("canvas");
            return !!(elem.getContext && elem.getContext("2d"))
        },
        getCanvasFingerprint: function() {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            var txt = "http://www.app-cast.com";
            ctx.textBaseline = "top";
            ctx.textBaseline = "alphabetic";
            ctx.fillStyle = "#f60";
            try {
                ctx.font = "14px 'Arial'";
                ctx.fillRect(125, 1, 62, 20)
            } catch (ex) {}
            ctx.fillStyle = "#069";
            try {
                ctx.fillText(txt, 2, 15)
            } catch (ex$0) {}
            ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
            try {
                ctx.fillText(txt, 4, 17)
            } catch (ex$1) {}
            return canvas.toDataURL()
        }
    };
    contentLoaded(wnd, function() {
        try {
            var reqNum = getReqNum(),
                now = (new Date).getTime(),
                random = Math.random() * 99999999999,
                fp = null,
                jobSeekerId = getJobSeekerId();
            try {
                fp = (new Fingerprint({
                    canvas: true
                })).get()
            } catch (e) {}
            window.acCookieSource = "null";
            window.acPixel = false;
            window.acEmployerId = '&e=48'
        } catch (e$2) {}
        try {
            saveReqNumToSessionStorage(reqNum);
            var img = document.createElement("img"),
                action = "br-9k/a17";;
            var url = "https://click.appcast.io/" + action + ".png?r=" + encodeURIComponent(document.referrer) + (reqNum ? "&jid=" + reqNum : "") + "&tn=" + now + "&rn=" + random + "&fp=" + fp + window.acEmployerId;
            if (jobSeekerId) url += "&jobseekerid=" + jobSeekerId;
            img.src = url;
            img.style.display = "none";
            document.body.appendChild(img);
            if (/te8\/a31/i.test(action)) window.acAction = 0;
            else if (/ue8\/a7/i.test(action)) window.acAction =
                1;
            else if (/9k\/a17/i.test(action)) window.acAction = 2;
            writeGtm()
        } catch (e$3) {}
    });

    function getReqNum() {
        var elements = document.getElementsByName("JobInfo"),
            jobId = null,
            jobIdNewBr = document.getElementById("hSMJobId");
        if (elements.length > 0) try {
            for (var i = 0; i < elements.length; i++) {
                var val = elements[i].value;
                if (elements[i].value != "") {
                    jobId = val.replace(/%/g, "").split("|")[0];
                    break
                }
            }
        } catch (e) {}
        if (!jobId && jobIdNewBr) jobId = jobIdNewBr.value;
        if (!jobId && sessionStorage && sessionStorage.getItem("jobId")) return sessionStorage.getItem("jobId");
        return jobId
    }

    function getJobSeekerId() {
        var jobSeekerId = "";
        if (jobSeekerId) return jobSeekerId;
        if (typeof dataLayer !== "undefined" && dataLayer && dataLayer[4] && dataLayer[4].BruId) return dataLayer[4].BruId;
        return ""
    }

    function generateUserToken() {
        return (new Date).getTime() + (Math.random() * Math.random()).toString(36).substr(2, 9)
    }

    function writeGtm() {
        try {
            var head = document.getElementsByTagName("head")[0],
                script = document.createElement("script");
            script.type = "text/javascript";
            script.charset = "utf-8";
            script.text =
                "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-TRPTD9');";
            head.appendChild(script)
        } catch (e) {}
    }

    function saveReqNumToSessionStorage(reqNum) {
        if (sessionStorage && reqNum) sessionStorage.setItem("jobId", reqNum)
    }
})(window);
