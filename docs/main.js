const img_array = new Promise((resolve, reject) => {
    $.getJSON("imgs.json", json => resolve(json));
});

document.addEventListener('keyup', doc_keyUp, false);


// Vars to follow score
var correct_ans;
var hist = [];
var wait = false;
var current_id;
var hist_int = 0;

function load_img(image_id) {
    new Promise((resolve, reject) => {
        let url = 'imgs/' + image_id + '.jpg';
        let img = new Image();
        img.addEventListener('load', e => resolve(img));
        img.addEventListener('error', () => {
          reject(new Error(`Failed to load image's URL: ${url}`));
        });
        img.src = url;
        img.id = 'image-holder';
    })
    .then(img => document.getElementById('image-holder').replaceWith(img))
    .catch(error => console.error(error));
}

function new_question() {
    get_random_img_id_promise().then(img => {
        load_img(img.image_id);
        correct_ans = img.ans;
        current_id = img.image_id;    
    });

}

function get_random_img_id_promise() {
    return img_array.then(function(value){
        return value[Math.floor(Math.random()*value.length)];
    });
}

function set_buttons(correct, clicked) {
    document.getElementById(correct).setAttribute("class", "button button_right");
        if (clicked != correct) {
            document.getElementById(clicked).setAttribute("class", "button button_wrong");
        }
}

function reset_buttons() {
    let c = document.getElementById("buttons").children;
    for (let i = 0; i < c.length; i++) {
        c[i].className = "button";
    }
}

function button_click(clicked_id) {
    if (!wait) {
        wait = true;
        hist.push({id:current_id, answer:clicked_id, correct_ans:correct_ans});
        
        set_buttons(correct_ans, clicked_id);

            // Show stats
        let stats_correct = 0;
        hist.forEach(element => {
            if (element.answer == element.correct_ans) stats_correct++;
        });
        document.getElementById('stats').textContent = 
        `${stats_correct}/${hist.length} (${(stats_correct*100/hist.length).toFixed(1)} %)`;

        setTimeout(function(){
            reset_buttons();
            wait = false;
            new_question();
        }, 1000);
    }

}

function show_hist(i) {
    let hist_i = hist[hist.length-i];
    load_img(hist_i.id);
    reset_buttons();
    set_buttons(hist_i.correct_ans, hist_i.answer);
    wait = true;
}

function show_current() {
    hist_int = 0;
    reset_buttons();
    load_img(current_id);
    wait = false;
}

function nav_click(clicked_id) {
    if (hist.length > 0) {
        if (clicked_id == 'back' & hist_int < hist.length) {
            show_hist(++hist_int);
        }
        
        if (clicked_id == 'forward') {
            if (hist_int > 1) {
                show_hist(--hist_int);
            } else {
                show_current();
            }
        }
        
        if (clicked_id == 'current') {
            show_current();
        }
    }

}    

function doc_keyUp(e) {
    if (e.key == '1') {
        button_click('nev');
    }
    else if (e.key == '2') {
        button_click('mel');
    }
    else if (e.key == '3') {
        button_click('seb');
    }
    else if (e.key == 'ArrowLeft') {
        nav_click('back');
    }
    else if (e.key == 'ArrowRight') {
        nav_click('forward');
    }
}

function app() {
    new_question();
}