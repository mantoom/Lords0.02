Vue.filter('intercept0', function (value) {
	return Number(value).toFixed(0)
})
Vue.filter('intercept2', function (value) {
	return Number(value).toFixed(2)
})
Vue.filter('percent2', function (value) {
	return Number(value).toFixed(5) * 100 + '%'
})
Vue.filter('moneyProduce', function (value) {
	var getMoney = 0
	if (gd) {
		getMoney = Number(gd.peopleHave)*0.01 + Number(gd.tax)
	}
	return Number(getMoney).toFixed('2')
})
Vue.filter('')

var initBuild = 4;
var initArmy = 2;
var initBandit = 3;
var buildRate = 1;
var armyRate = 1;
var ver = '0.04(002)';

if (localStorage.nickname) {
	var gd = {
		introduces: 'Ui',
		// 总督信息
		ver: localStorage.ver,
		nickname: localStorage.nickname,
		// 基地信息
		cityValue: localStorage.cityValue,
		money: localStorage.money,
		tax: localStorage.tax,
		peopleHave: localStorage.peopleHave,
		peopleIdle: localStorage.peopleIdle,
		peopleLimit: localStorage.peopleLimit,
		menace: localStorage.menace,
		// 建筑信息
		buildsList: [
			{ id: 0, name: '练兵场', introduce: '训练战士、驻扎军队、必要时保卫城镇的军人聚集之所。', money: 100, effects: [{ name: 'peopleHave', effect: 0}], worker: 22, nums: localStorage.build0 },
			{ id: 1, name: '农贸集市', introduce: '居民买卖粮食和生活必需品的场所，可以收取少量的税金，未来，这里将成为食品贸易集散地。', money: 155, effects: [{ name: 'tax', effect: 3.2}], worker: 8, nums: localStorage.build1 },
			{ id: 2, name: '农田', introduce: '佃农们耕种着领主的田地，每年收获后，从收获的粮食中，拿取自己的那份，以维持全家的温饱。(Via 土豆爸爸)', money: 40, effects: [{ name: 'tax', effect: 0.7}], worker: 2, nums: localStorage.build2 },
			{ id: 3, name: '民居', introduce: '可以容纳一家七口人居住，尽管拥挤，却是冬天来临时，可以保命的庇护之所。', money: 35, effects: [{ name: 'peopleLimit', effect: 7}], worker: 0, nums: localStorage.build3 },
		],
		// 军队信息
		armysList: [
			{ id: 0, name: '民兵', introduce: '村镇招募的普通农民，无论是王国还是帝国，为了防备强盗土匪的劫掠，每年秋收之前，都会进行秋季拉练。', money: 50, worker: 1, harm: 7, armor: 4, morale: 3, nums: localStorage.army0 },
			{ id: 1, name: '征召兵', introduce: '紧急时期招募的普通人，经过简单有效的军事训练，尽管如此，在正式编制的军人之中，依然属于菜鸡水平。', money: 85, worker: 1, harm: 11, armor: 5, morale: 4, nums: localStorage.army1 },
		],
		// 强盗信息
		banditsList: [
			{id: 0, name: '流氓', harm: 6, armor: 4, morale: 2, nums: localStorage.bandit0 },
			{id: 1, name: '强盗', harm: 10, armor: 8, morale: 3, nums: localStorage.bandit1 },
			{id: 2, name: '强盗头目', harm: 20, armor: 10, morale: 4, nums: localStorage.bandit2 },
		],
		commentId : {limit: 7, use: 0},
		commentList: [
			{comment: 'Welcome Lords!'},
			{comment: '指南：如果你对游戏有疑惑之处，欢迎点击上方的新手指南，里面包含了我们对新玩家的游戏指导，以及尽可能详细的Wiki。'},
			{comment: '疑惑：倘若指南不能给你解惑，欢迎在U77留言。'},
			{comment: '如果你可以提供更好的指南，欢迎与U77的戴斯特洛伊亞联系，他负责了一部分指南工作，我们将持续更新指南，For 更好的游戏。'},
			{comment: '浏览器：目前游戏支持浏览器（的最低版本）：IE 11、Edge 14、Firefox 49、Chrome 49、Safari 9.1，以及ISO / Android。'},
			{comment: '作者：因为游戏意外的登上U77的原创内容，收获了一大波愤怒的玩家，所以本周时间都扑在了游戏开发上，总算有点游戏性了。'},
			{comment: '作者：祝你玩得愉快，下一版本将在下周末发布，本网址固定针对0.03v，玩家群：483969197。'},
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
			var monthDay = 3;

			gd.money = Number(gd.money) + (Number(gd.peopleHave) * (0.01 / x));

			// 流民加入
			peopleFactor = (parseInt(gd.peopleHave) > 70) ? 0.02 : Number(0.7 - parseInt(gd.peopleHave) * 0.01) + 0.02;
			if (Math.random() < peopleFactor) {
				console.info(peopleFactor + 's1')
				console.info(parseInt(gd.peopleLimit) + 's2')
				var randnum = Math.random();
				if (parseInt(gd.peopleLimit) > parseInt(gd.peopleHave)) {
					console.info(parseInt(gd.peopleLimit) + 's3')
					gd.peopleHave = Number(gd.peopleHave) + 1;
					gd.peopleIdle = Number(gd.peopleIdle) + 1;
					if (randnum < 0.2) {
						this.addComment('流民：这个城市或许不错，我是否应该留下来呢？');
					} else if (randnum < 0.35 && randnum > 0.2) {
						this.addComment('流民：喔，人们挺和善的，先在这里歇歇脚吧。');
					}
				} else {
					console.info(parseInt(gd.peopleLimit) + 's7')
					if (randnum < 0.25) this.addComment('流民：这里似乎没有我的容身之处，唉……');
				}

				console.info('Vagrant Join');
			}

			// 强盗加入
			var randnum = Math.random();
			if (randnum > 0.05 && randnum < 0.15) { // 0.10
				gd.banditsList[0].nums = parseInt(gd.banditsList[0].nums) + 1;
			} else if (randnum > 0.015 && randnum < 0.05) { // 0.035
				gd.banditsList[1].nums = parseInt(gd.banditsList[1].nums) + 1;
			} else if (randnum < 0.015) { // 0.015
				gd.banditsList[2].nums = parseInt(gd.banditsList[2].nums) + 1;
			}

			// 人口繁衍
			gd.peopleHave = Number((Number(gd.peopleHave) / 2) * 0.0033 + Number(gd.peopleHave)).toFixed('2');
			gd.peopleIdle = Number((Number(gd.peopleHave) / 2) * 0.0033 + Number(gd.peopleIdle)).toFixed('2');
			var randnum = Math.random();
			if (randnum < 0.2 && Number(gd.peopleHave) > 100) {
				if (parseInt(gd.peopleLimit) > parseInt(gd.peopleHave)) {
					this.addComment('接生婆：新生儿！领地的新希望！');
				} else {
					this.addComment('接生婆：不幸的新生儿。大人，我们的房屋不够用，在冬天，这些孩子有可能会被冻死，恳求您多造几间屋子吧。');
				}
			}
			// 税收
			gd.money = Number(gd.tax) / monthDay / x + Number(gd.money);
			// 强盗
			this.banditFight();

			localStorage.ver = gd.ver;
			localStorage.cityValue = gd.cityValue;
			localStorage.money = gd.money;
			localStorage.tax = gd.tax;
			localStorage.peopleHave = gd.peopleHave;
			localStorage.peopleIdle = gd.peopleIdle;
			localStorage.peopleLimit = gd.peopleLimit;
			localStorage.menace = gd.menace;

			for (var i = initBuild - 1; i >= 0; i--) {
				eval('localStorage.build' + i + ' = gd.buildsList[' + i + '].nums');
			}
			for (var i = initArmy - 1; i >= 0; i--) {
				eval('localStorage.army' + i + ' = gd.armysList[' + i + '].nums');
			}
			for (var i = initBandit - 1; i >= 0; i--) {
				eval('localStorage.bandit' + i + ' = gd.banditsList[' + i + '].nums');
			}
		},
// 初始存档
		initGame: function() {
			localStorage.clear();
			localStorage.nickname = prompt("请输入昵称：");
			localStorage.ver = ver;
			localStorage.cityValue = 0;
			localStorage.money = 100;
			localStorage.peopleHave = 7;
			localStorage.peopleIdle = 7;
			localStorage.peopleLimit = 20;
			localStorage.menace = 'null';
			localStorage.tax = 0;

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
			if (gd.ver != ver) {
				// 
			} else if (gd.ver != '0.04(002)') {
				build0 = localStorage.build0;
				build1 = localStorage.build1;
				for (var i = initBuild - 1; i >= 0; i--) {
					eval('localStorage.build' + i + ' = 0');
				}
				localStorage.build0 = build0;
				localStorage.build1 = build1;
				localStorage.peopleLimit = 20;
				localStorage.ver = ver;
				window.location.reload();
			} else {
				this.alertInfo('您的存档已是最新版本');
			}
		},
// 增加消息
		addComment: function(_comment) {
			var myDate = new Date();
			var mymonth=myDate.getMonth()+1;
			gd.commentList.unshift ( { comment : _comment + '('+myDate.getFullYear()+'-'+mymonth+'-'+myDate.getDate()+' '+myDate.getHours()+':'+myDate.getMinutes()+':'+myDate.getSeconds()+')'} );
			gd.commentList.pop();
		},
// 战斗算法
		fight: function(PartyA, PartyB, nameA, nameB) { // A为己方
			// 计算双方军队数值
			var harmA = 0;
			var armorA = 0;
			var allArmyA = 0;
			var allMoraleA = 0;

			var harmB = 0;
			var armorB = 0;
			var allArmyB = 0;
			var allMoraleB = 0;

			var killFactor = 0.015;

			// 计算军队实力
			for (var i = PartyA.length - 1; i >= 0; i--) {
				harmA = parseInt(PartyA[i].nums) * parseInt(PartyA[i].harm) + harmA;
				armorA = parseInt(PartyA[i].nums) * parseInt(PartyA[i].armor) + armorA;
				allMoraleA = parseInt(PartyA[i].nums) * parseInt(PartyA[i].morale) + armorA;
			}
			for (var i = PartyB.length - 1; i >= 0; i--) {
				harmB = parseInt(PartyB[i].nums) * parseInt(PartyB[i].harm) + harmB;
				armorB = parseInt(PartyB[i].nums) * parseInt(PartyB[i].armor) + armorB;
				allMoraleB = parseInt(PartyB[i].nums) * parseInt(PartyB[i].morale) + moraleB;
			}
			// 判断双方军队的伤害是否空，如果为空，就算有军队，也无法获得胜利
			if (parseInt(harmA) < 1) {
				if (parseInt(harmB) < 1) {return 'draw';}
				return 'lost';
			} else if (parseInt(harmB) < 1) {
				if (parseInt(harmA) < 1) {return 'draw';}
				return 'win';
			} else {
				while (harmA < 1 || harmB < 1) {
					// 军队数量
					for (var i = PartyA.length - 1; i >= 0; i--) {
						allArmyA += parseInt(PartyA[i].nums);
					}
					for (var i = PartyB.length - 1; i >= 0; i--) {
						allArmyB += parseInt(PartyB[i].nums);
					}

					// 互相伤害，计算伤亡
					var deathB = parseInt((harmA - armorB) * killFactor);
					var deathA = parseInt((harmB - armorA) * killFactor);
					var deathFactorA = allArmyA / deathA;
					var deathFactorB = allArmyB / deathA;

					for (var i = PartyA.length - 1; i >= 0; i--) {
						PartyA[i].nums = parseInt(PartyA[i].nums) - parseInt(PartyA[i].nums) * deathFactorA;
					}
					for (var i = PartyB.length - 1; i >= 0; i--) {
						PartyB[i].nums = parseInt(PartyB[i].nums) - parseInt(PartyB[i].nums) * deathFactorB;
					}

					// 重算军队实力
					var harmA = 0;
					var armorA = 0;
					var moraleA = 0;
					var harmB = 0;
					var armorB = 0;
					var moraleB = 0;
// 部队士气总和=Σ（兵种数量x兵种士气）
// 当现有总士气占幸存士兵总士气的25%时，触发溃逃，溃逃后幸存部队的1/3将返回领地。
					for (var i = PartyA.length - 1; i >= 0; i--) {
						harmA = parseInt(PartyA[i].nums) * parseInt(PartyA[i].harm) + harmA;
						armorA = parseInt(PartyA[i].nums) * parseInt(PartyA[i].armor) + armorA;
						moraleA = parseInt(PartyA[i].nums) * parseInt(PartyA[i].morale) + armorA;
					}
					for (var i = PartyB.length - 1; i >= 0; i--) {
						harmB = parseInt(PartyB[i].nums) * parseInt(PartyB[i].harm) + harmB;
						armorB = parseInt(PartyB[i].nums) * parseInt(PartyB[i].armor) + armorB;
						moraleB = parseInt(PartyB[i].nums) * parseInt(PartyB[i].morale) + moraleB;
					}
					if ((moraleA / allMoraleA) < 0.25) {	// 军队溃散，失去战斗力
						armorA = 0;
						break;
					}
					if ((moraleB / allMoraleB) < 0.25) {
						armorB = 0;
						break;
					}
				}
				// 战斗结束，返回残局军队数据
				if (parseInt(armorA) < 1) {
					if (parseInt(armorB) < 1) {
						for (var i = PartyA.length - 1; i >= 0; i--) {
							eval('gd.' + nameA + '[i].nums = 0');
						}
						for (var i = PartyB.length - 1; i >= 0; i--) {
							eval('gd.' + nameB + '[i].nums = 0');
						}
						return 'draw';
					}

					for (var i = PartyA.length - 1; i >= 0; i--) {
						eval('gd.' + nameA + '[i].nums = 0');
					}
					for (var i = PartyB.length - 1; i >= 0; i--) {
						eval('gd.' + nameB + '[i].nums = parseInt(PartyB[i].nums)');
					}
					return 'lost';
				} else if (parseInt(armorB) < 1) {
					if (parseInt(armorA) < 1) {
						for (var i = PartyB.length - 1; i >= 0; i--) {
							eval('gd.' + nameB + '[i].nums = 0');
						}
						for (var i = PartyA.length - 1; i >= 0; i--) {
							eval('gd.' + nameA + '[i].nums = 0');
						}
						return 'draw';
					}

					for (var i = PartyA.length - 1; i >= 0; i--) {
						eval('gd.' + nameA + '[i].nums = parseInt(PartyA[i].nums)');
					}
					for (var i = PartyB.length - 1; i >= 0; i--) {
						eval('gd.' + nameB + '[i].nums = 0');
					}
					return 'win';
				}
			}
		},
// 计算军队指数
		indexArmy: function(init, list) {
			var index = 0;
			var indexOnce = 0;
			for (var i = eval(init) - 1; i >= 0; i--) {
				indexOnce = Number(list[i].harm) * 0.1 + Number(list[i].armor) * 0.02;
				index = parseInt(list[i].nums) * Number(indexOnce) + parseInt(index);
			}
			return index;
		},
// 介绍信息
		introduce: function(introduce) {
			gd.introduces = introduce;
		},
		//设置倍数
				setRate: function(rate,n){
					if (!n) {
						n = prompt("请输入你要建造的数量")
						$(event.currentTarget).text(n)
					};
					eval( rate+' = '+n);
					console.info(n)
				},
		// 建造建筑
				plusBuilds: function(id) {
					buildMoneyDemand = Number(gd.buildsList[id].money) * buildRate;
					buildWorkerDemand = Number(gd.buildsList[id].worker) * buildRate;
					if (Number(gd.money) < buildMoneyDemand) {
						this.alertInfo('古罗马币不足')
					} else if (Number(gd.peopleIdle) < buildWorkerDemand) {
						this.alertInfo('居民不足')
					} else {
						gd.money  = Number(gd.money) - buildMoneyDemand	// 扣资源
						gd.peopleIdle = Number(gd.peopleIdle)  - buildWorkerDemand	// 调派工人
						gd.buildsList[id].nums = Number(gd.buildsList[id].nums) + buildRate	// 加数量
						for (var j = 0 ;j <= buildRate; j++){
							for (var i = gd.buildsList[id].effects.length - 1; i >= 0; i--) {
								eval('gd.' + gd.buildsList[id].effects[i].name + ' = Number(gd.' + gd.buildsList[id].effects[i].name + ') + Number(gd.buildsList[id].effects[i].effect)')
							}
						}
					}
				},
		// 拆除建筑
				reduceBuilds: function(id) {
					buildMoneyDemand = Number(gd.buildsList[id].money) * buildRate;
					buildWorkerDemand = Number(gd.buildsList[id].worker) * buildRate;
					if (parseInt(gd.buildsList[id].nums)-buildRate < 0) {
						this.alertInfo('建筑不足')
					} else {
						gd.money  = Number(gd.money) + (buildMoneyDemand * 0.3)	// 反馈资源
						gd.peopleIdle = Number(gd.peopleIdle)  + buildWorkerDemand	// 遣散工人
						gd.buildsList[id].nums = parseInt(gd.buildsList[id].nums) - buildRate	// 减数量
						for (var j = 0 ;j <= buildRate; j++){
							for (var i = gd.buildsList[id].effects.length - 1; i >= 0; i--) {
								eval('gd.' + gd.buildsList[id].effects[i].name + ' = Number(gd.' + gd.buildsList[id].effects[i].name + ') - Number(gd.buildsList[id].effects[i].effect)')
							}
						}
					}
				},
		// 训练军队
				plusArmys: function(id) {
					armyMoneyDemand = Number(gd.armysList[id].money) * armyRate;
					armyWorkerDemand = Number(gd.armysList[id].worker) * armyRate;
					if (parseInt(gd.buildsList[0].nums) < 1) {
						this.alertInfo('您并没有兴建练兵场')
					} else if (parseInt(gd.peopleIdle) < armyWorkerDemand) {
						this.alertInfo('居民不足')
					} else if (Number(gd.money) < armyMoneyDemand) {
						this.alertInfo('古罗马币不足')
					} else {
						gd.money  = Number(gd.money) - armyMoneyDemand	// 扣资源
						gd.peopleIdle = Number(gd.peopleIdle)  - armyWorkerDemand	// 调派工人
						gd.armysList[id].nums = Number(gd.armysList[id].nums) + armyRate	// 加数量
					}
				},
		// 遣散军队
				reduceArmys: function(id) {
					armyMoneyDemand = Number(gd.armysList[id].money) * armyRate;
					armyWorkerDemand = Number(gd.armysList[id].worker) * armyRate;
					if (parseInt(gd.armysList[id].nums)-armyRate < 0) {
						this.alertInfo('士兵不足')
					} else {
						gd.money  = Number(gd.money) - (armyMoneyDemand * 0.3)	// 遣散费
						gd.peopleIdle = Number(gd.peopleIdle)  + armyWorkerDemand	// 遣散工人
						gd.armysList[id].nums = parseInt(gd.armysList[id].nums) - armyRate	// 减数量
					}
				},
// 侦查强盗
		surroundingProbe: function() {
			if (parseInt(gd.money) < 10) {
				this.alertInfo('进行侦查活动的需要10枚古罗马币。');
			} else {
				gd.money = parseInt(gd.money) - 10;
				var index = this.indexArmy('initBandit', gd.banditsList);

				if (index < 50 && index > 25) {
					gd.menace = 'unstable';
				} else if (index < 100 && index > 50) {
					gd.menace = 'complaint';
				} else if (index < 200 && index > 100) {
					gd.menace = 'enmity';
				} else if (index > 200) {
					gd.menace = 'hatred';
				} else {
					gd.menace = 'safe';
				}
			}
		},
// 扫荡强盗
		surroundingSweep: function() {
			var result = this.fight(gd.armysList, gd.banditsList, 'armysList', 'banditsList');
			if (result == 'win') {
				this.addComment('军部：报告大人，我们已经派军前往领地周边四处扫掠，扫黄打非，震慑宵小。');
			} else if (result == 'draw') {
				this.addComment('军部：报告大人，我军成功杀伤了敌人的有生力量，降低了附近的威胁。');
			} else if (result == 'lost') {
				this.addComment('军部：报告大人，我们派出的军队过于弱小，遭遇了强盗们的围攻……');
			}
		},
// 强盗入侵
		banditFight: function() {
			var index = this.indexArmy('initBandit', gd.banditsList);

			if (Number(index) > 88) {
				index = Number(index) * 0.001; // 根据威胁度，设计强盗入侵几率，200=20%、88=8.8%
				if (Math.random()<index) {
					var result = this.fight(gd.armysList, gd.banditsList, 'armysList', 'banditsList');
					if (result == 'draw') {
						this.addComment('强盗前来抢劫，一番战斗之后，我们将敌人赶跑了。')
					} else if (result == 'win') {
						this.addComment('强盗来袭，我们将这群侵略者赶尽杀绝！')
					} else if (result == 'lost') {
						var osuc = Math.random()*22;
						var osic = Math.random()*667;
						gd.money = Number(gd.money) - osic;
						gd.peopleHave = parseInt(gd.peopleHave) - parseInt(osuc);
						gd.peopleIdle = parseInt(gd.peopleIdle) - parseInt(osuc);

						if (Number(gd.money) < 0) gd.money = 0;
						if (parseInt(gd.peopleHave) < 0) {
							gd.peopleHave = 0;
							gd.peopleIdle = 0;
						}
						this.addComment('强盗来了，尽管我们努力战斗，但战败的阴影依然笼罩着这片领地……他们杀了'+Number(osuc).toFixed('2')+'人，掠夺了'+Number(osic).toFixed('2')+'枚古罗马币');
					}
				}
			}
		},
	},

	computed: {
	},

	mounted: function () {
		this.$nextTick(function () {
			if (!localStorage.nickname) {
				this.initGame();
			}
			if (gd.ver != ver) {
				this.alertInfo('您是旧存档，请点击 存档更新！');
			}
			setInterval(function () {game.saveGame()}, 3000);
		})
	}
})
