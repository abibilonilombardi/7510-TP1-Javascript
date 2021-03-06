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

function Mapa(){ //CAMBIAR NOMBRE  a multivalores
    this.aMap = {};
    
    this.agregar = function(clave, valor) {
      this.aMap[clave] = this.aMap[clave] || [];
      this.aMap[clave].push(valor);
      return this.aMap;
    }
    
    this.CargarMapa = function(listaClaveValor){
      var clave = 0;
      var valor = 1;
      for (i = 0; i < listaClaveValor.length ; i++){
        var tupla =listaClaveValor[i];
        this.agregar(tupla[clave], tupla[valor]);
      }
      return this.aMap;
    }
    
    // cambiar undefined por false
    this.contieneClave = function(clave){
      return this.aMap[clave];
    }
    
    // checkear si no null
    this.obtenerValores = function(clave){
      return this.aMap[clave];
    }
}


var Interpreter = function () {
  
  var mapaRules = new Mapa();
  var mapaFacts = new Mapa();
  
  this.parseDB= function(db){
    var FactParser = new Parser(db, /([a-zA-Z\s]*)\(([a-zA-Z\s,]*)\)\s*[\.|\:]?/);
    var RuleParser = new Parser(db, /([a-zA-Z\s]*)\([a-zA-Z\s,]*\)\s*\:\-([a-zA-Z,()\s]*\))\.$/);
    
    mapaFacts.CargarMapa(FactParser.parsearLista());
    mapaRules.CargarMapa(RuleParser.parsearLista());
  }
  
  var Reemplazar = function (cadena, valoresAReemplazar, valoresDeReemplazo){
    var cadenaFinal = cadena;
    for (i = 0; i < valoresDeReemplazo.length ; i++){
        cadenaFinal = cadenaFinal.replace(new RegExp(valoresAReemplazar[i], 'g'),valoresDeReemplazo[i],"g");
      }
    return cadenaFinal;
  }

  var queryArray = function(stringQuery){
    var q = new Parser(stringQuery, /([a-zA-Z]*)\(([a-zA-Z\s,]*)\)\s*[\.|\:]?/);
    var vec = q.parsearString();
    return vec;
  }
  
  var checkearFacts= function(ClaveValor){
        if (mapaFacts.obtenerValores(ClaveValor[0]).indexOf(ClaveValor[1])!= -1){
          return true;
        }else{
          return false;}
    }

  var chekearRule = function( cadenaFacts){
    var facts = cadenaFacts.match(new RegExp(/([a-zA-Z\s]*)\(([a-zA-Z\s,]*)\)/, 'g'));
    return facts.every(fact => checkearFacts(queryArray(fact)));
  }

  this.checkQuery = function (query) {
    var vec = queryArray(query);
    
    if (mapaRules.contieneClave(vec[0])){ 
      cadenaFacts =  Reemplazar(mapaRules.aMap[vec[0]][0],mapaFacts.aMap[vec[0]][0].split(/[^a-zA-Z]/),vec[1].split(/[^a-zA-Z]/));
      return chekearRule( cadenaFacts);
      
    }else{
      if (mapaFacts.contieneClave(vec[0])){
          return checkearFacts(vec);
      }else{
        return false;}}
      
    
  }
}

module.exports = Interpreter;







