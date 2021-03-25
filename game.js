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
					color : '#555555',
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
			],
		}
	},
	created () {
		console.log('created');
	},
	mounted () {
		console.log('mounted');
		var c = document.getElementById("myCanvas");
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
				var r = Math.random();
				if(r*2 < 1){
					stock.price += 1;
				} else {
					stock.price -= 1;
				}
				var newStep = this.timeStep;
				var newPrice = stock.price;
				this.drawLine(oldStep*2, 400-oldPrice*10, newStep*2, 400-newPrice*10, stock.color);
			}
		},
		drawLine (x1,y1,x2,y2,color) {
			this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.lineWidth = 2;
			this.context.strokeStyle = color;
			this.context.stroke();
		},
	},
});
app.mount('#app');
