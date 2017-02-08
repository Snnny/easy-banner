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
