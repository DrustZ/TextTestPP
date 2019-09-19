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
var Allphrases = [];
var allphrases = [];
var PresentString = "";

//vars related to log
var AllJson = [];
var ItemJson = { Transcribe: [], Action: [] };
var ItemLog = "";
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
    Allphrases = allphrases;    
//    shuffle(allphrases);
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

//process the upload phrase file
function processFile(e) {
    var file = e.target.result,
        results;
    if (file && file.length) {
        allphrases = file.split("\n");
        Allphrases = allphrases;
//        shuffle(allphrases);
        phrasecount = 0;
        PresentString = allphrases[phrasecount].replace(/^\s+|\s+$/g, '');
        $('#Present').html(PresentString);
        $('#phraseCount').html('Phrase Count ');
        clearContent();
        AllJson = [];
        ItemJson = { Transcribe: [], Action: [] };
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

//shuffle the phrases
$("#Shuffle").click(function(){
        shuffle(allphrases)
        phrasecount = 0;
        PresentString = allphrases[phrasecount].replace(/^\s+|\s+$/g, '');
        $('#Present').html(PresentString);
        $('#phraseCount').html('Phrase Count ');
        clearContent();
        AllJson = [];
        ItemJson = { Transcribe: [], Action: [] };
})

//refresh process
function clearContent(){
    $("#Transcribe").val('');
    IF = 0, tsequence = [""], carets = [
        [0, 0]
    ], oldVal = "", last_position = 0;
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

//whenever there's a change happens in the transcribed string (e.g. an Action happens)
//this function is triggered
$("#Transcribe").bind("keyup click focus input propertychange", function() {
    getCursorPosition(this);
    var currentVal = $(this).val();
    if (currentVal == oldVal) {
        return; //check to prevent multiple simultaneous triggers
    }
    
    ItemJson["Transcribe"].push({Text: currentVal, TimeStamp: Date.now()})
    
    var res = guessChangeInfo(oldVal, currentVal);
    var log = '<p><span class="yellow">' + oldVal + ' -> ' + currentVal + '</span></p>';
    log += compareNlog(res, oldVal, currentVal);
    ItemJson["Action"].push(res)
    
	if (res[0] == 'delete' || res[0] == 'replace'){
        strs = getIFc(oldVal, PresentString, res[1], res[2])
    	log += ('<p>T   : <span class="purple">'+strs[0]+'</span></p><p>P   : <span class="purple">'+strs[2]+'</span></p><p>Same: '+strs[1]+'</p>');
        
        log += '<p>Removed but correct: '+ strs[3] + ' (IFc: ' + strs[3].length + ')</p>';
    }
    
	oldVal = currentVal;
    tsequence.push(currentVal);
    ItemLog += (log + "<br/>");
    $('#LogDisplay').html(ItemLog);
    $('#LogDisplay').scrollTop( $('#LogDisplay').prop("scrollHeight") );
});

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

$("#Next").click(function() {
    if ( !$("#Transcribe").val() ) return;
    res = getGuessResult(PresentString, tsequence[tsequence.length - 1]);
    ItemLog = ("<p>Change Result: INF " + res[0] + " IF " + IF + " C " + res[1] + "</p>" + ItemLog);
    
    ItemJson["Trial"] = phrasecount;
    ItemJson["Present"] = PresentString;
    ItemJson["IF"] = IF, ItemJson["INF"] = res[0], ItemJson["C"] = res[1];
    ItemJson["CER"] = (IF/(IF+res[1]+res[0])).toFixed(3) 
    ItemJson["UER"] = (res[0]/(IF+res[1]+res[0])).toFixed(3) 
    ItemJson["TER"] = ((IF+res[0])/(IF+res[1]+res[0])).toFixed(3)
    ItemJson["Transcribed"] = tsequence[tsequence.length - 1];
    let ts = ItemJson["Transcribe"]
    ItemJson["Time"] = ts[ts.length-1].TimeStamp - ts[0].TimeStamp;
    AllJson.push(JSON.parse(JSON.stringify(ItemJson)));
    ItemJson = { Transcribe: [], Action: [] };
    
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

function cursor_changed(element) {
    var new_position = getCursorPosition(element);
    if (new_position !== last_position) {
        last_position = new_position;

    }
}

function array_equal(a1, a2) {
    return a1.length == a2.length && a1.every(function(v, i) {
        return v === a2[i]
    });
}

function getCursorPosition(element) {
    var el = $(element).get(0);
    var pos = 0;
    if ('selectionStart' in el) {
        pos = el.selectionStart;
        if (!array_equal(carets[carets.length - 1], [el.selectionStart, el.selectionEnd])) {
            carets.push([el.selectionStart, el.selectionEnd]);
        }
    } else if ('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;

        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
}

//infer the change
//INFER-ACTION implementation
function guessChangeInfo(t1, t2, res) {
    if (t1.length == 0) {
        //console.log('insert from 0');
        return ['insert', 0, t2.length - t1.length];
    } else if (t2.length == 0) {
        //console.log('delete from tail');
        IF += t1.length;
        return ['delete', 0, t1.length];
    }

    var i = 0;
    while (t1[i] == t2[i]) {
        i += 1;
        if (i == t1.length) {
            //console.log('insert at tail');
            return ['insert', t1.length, t2.length - t1.length];
        } else if (i == t2.length) {
            // console.log('delete at tail');
            IF += (t1.length - t2.length);
            return ['delete', t2.length, t1.length];
        }
    }

    var j = 1;
    while (t1[t1.length - j] == t2[t2.length - j]) {
        j += 1;
        if (j == t1.length + 1) {
            // console.log('insert at front');
            return ['insert', 0, t2.length - t1.length];
        } else if (j == t2.length + 1) {
            // console.log('delete at front');
            IF += (t1.length - t2.length);
            return ['delete', 0, t1.length - t2.length];
        }
    }

    if (i + j - 1 >= t1.length) {
        if (t2.length > t1.length) {
            // console.log('insert from ' + i);
            return ['insert', i, t2.length - t1.length]
        } else {
            // console.log('delete from ' + (t1.length-j+1) + ' to ' + (t2.length-j+1));
            IF += (t1.length - t2.length);
            return ['delete', t2.length - j + 1, t1.length - j + 1]
        }
    } else {
        // console.log('substitude from ' + i + ' to ' + (t1.length-j+1));

        if (t2.length <= i + j - 1) {
            IF += (t1.length - t2.length)
            return ['delete', i, i+t1.length-t2.length]
        }
        IF += (t1.length - j + 1 - i);
        return ['replace', i, t1.length - j + 1]
    }
    return ['u', 0, 0];
}

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

//compare the results from two methods and log
function compareNlog(r, t1, t2) {
    reslog = "";
    if (r[0] == 'delete') {
        reslog += ('<p>' + r[0] + ' from ' + r[1] + ' to ' + r[2] + '&#9;<span class="red">' + t1.substring(r[2], r[1])+'</span></p>');
    } else if (r[0] == 'insert') {
        reslog += ('<p>' + r[0] + ' from ' + r[1] + ' count ' + r[2] + '&#9;<span class="green">' + t2.substr(r[1], r[2]) + '</span></p>');
    } else {
        reslog += ('<p>' + r[0] + ' from ' + r[1] + ' to ' + r[2] + '&#9;<span class="blue">' + t2.substr(r[1], r[2]) + '</span></p>');
    }
    return reslog;
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

//following are align functions 
function getIFc(oldVal, PresentString, start, end){
    	strs = ENWalignment(oldVal, PresentString)
        
        let pos1 = -1, pos2 = strs[0].length, cnt = -1
        for (var i = 0; i < strs[0].length; ++i){
        	if (strs[0][i] != '-')
            	cnt += 1
            if (cnt == start && pos1 == -1) pos1 = i 
            if (cnt+1 == end && pos2 == strs[0].length) pos2 = i 
        }
    let correct = strs[1].substring(pos1, pos2+1).split('-').join("");
    if (start > pos1)
        correct = '';
    return [strs[0], strs[1], strs[2], correct]
}

function zeros(shape) {
    var retval = []
    for (var i = 0; i < shape[0]; ++i) {
        retval[i] = [];
        for (var j = 0; j < shape[1]; ++j)
            retval[i][j] = 0;
    }
    return retval
}

var match_award = 3
var mismatch_penalty = -2
var gap_penalty = -2

var gap_penalty_open = -2
var gap_penalty_expand = -1

function match_score(alpha, beta) {
    if (alpha == beta) {
        return match_award
    } else if (alpha == '-' || beta == '-') {
        return gap_penalty
    } else return mismatch_penalty
}

function reverse(s) {
    return s.split("").reverse().join("");
}

function finalize(align1, align2) {
    align1 = reverse(align1)
    align2 = reverse(align2)

    let i = 0,
        j = 0;

    let symbol = '',
        identity = 0

    for (; i < Math.min(align1.length, align2.length); ++i) {
        if (align1[i] == align2[i]) {
            symbol += align1[i]
            identity = identity + 1
        } else {
            symbol += '-'
        }
    }

//    console.log("a1: %c" + align1, "color: #9e42f4")
//    console.log("sb: " + symbol )
//    console.log("a2: %c" + align2, "color: #9e42f4")
    
    return [align1, symbol, align2]
}

//Extended Needleman-Wunsch alignment algorithm
//for determining IFc and IFe
function ENWalignment(seq1, seq2) {
    let m = seq1.length,
        n = seq2.length
    let score = zeros([m + 1, n + 1])
    let gaps = zeros([m + 1, n + 1])

    let i = 0,
        j = 0
    for (i = 0; i < m; ++i){
        gaps[i][0] = (gap_penalty_open - gap_penalty_expand)
    }
    for (j = 0; j < n; ++j){
        gaps[0][j] = (gap_penalty_open - gap_penalty_expand)
    }
    for (i = 1; i < m + 1; ++i) {
        for (j = 1; j < n + 1; ++j) {
            let delete_new = score[i - 1][j] + gap_penalty_open
            let delete_old = gaps[i - 1][j] + gap_penalty_expand
            let insert_new = score[i][j - 1] + gap_penalty_open
            let insert_old = gaps[i][j - 1] + gap_penalty_expand
            gaps[i][j] = Math.max(delete_new, delete_old, insert_new, insert_old)
            
            let match = score[i - 1][j - 1] + match_score(seq1[i - 1], seq2[j - 1])
            let gap = gaps[i - 1][j - 1] + match_score(seq1[i - 1], seq2[j - 1])
            score[i][j] = Math.max(match, gap)
            
        }
    }
    let max_score = 0
    let align1 = '',
        align2 = ''
    let max_i = 0,
        max_j = 0
    for (i = 0; i < m + 1; ++i)
        if (score[i][n] > max_score) {
            max_score = score[i][n]
            max_i = i
            max_j = n
        }

    for (j = 0; j < n + 1; ++j)
        if (score[m][j] > max_score) {
            max_score = score[m][j]
            max_i = m
            max_j = j
        }

    i = max_i, j = max_j
    let in_extention = false
    while (i > 0 && j > 0) {
        let score_current = score[i][j]
        let gap_current = gaps[i][j]
        let max_current = Math.max(score_current, gap_current)

        let ms = match_score(seq1[i - 1], seq2[j - 1])
            //for score 
        let ss = score[i - 1][j - 1] + ms
        let gs = gaps[i - 1][j - 1] + ms
            //for gaps
        let gg1 = gaps[i - 1][j] + gap_penalty_expand
        let sg1 = score[i - 1][j] + gap_penalty_open

        let gg2 = gaps[i][j - 1] + gap_penalty_expand
        let sg2 = score[i][j - 1] + gap_penalty_open

        if (!in_extention && max_current == score_current && max_current == Math.max(ss, gs)) {
            align1 += seq1[i - 1]
            align2 += seq2[j - 1]
            i -= 1
            j -= 1
            in_extention = false
                //if the next state is in extension:
            if (max_current == gs && gs != ss)
                in_extention = true
        } else if (max_current == Math.max(gg1, sg1)) {
            if (max_current == gg1 && gg1 != sg1)
                in_extention = true
            else
                in_extention = false
            align1 += seq1[i - 1]
            align2 += '-'
            i -= 1
        } else if (max_current == Math.max(gg2, sg2)) {
            if (max_current == gg2 && gg2 != sg2)
                in_extention = true
            else
                in_extention = false
            align1 += '-'
            align2 += seq2[j - 1]
            j -= 1
        }
    }

    while (i > 0) {
        align1 += seq1[i - 1]
        align2 += '-'
        i -= 1
    }
    while (j > 0) {
        align1 += '-'
        align2 += seq2[j - 1]
        j -= 1
    }
//    console.log(align1, align2);

    return finalize(align1, align2)
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

//helper function for Vega visualization of the result
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
    //TCC: total character change
    //AC: Action counts  DAC: delete action counts  IAC: insert action counts  SAC: substitute action counts
    //ratio
    //UER: Unfixed error rate  CER: corrected error rate  TER: total error rate
    //CPA: character change per action  TPA: transcribe character per action
    //CPC: character change per correct action
    //HIR: human input ratio   MIR: machine input ratio
    //rate
    //AE: action efficiency  CE: correct efficiency  TE: transcribe efficiency
    var csv = "Trial, Seconds, correct_time, entry_time, Tlen, Plen, TCC, IF, INF, C, WPM, TCCPM, AC, DAC, IAC, SAC, UER, CER, TER, CPA, TPA, CPC, CPE, AE, CE, EE, TE, IFc, IFe\n"
    for (var j = 0; j < json.length; ++j){
        let item = json[j]
        let ts = item.Transcribe, actions = item.Action
        if (ts.length == 0) continue;
        let time = (ts[ts.length-1].TimeStamp - ts[0].TimeStamp) / 1000, fix_time = 0, delete_time = 0
        
        let Tlen = ts[ts.length-1].Text.length
        let AC = actions.length, DAC = 0, IAC = 0, SAC = 0
        let TCC = Tlen + item.IF*2
        
        let WPM = (Tlen-ts[0].Text.length) / (time/12), FPM = 0, TCCPM = (TCC -ts[0].Text.length) / (time/12), CPA = TCC / AC, TPA = Tlen / AC
        
        let AE = (TCC - ts[0].Text.length) / time, 
            FE = 0, TE = (Tlen-ts[0].Text.length) / time, IE = 0, IFc = 0
        for (let i = 0; i < actions.length; ++i){
            let action = actions[i]
            if (action[0] == 'replace'){
                SAC += 1
                fix_time += (ts[i].TimeStamp - ts[i-1].TimeStamp)
                IFc += getIFc(ts[i-1].Text, item.Present, action[1], action[2])[3].length
            }                
            else if (action[0] == 'delete'){
                DAC += 1   
                fix_time += (ts[i].TimeStamp - ts[i-1].TimeStamp)
                delete_time += (ts[i].TimeStamp - ts[i-1].TimeStamp)
                let res = getIFc(ts[i-1].Text, item.Present, action[1], action[2])
                IFc += res[3].length
            }                
            else 
                IAC += 1
        }
        
        let FPA = item.IF / Math.max((DAC + SAC), 1)
        let IPA = (Tlen + item.IF) / (IAC + SAC)
        
        fix_time = fix_time / 1000
        let insert_time = time - delete_time / 1000
        
        FPM = (item.IF) / Math.max((fix_time/12), 1e-10)
        FE = item.IF / Math.max(fix_time, 1e-10)
        IE = (Tlen+item.IF-ts[0].Text.length) / insert_time
        
        csv += [j, time, fix_time, insert_time, Tlen, item.Present.length, TCC, item.IF, item.INF, item.C, WPM, TCCPM, AC, DAC, IAC, SAC, item.UER, item.CER, item.TER, CPA, TPA, FPA, IPA, AE, FE, IE, TE, IFc, (item.IF-IFc)].map(function(n){return Number(n).toFixed(2)}).join(',') + '\n'
    }
    return csv    
}

//random shuffle array with a seed
//https://github.com/yixizhang/seed-shuffle/blob/master/index.js
function seedshuffle(array, seed) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    seed = seed || 1;
    let random = function() {
      var x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}
