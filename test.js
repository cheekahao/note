const target = {}
const proxy = new Proxy(target, {
    get(){
        return 12312
    }
})

console.log(proxy.a);
