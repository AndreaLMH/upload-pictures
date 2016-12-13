;(function($){
	//定义类级别的插件 $.方法名=function(){}
	var Upload=function(options){
		//定义默认参数
		var _defaults={
				counter_box:$("#counter_box"),//计算上传图片张数的盒子
				wrap:$("#upLoad_box"),//上传图片的容器
				file:$("#file"),//文件域
				max:8, //图片最多张数
				m_size:2*1024*1024, //上传图片最大的体积  (1KB=1*1024*1024M)
				scale:0.8, //压缩比例
				url:"upload.php",  //请求php文件
				cs:"img", //ajax的参数
				warnFn:function(Txt){//弹出提示框功能
					//调用对话框插件
					$.dialog({
						rendTo:$("body"),//添加的容器
						info:Txt,//标题文字(传参)
						btn:["关闭"], //按钮的文字(个数)
					})
				}		
		}
		//扩展参数
		this.settings=$.extend({},_defaults,options);
		//初始化函数
		this.init();
	}
	//原型
	Upload.prototype={
		init:function(){
			var file=this.settings.file,
			    that=this;
			//计算并统计上传图片的张数
			this.counter();
			//为文件域绑定change事件
			file.on("change",function(){
				//获取文件上传对象(重点) 文件域.files[0]返回数组
				var files=this.files,//文件域对象
					fileName=files[0].name,//获取文件域的文件名
				    fileSize=files[0].size,//获取文件域的文件大小
				    uls=that.settings.wrap.find("ul");
				//检测上传文件的名字与文件大小是否符合要求
				if(fileSize>that.settings.m_size){  //检测文件大小
					that.settings.warnFn("请上传图片大小不超过2M");
					return false;
				}
				//检测名字的格式
				var reg=/\.jpg|\.png|\.gif$/;
				if(!reg.test(fileName)){
					that.settings.warnFn("上传图片以jpg或者png或者gif格式的图片");
					return false;
				}
				//检测都通过时，创建结构在页面中显示出来,添加图片并且重新统计数量
				var list=$("<li class='picture'><img src=''/><a href='###' class='close'></a></li>");
					uls.prepend(list);
					that.counter();
				//删除功能
				//为关闭按钮绑定单击事件
				var close=list.find(".close");
				close.on("click",function(){
					$(this).parent().remove();
					//再重新统计数量
					that.counter();
				})
				//压缩图片调用
				that.zipImg({
					 /*
	    			 * cfg.files      input对象触发onchange时候的files
	     			 * cfg.scale      压缩比例
	     			 * cfg.callback     压缩成功后的回调
	    			 */
	    			 files:files,
	    			 scale:that.settings.scale,
	    			 callback:function(result){ //result返回结果是字符串
	    			 	//检测一下返回的结果如果不是数组，就将它转为数组
	    			 	if(result.constructor!=Array){
	    			 		result=[result];
	    			 		//调用上传图片方法
							that.uploadImg(result[0]);
	    			 	}
	    			 }
				})
			})
		},
		counter:function(){//统计数量
			var Linum=this.settings.wrap.find(".picture").size(),//已经上传的张数
			    all_img=this.settings.counter_box.find("span");  //还可以上传图片的张数
			    this.settings.counter_box.find("em").text(Linum);
			//计算还可以上传的张数=图片最多的张数-已经上传的张数
				all_img.text(this.settings.max-Linum);
			//判断已经上传图片数量是否超过了最多允许上传量
			if(Linum>=this.settings.max){
				$("#last_li").hide();//超过了，就隐藏掉
			}else{
				$("#last_li").show();//没超过，就显示
			}
		},
		//压缩图片方法
		zipImg: function(cfg){
	    /*
	     * cfg.files      input对象触发onchange时候的files
	     * cfg.scale      压缩比例
	     * cfg.callback     压缩成功后的回调
	     */
	     var _this = this;
	     var options = cfg;
	    [].forEach.call(options.files, function(v, k){
	      var fr = new FileReader();  
	      fr.onload= function(e) {  
	        var oExif = EXIF.readFromBinaryFile(new BinaryFile(e.target.result)) || {};
	        var $img = document.createElement('img');                         
	        $img.onload = function(){                 
	          _this.fixDirect().fix($img, oExif, options.callback,options.scale);
	        };  
	        // if(typeof(window.URL) != 'undefined'){
	        //  $img.src = window.URL.createObjectURL(v);
	        // }else{
	        //  $img.src = e.target.result;       
	        // }
	        $img.src = window.URL.createObjectURL(v);
	      };  
	      //fr.readAsDataURL(v);
	      fr.readAsBinaryString(v);
	    }); 
	   },
	   //调整图片方向
	   fixDirect: function(){
	    var r = {};
	    r.fix = function(img, a, callback,scale) {
	      var n = img.naturalHeight,
	        i = img.naturalWidth,
	        c = 1024,
	        o = document.createElement("canvas"),
	        s = o.getContext("2d");
	      a = a || {};
	      //o.width = o.height = c;
	      //debugger;
	      if(n > c || i > c){
	        o.width = o.height = c;
	      }else{
	        o.width = i;
	        o.height = n;
	      }
	      a.Orientation = a.Orientation || 1;
	      r.detectSubSampling(img) && (i /= 2, n /= 2);
	      var d, h;
	      i > n ? (d = c, h = Math.ceil(n / i * c)) : (h = c, d = Math.ceil(i / n * c));
	      // var g = c / 2,
	      var g = Math.max(o.width,o.height)/2,
	        l = document.createElement("canvas");
	      if(n > c || i > c){
	        l.width = g, l.height = g;
	      }else{
	        l.width = i;
	        l.height = n;
	        d = i;
	        h =n;
	      }
	      //l.width = g, l.height = g;
	      var m = l.getContext("2d"), u = r.detect(img, n) || 1;
	      s.save();
	      r.transformCoordinate(o, d, h, a.Orientation);
	      var isUC = navigator.userAgent.match(/UCBrowser[\/]?([\d.]+)/i);
	      if (isUC && $.os.android){
	        s.drawImage(img, 0, 0, d, h);
	      }else{
	        for (var f = g * d / i, w = g * h / n / u, I = 0, b = 0; n > I; ) {
	          for (var x = 0, C = 0; i > x; )
	            m.clearRect(0, 0, g, g), m.drawImage(img, -x, -I), s.drawImage(l, 0, 0, g, g, C, b, f, w), x += g, C += f;
	          I += g, b += w
	        }
	      }
	      s.restore();
	      a.Orientation = 1;
	      img = document.createElement("img");
	      img.onload = function(){
	        a.PixelXDimension = img.width;
	        a.PixelYDimension = img.height;
	        //e(img, a);
	      };	      
	      callback && callback(o.toDataURL("image/jpeg", scale).substring(22));//压缩图片
	    };
	    r.detect = function(img, a) {
	      var e = document.createElement("canvas");
	      e.width = 1;
	      e.height = a;
	      var r = e.getContext("2d");
	      r.drawImage(img, 0, 0);
	      for(var n = r.getImageData(0, 0, 1, a).data, i = 0, c = a, o = a; o > i; ) {
	        var s = n[4 * (o - 1) + 3];
	        0 === s ? c = o : i = o, o = c + i >> 1
	      }
	      var d = o / a;
	      return 0 === d ? 1 : d
	    };
	    r.detectSubSampling = function(img) {
	      var a = img.naturalWidth, e = img.naturalHeight;
	      if (a * e > 1048576) {
	        var r = document.createElement("canvas");
	        r.width = r.height = 1;
	        var n = r.getContext("2d");
	        return n.drawImage(img, -a + 1, 0), 0 === n.getImageData(0, 0, 1, 1).data[3]
	      }
	      return !1;
	    };
	    r.transformCoordinate = function(img, a, e, r) {
	      switch (r) {
	        case 5:
	        case 6:
	        case 7:
	        case 8:
	          img.width = e, img.height = a;
	          break;
	        default:
	          img.width = a, img.height = e
	      }
	      var n = img.getContext("2d");
	      switch (r) {
	        case 2:
	          n.translate(a, 0), n.scale(-1, 1);
	          break;
	        case 3:
	          n.translate(a, e), n.rotate(Math.PI);
	          break;
	        case 4:
	          n.translate(0, e), n.scale(1, -1);
	          break;
	        case 5:
	          n.rotate(.5 * Math.PI), n.scale(1, -1);
	          break;
	        case 6:
	          n.rotate(.5 * Math.PI), n.translate(0, -e);
	          break;
	        case 7:
	          n.rotate(.5 * Math.PI), n.translate(a, -e), n.scale(-1, 1);
	          break;
	        case 8:
	          n.rotate(-.5 * Math.PI), n.translate(-a, 0)
	      }
	    };
	    return r;
  		},
  		//ajax请求php文件，上传图片
  		uploadImg:function(img){
  			var that=this,obj={};
  			obj[that.settings.cs]=img;
  			$.ajax({
  				url:that.settings.url,
  				type:"post",
  				data:obj,
  				success:function(result){
  					//显示图片
  					var src=JSON.parse(result), //将result字符串转为真正的对象
  					    src1=src.url; //获取到图片的路径
  					$(".picture").eq(0).find("img").attr("src",src1);
  				},
  				error:function(){
					that.settings.warnFn("上传失败！");
					$(".picture").eq(0).remove(); //上传失败了应将刚点过的图片删了
  				}
  			})	
  		}
	}
	$.Upload_img=function(options){
		return new Upload(options);
	}
})(jQuery)