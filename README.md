# easy-banner

## 基于jquery的banner组件

**html模板代码**
```html
<div id="banner-wrap">
	<ul class="banner-list">
		<li><img src="images/1.jpg"></li>
		<li><img src="images/2.jpg"></li>
		<li><img src="images/3.jpg"></li>
		<li><img src="images/4.jpg"></li>
	</ul>
	<!-- banner底部数字按钮 -->
	<ul></ul>
	<!-- 左右方向键 -->
	<button>&lt;</button>
		<button>&gt;</button>
</div>
<script>
  $(function(){
				$('#banner-wrap').banner({
					width: 730,
					height: 454,
					style: 'common',
					animate: 'move',
					duration: 2500,
					autoPlay: true
				})
			})
</script>
```
配置参数列表
+ width type:number 轮播图的宽度
+ hieght type:number 轮播图的高度 
+ style 轮播图样式
 - common 样式(有方向键，有底部数字按钮)
 - hasDir 样式(有方向键，无底部数字按钮)
 - hasNumber 样式(无方向键，有底部数字按钮) 
 - ''  默认样式(无方向键，无底部数字按钮)
+ autoPlay type: boolean 是否自动播放  默认 false
+ duration type: number 自动播放的时间间隔，默认1500 
+ animate type: string 轮播图播放动画
+ numberPos type:array | '' 数字按钮位置
