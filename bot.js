var ical = require('node-ical');
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require('./config.json');
const schedule = require('node-schedule');

client.login(config.token);
var donnee;
getCours()
client.on('ready', () => {
    console.log("Je suis connecté !"); 
     var j = schedule.scheduleJob("0 * * * *", () => {
        getCours()
     });
 });



 client.on('message',msg =>{
    if(msg.content == ';help' ){
        msg.channel.send("envoie ;G1 / ;G2/ ;G3");
    }
    if(msg.content == ';G1' ){
        const embed = envoieDonnee("G1")
        msg.channel.send({embed})
    }
    if(msg.content == ';G2' ){
        const embed = envoieDonnee("G2")
        msg.channel.send({embed})
    }
    if(msg.content == ';G3' ){
        const embed = envoieDonnee("G3")
        msg.channel.send({embed})
    }
 })

 0x00AE86
 function envoieDonnee(groupe){
     c1 = donnee[groupe]
     c2 = donnee[groupe+"2"]
     return new Discord.RichEmbed()
     .setTitle(`Deux prochains cours du ${groupe}`)
     .setColor(couleur(groupe))
     .addField("Cours suivant", `${c1}`, true)
     .addBlankField(true)
     .addField("Cours qui suivra", `${c2}`, true)
 }


function couleur(groupe){
    if(groupe == "G1")return 0xFFFFFF
    else if(groupe == "G2")return 0xFFFF1A
    return 0x0000FF
}


function getCours(){
ical.fromURL('http://ade6-ujf-ro.grenet.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=9724,9723,7967&projectId=7&calType=ical&firstDate=2018-09-24&lastDate=2019-05-31', {}, function(err, data) {
    cours = []
    for (var k in data){
        cours.push(data[k])
    }
    traiteCours(cours)
});
}
function traiteCours(cours){
    sortie = {
        "G1":"",
        "G2":"",
        "G3":"",
        "G12":"",
        "G22":"",
        "G32":""
    }
    cours =tri(cours)
    var date = new Date()
    
    cours.forEach(element => {
        //console.log(element/*.summary.substr(element.summary.length-2,2)*/)
        if( (sortie["G1"] == "" || sortie["G2"] == "" ||sortie["G3"] == "" ) && (element.start >= date || (element.start <= date && element.end >= date))){
            if(sortie["G1"] == "" && element.summary.substr(element.summary.length-2,2) == "G1"){
                sortie["G1"] = formate(element)
            }
            else if(sortie["G2"] == "" && element.summary.substr(element.summary.length-2,2) == "G2"){
                sortie["G2"] = formate(element)
            }
            else if(sortie["G3"] == "" && element.summary.substr(element.summary.length-2,2) == "G3"){
                sortie["G3"] = formate(element)
            }
            else{
                if(sortie["G1"] == "") sortie["G1"] = formate(element)
                if(sortie["G2"] == "") sortie["G2"] = formate(element)
                if(sortie["G3"] == "") sortie["G3"] = formate(element)
            }
        }
        else{
        if(sortie["G1"] != "" && sortie["G12"] == "" && element.summary.substr(element.summary.length-2,2) != "G2" && element.summary.substr(element.summary.length-2,2) != "G3"){
            sortie["G12"] = formate(element)
        }
        if(sortie["G2"] != "" && sortie["G22"] == "" && element.summary.substr(element.summary.length-2,2) != "G1" && element.summary.substr(element.summary.length-2,2) != "G3"){
            sortie["G22"] = formate(element)
        }
        if(sortie["G3"] != "" && sortie["G32"] == "" && element.summary.substr(element.summary.length-2,2) != "G2" && element.summary.substr(element.summary.length-2,2) != "G1"){
            sortie["G32"] = formate(element)
        }
    }
    });
    donnee = sortie;
    //console.log(donnee)
}

function formate(e){
    time = e.start
    time = new Date(time.setHours(time.getHours()+2))
    temps = time.toString().substr(0,21)
    return e.summary+"\n"+temps+"\n"+e.location
}

function tri(cours){
    for(let i = 0; i <cours.length;i++){
        for(let j = i;j <cours.length;j++){
            if(cours[j].start < cours[i].start){
                temp = cours[j]
                cours[j] = cours[i]
                cours[i] = temp
            }
        }
    }
    return cours
}