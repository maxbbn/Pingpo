KISSY.add('Vector',function(S){
	S.Vector = {
		exec : function(a,b,fn){
			var i, l, c = [];
			for(i = 0, l = a.length; i<l; i++){
				c.push(fn(a[i],b[i]));
			}
			return c;
		},
		execN : function (a,n,fn) {
			var i, l, c = [];
			for(i = 0, l = a.length; i<l; i++){
				c.push(fn(a[i],n));
			}
			return c;
		},
		add : function (a,b) {
			var self = this;
			return self.exec(a,b,function(itema,itemb){
				return itema + itemb;
			});
		},
		addN : function(a,n){
			var self = this;
			return self.execN(a,n,function(item,c){
				return item + c;
			});
		},
		multiply : function(a,c){
			var self = this;
			return self.exec(a,c,function(itema,itemb){
				return itema * itemb;
			});
		},
		multiplyN : function(a,c){
			var self = this;
			return self.execN(a,c,function(item,c){
				return item * c;
			});
		},
		divN : function(){
			var self = this;
			return self.execN(a,c,function(item,c){
				return item / c;
			});
		},
		range : function(a,left,right){
			var i, l, c = [];
			for(i = 0, l = a.length; i<l; i++){
				if( a[i] < left[i] ){
					c[i] = -1;
				}else if (a[i] > right[i]){
					c[i] = 1;
				}else{
					c[i] = 0;
				}
			}
			return c;
		}
	}
});
