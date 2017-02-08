;(function($){
			$.fn.extend({
				banner: function(opt){
					return new Banner(this,opt);
				}
			})

		})(jQuery)

	function Banner(oParent,opt){
		this.index = 0;   //默认从第一张开始
		this.time = null; //计时器
		this.opacity = 0 ;//初始化所有的img透明度为0
		this.isClcik = false; //是否点击
		zIndex = 0; //层级
		
		//默认配置
		this.setting = {
			// 默认有方向按钮，无数字按钮，不是自动滚动
			width: 700,
			height: 400,
			style: '',
			autoPlay: false,
			animate: 'move',
			duration: 1500
		}

		// var _this = this;
		//opt用户可选配置参数，如果没传，使用默认参数
		$.extend(this.setting, opt);
		//最外层div
		this.parent = $(oParent);
		//盛放图片的ul
		this.content = this.parent.find('ul')[0];
		//盛放数字按钮的ul
		this.number = this.parent.find('ul').last();
		// console.log(this.number);
		// 左方向键--向右运动
		this.rightBtn = this.parent.find('button').first();
		// 右方向键--向左运动
		this.leftBtn = this.parent.find('button').last();
		//图片
		this.imgs = $(this.content).find('img');

		// 设置初始样式
		this._setDefaultStyle();
		//是否有方向键
		if(this.setting.style === 'hasDir' || this.setting.style === 'common'){
			this._setDirStyle();
			this._showDir();
		}else{
			this.parent.find('button').remove();
		}
		//是否有数字按钮
		if(this.setting.style === 'hasNumber'){
			
			this._setNumberStyle();
		}
		//一般样式，有数字按钮和方向键
		if(this.setting.style === 'common'){
			this._setNumberStyle();
		}
		//移动方式--滑动
		if(this.setting.animate === 'move'){
			// 为了无缝连接，克隆第一个节点到最后一张
			var cloneNode = $(this.content).find('li').first().clone();
			$(this.content).append(cloneNode);
			if(this.setting.autoPlay){
				this._autoPlay();
			}
			this._mouse();
			this._move();;

		}
		// 获取几张图片
		this.size = $(this.content).find('li').length;
		//初始化第一个数字按钮默认选中
		this.number.find('li').first().css('background','#ff0000');

		//移动方式--渐隐渐显
		if(this.setting.animate === 'fade'){
			//初始化时将第一张图片当做背景
			var firstSrc = this.imgs.first().attr('src');
			this.parent.css({
				'background-image':'url("'+ firstSrc +'")',
				'background-size': '100% 100%'
			})

			if(this.setting.autoPlay){
				this._autoPlay();	
			}

			this._mouse2();
			this._fade();		
		}

	}

	//设置默认样式
	Banner.prototype._setDefaultStyle = function(){
	
		//设置父容器的宽高
		var This = this;
		This.parent.css({
			'position': 'relative',
			'height': This.setting.height + 'px',
			'width': This.setting.width  + 'px',
			overflow: 'hidden'
		});
		//设置盛放图片的ul的样式
		$(This.content).css({
			'position': 'absolute',
			'list-style': 'none',
			'width': '20000px',
			'height': This.setting.height + 'px',
		});

		//li浮动
		$(This.content).find('li').css('float','left');

		//设置图片宽高
		This.imgs.css({
			'width': This.setting.width + 'px',
			'height': This.setting.height + 'px',

		})
		if(This.setting.animate === 'fade'){
			This.imgs.css({'position': 'absolute'})
		}

	}

	//设置方向按钮样式
	Banner.prototype._setDirStyle = function(){
		// 设置方向键样式
		this.parent.find('button').css({
			'position': 'absolute',
			'display': 'none',
			'width': '30px',
			'height': '45px',
			'text-align': 'center',
			'line-height': '45px',
			'font-weight': 'bold',
			'color': '#fff',
			'font-family': '宋体',
			'cursor': 'pointer',
			'background': 'rgba(0,0,0,.5)',
			'border': 'none'
		})
		var btnTop = Math.floor((Math.floor(this.setting.height)  - this.parent.find('button').height())/2);
		this.leftBtn.css({
			'top': btnTop
		})
		this.rightBtn.css({
			'top': btnTop,
			'right': '0'
		})
	}

	//设置底部数字按钮样式
	Banner.prototype._setNumberStyle = function(){
		//动态生 成盛放数字按钮
		var count = $(this.content).find('li').length;
		for(var j=0;j<count;j++){
			this.number.append("<li class='number-list'>"+ (j+1) +"</li>")
		}

		this.number.css({
			'position':'absolute',
			'left': '0',
			'text-align': 'center',
			'width': '100%',
			'bottom': '30px',
			'height': '20px'
		})
		// 默认居中显示
		$('.number-list').css({
			'display': 'inline-block',
			'height': '20px',
			'width': '20px',
			'line-height': '20px',
			'background-color': '#3E3E3E',
			'text-align': 'center',
			'cursor': 'pointer',
			'margin': '0 4px',
			'border-radius': '50%',
			'color': '#fff'	,
			'float': 'none'
		})
		// 如果是显示在右下方
		var pos = this.setting.numberPos;
		if(pos && pos[0] === 'right'){
			if(pos[2] != null){
				this.number.css('bottom', pos[2]);
			}
			this.number.css('text-align','right');
			$('.number-list').last().css('margin-right',pos[1])
		}
		// 如果是显示在左下方
		if(pos && pos[0] === 'left'){
			if(pos[2] != null){
				this.number.css('bottom', pos[2]);
			}
			this.number.css('text-align','left');
			$('.number-list').first().css('margin-left',pos[1])
		}
	}

	//鼠标滑过事件--move
	Banner.prototype._mouse = function(){
		var m_time = null;
			var _this = this;
			this.number.find('li').hover(function(){
				var This = this;
				_this.index = $(this).index();
				m_time = setTimeout(function(){					
					$(_this.content).stop().animate({
						'left': -(_this.setting.width)*(_this.index)
					})
					$(This).css('background','#ff0000').siblings().css('background','#3E3E3E')
				},200)
			},function(){
				clearTimeout(m_time);
			})

	}

	//移动方式为：滑动move(调用_animate方法)
	Banner.prototype._move = function(){
			var _this = this;
			var time_inner = null;
			//向左
			_this.leftBtn.click(function(){
				var This = this;
				//设置点击
				_this.isClick = true;

				_this.index++;
				_this._animate();

				$(This).attr('disabled',true);
				//加计时器，防止用户频繁点击
				if(_this.isClick){
					clearInterval(time_inner);
					time_inner = setInterval(function () {
						$(This).attr('disabled',false);	
					}, 1000);
				}			
			})
				//向右
			_this.rightBtn.click(function(){
					var This = this;
					//设置点击
					_this.isClick = true;

					_this.index--;
					_this._animate();

					$(This).attr('disabled',true);
		
					if(_this.isClick){
						clearInterval(time_inner);
						time_inner = setInterval(function () {
							$(This).attr('disabled',false);	
					}, 1000);
				}			 
			
			})
		}
	//封装的move动画
	Banner.prototype._animate = function(){
		if(this.index == this.size){
			$(this.content).css({
				'left': '0'
			});
			this.index = 1;
		}
		if(this.index == -1){
			$(this.content).css({
				'left': -(this.setting.width)*(this.size-1)
			});
			this.index = (this.size-2);
		}
		$(this.content).stop().animate({
			'left': -(this.setting.width)*(this.index)
		});

		if(this.index == (this.size-1)){
			this.number.find('li').eq(0).css('background','#ff0000').siblings().css('background','#3E3E3E')
		}else{
			this.number.find('li').eq(this.index).css('background','#ff0000').siblings().css('background','#3E3E3E')
		}

	}

	//移动方式2：渐隐渐显opacity(调用_opacitys方法)
	Banner.prototype._fade = function(){
			var time_inner = null;
			var _this = this;
			//ul与外层盒子大小一致
			$(this.content).css('width',this.setting.width);
			//首张图片透明度为1
			var img = _this.imgs;
			img.css('opacity',0);
			img.eq(0).css({
				'opacity': 1,
				'z-index': _this.index
			});
			//向左
			this.leftBtn.click(function(){
				var This = this;
				
				_this.isClick = true;
				_this._setBg(_this.index );
				_this.index++;
				_this.zIndex++;
				$(This).attr('disabled',true);

				_this._opacitys();

				if(_this.isClick){
						clearInterval(time_inner);
						time_inner = setInterval(function () {
							$(This).attr('disabled',false);	
					}, 1000);
				}		

			})
			//向右
			this.rightBtn.click(function(){
				var This = this;
				_this.isClick = true;
				//设置背景
				_this._setBg(_this.index );

				_this.index--;
				_this.zIndex++;
				$(This).attr('disabled',true);
				
				_this._opacitys();

				if(_this.isClick){
						clearInterval(time_inner);
						time_inner = setInterval(function () {
							$(This).attr('disabled',false);	
					}, 1000);
				}		
			})

		}
	
	//封装的fade动画
	Banner.prototype._opacitys = function(){
		var img = this.imgs;
		if(this.index == img.length){ 
			img.eq(this.index - 1).animate({
				'opacity': 0,
			},1)
			this.index = 0;
			
		}
		if(this.index == -1){
			img.eq(this.index + 1).animate({
				'opacity': 0,
			},1)
			this.index = img.length - 1;
		
		}

		img.eq(this.index).animate({
			'opacity': 1,
			'z-index': this.zIndex
		}).parent().siblings().find('img').css('opacity',0);

		this.number.find('li').eq(this.index).css('background','#ff0000').siblings().css('background','#3E3E3E');

	}

	//鼠标滑过事件--fade
	Banner.prototype._mouse2 = function(){
		var _this = this;
			var m_time = null;
			this.number.find('li').hover(function(){

				_this.index = $(this).index();
				
				m_time = setTimeout(function(){
					_this._opacitys();
					$(this).css('background','#ff0000').siblings().css('background','#3E3E3E')
				},200)
			},function(){
				//将当前图片设置为背景
				_this._setBg(_this.index );
				clearTimeout(m_time);
			})
	}

	//给父容器动态添加背景
	Banner.prototype._setBg = function(index){
		var index = index + 1;
		var source = this.imgs.eq(index-1).attr('src');
		this.parent.css({
			'background-image': "url('"+ source +"')",
			'background-size': '100% 100%'
		})
	}
	//自动播放
	Banner.prototype._autoPlay = function(){
		var _this = this;
		this.time = setInterval(function(){
			_this.index++;
			_this.setting.animate === 'fade' ? _this._opacitys() : _this._animate();
			// _this._animate();
		},this.setting.duration);
	}

	//鼠标进入，显示按钮,鼠标离开(如果设置自动播放，则自动播放)
	Banner.prototype._showDir = function(){
		var _this = this;
		this.parent.hover(function(){

			if(_this.setting.autoPlay){
				clearInterval(_this.time);
			}

			$(this).find('button').fadeIn(200);
		},function(){
			if(_this.setting.autoPlay){
				_this._autoPlay();
			}
			$(this).find('button').fadeOut(200);
		})
	}
