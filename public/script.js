/**
 * @source=https://github.com/vuejsdevelopers/vuejs-poster-shop
 */

console.log('It works.');
var PRICE = 9.99;
var LOADNUM = 10;
new Vue({
    el:'#app',
    data:{
        total:0,
        items:[],
        cart:[],
        newSearch:'90s',
        lastSearch:'',
        loading:false,
        price:PRICE,
        results: [],


    },
    methods:{
        addItem: function(index){
            this.total += PRICE;

            var item = this.items[index];
            var found = false;

            for(var i = 0; i<this.cart.length; i++){
                if(this.cart[i].id === item.id){
                    this.cart[i].qty++;
                    found = true;
                    break;
                }

            }
            if(!found){

                this.cart.push({
                    id:item.id,
                    title: item.title,
                    qty: 1,
                    price:PRICE
                });
            }

        },
        inc: function(item){
            item.qty++;
            this.total += PRICE;
        },
        dec: function(item){
            item.qty--;
            this.total -= PRICE;

            if(item.qty <= 0){
                for(var i = 0; i<this.cart.length; i++){
                    if(this.cart[i].id === item.id){

                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        },

        onSubmit:function(){
            if(this.newSearch.length){
                this.items = [];
                this.loading = true;
                this.$http
                    .get('/search/'.concat(this.newSearch))
                    .then(function(res){
                        this.lastSearch = this.newSearch;
                        this.results =res.body;
                        this.appendItems();
                        this.loading = false;
                    });
                console.log(this.newSearch);
            }

        },
        appendItems: function(){
            console.log('appending more items');
            if(this.items.length < this.results.length){
                var append = this.results.slice(this.items.length, this.items.length + LOADNUM);
                this.items = this.items.concat(append);
            }
        }
    },
    computed:{
        noMoreItems:function(){
            this.items.length === this.results.length && this.results.length > 0
        },
    },
    filters:{
        currency: function(price){
            return '$'.concat(price.toFixed(2));
        }
    },
    mounted:function(){

        this.onSubmit();
        var vueInstance= this;

        var elem = document.getElementById('product-list-bottom');
        var watcher = scrollMonitor.create(elem);
        watcher.enterViewport(function(){
            console.log('scrolled to bottom');
            vueInstance.appendItems();
        });
    }
});
