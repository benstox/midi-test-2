// https://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/

// variables from the tutorial
var log = console.log.bind(console);
var keyData = $('#key_data');
var deviceInfoInputs = $('#inputs');
var deviceInfoOutputs = $('#outputs');
var midi;
var AudioContext = AudioContext || webkitAudioContext; // for ios/safari
var context = new AudioContext();
var activeNotes = [];
var btnBox = $('#content');
var btn = $('.button');
var data;
var cmd;
var channel;
var type;
var note;
var velocity;

var melody_timeouts = [];

// set up the instrument
var instrument = "celesta-mp3";
var notes = _.mapValues({
    z: {name: "G3"},
    a: {name: "A3"},
    B: {name: "Bb3"},
    b: {name: "B3"},
    c: {name: "C4"},
    D: {name: "Db4"},
    d: {name: "D4"},
    E: {name: "Eb4"},
    e: {name: "E4"},
    f: {name: "F4"},
    G: {name: "Gb4"},
    g: {name: "G4"},
    H: {name: "Ab4"},
    h: {name: "A4"},
    I: {name: "Bb4"},
    i: {name: "B4"},
    j: {name: "C5"},
    K: {name: "Db5"},
    k: {name: "D5"},
    l: {name: "E5"},
    m: {name: "F5"},
    n: {name: "G5"},
    o: {name: "A5"},
    p: {name: "B5"}}, function(v) {
        return(_.set(v, "source", "midi/audio/" + instrument + "/" + v.name + ".mp3"));
    }
);
var melody_speed = 1.1;
var markov_order = 4;

var processed_melodies = load_melody_data(MODES[randInt(1, 9)], markov_order);

// user interaction --------------------------------------------------------------
var clickPlayOn = function(e) {
    
};

var clickPlayOff = function(e) {
    play_markov_melody();
};

var clickStopOn = function(e) {
    
};

var clickStopOff = function(e) {
    stop_music();
};

var keyController = function(e) {
    if(e.type == "keydown") {
        switch(e.keyCode) {
            case 81:
                $("#play-button").addClass('active');
                play_markov_melody();
                break;
            case 87:
                $("#stop-button").addClass('active');
                stop_music();
                break;  
            default:
                //console.log(e);
        };
    } else if(e.type == "keyup") {
        switch(e.keyCode) {
            case 81:
                $("#play-button").removeClass('active');
                break;
            case 87:
                $("#stop-button").removeClass('active');
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

    object.stop = function() {
        if(object.s) {
            object.s.stop();
        };
    };
};

var play_markov_melody = function() {
    // get a Markov melody!
    score = generate_markov(processed_melodies, markov_order);
    $("#print-melody").text(score);

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
    var start_time = new Date().getTime();
    var melody_loop = function(i) {
        if (melody[i]) {
            // get the current note from the melody
            var note_to_play = melody[i];
            // play the note!
            notes[note_to_play.shorthand].play(note_to_play.velocity);
            // recur, compensating for lag
            var diff = (new Date().getTime() - start_time) -  note_to_play.position;
            melody_timeouts.push(setTimeout(
                function() {melody_loop(i+1);},
                note_to_play.duration - diff
            ));
        } else {
            // melody over
            // recur the whole play_markov_melody thing
            melody_timeouts.push(setTimeout(
                play_markov_melody,
                2000 * melody_speed
            ));
        };
    };
    // start the loop detailed above
    melody_loop(0);
};

var stop_music = function() {
    _.forEach(notes, function(note) {
        note.stop();
    });
    _.forEach(melody_timeouts, function(timeout_id) {
        clearTimeout(timeout_id);
    });
    melody_timeouts = [];
};

var rangeMap = function(x, a1, a2, b1, b2) {
    return ((x - a1)/(a2-a1)) * (b2 - b1) + b1;
};

var frequencyFromNoteNumber = function(note) {
    return 440 * Math.pow(2,(note-69)/12);
};

var logger = function(container, label, data) {
    messages = label + " [channel: " + (data[0] & 0xf) + ", cmd: " + (data[0] >> 4) + ", type: " + (data[0] & 0xf0) + " , note: " + data[1] + " , velocity: " + data[2] + "]";
    container.textContent = messages;
};

// add event listeners
$(document).ready(function() {
    // request MIDI access
    if(navigator.requestMIDIAccess){
        navigator.requestMIDIAccess({sysex: false}).then(onMIDISuccess, onMIDIFailure);
    }
    else {
        alert("No MIDI support in your browser.");
    }

    // print markov order
    $("#print-markov-order").text(markov_order)

    // prepare audio files
    _.forEach(notes, addAudioProperties);

    $(".play-button").mousedown(clickPlayOn);
    $(".play-button").mouseup(clickPlayOff);
    $(".stop-button").mousedown(clickStopOn);
    $(".stop-button").mouseup(clickStopOff);
});
