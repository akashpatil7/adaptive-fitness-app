import firebase_admin

from flask import Flask, make_response
from flask import json, request, jsonify
from firebase_admin import credentials, firestore

cred = credentials.Certificate("blackbird-545eb-firebase-adminsdk-mbj63-6dffc14bc3.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
explicit_data = db.collection('explicit-info')
exercise_plans_data = db.collection('exercise_plan')
food_plans_data = db.collection('food_plan')
current_recommendations = db.collection('current_recommendations')
workout_history = db.collection('last_workout')
user_data = db.collection('users')

app = Flask(__name__)

@app.route("/")
def hello_world():
    return make_response("Hello world", 200)

@app.route('/food/getPlans', methods=['POST'])
def enterQuestionaireForm():
    id = request.json['email']

    request_body = request.json
    #explicit_data.document(id).set(request.json)

    #Get the initial diet and workout plan
    data = getInitialPlansForUser(request_body)
    #workoutData = getInitialWorkoutPlansForUser(request_body)

    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response
    
    
@app.route('/workouts/getPlans', methods=['POST'])
def enterWorkoutQuestionaireForm():
    request_body = request.json

    id = request_body['email']

    #Get initial workout plan
    workoutData = getInitialWorkoutPlansForUser(request_body)

    response = app.response_class(
        response=json.dumps(workoutData),
        status=200,
        mimetype='application/json'
    )
    return response
    
    
@app.route('/workouts/makeRecommendations', methods=['POST'])
def updateWorkoutHistory():
    '''
        Example POST request in Postman:
        
        url: http://127.0.0.1:5000/workouts/makeRecommendations
        
        body (raw, JSON): {
                            {
                                "email": "test@test.com",
                                "core" : true,
                                "chest" : false,
                                "legs" : false,
                                "shoulders" : true,
                                "back" : false
                                }
                            }
    '''

    request_body = request.json
    
    id = request_body['email']
    
    # Get current recommendations list and last recorded exercises
    recommendations = current_recommendations.document(id).get()
    history = workout_history.document(id).get()
    
    if history.exists and recommendations.exists:
        history = history.to_dict()
        recommendations = recommendations.to_dict()
        body_parts = ['core', 'back', 'chest', 'legs', 'shoulders']
        
        new_recommendations = {'core':{},
                                'back': {},
                                'chest': {},
                                'legs': {}, 
                                'shoulders': {}}
        
        for body_part in body_parts:
            
            # gets all body part exercise ids from recommendation list
            exercises = recommendations[body_part]['Id']
            print(body_part + " exercises: ", exercises)
            
            # get inidex of latest excercise performed from list of all execises
            workout_index = exercises.index(history[body_part])
            
            if request_body[body_part]:
                
                # get next workout from list by adding to previous index
                new_exercise_index = (workout_index + 1) % len(exercises)
                
                # get next workout recommendations
                new_recommendations[body_part]["Id"] = recommendations[body_part]["Id"][new_exercise_index]
                new_recommendations[body_part]["Name"] = recommendations[body_part]["Name"][new_exercise_index]
                new_recommendations[body_part]["Sets"] = recommendations[body_part]["Sets"][new_exercise_index]
                new_recommendations[body_part]["Reps"] = recommendations[body_part]["Reps"][new_exercise_index]
                new_recommendations[body_part]["Weight"] = recommendations[body_part]["Weight"][new_exercise_index]
                
                # update history with new workouts 'currently doing'
                workout_history.document(id).update({body_part: new_recommendations[body_part]["Id"]})
                
            else:
                print("They didn't do the " + body_part + " exercise")
                # keep recommendation the same as last time
                new_recommendations[body_part]["Id"] = recommendations[body_part]["Id"][workout_index]
                new_recommendations[body_part]["Name"] = recommendations[body_part]["Name"][workout_index]
                new_recommendations[body_part]["Sets"] = recommendations[body_part]["Sets"][workout_index]
                new_recommendations[body_part]["Reps"] = recommendations[body_part]["Reps"][workout_index]
                new_recommendations[body_part]["Weight"] = recommendations[body_part]["Weight"][workout_index]
        
        
    else:
        print(u'User does not have a history or recommendations list!')
        
    
    returnData = new_recommendations
    response = app.response_class(
        response=json.dumps(returnData),
        status=200,
        mimetype='application/json'
    )
    return response


# Get initial workout plans for user 
def getInitialWorkoutPlansForUser(data):
    # get user data
    user_equipment = data['gym_equipment']
    experience_level = data['experience']
    gender = data['gender']
    age = data['age']
    height = data['height']
    weight = data['weight']    

    # get exercise data from DB
    all_levels = [doc.to_dict() for doc in exercise_plans_data.stream()]
        
    # get all exercises for current user level
    exercises_for_user_level = all_levels[experience_level]

    # dictionary to store the exercises the user can do
    exercises = {}
    
    # for each exercise, check that the user has the right equipment. If not, repeat for lower level exercises
    print("\nAll exercises for user level:")
    for key, value in exercises_for_user_level.items():
        print(key, ' : ', value['EquipmentNeeded'])
        exercise_names = []
        exercise_reps = []
        exercise_sets = []
        exercise_weight = []
        weight_increment = []
        exercise_ids = []
        # append body part exercises for user if the user has the equipment 
        for i in range(len(value['EquipmentNeeded'])):
            if value['EquipmentNeeded'][i] in user_equipment or value['EquipmentNeeded'][i] == "NA":
                exercise_ids.append((value["ExerciseID"][i]))
                exercise_names.append(value["ExerciseName"][i])
                exercise_reps.append(value["StartingReps"][i])
                exercise_sets.append(value["StartingSets"][i])
                exercise_weight.append(value["StartingWeight"][i])
                weight_increment.append(value["WeightIncrement "][i]) # ******************** Note the space at the end of the string
                
        exercises[key] = {}
        exercises[key]["Name"] = exercise_names
        exercises[key]["Id"] = exercise_ids
        # if user has no equipment for that body part, repeat with lower level exercise for body part
        if len(exercises[key]["Name"]) == 0:
            exercises[key]["Id"], exercises[key]["Name"], exercises[key]["Reps"], exercises[key]["Sets"], exercises[key]["Weight"], exercises[key]["WeightIncrement"] = getLowerLevelExercise(exercise_ids, key, all_levels, experience_level -1, user_equipment, exercise_names, exercise_reps, exercise_sets, exercise_weight, weight_increment)
        else:
            exercises[key]["Reps"] = exercise_reps
            exercises[key]["Sets"] = exercise_sets
            exercises[key]["Weight"] = exercise_weight
            exercises[key]["WeightIncrement"] = weight_increment
        
    print("\n\nExercies to return to the user:")
    for key, value in exercises.items():
        print(key, ' : ', value)

    id = data['email']
    current_recommendations.document(id).set(exercises)

    final_list_of_workouts = {}
    final_ids_of_workouts = {}
    for key, value in exercises.items():
        final_ids_of_workouts[key] = value["Id"][0]
        body_part = {}
        for item, arrays in value.items():
            body_part[item] = arrays[0]
        final_list_of_workouts[key] = body_part
    print(final_list_of_workouts)

    print(final_ids_of_workouts)
    #user_data.document(id).collection("last_workout").add(final_list_of_workouts)
    workout_history.document(id).set(final_ids_of_workouts)

    return final_list_of_workouts


# Recursive function to get exercises according to level and equipment     
def getLowerLevelExercise(exercise_ids, body_part, all_levels, new_level, user_equipment, exercise_names, exercise_reps, exercise_sets, exercise_weight, weight_increment):
    if new_level < 0:
        return [], [], [], [], [], []
        
    if new_level >= 0:
        # get lower level
        lower_level = all_levels[new_level]

        # append exercises for given body part if the user has the equipment
        for i in range(len(lower_level[body_part]['EquipmentNeeded'])):
            if lower_level[body_part]['EquipmentNeeded'][i] in user_equipment or lower_level[body_part]['EquipmentNeeded'][i] == "NA":
                exercise_ids.append(lower_level[body_part]["ExerciseID"][i])
                exercise_names.append(lower_level[body_part]["ExerciseName"][i])
                exercise_reps.append(lower_level[body_part]["StartingReps"][i])
                exercise_sets.append(lower_level[body_part]["StartingSets"][i])
                exercise_weight.append(lower_level[body_part]["StartingWeight"][i])
                weight_increment.append(lower_level[body_part]["WeightIncrement "][i]) # ******************** Note the space at the end of the string
                
        # if user has no equipment for that body part, repeat with lower level exercise for body part        
        if len(exercise_names) == 0:
            getLowerLevelExercise(exercise_ids, body_part, all_levels, new_level -1, user_equipment, exercise_names, exercise_reps, exercise_sets, exercise_weight, weight_increment)
    return exercise_ids, exercise_names, exercise_reps, exercise_sets, exercise_weight, weight_increment


#Update data for user
def getInitialPlansForUser(data):
    id = data['email']
    bmr = 0
    if data["gender"] == "male":
        bmr = 66.5 + (13.75 * data["weight"]) + (5.003 * data["height"]) - (4.676 * data["age"])
    elif data["gender"] == "female":
        bmr = 655.1 + (9.563 * data["weight"]) + (1.850 * data["height"]) - (4.676 * data["age"])

    if data["activity_level_ratio"] == "sedentary":
        bmr = bmr + 300
    elif data["activity_level_ratio"] == "light":
        bmr = bmr + 600
    elif data["activity_level_ratio"] == "moderate":
        bmr = bmr + 900
    elif data["activity_level_ratio"] == "active":
        bmr = bmr + 1200
    elif data["activity_level_ratio"] == "athlete":
        bmr = bmr + 1500

    weight_goals = data["weight_goals"]
    dietary_restriction = data["dietary_restrictions"]
    plans_ref = food_plans_data.document(weight_goals).collection(dietary_restriction)
    plans_by_diet_restrictions = [doc.to_dict() for doc in plans_ref.stream()]
    #plans_by_diet_restrictions = plans_by_weight_goals[data["dietary_restrictions"]]

    total_cals_in_plans = 0
    total_cals_per_meal = dict()
    for meal in plans_by_diet_restrictions:
        total_cals_in_plans += int(meal["nutrition"]["cal"])
        total_cals_per_meal[meal['meal_id']] = int(meal["nutrition"]["cal"])

    if bmr < total_cals_in_plans:
        data["current_food_plan"] = plans_by_diet_restrictions
        explicit_data.document(id).set(data)
        return plans_by_diet_restrictions
    else:
        extra_calories_needed_per_meal = (bmr - total_cals_in_plans)/3
        new_plan = plans_by_diet_restrictions
        for meal in new_plan:
            for ingredient, val in meal["ingredients"].items():
                new_portion = int(val) * (extra_calories_needed_per_meal / total_cals_per_meal[meal['meal_id']])
                meal["ingredients"][ingredient] = int(val) + new_portion
                #val += int(val) * (extra_calories_needed_per_meal / total_cals_per_meal[meal['meal_id']])
        #data["current_food_plan"] = new_plan
        #explicit_data.document(id).set(data)
        return new_plan

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8005)