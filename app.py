import firebase_admin
from flask import Flask, make_response, jsonify
from flask import json, request
from firebase_admin import credentials, firestore

cred = credentials.Certificate("blackbird-545eb-firebase-adminsdk-mbj63-6dffc14bc3.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
explicit_data = db.collection('explicit-info')
exercise_plans_data = db.collection('exercise_plan')
food_plans_data = db.collection('food_plan')

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

    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )
    return response

#Show workout plans for user

#Show diet plans for user


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