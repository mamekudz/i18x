function SetCookie(_name,_value,_defaultvalue,_expminutes,_nonapp){
var today=new Date(),d=new Date(),cd=""; //+document.location.hostname;
	if(navigator.cookieEnabled){
		ClearCookie(_name);
		if(_defaultvalue!=_value){
			if(_expminutes){
				d.setTime(today.getTime()+_expminutes*1000*60);
				document.cookie=((_nonapp)?"":APPID+"_")+_name+"="+escape(_value)+";expires="+d.toGMTString()+((cd=="")?"":(";domain="+cd))+';';
			}else if(_expminutes==-1){
				document.cookie=((_nonapp)?"":APPID+"_")+_name+"="+escape(_value)+((cd=="")?"":(";domain="+cd))+';';
			}else{
				d.setTime(today.getTime()+2*365*24*60*60*1000);
				document.cookie=((_nonapp)?"":APPID+"_")+_name+"="+escape(_value)+";expires="+d.toGMTString()+((cd=="")?"":(";domain="+cd))+';';
			}
		}
	}
}

function ClearCookie(_name,_nonapp){
var cd=""; //+document.location.hostname;
	if(navigator.cookieEnabled)document.cookie=((_nonapp)?"":APPID+"_")+_name+"=;expires=Fri, 31 Dec 1999 23:59:59 GMT"+((cd=="")?"":(";domain="+cd))+';';
}

function GetCookie(_name,_defaultvalue,_nonapp){
if(typeof(_defaultvalue)=="undefined")_defaultvalue="";
var aCookie=document.cookie.split(";"),i,aCrumb,ret=_defaultvalue;
	if(navigator.cookieEnabled){
		for(i=0;i<aCookie.length;i++){
			aCrumb=aCookie[i].split("=");
			if(aCrumb[0].indexOf(((_nonapp)?"":APPID+"_")+_name)>=0)ret=unescape(aCrumb[1]);
		}
	}
	return ret;
}

function GetParameter(_name,_def){
_name=_name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
var regexS="[\\?&]"+_name+"=([^&#]*)";  
var regex=new RegExp(regexS);  
var results=regex.exec(window.location.href); 
	if(results==null)return _def;  
	return unescape(results[1]);
}
function GetParameterExists(_name){
_name=_name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
var regexS="[\\?&]"+_name+"=([^&#]*)";  
var regex=new RegExp(regexS);  
var results=regex.exec( window.location.href ); 
 return results!=null;  
}

if(!String.prototype.htmlEntities)String.prototype.htmlEntities=function() {
var s=this.valueOf();
	return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/\n/g,'<br/>');
}
if(!String.prototype.strtrs)String.prototype.strtrs=function(_r){
var i,s=this.valueOf();
	for(i in _r)s=s.split(i).join(_r[i]);
	return s;
}
if(!String.prototype.chrrpl)String.prototype.chrrpl=function(_chrsobj){
var i,ret="",s=this.valueOf(),l=s.length;
	for(i=0;i<l;i++)ret+=_chrsobj[s.charAt(i)]?_chrsobj[s.charAt(i)]:s.charAt(i);
	return ret;
}
if(!String.prototype.parseInt)String.prototype.parseInt=function(_base){
  return parseInt(this.valueOf(),(!_base)?10:_base);
}
if(!String.prototype.i18xClean)String.prototype.i18xKey=function(){
	return this.replace(/(\t|\n+)/g,"").replace(/(\s+)/g," ");
};
if(!String.prototype.str_replace)String.prototype.str_replace=function(_s,_r){
	return this.valueOf().split(_s).join(_r);
}

if(!Number.prototype.toRomanString)Number.prototype.toRomanString=function(){
var i=3,n=Math.abs(this.valueOf()),ret="";
	if(!+n)return false;
	var	digits=String(+n).split(""),key=["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM","","X","XX","XXX","XL","L","LX","LXX","LXXX","XC","","I","II","III","IV","V","VI","VII","VIII","IX"];
	while(i--)ret=(key[+digits.pop()+(i*10)]||"")+ret;
	return Array(+digits.join("")+1).join("M")+ret;
}



if(!String.prototype.codelist)String.prototype.codelist=function(){
var ret="",i,l=this.length;
	for(i=0;i<l;i++)ret+=this.charCodeAt(i).toString(16)+",";
	alert(ret);
	return 	ret;
};

if(!String.prototype.trim)String.prototype.trim=function(){
	// Use a regular expression to replace leading and trailing 
	// spaces with the empty string
	return this.replace(/(^\s*)|(\s*$)/g,"");
}

if(!String.prototype.noOfCharsAt)String.prototype.noOfCharsAt=function(_start,_char){
var ret=0,l=this.length,l;
	if(typeof(_start)=="undefined")_start=0;
	if(typeof(_char)=="undefined")_char=this.charAt(_start);
	if(_start>=l)return 0;
	for(i=_start;i<l;i++){
		if(this.charAt(i)==_char){
			ret++;
		}else{
			return ret;
		};
	};
};

if(!String.prototype.leftAlign)String.prototype.leftAlign=function(){
var lines=this.split("\n"),minTab=999999,i,l=lines.length;
	if(l==1)if(this.charAt(0)!="\t")return this.valueOf();
	for(i=0;i<l;i++){
		m=lines[i].noOfCharsAt(0,"\t");
		if(m==0)return this.valueOf();
		if(m<minTab)minTab=m;
	};
	for(i=0;i<l;i++)lines[i]=lines[i].substr(minTab);
	return lines.join("\n");
};

if(!String.prototype.repeat)String.prototype.repeat=function(_n){
var i,v=this.valueOf(),ret="";
	for(i=0;i<_n;i++)ret+=v;
	return ret;
}
