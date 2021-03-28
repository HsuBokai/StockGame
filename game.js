const { createApp, ref } = Vue;
const app = createApp({
	data() {
		return {
			context: null,
			timeStep: 0,
			stock_list : [
				{
					name : 'TSMC',
					price : 55,
					color : '#777777',
				},
				{
					name : 'HTC',
					price : 50,
					color : '#5555ff',
				},
				{
					name : 'MTK',
					price : 45,
					color : '#55cc55',
				},
				{
					name : 'AAPL',
					price : 40,
					color : '#cc5555',
				},
				{
					name : 'GOOG',
					price : 35,
					color : '#aaaa55',
				},
				{
					name : 'FB',
					price : 30,
					color : '#cc55cc',
				},
				{
					name : 'AMZN',
					price : 25,
					color : '#55cccc',
				},
				{
					name : 'NFLX',
					price : 20,
					color : '#aaaaaa',
				},
				{
					name : 'TSLA',
					price : 15,
					color : 'yellow',
				},
			],
			hold_list : [],
			money: 300,
			asset: 300,
			fee: 0,
			canvas_width: 600,
			canvas_height: 400,
			game_status : 'init',
		}
	},
	created () {
		console.log('created');
	},
	mounted () {
		console.log('mounted');
		var c = document.getElementById("myCanvas");
		c.width = this.canvas_width;
		c.height = this.canvas_height;
		this.context = c.getContext('2d');
	},
	unmounted () {
		console.log('unmounted');
	},
	methods: {
		nextStep () {
			var diff = [3,-3,2,-2,1,-1,0,0,1];
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
				var h = this.canvas_height;
				this.drawLine(oldStep*3, h-oldPrice*3, newStep*3, h-newPrice*3, stock.color);
			}
			this.updateAsset();
			this.updateProfit();
			if (this.timeStep < 100) setTimeout(this.nextStep, 1*1000);
		},
		drawLine (x1,y1,x2,y2,color) {
			this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.lineWidth = 2;
			this.context.strokeStyle = color;
			this.context.stroke();
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
				return hold.cost_sum / hold.count;
			}
		},
		doBuy (stock_name) {
			for (var i=0; i < this.stock_list.length; ++i) {
				if (stock_name === this.stock_list[i].name) {
					var p = this.stock_list[i].price;
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
			for (var i=0; i < this.stock_list.length; ++i) {
				if (stock_name === this.stock_list[i].name) {
					var p = this.stock_list[i].price;
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
