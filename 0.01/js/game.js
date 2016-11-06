Vue.filter('intercept2', function (value) {
  return Number(value).toFixed('2')
})
Vue.filter('percent2', function (value) {
  return Number(value).toFixed('5') * 100 + '%'
})

var initBuild = 1;
var initArmy = 2;

if (localStorage.nickname) {
	var gd = {
		introduces: '',
		cityValue: localStorage.cityValue,
		nickname: localStorage.nickname, // 总督信息
		money: localStorage.money, // 基地信息
		moneyProduce: localStorage.moneyProduce,
		peopleHave: localStorage.peopleHave,
		peopleIdle: localStorage.peopleIdle,
		buildList: [ // 建筑信息
			{ id: 0, name: '练兵场', introduce: '增加人口上限', money: 100, effects: [{ name: 'peopleHave', effect: 0}], worker: 22, nums: localStorage.build0 },
			// { id: 0, name: 'Name', introduce: 'Introduce', iron: 00, crystal: 00, electr: 00, effects: [{ name: 'Name', effect: 00}], worker: 00, nums: 00 },
		],
		armyList: [ // 军队信息
			{ id: 0, name: '民兵', introduce: 'Introduce', money: 50, worker: 1, harm: 7, armor: 50, nums: localStorage.army0 },
			{ id: 1, name: '征召兵', introduce: 'Introduce', money: 125, worker: 1, harm: 11, armor: 80, nums: localStorage.army1 },
			// { id: 0, name: 'Name', introduce: 'Introduce', money: 00, worker: 00, harm: 00, armor: 00, nums: 00 },
		],
		commentId : {limit: 5, use: 0},
		commentList: [
			{comment: 'Welcome Lords!'},
			{comment: '新手指南：流民会自动的加入城市，目前没有任何限制。目前只有居住税。居民太多会吸引强盗。'},
			{comment: '新手指南：强盗生，流民死。强盗很少出现在城市附近，但倘若没有士兵保护，强盗会尽可能的杀死居民们，他们清楚，每个居民都有机会成为手持兵刃的战士。'},
			{comment: '新手指南：建筑的拆迁会将建筑可用材料变卖掉，玩家可以得到一些废品钱；军队遣散则需要支付遣散费，值得庆幸，现在你不需要为雇佣的军队支付薪酬。'},
			{comment: '作者：祝你玩得愉快，下一版本将在一周后发布，本网址固定针对0.01v。'},
			{comment: '作者：如果你有想法，欢迎加我QQ（3112743654）。'},
		]
	}

	var ratio = 1
	if (Number(gd.peopleIdle) < 0) {
		ratio1 = Number(gd.peopleHave) / (Number(gd.peopleHave) - Number(gd.peopleIdle))	// 200 / (200 - (-20))
		if (ratio1 > 1) {
			ratio1 = 1
		}
		ratio = ratio1
	}
}


game = new Vue({
	el: '#game',
	data: gd,
	methods: {
		introduce: function(id) {
			gd.introduces = gd.buildList[id].introduce
		},
		plusBuilds: function(id) {
			if (Number(gd.money) < Number(gd.buildList[id].money)) {
				alert('古罗马币不足')
			} else if (parseInt(gd.peopleIdle) < Number(gd.buildList[id].worker)) {
				alert('工人不足')
			} else {
				gd.money  = Number(gd.money) - Number(gd.buildList[id].money)	// 扣资源
				gd.peopleIdle = Number(gd.peopleIdle)  - Number(gd.buildList[id].worker)	// 调派工人
				gd.buildList[id].nums = Number(gd.buildList[id].nums) + 1	// 加数量
				for (var i = gd.buildList[id].effects.length - 1; i >= 0; i--) {
					eval('gd.' + gd.buildList[id].effects[i].name + ' = Number(gd.' + gd.buildList[id].effects[i].name + ') + Number(gd.buildList[id].effects[i].effect)')
				}
			}
		},
		reduceBuilds: function(id) {
			if (parseInt(gd.buildList[id].nums) < 1) {
				alert('建筑不足')
			} else {
				gd.money  = Number(gd.money) + (Number(gd.buildList[id].money) * 0.3)	// 反馈资源
				gd.peopleIdle = Number(gd.peopleIdle)  + Number(gd.buildList[id].worker)	// 遣散工人
				gd.buildList[id].nums = parseInt(gd.buildList[id].nums) - 1	// 减数量
				for (var i = gd.buildList[id].effects.length - 1; i >= 0; i--) {
					eval('gd.' + gd.buildList[id].effects[i].name + ' = Number(gd.' + gd.buildList[id].effects[i].name + ') - Number(gd.buildList[id].effects[i].effect)')
				}
			}
		},
		plusArmys: function(id) {
			if (parseInt(gd.buildList[0].nums) < 1) {
				alert('您并没有兴建练兵场')
			} else if (parseInt(gd.peopleIdle) < Number(gd.armyList[id].worker)) {
				alert('工人不足')
			} else if (Number(gd.money) < Number(gd.armyList[id].money)) {
				alert('古罗马币不足')
			} else {
				gd.money  = Number(gd.money) - Number(gd.armyList[id].money)	// 扣资源
				gd.peopleIdle = Number(gd.peopleIdle)  - Number(gd.armyList[id].worker)	// 调派工人
				gd.armyList[id].nums = Number(gd.armyList[id].nums) + 1	// 加数量
			}
		},
		reduceArmys: function(id) {
			if (parseInt(gd.armyList[id].nums) < 1) {
				alert('士兵不足')
			} else {
				gd.money  = Number(gd.money) - (Number(gd.armyList[id].money) * 0.3)	// 遣散费
				gd.peopleIdle = Number(gd.peopleIdle)  + Number(gd.armyList[id].worker)	// 遣散工人
				gd.armyList[id].nums = parseInt(gd.armyList[id].nums) - 1	// 减数量
			}
		},
		addComment: function(comment) {
			var myDate = new Date();
			gd.commentList[gd.commentId.use].comment = comment + ' (' + myDate.getHours() + '小时' + myDate.getMinutes() + '分 ' + myDate.getSeconds() + '秒)'
			if (gd.commentId.use == gd.commentId.limit) {
				gd.commentId.use = 0
			} else {
				gd.commentId.use++
			}
			console.info('New Comment')
		},
		fight: function(PartyA, PartyB, status = 0) { // A方，B方，战斗类型（）
			if (parseInt(PartyB[0].nums) > 0) {
				var i = 0
				PartyB[i].nums = ((parseInt(PartyB[i].armor) * parseInt(PartyB[i].nums)) - (parseInt(PartyA[i].harm) * parseInt(PartyA[i].nums))) / parseInt(PartyB[i].armor)
				if (parseInt(PartyB[i].nums) < 0) PartyB[i].nums = 0
			} else if (parseInt(PartyB[1].nums) > 0) {
				var i = 1
				PartyB[i].nums = ((parseInt(PartyB[i].armor) * parseInt(PartyB[i].nums)) - (parseInt(PartyA[i].harm) * parseInt(PartyA[i].nums))) / parseInt(PartyB[i].armor)
				if (parseInt(PartyB[i].nums) < 0) PartyB[i].nums = 0
			}
			if (parseInt(PartyA[0].nums) > 0) {
				var i = 0
				PartyA[i].nums = ((parseInt(PartyA[i].armor) * parseInt(PartyA[i].nums)) - (parseInt(PartyB[i].harm) * parseInt(PartyB[i].nums))) / parseInt(PartyA[i].armor)
				if (parseInt(PartyA[i].nums) < 0) PartyA[i].nums = 0
			} else if (parseInt(PartyA[1].nums) > 0) {
				var i = 1
				PartyA[i].nums = ((parseInt(PartyA[i].armor) * parseInt(PartyA[i].nums)) - (parseInt(PartyB[i].harm) * parseInt(PartyB[i].nums))) / parseInt(PartyA[i].armor)
				if (parseInt(PartyA[i].nums) < 0) PartyA[i].nums = 0
			}
			if (parseInt(PartyA[0].nums) == 0 && parseInt(PartyA[1].nums) == 0) {
				return 'B'
			} else if (parseInt(PartyB[0].nums) == 0 && parseInt(PartyB[1].nums) == 0) {
				gd.armyList[0].nums = PartyA[0].nums
				gd.armyList[1].nums = PartyA[1].nums
				return 'A'
			} else {
				return 'N'
			}
		},
		saveGame: function() {
			var x = 1 / 3

			gd.money = Number(gd.money) + (Number(gd.moneyProduce) / Number(x))
			console.info('Resource Plus')

			if (Math.random() < 0.02 / Number(x)) {
				gd.peopleHave = Number(gd.peopleHave) + 1
				gd.peopleIdle = Number(gd.peopleIdle) + 1
				gd.moneyProduce = Number(gd.moneyProduce) + 0.02
				if (Math.random() < 0.175 / Number(x)) {
					this.addComment('这个城市或许不错，我是否应该留下来呢？')
				} else if (Math.random() < 0.2 / Number(x)) {
					this.addComment('先在这里歇歇脚吧……')
				}
				console.info('Vagrant Join')
			}

			if (parseInt(gd.peopleHave) > 47) {
				if (Math.random()<0.005 / Number(x)) {
					var armyList2 = [
						{ id: 0, harm: 7, armor: 50, nums: 19 }, 
						{ id: 1, harm: 11, armor: 80, nums: 8 }
					]
					if (this.fight(gd.armyList, armyList2) == 'N') {
						this.addComment('强盗前来抢劫，一番战斗之后，我们将敌人赶跑了。')
					} else if (this.fight(gd.armyList, armyList2) == 'A') {
						this.addComment('强盗来袭，我们将这群侵略者赶尽杀绝！')
					} else if (this.fight(gd.armyList, armyList2) == 'B') {
						var osuc = parseInt(Math.random()*22)
						gd.money = Number(gd.money) - parseInt(Math.random()*667)
						if (Number(gd.money) < 0) Number(gd.money) = 0
						gd.peopleHave = Number(gd.peopleHave) - parseInt(osuc)
						gd.peopleIdle = Number(gd.peopleIdle) - parseInt(osuc)
						if (parseInt(gd.peopleHave) < 0) {
							gd.peopleHave = 0
							gd.peopleIdle = 0
						}
						this.addComment('强盗来了，尽管我们努力战斗，但战败的阴影依然笼罩着这片领地……')
					}
					console.info('Bandit Got In City')
				}
			} else {
				if (Math.random()<0.001 / Number(x)) {
					var armyList2 = [
						{ id: 0, harm: 7, armor: 50, nums: 9 }, 
						{ id: 1, harm: 11, armor: 80, nums: 2 }
					]
					if (this.fight(gd.armyList, armyList2) == 'N') {
						this.addComment('强盗前来抢劫，一番战斗之后，我们将敌人赶跑了。')
					} else if (this.fight(gd.armyList, armyList2) == 'A') {
						this.addComment('强盗来袭，我们将这群侵略者赶尽杀绝！')
					} else if (this.fight(gd.armyList, armyList2) == 'B') {
						var osuc = parseInt(Math.random()*10)
						gd.money = Number(gd.money) - parseInt(Math.random()*100)
						if (Number(gd.money) < 0) Number(gd.money) = 0
						gd.peopleHave = Number(gd.peopleHave) - parseInt(osuc)
						gd.peopleIdle = Number(gd.peopleIdle) - parseInt(osuc)
						if (parseInt(gd.peopleHave) < 0) {
							gd.peopleHave = 0
							gd.peopleIdle = 0
						}
						this.addComment('强盗来了，尽管我们努力战斗，但战败的阴影依然笼罩着这片领地……')
					}
					this.addComment('强盗突袭！快跑啊！')
					console.info('Bandit Got In City')
				}
			}

			localStorage.cityValue = gd.cityValue
			localStorage.money = gd.money
			localStorage.moneyProduce = gd.moneyProduce
			localStorage.peopleHave = gd.peopleHave
			localStorage.peopleIdle = gd.peopleIdle

			for (var i = initBuild - 1; i >= 0; i--) {
				eval('localStorage.build' + i + ' = gd.buildList[' + i + '].nums')
			}
			for (var i = initArmy - 1; i >= 0; i--) {
				eval('localStorage.army' + i + ' = gd.armyList[' + i + '].nums')
			}
			console.info('Save Success!')
		},
		initGame: function() {
			localStorage.clear()
			localStorage.nickname = prompt("请输入昵称：")
			// alert('初始化成功，自动保存已开启。')
			localStorage.cityValue = 0
			localStorage.money = 100
			localStorage.moneyProduce = 0
			localStorage.peopleHave = 0
			localStorage.peopleIdle = 0

			for (var i = initBuild - 1; i >= 0; i--) {
				eval('localStorage.build' + i + ' = 0')
			}
			for (var i = initArmy - 1; i >= 0; i--) {
				eval('localStorage.army' + i + ' = 0')
			}
			window.location.reload()
		},
	},
	computed: {
		effectRatio: function() {
			return ratio
		},
	},
	ready: function () {
		if (!localStorage.nickname) {
			this.initGame();
		}
		setInterval(function () {game.saveGame()}, 3000);
	},
})