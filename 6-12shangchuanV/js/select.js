;(function($){
	var jsonData=null;
	init();
	//初始化函数
	function init(){
		//请求json文件 获取JSON(jquery方法)
		$.ajax({
			url:"data.json",
			dataType:"json",
			type:"post",
			async:false, //同步
			success:function(data){
				jsonData=data;
			},
			error:function(){
				alert("请求页面失败！");
			}
		})
		//渲染一级菜单
		rendTofirstmenu();
	}
	//分别渲染区域和品牌的一级菜单
	function rendTofirstmenu(){
		$(".sel_box").each(function(){
			//区分要渲染的菜单
			var key=$(this).data("key"),
			    item=jsonData[key],  //获取的是数组和对象
			    label=$(this).prev("label");//一级菜单的label
			    //判断检测如果item返回的是对象  遍历item.option也就是品牌
			    if(Object.prototype.toString.call(item)=="[object Object]"){
			    	item=item.option;
			    }
			    var arr="<option>请选择</option>";
			    $.each(item,function(i,ele){
			    	var txt=ele.text?ele.text:ele.name,
			    	    val=ele.value?ele.value:ele.id;
			    	arr+="<option value='"+val+"'>"+txt+"</option>";
			    })
			$(this).html(arr);
			//设置label的文本为请选择
			label.text("请选择");
			//为一级菜单绑定change事件
			bindchange($(this),item);
		})
	}
	//为一级菜单绑定change事件
	function bindchange(menulist,item){
		var label=menulist.prev("label"),
		    sublist=menulist.parent().next(),//二级菜单的盒子
		    subselect=sublist.find("select"),//二级菜单的select
		    sublabel=subselect.prev("label");//二级菜单的label
		menulist.on("change",function(){
			//设置label的文本为当改变选中项的文本
			var optval=this.options[this.selectedIndex].text;//原生
			label.text(optval);
			if(label.text()=="请选择"){
				sublist.css("visibility","hidden");
			}else{
				//二级菜单显示，渲染二级菜单
				sublist.css("visibility","visible");
				var str="<option>请选择</option>";
				$.each(item[this.selectedIndex-1].option,function(index,obj){
					var txt=obj.text?obj.text:obj.name;	
					str+="<option>"+txt+"</option>";
				})
				subselect.html(str);
				//设置二级菜单的label为请选择
				sublabel.text("请选择");
				//为二级菜单绑定change事件
				 subselect.on("change",function(){
				 	//设置sublabel的文本为当改变选中项的文本
					var optval1=this.options[this.selectedIndex].text;//原生
					 sublabel.text(optval1);
				 })
			}			
		})
	}
})(Zepto)