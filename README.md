# Obsidian Workout Plugin

This plugin is an exercise management plugin.
Edit the JSON file and write your own routine.
It creates a plan for each date based on your routine.

**How to use**

## JSON file edit

```json
{

"name": "TEMP ROUTINE", / enter the name of routine./
"workoutList": [
{
"workoutName": "SQUAT", /enter the name of workout/
"type": "WEIGHT", /type section, enter either 'WEIGHT' or 'BODYWEIGHT'/
"trainingWeight": 0, /enter the weight to start exercising
It can be set later, so it is recommended to enter 0. /
"weight": 0, /Please enter the weight
It can be set later, so it is recommended to enter 0./
"reps": 0 / Please enter the weight
It can be set later, so it is recommended to enter 0.
},
{
"workoutName": "BENCH PRESS",
"type": "WEIGHT",
"trainingWeight": 0,
"weight": 0,
"reps": 0,
},
],
"session": / This is the part where you set up a routine based on the workoutLists./[

{
"sessionname": "Volume Day" /enter the name of session/,
"workoutname": ["SQUAT", "BENCH PRESS", "DEADLIFT"] /
This is the part where you create a list of exercises to include in your routine./ ,
"reps": [5, 5, 5] /This is the part where you enter how many times you want to perform the index corresponding to the exercise./ ,
"sets": [5, 5, 1],
"weight": ["5RM * 90%", "5RM * 90%", "5RM * 90%"]
} => 이러한 부분은 ,


{
"sessionname": "Light/Recovery Day",
"workoutname": ["SQUAT", "OHP", "CHIN UPS", "BACK EXTENSION"],
"reps": [5, 5, 10, 10],
"sets": [2, 3, 3, 5],
"weight": ["5RM * 72%", "5RM * 72%", "bodyweight", "bodyweight"],
"add": [

[0, 0],

[0, 0],

[2.5, 0],

[2.5, 0]

]

},

{

"sessionname": "Intensity Day",

"workoutname": ["SQUAT", "BENCH PRESS", "POWER CLEAN"],

"reps": [5, 5, 5],

"sets": [1, 1, 3],

"weight": ["5RM * 100%", "5RM * 100%", "5RM * 90%"],

"add": [

[5, 0],

[2.5, 0],

[2.5, 0]

]

},

{

"sessionname": "Volume Day",

"workoutname": ["SQUAT", "OHP", "DEADLIFT"],

"reps": [5, 5, 5],

"sets": [5, 5, 1],

"weight": ["5RM * 90%", "5RM * 90%", "5RM * 90%"],

"add": [

[0, 0],

[0, 0],

[5, 0]

]

},

{

"sessionname": "Light/Recovery Day",

"workoutname": ["SQUAT", "BENCH PRESS", "CHIN UPS", "BACK EXTENSION"],

"reps": [5, 5, 10, 10],

"sets": [2, 3, 3, 5],

"weight": ["5RM * 72%", "5RM * 72%", "bodyweight", "bodyweight"],

"add": [

[0, 0],

[0, 0],

[2.5, 0],

[2.5, 0]

]

},

{

"sessionname": "Intensity Day",

"workoutname": ["SQUAT", "OHP", "POWER CLEAN"],

"reps": [5, 5, 5],

"sets": [1, 1, 3],

"weight": ["5RM * 100%", "5RM * 100%", "5RM * 90%"],

"add": [

[5, 0],

[2.5, 0],

[2.5, 0]

]

}

],

  

"week": [

["SESSION_1", "SESSION_4", "SESSION_1", "SESSION_4", "SESSION_1", "SESSION_4"],

[],

["SESSION_2", "SESSION_5", "SESSION_2", "SESSION_5", "SESSION_2", "SESSION_5"],

[],

["SESSION_3", "SESSION_6", "SESSION_3", "SESSION_6", "SESSION_3", "SESSION_6"],

[],

[]

]

}

```
