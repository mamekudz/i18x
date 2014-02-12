// =============================================
// I18X EXPRESSION OBJECT
// =============================================
function i18xExpression(_exp){
	this.source=_exp;
	this.execSource="";
	this.Exec=function(x){return x;};
	
	this.Parse=function(_exp){
	var func="this.Exec=function(x){var e;try{return ";
		// quick and dirty...
		if(_exp)func+=_exp.strtrs({"round":"Math.round","abs":"Math.abs","ceil":"Math.ceil","floor":"Math.floor"});
		func+="}catch(e){return e.toString();}};";
		this.execSource=func;
		eval(this.execSource);
	};
	
	this.Parse(_exp);
};

// =============================================
// I18X FORMAT OBJECT
// =============================================
function i18xFormat(_xml){
	this.name="unnamed";
	this.source=_xml;
	this.execSource="";
	this.Exec=function(_x){return _x;};
	
	
	this.Parse=function(_xml){
	var err,level=0,l,i,j,k,m,e,u,s,n,txt,splits,parts,tag,attrs,attr,doinsertvalue,noOfInlineExpressions=0;inlineExpressions={},noOfEnumereations=0,enumerations={};
	var isClosingTag,isClosedTag,definition,defstart,defattrs,deflevel=0,lastdefattrs,tagexpressionname;
	var thisreturncodeconds,statementscodes=[],returncodes=[[]],returncodeconds=[[]],vardefcodes={},vardefenums={},funcsdefcodes={},expressions={},formats={};
	var chrid,i_abs=false,i_max=0,f_max=0,i_full,f_full,r_max=0,r_full,dochrrpl,chrrpls;

		function FillArrayStr(_noOf,_chr){
		var n,ret=[];
			for(n=0;n<_noOf;n++)ret.push('"'+_chr+'"');
			return ret.join(",");
		};

		function DefTagCodes(_vardefcodeName,_code,_vardefcode,_codeadd){
		var expr;
			if(typeof(_codeadd)=="undefined")_codeadd=true;
			switch(_vardefcodeName){
				case"localdate":
					vardefcodes.localdate="d=new Date(x*1000)";
					vardefcodes[_code]=_vardefcode+"="+_code;
					_code=_vardefcode;
					break;
				case"value":
					vardefcodes.value=_vardefcode;
					break;
			};
			for(attr in attrs){
				x=attrs[attr];
				switch(attr){
					case"digits":
						break;
					case"enumeration":
						if(!enumerations[attrs[attr]]){
							noOfEnumereations++;
							enumerations[attrs[attr]]={};
							enumerations[attrs[attr]].name="e"+noOfEnumereations;
							enumerations[attrs[attr]].defs=[];
							m=attrs[attr].split("|");
							k=m.length;
							for(j=0;j<k;j++)enumerations[attrs[attr]].defs.push('"'+m[j]+'"');
						};
						vardefcodes[enumerations[attrs[attr]].name]=enumerations[attrs[attr]].name+"=["+enumerations[attrs[attr]].defs.join(",")+"]";
						_code=enumerations[attrs[attr]].name+"["+_code+"]";
						break;
					case"expression":
						if(attrs[attr].substr(0,1)=="="){
							if(!inlineExpressions[attrs[attr]]){
								expr=new i18xExpression(attrs[attr].substr(1));
								noOfInlineExpressions++;
								inlineExpressions[attrs[attr]]={};
								inlineExpressions[attrs[attr]].no=noOfInlineExpressions;
								inlineExpressions[attrs[attr]].name="_x_"+noOfInlineExpressions;
								expressions[inlineExpressions[attrs[attr]].name]=expr;
							};
							tagexpressionname=inlineExpressions[attrs[attr]].name;
							_code=inlineExpressions[attrs[attr]].name+"("+_code+")";
						}else{
							if(expressions["_local_"+attrs[attr]]==null){
								tagexpressionname=attrs[attr];
								_code=attrs[attr]+"("+_code+")";
							}else{
								tagexpressionname="_local_"+attrs[attr];
								_code="_local_"+attrs[attr]+"("+_code+")";
							};
						};
						break;
					case"format":
						if(formats["_local_"+attrs[attr]]==null){
							_code=attrs[attr]+"("+_code+")";
						}else{
							_code="_local_"+attrs[attr]+"("+_code+")";
						};
						break;
				};
			};
			if(_code!=""&&_codeadd)returncodes[level].push(_code);
		};
		
		try{
			vardefcodes.absvalue="";
			vardefcodes.value="";
			vardefcodes.valueary="";
			vardefcodes.integer="";
			vardefcodes.integervalue="";
			vardefcodes.fraction="";
			vardefcodes.fractionvalue="";
			vardefcodes.romanvalue="";
			vardefcodes.roman="";
			_xml=_xml.i18xKey();
			//console.log(_xml);
			if(_xml.indexOf("<")==-1)return _xml;
			n=("<i18x>"+_xml+"</i18x>").split("<");
			l=n.length;
			for(i=0;i<l;i++){
				e=n[i].indexOf(">");
				if(e==-1){
					if(n[i]!="")returncodes[level].push(n[i].chrrpl({'"':'/'}));
				}else{
					txt=n[i].substr(e+1);
					isClosingTag=n[i].charAt(0)=="/";
					isClosedTag=n[i].charAt(e-1)=="/";
					s=0;u=e;
					if(isClosedTag)u-=1;
					if(isClosingTag){s=1;u-=1;};
					
					// calculate tag and attributes...
					parts=n[i].substr(s,u).split('" ');
					splits=parts[0].split(" ");
					tag=splits[0];
					tagexpressionname="";
					if(splits[1]){splits.shift();parts[0]=splits.join(" ");k=parts.length-1;parts[k]=parts[k].substr(0,parts[k].length-1);if(parts[k]=="")parts.pop();}else{parts=[];};
					k=parts.length;
					attrs=new Object;
					j=0;
					while(j<k){
						if(parts[j].indexOf('="')>=0){
							attr=parts[j].split('="');
							attrs[attr[0]]=attr[1];
							j++;
						}else{
							attrs[parts[j].substr(0,parts[j].length)]=parts[j+1];
							j+=2;
						};
					};
					k=attrs.length;
					//console.log("tag=");console.log(tag);console.log("attrs=");console.log(attrs);
					// ...now tag is set and attrs contains an object with key/value pairs of attributes of tag. 
					
					if(isClosingTag){
						// ...is closing tag (</tag>).
						level--;
						returncodes[level]=(returncodeconds[level+1]=="")?returncodes[level].concat(returncodes[level+1].join("+")):returncodes[level].concat("(("+returncodeconds[level+1]+")?"+returncodes[level+1].join("+")+":'')");
						if(returncodes[level][0]=="")returncodes[level]=[];
						//console.log("isClosingTag="+returncodes[level]+" - "+returncodes[level].length+"#"+level);
					}else if(isClosedTag){
						// ...is closed tag (<tag/>).
						//console.log("isClosedTag="+returncodes[level]+"#"+level);
						doinsertvalue=true;
					}else{
						// ...is an open tag (<tag>).
						level++;
						returncodes[level]=[];
						returncodeconds[level]="";
						//console.log("isOpenTag="+returncodes[level]+"#"+level);
					};
					
					// process tag...
					if(tag=="definition"){
						// handle special tag "defintion" and nested tags of this...
						if(!isClosingTag&&!isClosedTag){
							deflevel++;
							if(deflevel==2){
								defstart=i;
								definition="";
							};
						};
						if(isClosingTag){
							deflevel--;
							if(deflevel==1){
								definition=[];
								for(j=defstart;j<i;j++)definition.push(n[j]);
								defstart=n[i].indexOf(">");
								definition="<"+definition.join("<")+"<"+n[i].substr(0,defstart+1);
							};
						};
						if(isClosedTag){
							if(deflevel==1){
								defstart=n[i].indexOf(">");
								definition="<"+n[i].substr(0,defstart+1);
							};
						};
						if(((!isClosingTag&&!isClosedTag)&&deflevel==1)||(isClosedTag&&deflevel==0)){
							defattrs=attrs;
							if(!defattrs.base)defattrs.base=10;
							if(!defattrs.ifillchr)defattrs.ifillchr="";
							if(!defattrs.ffillchr)defattrs.ffillchr="";
							if(!defattrs.rfillchr)defattrs.rfillchr="";
							if(!defattrs.digits)defattrs.digits="";
							if(!defattrs.expression)defattrs.expression="";
							if(defattrs.expression!=""){
								if(defattrs.expression.substr(0,1)=="="){
									if(!inlineExpressions[defattrs.expression]){
										noOfInlineExpressions++;
										inlineExpressions[defattrs.expression]={};
										inlineExpressions[defattrs.expression].no=noOfInlineExpressions;
										inlineExpressions[defattrs.expression].name="_x_"+noOfInlineExpressions;
										expressions[inlineExpressions[defattrs.expression].name]=new i18xExpression(defattrs.expression.substr(1));
									};
								};
							};
						};
						if(((!isClosingTag&&!isClosedTag)&&deflevel==2)||(isClosedTag&&deflevel==1))lastdefattrs=attrs;
						if(isClosingTag||isClosedTag){
							if(deflevel>0){
								//console.log("definition="+definition+" name="+lastdefattrs.name);
								switch(lastdefattrs.type){
									case"format":
										formats["_local_"+lastdefattrs.name]=new i18xFormat(definition);
										break;
									case"expression":
										expressions["_local_"+lastdefattrs.name]=new i18xExpression(lastdefattrs.expression.substr(1));
										break;
									case"directions":
										break;
								};
							}else{
								this.name=defattrs['name'];
							};
						};
						doinsertvalue=false;
					};
					if(deflevel<=1){
						switch(tag){
							case"i18x":
								break;
							case"x":
								DefTagCodes("","x","",isClosedTag);
								break;
							case"xa":
								i_abs=true;
								DefTagCodes("","xa","",isClosedTag);
								break;
							case"weekday":
								DefTagCodes("localdate","d.getDay()","weekday",isClosedTag);
								break;
							case"day":
								DefTagCodes("localdate","d.getDate()","day",isClosedTag);
								break;
							case"month":
								DefTagCodes("localdate","d.getMonth()","month",isClosedTag);
								break;
							case"year":
								DefTagCodes("localdate","d.getFullYear()","year",isClosedTag);
								break;
							case"weekofyear":
								break;
							case"dayofyear":
								break;
							case"hour":
								DefTagCodes("localdate","d.getHours()","hour",isClosedTag);
								break;
							case"minute":
								DefTagCodes("localdate","d.getMinutes()","minute",isClosedTag);
								break;
							case"second":
								DefTagCodes("localdate","d.getSeconds()","second",isClosedTag);
								break;
							case"millisecond":
								DefTagCodes("localdate","(d.getTime()-Math.round(d.getTime()*1000))");
								break;
							case"summertimeoffset":
								break;
							case"timezoneoffset":
								DefTagCodes("localdate","d.getTimezoneOffset()");
								break;
							case"timezone":
								break;
							
							case"lt":
								returncodes[level].push('"'+"<".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"gt":
								returncodes[level].push('"'+">".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"br":
								returncodes[level].push('"'+"<br/>".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"newline":
								returncodes[level].push('"'+"\\n".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"slashnewline":
								returncodes[level].push('"'+"\\\\n".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"quote":
								returncodes[level].push('"'+'\\"'.repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"singlequote":
								returncodes[level].push('"'+"'".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"space":
								returncodes[level].push('"'+" ".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"amp":
								returncodes[level].push('"'+"&".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"nbsp":
								returncodes[level].push('"'+"&nbsp;".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							case"tab":
								returncodes[level].push('"'+"\\t".repeat(attrs.repeat==null?1:attrs.repeat)+'"');
								break;
							default:
								// handle numbering tags...
								switch(tag.charAt(0)){
									case"i":
										if(tag.length==1){
											i_full=true;
											DefTagCodes("","sif[0]","");
										}else{
											chrid=tag.substr(1).parseInt(10);
											//console.log(chrid);
											i_max=Math.max(i_max,chrid+1);
											if(chrid>=0)DefTagCodes("","i["+chrid+"]");
										};
										break;
									case"f":
										if(tag.length==1){
											f_full=true;
											DefTagCodes("","sif[1]");
										}else{
											chrid=tag.substr(1).parseInt(10);
											//console.log(chrid);
											f_max=Math.max(f_max,chrid+1);
											if(chrid>=0)DefTagCodes("","f["+chrid+"]");
										};
										break;
									case"r":
										if(tag.length==1){
											r_full=true;
											DefTagCodes("","sr");
										}else{
											chrid=tag.substr(1).parseInt(10);
											//console.log(chrid);
											r_max=Math.max(r_max,chrid+1);
											if(chrid>=0)DefTagCodes("","r["+chrid+"]");
										};
										break;
								};
								break;
						};
						for(attr in attrs){
							x=attrs[attr];
							switch(attr){
								case"digits":
									break;
								case"if":
									z=x.split("|");
									thisreturncodeconds=[];
									for(a=0;a<z.length;a++){
										y=parseInt(z[a],10);
										switch(z[a].charAt(z[a].length-1)){
											case'+':
												thisreturncodeconds.push(((tagexpressionname!="")?tagexpressionname+"("+tag+")":tag)+">"+y);
												break;
											case'-':
												thisreturncodeconds.push(((tagexpressionname!="")?tagexpressionname+"("+tag+")":tag)+"<"+y);
												break;
											case'=':
												thisreturncodeconds.push(((tagexpressionname!="")?tagexpressionname+"("+tag+")":tag)+"=="+y);
												break;
											case'~':
												thisreturncodeconds.push(((tagexpressionname!="")?tagexpressionname+"("+tag+")":tag)+"!="+y);
												break;
											default:
												thisreturncodeconds.push(((tagexpressionname!="")?tagexpressionname+"("+tag+")":tag)+"=="+y);
												break;
										};
										returncodeconds[level]=thisreturncodeconds.join("||");
									};
									break;
							};
						};
						//returncodes[level]+=value+func;
						//console.log("level function: "+returncodes[level]+" / "+txt+" / "+deflevel);
						if(txt!="")returncodes[level].push('"'+txt.chrrpl({'"':'/'})+'"');
						//console.log(returncodes[level]);
					};
				};
			};
			this.execSource="this.Exec=function(x){";
			dochrrpl=defattrs.digits!="";
			chrrpls=[];
			m=defattrs.digits.split("|");
			l=m.length;
			for(i=0;i<l;i++){
				n=m[i].split("=");
				chrrpls.push('"'+n[0]+'":"'+n[1]+'"');
			};
			chrrpls="{"+chrrpls.join(",")+"}";
			if(i_abs||i_max>0||f_max>0||f_full||i_full){
				vardefcodes.absvalue='xa=Math.abs(x)';
				vardefcodes.value='sif=xa.toString('+defattrs.base+')'+(dochrrpl?'.chrrpl('+chrrpls+')':'')+'.split(".").concat("")';
			};
			if(i_max>0)vardefcodes.integer="i=sif[0].split('').reverse().concat(["+FillArrayStr(i_max,defattrs.ifillchr)+"])";
			if(f_max>0)vardefcodes.fraction="f=sif[1].split('').concat(["+FillArrayStr(f_max,defattrs.ffillchr)+"])";
			if(r_max>0||r_full)vardefcodes.romanvalue='sr=x.toRomanString()'+(dochrrpl?'.chrrpl('+chrrpls+')':'');
			if(r_max>0)vardefcodes.roman="r=sr.split('').reverse().concat(["+FillArrayStr(r_max,defattrs.rfillchr)+"])";
			//statementscodes.push('console.log(x)');
			if(defattrs.expression!=""){
				if(defattrs.expression.substr(0,1)=="="){
					this.execSource+="x="+inlineExpressions[defattrs.expression].name+"(x);";
				}else{
					this.execSource+="x="+defattrs.expression+"(x);";
				};
			};
			this.execSource+=Obj_join("var ",vardefcodes,",",";");
			this.execSource+=statementscodes.join(";")+((statementscodes.length>0)?";":"");
			for(i in formats)this.execSource+=formats[i].execSource.str_replace("this.Exec=function","function "+i);
			for(i in expressions)this.execSource+=expressions[i].execSource.str_replace("this.Exec=function","function "+i);
			this.execSource+="try{return "+returncodes[level].join("+")+";}catch(err){return err.toString()};};";
			console.log("calculated function: "+this.name+"="+this.execSource);
			eval(this.execSource);
		}catch(err){
			this.Exec=function(_x){return "Error in i18x format definition ('"+this.name+"', "+err.toString()+").";};
			//console.log("i18x Error: "+_xml+"\n"+err);
		};
	};
	
	this.Parse(_xml);
};



// =============================================
// I18X MAIN OBJECT
// =============================================
var i18x=new i18x();
function i18x(){
	this.stdlid;
	this.lid;
	this.i18xs;
	this.i18xExpressions;
	this.i18xFormats;
	this.TRANSLATE=0,NO_TRANSLATE=1,TRANSLATE_WITH_PLACEHOLDERS=2,TRANSLATE_WITH_VALUES=3,NO_TRANSLATE_WITH_PLACEHOLDERS=4,NO_TRANSLATE_WITH_VALUES=5;

	this.CreateLid=function(_lid){
		this.i18xs[_lid]=new Object();
		this.i18xExpressions[_lid]=new Object();
		this.i18xFormats[_lid]=new Object();
	};
	
	this.Reset=function(){
		this.stdlid="en-US";
		this.lid=this.stdlid;
		this.i18xs=new Object();
		this.i18xExpressions=new Object();
		this.i18xFormats=new Object();
		this.CreateLid(this.lid);
	};

	/* ExtendedScript
	this.Load=function(_folder,_lid){
	var lid=(app.locale)?app.locale:app.isoLanguage,blid,f,folder=$.fileName.dirname();
		if(typeof(_lid)!="undefined")lid=_lid;
		if(typeof(_folder)!="undefined")folder=_folder;
		blid=lid.substring(0,2);
		f=new File(_folder+"/i18x/"+lid+".json");
		this.lid=lid;
		if(!f.exists){
			f=new File(_folder+"/i18x/"+blid+".json");
			this.lid=blid;
			if(!f.exists){
				//...
			};
		};
		
		if(f.exists){
			if(typeof(this.i18xs[this.lid])=="undefined")this.i18xs[this.lid]=new Object();
			Object_addJSON(this.i18xs[this.lid],eval("({"+f.getContents()+"})"));
		};
	};
	*/

	this.BestLid=function(_wantedlid,_availablelids){
	var bestlids={"pt-PT":["es-ES","en-US"]};
	};
	
	this.UserLid=function(){
	var lid=-1;
		bl=GetParameter("lid","auto");
		if(bl=="auto")bl=GetCookie("lid","auto");
		if(bl=="auto"){
			if(IS_IE){
				bl=navigator.browserLanguage;
			}else{
				bl=navigator.language;
			};
		};
		for(l in LIDS)if(l==bl)lid=l;
		if(lid==-1)for(l in LIDS)if(bl.indexOf(l)>=0)lid=l;
		if(lid==-1)for(l in LIDS)if(l.indexOf(bl)>=0)lid=l;
		if(lid==-1)lid=Object.keys(LIDS)[0];
		return lid;
	};

	this.SetLid=function(_lid){
		this.lid=_lid;
	};
	
	this._LoadParse=function(_lid,_doClean){
	};
	
	this.LoadParse=function(_lid,_doClean){
	var txt,txts=this.i18xs[_lid],n={},t,r;
	//var a=new Date(),b;
		if(typeof(_doClean)=="undefined")_doClean=true;
		for(txt in txts){
			//console.log(_lid+"="+txt);
			t=txt.i18xKey();
			r=txts[txt].i18xKey()
			n[t]=_doClean?r:txts[txt];
			if(t.indexOf("<definition")>=0)this.Register(r,_lid);
		};
		this.i18xs[_lid]=n;
		//b=new Date();
		//console.log("i18x cleaning time: "+(b.getTime()-a.getTime()));
	};

	this._LoadLid=function(_lid,_doClean){
	var l,bl,Dated;
	var jsonajax=new XMLHttpRequest();
		if(typeof(_doClean)=="undefined")_doClean=true;

		this.CreateLid(_lid);
		
		d=new Date();
		jsonajax.open("GET","./i18x/"+_lid+".json?"+d.getTime(),false);
		jsonajax.i18x=this;
		jsonajax.lid=_lid;
		//jsonajax.callback=_callback;
		jsonajax.setRequestHeader("Content-Type","application/json");
		jsonajax.setRequestHeader("pragma","no-cache");
		jsonajax.setRequestHeader("Cache-Control","no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate, no-transform");
		jsonajax.setRequestHeader("pragma","no-cache");
		jsonajax.setRequestHeader("Expires",0);
		jsonajax.onreadystatechange=function(){
		var cjsonajax,d;
			if(this.readyState==4){
				this.i18x.CreateLid(this.lid);
				this.i18x.SetLid(this.lid);
				if(this.status==200){
					this.i18x.i18xs[this.lid]=eval('('+this.responseText+')');
					if(CLIDS[this.lid]){
						cjsonajax=new XMLHttpRequest();
						d=new Date();
						cjsonajax.open("GET",CLIDS[this.lid]+"/"+CLIENT+"/"+this.lid+".json?"+d.getTime(),false);
						cjsonajax.i18x=this.i18x;
						cjsonajax.lid=this.lid;
						cjsonajax.setRequestHeader("Content-Type","application/json");
						cjsonajax.setRequestHeader("pragma","no-cache");
						cjsonajax.setRequestHeader("Cache-Control","no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate, no-transform");
						cjsonajax.setRequestHeader("pragma","no-cache");
						cjsonajax.setRequestHeader("Expires",0);
						cjsonajax.onreadystatechange=function(){
							if(this.readyState==4){
								if(this.status==200){
									Object_addJSON(this.i18x.i18xs[this.lid],eval('('+this.responseText+')'));
								};
							};
							this.i18x.LoadParse(this.lid,_doClean);
						};
						cjsonajax.send(null);
					}else{
						this.i18x.LoadParse(this.lid,_doClean);
					};
				};
			};
		};
		jsonajax.send(null);
		return _lid;
	};

	this.LoadLid=function(_lid){
		this._LoadLid(_lid)
	};
	
	this.Register=function(_text,_lid,_nativetext){
		if(typeof(_lid)=="undefined")_lid=this.stdlid;
		if(!this.i18xs[_lid])this.CreateLid(_lid);
		if(_text.indexOf("<definition")>=0)this.Trans(_text,{},_lid);
		if(typeof(_nativetext)!="undefined")this.i18xs[_lid][_nativetext.i18xKey()]=_text.i18xKey();
		return _text.i18xKey();
	};

	this.Trans=function(_text,_placeholders,_lid,_type){
	var ret="",n,l,e,s,u,j,k,a,b,x,y,z,level=0,splits,parts,tag,doinsertvalue,value,attrs,attr,txts=[""],visibles=[true];
	var expr,frmt,txt,err,isClosingTag,isClosedTag,definition,defstart,deflevel=0,defattrs;
		if(typeof(_lid)=="undefined")_lid=this.lid;
		_text=_text.i18xKey();
		//console.log(_text);
		if(typeof(this.i18xs[_lid])=="object")if(typeof(this.i18xs[_lid][_text])=="string")_text=this.i18xs[_lid][_text];
		if(_placeholders==null)_placeholders={};
		if(_text){
			if(_text.indexOf("<")==-1)return _text;
			n=("<i18x>"+_text+"</i18x>").split("<");
			l=n.length;
			for(i=0;i<l;i++){
				doinsertvalue=false;
				e=n[i].indexOf(">");
				if(e==-1){
					// text node...
					//console.log("e==-1"+n[i]);
					txts[level]+=n[i];
				}else{
					// tag node...
					txt=n[i].substr(e+1);
					isClosingTag=n[i].charAt(0)=="/";
					isClosedTag=n[i].charAt(e-1)=="/";
					s=0;u=e;
					if(isClosedTag)u-=1;
					if(isClosingTag){s=1;u-=1;};
					
					// calculate tag and attributes...
					parts=n[i].substr(s,u).split('" ');
					splits=parts[0].split(" ");
					tag=splits[0];
					if(splits[1]){splits.shift();parts[0]=splits.join(" ");k=parts.length-1;parts[k]=parts[k].substr(0,parts[k].length-1);if(parts[k]=="")parts.pop();}else{parts=[];};
					k=parts.length;
					attrs=new Object;
					j=0;
					while(j<k){
						if(parts[j].indexOf('="')>=0){
							attr=parts[j].split('="');
							attrs[attr[0]]=attr[1];
							j++;
						}else{
							attrs[parts[j].substr(0,parts[j].length)]=parts[j+1];
							j+=2;
						};
					};
					k=attrs.length;
					//console.log("tag=");console.log(tag);console.log("attrs=");console.log(attrs);
					// ...now tag is set and attrs contains an object with key/value pairs of attributes of tag. 
							
					switch(typeof(_placeholders[tag])){
						case"undefined":
							value="";
							break;
						case"object":
							if(_placeholders[tag] instanceof Date)value=_placeholders[tag].getTime()/1000;
							break;
						default:
							value=_placeholders[tag];
					};
					if(isClosingTag){
						// ...is closing tag (</tag>).
						level--;
						txts[level]+=visibles[level+1]?txts[level+1]:"";
					}else if(isClosedTag){
						// ...is closed tag (<tag/>).
						doinsertvalue=true;
					}else{
						// ...is an open tag (<tag>).
						level++;
						txts[level]="";
						visibles[level]=true;
					};
					
					// process tag...
					switch(tag){
						case"i18x":
							break;
						case"definition":
							// collect only top level "definition"-tags (deflevel)...
							if(!isClosingTag&&!isClosedTag){
								visibles[level]=false;
								deflevel++;
								if(deflevel==1){
									defstart=i;
									definition="";
								};
							};
							if(isClosingTag){
								deflevel--;
								if(deflevel==0){
									definition=[];
									for(j=defstart;j<i;j++)definition.push(n[j]);
									defstart=n[i].indexOf(">");
									definition="<"+definition.join("<")+"<"+n[i].substr(0,defstart+1);
								};
							};
							if(isClosedTag){
								if(deflevel==0){
									defstart=n[i].indexOf(">");
									definition="<"+n[i].substr(0,defstart+1);
								};
							};
							if(((!isClosingTag&&!isClosedTag)&&deflevel==1)||(isClosedTag&&deflevel==0)){
								defattrs=attrs;
								if(!defattrs.base)defattrs.base=10;
								if(!defattrs.ifillchr)defattrs.ifillchr="";
								if(!defattrs.ffillchr)defattrs.ffillchr="";
								if(!defattrs.rfillchr)defattrs.rfillchr="";
							};
							if(isClosingTag||isClosedTag){
								if(deflevel==0){
									//console.log("definition text="+definition+" type="+defattrs['type']);
									switch(defattrs['type']){
										case"format":
											frmt=new i18xFormat(definition);
											if(this.i18xFormats[_lid]){
												if(!this.i18xFormats[_lid][frmt.name])this.i18xFormats[_lid][frmt.name]=frmt;
											}else{
												value="i18x Format Definition Error (Language not available).";
											};
											break;
										case"expression":
											expr=new i18xExpression(defattrs['expression'].substr(1));
											if(this.i18xExpressions[_lid]){
												if(!this.i18xExpressions[_lid][defattrs['name']])this.i18xExpressions[_lid][defattrs['name']]=expr;
											}else{
												value="i18x Expression Definition Error (Language not available).";
											};
											break;
										case"directions":
											break;
									};
								};
							};
							doinsertvalue=false;
							break;
						case"info":
							break;
						case"lid":
							break;
						case"app":
							// not implemented yet!
							break;
						case"lt":
							value="<";
							break;
						case"gt":
							value=">";
							break;
						case"br":
							value="<br/>";
							break;
						case"newline":
							value="\n";
							break;
						case"slashnewline":
							value="\\n";
							break;
						case"quote":
							value='"';
							break;
						case"singlequote":
							value="'";
							break;
						case"space":
							value=" ";
							break;
						case"amp":
							value="&";
							break;
						case"nbsp":
							value="&nbsp;";
							break;
						case"tab":
							value="\t";
							break;
					};
					// process attributes...
					// prefered attr orders: value,expression,if,format
					for(attr in attrs){
						//console.log("attr:"+attr+"="+attrs[attr]);
						x=attrs[attr];
						switch(attr){
							case"sense":
								break;
							case"value":
								value=x;
								break;
							case"repeat":
								value=value.repeat(x==null?1:x);
								break;
							case"default":
								if(_placeholders[tag]==null)value=x;
								break;
							case"format":
								try{
									value=this.i18xFormats[_lid][x].Exec(value);
								}catch(err){
									value="i18x format error:"+err.toString()+" ("+_lid+","+x+")\n";
								};
								break;
							case"enumeration":
								value=x.split("|")[value];
								break;
							case"charreplace":
								break;
							case"expression":
								try{
									if(x.substr(0,1)=="="){
										expr=new i18xExpression(x.substr(1,x.length-1));
										value=expr.Exec(value);
									}else{
										value=this.i18xExpressions[_lid][x].Exec(value);
										//console.log("expression eval="+x+"="+value);
									};
								}catch(err){
									value="i18x expression error:"+err.toString()+" ("+_lid+","+x+")\n";
								};
								break;
							case"if":
								v=parseInt(value);
								z=x.split("|");
								b=false;
								for(a=0;a<z.length;a++){
									y=parseInt(z[a],10);
									switch(z[a].charAt(z[a].length-1)){
										case'+':
											b|=v>y;
											break;
										case'-':
											b|=v<y;
											break;
										case'=':
											b|=v==y;
											break;
										case'~':
											b|=v!=y;
											break;
										default:
											b|=v==y;
											break;
									};
								};
								visibles[level]=b;
								break;
						};
					};
					//console.log("tag="+tag);
					//console.log("txt="+txt);
					//console.log("value="+value);
					//console.log("deflevel="+deflevel);
					txts[level]+=(doinsertvalue?value:"")+txt;
					//console.log("level="+level+":"+txts[level]);
					
				};
			};
		};
		return txts[level];
	};
	
	this.ParseText=function(_text){
	var t=new Array(),r,i,l,s;
		s=/i18x\.Trans\s*\(\"([^\"]*)\"\s*(,|\))/g;
		while(r=s.exec(_text))t.push(r[1]);
		s=/i18x\.Trans\s*\(\'([^\']*)\'\s*(,|\))/g;
		while(r=s.exec(_text))t.push(r[1]);
		s=/i18x\.Register\s*\(\"([^\"]*)\"\s*(,|\))/g;
		while(r=s.exec(_text))t.push(r[1]);
		s=/i18x\.Register\s*\(\'([^\']*)\'\s*(,|\))/g;
		while(r=s.exec(_text))t.push(r[1]);
		s=/\"([^\"]*)\"\.i18xRegister/g;
		while(r=s.exec(_text))t.push(r[1]);
		s=/\'([^\']*)\'\.i18xRegister/g;
		while(r=s.exec(_text))t.push(r[1]);
		s=/\"([^\"]*)\"\.i18xTrans/g;
		while(r=s.exec(_text))t.push(r[1]);
		s=/\'([^\']*)\'\.i18xTrans/g;
		while(r=s.exec(_text))t.push(r[1]);
		l=t.length;
		for(i=0;i<l;i++)t[i]=t[i].replace(/\\\r\n/g,"\n").replace(/\\\r/g,"\n").replace(/\\\n/g,"\n");
		for(i=0;i<l;i++)t[i]=t[i].leftAlign().trim();
		//for(i=0;i<l;i++)console.log(t[i].i18xKey());
		return t;
	};

	this.ParseFile=function(_url,_lid){
	var txt,txtajax=new XMLHttpRequest(),phrases,lx,ls,ret=new Object(),cp,d=new Date(),u=_url.split("?");
		this._LoadLid(this.stdlid,false);
		this._LoadLid(_lid,false);
		if(u.length==1)u[1]="";
		u[1]+="preventcache="+d.getTime();
		u=u.join("?");
		txtajax.open("GET",u,false);
		console.log(_url);
		txtajax.i18x=this;
		txtajax.setRequestHeader("Content-Type","text/plain");
		txtajax.setRequestHeader("pragma","no-cache");
		txtajax.setRequestHeader("Cache-Control","no-cache, no-store, must-revalidate, max-age=0, proxy-revalidate, no-transform");
		txtajax.setRequestHeader("pragma","no-cache");
		txtajax.setRequestHeader("Expires",0);
		txtajax.onreadystatechange=function(){
			if(this.readyState==4){
				if(this.status==200||this.status==0){
					txt=this.responseText;
				};
			};
		};
		txtajax.send(null);
		phrases=this.ParseText(txt);
		lx=this.i18xs[_lid];
		ls=this.i18xs[this.stdlid];
		lp=phrases.length;
		for(i=0;i<lp;i++){
			cp=phrases[i].i18xKey();
			//console.log(cp);
			if(lx[cp]!=null){
				ret[phrases[i]]=lx[cp];
			}else{
				if(_lid!=this.stdlid)ret[phrases[i]]='<info state="untranslated"/>'+"\n"+((ls[cp]==null)?phrases[i]:ls[cp]);
			};
		};
		return ret;
	};
	
	this.ParseFiles=function(_urls,_lids){
	var u,lu=_urls.length,l,ll=_lids.length,ret={};
		for(l=0;l<ll;l++){
			this._LoadLid(_lids[l]);
			ret[_lids[l]]={};
			for(u=0;u<l;u++){
				ret[_lids[l]][_urls[i]]=this.ParseFile(_urls[u],_lids[l]);
			};
		};
		return ret;
	};
	
	this.SetValues=function(_text,_placeholders){
	};
	this.ResetValues=function(_text){
	};
	
	//this.Load();
	this.Reset();
}

String.prototype.i18xTrans=function(_placeholder,_lid){
	return i18x.Trans(this.valueOf(),_placeholder,_lid);
}
String.prototype.i18xRegister=function(_lid,_nativetext){
	return i18x.Register(this.valueOf(),_lid,_nativetext);
}
Number.prototype.format=function(_format,_lid){
	if(!_lid)_lid=i18x.lid;
	try{return i18x.i18xFormats[_lid][_format].Exec(this.valueOf());}catch(e){return "i18x format error :"+this.toString();};
}
Date.prototype.format=function(_format,_lid){
var e;
	if(!_lid)_lid=i18x.lid;
	try{return i18x.i18xFormats[_lid][_format].Exec(this.getTime()/1000);}catch(e){return "i18x format error :"+this.toString();};
}
function Obj_join(_pre,_obj,_joinchr,_post){
var o,r="";
	for(o in _obj)if(_obj[o]!="")r+=((r=="")?"":_joinchr)+_obj[o];
	if(r!="")r=_pre+r+_post;
	return r;
}

