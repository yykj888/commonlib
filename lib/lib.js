  var lib_function = {
    clone:function(obj){
        //克隆一个对象
        var o;  
        switch(typeof obj){  
        case 'undefined': break;  
        case 'string'   : o = obj + '';break;  
        case 'number'   : o = obj - 0;break;  
        case 'boolean'  : o = obj;break;  
        case 'object'   :  
            if(obj === null){  
                o = null;  
            }else{  
                if(obj instanceof Array){  
                    o = [];  
                    for(var i = 0, len = obj.length; i < len; i++){  
                        o.push(this.clone(obj[i]));  
                    }  
                }else{  
                    o = {};  
                    for(var k in obj){  
                        o[k] = this.clone(obj[k]);  
                    }  
                }  
            }  
            break;  
        default:          
            o = obj;break;  
        }  
        return o; 
    },
    bindAnimation:function(foo){
        return function(){
            var dt_old = 0;
            return function(dt){
                if(!dt_old)dt_old = dt - 1000/30;
                var step = dt - dt_old;
                dt_old = dt;
                foo(step);
            }
        }
    },

    addTo:function(obj,add){
        for(var attr in add){
            if(obj[attr]){
                obj[attr] += add[attr];
            }else{
                obj[attr] = add[attr];
            }
        }
    },

    together:function(a,b){
        var result = this.clone(a);
        var add = this.clone(b);
        for(var attr in add){
            if(result[attr]){
                result[attr] += add[attr];
            }else{
                result[attr] = add[attr];
            }
        }
        return result;
    },

    getLength:function(obj){
        //计算对象中成员属性的数量
        var count = 0;
        for (var attr in obj) {
            count ++;
        };
        return count;
    },
    //生成从minNum到maxNum的随机数
    getRandomNum(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*minNum+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    },
    getRandomThing:function(things){
        var num = 0;
        for (var attr in things) {
            num += things[attr].amount == undefined ? things[attr] : things[attr].amount;
        };
        var total = num;
        num = Math.ceil(Math.random()*num);
        var flag = false;
        for (var attr in things) {
            num -= things[attr].amount == undefined ? things[attr] : things[attr].amount;
            if(num <= 0){
                flag = true;
                break;
            }
        };
        if(flag == false || total == 0){
            return {attr:false,total:total};
        }
        return {attr:attr,total:total};
    },

    getRandom:function(obj,props){
        var count = 0;
        for (var attr in obj) {
            if(props && props.noAttr){
                if(obj[attr][props.noAttr])continue;
            }
            if(props && props.haveValue){
                if(obj[attr][props.haveValue[0]] != props.haveValue[1])continue;
            }
            count ++;
        };
        var length = Math.random()*count;
    
        count = 0;
        for (var attr in obj) {
            if(props && props.noAttr){
                if(obj[attr][props.noAttr])continue;
            }
            if(props && props.haveValue){
                if(obj[attr][props.haveValue[0]] != props.haveValue[1])continue;
            }
            count ++;
            if(count >= length){
                return {attr:attr,value:obj[attr]};
            }
        };
        return false;
    },

    // 把数组打乱
    shuffle: function(list) {
        let m = list.length, i;
        while (m) {
            i = (Math.random() * m--) >>> 0;
            [list[m], list[i]] = [list[i], list[m]]
        }
        return list;
    },

    cloneMul:function(obj,mul,isRound){
        //克隆一个容器内的物品，并倍乘一个数
        var o = {};
        var mul = mul||1;
        for (var attr in obj) {
            var num = mul * obj[attr];
            o[attr] = isRound?Math.round(num):num;
        };
        return o;
    },

    o:function(attr,value){
        var o = {};
        o[attr] = value;
        return o;
    },

    lll:function(value){
       // console.log(value);
    },

    getFirst:function(obj){
        for(var attr in obj){
            return {attr:attr,value:obj[attr]}
        }
    },

    loadFile:function(filename,filetype){
        if(filetype == "js"){
            var fileref = document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src",filename);
        }else if(filetype == "css"){
            var fileref = document.createElement('link');
            fileref.setAttribute("rel","stylesheet");
            fileref.setAttribute("type","text/css");
            fileref.setAttribute("href",filename);
        }
       if(typeof fileref != "undefined"){
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    },

    //把{gold:10,part:2} 转换为 [{key:"gold",name:"金子",amount:10},{key:"part",name:"零件",amount:2}]
    //isRichTxt:是否返回富文本的名称
    getKnaList:function(obj,tmp_list,tmp_list2,isRichTxt){
        var list = [];
        for(var attr in obj){
            var t_item = {};
            t_item.key = attr;
            if(tmp_list[attr]) {
                if(isRichTxt){
                    var rich_name = _G.o_itemNameColor(attr);
                    t_item.name = rich_name?rich_name:tmp_list[attr].name;
                }else{
                    t_item.name = tmp_list[attr].name;
                    if(tmp_list[attr].desc)
                        t_item.desc = tmp_list[attr].desc;
                }
            }
            else if(tmp_list2 && tmp_list2[attr]){
                t_item.name = tmp_list2[attr].name;
                if(tmp_list[attr].desc)
                    t_item.desc = tmp_list2[attr].desc;
            }
            t_item.amount = obj[attr];
            list.push(t_item);
        }
        return list;
    },

    //a-b得到的列表
    //a:{wood:10,seafood:10,rowFish:3}
    //b:{wood:3,seafood:4,jellyfish:3}
    //return: {wood:7,seafood:6,rowFish:3}
    minus:function(a,b){
        var result = {};
        var minus_a = this.clone(a);
        var minus_b = this.clone(b);
        for(var attr in minus_a){
            if(minus_b[attr]){
                var lave_num = minus_a[attr] - minus_b[attr];
                if(lave_num > 0)
                    result[attr] = lave_num;
            }
            else{
                result[attr] = minus_a[attr];
            }
        }
        return result;
    },

    //随机获取一个区间的整数
    randonmNum:function(a,b){
        var ran=Math.floor(Math.random()*(b-a+1)+a);
        return ran;
    },

    //获取日期
    getDate:function(tmp_date) {
        var date = new Date();
        if(tmp_date) date = tmp_date;
        var seperator1 = "-";
        var month = date.getMonth() + 1;
        month = month < 10 ? ('0' + month) : month;
        var day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        var result_date = date.getFullYear() + seperator1 + month + seperator1 + day;
        return result_date;
    },

    //获取日期数字 用于比较
    getDateNumber : function(tmp_date){
        var date = new Date();
        if(tmp_date) date = tmp_date;
        var month = date.getMonth() + 1;
        month = month < 10 ? ('0' + month) : month;
        var day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        var result_date = date.getFullYear() +  month +  day;
        return parseInt(result_date);
    },

    //获取时间
    getTime:function(tmp_date) {
        var date = new Date();
        if(tmp_date) date = tmp_date;
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        month = month < 10 ? ('0' + month) : month;
        var day = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate();
        var hour = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours();
        var minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds();
        var result_time = date.getFullYear() + seperator1 + month + seperator1 + day
                + " " + hour + seperator2 + minutes + seperator2 + seconds;
        return result_time;
    },

    //获取时间
    getTimeStamp:function(tmp_date) {
        var date = new Date();
        if(tmp_date) date = tmp_date;
        var timestamp = date.getTime();
        return Math.floor(timestamp/1000);
    },

    //获取字符串长度（区别中英文 ）
    getStrLen:function(str){
        var len = 0;
        for (var i=0; i<str.length; i++) {
            if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
               len += 2;
             } else {
               len ++;
             }
        }
        return len;
    },

    //截取字符串（按照中文2个长度，英文1个长度计算截取）
    getSubStr:function(str,len){
        if(_LIB.getStrLen(str) < len) return str;
        var t_idx = 0;
        var t_len = 0;
        for (var i=0; i<str.length; i++) {
            if (str.charCodeAt(i)>127 || str.charCodeAt(i)==94) {
               t_len += 2;
            } else {
               t_len ++;
            }
            if(t_len > len) break;
            t_idx++;
        }
        return str.substring(0,t_idx);
    },

    //获取日期差值
    //微信环境的js 不支持 Date类型的直接相减！！！
    dateDifDay:function(date1Str,date2Str) { //Date1和Date2是2017-07-10格式
        var date1 = new Date(date1Str);
        var date2 = new Date(date2Str);

        var date1_timestamp = date1.getTime();
        var date2_timestamp = date2.getTime();
        var dif_ms = date1_timestamp - date2_timestamp;
        // console.log("dif_ms:"+dif_ms);
        var day = parseInt(dif_ms /1000/24/3600);
        return day;
    },

    //判断文字是否是中文
    isChinese:function(temp){
        if(temp.charCodeAt(0) > 255)
            return true;
        else 
            return false;
        // if(!temp) return false;
        // var re=/[^/u4e00-/u9fa5]/;
        // if (re.test(temp)) return false;
        // return true;
    },

    //数组排序
    sort:function(tmp_list,sort_key,is_desc){
        is_desc = is_desc || false;
        var len = tmp_list.length;
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < len - 1 - i; j++) {
                //顺序
                if (!is_desc && tmp_list[j][sort_key] > tmp_list[j+1][sort_key]) { //相邻元素两两对比
                    var temp = tmp_list[j+1]; //元素交换
                    tmp_list[j+1] = tmp_list[j];
                    tmp_list[j] = temp;
                }
                //倒序
                else if (is_desc && tmp_list[j][sort_key] < tmp_list[j+1][sort_key]) { //相邻元素两两对比
                    var temp = tmp_list[j+1]; //元素交换
                    tmp_list[j+1] = tmp_list[j];
                    tmp_list[j] = temp;
                }
            }
        }
        return tmp_list;
    },

    //是否命中概率
    is_hit:function(prec){
        var n = _LIB.randonmNum(0,100);
        if(n <= prec)
            return true;
        return false;
    },

    //去掉字符串中的特殊字符
    excludeSpecial:function(str) {
        // 去掉转义字符
        str = str.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
        // 去掉特殊字符
        str = str.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/);
        return str;
    },

    //替换全部字符
    replace_all:function(str,find_c,replace_c){
        var reg = new RegExp(find_c,"g");
        var result = str.replace(reg,replace_c);
        return result;
    },

    //获取字符在字符串中出现的次数
    str_show_count:function(str,find_c){
        return str.split(find_c).length-1;
    },

    downloadzip(url, success, fail, progress_fun) {
        void 0 === success && (success = null)
        void 0 === fail && (fail = null)
        void 0 === progress_fun && (progress_fun = null)
        var down_fun = null
        if (_PF.is_vivo()) {
            down_fun = qg.download;
        }else if(_PF.is_bd()){
            down_fun = swan.downloadFile;
        }else if(_PF.is_qq_new()){
            down_fun = qq.downloadFile;
        }else{
            down_fun = wx.downloadFile;
        }
        window.downloadTask = down_fun({
            url: url,
            timeout: 100*1000,
            success: function(e) {
                console.log('downloadZip成功', e);
                window.downloadTask = null;
                success && success(e)
            },
            fail: function(e) {
                console.log('downloadZip失败', e);
                window.downloadTask = null;
                fail && fail(e)
            }
        });
        window.downloadTask.onProgressUpdate((res) => {
            // console.log('下载进度', res.progress)
            // console.log('已经下载的数据长度', res.totalBytesWritten)
            // console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
            if(progress_fun)
                progress_fun(res.progress, res.totalBytesWritten, res.totalBytesExpectedToWrite)
        })
    },

    abort_down() {
        if(window.downloadTask){
            window.downloadTask.abort() // 取消下载任务
        }
    },

    unzip(zip_file, path, success, fail) {
        void 0 === success && (success = null)
        void 0 === fail && (fail = null)
        if (_PF.is_vivo()) {
            qg.unzipFile({
                srcUri: zip_file,
                dstUri: 'internal://files/' + path,
                success: function(e) {
                    console.log('unZip成功', e)
                    success && success(e);
                },
                fail: function(e) {
                    console.log('unZip失败', e)
                    fail && fail(e);
                }
            });
        }else if(_PF.is_bd()){
            swan.getFileSystemManager().unzip({
                zipFilePath: zip_file,
                targetPath: swan.env.USER_DATA_PATH + "/" + path,
                success: function(e) {
                    console.log('unZip成功', e)
                    success && success(e);
                },
                fail: function(e) {
                    console.log('unZip失败', e)
                    fail && fail(e);
                }
            });
        }else if(_PF.is_qq_new()){
            var unzip = function(){
                qq.getFileSystemManager().unzip({
                    zipFilePath: zip_file,
                    targetPath: qq.env.USER_DATA_PATH + "/" + path,
                    success: function(e) {
                        console.log('unZip成功', e)
                        success && success(e);
                    },
                    fail: function(e) {
                        console.log('unZip失败', e)
                        fail && fail(e);
                    }
                });
            }

            var targetPath = qq.env.USER_DATA_PATH + "/" + path;
            qq.getFileSystemManager().access({
                path : targetPath,
                success : function(){
                    unzip()
                },

                fail : function(){
                    qq.getFileSystemManager().mkdirSync(targetPath, true)
                    unzip()
                }
            })
        }else{
            wx.getFileSystemManager().unzip({
                zipFilePath: zip_file,
                targetPath: wx.env.USER_DATA_PATH + "/" + path,
                success: function(e) {
                    console.log('unZip成功', e)
                    success && success(e);
                },
                
                fail: function(e) {
                    if(e.errMsg.indexOf("file size limit exceeded") >= 0){

                        console.warn(e, "当作成功处理!")
                        success && success(e);
                        return;
                    }

                    console.log('unZip失败', e)
                    fail && fail(e);
                }
            });
        }
    },

    readfilefromzipdir(e, t, read_type) {
        void 0 === read_type && (read_type = "text");
        var path = wx.env.USER_DATA_PATH + "/" + e + "/" + t;
        return "text" == read_type ? wx.getFileSystemManager().readFileSync(path, "utf-8") : null;
    },

    loadRawAssetZip(loading_ok, url, progressCallBack, loadfaileCallBack){
        if(url && url.length && typeof url == "string"){
            _LIB.__loadRawAssetZip(loading_ok, url)
            return
        }

        //兼容
        _GAMEINIT.cocosSubPackNames = _GAMEINIT.cocosSubPackNames || []
        _GAMEINIT.bIsOpenSubPack = typeof _GAMEINIT.bIsOpenSubPack == "undefined" ? true : _GAMEINIT.bIsOpenSubPack
        
        //进度基数
        let progressAnt = 100
        let curProgressNumber = 0
        progressAnt = _GAMEINIT.cocosSubPackNames.length && _GAMEINIT.bIsOpenSubPack ? 50 : 100

        let cocosSubPackNames = _GAMEINIT.cocosSubPackNames
        let subpackageLength = cocosSubPackNames.length
        let curLength = 0;

        function nextStep(url){
            var cur_version = _GAMEINIT.cur_version_num;
            var old_version = null;
            try {
                if(_PF.is_wx()){
                    old_version = wx.getStorageSync('__version');
                }else if(_PF.is_vivo()){
                    old_version = qg.getStorageSync({key:'__version'});
                }else if (_PF.is_bd()) {
                    old_version = swan.getStorageSync('__version');
                }else if (_PF.is_qq_new()) {
                    old_version = qq.getStorageSync('__version');
                }
            } catch (e) {

            }

            if (!old_version || old_version != cur_version) {
                console.log('清理缓存', { old_version: old_version, cur_version: cur_version });
                _PF.is_newuser = false;
                try {
                    if(_PF.is_wx()){
                        wxDownloader.cleanAllAssets();
                    }
                }
                catch (err) {
                    console.log('cleanAllAssets error', err);
                }
                try {
                    if (_PF.is_bd()) {
                        swan.setStorageSync('__version', cur_version);
                    }else if (_PF.is_qq_new()) {
                        qq.setStorageSync('__version', cur_version);
                    }
                } catch (e) {
                    _PF.report_error("setStorageSync error 2:" + JSON.stringify(e));
                }

                if (!old_version || old_version < cur_version) {
                    _LIB.__loadRawAssetZip(function (rec, progress, totalBytesWritten, totalBytesExpectedToWrite) {
                        if (rec == 1) {
                            if(_PF.is_wx()){
                                wx.setStorageSync('__version', cur_version);
                            }else if(_PF.is_vivo()){
                                qg.setStorageSync({key:'__version',value:cur_version});
                            }
                            
                            loading_ok()
                        } else if (rec == 0) {// 下载进度
                            // self.progress.string = '加载中...' + progress + '%';
                            // self.juice.height = 350*progress/100;
                            // curProgressNumber = curLength / subpackageLength * progressAnt
                            progressCallBack && progressCallBack(curProgressNumber + progress * progressAnt)
                        } else {// 失败
                            // cc.director.loadScene('login');
                            loadfaileCallBack && loadfaileCallBack()
                        }
                    }, url);
                } else {
                    loading_ok()
                }
            } else {
                loading_ok()
            }
        }


        if (_PF.is_wx() || _PF.is_vivo() || _PF.is_bd() || _PF.is_qq_new()) {
            //检测是否使用了cocos自带分包系统
            //两种分包方案均未使用 切换
            if(!_GAMEINIT.cocosSubPackNames.length && !_GAMEINIT.bIsOpenSubPack){
                if(loading_ok) loading_ok()
                return
            }   

            if(_GAMEINIT.cocosSubPackNames.length && !_GAMEINIT.isCocosLoadOver){
                var __loadSubPackage = function(list, index, url){
                    let subpackageLength = list.length
                    let packName = list[index]
                    cc.loader.downloader.loadSubpackage(packName, function (err) {
                        if (err) {
                            return console.error(err);
                        }
                        curLength = index + 1;
                        curProgressNumber = curLength / subpackageLength * progressAnt
                        progressCallBack(curProgressNumber)

                        if(curLength >= subpackageLength){
                            _GAMEINIT.isCocosLoadOver = true
                            
                            if(_GAMEINIT.bIsOpenSubPack){
                                if(nextStep) nextStep(url)
                            }
                            else{
                                loading_ok()
                            }
                        }else{
                            __loadSubPackage(list, index + 1, url)
                        }
                    })
                }

                __loadSubPackage(_GAMEINIT.cocosSubPackNames, 0, url)
                
            }else{
                _GAMEINIT.bIsOpenSubPack ? (nextStep && nextStep(url)) : loading_ok()
            }
            
        } else {
            loading_ok()
        }
    },

    //获取zip的地址
    getZipUrl(subkey = ""){
        var sub_str = "";
        if(subkey) sub_str = subkey + "_";
        var url = "";
        var cur_gameName = _PF.get_cur_gameName();
        var version = _PF.get_version();
        url = _GAMEINIT.down_load_url + cur_gameName + "/" + sub_str + version + ".zip";

        //兼容 头条下载失败问题
        if(_PF.is_tt()){
            var res =  tt.getSystemInfoSync()
            res.platform == "android" && (url += "?v="+_GAMEINIT.cur_version_num)
        }else{
            //清理缓存
            if(_GAMEINIT.cur_version_num){
                url += "?v="+_GAMEINIT.cur_version_num;
            }
        }
        
        return url;
    },

    //下载zip (多个)
    __loadRawAssetZip(callback, url) {
        var totalcount = 1;
        var idx = 1;
        var url_list = [];
        if(!url){
            //获取主包地址
            url = _LIB.getZipUrl();
            url_list.push(url);
        }else if(url.indexOf(_GAMEINIT.down_load_url) != 0){
            //下载子包 但传的是子包的key值，这里构建，多key值 以逗号间隔。
            var sub_key_list = url.split(",");
            for (var idx in sub_key_list) {
                var sub_key = sub_key_list[idx];
                sub_key = sub_key.trim();
                if(sub_key){
                    url_list.push(_LIB.getZipUrl(sub_key));
                }
            }
        }else{
            //传的是子包url地址（兼容多个，逗号间隔）
            var tmp_url_list = url.split(",");
            for(var idx in tmp_url_list){
                var url_item = tmp_url_list[idx];
                if(url_item && url_item.indexOf(_GAMEINIT.down_load_url) === 0){
                    url_list.push(url_item);
                }
            }
        }
        console.log("__loadRawAssetZip url_list:",url_list);

        var url_count = url_list.length;
        for (var i = 0; i < url_list.length; i++) {
            var max_progress = (i+1)/url_count*100;
            var url = url_list[i];
            _LIB.downloadProgressZip(url,max_progress,callback);
        }
    }, 

    //下载zip文件
    //max_progress=50时 说明下载完当前url地址的zip后进度为50%
    downloadProgressZip(url,max_progress,callback){
        if(!url) callback && callback(-1);

        console.log('downloadzip', url, max_progress);
        _LIB.downloadzip(url, function(e) {
            cc.log("下载资源包成功");
            _LIB.unzip(e.tempFilePath, "res", function(e) {
                if(callback){
                    if(max_progress == 100)
                        callback(1);
                    else
                        callback(0,max_progress);//下载完其中一个子包，并没有完成当前任务
                }
            }, function(e) {
                console.error("解压失败",e);
                callback && callback(-1);
            });
        }, function(e) {
            console.error("下载资源包失败！",e);
            if(callback) callback(-1);
        }, function(progress, totalBytesWritten, totalBytesExpectedToWrite){
            // 回调下载的进度
            progress = progress*max_progress/100;
            if(callback) callback(0, progress, totalBytesWritten, totalBytesExpectedToWrite);
        });
    },

    //ArrayBuffer转字符串
    buffer2string:function(arrayBuffer) {
        return String.fromCharCode.apply(null,new Uint8Array(arrayBuffer));
    },

    //字符串转字符串ArrayBuffer
    string2buffer: function (str) {
        var arraybuffer =new ArrayBuffer(str.length*2);
        var view = new Uint8Array(arraybuffer);
        for(var i=0,l=str.length;i<l;i++){
            view[i] = str.charCodeAt(i);
        }
        return view;
    },

    //获取值的位置
    get_v_position(total_v,v,is_width = 0){
        var middle_v = total_v/6;
        if(v >= middle_v){
            if(is_width) return "right";
            return "top";
        }else if(v <= -middle_v){
            if(is_width) return "left";
            return "bottom";
        }else{
            return "middle";
        }
    },

    //获取位置描述
    get_position_detail(x,y,is_vertical = -1){
        var width = cc.view.getVisibleSize().width;
        var height = cc.view.getVisibleSize().height;
        var position_detail = "";
        if(is_vertical == -1){
            //非轮播矩阵
            position_detail += _LIB.get_v_position(width,x,1);
            position_detail += "_" + _LIB.get_v_position(height,y);
        }else if(is_vertical == 1){
            //垂直轮播
            position_detail += "vertical_" + _LIB.get_v_position(width,x,1);
        }else{
            //平行轮播
            position_detail += "parallel_" + _LIB.get_v_position(height,y);
        }

        return position_detail;
    },
}
window._LIB = lib_function;
