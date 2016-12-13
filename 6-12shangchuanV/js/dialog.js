;(function($){
	var Dialog=function(options){
		//默认的参数
		var _defaults={
			rendTo:$("body"),//添加的容器
			info:"确定要删除吗？",//标题文字
			btn:["确定","取消"], //按钮的文字(个数)
			callback:null //按钮操作的不同功能
		}

		//扩展的参数
		this.settings=$.extend({},_defaults,options);
		//动态的创建结构
		var str="";
		str+="<div class='mark'></div>"
				+'<div class="dia_box">'
					+'<p class="dia_info">'+this.settings.info+'</p>'
					+'<p class="dia_btn"></p>'
				+'</div>'
		$(str).prependTo(this.settings.rendTo); //子节点.prependTo(父节点)
		//添加按钮
		if(this.settings.btn.length==0) return;
		for(var i=0;i<this.settings.btn.length;i++){
			var Newbtn=$("<button id='btn"+i+"'>"+this.settings.btn[i]+"</button>");
			$(".dia_btn").append(Newbtn);
		}
		//点击按钮时，将遮罩层关闭
		var _this=this;
		$("#btn0").on("click",function(){//确定
			close();
			//判读如果回调函数存在，就操作它的功能
			_this.settings.callback && _this.settings.callback.call(this);
		})
		$("#btn1").on("click",function(){//取消
			close();
		})
		//遮罩层关闭函数
		function close(){
			$(".mark").remove();
			$(".dia_box").remove();
		}
	}

	//定义类级别的插件($.方法名=function(){})
	$.dialog=function(options){
		return new Dialog(options);
	}
})(jQuery)