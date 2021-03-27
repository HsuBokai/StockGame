const { createApp, ref } = Vue;
const app = createApp({
	data() {
		return {
			context: null,
			timeStep: 0,
			money: 100,
			stock_list : [
				{
					name : 'TSMC',
					price : 10,
					color : '#777777',
				},
				{
					name : 'HTC',
					price : 10,
					color : '#5555ff',
				},
				{
					name : 'MTK',
					price : 10,
					color : '#55cc55',
				},
				{
					name : 'AAPL',
					price : 10,
					color : '#cc5555',
				},
				{
					name : 'GOOG',
					price : 10,
					color : '#aaaa55',
				},
				{
					name : 'FB',
					price : 10,
					color : '#cc55cc',
				},
				{
					name : 'AMZN',
					price : 10,
					color : '#55cccc',
				},
			],
			hold_list : [],
			asset: 100,
		}
	},
	created () {
		console.log('created');
	},
	mounted () {
		console.log('mounted');
		var c = document.getElementById("myCanvas");
		c.width = 1000;
		c.height = 400;
		this.context = c.getContext('2d');
	},
	unmounted () {
		console.log('unmounted');
	},
	methods: {
		nextStep () {
			var oldStep = this.timeStep;
			this.timeStep++;
			for (var i=0; i < this.stock_list.length; ++i) {
				var stock = this.stock_list[i];
				var oldPrice = stock.price;
				var r = Math.random() * 7;
				if(r < 1){
					stock.price += 3;
				} else if(r < 2){
					stock.price += 2;
				} else if(r < 3){
					stock.price += 1;
				} else if(r < 4){
					stock.price += 1;
				} else if(r < 5){
					stock.price -= 1;
				} else if(r < 6){
					stock.price -= 2;
				} else {
					stock.price -= 3;
				}
				var newStep = this.timeStep;
				var newPrice = stock.price;
				this.drawLine(oldStep*2, 400-oldPrice*10, newStep*2, 400-newPrice*10, stock.color);
			}
			this.updateAsset();
			this.updateProfit();
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
						a += this.hold_list[index].count * (p-1);
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
			this.money += (p-1);
			this.hold_list[index].count -= 1;
			this.hold_list[index].cost_sum -= (p-1);
			this.hold_list[index].cost_avg = this.getCostAvg(index);
			this.hold_list[index].profit = this.getProfit(index, p);
			this.updateAsset();
		},
	},
});
app.mount('#app');
