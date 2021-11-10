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
var allPhrasesBySpace = [];
var PresentString = "";

//vars related to log
var AllJson = [];
var ItemJson = { Transcribe: [], Action: [] };
var ItemLog = "";
var CurrentJson;
var DefaultName = "TextTest"

//logic vars
var Started = false;

// MUC vars for restricting typing speed
let timeout = null;

$('.ui.accordion')
   .accordion()
 ;

 $.ajax({
     url:'phrases.txt',
     success: function (data){
     allphrases = data.split('\n');
     allPhrasesBySpace = data.split(' ');
 //    allPhrasesBySpace = allPhrasesBySpace.split('\n');
 //    console.log(allphrases);
     console.log(allPhrasesBySpace);
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

// ******** MUC WORK - AUTOCOMPLETE - BEGIN ******** //
//var search_terms = ['my watch fell in the water', 'prevailing wind from the east', 'never too rich and never too thin', 'breathing is difficult', 'I can see the rings on Saturn', 'physics and chemistry are hard', 'my bank account is overdrawn', 'elections bring out the best', 'we are having spaghetti', 'time to go shopping', 'a problem with the engine', 'elephants are afraid of mice', 'my favorite place to visit', 'three two one zero blast off', 'my favorite subject is psychology', 'circumstances are unacceptable', 'watch out for low flying objects', 'if at first you do not succeed', 'please provide your date of birth', 'we run the risk of failure', 'prayer in schools offends some', 'he is just like everyone else', 'great disturbance in the force', 'love means many things', 'you must be getting old', 'the world is a stage', 'can I skate with my sister today', 'neither a borrower nor a lender be', 'one heck of a question', 'question that must be answered', 'beware the ides of March', 'double double toil and trouble', 'the power of denial', 'I agree with you', 'do not say anything', 'play it again Sam', 'the Force is with you', 'you are not a Jedi yet', 'an offer you cannot refuse', 'are you talking to me', 'yes you are very smart', 'all work and no play', 'hair gel is very greasy', 'Valium in the economy size', 'the facts get in the way', 'the dreamers of dreams', 'did you have a good time', 'space is a high priority', 'you are a wonderful example', 'do not squander your time', 'do not drink too much', 'take a coffee break', 'popularity is desired by all', 'the music is better than it sounds', 'starlight and dewdrop', 'the living is easy', 'fish are jumping', 'the cotton is high', 'drove my Chevy to the levee', 'but the levee was dry', 'I took the rover from the shop', 'movie about a nutty professor', 'come and see our new car', 'coming up with killer sound bites', 'I am going to a music lesson', 'the opposing team is over there', 'soon we will return from the city', 'I am wearing a tie and a jacket', 'the quick brown fox jumped', 'all together in one big pile', 'wear a crown with many jewels', 'there will be some fog tonight', 'I am allergic to bees and peanuts', 'he is still on our team', 'the Dow Jones index has risen', 'my preferred treat is chocolate', 'the king sends you to the tower', 'we are subjects and must obey', 'mom made her a turtleneck', 'Goldilocks and the three bears', 'we went grocery shopping', 'the assignment is due today', 'what you see is what you get', 'for your information only', 'a quarter of a century', 'the store will close at ten', 'head shoulders knees and toes', 'vanilla flavored ice cream', 'frequently asked questions', 'round robin scheduling', 'information super highway', 'my favorite web browser', 'the laser printer is jammed', 'all good boys deserve fudge', 'the second largest country', 'call for more details', 'just in time for the party', 'have a good weekend', 'video camera with a zoom lens', 'what a monkey sees a monkey will do', 'that is very unfortunate', 'the back yard of our house', 'this is a very good idea', 'reading week is just about here', 'our fax number has changed', 'thank you for your help', 'no exchange without a bill', 'the early bird gets the worm', 'buckle up for safety', 'this is too much to handle', 'protect your environment', 'world population is growing', 'the library is closed today', 'Mary had a little lamb', 'teaching services will help', 'we accept personal checks', 'this is a non profit organization', 'user friendly interface', 'healthy food is good for you', 'hands on experience with a job', 'this watch is too expensive', 'the postal service is very slow', 'communicate through email', 'the capitol of our nation', 'travel at the speed of light', 'I do not fully agree with you', 'gas bills are sent monthly', 'earthquakes are predictable', 'life is but a dream', 'take it to the recycling depot', 'sent this by registered mail', 'fall is my favorite season', 'a fox is a very smart animal', 'the kids are very excited', 'parking lot is full of trucks', 'my bike has a flat tire', 'do not walk too quickly', 'a duck quacks to ask for food', 'limited warranty of two years', 'the four seasons will come', 'the sun rises in the east', 'it is very windy today', 'do not worry about this', 'dashing through the snow', 'want to join us for lunch', 'stay away from strangers', 'accompanied by an adult', 'see you later alligator', 'make my day you sucker', 'I can play much better now', 'she wears too much makeup', 'my bare face in the wind', 'Batman wears a cape', 'I hate baking pies', 'Lydia wants to go home', 'win first prize in the contest', 'Freud wrote of the ego', 'I do not care if you do that', 'always cover all the bases', 'nobody cares anymore', 'can we play cards tonight', 'get rid of that immediately', 'I watched blazing saddles', 'the sum of the parts', 'they love to yap about nothing', 'peek out the window', 'be home before midnight', 'he played a hero in that movie', 'I skimmed through your proposal', 'he was wearing a sweatshirt', 'no more war no more bloodshed', 'toss the ball around', 'I will meet you at noon', 'I want to hold your hand', 'the children are playing', 'Superman never wore a mask', 'I listen to the tape every day', 'he is shouting loudly', 'correct your diction immediately', 'seasoned golfers love the game', 'he cooled off after she left', 'my dog sheds his hair', 'join us on the patio', 'these cookies are so amazing', 'I can still feel your presence', 'the dog will bite you', 'a most ridiculous thing', 'where did you get that tie', 'what a lovely red jacket', 'do you like to shop on Sunday', 'I spilled coffee on the carpet', 'the largest of the five oceans', 'shall we play a round of cards', 'Olympic athletes use drugs', 'my mother makes good cookies', 'do a good deed to someone', 'quick there is someone knocking', 'flashing red light means stop', 'sprawling subdivisions are bad', 'where did I leave my glasses', 'on the way to the cottage', 'a lot of chlorine in the water', 'do not drink the water', 'my car always breaks in the winter', 'Santa Claus got stuck', 'public transit is much faster', 'zero in on the facts', 'make up a few more phrases', 'my fingers are very cold', 'rain rain go away', 'bad for the environment', 'universities are too expensive', 'the price of gas is high', 'the winner of the race', 'we drive on parkways', 'we park in driveways', 'go out for some pizza and beer', 'effort is what it will take', 'where can my little dog be', 'if you were not so stupid', 'not quite so smart as you think', 'do you like to go camping', 'this person is a disaster', 'the imagination of the nation', 'universally understood to be wrong', 'listen to five hours of opera', 'an occasional taste of chocolate', 'victims deserve more redress', 'the protesters blocked all traffic', 'the acceptance speech was boring', 'work hard to reach the summit', 'a little encouragement is needed', 'stiff penalty for staying out late', 'the pen is mightier than the sword', 'exceed the maximum speed limit', 'in sharp contrast to your words', 'this leather jacket is too warm', 'consequences of a wrong turn', 'this mission statement is baloney', 'you will lose your voice', 'every apple from every tree', 'are you sure you want this', 'the fourth edition was better', 'this system of taxation', 'beautiful paintings in the gallery', 'a yard is almost as long as a meter', 'we missed your birthday', 'coalition governments never work', 'destruction of the rain forest', 'I like to play tennis', 'acutely aware of his good looks', 'you want to eat your cake', 'machinery is too complicated', 'a glance in the right direction', 'I just cannot figure this out', 'please follow the guidelines', 'an airport is a very busy place', 'mystery of the lost lagoon', 'is there any indication of this', 'the chamber makes important decisions', 'this phenomenon will never occur', 'obligations must be met first', 'valid until the end of the year', 'file all complaints in writing', 'tickets are very expensive', 'a picture is worth many words', 'this camera takes nice photographs', 'it looks like a shack', 'the dog buried the bone', 'the daring young man', 'this equation is too complicated', 'express delivery is very fast', 'I will put on my glasses', 'a touchdown in the last minute', 'the treasury department is broke', 'a good response to the question', 'well connected with people', 'the bathroom is good for reading', 'the generation gap gets wider', 'chemical spill took forever', 'prepare for the exam in advance', 'interesting observation was made', 'bank transaction was not registered', 'your etiquette needs some work', 'we better investigate this', 'stability of the nation', 'house with new electrical panel', 'our silver anniversary is coming', 'the presidential suite is very busy', 'the punishment should fit the crime', 'sharp cheese keeps the mind sharp', 'the registration period is over', 'you have my sympathy', 'the objective of the exercise', 'historic meeting without a result', 'very reluctant to enter', 'good at addition and subtraction', 'six daughters and seven sons', 'a thoroughly disgusting thing to say', 'sign the withdrawal slip', 'relations are very strained', 'the minimum amount of time', 'a very traditional way to dress', 'the aspirations of a nation', 'medieval times were very hard', 'a security force of eight thousand', 'there are winners and losers', 'the voters turfed him out', 'pay off a mortgage for a house', 'the collapse of the Roman Empire', 'did you see that spectacular explosion', 'keep receipts for all your expenses', 'the assault took six months', 'get your priorities in order', 'traveling requires a lot of fuel', 'longer than a football field', 'a good joke deserves a good laugh', 'the union will go on strike', 'never mix religion and politics', 'interactions between men and women', 'where did you get such a silly idea', 'it should be sunny tomorrow', 'a psychiatrist will help you', 'you should visit a doctor', 'you must make an appointment', 'the fax machine is broken', 'players must know all the rules', 'a dog is the best friend of a man', 'would you like to come to my house', 'February has an extra day', 'do not feel too bad about it', 'this library has many books', 'construction makes traveling difficult', 'he called seven times', 'that is a very odd question', 'a feeling of complete exasperation', 'we must redouble our efforts', 'no kissing in the library', 'that agreement is rife with problems', 'vote according to your conscience', 'my favorite sport is racketball', 'sad to hear that news', 'the gun discharged by accident', 'one of the poorest nations', 'the algorithm is too complicated', 'your presentation was inspiring', 'that land is owned by the government', 'burglars never leave their business card', 'the fire blazed all weekend', 'if diplomacy does not work', 'please keep this confidential', 'the rationale behind the decision', 'the cat has a pleasant temperament', 'our housekeeper does a thorough job', 'Her Majesty visited our country', 'handicapped persons need consideration', 'these barracks are big enough', 'sing the gospel and the blues', 'he underwent triple bypass surgery', 'the ropes of a new organization', 'peering through a small hole', 'rapidly running short on words', 'it is difficult to concentrate', 'give me one spoonful of coffee', 'two or three cups of coffee', 'just like it says on the canned good', 'companies announce a merger', 'electric cars need big fuel cells', 'the plug does not fit the socket', 'drugs should be avoided', 'the most beautiful sunset', 'we dine out on the weekends', 'get aboard the ship is leaving', 'the water was monitored daily', 'he watched in astonishment', 'a big scratch on the tabletop', 'salesmen must make their monthly quota', 'saving that child was a heroic effort', 'granite is the hardest of all rocks', 'bring the offenders to justice', 'every Saturday he folds the laundry', 'careless driving results in a fine', 'microscopes make small things look big', 'a coupon for a free sample', 'fine but only in moderation', 'a subject one can really enjoy', 'important for political parties', 'that sticker needs to be validated', 'the fire raged for an entire month', 'one never takes too many precautions', 'we have enough witnesses', 'labor unions know how to organize', 'people blow their own horn a lot', 'a correction had to be published', 'I like baroque and classical music', 'the proprietor was unavailable', 'be discreet about your meeting', 'meet tomorrow in the lavatory', 'suburbs are sprawling everywhere', 'shivering is one way to keep warm', 'dolphins leap high out of the water', 'try to enjoy your maternity leave', 'the ventilation system is broken', 'dinosaurs have been extinct for ages', 'an inefficient way to heat a house', 'the bus was very crowded', 'an injustice is committed every day', 'the coronation was very exciting', 'look in the syllabus for the course', 'rectangular objects have four sides', 'prescription drugs require a note', 'the insulation is not working', 'nothing finer than discovering a treasure', 'our life expectancy has increased', 'the cream rises to the top', 'the high waves will swamp us', 'the treasurer must balance her books', 'completely sold out of that', 'the location of the crime', 'the chancellor was very boring', 'the accident scene is a shrine for fans', 'a tumor is okay provided it is benign', 'please take a bath this month', 'rent is paid at the beginning of the month', 'for murder you get a long prison sentence', 'a much higher risk of getting cancer', 'quit while you are ahead', 'knee bone is connected to the thigh bone', 'safe to walk the streets in the evening', 'luckily my wallet was found', 'one hour is allotted for questions', 'so you think you deserve a raise', 'they watched the entire movie', 'good jobs for those with education', 'jumping right out of the water', 'the trains are always late', 'sit at the front of the bus', 'do you prefer a window seat', 'the food at this restaurant', 'Canada has ten provinces', 'Canada has three territories', 'the elevator door appears to be stuck', 'raindrops keep falling on my head', 'spill coffee on the carpet', 'an excellent way to communicate', 'with each step forward', 'faster than a speeding bullet', 'wishful thinking is fine', 'nothing wrong with his style', 'arguing with the boss is futile', 'taking the train is usually faster', 'what goes up must come down', 'be persistent to win a strike', 'presidents drive expensive cars', 'the stock exchange dipped', 'why do you ask silly questions', 'that is a very nasty cut', 'what to do when the oil runs dry', 'learn to walk before you run', 'insurance is important for bad drivers', 'traveling to conferences is fun', 'do you get nervous when you speak', 'pumping brakes when roads are slippery', 'parking tickets can be challenged', 'apartments are too expensive', 'find a nearby parking spot', 'gun powder must be handled with care', 'just what the doctor ordered', 'a rattle snake is very poisonous', 'weeping willows are found near water', 'I cannot believe I ate the whole thing', 'the biggest hamburger I have ever seen', 'gamblers eventually lose their shirts', 'exercise is good for the mind', 'irregular verbs are the hardest to learn', 'they might find your comment offensive', 'tell a lie and your nose will grow', 'lie detector tests never work', 'do not lie in court or else', 'most judges are very honest', 'only an idiot would lie in court', 'important news always seems to be late', 'please try to be home before midnight', 'if you come home late the doors are locked', 'dormitory doors are locked at midnight', 'staying up all night is a bad idea', 'you are an ardent capitalist', 'motivational seminars make me sick', 'questioning the wisdom of the courts', 'rejection letters are discouraging', 'the first time he tried to swim', 'that referendum asked a silly question', 'a steep learning curve in riding a unicycle', 'a good stimulus deserves a good response', 'everybody loses in custody battles', 'put garbage in an abandoned mine', 'employee recruitment takes a lot of effort', 'experience is hard to come by', 'everyone wants to win the lottery', 'the picket line gives me the chills'];
var search_terms = ['my', 'watch', 'fell', 'in', 'the', 'water', 'prevailing'];
//var search_terms = allPhrasesBySpace;

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
              b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      } else if (e.keyCode == 9) {
        /*If the TAB key is pressed, prevent the page from moving to next element,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}
/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

autocomplete(document.getElementById("Transcribe"), search_terms);

// ******** MUC WORK - AUTOCOMPLETE - END ******** //

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
        strs = getIFc(oldVal, PresentString, res[1], res[1]+res[2])
    	log += ('<p>T   : <span class="purple">'+strs[0]+'</span></p><p>P   : <span class="purple">'+strs[2]+'</span></p><p>Same: '+strs[1]+'</p>');

        log += '<p>Removed but correct: '+ strs[3] + ' (IFc: ' + strs[3].length + ')</p>';
    }

	oldVal = currentVal;
    tsequence.push(currentVal);
    ItemLog += (log + "<br/>");
    $('#LogDisplay').html(ItemLog);
    $('#LogDisplay').scrollTop( $('#LogDisplay').prop("scrollHeight") );

    //** MUC WORK HERE **//
    //Transcribe

    var disabled = false;
    timeOutInMil = null;

    window.addEventListener('keydown', function(e) {
        if(e.keyCode == 32 && e.target == document.body) {
          e.preventDefault();
        }
      });

    function saveDelay() {
        timeOutInMil = document.getElementById("DelayTime").value
        console.log("delay time set to:", timeOutInMil)
        document.getElementById("DisplayDelayTime").innerHTML = timeOutInMil
    }
    document.getElementById("SaveDelayButton").addEventListener("click", saveDelay);
    timeOutInMil = parseInt(document.getElementById("DisplayDelayTime").innerHTML)

    if (!disabled) {
        $("#Transcribe").prop('disabled', true);		// if not disabled, disable
        document.getElementById("DisableStatus").innerHTML = "Disabled";
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            $("#Transcribe").prop('disabled', false);		// re-enable
            document.getElementById("DisableStatus").innerHTML = "Enabled";
            $("#Transcribe").focus();		                // focus the cursor back on text field
        }, timeOutInMil);
    }
});

// sleep function to delay execution of the thread - TO DELETE
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

$("#Transcribe").keypress(function(){
    var key = window.event.keyCode;

    console.log(event.key);     // ************* MUC for debugging, DELETE LATER *************

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
// return [action, startpos, action_length]
function guessChangeInfo(t1, t2) {
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
            return ['delete', t2.length, t1.length-t2.length];
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
            return ['delete', t2.length - j + 1, (t1.length - t2.length)]
        }
    } else {
        // console.log('substitude from ' + i + ' to ' + (t1.length-j+1));

        if (t2.length <= i + j - 1) {
            IF += (t1.length - t2.length)
            return ['delete', i, (t1.length - t2.length)]
        }
        IF += (t1.length - j + 1 - i);
        return ['replace', i, (t1.length - j + 1 - i)]
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
        reslog += ('<p>' + r[0] + ' from ' +  (r[1]+r[2]) + 'to ' + r[1] + '&#9;<span class="red">' + t1.substring(r[1], r[1]+r[2])+'</span></p>');
    } else if (r[0] == 'insert') {
        reslog += ('<p>' + r[0] + ' from ' + r[1] + ' count ' + r[2] + '&#9;<span class="green">' + t2.substr(r[1], r[2]) + '</span></p>');
    } else {
        reslog += ('<p>' + r[0] + ' from ' + r[1] + ' to ' + (r[1]+r[2]) + '&#9;<span class="blue">' + t2.substr(r[1], r[1]+r[2]) + '</span></p>');
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
                let res = getIFc(ts[i-1].Text, item.Present, action[1], action[1]+action[2])
                IFc += res[3].length
            }
            else if (action[0] == 'delete'){
                DAC += 1
                fix_time += (ts[i].TimeStamp - ts[i-1].TimeStamp)
                delete_time += (ts[i].TimeStamp - ts[i-1].TimeStamp)
                let res = getIFc(ts[i-1].Text, item.Present, action[1], action[1]+action[2])
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
