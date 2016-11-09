Vue.filter('intercept2', function (value) {
	return Number(value).toFixed('2')
})
Vue.filter('percent2', function (value) {
	return Number(value).toFixed('5') * 100 + '%'
})
Vue.filter('moneyProduce', function (value) {
	var peopleHave = 0
	if (gd) {peopleHave = gd.peopleHave}
	return Number(peopleHave*0.02).toFixed('2')
})

var initBuild = 1;
var initArmy = 2;
var initBandit = 3;

if (localStorage.nickname) {
	var gd = {
		introduces: '',
		// 总督信息
		ver: localStorage.ver,
		nickname: localStorage.nickname,
		// 基地信息
		cityValue: localStorage.cityValue,
		money: localStorage.money,
		peopleHave: localStorage.peopleHave,
		peopleIdle: localStorage.peopleIdle,
		menace: localStorage.menace,
		// 建筑信息
		buildsList: [
			{ id: 0, name: '练兵场', introduce: '增加人口上限', money: 100, effects: [{ name: 'peopleHave', effect: 0}], worker: 22, nums: localStorage.build0 },
			{ id: 1, name: '农贸市场', introduce: '居民买卖粮食和生活必需品的场所，税收的重要来源。', money: 175, effects: [{ name: 'peopleHave', effect: 0}], worker: 22, nums: localStorage.build0 },
			{ id: 2, name: '农田', introduce: '佃农们耕种着领主的田地，每年收获后，从收获的粮食中，拿取自己的那份，以维持全家的温饱。(Via 土豆爸爸)', money: 175, effects: [{ name: 'money', effect: 0}], worker: 4, nums: localStorage.build0 },
		],
		// 军队信息
		armysList: [
			{ id: 0, name: '民兵', introduce: 'Introduce', money: 50, worker: 1, harm: 7, armor: 50, nums: localStorage.army0 },
			{ id: 1, name: '征召兵', introduce: 'Introduce', money: 125, worker: 1, harm: 11, armor: 80, nums: localStorage.army1 },
		],
		// 强盗信息
		banditsList: [
			{id: 0, name: '流氓', harm: 6, armor: 40, nums: localStorage.bandit0 },
			{id: 1, name: '强盗', harm: 10, armor: 80, nums: localStorage.bandit1 },
			{id: 2, name: '强盗头目', harm: 20, armor: 100, nums: localStorage.bandit2 },
		],
		commentId : {limit: 7, use: 0},
		commentList: [
			{comment: 'Welcome Lords!'},
			{comment: '指南：如果你对游戏有疑惑之处，欢迎点击上方的新手指南，里面包含了我们对新玩家的游戏指导，以及尽可能详细的Wiki。'},
			{comment: '疑惑：倘若指南不能给你解惑，欢迎在U77留言。'},
			{comment: '疑惑：如果你可以提供更好的指南，欢迎与U77的戴斯特洛伊亞联系，他负责了一部分指南工作，我们将持续更新指南，For 更好的游戏。'},
			{comment: '浏览器：目前游戏支持浏览器（的最低版本）：IE 11、Edge 14、Firefox 49、Chrome 49、Safari 9.1、Opera 41，以及绝大多数ISO、Android浏览器。'},
			{comment: '作者：祝你玩得愉快，下一版本将在下周末发布，本网址固定针对0.03v。'},
			{comment: '作者：我们需要有实际想法的朋友，加我QQ（3112743654），或者向U77的馒头菌反馈，他在0.02v发布后加入，是游戏的程序之一。'},
		],
	}
}


game = new Vue({
	el: '#game',
	data: gd,
	methods: {
// 消息提示
		alertInfo : function(message) {
			UIkit.notify({
				message : message,
				status : 'info',
				timeout : 3000,
				pos : 'top-center'
			});
		},

		alertSuccess : function(message) {
			UIkit.notify({
				message : message,
				status : 'success',
				timeout : 3000,
				pos : 'top-center'
			});
		},

		alertWarning : function(message) {
			UIkit.notify({
				message : message,
				status : 'warning',
				timeout : 3000,
				pos : 'top-center'
			});
		},

		alertDanger : function(message) {
			UIkit.notify({
				message : message,
				status : 'danger',
				timeout : 3000,
				pos : 'top-center'
			});
		},
// 保存存档
		saveGame: function() {
			var x = 1 / 3;

			gd.money = Number(gd.money) + (Number(gd.peopleHave) * 0.02 / Number(x));
			console.info('Resource Plus');

			var randnum = Math.random();
			if (randnum < 0.02 / Number(x)) {
				gd.peopleHave = Number(gd.peopleHave) + 1;
				gd.peopleIdle = Number(gd.peopleIdle) + 1;

				if (randnum < 0.3) {
					gd.banditsList[0].nums = parseInt(gd.banditsList[0].nums) + 1;
				} else if (randnum < 0.13) {
					gd.banditsList[1] = parseInt(gd.banditsList[1].nums) + 1;
				} else if (randnum < 0.04) {
					gd.banditsList[2] = parseInt(gd.banditsList[2].nums) + 1;
				}

				if (randnum < 0.2) {
					this.addComment('这个城市或许不错，我是否应该留下来呢？');
				} else if (randnum < 0.25) {
					this.addComment('先在这里歇歇脚吧……');
				}
				console.info('Vagrant Join'+randnum);
			}

			this.banditFight();

			localStorage.ver = gd.ver
			localStorage.cityValue = gd.cityValue
			localStorage.money = gd.money
			localStorage.peopleHave = gd.peopleHave
			localStorage.peopleIdle = gd.peopleIdle
			localStorage.menace = gd.menace

			for (var i = initBuild - 1; i >= 0; i--) {
				eval('localStorage.build' + i + ' = gd.buildsList[' + i + '].nums')
			}
			for (var i = initArmy - 1; i >= 0; i--) {
				eval('localStorage.army' + i + ' = gd.armysList[' + i + '].nums')
			}
			for (var i = initBandit - 1; i >= 0; i--) {
				eval('localStorage.bandit' + i + ' = gd.banditsList[' + i + '].nums')
			}
			console.info('Save Success!')
		},
// 初始存档
		initGame: function() {
			localStorage.clear();
			localStorage.nickname = prompt("请输入昵称：");
			localStorage.ver = '0.02v';
			localStorage.cityValue = 0;
			localStorage.money = 100;
			localStorage.peopleHave = 0;
			localStorage.peopleIdle = 0;
			localStorage.menace = 'null';

			for (var i = initBuild - 1; i >= 0; i--) {
				eval('localStorage.build' + i + ' = 0');
			}
			for (var i = initArmy - 1; i >= 0; i--) {
				eval('localStorage.army' + i + ' = 0');
			}
			for (var i = initBandit - 1; i >= 0; i--) {
				eval('localStorage.bandit' + i + ' = 0');
			}
			window.location.reload();
		},
// 更新存档
		updateSave: function() {
			if (gd.ver == '0.02v') {
				gd.ver = '0.03v';
				this.alertInfo('您的存档已从0.01v，更新至0.02v');
			} else {
				this.alertInfo('您的存档已是最新版本');
			}
		},
// 增加消息
		addComment: function(comment) {
			var myDate = new Date();
			gd.commentList[gd.commentId.use].comment = comment + ' (' + myDate.getHours() + '小时' + myDate.getMinutes() + '分 ' + myDate.getSeconds() + '秒)';
			if (gd.commentId.use == gd.commentId.limit) {
				gd.commentId.use = 0;
			} else {
				gd.commentId.use++;
			}
			for (var i = gd.commentList.length - 1; i >= 0; i--) {
				gd.commentList[i];
			}
			console.info('New Comment');
		},
// 战斗算法
		fight: function(PartyA, PartyB, status = 0) { // A方，B方，战斗类型（）
			if (parseInt(PartyB[0].nums) > 0) {
				var i = 0;
				PartyB[i].nums = parseInt(((parseInt(PartyB[i].armor) * parseInt(PartyB[i].nums)) - (parseInt(PartyA[i].harm) * parseInt(PartyA[i].nums))) / parseInt(PartyB[i].armor));
				if (parseInt(PartyB[i].nums) < 0) PartyB[i].nums = 0;
			} else if (parseInt(PartyB[1].nums) > 0) {
				var i = 1;
				PartyB[i].nums = parseInt(((parseInt(PartyB[i].armor) * parseInt(PartyB[i].nums)) - (parseInt(PartyA[i].harm) * parseInt(PartyA[i].nums))) / parseInt(PartyB[i].armor));
				if (parseInt(PartyB[i].nums) < 0) PartyB[i].nums = 0;
			}

			if (parseInt(PartyA[0].nums) > 0) {
				var i = 0;
				PartyA[i].nums = parseInt(((parseInt(PartyA[i].armor) * parseInt(PartyA[i].nums)) - (parseInt(PartyB[i].harm) * parseInt(PartyB[i].nums))) / parseInt(PartyA[i].armor));
				if (parseInt(PartyA[i].nums) < 0) PartyA[i].nums = 0;
			} else if (parseInt(PartyA[1].nums) > 0) {
				var i = 1;
				PartyA[i].nums = parseInt(((parseInt(PartyA[i].armor) * parseInt(PartyA[i].nums)) - (parseInt(PartyB[i].harm) * parseInt(PartyB[i].nums))) / parseInt(PartyA[i].armor));
				if (parseInt(PartyA[i].nums) < 0) PartyA[i].nums = 0;
			}

			if (parseInt(PartyA[0].nums) == 0 && parseInt(PartyA[1].nums) == 0) {
				return 'B';
			} else if (parseInt(PartyB[0].nums) == 0 && parseInt(PartyB[1].nums) == 0 && parseInt(PartyB[2].nums) == 0) {
				gd.peopleHave = Number(gd.peopleHave) - Number(gd.armysList[0].nums) + Number(PartyA[0].nums);
				gd.armysList[0].nums = PartyA[0].nums;
				gd.armysList[1].nums = PartyA[1].nums;
				gd.banditsList[0].nums = PartyB[0].nums;
				gd.banditsList[1].nums = PartyB[1].nums;
				gd.banditsList[2].nums = PartyB[2].nums;
				return 'A';
			} else {
				return 'N';
			}
		},
// 计算指数
		index: function(init, list) {
			var index = 0;
			var indexOnce = 0;
			for (var i = init - 1; i >= 0; i--) {
				indexOnce = Number(list[i].harm) * 0.1 + Number(list[i].armor) * 0.02;
				index = parseInt(list[i].nums) * Number(indexOnce) + parseInt(index);
			}
			return index;
		},
// 介绍信息
		introduce: function(introduce) {
			gd.introduces = introduce;
		},
// 建造建筑
		plusBuilds: function(id) {
			if (Number(gd.money) < Number(gd.buildsList[id].money)) {
				this.alertInfo('古罗马币不足')
			} else if (parseInt(gd.peopleIdle) < Number(gd.buildsList[id].worker)) {
				this.alertInfo('居民不足')
			} else {
				gd.money  = Number(gd.money) - Number(gd.buildsList[id].money)	// 扣资源
				gd.peopleIdle = Number(gd.peopleIdle)  - Number(gd.buildsList[id].worker)	// 调派工人
				gd.buildsList[id].nums = Number(gd.buildsList[id].nums) + 1	// 加数量
				for (var i = gd.buildsList[id].effects.length - 1; i >= 0; i--) {
					eval('gd.' + gd.buildsList[id].effects[i].name + ' = Number(gd.' + gd.buildsList[id].effects[i].name + ') + Number(gd.buildsList[id].effects[i].effect)')
				}
			}
		},
// 拆除建筑
		reduceBuilds: function(id) {
			if (parseInt(gd.buildsList[id].nums) < 1) {
				this.alertInfo('建筑不足')
			} else {
				gd.money  = Number(gd.money) + (Number(gd.buildsList[id].money) * 0.3)	// 反馈资源
				gd.peopleIdle = Number(gd.peopleIdle)  + Number(gd.buildsList[id].worker)	// 遣散工人
				gd.buildsList[id].nums = parseInt(gd.buildsList[id].nums) - 1	// 减数量
				for (var i = gd.buildsList[id].effects.length - 1; i >= 0; i--) {
					eval('gd.' + gd.buildsList[id].effects[i].name + ' = Number(gd.' + gd.buildsList[id].effects[i].name + ') - Number(gd.buildsList[id].effects[i].effect)')
				}
			}
		},
// 训练军队
		plusArmys: function(id) {
			if (parseInt(gd.buildsList[0].nums) < 1) {
				this.alertInfo('您并没有兴建练兵场')
			} else if (parseInt(gd.peopleIdle) < Number(gd.armysList[id].worker)) {
				this.alertInfo('居民不足')
			} else if (Number(gd.money) < Number(gd.armysList[id].money)) {
				this.alertInfo('古罗马币不足')
			} else {
				gd.money  = Number(gd.money) - Number(gd.armysList[id].money)	// 扣资源
				gd.peopleIdle = Number(gd.peopleIdle)  - Number(gd.armysList[id].worker)	// 调派工人
				gd.armysList[id].nums = Number(gd.armysList[id].nums) + 1	// 加数量
			}
		},
// 遣散军队
		reduceArmys: function(id) {
			if (parseInt(gd.armysList[id].nums) < 1) {
				this.alertInfo('士兵不足')
			} else {
				gd.money  = Number(gd.money) - (Number(gd.armysList[id].money) * 0.3)	// 遣散费
				gd.peopleIdle = Number(gd.peopleIdle)  + Number(gd.armysList[id].worker)	// 遣散工人
				gd.armysList[id].nums = parseInt(gd.armysList[id].nums) - 1	// 减数量
			}
		},
// 侦查强盗
		surroundingProbe: function() {
			if (parseInt(gd.money) < 10) {
				this.alertInfo('您没有足够的、开展侦查活动的钱。');
			} else {
				gd.money = parseInt(gd.money) - 10;
				var index = this.index('initBandit', gd.banditsList);

				if (index < 50 && index > 25) {
					gd.menace = 'unstable';
				} else if (index < 200 && index > 100) {
					gd.menace = 'complaint';
				} else if (index < 400 && index > 200) {
					gd.menace = 'enmity';
				} else if (index > 400) {
					gd.menace = 'hatred';
				} else {
					gd.menace = 'safe';
				}
			}
		},
// 扫荡强盗
		surroundingSweep: function() {
			if (this.fight(gd.armysList, gd.banditsList) == 'N') {
				this.addComment('军部：报告大人，我们已经派军前往领地周边四处扫掠，扫黄打非，震慑宵小。');
			} else if (this.fight(gd.armysList, gd.banditsList) == 'A') {
				this.addComment('军部：报告大人，我军成功杀伤了敌人的有生力量，降低了附近的威胁。');
			} else if (this.fight(gd.armysList, gd.banditsList) == 'B') {
				this.addComment('军部：报告大人，我们派出的军队过于弱小，遭遇了强盗们的围攻……');
			}
		},
// 强盗入侵
		banditFight: function() {
			var index = this.index('initBandit', gd.banditsList);

			if (Number(index) > 99) {
				index = Number(index) * 0.001; // 根据威胁度，设计强盗入侵几率
				if (Math.random()<index) {
					if (this.fight(gd.armysList, gd.banditsList) == 'N') {
						this.addComment('强盗前来抢劫，一番战斗之后，我们将敌人赶跑了。')
					} else if (this.fight(gd.armysList, gd.banditsList) == 'A') {
						this.addComment('强盗来袭，我们将这群侵略者赶尽杀绝！')
					} else if (this.fight(gd.armysList, gd.banditsList) == 'B') {
						var osuc = parseInt(Math.random()*22)
						gd.money = Number(gd.money) - parseInt(Math.random()*667)
						gd.peopleHave = parseInt(gd.peopleHave) - parseInt(osuc)
						gd.peopleIdle = parseInt(gd.peopleIdle) - parseInt(osuc)

						if (Number(gd.money) < 0) Number(gd.money) = 0;
						if (parseInt(gd.peopleHave) < 0) {
							gd.peopleHave = 0;
							gd.peopleIdle = 0;
						}
						this.addComment('强盗来了，尽管我们努力战斗，但战败的阴影依然笼罩着这片领地……他们杀了'+osuc+'人，掠夺了'+osic+'枚古罗马币');
					}
					console.info('Bandit Got In City')
				}
			}
		},
	},

	computed: {
	},

	ready: function () {
		if (!localStorage.nickname) {
			this.initGame();
		}
		if (gd.ver != '0.03v') {
			this.alertInfo('您是旧存档，请点击 存档更新。');
		}
		setInterval(function () {game.saveGame()}, 3000);
	},
})