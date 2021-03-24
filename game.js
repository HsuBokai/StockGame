const { createApp, ref } = Vue;
const app = createApp({
	data() {
		return {
			context: null,
			timeStep: 0,
			price: 10,
			stock_buy_price: {
				A : 10,
				K : 11,
				Q : 12
			},
			stock_sell_price: {
				A : 3,
				K : 4,
				Q : 5
			}
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
			for (var i=0; i<1; i++) {
				var oldPrice = this.price;
				var r = Math.random();
				if(r*2 < 1){
					this.price += 1;
				} else {
					this.price -= 1;
				}
				var newStep = this.timeStep;
				var newPrice = this.price;
				this.drawLine(oldStep*2, 400-oldPrice*10, newStep*2, 400-newPrice*10);
			}
		},
		drawLine (x1,y1,x2,y2) {
			console.log(x1,y1);
			this.context.beginPath();
			this.context.moveTo(x1, y1);
			this.context.lineTo(x2, y2);
			this.context.strokeStyle = 'red';
			this.context.stroke();
		},
	},
});
app.mount('#app');
