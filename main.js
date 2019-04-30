//vars related to T-seq change
var last_position = 0;
var oldVal = "";
var carets = [
    [0, 0]
];
var tsequence = [""];

//vars related to results
var IF = 0;

//vars related to phrase
var phrasecount = 0;
var totalcount = 0;
var phraselimit = 0;
var allphrases = [];
var PresentString = "";

//vars related to log
var AllJson = [];
var ItemJson = { };
var ItemLog = "";
var typedtimes = [];
var CurrentJson;
var DefaultName = "TextTest"

//logic vars
var Started = false;

$('.ui.accordion')
  .accordion()
;

$.ajax({
    url:'phrases.txt',
    success: function (data){
    allphrases = data.split('\n');
    PresentString = allphrases[phrasecount].replace(/^\s+|\s+$/g, '');
    $('#Present').html(PresentString);
}
});

// side bar stuff and page transition
$(".ui.sidebar").sidebar()
                .sidebar('attach events','.ui.launch.button');

$(".ui.sidebar a").click(function(event){
    $("#tutorial-sec").hide();
    $("#reference-sec").hide();
    $("#main-sec").hide();
    let target = event.target;
    if (target.id == "page1")
        $("#main-sec").show();
    else if (target.id == "page2")
        $("#tutorial-sec").show();
    else
        $("#reference-sec").show();
    $(".ui.sidebar").sidebar("toggle");
})

// actions in settings
$("#upload").click(function(){
    if (!window.FileReader) {
        alert('Your browser is not supported')
    }
    var input = $("#fileInput").get(0);
    
    // Create a reader object
    var reader = new FileReader();
    if (input.files.length) {
        var textFile = input.files[0];
        reader.readAsText(textFile);
        $(reader).on('load', processFile);
    } else {
        alert('Please upload a file before continuing')
    } 
})

function processFile(e) {
    var file = e.target.result,
        results;
    if (file && file.length) {
        allphrases = file.split("\n");
        phrasecount = 0;
        PresentString = allphrases[phrasecount].replace(/^\s+|\s+$/g, '');
        $('#Present').html(PresentString);
        $('#phraseCount').html('Phrase Count ');
        clearContent();
        AllJson = [];
        ItemJson = { };
    }
}

$("#SetTotal").on('change', function(){
   if ($("#SetTotal").prop("checked")) {
       $("#numofPhrase").prop("disabled", false);
       phraselimit = Number($("#numofPhrase").val)
   } else {
       $("#numofPhrase").prop("disabled", true);
       phraselimit = 0;
   }
});

$("#numofPhrase").on("change paste keyup", function(){
    phraselimit = Number($("#numofPhrase").val())
});

$("#Shuffle").click(function(){
        shuffle(allphrases)
        phrasecount = 0;
        PresentString = allphrases[phrasecount].replace(/^\s+|\s+$/g, '');
        $('#Present').html(PresentString);
        $('#phraseCount').html('Phrase Count ');
        clearContent();
        AllJson = [];
        ItemJson = { };
})

//refresh process
function clearContent(){
    $("#Transcribe").val('');
    typedtimes = [], oldVal = "", last_position = 0;
    $("#LogDisplay").html(ItemLog);
    ItemLog = "";
}

//testing process
$("#Transcribe").bind("mouseup", function() {
    //it's too early if we detect the select instantly
    //so we set a delay to detect the actual caret pos
    window.setTimeout(function() {
        $("#Transcribe").trigger("click")
    }, 1);
})

$("#Transcribe").keypress(function(){
    var key = window.event.keyCode;
    if (key == 13){ // enter pressed
        if ($("#EnterNext").prop("checked")){
            $("#Next").click();
            return false;
        }
    }
    return true;
})

//everytime the text changes, we record the timestamp
$("#Transcribe").bind("keyup click focus input propertychange", function() {
    var currentVal = $(this).val();
    if (currentVal == oldVal) {
        return; //check to prevent multiple simultaneous triggers
    }
    typedtimes.push(Date.now());
	oldVal = currentVal;
});

//a phrase finishes, lets record the stats
$("#Next").click(function() {
    if ( !$("#Transcribe").val() ) return;
    res = getGuessResult(PresentString, $("#Transcribe").val());
    ItemLog = ("<p>Change Result: INF " + res[0] + " C " + res[1] + "</p>");
    ItemJson["Transcribe"] = $("#Transcribe").val();
    ItemJson["Trial"] = phrasecount;
    ItemJson["Present"] = PresentString;
    ItemJson["INF"] = res[0], ItemJson["C"] = res[1];
    ItemJson["UER"] = (res[0]/(res[1]+res[0])).toFixed(3);
    ItemJson["Time"] = typedtimes[typedtimes.length-1] - typedtimes[0];
    AllJson.push(JSON.parse(JSON.stringify(ItemJson)))
    ItemJson = { };
    clearContent();
    
    phrasecount += 1
    totalcount += 1
    
    if (phraselimit > 0 && totalcount >= phraselimit)
        $('#phraseCount').html('<inline style="color:red;"> Task Done!</inline>')
    
    if (phrasecount >= allphrases.length){
        phrasecount = 0;
    }
    PresentString = allphrases[phrasecount].replace(/^\s+|\s+$/g, '')
    $('#Present').html(PresentString)
    
    if ($('#phraseCount').html().startsWith('Phrase')){
        $('#phraseCount').html('Phrase Count '+totalcount)
    }
    $("#Redo").prop('disabled', false);
})

//redo current phrase
$("#Redo").click(function(){
    AllJson.pop();
    clearContent();
    phrasecount -= 1
    totalcount -= 1
    if (phrasecount < 0)
        phrasecount = allphrases.length-1
    PresentString = allphrases[phrasecount].replace(/^\s+|\s+$/g, '')
    $('#Present').html(PresentString)
    if ($('#phraseCount').html().startsWith('Phrase')){
        $('#phraseCount').html('Phrase Count '+phrasecount)
    }
    $("#Redo").prop('disabled', true);
})

function getGuessResult(p, t) {
    if ($("#IgnoreCase").prop("checked")){
        p = p.toLocaleLowerCase();
        t = t.toLocaleLowerCase();
    }
    let INF = levenshtein(p, t);
    let C = Math.max(p.length, t.length) - INF;
    return [INF, C];
//    return "Guess Result: INF " + INF_2 + " IF " + IF_2 + " C " + C_2;
}

const levenshtein = (a, b) => {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length
    let tmp, i, j, prev, val
        // swap to save some memory O(min(a,b)) instead of O(a)
    if (a.length > b.length) {
        tmp = a
        a = b
        b = tmp
    }

    row = Array(a.length + 1)
        // init the row
    for (i = 0; i <= a.length; i++) {
        row[i] = i
    }

    // fill in the rest
    for (i = 1; i <= b.length; i++) {
        prev = i
        for (j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                val = row[j - 1] // match
            } else {
                val = Math.min(row[j - 1] + 1, // substitution
                        Math.min(prev + 1, // insertion
                            row[j] + 1)) // deletion
            }
            row[j - 1] = prev
            prev = val
        }
        row[a.length] = prev
    }
    return row[a.length]
}

//following are download and format
$("#Download").click(function(){
    if (CurrentJson == null){
        alert('Please analyze first!');
        return;
    }
    var fname = DefaultName
    if ($("#Filename").val() != "")
        fname = $("#Filename").val()
    
    if ($("#Selectformat").val() == 0){ 
        download(fname+".json", JSON.stringify(CurrentJson, null, '\t'));
    } else if ($("#Selectformat").val() == 1){
        var csv = JsonToCSV(CurrentJson)
        download(fname+".csv", csv);
    } else {
        var xml = JsonToXml(CurrentJson)
        download(fname+".xml", xml)
    }
})

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

//upload JSON
$('#UploadJSON').click(function(){
    $('#inputJson').click();
});

$('#inputJson').change(function(){
    var input = $("#inputJson").get(0);
    
    // Create a reader object
    var reader = new FileReader();
    if (input.files.length) {
        var textFile = input.files[0];
        reader.readAsText(textFile);
        $(reader).on('load', function(e){
            var file = e.target.result,
                results;
            if (file && file.length) {
                    DefaultName = textFile.name.split('.')[0]
                    CurrentJson = JSON.parse(file)
                    var visRule = defVegaJson();
                    vegaEmbed('#vis', visRule)
                }
        })
    } 
})

//utils
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

//following are analyse functions
$("#Analysis").click(function(){
    if (AllJson != {}){
        DefaultName = "Log";
        CurrentJson = AllJson;
        var visRule = defVegaJson();
        vegaEmbed('#vis', visRule)
    }
})

function defVegaJson(){
    var rule = {$schema: "https://vega.github.io/schema/vega-lite/v2.json", description:"embed view", mark: "line", width: $("#LogContainer").width()*1.3, selection: {grid: {type: "interval", bind:"scales"} }}
    
    var datas = []
    var yfs = ["TER", "CER", "UER"]
    var labels = ["Total Error Rate", "Corrected Error Rate", "Uncorrected Error Rate"]
    for (var i = 0; i < CurrentJson.length; ++i){
        for (var j = 0; j < yfs.length; ++j){
            datas.push({Rate: CurrentJson[i][yfs[j]], category: labels[j], Trial: i})
        }
    }
    
    var x = {field:"Trial", type:"ordinal", axis: {labelAngle: 0}}
    var y = {field:"Rate", type:"quantitative"}
    rule["data"] = {values: datas}
    rule["encoding"] = {x:x, y:y, color:{condition: {field: "category", type: "nominal", selection:"sel"}, value: "grey"}}
    rule["selection"]["sel"] = {type: "single", fields: ["category"], bind: {input: "select", options: labels}}
    return rule
}

//transfor from Json to CSV
//new metrics
function JsonToCSV(json){
    //WPM : WORD PRE MINUTE  CPM: CORRECTION PER MINUTE   TCCPM : Total character change per minute
    //ratio
    //UER: Unfixed error rate  
    var csv = "Trial, Seconds, Tlen, Plen, INF, C, WPM, UER\n"
    for (var j = 0; j < json.length; ++j){
        let item = json[j]
        let ts = item.Transcribe
        if (ts.length == 0) continue;
        let time = item.Time / 1000
        
        let Tlen = ts.length
        
        let WPM = (Tlen-1) / (time/12)
        
        csv += [j, time, Tlen, item.Present.length, item.INF, item.C, WPM, item.UER].map(function(n){return Number(n).toFixed(2)}).join(',') + '\n'
    }
    return csv    
}
