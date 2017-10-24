// var Interpreter = function () {

//     this.parseDB = function (params, paramss, paramsss) {

//     }

//     this.checkQuery = function (params) {
//         return true;
//     }

// }

// module.exports = Interpreter;


db = [
        "varon(juan).",
        "varon(pepe).",
        "varon(hector).",
        "varon(roberto).",
        "varon(alejandro).",
        "mujer(maria).",
        "mujer(cecilia).",
        "padre(juan, pepe).",
        "padre(juan, pepa).",
        "padre(hector, maria).",
        "padre(roberto, alejandro).",
        "padre(roberto, cecilia).",
        "hijo(X, Y) :- varon(X), padre(Y, X).",
        "hija(X, Y) :- mujer(X), padre(Y, X)."
    ];
    
// console.log("hija(X, Y) :- mujer(X), padre(Y, X).".match(/([a-zA-Z\s]*)\(([a-zA-Z\s,]*)\)\s*/) )
// console.log("hija(X, Y) :- mujer(X), padre(Y, X).".match(/([a-zA-Z\s]*)\(([a-zA-Z\s,]*)\)\s*[\.|\:]?/g));
// console.log("hija(X, Y) :- mujer(X), padre(Y, X).".split(/([a-zA-Z\s\(\)\,*][\.|\:]?/));

function Parser(bdd,regex){
  
  var matchea = function(valor){
    return regex.test(valor);
  }
  
  var obtenerGrupos = function(valor){
      var grupos = valor.match(regex);
      return [grupos[1],grupos[2]];
    
  }
  
  this.parsearString = function(){
    if (matchea(bdd)){
      return obtenerGrupos(bdd)
    }
    else{ return null}
  }
  
  this.parsearLista = function(){
    return bdd.filter(matchea).map(obtenerGrupos);
  }
  
}

var f = new Parser(db, /([a-zA-Z\s]*)\(([a-zA-Z\s,]*)\)\s*[\.|\:]?/);
// console.log(f.parsearLista());

var r = new Parser(db, /([a-zA-Z\s]*)\([a-zA-Z\s,]*\)\s*\:\-([a-zA-Z,()\s]*\))\.$/);
// console.log(r.parsearLista());

function Mapa(listaClaveValor){
    var aMap = {};
    var agregar = function(key, value) {
      aMap[key] = aMap[key] || [];
      aMap[key].push(value);
    }
    for (i = 0; i < listaClaveValor.length ; i++){
      var par =listaClaveValor[i];
      agregar(par[0],par[1]);
    }
    return aMap;
}


var aRule = Mapa(r.parsearLista());
var bFact = Mapa(f.parsearLista());
console.log(aRule);
console.log(bFact);

function Reemplazar(cadena, valoresAReemplazar, valoresDeReemplazo){
  var cadenaFinal = cadena;
  console.log(cadena);
  for (i = 0; i < valoresDeReemplazo.length ; i++){
      // console.log(valoresAReemplazar[i],valoresDeReemplazo[i]);
      cadenaFinal = cadenaFinal.replace(new RegExp(valoresAReemplazar[i], 'g'),valoresDeReemplazo[i],"g");
      console.log(cadenaFinal)
    }
  return cadenaFinal;
}

var Interpreter = function () {

  this.queryArray = function(stringQuery){
    var q = new Parser(stringQuery, /([a-zA-Z]*)\(([a-zA-Z\s,]*)\)\s*[\.|\:]?/);
    var vec = q.parsearString();
    // console.log(vec);
    return vec;
  }
  
  this.checkearFacts= function(ClaveValor){
      console.log(ClaveValor);
        if (bFact[ClaveValor[0]].indexOf(ClaveValor[1])!= -1){
          console.log("lo contiene");
          return true;
        }else{
          console.log("NO lo contiene");
          return false;}
    }
    
    
    this.chekearRule = function( cadenaFacts){
      var facts = cadenaFacts.match(new RegExp(/([a-zA-Z\s]*)\(([a-zA-Z\s,]*)\)/, 'g'));
      return facts.every(fact => checkearFacts(queryArray(fact)));
    }
  
  this.checkQuery = function (query) {
    var vec = queryArray(query);
    
    
    if (aRule[vec[0]]){
      console.log("es rule");
      cadenaFacts =  Reemplazar(aRule[vec[0]][0],bFact[vec[0]][0].split(/[^a-zA-Z]/),vec[1].split(/[^a-zA-Z]/));
      return chekearRule( cadenaFacts);
      
    }else{
      if (bFact[vec[0]]){
          console.log("es fact");
          return checkearFacts(vec);
      }else{
        console.log("NO ES NINGUNA");
        return false;}}
      
    
  }
  // return checkQuery("hijo(pepe, juan)");
  return checkQuery('hijo(pepe, juan)');
}

Interpreter()
