(function(){
 const supported=['no','en','de','es','fr'];
 const saved=localStorage.skyPuffLang;
 if(saved&&supported.includes(saved)){
  lang=saved;
 }else{
  lang='en';
 }
})();