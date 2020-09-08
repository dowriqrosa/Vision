dadosIdent();

async function dadosIdent(){
  var ident = 'Localização da imagem';
  var dadosIdent = await dadosIndentidade(ident);
  console.log(dadosIdent);
}

function dadosIndentidade(ident){
  const fileName = ident;
  var fNome;
  var fPai;
  var fMae;
  var fDataNascimento;
  var fDataExpedicao;
  var fRG;
  var fCPF;
  var fNaturalidade;
  var fDocOrigem;
  var final = 0;
  
  function verificarSeTemTodosOsDados(){
    if(fNome != null && fPai != null && fMae != null && fDataNascimento != null && fDataExpedicao != null && fRG != null && fCPF != null && fNaturalidade != null && fDocOrigem != null){
      return fNome+"\n"+fPai+"\n"+fMae+"\n"+fDataNascimento+"\n"+fDataExpedicao+"\n"+fRG+"\n"+fCPF+"\n"+fNaturalidade+"\n"+fDocOrigem;
    } else{
      return "Não é uma indentidade";
    }
    
  }

  async function dados() {
    
    const vision = require('@google-cloud/vision');

    // Creates a client
    const client = new vision.ImageAnnotatorClient({
      keyFilename: 'Arquivo vision json'
    });
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;
    var cont = 0;
    var contOfData = 0;
    
    detections.forEach(text => retirarDados(text.description));

    function retirarDados(text){ 
      
      if(cont == 0){
        var arrayOfStrings = text.split("\n");
        nomes(arrayOfStrings);
        for(var i = 0; i <= arrayOfStrings.length; i++){
          if(i > 13 && naturalidade(arrayOfStrings[i])){

          }else if (CPFRG(arrayOfStrings[i])){
            
          }else if(data(arrayOfStrings[i], contOfData)){
            contOfData++;
          }else if(docOrigem(arrayOfStrings[i])){
            fDocOrigem = arrayOfStrings[i]+"\n"+arrayOfStrings[i+1];
          }
        }
      }
      cont++;
    }
    
    return verificarSeTemTodosOsDados();
  }


  function docOrigem(text){
    try {
      var doc = text.split(".");
      if(doc[0] === "C" ||doc[0] === "c"){
        return true;
      }  
    } catch (error) {
      
    }
    return false;
  }

  function naturalidade(text){
    try {
      var estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
      var nome = text.split(" ");
      for(var i = 0; i < estados.length; i++){
        if(nome[nome.length-1] == estados[i]){
          fNaturalidade = nome[nome.length-2]+" "+nome[nome.length-1];
          return true;
        }
      }
    } catch (error) {
      
    }
    return false;
  }

  function nomes(text){
    var indice = -1;
    //laço primario das linhas
    var contFiliacao = 0;
    for(var i = 8; i < text.length; i++){
      try {
        var nome = text[i].split(" ");
        if(contFiliacao >1) return 0;
        if(nome.length >= 3){
          //laço das palavras de cada linha
          for(var j = 1; j < nome.length; j++){
            if(nome[j] === "DE" || nome[j] === "DA" || nome[j] === "DOS"){

            }else{
              //laços das linhas seguintes
              for(var x = i+1; x <= 24; x++ ){
                var palavra = text[x].split(" ");
                if(contFiliacao >1) return 0;
                if(palavra.length >= 2){
                  //laço das palavras de cada linha
                  for(var z = 1; z < palavra.length; z++){
                    if(palavra[z] === "DE" || palavra[z] === "DA"){

                    }else {
                      if(nome[j] === palavra[z] && indice != x ){
                        if(contFiliacao == 0){
                          fNome = text[i];
                          fMae = text[x];
                          indice = x;
                          nomeIndice = x;
                        }else{
                          fPai = text[x];
                        }
                        contFiliacao++;
                        z = palavra.length;
                      }
                    }
                  }                
                }
              }
            }
          }
        }
      } catch (error) {
        
      }
    }
  }


  function data(text, cont){
    if(cont<1){
      try {
        var pontos = text.split("-");
        if(pontos.length == 3){
          fDataExpedicao = retirarData(text);
          return true;
        }
        var pontos = text.split("/");
        if(pontos.length == 3){
          fDataExpedicao = retirarData(text);
          return true;
        }
      } catch (error) {
      }
      return false;
    }else if(cont<2){
      try {
        var pontos = text.split("-");
        if(pontos.length == 3){
          fDataNascimento = retirarData(text);
          return true;
        }
        /*var pontos = text.split("/");
        if(pontos.length == 3){
          console.log("Data de nascimento:");
          console.log(text);
          return true;
        }*/
      } catch (error) {
      }
      return false;
    }else{
      return false;
    }
    
  }

  function retirarData(text){
    var data = text.split(" ");
    if(data.length != 1){
      return data[data.length-1];
    }else{
      return text;
    }
  }

  function CPFRG(text){
    try {
      var pontos = text.split(".");
      if(pontos.length == 3){
        var hifen = pontos[2].split("-");
        if(hifen.length == 2 ){
          validarcpf = pontos[0] + pontos[1] + hifen[0] + hifen[1];
          if(TestaCPF(validarcpf)){
            fCPF = text;
            return true;
          }else{
            fRG = text;
            return true;
          }
        }
      }
    } catch (error) {
      
    }
    return false;
  }


  function TestaCPF(strCPF) {
    var Soma;
    var Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;
    
    for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;
  
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
  
    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;
  
    if ((Resto == 10) || (Resto == 11))  Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
  }
  
  return new Promise(resolve => {
    setTimeout(() => {
      resolve (dados());
    }, 20000);
  });
}