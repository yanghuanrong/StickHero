var onoff = true; //游戏开关
var iNow = 0; //记录棍子长度
var step = 0; //游戏步骤
var isPlay = false; //动画是否做播放
var stickTime = null //棍子的定时器
var scoreNum = 0; //积分
var heroWidth = 30;
var isTouch = false; //记录手指是否摁住屏幕
var score = document.getElementById('score')
var stick = document.getElementById('stick');
var leftBar = document.getElementById('leftBar');
var rightBar = document.getElementById('rightBar');
var centBar = document.getElementById('centBar');
var hero = document.getElementById('hero');
var GameContent = document.getElementById('GameContent');
var restartBtn = document.getElementById('restartBtn');
var restartBox = document.getElementById('restart');
var current = document.getElementById('current');
var History = document.getElementById('History');
var OneStartBtn = document.getElementById('OneStartBtn');
var OneStart = document.getElementById('OneStart');
var cloud = document.getElementById('cloud');
var kill = document.getElementById('kill');
var gameBG = document.getElementById('gameBG');
var cloudChild = cloud.getElementsByTagName('div')

centBar.style.width = creatNum(30, 80) + "px";
centBar.style.left = creatNum(80, 220) + "px";

document.addEventListener('touchmove', function(e) {
	e.preventDefault()
}, false);
document.addEventListener('touchstart', function(e) {
	e.preventDefault()
});
//开始游戏
OneStartBtn.addEventListener('touchstart', function() {
	OneStart.style.display = 'none';
	score.style.display = 'block';
	cloud.style.webkitTransform = 'none'
//	GameContent.style.webkitTransition = '1.5s';
//	gameBG.style.webkitTransform = 'none'
	GameContent.style.webkitTransform = 'initial';
	GameContent.style.webkitTransformOrigin = 'initial';
	setTimeout(function() {
		document.addEventListener('touchstart', mouseDown);
		document.addEventListener('touchend', mouseUp);
		document.addEventListener('touchmove',mouseMove)
	}, 500)

})

//摁下的时候
function mouseDown() {
	if(isPlay) {
		isTouch = true;
		return;
	}
	clearInterval(stickTime);
	stickTime = setInterval(function() {
		iNow += 2;
		stick.style.width = iNow + 'px';
	}, 20)
}
//滑动的时候
function mouseMove(e){
	if(isPlay || isTouch) {
		isTouch = false;
		return;
	};
	var pageX=e.changedTouches[0].pageX;
	var pageY=e.changedTouches[0].pageY;
	
	var screenW=document.body.clientWidth;
	var screenH=document.body.clientHeight;
	
	if(pageX>screenW||pageX<0||pageY>screenH||pageY<0){
		mouseUp()
	}
}
//抬起的时候
function mouseUp() {
	if(isPlay || isTouch) {
		isTouch = false;
		return;
	};
	isPlay = true;
	clearInterval(stickTime);
	middleLeft = centBar.offsetLeft;

	stick.style.webkitTransition = '0.5s';
	stick.style.webkitTransform = 'rotate(0)';
	//检测游戏结束
	if(iNow < centBar.offsetLeft - heroWidth || iNow > centBar.offsetLeft + centBar.offsetWidth - heroWidth) {
		onoff = false;
		document.removeEventListener('touchstart', mouseDown)
		document.removeEventListener('touchend', mouseUp)
	}

	var next = creatNext();
	rightBar.style.left = next[0] + 'px';
	rightBar.style.width = next[1] + 'px';
	iNow = 0;
}

//英雄移动
stick.addEventListener('transitionend', function(e) {
	if(onoff) {
		hero.style.webkitTransition = '0.5s';
		hero.style.left = centBar.offsetLeft + 'px';
	} else {
		hero.style.webkitTransition = '0.5s';
		hero.style.left = stick.offsetWidth + 'px';
		kill.style.left = stick.offsetWidth + 'px';

		kill.className = 'kill';
		if(getCookie('score')==undefined){
			History.innerHTML = 0;
		}else{
			History.innerHTML = getCookie('score');
		}
		
		setTimeout(function() {
			restartBox.style.display = 'block';
		}, 600)
	}
})

//主场景镜头
hero.addEventListener('transitionend', function(e) {
	if(onoff) {
		GameContent.style.webkitTransition = '0.5s';
		GameContent.style.left = -centBar.offsetLeft + 'px';

		step = 1
		e.stopPropagation()
	} else {
		hero.style.webkitTransition = '0.5s';
		hero.style.bottom = -hero.offsetHeight + 'px';
	}
})

//循环场景
GameContent.addEventListener('transitionend', function() {
	if(step == 1) {
		document.addEventListener('touchstart', mouseDown);
		document.addEventListener('touchend', mouseUp);
		gameRestart();
		scoreNum++;
		score.innerHTML = scoreNum + '分';
		current.innerHTML = scoreNum;

		if(getCookie('score') == undefined) {
			setCookie('score', scoreNum, 1)
		} else {
			HistoryScore = getCookie('score');
			if(HistoryScore < scoreNum) {
				removeCookie('score')
				setCookie('score', scoreNum, 1)
			}
		}
		step = 0;
		isPlay = false;
	}
})
//重复元素
function gameRestart() {
	stick.style.webkitTransition = 'none';
	stick.style.webkitTransform = 'rotate(-90deg)';
	stick.style.width = 0;
	GameContent.style.webkitTransition = 'none';
	GameContent.style.left = 0;
	hero.style.webkitTransition = 'none';
	hero.style.left = 0;
	hero.style.bottom = 180 + 'px';

	leftBar.style.left = centBar.offsetLeft - middleLeft + 'px';
	leftBar.style.width = centBar.offsetWidth + 'px';

	centBar.style.left = rightBar.offsetLeft - middleLeft + 'px';
	centBar.style.width = rightBar.offsetWidth + 'px';
}

//重新开始游戏
restartBtn.addEventListener('touchstart', restart)
function restart() {
	onoff = true; //游戏开关
	iNow = 0; //记录棍子长度
	step = 0; //游戏步骤
	isPlay = false; //动画是否做播放
	stickTime = null //棍子的定时器
	scoreNum = 0; //积分
	restartBox.style.display = 'none';
	gameRestart()
	kill.className = '';
	score.innerHTML = '0分';

	setTimeout(function() {
		document.addEventListener('touchstart', mouseDown)
		document.addEventListener('touchend', mouseUp)
	}, 500)

}
// 随机区间
function creatNum(start, end) {
	return parseInt(Math.random() * (end - start) + start)
}
// 下一个的位置及宽度
function creatNext() {
	var iWidth = creatNum(35, 80);
	var minWidth = document.body.clientWidth;
	var iLeft = creatNum(minWidth, minWidth - 80 + middleLeft);
	return [iLeft, iWidth];
}
//设置cookie
function setCookie(key, value, t) {
	var oDate = new Date();
	oDate.setDate(oDate.getDate() + t);
	document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
}
//获取cookie
function getCookie(key) {
	var arr1 = document.cookie.split('; ');
	for(var i = 0; i < arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if(arr2[0] == key) {
			return decodeURI(arr2[1]);
		}
	}
}
//删除cookie
function removeCookie(key) {
	setCookie(key, '', -1);
}