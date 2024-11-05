b = [];
class Test {
  constructor(he) {
    this.a = he;
    b.push(this);
  }
  talk() {
    console.log(this.a);
  }
}

map = {
  "type": Test
}

new map.type("aaaa");

b[0].talk()






Engine.init(); //Initializes the game