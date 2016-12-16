// http://stackoverflow.com/questions/23687635/how-to-stop-audio-in-an-iframe-using-web-audio-api-after-hiding-its-container-di
// https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/

// set up the instrument
var instrument = "celesta-mp3";
var notes = _.mapValues({
    c: {name: "C4"},
    d: {name: "D4"},
    e: {name: "E4"},
    f: {name: "F4"},
    g: {name: "G4"},
    h: {name: "A4"},
    i: {name: "B4"},
    ix: {name: "Bb4"},
    j: {name: "C5"},
    k: {name: "D5"},
    l: {name: "E5"},
    m: {name: "F5"},
    n: {name: "G5"},
    o: {name: "A5"}}, function(v) {
        return(_.set(v, "source", "audio/" + instrument + "/" + v.name + ".mp3"));
    });
var markov_order = 3;
var processed_melodies = load_melody_data(VI, markov_order);

// do stuff from the tutorial
var log = console.log.bind(console), keyData = document.getElementById('key_data'), 
        deviceInfoInputs = document.getElementById('inputs'), deviceInfoOutputs = document.getElementById('outputs'), midi;
var AudioContext = AudioContext || webkitAudioContext; // for ios/safari
var context = new AudioContext();
var activeNotes = [];
var btnBox = document.getElementById('content'), btn = document.getElementsByClassName('button');
var data, cmd, channel, type, note, velocity;

// request MIDI access
if(navigator.requestMIDIAccess){
    navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
}
else {
    alert("No MIDI support in your browser.");
}

// add event listeners
document.addEventListener('keydown', keyController);
document.addEventListener('keyup', keyController);
for(var i = 0; i < btn.length; i++){
    btn[i].addEventListener('mousedown', clickPlayOn);
    btn[i].addEventListener('mouseup', clickPlayOff);   
}

// prepare audio files
_.forEach(notes, addAudioProperties);

var sampleMap = {
    key60: 1,
    key61: 2,
    key62: 3,
    key63: 4,
    key64: 5
};

// user interaction --------------------------------------------------------------
var clickPlayOn = function(e) {
    e.target.classList.add('active');
    // e.target.play();
};

var clickPlayOff = function(e) {
    e.target.classList.remove('active');
};

var keyController = function(e) {
    if(e.type == "keydown") {
        switch(e.keyCode) {
            case 81:
                btn[0].classList.add('active');

                // get a Markov melody!
                score = generate_markov(processed_melodies, markov_order);
                $("#print-melody").text(score);

                // melody = [ // Asperges me
                //     {shorthand: "c", duration: 300},
                //     {shorthand: "d", duration: 300},
                //     {shorthand: "f", duration: 300},
                //     {shorthand: "e", duration: 300},
                //     {shorthand: "d", duration: 325},
                //     {shorthand: "e", duration: 350},
                //     {shorthand: "f", duration: 350},
                //     {shorthand: "g", duration: 1000},
                //     {shorthand: "h", duration: 500},
                //     {shorthand: "ix", duration: 300},
                //     {shorthand: "j", duration: 300},
                //     {shorthand: "j", duration: 300},
                //     {shorthand: "ix", duration: 300},
                //     {shorthand: "h", duration: 300},
                //     {shorthand: "g", duration: 300},
                //     {shorthand: "h", duration: 300},
                //     {shorthand: "g", duration: 750},
                //     {shorthand: "f", duration: 300},
                //     {shorthand: "e", duration: 300},
                //     {shorthand: "f", duration: 350},
                //     {shorthand: "g", duration: 300},
                //     {shorthand: "f", duration: 300},
                //     {shorthand: "d", duration: 300},
                //     {shorthand: "e", duration: 350},
                //     {shorthand: "c", duration: 600},
                //     {shorthand: "d", duration: 600},
                //     {shorthand: "c", duration: 700},
                //     {shorthand: "c", duration: 800}];

                // turn the Markov score into a list of notes and durations
                melody = process_markov_score(score);

                // work out the temporal position of each note in the melody
                // based on cummulative durations
                melody = _.reduce(
                    melody,
                    function (acc, n) {
                        acc.push(
                            _.set(n, "position", (acc.length > 0 ? acc[acc.length-1].position + acc[acc.length-1].duration : 0)));
                        return(acc);
                    }, []);

                // play the melody!!
                _.forEach(
                    melody,
                    function(note_to_play) {
                        console.log(notes[note_to_play.shorthand].source);
                        setTimeout(notes[note_to_play.shorthand].play, note_to_play.position);
                    });
                break;
            case 87:
                btn[1].classList.add('active');
                btn[1].play();
                break;
            case 69:
                btn[2].classList.add('active');
                btn[2].play();
                break;
            case 82:
                btn[3].classList.add('active');
                btn[3].play();
                break;
            case 84:
                btn[4].classList.add('active');
                btn[4].play();
                break;                  
            default:
                //console.log(e);
        };
    } else if(e.type == "keyup") {
        switch(e.keyCode) {
            case 81:
                btn[0].classList.remove('active');
                break;
            case 87:
                btn[1].classList.remove('active');
                break;
            case 69:
                btn[2].classList.remove('active');
                break;
            case 82:
                btn[3].classList.remove('active');
                break;
            case 84:
                btn[4].classList.remove('active');
                break;
            default:
                //console.log(e.keyCode);
        };
    };
};

// midi functions --------------------------------------------------------------
var onMIDISuccess = function(midiAccess) {
    midi = midiAccess;
    var inputs = midi.inputs.values();
    // loop through all inputs
    for(var input = inputs.next(); input && !input.done; input = inputs.next()){
        // listen for midi messages
        input.value.onmidimessage = onMIDIMessage;

        listInputs(input);
    }
    // listen for connect/disconnect message
    midi.onstatechange = onStateChange;

    showMIDIPorts(midi);
};

var onMIDIMessage = function(event) {
    console.log(event);
    data = event.data,
    cmd = data[0] >> 4,
    channel = data[0] & 0xf,
    type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
    note = data[1],
    velocity = data[2];
    // with pressure and tilt off
    // note off: 128, cmd: 8 
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11: 
    // bend: 224, cmd: 14
    log('MIDI data', data);
    switch(type) {
        case 144: // noteOn message 
            noteOn(note, velocity);
            break;
        case 128: // noteOff message 
            noteOff(note, velocity);
            break;
    };
    
    //log('data', data, 'cmd', cmd, 'channel', channel);
    logger(keyData, 'key data', data);
};

var onStateChange = function(event) {
    showMIDIPorts(midi);
    var port = event.port, state = port.state, name = port.name, type = port.type;
    if(type == "input"){
            log("name", name, "port", port, "state", state);}
};

var listInputs = function(inputs) {
    var input = inputs.value;
        log("Input port : [ type:'" + input.type + "' id: '" + input.id + 
                "' manufacturer: '" + input.manufacturer + "' name: '" + input.name + 
                "' version: '" + input.version + "']");
};

var noteOn = function(midiNote, velocity) {
    player(midiNote, velocity);
};

var noteOff = function(midiNote, velocity) {
    player(midiNote, velocity);
};

var player = function(note, velocity) {
    var sample = sampleMap['key'+note];
    if(sample) {
        if(type == (0x80 & 0xf0) || velocity == 0) { // needs to be fixed for QuNexus, which always returns 144
            btn[sample - 1].classList.remove('active');
            return;
        };
        btn[sample - 1].classList.add('active');
        btn[sample - 1].play(velocity);
    };
};

var onMIDIFailure = function(e) {
    log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e);
};

// MIDI utility functions --------------------------------------------------------------
var showMIDIPorts = function(midiAccess) {
    var inputs = midiAccess.inputs,
            outputs = midiAccess.outputs, 
            html;
    html = '<h4>MIDI Inputs:</h4><div class="info">';
    inputs.forEach(function(port){
        html += '<p>' + port.name + '<p>';
        html += '<p class="small">connection: ' + port.connection + '</p>';
        html += '<p class="small">state: ' + port.state + '</p>';
        html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>';
        if(port.version){
            html += '<p class="small">version: ' + port.version + '</p>';
        }
    });
    deviceInfoInputs.innerHTML = html + '</div>';

    html = '<h4>MIDI Outputs:</h4><div class="info">';
    outputs.forEach(function(port){
        html += '<p>' + port.name + '<br>';
        html += '<p class="small">manufacturer: ' + port.manufacturer + '</p>';
        if(port.version){
            html += '<p class="small">version: ' + port.version + '</p>';
        }
    });
    deviceInfoOutputs.innerHTML = html + '</div>';
};

// audio functions --------------------------------------------------------------
var loadAudio = function(object, url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function(){
        context.decodeAudioData(request.response, function(buffer){
            object.buffer = buffer;
        });
    }
    request.send();
};

var addAudioProperties = function(object) {
    // object.name = object.id;
    // object.source = object.dataset.sound;
    loadAudio(object, object.source);
    object.play = function(volume) {
        var s = context.createBufferSource();
        var g = context.createGain();
        var v;
        s.buffer = object.buffer;
        // s.playbackRate.value = randomRange(0.5, 2); // random pitch
        s.playbackRate.value = 1;
        if (volume) {
            v = rangeMap(volume, 1, 127, 0.2, 2);
            s.connect(g);
            g.gain.value = v * v;
            g.connect(context.destination);
        } else {
            s.connect(context.destination); 
        };
        
        s.start();
        object.s = s;
    };
};
