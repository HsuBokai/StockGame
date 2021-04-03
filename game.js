const { createApp, ref } = Vue;
const app = createApp({
	data() {
		return {
			context: null,
			timeStep: 0,
			stock_list : [
				{
					name : 'TSMC',
					price : 110,
					color : '#999999',
					canBuy : true,
					canSell : false,
				},
				{
					name : 'HTC',
					price : 100,
					color : '#5555ff',
					canBuy : true,
					canSell : false,
				},
				{
					name : 'MTK',
					price : 90,
					color : '#55cc55',
					canBuy : true,
					canSell : false,
				},
				{
					name : 'AAPL',
					price : 80,
					color : '#cc5555',
					canBuy : true,
					canSell : false,
				},
				{
					name : 'GOOG',
					price : 70,
					color : '#aaaa55',
					canBuy : true,
					canSell : false,
				},
				{
					name : 'FB',
					price : 60,
					color : 'yellow',
					canBuy : true,
					canSell : false,
				},
				{
					name : 'AMZN',
					price : 50,
					color : '#55cccc',
					canBuy : true,
					canSell : false,
				},
				{
					name : 'NFLX',
					price : 40,
					color : '#cc55cc',
					canBuy : true,
					canSell : false,
				},
				{
					name : 'TSLA',
					price : 30,
					color : '#555555',
					canBuy : true,
					canSell : false,
				},
			],
			hold_list : [],
			money: 600,
			asset: 600,
			fee: 0,
			canvas_width: 600,
			canvas_height: 400,
			canvas_zero: 300,
			game_status : 'pause',
		}
	},
	created () {
		console.log('created');
	},
	mounted () {
		console.log('mounted');
		var c = document.getElementById('canvas-price');
		c.width = this.canvas_width;
		c.height = this.canvas_height;
		c.addEventListener('mousedown', this.clickCanvas);
		this.context = c.getContext('2d');
		this.drawPlayBtn();
		this.drawLine(0, this.canvas_zero, this.canvas_width, this.canvas_zero, 'black');
		this.context.fillStyle = 'black';
		this.context.fillText('0',this.canvas_width-15, this.canvas_zero-5);
		//this.context.fillText('20',this.canvas_width-15, this.canvas_zero-5-20*3);
	},
	unmounted () {
		console.log('unmounted');
	},
	methods: {
		hold_empty () {
			return 0 === this.hold_list.length;
		},
		clickCanvas (e) {
			var x = e.pageX-10;
			var y = e.pageY-10;
			var r = 25;
			if (25-r < x && x < 25+r && 20-r < y && y < 20+r) {
				switch (this.game_status) {
					case 'pause':
						this.drawPauseBtn();
						this.game_status = 'play'
						setTimeout(this.nextStep, 1*1000);
						break;
					case 'play':
						this.drawPlayBtn();
						this.game_status = 'pause'
						break;
				}
			}
		},
		nextStep () {
			if ('play' !== this.game_status) {
				return;
			}
			var diff = [6,-6,4,-4,2,-2,0,0,1];
			var l = diff.length;
			var oldStep = this.timeStep;
			this.timeStep++;
			for (var i=0; i < this.stock_list.length; ++i) {
				var stock = this.stock_list[i];
				var oldPrice = stock.price;
				var r = Math.random() * (l - i);
				diff_index = Math.floor(r);
				stock.price += diff[diff_index];
				diff.splice(diff_index, 1);
				var newStep = this.timeStep;
				var newPrice = stock.price;
				var h = this.canvas_zero;
				this.drawLine(oldStep*3, h-oldPrice*1, newStep*3, h-newPrice*1, stock.color);
			}
			var oldAsset = this.asset;
			this.updateAsset();
			this.updateProfit();
			var newAsset = this.asset;
			var unit = 1;
			var point = (oldAsset-600)*unit;
			if (oldAsset < newAsset) {
				var hh = (newAsset-oldAsset)*unit;
				this.context.fillStyle = '#aa0011';
				this.context.fillRect(oldStep*3,this.canvas_zero-hh-point,3,hh);
			} else if (oldAsset > newAsset) {
				var hh = (oldAsset-newAsset)*unit;
				this.context.fillStyle = '#00aa11';
				this.context.fillRect(oldStep*3,this.canvas_zero-point,3,hh);
			}
			setTimeout(this.nextStep, 5*100);
		},
		drawLine (x1,y1,x2,y2,color) {
			this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.lineWidth = 2;
			this.context.strokeStyle = color;
			this.context.stroke();
		},
		drawCircle (x,y,r) {
			this.context.fillStyle = '#FFBF00';
			this.context.arc(x, y, r, 0, 2*Math.PI, false);
			this.context.fill();
		},
		drawPlayBtn () {
			this.context.fillStyle = '#cccccc';
			this.context.fillRect(0,0,45,40);
			this.context.fillStyle = 'black';
			this.context.beginPath();
			this.context.moveTo(20, 10);
			this.context.lineTo(20, 30);
			this.context.lineTo(35, 20);
			this.context.lineTo(20, 10);
			this.context.fill();
			this.drawCircle(25, 20, 17);
		},
		drawPauseBtn () {
			this.context.fillStyle = '#cccccc';
			this.context.fillRect(0,0,45,40);
			this.context.fillStyle = 'black';
			this.context.beginPath();
			this.context.moveTo(20, 10);
			this.context.lineTo(20, 30);
			this.context.lineTo(23, 30);
			this.context.lineTo(23, 10);
			this.context.lineTo(20, 10);
			this.context.fill();
			this.context.moveTo(27, 10);
			this.context.lineTo(27, 30);
			this.context.lineTo(30, 30);
			this.context.lineTo(30, 10);
			this.context.lineTo(27, 10);
			this.context.fill();
			this.drawCircle(25, 20, 17);
		},
		updateProfit () {
			for (var index = 0; index < this.hold_list.length; ++index) {
				for (var i=0; i < this.stock_list.length; ++i) {
					if (this.hold_list[index].name === this.stock_list[i].name) {
						var p = this.stock_list[i].price;
						this.hold_list[index].profit = this.getProfit(index, p);
					}
				}
			}
		},
		updateAsset () {
			var a = this.money;
			for (var index = 0; index < this.hold_list.length; ++index) {
				for (var i=0; i < this.stock_list.length; ++i) {
					if (this.hold_list[index].name === this.stock_list[i].name) {
						var p = this.stock_list[i].price;
						a += this.hold_list[index].count * (p-this.fee);
						break;
					}
				}
			}
			this.asset = a;
			for (var i=0; i < this.stock_list.length; ++i) {
				var p = this.stock_list[i].price
				if (p <= 0) {
					this.stock_list[i].canBuy = false
					this.stock_list[i].canSell = false
					continue
				}
				if (this.money < p) {
					this.stock_list[i].canBuy = false
				} else {
					this.stock_list[i].canBuy = true
				}
				for (var index = 0; index < this.hold_list.length; ++index) {
					if (this.hold_list[index].name === this.stock_list[i].name) {
						if (0 < this.hold_list[index].count) {
							this.stock_list[i].canSell = true
						} else {
							this.stock_list[i].canSell = false
						}
					}
				}
			}
		},
		getProfit (index, p) {
			var hold = this.hold_list[index];
			return (hold.count * p) - hold.cost_sum;
		},
		getCostAvg (index) {
			var hold = this.hold_list[index];
			if (0 === hold.count) {
				return 0;
			} else {
				var cc = hold.cost_sum / hold.count;
				return cc.toFixed(2);
			}
		},
		doBuy (stock_name) {
			if ('pause' !== this.game_status) {
				return;
			}
			for (var i=0; i < this.stock_list.length; ++i) {
				if (stock_name === this.stock_list[i].name) {
					var p = this.stock_list[i].price;
					if (p <= 0) {
						return;
					}
					if (this.money < p) {
						return;
					}
					break;
				}
			}
			var index = 0;
			for (; index < this.hold_list.length; ++index) {
				if (stock_name === this.hold_list[index].name) {
					break;
				}
			}
			if (index === this.hold_list.length) {
				this.hold_list.push({});
				this.hold_list[index].name = stock_name;
				this.hold_list[index].count = 0;
				this.hold_list[index].cost_sum = 0;
				this.hold_list[index].cost_avg = 0;
				this.hold_list[index].profit = 0;
			}
			this.money -= p;
			this.hold_list[index].count += 1;
			this.hold_list[index].cost_sum += p;
			this.hold_list[index].cost_avg = this.getCostAvg(index);
			this.hold_list[index].profit = this.getProfit(index, p);
			this.updateAsset();
		},
		doSell (stock_name) {
			if ('pause' !== this.game_status) {
				return;
			}
			for (var i=0; i < this.stock_list.length; ++i) {
				if (stock_name === this.stock_list[i].name) {
					var p = this.stock_list[i].price;
					if (p <= 0) {
						return;
					}
					break;
				}
			}
			var index = 0;
			for (; index < this.hold_list.length; ++index) {
				if (stock_name === this.hold_list[index].name) {
					break;
				}
			}
			if (index === this.hold_list.length) {
				return;
			}
			if (0 === this.hold_list[index].count) {
				return;
			}
			this.money += (p-this.fee);
			this.hold_list[index].count -= 1;
			this.hold_list[index].cost_sum -= (p-this.fee);
			this.hold_list[index].cost_avg = this.getCostAvg(index);
			this.hold_list[index].profit = this.getProfit(index, p);
			this.updateAsset();
		},
	},
});
app.mount('#app');
