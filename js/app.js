patients = [
    {
        id:1,
        name: 'Tyler Durden',
        timer: null,
        event: null,
    },
    {
        id:2,
        name: 'John Smith',
        timer: null,
        event: null,
    },
    {
        id:3,
        name: 'Anthony Sequeira',
        timer: null,
        event: null,
    }
];

$(document).ready(function(){
    //$('.timer-card').draggable();

    const patientList = document.querySelector('.patients-list');

    //REGISTER CLICK LISTENER ON PATIENTS LIST
    patientList.addEventListener('click',function(e){
        if(e.target.parentElement.classList.contains('patients-list-item')){
            const clickedLI = e.target.parentElement;
            const clickedId = clickedLI.getAttribute('data-id');
            const clickedPatient = patients.find(function(patient){
                return patient.id == clickedId
            });
            if(!clickedPatient.timer){
                clickedPatient.timer = new Timer({
                    id: clickedPatient.id,
                    name: clickedPatient.name,
                    sessions: clickedPatient.sessions
                },clickedLI);
                console.log("EVENT:",clickedPatient.timer)
                clickedLI.addEventListener('runningEvent',function(e){
                    console.log("TIMER RUNNING : ",e.detail)
                    const stopWatch = clickedLI.querySelector('.icon-stopwatch');
                    if(e.detail){
                        stopWatch.style.display = 'inline-block';
                        stopWatch.classList.add('blink');

                    } else {
                        clickedLI.querySelector('.icon-stopwatch').style.display = 'none';
                    }
                });
            } else {
                clickedPatient.timer.show();
            }

            //console.log(clickedPatient);
        }
    });


    //POPULATE PATIENTS LIST
    patients.forEach(patient => {
        const li = document.createElement('li');
        li.className = 'patients-list-item';
        li.setAttribute('data-id',patient.id);
        const stopWatch = document.createElement('i');
        stopWatch.className = 'fa fa-stopwatch icon-stopwatch';
        stopWatch.style.display = 'none';
        const link = document.createElement('a');
        link.setAttribute('href','#');
        link.textContent = patient.name;
        
        
        li.appendChild(link);
        li.appendChild(stopWatch);
        patientList.appendChild(li);
    });
});