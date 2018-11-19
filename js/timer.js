function Timer(user,elem){
    this.user = user;
    this.user.sessions = this.loadDataFromStorage();
    console.log("LOADED USER DATA:",this.user)
    this.isRunning = false;
    this.isPaused = false;
    this.isMinimized = false;
    this.interval = null;
    this.totalTime = 0;
    this.runningElem = elem;   

    this.initUI();    
    this.initState();    
}

Timer.prototype.initUI = function(){
    this.timersContainer = document.querySelector('.timers-container');
    if(!this.timersContainer){
        return alert("Please Provide div with class name 'timers-container'");
    }

    this.timerCard = document.createElement('div');
    this.timerCard.className = 'timer-card timer-card-'+ this.user.id;
    this.timerCardHeader = document.createElement('div');
    this.timerCardHeader.className = 'timer-card-header timer-card-header-'+ this.user.id;
    this.timerCardHeader.innerHTML = `
        <span class="timer-card-header-title">${this.user.name} <span class="header-timer-display"></span></span>
        <span class="timer-card-header-close-button btn-close">
            <i class="fa fa-times"></i>
        </span>
        <span class="timer-card-header-minimize-button btn-minimize">
            <i class="fa fa-angle-down"></i>
        </span>`;

    this.timerCardBody = document.createElement('div');
    this.timerCardBody.className = 'timer-card-body timer-card-body-'+ this.user.id;
    this.timerCardBody.innerHTML = `
        <div class="timer-display">00:00:00</div>
        <div class="timer-buttons">
            <button class="btn btn-start"><i class="fa fa-play"></i></button>
            <button class="btn btn-pause"><i class="fa fa-pause"></i></button>
            <button class="btn btn-stop"><i class="fa fa-stop"></i></button>
        </div>`;
    
    this.headerTimerDisplay = this.timerCardHeader.querySelector('.header-timer-display');

    this.startButton = this.timerCardBody.querySelector('.btn-start');
    this.pauseButton = this.timerCardBody.querySelector('.btn-pause');
    this.stopButton = this.timerCardBody.querySelector('.btn-stop');
    this.closeButton = this.timerCardHeader.querySelector('.btn-close');
    this.minimizeButton = this.timerCardHeader.querySelector('.btn-minimize');

    this.timerDisplay = this.timerCardBody.querySelector('.timer-display');
    console.log(this.startButton)
    this.timerCard.appendChild(this.timerCardHeader);
    this.timerCard.appendChild(this.timerCardBody);

    this.timersContainer.appendChild(this.timerCard);

    $('.timer-card-'+this.user.id).draggable();
}
Timer.prototype.initState = function(){


    //Register Event Listeners
    this.startButton.addEventListener('click',this.start.bind(this));
    this.pauseButton.addEventListener('click',this.pause.bind(this));
    this.stopButton.addEventListener('click',this.stop.bind(this));

    this.closeButton.addEventListener('click',function(e){
        this.timerCard.style.display = 'none';
    }.bind(this));
    this.minimizeButton.addEventListener('click',function(e){
        if(this.isMinimized){
            this.timerCardBody.style.display = 'block';
            this.isMinimized = false;
            
        } else {
            this.timerCardBody.style.display = 'none';
            this.isMinimized = true;
        }
        this.renderTime();
    }.bind(this));
}

Timer.prototype.start = function(){
    this.isRunning = true;
    //Update UI Buttons
    this.startButton.style.display = 'none';
    this.pauseButton.style.display = 'inline-block';

    //FIRE EVENT TO UPDATE USER TIMER ICON
    this.runningElem.dispatchEvent(new CustomEvent('runningEvent',{detail:true}));

    //Process Time
    this.interval = setInterval(function(){
        this.totalTime += 1;
        this.renderTime();
    }.bind(this),1000);
}

Timer.prototype.pause = function(){
    this.isRunning = false;
    this.isPaused = true;
    //Update UI Buttons
    this.startButton.style.display = 'inline-block';
    this.pauseButton.style.display = 'none';
    clearInterval(this.interval);
    this.renderTime();
}


Timer.prototype.stop = function(){
    //Update UI Buttons
    this.startButton.style.display = 'inline-block';
    this.pauseButton.style.display = 'none';

    //FIRE EVENT TO UPDATE USER TIMER ICON
    if(this.isRunning || this.isPaused){
        this.runningElem.dispatchEvent(new CustomEvent('runningEvent',{detail:false}));
        this.saveDataToStorage(this.totalTime);
    }

    //Reset Timer and Display
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.interval);    
    this.totalTime = 0;
    this.renderTime();
    
}
Timer.prototype.renderTime = function(){
    const time = this.getTimeString();
    this.timerDisplay.textContent = time;
    if(this.isMinimized){
        this.headerTimerDisplay.textContent = time;
    } else {
        this.headerTimerDisplay.textContent = '';
    }
}

Timer.prototype.show = function(){
    this.timerCard.style.display = 'block';
}
Timer.prototype.hide = function(){
    this.timerCard.style.display = 'none';
}

Timer.prototype.getTimeString = function(){
    const secs = this.totalTime % 60;
    const mins = Math.floor((this.totalTime / 60) % 60);
    const hours = Math.floor((this.totalTime / 3600) % 60);
    const secsString = secs < 10 ? '0'+secs : secs;
    const minsString = mins < 10 ? '0'+mins : mins;
    const hoursString = hours < 10 ? '0'+hours : hours;
    return `${hoursString}:${minsString}:${secsString}`;
}

Timer.prototype.loadDataFromStorage = function(){
    const dataJSON = localStorage.getItem('MediclinicPortalTimer');
    console.log("DATA LOADED: ",dataJSON);
    debugger;
    if(dataJSON){
        const loadedData = JSON.parse(dataJSON);
        const loadedUserData = loadedData.find(function(p){
            return p.id == this.user.id
        });
        console.log("LOADED: ",loadedUserData);
        return loadedUserData.sessions;
    } else {
        return [];
    }
}

Timer.prototype.saveDataToStorage = function(totalTime){   
    const allUserDataJSON = localStorage.getItem('MediclinicPortalTimer');
    if(allUserDataJSON){
        
    } else {
        const allUserData = [];
        allUserData.push(this.user);
    }

    let currentUserData = allUserData.find(function(u){
        return u.id == this.user.id;
    });

    if(!currentUserData){
        currentUserData = [];
    }
    currentUserData.sessions.unshift({date:new Date(),duration:totalTime});

}





